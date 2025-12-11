/**
 * LayoutToolbar Component
 *
 * Floating toolbar for slide layout, typography, and AI refinement controls.
 * Refactored to use focused components and hooks.
 */

import React, { useState, useRef } from 'react';
import { Slide, ImageStylePreset } from '../types';
import {
  Columns, Maximize2, Type, LayoutTemplate,
  AlignLeft, AlignCenter, AlignRight,
  Smartphone, Square, Rows,
  Bold, Italic, Plus, Minus, Image as ImageIcon,
  X, GripHorizontal, FileText,
} from 'lucide-react';
import { useDraggable, useSlideStyles, AIRefinementMenu, ToolbarButton, ImagePromptMenu, ContentTypeSelector } from './toolbar';
import { Divider } from './ui';
import { Presentation } from '../types';

interface LayoutToolbarProps {
  slide: Slide;
  onUpdateSlide: (updates: Partial<Slide>) => void;
  mode?: 'standard' | 'wabi-sabi';
  onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
  onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
  isRefining?: boolean;
  onToggleNotes?: () => void;
  // Image prompt editing
  presentation?: Presentation | null;
  onRegenerateImage?: () => void;
  onGenerateSuggestions?: () => Promise<string[]>;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  slide,
  onUpdateSlide,
  mode = 'standard',
  onRefineContent,
  onEnhanceImage,
  isRefining = false,
  onToggleNotes,
  presentation,
  onRegenerateImage,
  onGenerateSuggestions,
}) => {
  const [activeLabel, setActiveLabel] = useState<string>(mode === 'wabi-sabi' ? 'Text Styling' : 'Layout Designer');
  const isWabiSabi = mode === 'wabi-sabi';
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Draggable toolbar
  const { isDragging, handleDragStart, dragStyle } = useDraggable({ elementRef: toolbarRef });

  // Slide styles (text, fonts, opacity)
  const {
    hasSelection,
    isTitleSelected,
    selectedContentIndex,
    isBold,
    isItalic,
    toggleBold,
    toggleItalic,
    adjustFontSize,
    currentOpacity,
    adjustOpacity,
    clearSelection,
  } = useSlideStyles({ slide, onUpdateSlide, isWabiSabi });

  // Hover label handlers
  const handleHoverStart = (label: string) => setActiveLabel(label);
  const handleHoverEnd = () => setActiveLabel(mode === 'wabi-sabi' ? 'Text Styling' : 'Layout Designer');

  // Button component with hover handlers
  const Button = ({
    active,
    onClick,
    icon,
    label,
    text,
  }: {
    active: boolean;
    onClick: () => void;
    icon?: React.FC<{ className?: string; strokeWidth?: number }>;
    label: string;
    text?: string;
  }) => (
    <ToolbarButton
      active={active}
      onClick={onClick}
      icon={icon as any}
      label={label}
      text={text}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    />
  );

  return (
    <div
      ref={toolbarRef}
      className={`absolute bottom-8 left-1/2 z-[200] flex flex-col items-center gap-3 opacity-0 group-hover/stage:opacity-100 transition-opacity duration-500 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={dragStyle}
    >
      {/* Selection indicator badge - only in wabi-sabi mode with selection */}
      {isWabiSabi && hasSelection && (
        <div className="px-3 py-1.5 bg-indigo-500 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {isTitleSelected ? 'Title Selected' : `Bullet ${selectedContentIndex + 1} Selected`}
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="ml-1 hover:bg-indigo-600 rounded p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xl shadow-2xl p-2 border border-white/20 rounded-2xl ring-1 ring-zinc-900/5">
        {/* Drag Handle */}
        <div
          onMouseDown={handleDragStart}
          className="flex items-center justify-center w-6 h-9 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors"
          title="Drag to move toolbar"
        >
          <GripHorizontal className="w-4 h-4" />
        </div>

        <Divider orientation="vertical" className="h-6 mx-1" />

        {/* LAYOUT GROUP - Standard mode only */}
        {!isWabiSabi && (
          <>
            <div className="flex gap-1">
              <Button
                active={slide.layoutType === 'split'}
                onClick={() => onUpdateSlide({ layoutType: 'split' })}
                icon={Columns}
                label="Split Layout"
              />
              <Button
                active={slide.layoutType === 'magazine'}
                onClick={() => onUpdateSlide({ layoutType: 'magazine' })}
                icon={Smartphone}
                label="Magazine Column"
              />
              <Button
                active={slide.layoutType === 'horizontal'}
                onClick={() => onUpdateSlide({ layoutType: 'horizontal' })}
                icon={Rows}
                label="Horizontal Split"
              />
              <Button
                active={slide.layoutType === 'card'}
                onClick={() => onUpdateSlide({ layoutType: 'card' })}
                icon={Square}
                label="Floating Card"
              />
              <Button
                active={slide.layoutType === 'full-bleed'}
                onClick={() => onUpdateSlide({ layoutType: 'full-bleed' })}
                icon={Maximize2}
                label="Full Bleed"
              />
              <Button
                active={slide.layoutType === 'statement'}
                onClick={() => onUpdateSlide({ layoutType: 'statement' })}
                icon={Type}
                label="Statement"
              />
              <Button
                active={slide.layoutType === 'gallery'}
                onClick={() => onUpdateSlide({ layoutType: 'gallery' })}
                icon={LayoutTemplate}
                label="Gallery Grid"
              />
            </div>

            <Divider orientation="vertical" className="h-6 mx-1" />

            {/* ALIGNMENT GROUP - Standard mode only */}
            <div className="flex gap-1">
              <Button
                active={slide.alignment === 'left'}
                onClick={() => onUpdateSlide({ alignment: 'left' })}
                icon={AlignLeft}
                label="Align Left"
              />
              <Button
                active={slide.alignment === 'center'}
                onClick={() => onUpdateSlide({ alignment: 'center' })}
                icon={AlignCenter}
                label="Align Center"
              />
              <Button
                active={slide.alignment === 'right'}
                onClick={() => onUpdateSlide({ alignment: 'right' })}
                icon={AlignRight}
                label="Align Right"
              />
            </div>

            <Divider orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* TYPOGRAPHY GROUP */}
        <div className="flex gap-1">
          <Button
            active={slide.fontScale === 'compact'}
            onClick={() => onUpdateSlide({ fontScale: 'compact' })}
            text="S"
            label="Compact Text"
          />
          <Button
            active={!slide.fontScale || slide.fontScale === 'auto'}
            onClick={() => onUpdateSlide({ fontScale: 'auto' })}
            text="M"
            label="Auto Scale"
          />
          <Button
            active={slide.fontScale === 'hero'}
            onClick={() => onUpdateSlide({ fontScale: 'hero' })}
            text="L"
            label="Hero Text"
          />
        </div>

        <Divider orientation="vertical" className="h-6 mx-1" />

        {/* CONTENT TYPE SELECTOR - Standard mode only */}
        {!isWabiSabi && (
          <>
            <ContentTypeSelector
              currentType={slide.contentType || 'bullets'}
              onChange={(contentType) => onUpdateSlide({ contentType })}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
            <Divider orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* TEXT STYLE GROUP */}
        <div className="flex gap-1">
          <Button active={isBold} onClick={toggleBold} icon={Bold} label="Bold" />
          <Button active={isItalic} onClick={toggleItalic} icon={Italic} label="Italic" />
          <Button active={false} onClick={() => adjustFontSize(8)} icon={Plus} label="Increase Font Size" />
          <Button active={false} onClick={() => adjustFontSize(-8)} icon={Minus} label="Decrease Font Size" />
        </div>

        <Divider orientation="vertical" className="h-6 mx-1" />

        {/* IMAGE OPACITY GROUP */}
        {slide.imageUrl && (
          <div className="flex gap-1 items-center">
            <ImageIcon className="w-3.5 h-3.5 text-zinc-400 mx-1" />
            <Button active={false} onClick={() => adjustOpacity(-0.1)} icon={Minus} label="Decrease Image Opacity" />
            <span className="text-[10px] font-medium text-zinc-500 w-8 text-center">
              {Math.round(currentOpacity * 100)}%
            </span>
            <Button active={false} onClick={() => adjustOpacity(0.1)} icon={Plus} label="Increase Image Opacity" />
          </div>
        )}

        {/* SPEAKER NOTES TOGGLE */}
        {onToggleNotes && (
          <>
            <Divider orientation="vertical" className="h-6 mx-1" />
            <Button active={false} onClick={onToggleNotes} icon={FileText} label="Speaker Notes" />
          </>
        )}

        {/* AI REFINEMENT MENU */}
        {(onRefineContent || onEnhanceImage) && (
          <>
            <Divider orientation="vertical" className="h-6 mx-1" />
            <AIRefinementMenu
              slide={slide}
              onUpdateSlide={onUpdateSlide}
              onRefineContent={onRefineContent}
              onEnhanceImage={onEnhanceImage}
              isRefining={isRefining}
            />
          </>
        )}

        {/* IMAGE PROMPT MENU */}
        {presentation && (
          <>
            <Divider orientation="vertical" className="h-6 mx-1" />
            <ImagePromptMenu
              slide={slide}
              presentation={presentation}
              onUpdateSlide={onUpdateSlide}
              onRegenerateImage={onRegenerateImage}
              isRegenerating={slide.isImageLoading}
              onGenerateSuggestions={onGenerateSuggestions}
            />
          </>
        )}
      </div>

      {/* Dynamic Label Tag */}
      <div className="px-3 py-1 bg-zinc-900 text-white rounded-full shadow-lg transform transition-all duration-200">
        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
          {activeLabel === 'Layout Designer' || activeLabel === 'Text Styling' ? (
            <span className="opacity-50">{activeLabel}</span>
          ) : (
            <>
              <span className="w-1 h-1 rounded-full bg-indigo-400" />
              {activeLabel}
            </>
          )}
        </span>
      </div>
    </div>
  );
};
