/**
 * Rough Draft Agent
 *
 * An agentic orchestration service that generates a complete rough draft
 * by converting ideation notes or a topic into slides, refining image prompts,
 * and generating images - all with streaming callbacks for real-time UI updates.
 *
 * Reuses:
 * - `runImagePromptAgent` for image prompt refinement
 * - `generateSlideImage` from geminiService
 * - `JournalEntry` type for narrative
 * - `AgentLog` type for activity tracking
 */

import { getAIClient } from '../aiClient';
import { Slide, PresentationPlanResponse, LayoutType, Alignment } from '../../types';
import { IdeaNote, JournalEntry, JournalStage, COLUMNS } from '../../types/ideation';
import { THEMES } from '../../config/themes';
import { runImagePromptAgent } from './imagePromptAgent';
import { AgentLog, AgentContext } from './types';
import { generateSlideImage } from '../geminiService';
import { getTextModel } from '../../config';
import { safeJsonParse } from '../../lib/jsonUtils';
import { createJournalEntry } from '../copilot/journalHelpers';

// ============ Types ============

export interface RoughDraftInput {
  /** Notes from ideation flow (optional) */
  ideationNotes?: IdeaNote[];
  /** Topic for the presentation */
  topic: string;
  /** Selected theme ID */
  themeId: string;
  /** Visual style for images */
  visualStyle: string;
  /** Source of the draft request - affects how content is processed */
  source?: 'ideation' | 'sources' | 'copilot';
}

export interface SlideContent {
  title: string;
  content: string[];
  speakerNotes: string;
  imagePrompt: string;
  layoutType: LayoutType;
  alignment: Alignment;
}

/**
 * Working slide type during rough draft generation.
 * Different from RoughDraftSlide in types/roughDraft.ts which is the persistence type.
 */
export interface RoughDraftWorkingSlide extends SlideContent {
  id: string;
  imageUrl?: string;
  imageError?: string;
  isImageLoading: boolean;
  approvalState: 'pending' | 'approved' | 'modified';
}

/** @deprecated Use RoughDraftWorkingSlide instead */
export type RoughDraftSlide = RoughDraftWorkingSlide;

export interface RoughDraftResult {
  topic: string;
  themeId: string;
  visualStyle: string;
  slides: RoughDraftWorkingSlide[];
  journalEntries: JournalEntry[];
  agentLogs: AgentLog[];
  totalDurationMs: number;
}

export interface RoughDraftAgentCallbacks {
  /** Called when starting to process a slide */
  onSlideStart?: (index: number, total: number) => void;
  /** Called when content is generated for a slide */
  onContentGenerated?: (index: number, content: SlideContent) => void;
  /** Called when an image prompt is refined by the agent */
  onImagePromptRefined?: (index: number, prompt: string, wasRefined: boolean) => void;
  /** Called when an image is generated */
  onImageGenerated?: (index: number, imageUrl: string) => void;
  /** Called when image generation fails */
  onImageError?: (index: number, error: string) => void;
  /** Called when a slide is fully complete */
  onSlideComplete?: (index: number, slide: RoughDraftWorkingSlide) => void;
  /** Called when a narrative journal entry is created */
  onNarrativeEntry?: (entry: JournalEntry) => void;
  /** Called for each agent activity log */
  onLog?: (log: AgentLog) => void;
  /** Called when all content is generated (before images) */
  onContentPhaseComplete?: (slides: SlideContent[]) => void;
  /** Called when all processing is complete */
  onComplete?: (result: RoughDraftResult) => void;
}

export interface RoughDraftAgentOptions {
  /** Max concurrent image generations (default: 3) */
  maxConcurrentImages?: number;
  /** Skip image generation (for testing) */
  skipImageGeneration?: boolean;
  /** Image prompt agent acceptance threshold (default: 70) */
  promptAcceptanceThreshold?: number;
}

// ============ Helper Functions ============

function generateId(): string {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ============ Content Generation ============

/**
 * Generate slide content from ideation notes or topic using AI
 */
async function generateSlideContent(
  input: RoughDraftInput,
  callbacks?: RoughDraftAgentCallbacks
): Promise<{ slides: SlideContent[]; journalEntries: JournalEntry[] }> {
  const ai = getAIClient();
  const theme = THEMES[input.themeId] || THEMES.executive;
  const journalEntries: JournalEntry[] = [];

  // Emit analyzing narrative
  const analyzingEntry = createJournalEntry(
    'analyzing',
    'Understanding Your Ideas',
    input.ideationNotes
      ? `Looking at your ${input.ideationNotes.length} ideation notes across ${new Set(input.ideationNotes.map(n => COLUMNS[n.column])).size} categories...`
      : `Analyzing your topic "${input.topic}" to structure a compelling presentation...`,
    {
      relatedNoteIds: input.ideationNotes?.map(n => n.id),
    }
  );
  journalEntries.push(analyzingEntry);
  callbacks?.onNarrativeEntry?.(analyzingEntry);

  // Build context from notes or topic
  const notesContext = input.ideationNotes
    ? input.ideationNotes
        .map(n => `[${COLUMNS[n.column]}] ${n.content}`)
        .join('\n')
    : '';

  // Use more conservative approach for source-based decks (video/web extraction)
  const isFromSources = input.source === 'sources';
  const openingInstruction = isFromSources
    ? 'Organize these extracted notes into a presentation, preserving the original wording and key concepts as closely as possible.'
    : 'Convert these ideation notes into a presentation plan.';

  const prompt = input.ideationNotes
    ? `${openingInstruction}

Topic: ${input.topic}
Selected Theme: ${input.themeId} - ${theme.name}
Theme Description: ${theme.description}
Visual Style: ${input.visualStyle}

Notes:
${notesContext}

Create a structured presentation with 6-12 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)${isFromSources ? ' - USE THE ORIGINAL NOTE CONTENT DIRECTLY where possible' : ''}
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual description that matches the "${theme.name}" theme style: ${input.visualStyle}
- layoutType: One of: split, full-bleed, statement, gallery, card, horizontal, magazine
- alignment: left, right, or center
${isFromSources ? `
IMPORTANT: This content was extracted from a source (video/article). PRESERVE the original phrasing, examples, and key concepts. Do NOT fundamentally rewrite or change the narrative. Stay faithful to the source material.
` : ''}
IMPORTANT: The imageVisualDescription should match the theme's visual style: ${input.visualStyle}

Return as JSON with structure:
{
  "topic": "...",
  "slides": [...]
}`
    : `Create a presentation plan for the following topic.

Topic: ${input.topic}
Selected Theme: ${input.themeId} - ${theme.name}
Theme Description: ${theme.description}
Visual Style: ${input.visualStyle}

Create a structured presentation with 6-10 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual description that matches the "${theme.name}" theme style: ${input.visualStyle}
- layoutType: One of: split, full-bleed, statement, gallery, card, horizontal, magazine
- alignment: left, right, or center

IMPORTANT: The imageVisualDescription should match the theme's visual style: ${input.visualStyle}

Return as JSON with structure:
{
  "topic": "...",
  "slides": [...]
}`;

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      maxOutputTokens: 8192, // Ensure enough tokens for full JSON response
    },
  });

  const text = response.text;
  if (!text) throw new Error('Failed to generate slide content - empty response');

  // Debug: log response length and finish reason
  console.log(`[generateSlideContent] Response length: ${text.length} chars`);

  const result = safeJsonParse(text) as { topic?: string; slides: Array<{
    title: string;
    bulletPoints: string[];
    speakerNotes: string;
    imageVisualDescription: string;
    layoutType?: LayoutType;
    alignment?: Alignment;
  }> };

  // Convert to SlideContent array
  const slides: SlideContent[] = result.slides.map((slide: {
    title: string;
    bulletPoints: string[];
    speakerNotes: string;
    imageVisualDescription: string;
    layoutType: LayoutType;
    alignment: Alignment;
  }) => ({
    title: slide.title,
    content: slide.bulletPoints,
    speakerNotes: slide.speakerNotes,
    imagePrompt: slide.imageVisualDescription,
    layoutType: slide.layoutType || 'split',
    alignment: slide.alignment || 'left',
  }));

  // Emit creating narrative
  const layoutCounts: Record<string, number> = {};
  slides.forEach(slide => {
    layoutCounts[slide.layoutType] = (layoutCounts[slide.layoutType] || 0) + 1;
  });
  const layoutSummary = Object.entries(layoutCounts)
    .map(([layout, count]) => `${count} ${layout}`)
    .join(', ');

  const creatingEntry = createJournalEntry(
    'creating',
    'Structuring Your Presentation',
    `I've designed a ${slides.length}-slide presentation with ${layoutSummary} layouts. Opening with "${slides[0]?.title}" and concluding with "${slides[slides.length - 1]?.title}" to create a compelling narrative arc.`,
    {
      decision: `${slides.length} slides with ${Object.keys(layoutCounts).length} layout types`,
      confidence: 85,
    }
  );
  journalEntries.push(creatingEntry);
  callbacks?.onNarrativeEntry?.(creatingEntry);

  return { slides, journalEntries };
}

// ============ Main Agent Function ============

/**
 * Run the rough draft agent to generate a complete draft with content and images.
 *
 * Flow:
 * 1. Generate slide content (from notes or topic)
 * 2. For each slide, refine image prompt via runImagePromptAgent
 * 3. Generate images with streaming callbacks
 * 4. Return complete result
 */
export async function runRoughDraftAgent(
  input: RoughDraftInput,
  callbacks?: RoughDraftAgentCallbacks,
  options?: RoughDraftAgentOptions
): Promise<RoughDraftResult> {
  const startTime = Date.now();
  const allLogs: AgentLog[] = [];
  const journalEntries: JournalEntry[] = [];
  const opts = {
    maxConcurrentImages: options?.maxConcurrentImages ?? 3,
    skipImageGeneration: options?.skipImageGeneration ?? false,
    promptAcceptanceThreshold: options?.promptAcceptanceThreshold ?? 70,
  };

  // Phase 1: Generate slide content
  const { slides: slideContents, journalEntries: contentJournalEntries } =
    await generateSlideContent(input, callbacks);
  journalEntries.push(...contentJournalEntries);

  // Emit content for each slide
  slideContents.forEach((content, index) => {
    callbacks?.onContentGenerated?.(index, content);
  });
  callbacks?.onContentPhaseComplete?.(slideContents);

  // Initialize slides with content
  const slides: RoughDraftWorkingSlide[] = slideContents.map((content, index) => ({
    ...content,
    id: generateId(),
    isImageLoading: !opts.skipImageGeneration,
    approvalState: 'pending' as const,
  }));

  if (opts.skipImageGeneration) {
    // Skip image generation - return slides without images
    const result: RoughDraftResult = {
      topic: input.topic,
      themeId: input.themeId,
      visualStyle: input.visualStyle,
      slides,
      journalEntries,
      agentLogs: allLogs,
      totalDurationMs: Date.now() - startTime,
    };
    callbacks?.onComplete?.(result);
    return result;
  }

  // Phase 2: Refine image prompts using the image prompt agent
  const refiningEntry = createJournalEntry(
    'refining',
    'Perfecting Your Visuals',
    `Now I'm refining the image descriptions for each slide to ensure they perfectly match your topic "${input.topic}" and the ${THEMES[input.themeId]?.name || input.themeId} theme aesthetic.`,
    {
      toolsCalled: ['validateImagePrompt', 'rewriteImagePrompt'],
    }
  );
  journalEntries.push(refiningEntry);
  callbacks?.onNarrativeEntry?.(refiningEntry);

  // Build agent context for image prompt refinement
  const agentContext: AgentContext = {
    topic: input.topic,
    themeId: input.themeId,
    visualStyle: input.visualStyle,
    slides: slides.map((slide, index) => ({
      index,
      title: slide.title,
      content: slide.content,
      initialPrompt: slide.imagePrompt,
    })),
  };

  // Run image prompt agent
  const agentResult = await runImagePromptAgent(agentContext, {
    acceptanceThreshold: opts.promptAcceptanceThreshold,
    maxIterations: 3,
    parallelValidation: true,
    onLog: (log) => {
      allLogs.push(log);
      callbacks?.onLog?.(log);
    },
    onSlideComplete: (result) => {
      // Update slide with refined prompt
      slides[result.slideIndex].imagePrompt = result.finalPrompt;
      callbacks?.onImagePromptRefined?.(
        result.slideIndex,
        result.finalPrompt,
        result.wasRefined
      );
    },
  });

  // Phase 3: Generate images with concurrency control
  const imageGeneratingEntry = createJournalEntry(
    'creating',
    'Generating Your Images',
    `Creating ${slides.length} unique images using the refined prompts. Each image is crafted to match the ${THEMES[input.themeId]?.name || input.themeId} theme with ${input.visualStyle}.`,
    {
      confidence: 90,
    }
  );
  journalEntries.push(imageGeneratingEntry);
  callbacks?.onNarrativeEntry?.(imageGeneratingEntry);

  // Generate images with concurrency limit
  const generateImageForSlide = async (index: number): Promise<void> => {
    const slide = slides[index];
    callbacks?.onSlideStart?.(index, slides.length);

    const genStartTime = Date.now();
    try {
      const imageUrl = await generateSlideImage(slide.imagePrompt, input.visualStyle, {
        topic: input.topic,
        noText: true,
      });

      slide.imageUrl = imageUrl;
      slide.isImageLoading = false;

      allLogs.push({
        slideIndex: index,
        iteration: 0,
        action: 'finalize',
        input: slide.imagePrompt,
        output: 'Image generated successfully',
        reasoning: `Generated image for slide ${index + 1}`,
        timestamp: Date.now(),
        durationMs: Date.now() - genStartTime,
      });

      callbacks?.onImageGenerated?.(index, imageUrl);
      callbacks?.onSlideComplete?.(index, slide);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      slide.imageError = errorMessage;
      slide.isImageLoading = false;

      allLogs.push({
        slideIndex: index,
        iteration: 0,
        action: 'finalize',
        input: slide.imagePrompt,
        output: `Error: ${errorMessage}`,
        reasoning: `Failed to generate image for slide ${index + 1}`,
        timestamp: Date.now(),
        durationMs: Date.now() - genStartTime,
      });

      callbacks?.onImageError?.(index, errorMessage);
      callbacks?.onSlideComplete?.(index, slide);
    }
  };

  // Process images with concurrency limit
  const chunks: number[][] = [];
  for (let i = 0; i < slides.length; i += opts.maxConcurrentImages) {
    chunks.push(
      Array.from(
        { length: Math.min(opts.maxConcurrentImages, slides.length - i) },
        (_, j) => i + j
      )
    );
  }

  for (const chunk of chunks) {
    await Promise.all(chunk.map(generateImageForSlide));
  }

  // Final summary narrative
  const successCount = slides.filter(s => s.imageUrl).length;
  const summaryEntry = createJournalEntry(
    'refining',
    'Draft Complete',
    `Your rough draft is ready! ${successCount}/${slides.length} images generated successfully. You can now review each slide, make adjustments, and approve when you're satisfied.`,
    {
      decision: `${successCount} images generated`,
      confidence: successCount === slides.length ? 95 : 75,
    }
  );
  journalEntries.push(summaryEntry);
  callbacks?.onNarrativeEntry?.(summaryEntry);

  const result: RoughDraftResult = {
    topic: input.topic,
    themeId: input.themeId,
    visualStyle: input.visualStyle,
    slides,
    journalEntries,
    agentLogs: [...allLogs, ...agentResult.logs],
    totalDurationMs: Date.now() - startTime,
  };

  callbacks?.onComplete?.(result);
  return result;
}

// ============ Single Slide Regeneration ============

/**
 * Regenerate image for a single slide with agent refinement
 */
export async function regenerateSlideWithAgent(
  slide: RoughDraftWorkingSlide,
  topic: string,
  visualStyle: string,
  callbacks?: {
    onLog?: (log: AgentLog) => void;
    onImageGenerated?: (imageUrl: string) => void;
    onError?: (error: string) => void;
  }
): Promise<RoughDraftWorkingSlide> {
  const logs: AgentLog[] = [];

  // Refine the prompt first
  const agentContext: AgentContext = {
    topic,
    themeId: '',
    visualStyle,
    slides: [{
      index: 0,
      title: slide.title,
      content: slide.content,
      initialPrompt: slide.imagePrompt,
    }],
  };

  const agentResult = await runImagePromptAgent(agentContext, {
    onLog: (log) => {
      logs.push(log);
      callbacks?.onLog?.(log);
    },
  });

  const refinedPrompt = agentResult.refinedPrompts[0];

  try {
    const imageUrl = await generateSlideImage(refinedPrompt, visualStyle, {
      topic,
      noText: true,
    });

    callbacks?.onImageGenerated?.(imageUrl);

    return {
      ...slide,
      imagePrompt: refinedPrompt,
      imageUrl,
      imageError: undefined,
      isImageLoading: false,
      approvalState: 'modified',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    callbacks?.onError?.(errorMessage);

    return {
      ...slide,
      imagePrompt: refinedPrompt,
      imageError: errorMessage,
      isImageLoading: false,
      approvalState: 'modified',
    };
  }
}
