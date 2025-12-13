/**
 * Copilot Agent Loop
 *
 * Main agentic loop where the LLM decides what tools to call
 * to help the user build their ideation canvas.
 *
 * MULTI-TURN ARCHITECTURE:
 * This loop continues calling Gemini until the AI is done making decisions.
 * Tool results are fed back so the AI can see research results and create notes.
 */

import { Content, Part, FunctionCall, FunctionCallingConfigMode } from '@google/genai';
import { getAIClient } from '../aiClient';
import { MessageRole } from '@/types';
import { IdeationSession } from '@/types/ideation';
import { COPILOT_TOOLS } from '@/lib/copilotTools';
import { buildFullPrompt } from '@/lib/copilotPrompts';
import { performGrokResearch, hasGrokApiKey } from '../grokService';
import { getTextModel } from '@/config';
import { performResearch } from './researchHelpers';
import {
  AgentResponse,
  ProcessedToolCall,
  ToolExecutor,
  AgentLoopOptions,
  CompletionQuestion,
} from './types';
import {
  generateCompletionQuestion,
  summarizeToolCalls,
  checkCanvasCompletion,
} from './completionHelpers';

/**
 * Run the agentic loop with multi-turn continuation
 *
 * This loop continues calling Gemini until:
 * 1. The AI returns only text (no more tool calls)
 * 2. The AI calls ask_user (waits for user input)
 * 3. Max iterations reached (safety limit)
 */
export async function runAgentLoop(
  userMessage: string,
  session: IdeationSession,
  executeTool: ToolExecutor,
  options?: AgentLoopOptions
): Promise<AgentResponse> {
  const ai = getAIClient();
  const MAX_ITERATIONS = options?.maxIterations ?? 25;
  const tools = options?.tools ?? COPILOT_TOOLS;
  const enhancedMode = options?.enhancedMode;

  // Build conversation history
  const contents: Content[] = session.messages.map(msg => ({
    role: msg.role === MessageRole.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  const systemPrompt = options?.systemPromptBuilder
    ? options.systemPromptBuilder(session)
    : buildFullPrompt(session);

  const allToolCalls: ProcessedToolCall[] = [];
  let responseText = '';
  let askUserQuestion: AgentResponse['askUserQuestion'] | undefined;
  let continueLoop = true;
  let iterations = 0;

  try {
    while (continueLoop && iterations < MAX_ITERATIONS) {
      iterations++;
      console.log(`[AgentLoop] Iteration ${iterations}/${MAX_ITERATIONS}`);

      const response = await ai.models.generateContent({
        model: getTextModel('fast'),
        contents,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ functionDeclarations: tools }],
          toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } },
        },
      });

      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts) {
        throw new Error('No response from model');
      }

      const parts = candidate.content.parts;
      const functionCallParts = parts.filter(p => p.functionCall);
      const textParts = parts.filter(p => p.text);

      for (const part of textParts) {
        if (part.text) responseText += part.text;
      }

      if (functionCallParts.length === 0) {
        console.log('[AgentLoop] No more function calls - AI is done');
        continueLoop = false;
        break;
      }

      console.log(`[AgentLoop] Processing ${functionCallParts.length} function calls`);

      const turnToolCalls: ProcessedToolCall[] = [];
      const functionResponses: Part[] = [];
      let hitAskUser = false;

      for (const part of functionCallParts) {
        const funcCall = part.functionCall as FunctionCall;
        const toolName = funcCall.name;
        const toolArgs = (funcCall.args || {}) as Record<string, unknown>;

        console.log(`[AgentLoop] Executing tool: ${toolName}`, toolArgs);

        if (toolName === 'ask_user') {
          askUserQuestion = {
            question: toolArgs.question as string,
            options: toolArgs.options as string[] | undefined,
          };
          turnToolCalls.push({ name: toolName, args: toolArgs, result: { type: 'ask_user', captured: true } });
          hitAskUser = true;
          continueLoop = false;
          continue;
        }

        let result: unknown;
        if (toolName === 'research') {
          if (enhancedMode?.enabled && hasGrokApiKey()) {
            console.log('[AgentLoop] Using Grok for enhanced research');
            const grokResults = await performGrokResearch(
              toolArgs.query as string,
              enhancedMode.preferences,
              enhancedMode.onProgress
            );
            result = {
              success: true,
              query: toolArgs.query,
              enhanced: true,
              findings: grokResults.findings.map(f => ({
                title: f.citation.title,
                snippet: f.summary,
                relevance: f.type,
                url: f.citation.url,
                source: f.citation.source,
                reliability: f.citation.reliability,
              })),
              xTrends: grokResults.xTrends,
              synthesis: grokResults.synthesis,
              mindMapData: grokResults.mindMapData,
            };
            await executeTool(toolName, {
              ...toolArgs,
              results: grokResults.findings,
              enhanced: true,
              citations: grokResults.citations,
            });
          } else {
            const researchResults = await performResearch(
              toolArgs.query as string,
              toolArgs.purpose as string
            );
            result = {
              success: true,
              query: toolArgs.query,
              enhanced: false,
              findings: researchResults.map(r => ({
                title: r.title,
                snippet: r.snippet,
                relevance: r.relevance,
              })),
            };
            await executeTool(toolName, { ...toolArgs, results: researchResults });
          }
        } else {
          result = await executeTool(toolName, toolArgs);
        }

        turnToolCalls.push({ name: toolName, args: toolArgs, result });
        functionResponses.push({
          functionResponse: { name: toolName, response: result as object },
        } as Part);
      }

      allToolCalls.push(...turnToolCalls);

      if (hitAskUser) {
        console.log('[AgentLoop] Hit ask_user - stopping loop');
        break;
      }

      contents.push({ role: 'model', parts });

      if (functionResponses.length > 0) {
        contents.push({ role: 'user', parts: functionResponses });
        console.log('[AgentLoop] Fed tool results back to Gemini, continuing...');
      }
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn('[AgentLoop] Hit max iterations - forcing stop');
    }

    console.log(`[AgentLoop] Complete. Total tool calls: ${allToolCalls.length}`);

    if (!responseText && allToolCalls.length > 0 && !askUserQuestion) {
      responseText = summarizeToolCalls(allToolCalls);
    }
  } catch (error) {
    console.error('[AgentLoop] Error:', error);
    responseText = "I encountered an issue processing your request. Let me try a different approach - could you tell me more about what you'd like to create?";
  }

  // Check if canvas is complete
  let completionQuestion: CompletionQuestion | undefined;

  if (!askUserQuestion) {
    const { shouldShowCompletion } = checkCanvasCompletion(session, allToolCalls);
    if (shouldShowCompletion) {
      completionQuestion = generateCompletionQuestion(session, allToolCalls);
      console.log('[AgentLoop] Canvas complete - showing completion UI');
    }
  }

  return { text: responseText, toolCalls: allToolCalls, askUserQuestion, completionQuestion };
}
