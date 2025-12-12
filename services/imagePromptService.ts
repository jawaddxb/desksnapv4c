/**
 * Image Prompt Service
 *
 * Handles refinement and enhancement of image prompts.
 * Single responsibility: Transform and optimize image prompts for generation.
 */

import { ImageStylePreset } from '../types';
import { getAIClient } from './aiClient';
import { REFINEMENT_INSTRUCTIONS } from '../lib/prompts';

export type RefinementFocus = keyof typeof REFINEMENT_INSTRUCTIONS;

/**
 * Refine an image prompt according to a specific refinement focus.
 *
 * @param originalPrompt - The original image prompt
 * @param focus - The refinement goal (lighting, composition, mood, etc.)
 * @returns The refined prompt string
 */
export const refineImagePrompt = async (
  originalPrompt: string,
  focus: RefinementFocus = 'general'
): Promise<string> => {
  const ai = getAIClient();
  const instruction = REFINEMENT_INSTRUCTIONS[focus];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Act as a Prompt Engineer. Rewrite the following image prompt to satisfy the specific refinement goal.

      Original Prompt: "${originalPrompt}"

      Refinement Goal: ${instruction}

      Return ONLY the new prompt string, no markdown or explanations.`,
  });
  return response.text?.trim() || originalPrompt;
};

/**
 * Image style instructions for each preset.
 */
const IMAGE_STYLE_INSTRUCTIONS: Record<ImageStylePreset, string> = {
  vivid:
    'Enhance for vibrant, saturated colors. Add rich color contrast, make the scene feel alive and energetic.',
  muted:
    'Adjust for soft, desaturated tones. Create a calm, understated aesthetic with earth tones and pastels.',
  'high-contrast':
    'Optimize for dramatic contrast. Deep blacks, bright highlights, strong shadows, cinematic feel.',
  soft: 'Create a soft, dreamy atmosphere. Gentle lighting, diffused edges, warm and inviting mood.',
};

/**
 * Enhance an image prompt with a specific visual style preset.
 *
 * @param originalPrompt - The original image prompt
 * @param stylePreset - The visual style to apply (vivid, muted, high-contrast, soft)
 * @returns The enhanced prompt string
 */
export const enhanceImagePrompt = async (
  originalPrompt: string,
  stylePreset: ImageStylePreset
): Promise<string> => {
  const ai = getAIClient();
  const instruction = IMAGE_STYLE_INSTRUCTIONS[stylePreset];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an image prompt engineer. Enhance this prompt for a specific visual style.

STYLE GOAL: ${instruction}

ORIGINAL PROMPT: "${originalPrompt}"

Rewrite the prompt to achieve the style goal. Add lighting, color, and atmosphere modifiers. Keep the core subject intact.

Return ONLY the new prompt string, no markdown or explanations.`,
  });

  return response.text?.trim() || originalPrompt;
};
