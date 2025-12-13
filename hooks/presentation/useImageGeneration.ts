/**
 * useImageGeneration Hook
 *
 * Mode selector that composes sync and async image generation hooks.
 * Single responsibility: Select appropriate generation mode and provide unified API.
 */

import { useCallback } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Presentation, Slide } from '@/types';
import { THEMES } from '@/config/themes';
import { refineImagePrompt, RefinementFocus } from '@/services/imagePromptService';
import { ensureApiKeySelection } from '@/services/ensureApiKeySelection';
import { hasTokens } from '@/services/api/tokenManager';
import { AgentLog } from '@/types/agents';
import {
  imageGenerationMode as IMAGE_GENERATION_MODE,
  useAgentMode as USE_AGENT_MODE,
} from '@/config/featureFlags';
import { useSyncImageGeneration } from './useSyncImageGeneration';
import { useAsyncImageGeneration } from './useAsyncImageGeneration';

/** Type for the updateSlide mutation */
type UpdateSlideMutation = UseMutationResult<
  Slide,
  Error,
  { presentationId: string; slideId: string; updates: Partial<Slide> }
>;

export interface UseImageGenerationOptions {
  /** Current presentation */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Currently active slide index */
  activeSlideIndex: number;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Update slide at specific index */
  updateSlideAtIndex: (index: number, updates: Partial<Slide>) => void;
  /** Update the active slide */
  updateSlide: (updates: Partial<Slide>) => void;
  /** Current presentation ID for API calls */
  presentationId: string | null;
  /** Mutation to persist slide updates to API */
  updateSlideMutation: UpdateSlideMutation;
  /** Callback for agent logs (final batch after completion) */
  onAgentLogs?: (logs: AgentLog[]) => void;
  /** Callback for real-time agent activity (single log as it happens) */
  onAgentActivity?: (log: AgentLog) => void;
  /** Callback when agent processing starts */
  onAgentStart?: (totalSlides: number) => void;
  /** Callback when agent processing completes */
  onAgentComplete?: () => void;
  /** Callback when an image is generated for a slide */
  onImageGenerated?: (slideIndex: number, imageUrl: string) => void;
}

export interface UseImageGenerationReturn {
  /** Generate images for all slides with concurrency control */
  generateAllImages: (slides: Slide[], style: string, topic?: string, presentationOverride?: Presentation) => Promise<void>;
  /** Generate a single slide's image */
  generateSingleImage: (index: number, prompt: string, style: string) => Promise<void>;
  /** Regenerate the current slide's image */
  regenerateSlideImage: (mode: 'same' | 'varied') => Promise<void>;
  /** Remix all images with random refinement focuses, optionally with a new theme */
  remixDeck: (newThemeId?: string) => Promise<void>;
  /** Regenerate all images in the current presentation */
  regenerateAllImages: () => Promise<void>;
  /** Check if async mode is active */
  isAsyncMode: boolean;
  /** Check if agent mode is active */
  isAgentMode: boolean;
  /** Recent agent logs (for debugging) */
  agentLogs: AgentLog[];
}

/**
 * Determine if async mode should be used based on configuration and auth state.
 */
function shouldUseAsyncMode(): boolean {
  if (IMAGE_GENERATION_MODE === 'sync') return false;
  if (IMAGE_GENERATION_MODE === 'async') return true;
  // 'auto' mode: use async if authenticated
  return hasTokens();
}

/**
 * Hook for image generation - selects between sync and async modes.
 */
export function useImageGeneration(options: UseImageGenerationOptions): UseImageGenerationReturn {
  const {
    presentation,
    setPresentation,
    activeSlideIndex,
    isGenerating,
    updateSlideAtIndex,
    updateSlide,
    presentationId,
    updateSlideMutation,
    onAgentLogs,
    onAgentActivity,
    onAgentStart,
    onAgentComplete,
    onImageGenerated,
  } = options;

  const isAsyncMode = shouldUseAsyncMode();
  const isAgentMode = USE_AGENT_MODE;

  // Compose sync and async hooks
  const syncGen = useSyncImageGeneration({
    presentation,
    setPresentation,
    updateSlideAtIndex,
    presentationId,
    updateSlideMutation,
    onAgentLogs,
    onAgentActivity,
    onAgentStart,
    onAgentComplete,
    onImageGenerated,
  });

  const asyncGen = useAsyncImageGeneration({
    presentation,
    setPresentation,
    updateSlideAtIndex,
  });

  // Select implementation based on mode
  const generateSingleImage = isAsyncMode ? asyncGen.generateSingleImage : syncGen.generateSingleImage;
  const generateAllImages = isAsyncMode ? asyncGen.generateAllImages : syncGen.generateAllImages;
  const agentLogs = syncGen.agentLogs;

  /**
   * Regenerate the current slide's image.
   */
  const regenerateSlideImage = useCallback(
    async (mode: 'same' | 'varied') => {
      if (!presentation) return;
      const index = activeSlideIndex;
      const slide = presentation.slides[index];
      let prompt = slide.imagePrompt;

      try {
        if (!isAsyncMode) {
          await ensureApiKeySelection();
        }

        if (mode === 'varied') {
          updateSlide({ isImageLoading: true });
          prompt = await refineImagePrompt(prompt);
          updateSlide({ imagePrompt: prompt });
        }

        await generateSingleImage(index, prompt, presentation.visualStyle);
      } catch (e) {
        console.error(e);
      }
    },
    [presentation, activeSlideIndex, updateSlide, generateSingleImage, isAsyncMode]
  );

  /**
   * Remix all images with random refinement focuses.
   */
  const remixDeck = useCallback(async (newThemeId?: string) => {
    if (!presentation || isGenerating) return;

    const currentSlides = presentation.slides;
    const currentTopic = presentation.topic;

    // Determine target style based on theme
    let targetStyle = presentation.visualStyle;
    let targetThemeId = presentation.themeId;

    if (newThemeId && newThemeId !== presentation.themeId && THEMES[newThemeId]) {
      const newTheme = THEMES[newThemeId];
      targetStyle = newTheme.imageStyle;
      targetThemeId = newThemeId;
    }

    try {
      await ensureApiKeySelection();
      const focuses: RefinementFocus[] = ['lighting', 'camera', 'composition', 'mood'];

      // Set all slides to loading and update theme
      setPresentation((prev) =>
        prev
          ? {
              ...prev,
              themeId: targetThemeId,
              visualStyle: targetStyle,
              slides: prev.slides.map((s) => ({ ...s, isImageLoading: true })),
            }
          : null
      );

      // Apply stylistic refinements in parallel
      const refinedSlides = await Promise.all(
        currentSlides.map(async (slide) => {
          const randomFocus = focuses[Math.floor(Math.random() * focuses.length)];
          const newPrompt = await refineImagePrompt(slide.imagePrompt, randomFocus);
          return { ...slide, imagePrompt: newPrompt };
        })
      );

      // Update prompts in state
      setPresentation((prev) =>
        prev ? { ...prev, slides: refinedSlides } : null
      );

      // Generate images with agent or basic mode
      await generateAllImages(refinedSlides, targetStyle, currentTopic);
    } catch (e) {
      console.error('Remix deck error', e);
      setPresentation((prev) =>
        prev
          ? { ...prev, slides: prev.slides.map((s) => ({ ...s, isImageLoading: false })) }
          : null
      );
    }
  }, [presentation, isGenerating, setPresentation, generateAllImages]);

  /**
   * Regenerate all images in the current presentation.
   */
  const regenerateAllImages = useCallback(async () => {
    if (!presentation) return;
    await generateAllImages(presentation.slides, presentation.visualStyle);
  }, [presentation, generateAllImages]);

  return {
    generateAllImages,
    generateSingleImage,
    regenerateSlideImage,
    remixDeck,
    regenerateAllImages,
    isAsyncMode,
    isAgentMode,
    agentLogs,
  };
}

export default useImageGeneration;
