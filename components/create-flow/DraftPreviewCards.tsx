/**
 * DraftPreviewCards
 *
 * Inline preview of slides during creation flow.
 * Shows skeleton cards or generated slide previews.
 *
 * KISS: Simple preview component < 80 lines
 * SOLID-S: Only displays preview, no editing
 * DRY: Reuses patterns from RoughDraftSlideCard (simplified)
 */

import React from 'react';
import { FileText, Sparkles, Loader2 } from 'lucide-react';

export interface PreviewSlide {
  id: string;
  title: string;
  content: string[];
  isLoading?: boolean;
}

interface DraftPreviewCardsProps {
  slides: PreviewSlide[];
  isGenerating: boolean;
  maxDisplay?: number;
}

/** Single preview card - collapsed view only */
const PreviewCard: React.FC<{ slide: PreviewSlide; index: number }> = ({ slide, index }) => {
  if (slide.isLoading) {
    return (
      <div className="bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#D4E5D4] rounded" />
          <div className="h-4 bg-[#D4E5D4] rounded flex-1" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-[#D4E5D4] rounded w-3/4" />
          <div className="h-3 bg-[#D4E5D4] rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D4E5D4] hover:border-[#6B8E6B]/50 rounded-lg p-4 transition-all duration-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 bg-[#6B8E6B] text-white text-[10px] font-bold flex items-center justify-center rounded">
          {index + 1}
        </span>
        <h4 className="text-sm font-medium text-[#1E2E1E] truncate flex-1">
          {slide.title}
        </h4>
      </div>
      <div className="space-y-1">
        {slide.content.slice(0, 2).map((text, i) => (
          <p key={i} className="text-xs text-[#8FA58F] truncate flex items-start gap-1.5">
            <span className="text-[#D4E5D4]">•</span>
            {text}
          </p>
        ))}
        {slide.content.length > 2 && (
          <p className="text-[10px] text-[#8FA58F]/60">+{slide.content.length - 2} more...</p>
        )}
      </div>
    </div>
  );
};

export const DraftPreviewCards: React.FC<DraftPreviewCardsProps> = ({
  slides,
  isGenerating,
  maxDisplay = 3,
}) => {
  const displaySlides = slides.slice(0, maxDisplay);
  const remainingCount = slides.length - maxDisplay;

  if (isGenerating && slides.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-[#6B8E6B]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating slide structure...</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map((i) => (
            <PreviewCard key={i} slide={{ id: `skeleton-${i}`, title: '', content: [], isLoading: true }} index={i - 1} />
          ))}
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="text-center py-8 text-[#8FA58F]">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Enter a topic to see your slide preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-[#8FA58F]">
        <Sparkles className="w-3.5 h-3.5 text-[#6B8E6B]" />
        <span>Preview: {slides.length} slides</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {displaySlides.map((slide, i) => (
          <PreviewCard key={slide.id} slide={slide} index={i} />
        ))}
      </div>
      {remainingCount > 0 && (
        <p className="text-xs text-[#8FA58F] text-center">
          +{remainingCount} more slides
        </p>
      )}
    </div>
  );
};
