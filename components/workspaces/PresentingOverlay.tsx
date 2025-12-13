/**
 * PresentingOverlay Component
 *
 * Overlay controls shown during presentation mode.
 * Includes close, prev/next buttons, and slide counter.
 *
 * SRP: Single responsibility - presentation controls UI.
 */

import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWorkspaceMode } from '../../contexts/WorkspaceModeContext';

export interface PresentingOverlayProps {
  /** Current slide index */
  activeSlideIndex: number;
  /** Total number of slides */
  totalSlides: number;
  /** Go to previous slide */
  onPreviousSlide: () => void;
  /** Go to next slide */
  onNextSlide: () => void;
}

export const PresentingOverlay: React.FC<PresentingOverlayProps> = ({
  activeSlideIndex,
  totalSlides,
  onPreviousSlide,
  onNextSlide,
}) => {
  const { stopPresenting } = useWorkspaceMode();

  return (
    <>
      {/* Close Button */}
      <button
        onClick={stopPresenting}
        className="absolute top-6 right-6 z-[1000] p-3 bg-black/70 hover:bg-[#c5a47e] text-white hover:text-black backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Slide */}
      {activeSlideIndex > 0 && (
        <button
          onClick={onPreviousSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/30 hover:bg-black/70 text-white/50 hover:text-white backdrop-blur-sm transition-all duration-150 cursor-pointer"
        >
          <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
        </button>
      )}

      {/* Next Slide */}
      {activeSlideIndex < totalSlides - 1 && (
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
};

export default PresentingOverlay;
