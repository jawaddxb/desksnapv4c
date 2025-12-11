import { PresentationPlanResponse, GenerationMode, ToneType, ContentRefinementType, ImageStylePreset, Presentation } from "../types";
import { getThemeOptions, REFINEMENT_INSTRUCTIONS, SYSTEM_INSTRUCTION_VISUAL_DIRECTOR, PRESENTATION_SCHEMA, getGenerationModeInstruction, CONTENT_DECONSTRUCTION_PROMPT, CONTENT_DECONSTRUCTION_SCHEMA } from "../lib/prompts";
import { getAIClient } from "./aiClient";
import { parseAIJsonResponse } from "./ai/parseJson";
import { IdeaNote, NoteConnection, JournalEntry, JournalStage, createNote } from "../types/ideation";

// Helper to ensure we have a valid key for High Quality image generation
export const ensureApiKeySelection = async (): Promise<void> => {
  if (process.env.API_KEY) return;

  // @ts-ignore - Handle potential window.aistudio check safely
  const win = window as any;
  if (typeof win !== 'undefined' && win.aistudio && win.aistudio.hasSelectedApiKey && win.aistudio.openSelectKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }
};

export type RefinementFocus = keyof typeof REFINEMENT_INSTRUCTIONS;

export const refineImagePrompt = async (originalPrompt: string, focus: RefinementFocus = 'general'): Promise<string> => {
  const ai = getAIClient();
  const instruction = REFINEMENT_INSTRUCTIONS[focus];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Act as a Prompt Engineer. Rewrite the following image prompt to satisfy the specific refinement goal.

      Original Prompt: "${originalPrompt}"

      Refinement Goal: ${instruction}

      Return ONLY the new prompt string, no markdown or explanations.`
  });
  return response.text?.trim() || originalPrompt;
};

// ============================================
// AI REFINEMENT ACTIONS (Pitch-inspired)
// ============================================

const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  professional: 'Rewrite in a formal, confident business tone. Use precise language, avoid colloquialisms, and maintain authority.',
  casual: 'Rewrite in a friendly, conversational tone. Use simple words, contractions, and a warm approach.',
  technical: 'Rewrite with precise, detailed technical language. Include specific terminology and quantifiable details where appropriate.',
  persuasive: 'Rewrite to be compelling and action-oriented. Use power words, create urgency, and emphasize benefits.',
  executive: 'Rewrite to be ultra-concise and bottom-line focused. Lead with conclusions, eliminate fluff, use bullet-friendly phrasing.'
};

const CONTENT_REFINEMENT_INSTRUCTIONS: Record<ContentRefinementType, string> = {
  expand: 'Add more depth and detail to each point. Include examples, supporting information, or context. Expand brief phrases into complete thoughts.',
  simplify: 'Make the content more accessible. Use shorter sentences, simpler vocabulary, and remove jargon. Target a general audience.',
  clarify: 'Improve clarity and readability. Remove ambiguity, make each point self-contained, and ensure logical flow between points.',
  storytelling: 'Add narrative elements. Use "we/you" language, create a journey, add emotional hooks, and frame points as part of a story arc.'
};

const IMAGE_STYLE_INSTRUCTIONS: Record<ImageStylePreset, string> = {
  vivid: 'Enhance for vibrant, saturated colors. Add rich color contrast, make the scene feel alive and energetic.',
  muted: 'Adjust for soft, desaturated tones. Create a calm, understated aesthetic with earth tones and pastels.',
  'high-contrast': 'Optimize for dramatic contrast. Deep blacks, bright highlights, strong shadows, cinematic feel.',
  soft: 'Create a soft, dreamy atmosphere. Gentle lighting, diffused edges, warm and inviting mood.'
};

export const refineSlideContent = async (
  title: string,
  content: string[],
  tone: ToneType
): Promise<{ title: string; content: string[] }> => {
  const ai = getAIClient();
  const instruction = TONE_INSTRUCTIONS[tone];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a presentation copywriter. Rewrite this slide content according to the tone instruction.

TONE INSTRUCTION: ${instruction}

CURRENT SLIDE:
Title: "${title}"
Bullets:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return ONLY valid JSON with this exact structure:
{"title": "new title", "content": ["bullet 1", "bullet 2", "bullet 3"]}

Keep the same number of bullets. Do not add markdown or explanations.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseAIJsonResponse<{ title: string; content: string[] }>(response.text);
};

export const refineSlideContentByType = async (
  title: string,
  content: string[],
  refinementType: ContentRefinementType
): Promise<{ title: string; content: string[] }> => {
  const ai = getAIClient();
  const instruction = CONTENT_REFINEMENT_INSTRUCTIONS[refinementType];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a presentation content optimizer. Transform this slide according to the refinement goal.

REFINEMENT GOAL: ${instruction}

CURRENT SLIDE:
Title: "${title}"
Bullets:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return ONLY valid JSON with this exact structure:
{"title": "new title", "content": ["bullet 1", "bullet 2", ...]}

You may adjust the number of bullets if the refinement requires it (e.g., expand may add bullets, simplify may merge). Do not add markdown or explanations.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseAIJsonResponse<{ title: string; content: string[] }>(response.text);
};

export const enhanceImagePrompt = async (
  originalPrompt: string,
  stylePreset: ImageStylePreset
): Promise<string> => {
  const ai = getAIClient();
  const instruction = IMAGE_STYLE_INSTRUCTIONS[stylePreset];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an image prompt engineer. Enhance this prompt for a specific visual style.

STYLE GOAL: ${instruction}

ORIGINAL PROMPT: "${originalPrompt}"

Rewrite the prompt to achieve the style goal. Add lighting, color, and atmosphere modifiers. Keep the core subject intact.

Return ONLY the new prompt string, no markdown or explanations.`
  });

  return response.text?.trim() || originalPrompt;
};

interface ImageStyleOverride {
  id: string;
  prompt: string;
  subjectGuidance?: string;
}

export const generatePresentationPlan = async (
  prompt: string,
  imageStyle?: ImageStyleOverride,
  generationMode: GenerationMode = 'balanced'
): Promise<PresentationPlanResponse> => {
  const ai = getAIClient();

  // Dynamic prompt construction
  const themeOptions = getThemeOptions();
  const modeInstruction = getGenerationModeInstruction(generationMode);
  const isAuto = !imageStyle || imageStyle.id === 'auto';

  const styleInstruction = isAuto
    ? `Review the selected theme and determine the best 'visualStyle' prompt that matches its Art Direction.`
    : `USER VISUAL OVERRIDE: The user has explicitly selected the image style: "${imageStyle.id}". CONSTRAINT: You MUST set the 'visualStyle' field in the JSON response to exactly this string: "${imageStyle.prompt}".`;

  const subjectLogic = (!isAuto && imageStyle.subjectGuidance)
    ? `CRITICAL ART DIRECTION RULES (Subject Matter): ${imageStyle.subjectGuidance}`
    : `Determine the appropriate subject matter (people vs abstract vs illustration) based on the theme's aesthetic.`;

  // Use Flash for the logical planning
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SYSTEM_INSTRUCTION_VISUAL_DIRECTOR}
    
    ${modeInstruction}
    
    CONTEXT:
    Available Themes:
    ${themeOptions}
    
    User Request: "${prompt}"
    
    ${styleInstruction}
    ${subjectLogic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: PRESENTATION_SCHEMA
    }
  });

  return parseAIJsonResponse<PresentationPlanResponse>(response.text);
};

// ============================================
// HOLISTIC IMAGE SUGGESTIONS
// ============================================

/**
 * Generate contextual image prompt suggestions by analyzing the entire deck.
 * Returns 4 alternative subject prompts that maintain visual coherence.
 */
export const generateHolisticImageSuggestions = async (
  presentation: Presentation,
  currentSlideIndex: number
): Promise<string[]> => {
  const ai = getAIClient();

  const currentSlide = presentation.slides[currentSlideIndex];
  if (!currentSlide) {
    throw new Error('Invalid slide index');
  }

  // Build context from all slides
  const deckContext = presentation.slides.map((slide, idx) => ({
    index: idx + 1,
    title: slide.title,
    content: slide.content.slice(0, 3), // First 3 bullets for context
    currentPrompt: slide.imagePrompt,
    isCurrent: idx === currentSlideIndex
  }));

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an expert Visual Director analyzing a presentation deck to suggest alternative image subjects.

PRESENTATION CONTEXT:
- Topic: "${presentation.topic}"
- Theme ID: "${presentation.themeId}"
- Visual Aesthetic (FIXED - do not modify): "${presentation.visualStyle}"

DECK STRUCTURE:
${deckContext.map(s => `
Slide ${s.index}${s.isCurrent ? ' [CURRENT SLIDE]' : ''}:
  Title: "${s.title}"
  Content: ${s.content.join('; ')}
  Image Subject: "${s.currentPrompt}"
`).join('\n')}

TASK: Generate 4 alternative image SUBJECT descriptions for Slide ${currentSlideIndex + 1}.

CRITICAL RULES:
1. SUBJECTS ONLY - describe what appears in the image (people, objects, scenes, actions)
2. NO STYLE - the aesthetic is applied separately, focus only on content
3. VARIETY - each suggestion should be distinctly different
4. COHERENCE - subjects should fit the slide's message and deck narrative
5. AVOID REPETITION - do not repeat concepts already used in other slides
6. CONCRETE - prefer tangible, visual subjects over abstract concepts
7. BRIEF - 1-2 sentences each, describing the scene/subject clearly

Current slide details:
- Title: "${currentSlide.title}"
- Content: ${currentSlide.content.join('; ')}
- Current subject: "${currentSlide.imagePrompt}"

Return a JSON array with exactly 4 alternative subject descriptions:
["subject 1", "subject 2", "subject 3", "subject 4"]`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return parseAIJsonResponse<string[]>(response.text);
};

// ============================================
// IMAGE GENERATION OPTIONS
// ============================================

export interface SlideImageOptions {
  /** Presentation topic for context */
  topic?: string;
  /** Prevent text, brands, logos in image */
  noText?: boolean;
}

// Anti-text instruction to prevent brand/text hallucination
const ANTI_TEXT_GUARD = `CRITICAL: Do not include ANY text, words, letters, numbers, brand names, logos, watermarks, URLs, or typography of any kind in the image. The image must be completely free of readable text or branding. Generate only visual imagery.`;

export const generateSlideImage = async (
  imagePrompt: string,
  style: string,
  options?: SlideImageOptions
): Promise<string> => {
  const ai = getAIClient();

  // Build enhanced prompt with optional topic context and anti-text guard
  const topicContext = options?.topic ? `TOPIC CONTEXT: ${options.topic} . ` : '';
  const antiTextGuard = options?.noText ? `${ANTI_TEXT_GUARD} . ` : '';

  const enhancedPrompt = `${style} . ${topicContext}SUBJECT: ${imagePrompt} . ${antiTextGuard}High quality, 8k, detailed, award winning.`;

  console.log("Generating image with prompt:", enhancedPrompt);

  const strategies = [
    {
      model: "gemini-3-pro-image-preview",
      label: "Pro High-Res",
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    },
    {
      model: "gemini-2.5-flash-image",
      label: "Flash Standard",
      config: { imageConfig: { aspectRatio: "16:9" } }
    }
  ];

  for (const strategy of strategies) {
    try {
      const response = await ai.models.generateContent({
        model: strategy.model,
        contents: { parts: [{ text: enhancedPrompt }] },
        config: strategy.config
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.warn(`Generation failed on ${strategy.model}`, error);
    }
  }

  throw new Error("Failed to generate image after trying all available models.");
};

// ============================================
// AGENT-BASED IMAGE GENERATION
// ============================================

import { runImagePromptAgent, AgentLog, AgentImageGenerationOptions, AgentImageGenerationResult } from './agents';

/**
 * Generate presentation images using the intelligent agent system.
 *
 * The agent will:
 * 1. Validate each image prompt against the topic
 * 2. Rewrite prompts that don't relate to the topic
 * 3. Generate images with the refined prompts
 * 4. Log all reasoning for debugging
 */
export async function generatePresentationImagesWithAgent(
  topic: string,
  slides: Array<{ title: string; content: string[]; imagePrompt: string }>,
  visualStyle: string,
  themeId: string,
  options?: AgentImageGenerationOptions
): Promise<AgentImageGenerationResult> {
  const startTime = Date.now();
  const errors: Array<{ slideIndex: number; error: string }> = [];

  // Step 1: Run the agent to refine all prompts
  const agentResult = await runImagePromptAgent(
    {
      topic,
      themeId,
      visualStyle,
      slides: slides.map((s, i) => ({
        index: i,
        title: s.title,
        content: s.content,
        initialPrompt: s.imagePrompt,
      })),
    },
    {
      acceptanceThreshold: options?.acceptanceThreshold,
      maxIterations: options?.maxIterations,
      parallelValidation: options?.parallelValidation,
      onLog: options?.onLog,
      onSlideComplete: options?.onSlideComplete,
    }
  );

  // Step 2: Generate images with refined prompts (parallel)
  const images = await Promise.all(
    agentResult.refinedPrompts.map(async (prompt, index) => {
      try {
        const image = await generateSlideImage(prompt, visualStyle, {
          topic,
          noText: true,
        });
        options?.onImageGenerated?.(index, image);
        return image;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ slideIndex: index, error: errorMessage });
        options?.onImageError?.(index, error instanceof Error ? error : new Error(errorMessage));
        return ''; // Return empty string for failed images
      }
    })
  );

  return {
    images,
    agentLogs: agentResult.logs,
    errors,
    totalDurationMs: Date.now() - startTime,
  };
}

// ============================================
// CONTENT DECONSTRUCTION (Pasted Content → Ideation)
// ============================================

/**
 * Response from content deconstruction
 */
export interface DeconstructionResult {
  topic: string;
  notes: IdeaNote[];
  connections: NoteConnection[];
  journalEntry: JournalEntry;
}

/**
 * Raw response from AI (before processing)
 */
interface RawDeconstructionResponse {
  topic: string;
  notes: Array<{
    content: string;
    column: number;
    reasoning: string;
  }>;
  connections: Array<{
    fromIndex: number;
    toIndex: number;
  }>;
  journalEntry: {
    title: string;
    narrative: string;
    stage: string;
  };
}

/**
 * Deconstruct pasted content into a structured ideation map.
 *
 * When users paste content directly into the AI chat (bypassing the ideation flow),
 * this function analyzes the content and breaks it down into the 5-column narrative
 * framework: Hook, Problem, Solution, Proof, CTA.
 *
 * Returns notes organized by column with AI reasoning, plus a journal entry
 * documenting the Creative Director's analysis process.
 */
export const deconstructContentToIdeation = async (
  pastedContent: string
): Promise<DeconstructionResult> => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${CONTENT_DECONSTRUCTION_PROMPT}

USER'S CONTENT TO ANALYZE:
"""
${pastedContent}
"""

Analyze this content and return the structured JSON response.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: CONTENT_DECONSTRUCTION_SCHEMA
    }
  });

  const rawResult = parseAIJsonResponse<RawDeconstructionResponse>(response.text);

  // Convert raw notes to IdeaNote format
  const notes: IdeaNote[] = rawResult.notes.map((note, index) => {
    // Create a proper IdeaNote with all required fields
    const ideaNote = createNote(
      note.content,
      note.column,
      'ai',      // AI-generated note
      'blue',    // AI suggestion color
      undefined  // No parent
    );
    // Set row based on position in column
    ideaNote.row = rawResult.notes
      .slice(0, index)
      .filter(n => n.column === note.column)
      .length;
    ideaNote.approved = true; // Auto-approve deconstructed notes
    return ideaNote;
  });

  // Convert index-based connections to ID-based connections
  const connections: NoteConnection[] = rawResult.connections
    .filter(conn => conn.fromIndex < notes.length && conn.toIndex < notes.length)
    .map(conn => ({
      id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fromId: notes[conn.fromIndex].id,
      toId: notes[conn.toIndex].id,
    }));

  // Create the journal entry
  const journalEntry: JournalEntry = {
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    stage: (rawResult.journalEntry.stage as JournalStage) || 'analyzing',
    title: rawResult.journalEntry.title,
    narrative: rawResult.journalEntry.narrative,
    relatedNoteIds: notes.map(n => n.id),
  };

  return {
    topic: rawResult.topic,
    notes,
    connections,
    journalEntry,
  };
};

/**
 * Check if content should be deconstructed (substantial pasted content)
 */
export const shouldDeconstructContent = (content: string): boolean => {
  // Heuristics for "substantial" content:
  // - More than 200 characters
  // - Contains multiple paragraphs (double newlines)
  // - Contains list markers (bullets, numbers)
  const hasLength = content.length > 200;
  const hasParagraphs = content.includes('\n\n');
  const hasListMarkers = /^[\s]*[-•*]|\d+\./m.test(content);

  return hasLength || hasParagraphs || hasListMarkers;
};
