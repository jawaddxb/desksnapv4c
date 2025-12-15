/**
 * useImagePromptEditor Hook
 *
 * Shared logic for image prompt editing in ImagePromptToolbar and ImagePromptMenu.
 * Extracted to eliminate code duplication (DRY principle).
 *
 * KISS: < 80 lines, focused on prompt editing logic
 * SOLID-S: Only handles image prompt state and operations
 * DRY: Single source of truth for both toolbar and menu components
 */

import { useState, useEffect, useCallback } from 'react';
import { Slide, Presentation } from '@/types';

interface UseImagePromptEditorOptions {
  /** Current slide */
  slide: Slide;
  /** Full presentation for visual style context */
  presentation: Presentation;
  /** Callback to update slide */
  onUpdateSlide: (updates: Partial<Slide>) => void;
  /** Callback to regenerate image */
  onRegenerateImage?: () => void;
  /** Function to generate AI suggestions */
  onGenerateSuggestions?: () => Promise<string[]>;
  /** Optional callback after apply and regenerate */
  onAfterRegenerate?: () => void;
}

interface UseImagePromptEditorReturn {
  // State
  editedPrompt: string;
  setEditedPrompt: (prompt: string) => void;
  showAesthetic: boolean;
  setShowAesthetic: (show: boolean) => void;
  suggestions: string[];
  isLoadingSuggestions: boolean;
  isDirty: boolean;

  // Actions
  handleApply: () => void;
  handleApplyAndRegenerate: () => void;
  handleSuggestionSelect: (suggestion: string) => void;
  handleGenerateSuggestions: () => Promise<void>;

  // Utilities
  truncateText: (text: string, maxLength: number) => string;
}

export function useImagePromptEditor({
  slide,
  presentation,
  onUpdateSlide,
  onRegenerateImage,
  onGenerateSuggestions,
  onAfterRegenerate,
}: UseImagePromptEditorOptions): UseImagePromptEditorReturn {
  const [editedPrompt, setEditedPrompt] = useState(slide.imagePrompt);
  const [showAesthetic, setShowAesthetic] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Sync local prompt with slide when it changes externally
  useEffect(() => {
    setEditedPrompt(slide.imagePrompt);
  }, [slide.imagePrompt]);

  const isDirty = editedPrompt !== slide.imagePrompt;

  const handleApply = useCallback(() => {
    if (isDirty) {
      onUpdateSlide({ imagePrompt: editedPrompt });
    }
  }, [isDirty, editedPrompt, onUpdateSlide]);

  const handleApplyAndRegenerate = useCallback(() => {
    if (isDirty) {
      onUpdateSlide({ imagePrompt: editedPrompt });
    }
    // Small delay to ensure state updates before regeneration
    setTimeout(() => {
      onRegenerateImage?.();
      onAfterRegenerate?.();
    }, 50);
  }, [isDirty, editedPrompt, onUpdateSlide, onRegenerateImage, onAfterRegenerate]);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setEditedPrompt(suggestion);
    onUpdateSlide({ imagePrompt: suggestion });
  }, [onUpdateSlide]);

  const handleGenerateSuggestions = useCallback(async () => {
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
  }, [onGenerateSuggestions]);

  const truncateText = useCallback((text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }, []);

  return {
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
  };
}
