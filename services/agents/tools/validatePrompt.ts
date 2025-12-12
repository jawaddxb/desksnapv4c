/**
 * Validate Prompt Tool
 *
 * Validates an image prompt against the presentation topic.
 * Scores the prompt 0-100 based on relevance, specificity, and safety.
 */

import { getAIClient } from '../../aiClient';
import { parseAIJsonResponse } from '../../ai/parseJson';
import { PromptValidationResult, ValidatePromptParams } from '../types';
import { getTextModel } from '../../../config';

/**
 * Validates an image prompt for topic relevance and quality.
 *
 * Scoring criteria (100 points total):
 * - Topic relevance: 40 points - Does the prompt describe something related to the topic?
 * - Specificity: 20 points - Is the prompt specific enough to generate a relevant image?
 * - No generic items: 20 points - Does it avoid unrelated generic imagery?
 * - No text/brands: 20 points - Does it avoid describing text, logos, or brand names?
 */
export async function validateImagePrompt(
  params: ValidatePromptParams
): Promise<PromptValidationResult> {
  const { prompt, topic, slideTitle, slideContent } = params;
  const ai = getAIClient();

  const contentContext = slideContent?.length
    ? `\nSLIDE CONTENT:\n${slideContent.map((c, i) => `- ${c}`).join('\n')}`
    : '';

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `You are a strict image prompt validator for a presentation generator.
Your job is to evaluate if this image prompt will generate an image that is VISUALLY RELEVANT to the presentation topic.

PRESENTATION TOPIC: "${topic}"
SLIDE TITLE: "${slideTitle}"${contentContext}

IMAGE PROMPT TO VALIDATE:
"${prompt}"

Score the prompt 0-100 based on these criteria:

1. TOPIC RELEVANCE (40 points max):
   - Does the prompt describe something visually related to "${topic}"?
   - Would someone looking at the generated image understand it relates to the topic?
   - Score 0 if it describes completely unrelated items (e.g., perfume bottles for a pet business)
   - Score 40 if it directly depicts the topic's subject matter

2. SPECIFICITY (20 points max):
   - Is the prompt specific enough to generate a relevant, on-topic image?
   - Does it describe concrete visual elements rather than abstract concepts?
   - Score 0 for vague prompts like "elegant design" with no subject
   - Score 20 for prompts with clear, specific visual descriptions

3. NO GENERIC/UNRELATED ITEMS (20 points max):
   - Does the prompt AVOID describing generic luxury items unrelated to the topic?
   - Watch for: perfume bottles, fashion items, handbags, watches (unless topic is about those)
   - Score 0 if it describes items that have nothing to do with the topic
   - Score 20 if all described items relate to the topic

4. NO TEXT/BRANDS (20 points max):
   - Does the prompt AVOID describing text, words, brand names, logos, or watermarks?
   - Watch for: website interfaces with text, signs with writing, branded items
   - Score 0 if it explicitly asks for text or brand names in the image
   - Score 20 if it describes only visual imagery without text

CRITICAL EXAMPLES:
- Topic "Pet Birthday Gifts" + Prompt describing "perfume bottle" = Score ~20 (unrelated)
- Topic "Pet Birthday Gifts" + Prompt describing "elegant gift box with dog treats" = Score ~85 (relevant)
- Topic "Dubai Real Estate" + Prompt describing "luxury handbags" = Score ~20 (unrelated)
- Topic "Dubai Real Estate" + Prompt describing "modern Dubai skyline" = Score ~90 (relevant)

Return your evaluation as JSON:
{
  "isValid": boolean (true if score >= 70),
  "score": number (0-100),
  "issues": ["list of specific problems found"],
  "suggestions": ["how to fix the issues"]
}`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const result = await parseAIJsonResponse<PromptValidationResult>(response.text);

  // Ensure isValid aligns with score
  return {
    ...result,
    isValid: result.score >= 70,
  };
}

/**
 * Quick validation check - returns true if prompt likely passes.
 * Useful for pre-filtering before full validation.
 */
export async function quickValidatePrompt(
  prompt: string,
  topic: string
): Promise<boolean> {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `Quick check: Does this image prompt relate to the topic "${topic}"?

IMAGE PROMPT: "${prompt}"

Reply with just "yes" or "no".`,
  });

  const answer = response.text?.trim().toLowerCase();
  return answer === 'yes';
}
