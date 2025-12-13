/**
 * Slide Index Mapping Utility
 *
 * Helps manage index translation when working with filtered slide arrays.
 * Single responsibility: Map between filtered and original slide indices.
 */

import { Slide } from '@/types';

/**
 * Create a mapping from filtered indices to original indices.
 *
 * @param slides - Original array of slides
 * @param filter - Predicate to determine which slides are included
 * @returns Map from filtered index to original index
 */
export function createSlideIndexMap(
  slides: Slide[],
  filter: (slide: Slide) => boolean
): Map<number, number> {
  const indexMap = new Map<number, number>();
  let filteredIndex = 0;

  slides.forEach((slide, originalIndex) => {
    if (filter(slide)) {
      indexMap.set(filteredIndex, originalIndex);
      filteredIndex++;
    }
  });

  return indexMap;
}

/**
 * Get original index from filtered index.
 *
 * @param indexMap - Map from filtered to original indices
 * @param filteredIndex - Index in the filtered array
 * @returns Original index, or the filtered index if not found
 */
export function getOriginalIndex(
  indexMap: Map<number, number>,
  filteredIndex: number
): number {
  return indexMap.get(filteredIndex) ?? filteredIndex;
}

/**
 * Filter slides that need images (no existing imageUrl).
 */
export function slidesNeedingImages(slide: Slide): boolean {
  return !slide.imageUrl;
}

/**
 * Filter slides that have images.
 */
export function slidesWithImages(slide: Slide): boolean {
  return !!slide.imageUrl;
}
