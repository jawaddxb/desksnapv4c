/**
 * ImagePromptMenu Component
 *
 * Dropdown menu for editing image prompts with AI suggestions.
 * Opens from the main toolbar.
 */

import React, { useState, useEffect } from 'react';
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
import { Slide, Presentation } from '../../types';
import { IconButton } from '../ui/IconButton';

export interface ImagePromptMenuProps {
  /** Current slide */
  slide: Slide;
  /** Full presentation for holistic context */
  presentation: Presentation;
  /** Callback to update slide */
  onUpdateSlide: (updates: Partial<Slide>) => void;
  /** Callback to regenerate image */
  onRegenerateImage?: () => void;
  /** Whether image is currently regenerating */
  isRegenerating?: boolean;
  /** Function to generate AI suggestions */
  onGenerateSuggestions?: () => Promise<string[]>;
}

export const ImagePromptMenu: React.FC<ImagePromptMenuProps> = ({
  slide,
  presentation,
  onUpdateSlide,
  onRegenerateImage,
  isRegenerating = false,
  onGenerateSuggestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(slide.imagePrompt);
  const [showAesthetic, setShowAesthetic] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Sync local prompt with slide when it changes externally
  useEffect(() => {
    setEditedPrompt(slide.imagePrompt);
  }, [slide.imagePrompt]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const isDirty = editedPrompt !== slide.imagePrompt;

  const handleApply = () => {
    if (isDirty) {
      onUpdateSlide({ imagePrompt: editedPrompt });
    }
  };

  const handleApplyAndRegenerate = () => {
    if (isDirty) {
      onUpdateSlide({ imagePrompt: editedPrompt });
    }
    // Small delay to ensure state updates before regeneration
    setTimeout(() => {
      onRegenerateImage?.();
      handleClose();
    }, 50);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setEditedPrompt(suggestion);
    onUpdateSlide({ imagePrompt: suggestion });
  };

  const handleGenerateSuggestions = async () => {
    if (!onGenerateSuggestions) return;

    setIsLoadingSuggestions(true);
    try {
      const newSuggestions = await onGenerateSuggestions();
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="relative">
      <IconButton
        active={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        icon={ImageIcon}
        label="Image Prompt"
      />

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[199]"
            onClick={handleClose}
          />

          {/* Menu Panel */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 bg-white border border-zinc-200 shadow-2xl rounded-xl overflow-hidden z-[201] animate-in fade-in zoom-in-95 duration-200 origin-bottom">
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

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                  Image Prompt
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-zinc-200 rounded transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

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
                    {truncateText(presentation.visualStyle || 'No visual style set', 200)}
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
                className="w-full h-20 text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#c5a47e] focus:border-transparent transition-all"
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
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-[#c5a47e] text-black hover:bg-[#b8956f] transition-all flex items-center gap-1"
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
        </>
      )}
    </div>
  );
};

export default ImagePromptMenu;
