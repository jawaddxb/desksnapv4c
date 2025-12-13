/**
 * useKeyboardNavigation Hook
 *
 * Handles keyboard navigation for presentation mode.
 * Supports arrow keys, space, enter, and escape.
 */

import { useEffect } from 'react';
import { Presentation } from '@/types';

export interface UseKeyboardNavigationOptions {
  /** Whether presentation mode is active */
  isPresenting: boolean;
  /** Current presentation */
  presentation: Presentation | null;
  /** Currently active slide index */
  activeSlideIndex: number;
  /** Callback to change slide index */
  setActiveSlideIndex: (index: number) => void;
  /** Callback to exit presentation mode */
  onExitPresentation: () => void;
}

export interface UseKeyboardNavigationReturn {
  /** Go to next slide */
  goToNextSlide: () => void;
  /** Go to previous slide */
  goToPreviousSlide: () => void;
}

export function useKeyboardNavigation({
  isPresenting,
  presentation,
  activeSlideIndex,
  setActiveSlideIndex,
  onExitPresentation,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationReturn {

  const goToNextSlide = () => {
    if (presentation && activeSlideIndex < presentation.slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  useEffect(() => {
    if (!isPresenting || !presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onExitPresentation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, activeSlideIndex, presentation, setActiveSlideIndex, onExitPresentation]);

  return {
    goToNextSlide,
    goToPreviousSlide,
  };
}

export default useKeyboardNavigation;
