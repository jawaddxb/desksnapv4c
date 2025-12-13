/**
 * Sources Agent Categorization
 *
 * AI-powered content categorization for extracted content.
 */

import { getAIClient } from '../aiClient';
import { getTextModel } from '../../config';
import { DeckRecipe, NoteCategory, getRecipeColumns } from '../../types/ideation';
import { ComprehensiveContent } from '../firecrawlService';
import { CategorizedNote } from './types';

/**
 * Use AI to categorize ALL content from a web page into structured notes
 * This extracts EVERYTHING - statistics, quotes, frameworks, examples, etc.
 */
export async function categorizeContentWithAI(
  content: ComprehensiveContent,
  recipe?: DeckRecipe
): Promise<CategorizedNote[]> {
  const ai = getAIClient();
  const columns = getRecipeColumns(recipe);

  const prompt = `Analyze this content and categorize EVERY piece of information into structured notes.

CONTENT FROM: ${content.title}
URL: ${content.url}
---
${content.fullMarkdown}
---

CRITICAL: Extract EVERYTHING. Do not skip any information. Each distinct fact, insight, or piece of data should become a separate note.

For EACH piece of information, categorize:

1. content: The information itself (be complete but concise, max 200 words)
2. theme: What topic does this belong to? Be specific. Examples:
   - "AI Adoption Trends"
   - "Market Statistics"
   - "Technology Capabilities"
   - "Business Impact"
   - "Implementation Challenges"
   - "Case Studies"
   - "Expert Opinions"
   - "Future Predictions"
3. type: The content type (MUST be one of these exact values):
   - "statistic" - numbers, percentages, data points, market sizes
   - "quote" - expert quotes, testimonials, attributed statements
   - "framework" - processes, methodologies, models, step-by-step approaches
   - "example" - case studies, real-world applications, company stories
   - "definition" - key term definitions, concept explanations
   - "insight" - conclusions, key takeaways, analysis points
   - "trend" - industry trends, predictions, forecasts
   - "comparison" - comparisons between things, before/after, alternatives
4. column: Best-fit column from this list: ${columns.join(', ')}
5. excerpt: An exact quote from the source (max 50 words) that supports this note

Return JSON array with ALL extracted content:
[
  {
    "content": "...",
    "theme": "...",
    "type": "statistic|quote|framework|example|definition|insight|trend|comparison",
    "column": "...",
    "excerpt": "..."
  }
]

IMPORTANT:
- Extract 15-50 notes depending on content richness
- Every statistic should be its own note
- Every expert quote should be its own note
- Frameworks should include their components
- Case studies should capture key learnings
- Don't combine unrelated information

Return ONLY valid JSON array.`;

  try {
    console.log('[categorizeContentWithAI] Analyzing content with AI...');

    const response = await ai.models.generateContent({
      model: getTextModel('fast'),
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response from AI');

    const categorized = JSON.parse(text) as CategorizedNote[];
    console.log(`[categorizeContentWithAI] Extracted ${categorized.length} categorized notes`);

    return categorized;
  } catch (error) {
    console.error('[categorizeContentWithAI] Error:', error);
    throw new Error(`Failed to categorize content: ${error}`);
  }
}

/**
 * Get unique themes from categorized notes
 */
export function extractUniqueThemes(notes: CategorizedNote[]): string[] {
  const themes = new Set<string>();
  for (const note of notes) {
    if (note.theme) themes.add(note.theme);
  }
  return Array.from(themes).sort();
}

/**
 * Get unique content types from categorized notes
 */
export function extractUniqueTypes(notes: CategorizedNote[]): NoteCategory[] {
  const types = new Set<NoteCategory>();
  for (const note of notes) {
    if (note.type) types.add(note.type);
  }
  return Array.from(types);
}
