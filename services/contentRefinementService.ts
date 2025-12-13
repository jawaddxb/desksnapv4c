/**
 * Content Refinement Service
 *
 * Handles AI-powered refinement of slide content.
 * Single responsibility: Transform slide text based on tone and content goals.
 */

import { ToneType, ContentRefinementType } from '../types';
import { getAIClient } from './aiClient';
import { parseAIJsonResponse } from './ai/parseJson';
import { getTextModel } from '../config';

/**
 * Tone instructions for content refinement.
 */
const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  professional:
    'Rewrite in a formal, confident business tone. Use precise language, avoid colloquialisms, and maintain authority.',
  casual:
    'Rewrite in a friendly, conversational tone. Use simple words, contractions, and a warm approach.',
  technical:
    'Rewrite with precise, detailed technical language. Include specific terminology and quantifiable details where appropriate.',
  persuasive:
    'Rewrite to be compelling and action-oriented. Use power words, create urgency, and emphasize benefits.',
  executive:
    'Rewrite to be ultra-concise and bottom-line focused. Lead with conclusions, eliminate fluff, use bullet-friendly phrasing.',
};

/**
 * Content refinement type instructions.
 */
const CONTENT_REFINEMENT_INSTRUCTIONS: Record<ContentRefinementType, string> = {
  expand:
    'Add more depth and detail to each point. Include examples, supporting information, or context. Expand brief phrases into complete thoughts.',
  simplify:
    'Make the content more accessible. Use shorter sentences, simpler vocabulary, and remove jargon. Target a general audience.',
  clarify:
    'Improve clarity and readability. Remove ambiguity, make each point self-contained, and ensure logical flow between points.',
  storytelling:
    'Add narrative elements. Use "we/you" language, create a journey, add emotional hooks, and frame points as part of a story arc.',
};

/**
 * Result from content refinement operations.
 */
export interface ContentRefinementResult {
  title: string;
  content: string[];
}

/**
 * Options for content refinement.
 */
interface RefineContentOptions {
  /** Whether bullet count can be adjusted */
  allowBulletCountChange?: boolean;
}

/**
 * Generic content refinement function.
 * Core implementation used by all refinement operations.
 *
 * @param title - The slide title
 * @param content - Array of bullet points
 * @param instruction - The refinement instruction to apply
 * @param role - The AI role description
 * @param options - Optional settings
 * @returns Refined title and content
 */
async function refineContent(
  title: string,
  content: string[],
  instruction: string,
  role: string,
  options: RefineContentOptions = {}
): Promise<ContentRefinementResult> {
  const ai = getAIClient();
  const { allowBulletCountChange = false } = options;

  const bulletInstruction = allowBulletCountChange
    ? 'You may adjust the number of bullets if the refinement requires it (e.g., expand may add bullets, simplify may merge).'
    : 'Keep the same number of bullets.';

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `You are a presentation ${role}. Transform this slide content according to the instruction.

INSTRUCTION: ${instruction}

CURRENT SLIDE:
Title: "${title}"
Bullets:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return ONLY valid JSON with this exact structure:
{"title": "new title", "content": ["bullet 1", "bullet 2", ...]}

${bulletInstruction} Do not add markdown or explanations.`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return parseAIJsonResponse<ContentRefinementResult>(response.text);
}

/**
 * Refine slide content according to a specific tone.
 *
 * @param title - The slide title
 * @param content - Array of bullet points
 * @param tone - The tone to apply (professional, casual, technical, etc.)
 * @returns Refined title and content
 */
export const refineSlideContent = (
  title: string,
  content: string[],
  tone: ToneType
): Promise<ContentRefinementResult> =>
  refineContent(title, content, TONE_INSTRUCTIONS[tone], 'copywriter', {
    allowBulletCountChange: false,
  });

/**
 * Refine slide content according to a specific refinement type.
 *
 * @param title - The slide title
 * @param content - Array of bullet points
 * @param refinementType - The type of refinement (expand, simplify, clarify, storytelling)
 * @returns Refined title and content
 */
export const refineSlideContentByType = (
  title: string,
  content: string[],
  refinementType: ContentRefinementType
): Promise<ContentRefinementResult> =>
  refineContent(title, content, CONTENT_REFINEMENT_INSTRUCTIONS[refinementType], 'content optimizer', {
    allowBulletCountChange: true,
  });
