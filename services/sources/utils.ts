/**
 * Sources Agent Utilities
 *
 * Helper functions for the sources agent.
 */

import { DeckRecipe, getRecipeColumns } from '@/types/ideation';

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get column index for a given column name, supporting all recipe types.
 * Falls back to middle column (index 2) if column not found.
 */
export function getColumnIndex(column: string, recipe?: DeckRecipe): number {
  const columns = getRecipeColumns(recipe);

  // First try exact match (case-insensitive)
  const normalizedColumn = column.toLowerCase();
  const exactIndex = columns.findIndex(c => c.toLowerCase() === normalizedColumn);
  if (exactIndex >= 0) return exactIndex;

  // Legacy mapping for pitch columns (backward compatibility)
  const legacyMap: Record<string, number> = {
    hook: 0,
    problem: 1,
    solution: 2,
    proof: 3,
    cta: 4,
  };

  // Cross-recipe semantic mapping
  const semanticMap: Record<string, string[]> = {
    // Training columns (Objective, Concept, Example, Practice, Review)
    objective: ['hook', 'context', 'what'],
    concept: ['problem', 'key points', 'why'],
    example: ['solution', 'analysis', 'how', 'examples'],
    practice: ['proof', 'implications'],
    review: ['cta', 'actions', 'summary'],

    // Explainer columns (What, Why, How, Examples, Summary)
    what: ['objective', 'hook', 'context'],
    why: ['concept', 'problem', 'key points'],
    how: ['example', 'solution', 'analysis'],
    examples: ['practice', 'proof', 'implications'],
    summary: ['review', 'cta', 'actions'],

    // Brief columns (Context, Key Points, Analysis, Implications, Actions)
    context: ['objective', 'hook', 'what'],
    'key points': ['concept', 'problem', 'why'],
    analysis: ['example', 'solution', 'how'],
    implications: ['practice', 'proof', 'examples'],
    actions: ['review', 'cta', 'summary'],
  };

  // Try semantic mapping
  for (const [targetCol, equivalents] of Object.entries(semanticMap)) {
    if (equivalents.includes(normalizedColumn)) {
      const mappedIndex = columns.findIndex(c => c.toLowerCase() === targetCol);
      if (mappedIndex >= 0) return mappedIndex;
    }
  }

  // Final fallback: use legacy map or default to middle
  return legacyMap[normalizedColumn] ?? 2;
}
