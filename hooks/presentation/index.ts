/**
 * Presentation Hooks
 *
 * Focused hooks for presentation management.
 * These are used internally by useDeck.
 */

export { useSlideUpdater } from './useSlideUpdater';
export type { UseSlideUpdaterOptions, UseSlideUpdaterReturn } from './useSlideUpdater';

export { useImageGeneration } from './useImageGeneration';
export type { UseImageGenerationOptions, UseImageGenerationReturn } from './useImageGeneration';

export { useSyncImageGeneration } from './useSyncImageGeneration';
export type { UseSyncImageGenerationOptions, UseSyncImageGenerationReturn } from './useSyncImageGeneration';

export { useAsyncImageGeneration } from './useAsyncImageGeneration';
export type { UseAsyncImageGenerationOptions, UseAsyncImageGenerationReturn } from './useAsyncImageGeneration';

export { useContentRefinement } from './useContentRefinement';
export type { UseContentRefinementOptions, UseContentRefinementReturn } from './useContentRefinement';

export {
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from './useDeckHelpers';
export type { SlidePlan, PresentationPlan } from './useDeckHelpers';

export { useThemeManager } from './useThemeManager';
export type { UseThemeManagerOptions, UseThemeManagerResult } from './useThemeManager';

export { useDeckUIState } from './useDeckUIState';
export type { UseDeckUIStateOptions, UseDeckUIStateResult, SaveStatus } from './useDeckUIState';

export { useDeckSyncState } from './useDeckSyncState';
export type { UseDeckSyncStateOptions, UseDeckSyncStateResult } from './useDeckSyncState';
