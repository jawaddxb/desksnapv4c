/**
 * Sources Agent Types
 *
 * Local types for the sources agent service.
 */

import { NoteCategory } from '@/types/ideation';

/**
 * Categorized note from AI analysis
 */
export interface CategorizedNote {
  content: string;
  theme: string;
  type: NoteCategory;
  column: string;
  excerpt: string;
}

/**
 * Result of comprehensive content extraction and categorization
 */
export interface ComprehensiveExtractionResult {
  success: boolean;
  noteCount: number;
  themes: string[];
  types: NoteCategory[];
  readyForPills: boolean;
  title: string;
  wordCount: number;
}
