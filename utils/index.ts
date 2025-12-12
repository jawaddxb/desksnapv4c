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
