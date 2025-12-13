/**
 * useSlideUpdater Hook
 *
 * Provides helper functions for updating slides within a presentation.
 * Uses pure utility functions from utils/slideUpdateHelpers internally.
 */

import { useCallback } from 'react';
import { Presentation, Slide } from '@/types';
import {
  updateSlideAtIndex as updateSlideAtIndexUtil,
  updateAllSlides as updateAllSlidesUtil,
  swapSlides,
  shuffleLayoutVariants as shuffleLayoutVariantsUtil,
} from '@/utils/slideUpdateHelpers';

export interface UseSlideUpdaterOptions {
  /** Current presentation state */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Currently active slide index */
  activeSlideIndex: number;
}

export interface UseSlideUpdaterReturn {
  /** Update the active slide with partial properties */
  updateSlide: (updates: Partial<Slide>) => void;
  /** Update a specific slide by index */
  updateSlideAtIndex: (index: number, updates: Partial<Slide>) => void;
  /** Update multiple slides at once */
  updateAllSlides: (updater: (slide: Slide, index: number) => Partial<Slide>) => void;
  /** Move a slide up or down */
  moveSlide: (index: number, direction: 'up' | 'down') => void;
  /** Shuffle layout variants for all slides */
  shuffleLayoutVariants: () => void;
}

export function useSlideUpdater({
  presentation,
  setPresentation,
  activeSlideIndex,
}: UseSlideUpdaterOptions): UseSlideUpdaterReturn {

  /**
   * Update the currently active slide with partial properties.
   */
  const updateSlide = useCallback((updates: Partial<Slide>) => {
    if (!presentation) return;
    setPresentation(prev => updateSlideAtIndexUtil(prev, activeSlideIndex, updates));
  }, [presentation, setPresentation, activeSlideIndex]);

  /**
   * Update a specific slide by index.
   */
  const updateSlideAtIndex = useCallback((index: number, updates: Partial<Slide>) => {
    setPresentation(prev => updateSlideAtIndexUtil(prev, index, updates));
  }, [setPresentation]);

  /**
   * Update multiple slides at once using an updater function.
   */
  const updateAllSlides = useCallback((updater: (slide: Slide, index: number) => Partial<Slide>) => {
    setPresentation(prev => updateAllSlidesUtil(prev, updater));
  }, [setPresentation]);

  /**
   * Move a slide up or down in the order.
   */
  const moveSlide = useCallback((index: number, direction: 'up' | 'down') => {
    if (!presentation) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === presentation.slides.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setPresentation(prev => swapSlides(prev, index, targetIndex));
  }, [presentation, setPresentation]);

  /**
   * Randomize layout variants for all slides.
   */
  const shuffleLayoutVariants = useCallback(() => {
    if (!presentation) return;
    setPresentation(prev => shuffleLayoutVariantsUtil(prev));
  }, [presentation, setPresentation]);

  return {
    updateSlide,
    updateSlideAtIndex,
    updateAllSlides,
    moveSlide,
    shuffleLayoutVariants,
  };
}

export default useSlideUpdater;
