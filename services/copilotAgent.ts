/**
 * Copilot Agent Service
 *
 * Runs the agentic loop where the LLM decides what tools to call
 * to help the user build their ideation canvas.
 */

import { GoogleGenAI, Content, Part, FunctionCall } from '@google/genai';
import { Message, MessageRole } from '../types';
import { IdeationSession, ResearchResult } from '../types/ideation';
import { COPILOT_TOOLS } from '../lib/copilotTools';
import { buildFullPrompt } from '../lib/copilotPrompts';

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
 * Run the agentic loop
 *
 * @param userMessage - The user's message
 * @param session - Current ideation session state
 * @param executeTool - Function to execute tools and update state
 * @returns Agent response with text and processed tool calls
 */
export async function runAgentLoop(
  userMessage: string,
  session: IdeationSession,
  executeTool: ToolExecutor
): Promise<AgentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Build conversation history for Gemini
  const contents: Content[] = session.messages.map(msg => ({
    role: msg.role === MessageRole.USER ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // Add the new user message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  // Build the system prompt with current context
  const systemPrompt = buildFullPrompt(session);

  const toolCalls: ProcessedToolCall[] = [];
  let responseText = '';
  let askUserQuestion: AgentResponse['askUserQuestion'] | undefined;

  try {
    // Call Gemini with tool definitions
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: COPILOT_TOOLS }],
        toolConfig: {
          functionCallingConfig: {
            mode: 'AUTO', // Let the model decide when to use tools
          },
        },
      },
    });

    // Process the response
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error('No response from model');
    }

    // Process each part of the response
    for (const part of candidate.content.parts) {
      // Handle text response
      if (part.text) {
        responseText += part.text;
      }

      // Handle function calls
      if (part.functionCall) {
        const funcCall = part.functionCall as FunctionCall;
        const toolName = funcCall.name;
        const toolArgs = (funcCall.args || {}) as Record<string, unknown>;

        // Special handling for ask_user - don't execute, just capture
        if (toolName === 'ask_user') {
          askUserQuestion = {
            question: toolArgs.question as string,
            options: toolArgs.options as string[] | undefined,
          };
          toolCalls.push({
            name: toolName,
            args: toolArgs,
            result: { type: 'ask_user', captured: true },
          });
        }
        // Special handling for research - needs async web search
        else if (toolName === 'research') {
          const researchResult = await performResearch(
            toolArgs.query as string,
            toolArgs.purpose as string
          );
          const result = await executeTool(toolName, {
            ...toolArgs,
            results: researchResult,
          });
          toolCalls.push({ name: toolName, args: toolArgs, result });
        }
        // Execute other tools normally
        else {
          const result = await executeTool(toolName, toolArgs);
          toolCalls.push({ name: toolName, args: toolArgs, result });
        }
      }
    }

    // If there's no text but there were tool calls, generate a follow-up
    if (!responseText && toolCalls.length > 0 && !askUserQuestion) {
      // Generate a summary of what was done
      const toolSummaries = toolCalls.map(tc => {
        switch (tc.name) {
          case 'create_note':
            return `Added a note: "${(tc.args.content as string).slice(0, 50)}..."`;
          case 'research':
            return `Researched: ${tc.args.query}`;
          case 'suggest_structure':
            return `Suggested structure: ${(tc.args.structure as string[]).join(' → ')}`;
          case 'mark_ready':
            return `Marked the deck plan as ready`;
          default:
            return `Performed ${tc.name}`;
        }
      });
      responseText = toolSummaries.join('\n\n');
    }
  } catch (error) {
    console.error('Agent loop error:', error);
    responseText = "I encountered an issue processing your request. Let me try a different approach - could you tell me more about what you'd like to create?";
  }

  return {
    text: responseText,
    toolCalls,
    askUserQuestion,
  };
}

/**
 * Perform web research using Gemini's grounding
 * In a real implementation, this would use web search APIs
 */
async function performResearch(
  query: string,
  purpose: string
): Promise<ResearchResult[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Use Gemini to simulate research (in production, use actual search API)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a research assistant. Find relevant information for this query.

Query: "${query}"
Purpose: ${purpose}

Return 2-3 relevant findings in this JSON format:
[
  {
    "title": "Source title",
    "url": "https://example.com/source",
    "snippet": "Key finding or quote (2-3 sentences)",
    "relevance": "Why this matters for the presentation"
  }
]

Be factual and cite real or realistic sources. Return ONLY valid JSON array.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) return [];

    const results = JSON.parse(text) as ResearchResult[];
    return results;
  } catch (error) {
    console.error('Research error:', error);
    return [];
  }
}

/**
 * Convert session to deck plan for building
 */
export async function convertSessionToDeckPlan(
  session: IdeationSession
): Promise<{
  topic: string;
  slides: Array<{
    title: string;
    bulletPoints: string[];
    speakerNotes: string;
    imageVisualDescription: string;
    layoutType: string;
    alignment: string;
  }>;
  themeId: string;
  visualStyle: string;
}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Build context from notes
  const notesContext = session.notes
    .filter(n => n.approved || n.type === 'user')
    .map(n => `[${n.column}] ${n.content}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Convert these ideation notes into a presentation plan.

Topic: ${session.topic}

Notes:
${notesContext}

Create a structured presentation with 6-12 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual to show (for AI image generation)
- layoutType: One of: split, full-bleed, statement, gallery, card
- alignment: left, right, or center

Also suggest:
- themeId: A theme that fits (e.g., startup, enterprise, luxury, minimalist)
- visualStyle: Image style prompt (e.g., "Professional photography, corporate setting")

Return as JSON.`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text?.replace(/```json|```/g, '').trim();
  if (!text) throw new Error('Failed to generate deck plan');

  return JSON.parse(text);
}
