/**
 * PresentationModeOverlay
 *
 * Overlay controls for presentation mode: close button, navigation arrows, slide counter.
 * Extracted from App.tsx to reduce complexity.
 *
 * SRP: Presentation mode UI controls.
 */

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Presentation } from '@/types';

interface PresentationModeOverlayProps {
  /** Current presentation */
  presentation: Presentation;
  /** Current slide index */
  activeSlideIndex: number;
  /** Callback to go to previous slide */
  onPreviousSlide: () => void;
  /** Callback to go to next slide */
  onNextSlide: () => void;
  /** Callback to exit presentation mode */
  onExit: () => void;
}

export function PresentationModeOverlay({
  presentation,
  activeSlideIndex,
  onPreviousSlide,
  onNextSlide,
  onExit,
}: PresentationModeOverlayProps) {
  const totalSlides = presentation.slides.length;
  const isFirstSlide = activeSlideIndex === 0;
  const isLastSlide = activeSlideIndex >= totalSlides - 1;

  return (
    <>
      {/* Close Button */}
      <button
        onClick={onExit}
        className="absolute top-6 right-6 z-[1000] p-3 bg-black/70 hover:bg-[#c5a47e] text-white hover:text-black backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Slide */}
      {!isFirstSlide && (
        <button
          onClick={onPreviousSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/30 hover:bg-black/70 text-white/50 hover:text-white backdrop-blur-sm transition-all duration-150 cursor-pointer"
        >
          <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
        </button>
      )}

      {/* Next Slide */}
      {!isLastSlide && (
        <button
          onClick={onNextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/30 hover:bg-black/70 text-white/50 hover:text-white backdrop-blur-sm transition-all duration-150 cursor-pointer"
        >
          <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
        </button>
      )}

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-4 py-1.5 bg-black/70 backdrop-blur-md text-white/80 text-[10px] font-bold uppercase tracking-widest pointer-events-none border border-white/10">
        {activeSlideIndex + 1} / {totalSlides}
      </div>
    </>
  );
}
