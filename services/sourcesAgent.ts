/**
 * Sources Agent Service (Facade)
 *
 * BACKWARD COMPATIBILITY LAYER
 *
 * This file re-exports from the new sources/ directory structure.
 * New code should import from 'services/sources' directly.
 *
 * @deprecated Import from 'services/sources' instead.
 */

// Re-export everything from the new directory structure
export {
  runSourcesAgentLoop,
  buildSourcesPrompt,
  createSourcesToolExecutor,
  formatTime,
  extractVideoId,
  getColumnIndex,
  extractYouTubeTranscript,
  extractWebPageContent,
  categorizeContentWithAI,
  extractUniqueThemes,
  extractUniqueTypes,
} from './sources';

export type {
  ComprehensiveExtractionResult,
  CategorizedNote,
} from './sources';
