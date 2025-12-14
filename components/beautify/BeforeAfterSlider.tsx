/**
 * BeforeAfterSlider Component
 *
 * Interactive before/after comparison slider for beautified decks.
 * KISS: Simple slider implementation using CSS clip-path.
 */

import React, { useState, useRef, useCallback } from 'react';
import type { Slide } from '@/types';
import type { SlideIR } from '@/types/beautify';
import { THEMES } from '@/config/themes';

// =============================================================================
// TYPES
// =============================================================================

interface BeforeAfterSliderProps {
  /** Original slide data from PPTX */
  beforeSlide: SlideIR;
  /** Transformed slide */
  afterSlide: Slide;
  /** Theme ID for the after slide */
  themeId: string;
}

// =============================================================================
// SIMPLE SLIDE PREVIEW
// =============================================================================

interface SlidePreviewProps {
  title: string;
  content: string[];
  imageUrl?: string;
  theme?: typeof THEMES[string];
  label: string;
  isOriginal?: boolean;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({
  title,
  content,
  imageUrl,
  theme,
  label,
  isOriginal = false,
}) => {
  const bgColor = isOriginal ? '#EDF5F0' : (theme?.colors.background || '#ffffff');
  const textColor = isOriginal ? '#1E2E1E' : (theme?.colors.text || '#000000');
  const accentColor = isOriginal ? '#8FA58F' : (theme?.colors.accent || '#6B8E6B');

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Label */}
      <div
        className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded"
        style={{
          backgroundColor: isOriginal ? '#D4E5D4' : accentColor,
          color: isOriginal ? '#1E2E1E' : '#000',
        }}
      >
        {label}
      </div>

      {/* Content area */}
      <div className="flex-1 flex p-8 pt-14 gap-6">
        {/* Text side */}
        <div className="flex-1 flex flex-col justify-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{
              color: textColor,
              fontFamily: isOriginal ? 'Arial, sans-serif' : theme?.fonts.heading,
            }}
          >
            {title || 'Untitled Slide'}
          </h2>

          <ul className="space-y-2">
            {content.slice(0, 5).map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{
                  color: isOriginal ? '#8FA58F' : textColor,
                  fontFamily: isOriginal ? 'Arial, sans-serif' : theme?.fonts.body,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                {item}
              </li>
            ))}
            {content.length > 5 && (
              <li className="text-xs opacity-50" style={{ color: textColor }}>
                +{content.length - 5} more items
              </li>
            )}
          </ul>
        </div>

        {/* Image side */}
        {imageUrl && (
          <div className="w-1/3 flex items-center justify-center">
            <div
              className="w-full aspect-square rounded-lg overflow-hidden"
              style={{
                borderRadius: isOriginal ? '0' : theme?.layout.radius,
                boxShadow: isOriginal ? 'none' : theme?.layout.shadow,
              }}
            >
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeSlide,
  afterSlide,
  themeId,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const theme = THEMES[themeId];

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none cursor-ew-resize overflow-hidden rounded-lg border border-[#D4E5D4]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After slide (full width, below) */}
      <div className="absolute inset-0">
        <SlidePreview
          title={afterSlide.title}
          content={afterSlide.content}
          imageUrl={afterSlide.imageUrl}
          theme={theme}
          label="After"
        />
      </div>

      {/* Before slide (clipped) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <SlidePreview
          title={beforeSlide.title}
          content={beforeSlide.content}
          imageUrl={beforeSlide.imageUrl}
          label="Before"
          isOriginal
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#6B8E6B] cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Handle knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-[#D4E5D4]">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-[#8FA58F] rounded-full" />
            <div className="w-0.5 h-4 bg-[#8FA58F] rounded-full" />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1E2E1E]/60 rounded-full text-[#F5FAF7] text-xs">
        Drag to compare
      </div>
    </div>
  );
};
