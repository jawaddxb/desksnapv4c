/**
 * useImageGeneration Hook
 *
 * Handles all image generation operations for slides.
 * Supports both sync (frontend Gemini) and async (backend Celery) modes.
 */

import { useCallback, useRef, useEffect } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Presentation, Slide } from '../../types';
import {
  generateSlideImage as generateSlideImageFrontend,
  refineImagePrompt,
  ensureApiKeySelection,
  RefinementFocus,
} from '../../services/geminiService';
import {
  generateAllImagesAsync,
  regenerateSlideImageAsync,
  pollImageGeneration,
  BatchStatusResponse,
} from '../../services/api/imageService';
import { hasTokens } from '../../services/api/tokenManager';

/**
 * Feature flag for image generation mode.
 * - 'sync': Frontend generates images directly via Gemini API (original behavior)
 * - 'async': Backend generates images via Celery workers (new)
 * - 'auto': Use async if authenticated, sync otherwise
 */
const IMAGE_GENERATION_MODE: 'sync' | 'async' | 'auto' = 'sync';

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
}

export interface UseImageGenerationReturn {
  /** Generate images for all slides with concurrency control */
  generateAllImages: (slides: Slide[], style: string) => Promise<void>;
  /** Generate a single slide's image */
  generateSingleImage: (index: number, prompt: string, style: string) => Promise<void>;
  /** Regenerate the current slide's image */
  regenerateSlideImage: (mode: 'same' | 'varied') => Promise<void>;
  /** Remix all images with random refinement focuses */
  remixDeck: () => Promise<void>;
  /** Regenerate all images in the current presentation */
  regenerateAllImages: () => Promise<void>;
  /** Check if async mode is active */
  isAsyncMode: boolean;
}

/** Concurrency limit for batch image generation (sync mode) */
const CONCURRENCY = 3;

/**
 * Determine if async mode should be used based on configuration and auth state.
 */
function shouldUseAsyncMode(): boolean {
  if (IMAGE_GENERATION_MODE === 'sync') return false;
  if (IMAGE_GENERATION_MODE === 'async') return true;
  // 'auto' mode: use async if authenticated
  return hasTokens();
}

export function useImageGeneration({
  presentation,
  setPresentation,
  activeSlideIndex,
  isGenerating,
  updateSlideAtIndex,
  updateSlide,
  presentationId,
  updateSlideMutation,
}: UseImageGenerationOptions): UseImageGenerationReturn {
  // Track active polling
  const pollRef = useRef<{ stop: () => void } | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        pollRef.current.stop();
      }
    };
  }, []);

  const isAsyncMode = shouldUseAsyncMode();

  /**
   * Generate a single slide's image (sync mode - frontend Gemini).
   */
  const generateSingleImageSync = useCallback(
    async (index: number, prompt: string, style: string) => {
      updateSlideAtIndex(index, { isImageLoading: true, imageError: undefined });

      try {
        const url = await generateSlideImageFrontend(prompt, style);
        // Update local state for immediate UI feedback
        updateSlideAtIndex(index, { imageUrl: url, isImageLoading: false, imageError: undefined });

        // Persist to API so image survives navigation/refetch
        const slide = presentation?.slides[index];
        if (slide && presentationId) {
          try {
            await updateSlideMutation.mutateAsync({
              presentationId,
              slideId: slide.id,
              updates: { imageUrl: url },
            });
          } catch (apiError) {
            console.warn('Failed to persist image URL to API:', apiError);
            // Image is still displayed locally, but may not survive refresh
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Image generation failed';
        console.warn('Image generation failed', err);
        updateSlideAtIndex(index, { isImageLoading: false, imageError: errorMessage });
      }
    },
    [updateSlideAtIndex, presentation, presentationId, updateSlideMutation]
  );

  /**
   * Generate images for all slides (sync mode - frontend Gemini with concurrency).
   */
  const generateAllImagesSync = useCallback(
    async (slides: Slide[], style: string) => {
      try {
        await ensureApiKeySelection();
        const queue = slides.map((slide, index) => ({ index, prompt: slide.imagePrompt }));

        const processQueue = async () => {
          while (queue.length > 0) {
            const batch = queue.splice(0, CONCURRENCY);
            await Promise.allSettled(
              batch.map(async ({ index, prompt }) => {
                await generateSingleImageSync(index, prompt, style);
              })
            );
          }
        };

        await processQueue();
      } catch (e) {
        console.error('Batch generation error', e);
      }
    },
    [generateSingleImageSync]
  );

  /**
   * Handle status update from async polling.
   * Updates slide states based on task statuses.
   */
  const handleStatusUpdate = useCallback(
    (status: BatchStatusResponse) => {
      setPresentation((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          slides: prev.slides.map((slide) => {
            const slideStatus = status.slide_statuses[slide.id];
            if (!slideStatus) return slide;

            if (slideStatus.status === 'SUCCESS' || slideStatus.status === 'COMPLETE') {
              return {
                ...slide,
                imageUrl: slideStatus.image_url || slide.imageUrl,
                isImageLoading: false,
                imageError: undefined,
                imageTaskId: undefined,
              };
            } else if (slideStatus.status === 'FAILURE') {
              return {
                ...slide,
                isImageLoading: false,
                imageError: slideStatus.error || 'Generation failed',
                imageTaskId: undefined,
              };
            } else if (
              slideStatus.status === 'PENDING' ||
              slideStatus.status === 'STARTED' ||
              slideStatus.status === 'RETRY'
            ) {
              return {
                ...slide,
                isImageLoading: true,
                imageTaskId: slideStatus.task_id,
              };
            }

            return slide;
          }),
        };
      });

      // Stop polling when complete
      if (status.all_complete && pollRef.current) {
        pollRef.current.stop();
        pollRef.current = null;
      }
    },
    [setPresentation]
  );

  /**
   * Generate images for all slides (async mode - backend Celery).
   */
  const generateAllImagesAsync_ = useCallback(
    async (slides: Slide[], _style: string) => {
      if (!presentation) return;

      // Stop any existing polling
      if (pollRef.current) {
        pollRef.current.stop();
      }

      // Set all slides to loading
      setPresentation((prev) =>
        prev
          ? {
              ...prev,
              slides: prev.slides.map((s) => ({ ...s, isImageLoading: true })),
            }
          : null
      );

      try {
        // Trigger batch generation
        await generateAllImagesAsync(presentation.id);

        // Start polling for status updates
        pollRef.current = pollImageGeneration(presentation.id, handleStatusUpdate, 3000);
      } catch (error) {
        console.error('Batch generation error', error);
        // Reset loading states on error
        setPresentation((prev) =>
          prev
            ? {
                ...prev,
                slides: prev.slides.map((s) => ({
                  ...s,
                  isImageLoading: false,
                  imageError: 'Failed to start generation',
                })),
              }
            : null
        );
      }
    },
    [presentation, setPresentation, handleStatusUpdate]
  );

  /**
   * Generate a single slide's image (async mode - backend Celery).
   */
  const generateSingleImageAsync = useCallback(
    async (index: number, _prompt: string, _style: string) => {
      if (!presentation) return;

      const slide = presentation.slides[index];
      updateSlideAtIndex(index, { isImageLoading: true, imageError: undefined });

      try {
        await regenerateSlideImageAsync(presentation.id, slide.id);

        // Start polling for this presentation's status
        if (pollRef.current) {
          pollRef.current.stop();
        }
        pollRef.current = pollImageGeneration(presentation.id, handleStatusUpdate, 2000);
      } catch (error) {
        console.error('Single image generation error', error);
        updateSlideAtIndex(index, {
          isImageLoading: false,
          imageError: 'Failed to start generation',
        });
      }
    },
    [presentation, updateSlideAtIndex, handleStatusUpdate]
  );

  // Select implementation based on mode
  const generateSingleImage = isAsyncMode ? generateSingleImageAsync : generateSingleImageSync;
  const generateAllImages = isAsyncMode ? generateAllImagesAsync_ : generateAllImagesSync;

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
   * Note: This always uses sync mode for prompt refinement, then generates.
   */
  const remixDeck = useCallback(async () => {
    if (!presentation || isGenerating) return;

    try {
      await ensureApiKeySelection();
      const focuses: RefinementFocus[] = ['lighting', 'camera', 'composition', 'mood'];

      // Set all slides to loading
      setPresentation((prev) =>
        prev
          ? {
              ...prev,
              slides: prev.slides.map((s) => ({ ...s, isImageLoading: true })),
            }
          : null
      );

      const slides = [...presentation.slides];
      for (const [index, slide] of slides.entries()) {
        try {
          const randomFocus = focuses[Math.floor(Math.random() * focuses.length)];
          const newPrompt = await refineImagePrompt(slide.imagePrompt, randomFocus);

          // Update the prompt
          setPresentation((prev) => {
            if (!prev) return null;
            const s = [...prev.slides];
            s[index] = { ...s[index], imagePrompt: newPrompt };
            return { ...prev, slides: s };
          });

          // Generate the new image (uses current mode)
          await generateSingleImage(index, newPrompt, presentation.visualStyle);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [presentation, isGenerating, setPresentation, generateSingleImage]);

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
  };
}

export default useImageGeneration;
