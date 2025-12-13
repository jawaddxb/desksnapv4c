/**
 * Copilot Agent Service
 *
 * Runs the agentic loop where the LLM decides what tools to call
 * to help the user build their ideation canvas.
 *
 * MULTI-TURN ARCHITECTURE:
 * This loop continues calling Gemini until the AI is done making decisions.
 * Tool results are fed back so the AI can see research results and create notes.
 */

import { GoogleGenAI, Content, Part, FunctionCall, FunctionDeclaration } from '@google/genai';
import { MessageRole, ResearchPreferences, ProgressUpdate } from '../types';
import { IdeationSession, getColumnFillStatus } from '../types/ideation';
import { COPILOT_TOOLS } from '../lib/copilotTools';
import { buildFullPrompt } from '../lib/copilotPrompts';
import { performGrokResearch, hasGrokApiKey } from './grokService';
import { getTextModel } from '../config';
import { performResearch } from './copilot/researchHelpers';

// Re-export types and functions from focused modules
export { createJournalEntry } from './copilot/journalHelpers';
export type { JournalEntryOptions } from './copilot/journalHelpers';
export { suggestThemeForSession } from './copilot/themeSuggestion';
export type { ThemeSuggestionWithJournal } from './copilot/themeSuggestion';
export { convertSessionToDeckPlan, convertSessionToDeckPlanWithTheme } from './copilot/deckConversion';
export type { SlideData, DeckPlan, DeckPlanWithJournal } from './copilot/deckConversion';

// ============================================
// TYPES
// ============================================

/**
 * Response from the agent loop
 */
export interface AgentResponse {
  text: string;
  toolCalls: ProcessedToolCall[];
  askUserQuestion?: {
    question: string;
    options?: string[];
  };
  completionQuestion?: CompletionQuestion;
}

/**
 * A processed tool call with its result
 */
export interface ProcessedToolCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
}

/**
 * Tool executor function type
 */
export type ToolExecutor = (tool: string, args: Record<string, unknown>) => Promise<unknown>;

/**
 * Completion question with primary actions and secondary options
 */
export interface CompletionQuestion {
  question: string;
  primaryActions: string[];
  secondaryOptions: string[];
}

/**
 * Enhanced mode options for Research Co-Pilot
 */
export interface EnhancedModeOptions {
  enabled: boolean;
  preferences: ResearchPreferences;
  onProgress?: (update: ProgressUpdate) => void;
}

/**
 * Options for the agent loop
 */
export interface AgentLoopOptions {
  tools?: FunctionDeclaration[];
  systemPromptBuilder?: (session: IdeationSession) => string;
  enhancedMode?: EnhancedModeOptions;
  maxIterations?: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a smart completion question when ideation is complete
 */
function generateCompletionQuestion(
  session: IdeationSession,
  toolCalls: ProcessedToolCall[],
): CompletionQuestion {
  const columnStatus = getColumnFillStatus(session.notes);
  const totalNotes = session.notes.length;
  const researchCalls = toolCalls.filter(tc => tc.name === 'research').length;

  const sortedColumns = [...columnStatus].sort((a, b) => a.count - b.count);
  const weakestColumn = sortedColumns[0];

  const summary = `I've created ${totalNotes} notes across all sections based on ${researchCalls} research pass${researchCalls === 1 ? '' : 'es'}.`;

  const primaryActions = ["Build the deck", "Go to rough draft"];
  const secondaryOptions: string[] = [];

  if (weakestColumn && weakestColumn.count <= 1) {
    secondaryOptions.push(`Add more to ${weakestColumn.name}`);
  }

  secondaryOptions.push("Research a specific angle");
  secondaryOptions.push("Do extended research");

  return { question: summary, primaryActions, secondaryOptions };
}

/**
 * Generate a tool call summary for display
 */
function summarizeToolCalls(toolCalls: ProcessedToolCall[]): string {
  const summaries = toolCalls
    .filter(tc => tc.name !== 'ask_user')
    .map(tc => {
      switch (tc.name) {
        case 'set_topic':
          return `Set topic to: "${tc.args.topic}"`;
        case 'create_note':
          return `Created note: "${(tc.args.content as string).slice(0, 40)}..."`;
        case 'research':
          return `Researched: ${tc.args.query}`;
        case 'update_note':
          return `Updated note`;
        case 'delete_note':
          return `Deleted note`;
        case 'connect_notes':
          return `Connected notes`;
        case 'move_note':
          return `Moved note`;
        case 'suggest_structure':
          return `Suggested structure`;
        case 'mark_ready':
          return `Marked deck as ready`;
        default:
          return `Performed ${tc.name}`;
      }
    });

  return summaries.length > 0 ? `Here's what I did:\n\n${summaries.join('\n')}` : '';
}

// ============================================
// MAIN AGENT LOOP
// ============================================

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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
          toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
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
    const markedReady = allToolCalls.some(tc => tc.name === 'mark_ready');
    const extractionTools = [
      'extract_transcript', 'extract_web_content',
      'extract_concept', 'extract_claim', 'extract_example', 'extract_framework',
      'identify_chapters', 'add_learning_objective', 'add_exercise', 'add_quiz_question'
    ];
    const extractionHappened = allToolCalls.some(tc => extractionTools.includes(tc.name));

    const notesCreated = allToolCalls.filter(tc => tc.name === 'create_note').length;
    const totalNotes = session.notes.length + notesCreated;
    const columnStatus = getColumnFillStatus(session.notes);
    const filledColumns = columnStatus.filter(c => c.count >= 1).length;
    const allColumnsFilled = filledColumns === 5;
    const minimumFilled = filledColumns >= 4;

    const isAutonomouslyComplete = markedReady || allColumnsFilled || (minimumFilled && totalNotes >= 10);

    if (!extractionHappened && isAutonomouslyComplete) {
      completionQuestion = generateCompletionQuestion(session, allToolCalls);
      console.log('[AgentLoop] Canvas complete - showing completion UI');
    }
  }

  return { text: responseText, toolCalls: allToolCalls, askUserQuestion, completionQuestion };
}
