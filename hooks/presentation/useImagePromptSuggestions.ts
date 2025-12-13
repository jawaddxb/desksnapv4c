/**
 * useImagePromptSuggestions Hook
 *
 * Manages AI-generated image prompt suggestions based on holistic deck analysis.
 */

import { useState, useCallback } from 'react';
import { Presentation } from '@/types';
import { generateHolisticImageSuggestions } from '@/services/geminiService';

export interface UseImagePromptSuggestionsOptions {
  /** Full presentation for context */
  presentation: Presentation | null;
  /** Current slide index */
  currentSlideIndex: number;
}

export interface UseImagePromptSuggestionsReturn {
  /** Array of AI-generated suggestions */
  suggestions: string[];
  /** Whether suggestions are being generated */
  isLoading: boolean;
  /** Error message if generation failed */
  error: string | null;
  /** Generate new suggestions */
  generateSuggestions: () => Promise<string[]>;
  /** Clear current suggestions */
  clearSuggestions: () => void;
}

export const useImagePromptSuggestions = ({
  presentation,
  currentSlideIndex,
}: UseImagePromptSuggestionsOptions): UseImagePromptSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (): Promise<string[]> => {
    if (!presentation) {
      setError('No presentation available');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const newSuggestions = await generateHolisticImageSuggestions(
        presentation,
        currentSlideIndex
      );
      setSuggestions(newSuggestions);
      return newSuggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(errorMessage);
      console.error('Failed to generate image suggestions:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [presentation, currentSlideIndex]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    generateSuggestions,
    clearSuggestions,
  };
};

export default useImagePromptSuggestions;
