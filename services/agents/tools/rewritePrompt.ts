/**
 * Rewrite Prompt Tool
 *
 * Rewrites an image prompt to better match the presentation topic
 * while preserving the visual style and aesthetic.
 */

import { getAIClient } from '../../aiClient';
import { parseAIJsonResponse } from '../../ai/parseJson';
import { RewritePromptParams, RewritePromptResult } from '../types';

/**
 * Rewrites an image prompt to fix identified issues while maintaining visual style.
 *
 * The rewritten prompt will:
 * 1. Describe something visually related to the topic
 * 2. Maintain the aesthetic from the visual style
 * 3. Avoid text, brands, logos, and watermarks
 * 4. Be specific about the subject matter
 */
export async function rewriteImagePrompt(
  params: RewritePromptParams
): Promise<RewritePromptResult> {
  const { originalPrompt, topic, issues, visualStyle, slideTitle, slideContent } = params;
  const ai = getAIClient();

  const contentContext = slideContent?.length
    ? `\nSLIDE CONTENT (for context):\n${slideContent.map((c) => `- ${c}`).join('\n')}`
    : '';

  const issuesList = issues.length > 0 ? issues.join('\n- ') : 'Prompt not relevant to topic';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an expert image prompt engineer. Your task is to REWRITE an image prompt that failed validation.

PRESENTATION TOPIC: "${topic}"
SLIDE TITLE: "${slideTitle}"${contentContext}

VISUAL STYLE TO MAINTAIN:
"${visualStyle}"

ORIGINAL (FAILED) PROMPT:
"${originalPrompt}"

ISSUES TO FIX:
- ${issuesList}

YOUR TASK:
Rewrite the image prompt to fix ALL issues while keeping the visual style.

REQUIREMENTS:
1. The new prompt MUST describe something VISUALLY RELATED to "${topic}"
   - If the topic is about pets, show pets or pet products
   - If the topic is about real estate, show buildings or property
   - If the topic is about food, show food or restaurants

2. MAINTAIN the visual style aesthetic:
   - Keep the same lighting style (e.g., dramatic rim lighting, soft natural light)
   - Keep the same composition approach (e.g., macro, wide angle, portrait)
   - Keep the same mood (e.g., luxurious, minimal, energetic)
   - Keep the same color palette hints (e.g., gold accents, black marble)

3. DO NOT describe any:
   - Text, words, or letters
   - Brand names or logos
   - Watermarks or URLs
   - UI elements with readable content

4. BE SPECIFIC about the subject matter:
   - Instead of "elegant product" say "elegant pet collar with gold buckle"
   - Instead of "luxury gift box" say "luxury gift box containing dog treats"
   - Instead of "website interface" say "close-up of a hand holding a smartphone"

EXAMPLE TRANSFORMATIONS:
- Original: "Elegant perfume bottle on marble" → New: "Elegant pet grooming brush with gold handle on marble"
- Original: "Website showing product gallery" → New: "Luxurious pet boutique storefront with gold signage"
- Original: "Gift box with ribbon" → New: "Premium pet birthday gift box with golden ribbon, revealing gourmet dog treats inside"

Return your rewrite as JSON:
{
  "newPrompt": "the complete rewritten image prompt",
  "reasoning": "brief explanation of what you changed and why"
}`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return parseAIJsonResponse<RewritePromptResult>(response.text);
}

/**
 * Generates a fresh prompt from scratch based on topic and slide context.
 * Used when the original prompt is too far off to salvage.
 */
export async function generateFreshPrompt(
  topic: string,
  slideTitle: string,
  slideContent: string[],
  visualStyle: string
): Promise<string> {
  const ai = getAIClient();

  const contentContext = slideContent.length
    ? `\nSLIDE CONTENT:\n${slideContent.map((c) => `- ${c}`).join('\n')}`
    : '';

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate an image prompt for a presentation slide.

PRESENTATION TOPIC: "${topic}"
SLIDE TITLE: "${slideTitle}"${contentContext}

VISUAL STYLE:
"${visualStyle}"

Generate a detailed image prompt that:
1. Directly relates to the topic "${topic}"
2. Matches the visual style
3. Does NOT include any text, brands, or logos
4. Is specific and descriptive

Return ONLY the prompt string, no JSON or explanation.`,
  });

  return response.text?.trim() || '';
}
