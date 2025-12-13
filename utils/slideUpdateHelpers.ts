/**
 * Slide Update Helpers
 *
 * Pure utility functions for updating slides within a presentation.
 * These are the building blocks used by hooks and setters.
 *
 * KISS: Simple pure functions that transform state.
 * DRY: Extracted from 5+ repeated patterns across hooks.
 */

import type { Presentation, Slide } from '@/types';

/**
 * Update a single slide at a specific index.
 * Returns a new presentation with the updated slide, or null if input is null.
 *
 * @example
 * setPresentation(prev => updateSlideAtIndex(prev, index, { imageUrl, isImageLoading: false }));
 */
export function updateSlideAtIndex(
  presentation: Presentation | null,
  index: number,
  updates: Partial<Slide>
): Presentation | null {
  if (!presentation) return null;
  if (index < 0 || index >= presentation.slides.length) return presentation;

  const newSlides = [...presentation.slides];
  newSlides[index] = { ...newSlides[index], ...updates };

  return { ...presentation, slides: newSlides };
}

/**
 * Update all slides using an updater function.
 * Returns a new presentation with all slides updated.
 *
 * @example
 * setPresentation(prev => updateAllSlides(prev, slide => ({ isImageLoading: true })));
 */
export function updateAllSlides(
  presentation: Presentation | null,
  updater: (slide: Slide, index: number) => Partial<Slide>
): Presentation | null {
  if (!presentation) return null;

  const newSlides = presentation.slides.map((slide, index) => ({
    ...slide,
    ...updater(slide, index),
  }));

  return { ...presentation, slides: newSlides };
}

/**
 * Update slides that match a predicate.
 * Returns a new presentation with matching slides updated.
 *
 * @example
 * setPresentation(prev => updateSlidesWhere(
 *   prev,
 *   slide => slidesToGenerate.some(s => s.id === slide.id),
 *   { isImageLoading: true }
 * ));
 */
export function updateSlidesWhere(
  presentation: Presentation | null,
  predicate: (slide: Slide, index: number) => boolean,
  updates: Partial<Slide>
): Presentation | null {
  if (!presentation) return null;

  const newSlides = presentation.slides.map((slide, index) =>
    predicate(slide, index) ? { ...slide, ...updates } : slide
  );

  return { ...presentation, slides: newSlides };
}

/**
 * Update slides by their IDs.
 * Returns a new presentation with matching slides updated.
 *
 * @example
 * setPresentation(prev => updateSlidesByIds(prev, ['slide-1', 'slide-2'], { isImageLoading: true }));
 */
export function updateSlidesByIds(
  presentation: Presentation | null,
  slideIds: string[],
  updates: Partial<Slide>
): Presentation | null {
  if (!presentation) return null;

  const idSet = new Set(slideIds);
  return updateSlidesWhere(presentation, slide => idSet.has(slide.id), updates);
}

/**
 * Swap two slides in the presentation.
 * Returns a new presentation with slides swapped, or original if indices are invalid.
 */
export function swapSlides(
  presentation: Presentation | null,
  indexA: number,
  indexB: number
): Presentation | null {
  if (!presentation) return null;
  if (indexA < 0 || indexA >= presentation.slides.length) return presentation;
  if (indexB < 0 || indexB >= presentation.slides.length) return presentation;
  if (indexA === indexB) return presentation;

  const newSlides = [...presentation.slides];
  [newSlides[indexA], newSlides[indexB]] = [newSlides[indexB], newSlides[indexA]];

  return { ...presentation, slides: newSlides };
}

/**
 * Move a slide up or down in the order.
 * Returns a new presentation with the slide moved.
 */
export function moveSlide(
  presentation: Presentation | null,
  index: number,
  direction: 'up' | 'down'
): Presentation | null {
  if (!presentation) return null;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  return swapSlides(presentation, index, targetIndex);
}

/**
 * Shuffle layout variants for all slides.
 * Useful for randomizing the visual appearance.
 */
export function shuffleLayoutVariants(
  presentation: Presentation | null
): Presentation | null {
  return updateAllSlides(presentation, () => ({
    layoutVariant: Math.floor(Math.random() * 1000),
  }));
}
