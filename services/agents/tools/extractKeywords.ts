/**
 * Extract Keywords Tool
 *
 * Extracts visual keywords and subjects from a topic.
 * These keywords help validate and guide prompt generation.
 */

import { getAIClient } from '../../aiClient';
import { parseAIJsonResponse } from '../../ai/parseJson';
import { ExtractKeywordsParams, ExtractKeywordsResult } from '../types';
import { getTextModel } from '../../../config';

/**
 * Extracts keywords from a topic to guide prompt validation and generation.
 *
 * Returns:
 * - keywords: Core topic words (e.g., "pet", "birthday", "Dubai")
 * - visualSubjects: Concrete visual things related to the topic (e.g., "dogs", "cats", "gift boxes")
 * - avoidTerms: Things that should NOT appear if unrelated to topic
 */
export async function extractTopicKeywords(
  params: ExtractKeywordsParams
): Promise<ExtractKeywordsResult> {
  const { topic } = params;
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `Analyze this presentation topic and extract visual keywords.

TOPIC: "${topic}"

Extract:
1. KEYWORDS: The core words from the topic (3-5 words)
2. VISUAL SUBJECTS: Concrete things that should appear in images for this topic (5-8 items)
   - Think: What would you PHOTOGRAPH to illustrate this topic?
   - Be specific: "golden retriever" not just "animal"
   - Include relevant objects, settings, and scenes

3. AVOID TERMS: Things that should NOT appear in images (unless directly relevant)
   - Generic luxury items that don't relate
   - Common hallucinations like perfume, fashion items, etc.

EXAMPLES:
Topic: "Pet Birthday Party Business in Dubai"
{
  "keywords": ["pet", "birthday", "party", "Dubai", "business"],
  "visualSubjects": ["dogs", "cats", "birthday cakes for pets", "pet treats", "party decorations", "pet collars", "pet toys", "Dubai skyline", "luxury pet spa"],
  "avoidTerms": ["perfume bottles", "fashion handbags", "human jewelry", "wine glasses", "corporate office"]
}

Topic: "Sustainable Fashion Startup"
{
  "keywords": ["sustainable", "fashion", "eco-friendly", "clothing"],
  "visualSubjects": ["organic cotton clothing", "recycled fabric", "eco-friendly packaging", "minimalist fashion store", "natural dyes", "handmade garments"],
  "avoidTerms": ["fast food", "cars", "electronics", "industrial machinery"]
}

Return JSON:
{
  "keywords": ["array", "of", "keywords"],
  "visualSubjects": ["array", "of", "visual", "subjects"],
  "avoidTerms": ["array", "of", "things", "to", "avoid"]
}`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  return parseAIJsonResponse<ExtractKeywordsResult>(response.text);
}

/**
 * Checks if a prompt contains any of the "avoid" terms.
 * Returns the terms found, if any.
 */
export function checkForAvoidTerms(prompt: string, avoidTerms: string[]): string[] {
  const promptLower = prompt.toLowerCase();
  return avoidTerms.filter((term) => promptLower.includes(term.toLowerCase()));
}

/**
 * Checks if a prompt contains at least one visual subject.
 */
export function hasVisualSubject(prompt: string, visualSubjects: string[]): boolean {
  const promptLower = prompt.toLowerCase();
  return visualSubjects.some((subject) => promptLower.includes(subject.toLowerCase()));
}
