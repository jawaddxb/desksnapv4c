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

import { GoogleGenAI, Content, Part, FunctionCall, FunctionDeclaration, Type } from '@google/genai';
import { parseAIJsonResponse } from './ai/parseJson';
import { Message, MessageRole, PresentationPlanResponse, ResearchPreferences, ProgressUpdate } from '../types';
import { IdeationSession, ResearchResult, ThemeSuggestion, COLUMNS, JournalEntry, JournalStage, getColumnFillStatus, isIdeationComplete, ColumnStatus } from '../types/ideation';
import { THEMES, THEME_CATEGORIES } from '../config/themes';
import { COPILOT_TOOLS } from '../lib/copilotTools';
import { buildFullPrompt } from '../lib/copilotPrompts';
import { performGrokResearch, hasGrokApiKey } from './grokService';

// Schema for deck plan conversion - ensures proper JSON escaping
const DECK_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The main topic of the presentation" },
    visualStyle: { type: Type.STRING, description: "The visual style prompt for images" },
    themeId: { type: Type.STRING, description: "The ID of the selected theme" },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Compelling slide title" },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-4 key points" },
          speakerNotes: { type: Type.STRING, description: "Speaker notes (2-3 sentences)" },
          imageVisualDescription: { type: Type.STRING, description: "Visual description for image generation" },
          layoutType: {
            type: Type.STRING,
            enum: ['split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'],
            description: "The structural layout of the slide"
          },
          alignment: {
            type: Type.STRING,
            enum: ['left', 'right', 'center'],
            description: "Content alignment"
          }
        },
        required: ["title", "bulletPoints", "speakerNotes", "imageVisualDescription", "layoutType", "alignment"]
      }
    }
  },
  required: ["topic", "slides"]
};

// ============================================
// JOURNAL ENTRY HELPERS
// ============================================

/**
 * Create a journal entry with unique ID and timestamp
 */
function createJournalEntry(
  stage: JournalStage,
  title: string,
  narrative: string,
  options?: {
    decision?: string;
    alternatives?: string[];
    confidence?: number;
    relatedNoteIds?: string[];
    relatedSlideIds?: string[];
    toolsCalled?: string[];
  }
): JournalEntry {
  return {
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    stage,
    title,
    narrative,
    decision: options?.decision,
    alternatives: options?.alternatives,
    confidence: options?.confidence,
    relatedNoteIds: options?.relatedNoteIds,
    relatedSlideIds: options?.relatedSlideIds,
    toolsCalled: options?.toolsCalled,
  };
}

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
  // New: Completion state for autonomous deep-dive model
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
 * Completion question with primary actions (solid buttons) and secondary options (pills)
 */
export interface CompletionQuestion {
  question: string;
  primaryActions: string[];    // Solid gold buttons (Build the deck, Go to rough draft)
  secondaryOptions: string[];  // Text pills (Add more to X, Research angle, etc.)
}

/**
 * Generate a smart completion question when ideation is complete
 * Includes primary actions (build/draft) and secondary refinement options
 */
function generateCompletionQuestion(
  session: IdeationSession,
  toolCalls: ProcessedToolCall[],
): CompletionQuestion {
  const columnStatus = getColumnFillStatus(session.notes);
  const totalNotes = session.notes.length;
  const researchCalls = toolCalls.filter(tc => tc.name === 'research').length;

  // Find weakest column
  const sortedColumns = [...columnStatus].sort((a, b) => a.count - b.count);
  const weakestColumn = sortedColumns[0];

  // Build summary
  const summary = `I've created ${totalNotes} notes across all sections based on ${researchCalls} research pass${researchCalls === 1 ? '' : 'es'}.`;

  // PRIMARY ACTIONS - Solid gold buttons (always shown)
  const primaryActions = [
    "Build the deck",
    "Go to rough draft",
  ];

  // SECONDARY OPTIONS - Text pills
  const secondaryOptions: string[] = [];

  // If a column is weak, suggest improving it
  if (weakestColumn && weakestColumn.count <= 1) {
    secondaryOptions.push(`Add more to ${weakestColumn.name}`);
  }

  secondaryOptions.push("Research a specific angle");
  secondaryOptions.push("Do extended research"); // Premium feature (unlock logic later)

  return {
    question: summary,
    primaryActions,
    secondaryOptions,
  };
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
  /** Custom tools to use instead of COPILOT_TOOLS */
  tools?: FunctionDeclaration[];
  /** Custom system prompt builder */
  systemPromptBuilder?: (session: IdeationSession) => string;
  /** Enhanced research mode settings */
  enhancedMode?: EnhancedModeOptions;
  /** Maximum iterations for the agent loop (default: 10, sources: 25) */
  maxIterations?: number;
}

/**
 * Run the agentic loop with multi-turn continuation
 *
 * This loop continues calling Gemini until:
 * 1. The AI returns only text (no more tool calls)
 * 2. The AI calls ask_user (waits for user input)
 * 3. Max iterations reached (safety limit)
 *
 * @param userMessage - The user's message
 * @param session - Current ideation session state
 * @param executeTool - Function to execute tools and update state
 * @param options - Optional settings including custom tools, prompt builder, and enhanced mode
 * @returns Agent response with text and processed tool calls
 */
export async function runAgentLoop(
  userMessage: string,
  session: IdeationSession,
  executeTool: ToolExecutor,
  options?: AgentLoopOptions
): Promise<AgentResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Increased from 10 to 25 for autonomous deep-dive completion model
  const MAX_ITERATIONS = options?.maxIterations ?? 25;

  // Use custom tools or default to COPILOT_TOOLS
  const tools = options?.tools ?? COPILOT_TOOLS;
  const enhancedMode = options?.enhancedMode;

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

  // Build the system prompt with current context (use custom builder if provided)
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

      // Call Gemini with tool definitions
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          tools: [{ functionDeclarations: tools }],
          toolConfig: {
            functionCallingConfig: {
              mode: 'AUTO',
            },
          },
        },
      });

      // Process the response
      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts) {
        throw new Error('No response from model');
      }

      const parts = candidate.content.parts;
      const functionCallParts = parts.filter(p => p.functionCall);
      const textParts = parts.filter(p => p.text);

      // Extract any text from this turn
      for (const part of textParts) {
        if (part.text) {
          responseText += part.text;
        }
      }

      // If no function calls, the AI is done
      if (functionCallParts.length === 0) {
        console.log('[AgentLoop] No more function calls - AI is done');
        continueLoop = false;
        break;
      }

      console.log(`[AgentLoop] Processing ${functionCallParts.length} function calls`);

      // Process function calls
      const turnToolCalls: ProcessedToolCall[] = [];
      const functionResponses: Part[] = [];
      let hitAskUser = false;

      for (const part of functionCallParts) {
        const funcCall = part.functionCall as FunctionCall;
        const toolName = funcCall.name;
        const toolArgs = (funcCall.args || {}) as Record<string, unknown>;

        console.log(`[AgentLoop] Executing tool: ${toolName}`, toolArgs);

        // Special handling for ask_user - stop the loop and wait for user
        if (toolName === 'ask_user') {
          askUserQuestion = {
            question: toolArgs.question as string,
            options: toolArgs.options as string[] | undefined,
          };
          turnToolCalls.push({
            name: toolName,
            args: toolArgs,
            result: { type: 'ask_user', captured: true },
          });
          hitAskUser = true;
          continueLoop = false;
          // Don't break yet - process remaining function calls in this turn
          continue;
        }

        // Special handling for research - use Grok in enhanced mode, Gemini otherwise
        let result: unknown;
        if (toolName === 'research') {
          // Check if enhanced mode with Grok is enabled
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
            // Record the enhanced research results
            await executeTool(toolName, {
              ...toolArgs,
              results: grokResults.findings,
              enhanced: true,
              citations: grokResults.citations,
            });
          } else {
            // Fallback to standard Gemini research
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
            // Record the standard research
            await executeTool(toolName, { ...toolArgs, results: researchResults });
          }
        } else {
          // Execute other tools normally
          result = await executeTool(toolName, toolArgs);
        }

        turnToolCalls.push({ name: toolName, args: toolArgs, result });

        // Build function response for Gemini
        functionResponses.push({
          functionResponse: {
            name: toolName,
            response: result as object,
          },
        } as Part);
      }

      allToolCalls.push(...turnToolCalls);

      // If we hit ask_user, stop the loop
      if (hitAskUser) {
        console.log('[AgentLoop] Hit ask_user - stopping loop');
        break;
      }

      // Add the model's response (with function calls) to conversation history
      contents.push({
        role: 'model',
        parts: parts,
      });

      // Add tool results back to conversation so Gemini can continue
      if (functionResponses.length > 0) {
        contents.push({
          role: 'user',
          parts: functionResponses,
        });
        console.log('[AgentLoop] Fed tool results back to Gemini, continuing...');
      }
    }

    if (iterations >= MAX_ITERATIONS) {
      console.warn('[AgentLoop] Hit max iterations - forcing stop');
    }

    console.log(`[AgentLoop] Complete. Total tool calls: ${allToolCalls.length}`);

    // If there's no text but there were tool calls, generate a summary
    if (!responseText && allToolCalls.length > 0 && !askUserQuestion) {
      const toolSummaries = allToolCalls
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

      if (toolSummaries.length > 0) {
        responseText = `Here's what I did:\n\n${toolSummaries.join('\n')}`;
      }
    }
  } catch (error) {
    console.error('[AgentLoop] Error:', error);
    responseText = "I encountered an issue processing your request. Let me try a different approach - could you tell me more about what you'd like to create?";
  }

  // AUTONOMOUS COMPLETION MODEL:
  // Only generate completion question when canvas is sufficiently populated
  // This allows the AI to work autonomously through multiple iterations
  let completionQuestion: CompletionQuestion | undefined;

  if (!askUserQuestion) {
    const markedReady = allToolCalls.some(tc => tc.name === 'mark_ready');
    const extractionTools = [
      'extract_transcript', 'extract_web_content',
      'extract_concept', 'extract_claim', 'extract_example', 'extract_framework',
      'identify_chapters', 'add_learning_objective', 'add_exercise', 'add_quiz_question'
    ];
    const extractionHappened = allToolCalls.some(tc => extractionTools.includes(tc.name));

    // Calculate current canvas status
    const notesCreated = allToolCalls.filter(tc => tc.name === 'create_note').length;
    const currentNotes = [...session.notes];
    // Add newly created notes to the count
    const totalNotes = session.notes.length + notesCreated;
    const columnStatus = getColumnFillStatus(session.notes);
    const filledColumns = columnStatus.filter(c => c.count >= 1).length;
    const allColumnsFilled = filledColumns === 5;
    const minimumFilled = filledColumns >= 4;

    // ONLY show completion UI if:
    // 1. AI explicitly marked ready OR
    // 2. All 5 columns have content OR
    // 3. Hit max iterations with substantial progress (4+ columns, 10+ notes)
    const isAutonomouslyComplete = markedReady || allColumnsFilled || (minimumFilled && totalNotes >= 10);

    // Don't interrupt extraction mode
    if (!extractionHappened && isAutonomouslyComplete) {
      completionQuestion = generateCompletionQuestion(session, allToolCalls);
      console.log('[AgentLoop] Canvas complete - showing completion UI');
    }
    // Otherwise: NO fallback question - let the loop continue silently
    // This is the key change for autonomous deep-dive model
  }

  return {
    text: responseText,
    toolCalls: allToolCalls,
    askUserQuestion,
    completionQuestion,
  };
}

/**
 * Generate a contextual fallback question when AI doesn't provide one
 * Ensures the conversation always has a next step
 */
function generateFallbackQuestion(
  stage: string,
  noteCount: number,
  hadToolCalls: boolean
): { question: string; options: string[] } {
  // If we just did some work (tool calls), offer to continue or build
  if (hadToolCalls) {
    if (noteCount >= 4) {
      return {
        question: "Got it! How should we continue?",
        options: ["Build the deck now!", "Add more content", "Research more facts", "Let me review"]
      };
    }
    return {
      question: "Got it! How should we continue?",
      options: ["Keep going", "Add more ideas", "Research the topic", "Build with what we have"]
    };
  }

  // Based on stage and progress
  if (noteCount === 0) {
    return {
      question: "Let's explore your idea. How would you like to start?",
      options: ["Tell me more details", "Just create a draft", "Research my topic first"]
    };
  }

  if (noteCount < 4) {
    return {
      question: "We're making progress! What's next?",
      options: ["Add more ideas", "Research some facts", "Build with what we have", "Change direction"]
    };
  }

  // Ready to build
  return {
    question: "Your deck is taking shape! Ready to build?",
    options: ["Build the deck now!", "Add more content", "Reorganize notes", "Research more"]
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
    console.log(`[Research] Found ${results.length} results for: ${query}`);
    return results;
  } catch (error) {
    console.error('[Research] Error:', error);
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

  // Build context from all notes
  const notesContext = session.notes
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

/**
 * Extended theme suggestion with journal entry
 */
export interface ThemeSuggestionWithJournal extends ThemeSuggestion {
  journalEntry: JournalEntry;
}

/**
 * Suggest a theme based on ideation session content.
 * FIRST STEP of the split conversion flow - analyzes content and suggests best theme.
 * Now includes a Creative Director's Journal entry explaining the decision.
 */
export async function suggestThemeForSession(
  session: IdeationSession
): Promise<ThemeSuggestionWithJournal> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Build context from notes organized by column
  const notesContext = session.notes
    .map(n => `[${COLUMNS[n.column]}] ${n.content}`)
    .join('\n');

  // Build theme options list
  const themeOptions = Object.values(THEMES)
    .map(t => `- ${t.id}: ${t.name} - ${t.description}`)
    .join('\n');

  const prompt = `You are a visual design expert. Analyze the ideation notes and recommend the best presentation theme.

## Presentation Topic
${session.topic}

## Ideation Notes
${notesContext}

## Available Themes

### Core (Modern Essentials)
${Object.values(THEME_CATEGORIES.core).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Business & Tech
${Object.values(THEME_CATEGORIES.business).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Luxury & Fashion
${Object.values(THEME_CATEGORIES.luxury).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Nature & Organic
${Object.values(THEME_CATEGORIES.nature).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Retro & Vintage
${Object.values(THEME_CATEGORIES.retro).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Artistic & Experimental
${Object.values(THEME_CATEGORIES.artistic).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

## Your Task
1. Analyze the topic and notes to understand the content's tone, audience, and purpose
2. Select the ONE theme that best matches the content
3. Explain WHY in 1-2 sentences
4. Suggest 2-3 alternatives from DIFFERENT categories

Return JSON:
{
  "themeId": "exact_theme_id",
  "reasoning": "Brief explanation of why this theme fits the content and audience",
  "visualStyleHint": "Brief visual direction (e.g., 'Professional photography with blue tones')",
  "alternativeIds": ["alt1", "alt2", "alt3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response');

    const suggestion = JSON.parse(text) as ThemeSuggestion;

    // Validate themeId exists
    if (!THEMES[suggestion.themeId]) {
      suggestion.themeId = 'executive';
    }

    // Validate alternativeIds
    if (suggestion.alternativeIds) {
      suggestion.alternativeIds = suggestion.alternativeIds.filter(id => THEMES[id]);
    }

    // Create journal entry for theme selection
    const theme = THEMES[suggestion.themeId];
    const journalEntry = createJournalEntry(
      'deciding',
      'Selecting Your Visual Theme',
      `Looking at your content about "${session.topic}", I felt the ${theme?.name || suggestion.themeId} aesthetic would really make your message shine. ${suggestion.reasoning}${suggestion.alternativeIds?.length ? ` I also considered ${suggestion.alternativeIds.map(id => THEMES[id]?.name || id).join(', ')} as alternatives.` : ''}`,
      {
        decision: theme?.name || suggestion.themeId,
        alternatives: suggestion.alternativeIds?.map(id => THEMES[id]?.name || id),
        confidence: 85,
        relatedNoteIds: session.notes.map(n => n.id),
      }
    );

    return {
      ...suggestion,
      journalEntry,
    };
  } catch (error) {
    console.error('[suggestThemeForSession] Error:', error);
    // Fallback suggestion with journal entry
    const fallbackJournalEntry = createJournalEntry(
      'deciding',
      'Selecting Your Visual Theme',
      `For "${session.topic}", I'm recommending the Executive theme - a professional, versatile choice that works well for most presentations. It has clean lines and a corporate aesthetic that gives your content authority.`,
      {
        decision: 'Executive',
        alternatives: ['Startup', 'Minimalist', 'Swiss'],
        confidence: 70,
      }
    );

    return {
      themeId: 'executive',
      reasoning: 'A professional, versatile theme suitable for most presentations.',
      visualStyleHint: 'Clean corporate photography with modern aesthetics',
      alternativeIds: ['startup', 'minimalist', 'swiss'],
      journalEntry: fallbackJournalEntry,
    };
  }
}

/**
 * Deck plan result with journal entries
 */
export interface DeckPlanWithJournal {
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
  journalEntries: JournalEntry[];
}

/**
 * Convert session to deck plan WITH a pre-selected theme.
 * SECOND STEP of the split conversion flow - uses the user's confirmed theme choice.
 * Now includes Creative Director's Journal entries for layout and content decisions.
 */
export async function convertSessionToDeckPlanWithTheme(
  session: IdeationSession,
  themeId: string
): Promise<DeckPlanWithJournal> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Get theme's bundled visual style
  const theme = THEMES[themeId] || THEMES.executive;
  const visualStyle = theme.imageStyle;

  // Build context from all notes
  const notesContext = session.notes
    .map(n => `[${COLUMNS[n.column]}] ${n.content}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Convert these ideation notes into a presentation plan.

Topic: ${session.topic}
Selected Theme: ${themeId} - ${theme.name}
Theme Description: ${theme.description}
Visual Style: ${visualStyle}

Notes:
${notesContext}

Create a structured presentation with 6-12 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual description that matches the "${theme.name}" theme style: ${visualStyle}
- layoutType: One of: split, full-bleed, statement, gallery, card
- alignment: left, right, or center

IMPORTANT: The imageVisualDescription should match the theme's visual style: ${visualStyle}

Return as JSON with structure:
{
  "topic": "...",
  "slides": [...],
  "themeId": "${themeId}",
  "visualStyle": "${visualStyle}"
}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: DECK_PLAN_SCHEMA,
    },
  });

  // Use parseAIJsonResponse for robust JSON parsing with repair logic
  const result = parseAIJsonResponse<PresentationPlanResponse>(response.text);
  // Ensure themeId and visualStyle are preserved
  result.themeId = themeId;
  result.visualStyle = visualStyle;

  // Generate journal entries for the deck plan
  const journalEntries: JournalEntry[] = [];

  // Layout decision journal entry
  const layoutCounts: Record<string, number> = {};
  result.slides.forEach((slide: { layoutType: string }) => {
    layoutCounts[slide.layoutType] = (layoutCounts[slide.layoutType] || 0) + 1;
  });
  const layoutSummary = Object.entries(layoutCounts)
    .map(([layout, count]) => `${count} ${layout}`)
    .join(', ');

  journalEntries.push(createJournalEntry(
    'creating',
    'Designing Your Visual Flow',
    `I designed a ${result.slides.length}-slide presentation with a visual rhythm that keeps your audience engaged. The layout mix includes ${layoutSummary} layouts. I started with a ${result.slides[0]?.layoutType || 'statement'} layout to make a strong first impression, then varied the layouts to create visual interest while maintaining your message's flow.`,
    {
      decision: `${result.slides.length} slides with ${Object.keys(layoutCounts).length} layout types`,
      relatedSlideIds: result.slides.map((_: unknown, i: number) => `slide-${i}`),
    }
  ));

  // Content structure journal entry
  journalEntries.push(createJournalEntry(
    'creating',
    'Structuring Your Content',
    `Your presentation tells a compelling story: we open with "${result.slides[0]?.title || 'an introduction'}", build through the key points, and conclude with "${result.slides[result.slides.length - 1]?.title || 'a call to action'}". Each slide flows naturally from the last, creating a narrative arc that will resonate with your audience.`,
    {
      relatedNoteIds: session.notes.map(n => n.id),
    }
  ));

  // Image direction journal entry
  journalEntries.push(createJournalEntry(
    'creating',
    'Setting the Visual Direction',
    `For the imagery, I'm using the ${theme.name} aesthetic with ${visualStyle}. This creates a cohesive visual language throughout your presentation. Each image is designed to reinforce the message of its slide while maintaining the overall professional look.`,
    {
      decision: visualStyle,
    }
  ));

  return {
    ...result,
    journalEntries,
  };
}
