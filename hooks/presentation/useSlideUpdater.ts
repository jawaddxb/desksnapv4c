/**
 * useSlideUpdater Hook
 *
 * Provides helper functions for updating slides within a presentation.
 * Eliminates the repeated setCurrentPresentation patterns.
 */

import { useCallback } from 'react';
import { Presentation, Slide } from '../../types';

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
    setPresentation(prev => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], ...updates };
      return { ...prev, slides: newSlides };
    });
  }, [presentation, setPresentation, activeSlideIndex]);

  /**
   * Update a specific slide by index.
   */
  const updateSlideAtIndex = useCallback((index: number, updates: Partial<Slide>) => {
    setPresentation(prev => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      if (newSlides[index]) {
        newSlides[index] = { ...newSlides[index], ...updates };
      }
      return { ...prev, slides: newSlides };
    });
  }, [setPresentation]);

  /**
   * Update multiple slides at once using an updater function.
   */
  const updateAllSlides = useCallback((updater: (slide: Slide, index: number) => Partial<Slide>) => {
    setPresentation(prev => {
      if (!prev) return null;
      const newSlides = prev.slides.map((slide, index) => ({
        ...slide,
        ...updater(slide, index),
      }));
      return { ...prev, slides: newSlides };
    });
  }, [setPresentation]);

  /**
   * Move a slide up or down in the order.
   */
  const moveSlide = useCallback((index: number, direction: 'up' | 'down') => {
    if (!presentation) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === presentation.slides.length - 1) return;

    setPresentation(prev => {
      if (!prev) return null;
      const newSlides = [...prev.slides];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
      return { ...prev, slides: newSlides };
    });
  }, [presentation, setPresentation]);

  /**
   * Randomize layout variants for all slides.
   */
  const shuffleLayoutVariants = useCallback(() => {
    if (!presentation) return;
    setPresentation(prev => {
      if (!prev) return null;
      return {
        ...prev,
        slides: prev.slides.map(s => ({
          ...s,
          layoutVariant: Math.floor(Math.random() * 1000),
        })),
      };
    });
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
