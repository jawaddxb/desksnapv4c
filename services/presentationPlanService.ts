/**
 * Presentation Plan Service
 *
 * Handles AI-powered generation of presentation plans and image suggestions.
 * Single responsibility: Create structured presentation plans and holistic suggestions.
 */

import { PresentationPlanResponse, GenerationMode, Presentation } from '@/types';
import { getAIClient } from './aiClient';
import { parseAIJsonResponse } from './ai/parseJson';
import {
  getThemeOptions,
  SYSTEM_INSTRUCTION_VISUAL_DIRECTOR,
  PRESENTATION_SCHEMA,
  getGenerationModeInstruction,
} from '../lib/prompts';
import { getTextModel } from '@/config';

/**
 * Image style override configuration.
 */
export interface ImageStyleOverride {
  id: string;
  prompt: string;
  subjectGuidance?: string;
}

/**
 * Optional research context from Scout agent.
 */
export interface ResearchContext {
  findings: string;
  summary: string;
}

/**
 * Generate a complete presentation plan from a user prompt.
 *
 * Uses AI to select an appropriate theme, generate slide structure,
 * and create image prompts that match the visual style.
 *
 * @param prompt - User's description of the presentation
 * @param imageStyle - Optional image style override
 * @param generationMode - Level of detail (concise, balanced, detailed, verbatim)
 * @param researchContext - Optional research findings from Scout agent
 * @returns Structured presentation plan
 */
export const generatePresentationPlan = async (
  prompt: string,
  imageStyle?: ImageStyleOverride,
  generationMode: GenerationMode = 'balanced',
  researchContext?: ResearchContext
): Promise<PresentationPlanResponse> => {
  const ai = getAIClient();

  // Dynamic prompt construction
  const themeOptions = getThemeOptions();
  const modeInstruction = getGenerationModeInstruction(generationMode);
  const isAuto = !imageStyle || imageStyle.id === 'auto';

  const styleInstruction = isAuto
    ? `Review the selected theme and determine the best 'visualStyle' prompt that matches its Art Direction.`
    : `USER VISUAL OVERRIDE: The user has explicitly selected the image style: "${imageStyle.id}". CONSTRAINT: You MUST set the 'visualStyle' field in the JSON response to exactly this string: "${imageStyle.prompt}".`;

  const subjectLogic =
    !isAuto && imageStyle.subjectGuidance
      ? `CRITICAL ART DIRECTION RULES (Subject Matter): ${imageStyle.subjectGuidance}`
      : `Determine the appropriate subject matter (people vs abstract vs illustration) based on the theme's aesthetic.`;

  // Include research findings if available
  const researchInstruction = researchContext?.findings
    ? `\n\nRESEARCH FINDINGS (incorporate these facts into the content):\n${researchContext.findings}\n`
    : '';

  // Use Flash for the logical planning
  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `${SYSTEM_INSTRUCTION_VISUAL_DIRECTOR}

    ${modeInstruction}

    CONTEXT:
    Available Themes:
    ${themeOptions}

    User Request: "${prompt}"
    ${researchInstruction}
    ${styleInstruction}
    ${subjectLogic}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: PRESENTATION_SCHEMA,
    },
  });

  return parseAIJsonResponse<PresentationPlanResponse>(response.text);
};

/**
 * Generate contextual image prompt suggestions by analyzing the entire deck.
 *
 * Returns 4 alternative subject prompts that maintain visual coherence
 * with the presentation theme and narrative flow.
 *
 * @param presentation - The full presentation
 * @param currentSlideIndex - Index of the slide to generate suggestions for
 * @returns Array of 4 alternative image subject descriptions
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
    isCurrent: idx === currentSlideIndex,
  }));

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `You are an expert Visual Director analyzing a presentation deck to suggest alternative image subjects.

PRESENTATION CONTEXT:
- Topic: "${presentation.topic}"
- Theme ID: "${presentation.themeId}"
- Visual Aesthetic (FIXED - do not modify): "${presentation.visualStyle}"

DECK STRUCTURE:
${deckContext
  .map(
    (s) => `
Slide ${s.index}${s.isCurrent ? ' [CURRENT SLIDE]' : ''}:
  Title: "${s.title}"
  Content: ${s.content.join('; ')}
  Image Subject: "${s.currentPrompt}"
`
  )
  .join('\n')}

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
      responseMimeType: 'application/json',
    },
  });

  return parseAIJsonResponse<string[]>(response.text);
};
