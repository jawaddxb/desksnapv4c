/**
 * Agents Index
 *
 * Export all agent functionality from a single entry point.
 */

// Agent types
export * from './types';

// Agent tools
export * from './tools';

// Main agents
export { runImagePromptAgent, refinePromptWithAgent } from './imagePromptAgent';
export {
  runRoughDraftAgent,
  regenerateSlideWithAgent,
  type RoughDraftInput,
  type RoughDraftResult,
  type RoughDraftWorkingSlide,
  type RoughDraftSlide, // Deprecated alias for RoughDraftWorkingSlide
  type RoughDraftAgentCallbacks,
  type RoughDraftAgentOptions,
  type SlideContent,
} from './roughDraftAgent';
export {
  runScoutAgent,
  formatFindingsForPrompt,
  type ScoutOutput,
  type ScoutOptions,
} from './scoutAgent';
