/**
 * Types Index
 *
 * Exports all type definitions from the types folder.
 */

// Event types for hook communication
export * from './events';

// Rough draft types
export * from './roughDraft';

// Ideation types
export * from './ideation';

// Export types (PDF, PPT, Google Slides)
export * from './export';

// Beautify types
export * from './beautify';

// Agent types (logs, actions)
export * from './agents';

// MainStage domain props (ISP-compliant interface segregation)
export * from './mainStage';

// DeckViewCoordinator domain props (ISP-compliant interface segregation)
export * from './deckViewCoordinator';

// Re-export main types from the root types.ts for convenience
// Note: Main types are still in ./types.ts for backwards compatibility
