/**
 * Copilot Services
 *
 * Focused services for the copilot agent functionality.
 */

// Journal helpers
export { createJournalEntry } from './journalHelpers';
export type { JournalEntryOptions } from './journalHelpers';

// Theme suggestion
export { suggestThemeForSession } from './themeSuggestion';
export type { ThemeSuggestionWithJournal } from './themeSuggestion';

// Deck conversion
export { convertSessionToDeckPlan, convertSessionToDeckPlanWithTheme } from './deckConversion';
export type { SlideData, DeckPlan, DeckPlanWithJournal } from './deckConversion';

// Research helpers
export { performResearch } from './researchHelpers';
