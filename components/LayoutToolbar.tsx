/**
 * LayoutToolbar Component
 *
 * Floating toolbar for slide layout, typography, and AI refinement controls.
 * Refactored to use focused components and hooks.
 */

import React, { useState, useRef } from 'react';
import { Slide, ImageStylePreset, Presentation } from '@/types';
import {
  Columns, Maximize2, Type, LayoutTemplate,
  AlignLeft, AlignCenter, AlignRight,
  Smartphone, Square, Rows,
  Bold, Italic, Plus, Minus, Image as ImageIcon,
  X, GripHorizontal, FileText,
  LucideIcon,
} from 'lucide-react';
import { useDraggable, useSlideStyles, AIRefinementMenu, ToolbarButton, ImagePromptMenu, ContentTypeSelector } from './toolbar';
import { Divider } from './ui';

// ============ Button Configuration Types ============

interface ButtonConfig {
  id: string;
  icon?: LucideIcon;
  text?: string;
  label: string;
  isActive: (slide: Slide) => boolean;
  getUpdate: () => Partial<Slide>;
}

// ============ Layout Button Configurations ============

const LAYOUT_BUTTONS: ButtonConfig[] = [
  { id: 'split', icon: Columns, label: 'Split Layout', isActive: (s) => s.layoutType === 'split', getUpdate: () => ({ layoutType: 'split' }) },
  { id: 'magazine', icon: Smartphone, label: 'Magazine Column', isActive: (s) => s.layoutType === 'magazine', getUpdate: () => ({ layoutType: 'magazine' }) },
  { id: 'horizontal', icon: Rows, label: 'Horizontal Split', isActive: (s) => s.layoutType === 'horizontal', getUpdate: () => ({ layoutType: 'horizontal' }) },
  { id: 'card', icon: Square, label: 'Floating Card', isActive: (s) => s.layoutType === 'card', getUpdate: () => ({ layoutType: 'card' }) },
  { id: 'full-bleed', icon: Maximize2, label: 'Full Bleed', isActive: (s) => s.layoutType === 'full-bleed', getUpdate: () => ({ layoutType: 'full-bleed' }) },
  { id: 'statement', icon: Type, label: 'Statement', isActive: (s) => s.layoutType === 'statement', getUpdate: () => ({ layoutType: 'statement' }) },
  { id: 'gallery', icon: LayoutTemplate, label: 'Gallery Grid', isActive: (s) => s.layoutType === 'gallery', getUpdate: () => ({ layoutType: 'gallery' }) },
];

const ALIGNMENT_BUTTONS: ButtonConfig[] = [
  { id: 'left', icon: AlignLeft, label: 'Align Left', isActive: (s) => s.alignment === 'left', getUpdate: () => ({ alignment: 'left' }) },
  { id: 'center', icon: AlignCenter, label: 'Align Center', isActive: (s) => s.alignment === 'center', getUpdate: () => ({ alignment: 'center' }) },
  { id: 'right', icon: AlignRight, label: 'Align Right', isActive: (s) => s.alignment === 'right', getUpdate: () => ({ alignment: 'right' }) },
];

const TYPOGRAPHY_BUTTONS: ButtonConfig[] = [
  { id: 'compact', text: 'S', label: 'Compact Text', isActive: (s) => s.fontScale === 'compact', getUpdate: () => ({ fontScale: 'compact' }) },
  { id: 'auto', text: 'M', label: 'Auto Scale', isActive: (s) => !s.fontScale || s.fontScale === 'auto', getUpdate: () => ({ fontScale: 'auto' }) },
  { id: 'hero', text: 'L', label: 'Hero Text', isActive: (s) => s.fontScale === 'hero', getUpdate: () => ({ fontScale: 'hero' }) },
];

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
      className={`absolute bottom-8 left-1/2 z-[200] flex flex-col items-center gap-3 opacity-90 hover:opacity-100 transition-opacity duration-200 ${isDragging ? 'cursor-grabbing' : ''}`}
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
              {LAYOUT_BUTTONS.map((btn) => (
                <Button
                  key={btn.id}
                  active={btn.isActive(slide)}
                  onClick={() => onUpdateSlide(btn.getUpdate())}
                  icon={btn.icon}
                  label={btn.label}
                />
              ))}
            </div>

            <Divider orientation="vertical" className="h-6 mx-1" />

            {/* ALIGNMENT GROUP - Standard mode only */}
            <div className="flex gap-1">
              {ALIGNMENT_BUTTONS.map((btn) => (
                <Button
                  key={btn.id}
                  active={btn.isActive(slide)}
                  onClick={() => onUpdateSlide(btn.getUpdate())}
                  icon={btn.icon}
                  label={btn.label}
                />
              ))}
            </div>

            <Divider orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* TYPOGRAPHY GROUP */}
        <div className="flex gap-1">
          {TYPOGRAPHY_BUTTONS.map((btn) => (
            <Button
              key={btn.id}
              active={btn.isActive(slide)}
              onClick={() => onUpdateSlide(btn.getUpdate())}
              text={btn.text}
              label={btn.label}
            />
          ))}
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
