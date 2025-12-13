/**
 * Copilot Agent Service (Facade)
 *
 * BACKWARD COMPATIBILITY LAYER
 *
 * This file re-exports from the copilot/ directory structure.
 * New code should import from 'services/copilot' directly.
 *
 * The agentic loop runs where the LLM decides what tools to call
 * to help the user build their ideation canvas.
 */

// Re-export types
export type {
  AgentResponse,
  ProcessedToolCall,
  ToolExecutor,
  CompletionQuestion,
  EnhancedModeOptions,
  AgentLoopOptions,
} from './copilot';

// Re-export agent loop
export { runAgentLoop } from './copilot';

// Re-export completion helpers
export {
  generateCompletionQuestion,
  summarizeToolCalls,
  checkCanvasCompletion,
} from './copilot';

// Re-export journal helpers
export { createJournalEntry } from './copilot';
export type { JournalEntryOptions } from './copilot';

// Re-export theme suggestion
export { suggestThemeForSession } from './copilot';
export type { ThemeSuggestionWithJournal } from './copilot';

// Re-export deck conversion
export { convertSessionToDeckPlan, convertSessionToDeckPlanWithTheme } from './copilot';
export type { SlideData, DeckPlan, DeckPlanWithJournal } from './copilot';

// Re-export research helpers
export { performResearch } from './copilot';
