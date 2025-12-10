/**
 * useContentRefinement Hook
 *
 * Handles AI-powered content and image refinement operations.
 */

import { useState, useCallback } from 'react';
import { Presentation, Slide, ToneType, ContentRefinementType, ImageStylePreset } from '../../types';
import {
  refineSlideContent as refineSlideContentApi,
  refineSlideContentByType,
  enhanceImagePrompt,
} from '../../services/geminiService';

export interface UseContentRefinementOptions {
  /** Current presentation */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Currently active slide index */
  activeSlideIndex: number;
  /** Generate a single slide's image */
  generateSingleImage: (index: number, prompt: string, style: string) => Promise<void>;
}

export interface UseContentRefinementReturn {
  /** Whether refinement is in progress */
  isRefining: boolean;
  /** Refine slide content by tone or content type */
  refineSlideContent: (type: 'tone' | 'content', subType: string) => Promise<void>;
  /** Enhance slide image with a style preset */
  enhanceSlideImage: (preset: ImageStylePreset) => Promise<void>;
}

export function useContentRefinement({
  presentation,
  setPresentation,
  activeSlideIndex,
  generateSingleImage,
}: UseContentRefinementOptions): UseContentRefinementReturn {
  const [isRefining, setIsRefining] = useState(false);

  /**
   * Refine slide content using AI (tone or content type).
   */
  const refineSlideContent = useCallback(async (
    type: 'tone' | 'content',
    subType: string
  ) => {
    if (!presentation) return;
    const slide = presentation.slides[activeSlideIndex];
    if (!slide) return;

    setIsRefining(true);
    try {
      let result: { title: string; content: string[] };

      if (type === 'tone') {
        result = await refineSlideContentApi(slide.title, slide.content, subType as ToneType);
      } else {
        result = await refineSlideContentByType(slide.title, slide.content, subType as ContentRefinementType);
      }

      setPresentation(prev => {
        if (!prev) return null;
        const newSlides = [...prev.slides];
        newSlides[activeSlideIndex] = {
          ...newSlides[activeSlideIndex],
          title: result.title,
          content: result.content,
        };
        return { ...prev, slides: newSlides };
      });
    } catch (e) {
      console.error('Content refinement failed', e);
    } finally {
      setIsRefining(false);
    }
  }, [presentation, activeSlideIndex, setPresentation]);

  /**
   * Enhance slide image with a style preset.
   */
  const enhanceSlideImage = useCallback(async (preset: ImageStylePreset) => {
    if (!presentation) return;
    const slide = presentation.slides[activeSlideIndex];
    if (!slide || !slide.imagePrompt) return;

    setIsRefining(true);
    try {
      // Get enhanced prompt
      const newPrompt = await enhanceImagePrompt(slide.imagePrompt, preset);

      // Update prompt
      setPresentation(prev => {
        if (!prev) return null;
        const newSlides = [...prev.slides];
        newSlides[activeSlideIndex] = {
          ...newSlides[activeSlideIndex],
          imagePrompt: newPrompt,
        };
        return { ...prev, slides: newSlides };
      });

      // Regenerate image with new prompt
      await generateSingleImage(activeSlideIndex, newPrompt, presentation.visualStyle);
    } catch (e) {
      console.error('Image enhancement failed', e);
    } finally {
      setIsRefining(false);
    }
  }, [presentation, activeSlideIndex, setPresentation, generateSingleImage]);

  return {
    isRefining,
    refineSlideContent,
    enhanceSlideImage,
  };
}

export default useContentRefinement;
