/**
 * Utils Index
 *
 * Centralized exports for all utility functions.
 */

// Case conversion utilities
export {
  snakeToCamel,
  camelToSnake,
  snakeToCamelString,
  camelToSnakeString,
  convertKeysSnakeToCamel,
  convertKeysCamelToSnake,
  fromBackend,
  toBackend,
} from './caseConversion';

export type { SnakeToCamel, CamelToSnake } from './caseConversion';

// Slide index mapping utilities
export {
  createSlideIndexMap,
  getOriginalIndex,
  slidesNeedingImages,
  slidesWithImages,
} from './slideIndexMapping';

// Slide update helpers (pure functions)
export {
  updateSlideAtIndex,
  updateAllSlides,
  updateSlidesWhere,
  updateSlidesByIds,
  swapSlides,
  moveSlide,
  shuffleLayoutVariants,
} from './slideUpdateHelpers';

// ID generation utilities
export {
  generateId,
  generateNumericId,
  generateUUID,
} from './idGenerator';

// Export helpers (PDF/PPT)
export {
  waitForImages,
  waitForFonts,
  waitForRenderReady,
} from './exportHelpers';
