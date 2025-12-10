/**
 * AIRefinementMenu Component
 *
 * AI-powered content and image refinement dropdown menu.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Wand2,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from 'lucide-react';
import { Slide, ToneType, ContentRefinementType, ImageStylePreset } from '../../types';
import { IconButton } from '../ui/IconButton';
import { Slider } from '../ui/Slider';

export interface AIRefinementMenuProps {
  /** Current slide */
  slide: Slide;
  /** Callback to update slide */
  onUpdateSlide: (updates: Partial<Slide>) => void;
  /** Callback to refine content */
  onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
  /** Callback to enhance image */
  onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
  /** Whether refinement is in progress */
  isRefining?: boolean;
}

type AISubmenu = 'tone' | 'content' | 'visual' | null;

const TONE_OPTIONS: ToneType[] = ['professional', 'casual', 'technical', 'persuasive', 'executive'];
const CONTENT_OPTIONS: ContentRefinementType[] = ['expand', 'simplify', 'clarify', 'storytelling'];
const VISUAL_PRESETS: ImageStylePreset[] = ['vivid', 'muted', 'high-contrast', 'soft'];

export const AIRefinementMenu: React.FC<AIRefinementMenuProps> = ({
  slide,
  onUpdateSlide,
  onRefineContent,
  onEnhanceImage,
  isRefining = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<AISubmenu>(null);

  const handleClose = () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleToneSelect = (tone: ToneType) => {
    onRefineContent?.('tone', tone);
    handleClose();
  };

  const handleContentSelect = (type: ContentRefinementType) => {
    onRefineContent?.('content', type);
    handleClose();
  };

  const handleVisualPreset = (preset: ImageStylePreset) => {
    onEnhanceImage?.(preset);
    handleClose();
  };

  const handleFilterChange = (key: 'brightness' | 'contrast' | 'saturation', value: number) => {
    onUpdateSlide({
      imageStyles: {
        ...slide.imageStyles,
        [key]: value,
      },
    });
  };

  const formatContentType = (type: ContentRefinementType) => {
    if (type === 'storytelling') return 'Add Storytelling';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="relative">
      <IconButton
        active={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          setActiveSubmenu(null);
        }}
        icon={Sparkles}
        label="AI Refinement"
      />

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[199]"
            onClick={handleClose}
          />

          {/* Menu */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden z-[201] animate-in fade-in zoom-in-95 duration-200 origin-bottom">
            {/* Loading Overlay */}
            {isRefining && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
              </div>
            )}

            {/* Main Menu */}
            {!activeSubmenu && (
              <div className="p-2">
                <button
                  onClick={() => setActiveSubmenu('tone')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-zinc-400" />
                  <div className="text-left flex-1">
                    <div className="text-xs font-bold text-zinc-900">Adjust Tone</div>
                    <div className="text-[10px] text-zinc-400">Professional, Casual, Executive...</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                </button>

                <button
                  onClick={() => setActiveSubmenu('content')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <Wand2 className="w-4 h-4 text-zinc-400" />
                  <div className="text-left flex-1">
                    <div className="text-xs font-bold text-zinc-900">Refine Content</div>
                    <div className="text-[10px] text-zinc-400">Expand, Simplify, Clarify...</div>
                  </div>
                  <ChevronRight className="w-3 h-3 text-zinc-300" />
                </button>

                {slide.imageUrl && (
                  <button
                    onClick={() => setActiveSubmenu('visual')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-zinc-400" />
                    <div className="text-left flex-1">
                      <div className="text-xs font-bold text-zinc-900">Enhance Visual</div>
                      <div className="text-[10px] text-zinc-400">Filters & Style Presets</div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                  </button>
                )}
              </div>
            )}

            {/* Tone Submenu */}
            {activeSubmenu === 'tone' && (
              <div className="p-2">
                <button
                  onClick={() => setActiveSubmenu(null)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleToneSelect(tone)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize"
                  >
                    {tone}
                  </button>
                ))}
              </div>
            )}

            {/* Content Submenu */}
            {activeSubmenu === 'content' && (
              <div className="p-2">
                <button
                  onClick={() => setActiveSubmenu(null)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                {CONTENT_OPTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleContentSelect(type)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize"
                  >
                    {formatContentType(type)}
                  </button>
                ))}
              </div>
            )}

            {/* Visual Submenu */}
            {activeSubmenu === 'visual' && (
              <div className="p-2">
                <button
                  onClick={() => setActiveSubmenu(null)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-600"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>

                {/* CSS Filter Sliders */}
                <div className="px-3 py-2 space-y-3 border-b border-zinc-100 mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Filters
                  </label>
                  <Slider
                    label="Brightness"
                    value={slide.imageStyles?.brightness ?? 1}
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    onChange={(v) => handleFilterChange('brightness', v)}
                    labelWidth="w-16"
                    valueWidth="w-8"
                  />
                  <Slider
                    label="Contrast"
                    value={slide.imageStyles?.contrast ?? 1}
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    onChange={(v) => handleFilterChange('contrast', v)}
                    labelWidth="w-16"
                    valueWidth="w-8"
                  />
                  <Slider
                    label="Saturation"
                    value={slide.imageStyles?.saturation ?? 1}
                    min={0}
                    max={2}
                    step={0.05}
                    onChange={(v) => handleFilterChange('saturation', v)}
                    labelWidth="w-16"
                    valueWidth="w-8"
                  />
                </div>

                {/* AI Style Presets */}
                <label className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  AI Style Presets
                </label>
                {VISUAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleVisualPreset(preset)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-700 rounded-lg hover:bg-zinc-50 capitalize flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    {preset.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AIRefinementMenu;
