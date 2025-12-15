/**
 * ImagePromptToolbar Component
 *
 * Floating toolbar for editing image prompts on slides.
 * Shows aesthetic (locked) and subject (editable) with AI suggestions.
 *
 * DRY: Uses useImagePromptEditor hook for shared logic
 * DRY: Uses useClickOutside hook for click-outside detection
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Image as ImageIcon,
  X,
  Lock,
  Sparkles,
  RefreshCw,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Slide, Presentation } from '@/types';
import { useImagePromptEditor } from '@/hooks/useImagePromptEditor';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface ImagePromptToolbarProps {
  /** Current slide */
  slide: Slide;
  /** Full presentation for holistic context */
  presentation: Presentation;
  /** Callback to update slide */
  onUpdateSlide: (updates: Partial<Slide>) => void;
  /** Callback to regenerate image */
  onRegenerateImage: () => void;
  /** Whether image is currently regenerating */
  isRegenerating?: boolean;
  /** Function to generate AI suggestions */
  onGenerateSuggestions?: () => Promise<string[]>;
}

export const ImagePromptToolbar: React.FC<ImagePromptToolbarProps> = ({
  slide,
  presentation,
  onUpdateSlide,
  onRegenerateImage,
  isRegenerating = false,
  onGenerateSuggestions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // DRY: Use shared hook for prompt editing logic
  const {
    editedPrompt,
    setEditedPrompt,
    showAesthetic,
    setShowAesthetic,
    suggestions,
    isLoadingSuggestions,
    isDirty,
    handleApply,
    handleApplyAndRegenerate,
    handleSuggestionSelect,
    handleGenerateSuggestions,
    truncateText,
  } = useImagePromptEditor({
    slide,
    presentation,
    onUpdateSlide,
    onRegenerateImage,
    onGenerateSuggestions,
  });

  // DRY: Use shared hook for click-outside detection
  const handleClose = useCallback(() => setIsExpanded(false), []);
  useClickOutside(panelRef, handleClose, isExpanded);

  return (
    <div ref={panelRef} className="absolute bottom-4 right-4 z-[200]">
      {/* Trigger Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2.5 bg-white/80 backdrop-blur-md hover:bg-[#6B8E6B] border border-[#D4E5D4] text-[#1E2E1E] hover:text-white transition-all duration-150 opacity-60 hover:opacity-100 group/btn relative"
          title="Edit Image Prompt"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="absolute right-full mr-2 top-1.5 px-2 py-1 bg-white text-[#1E2E1E] text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#D4E5D4]">
            Prompt
          </span>
        </button>
      )}

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="w-80 bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                Image Prompt
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-zinc-200 rounded transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Loading Overlay */}
          {isRegenerating && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  Generating...
                </span>
              </div>
            </div>
          )}

          {/* Aesthetic Section (Collapsible) */}
          <div className="border-b border-zinc-100">
            <button
              onClick={() => setShowAesthetic(!showAesthetic)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-zinc-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Aesthetic (Locked)
                </span>
              </div>
              {showAesthetic ? (
                <ChevronUp className="w-3 h-3 text-zinc-300" />
              ) : (
                <ChevronDown className="w-3 h-3 text-zinc-300" />
              )}
            </button>
            {showAesthetic && (
              <div className="px-4 pb-3">
                <p className="text-xs text-zinc-500 italic bg-zinc-50 p-2 rounded border border-zinc-100">
                  {truncateText(presentation.visualStyle, 200)}
                </p>
              </div>
            )}
          </div>

          {/* Subject Section (Editable) */}
          <div className="p-4 border-b border-zinc-100">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
              Subject (Editable)
            </label>
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-20 text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6B8E6B] focus:border-transparent transition-all"
              placeholder="Describe the image subject..."
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-zinc-400">
                {editedPrompt.length} characters
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleApply}
                  disabled={!isDirty}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 ${
                    isDirty
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  Apply
                </button>
                <button
                  onClick={handleApplyAndRegenerate}
                  disabled={isRegenerating}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-[#6B8E6B] text-white hover:bg-[#5A7A5A] transition-all flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* AI Suggestions Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                AI Suggestions
              </label>
              <button
                onClick={handleGenerateSuggestions}
                disabled={isLoadingSuggestions || !onGenerateSuggestions}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1 ${
                  onGenerateSuggestions
                    ? 'text-purple-600 hover:bg-purple-50'
                    : 'text-zinc-300 cursor-not-allowed'
                }`}
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Generate
                  </>
                )}
              </button>
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-700 bg-zinc-50 hover:bg-purple-50 hover:text-purple-700 rounded-lg border border-zinc-100 hover:border-purple-200 transition-all"
                  >
                    {truncateText(suggestion, 100)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 text-center py-4">
                Click "Generate" to get AI-powered suggestions based on your deck.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePromptToolbar;
