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

export { useContentRefinement } from './useContentRefinement';
export type { UseContentRefinementOptions, UseContentRefinementReturn } from './useContentRefinement';

export {
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from './useDeckHelpers';
export type { SlidePlan, PresentationPlan } from './useDeckHelpers';
