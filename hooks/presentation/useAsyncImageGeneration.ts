/**
 * useAsyncImageGeneration Hook
 *
 * Handles asynchronous image generation using backend Celery workers.
 * Single responsibility: Async image generation with polling.
 */

import { useCallback, useRef, useEffect } from 'react';
import { Presentation, Slide } from '@/types';
import {
  generateAllImagesAsync,
  regenerateSlideImageAsync,
  pollImageGeneration,
  BatchStatusResponse,
} from '@/services/api/imageService';

export interface UseAsyncImageGenerationOptions {
  /** Current presentation */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Update slide at specific index */
  updateSlideAtIndex: (index: number, updates: Partial<Slide>) => void;
}

export interface UseAsyncImageGenerationReturn {
  /** Generate images for all slides */
  generateAllImages: (slides: Slide[], style: string, topic?: string, presentationOverride?: Presentation) => Promise<void>;
  /** Generate a single slide's image */
  generateSingleImage: (index: number, prompt: string, style: string) => Promise<void>;
}

/**
 * Hook for asynchronous image generation using backend Celery.
 */
export function useAsyncImageGeneration({
  presentation,
  setPresentation,
  updateSlideAtIndex,
}: UseAsyncImageGenerationOptions): UseAsyncImageGenerationReturn {
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

  /**
   * Handle status update from async polling.
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
   * Generate images for all slides using backend.
   */
  const generateAllImages = useCallback(
    async (slides: Slide[], _style: string, _topic?: string, presentationOverride?: Presentation) => {
      const effectivePresentation = presentationOverride || presentation;
      if (!effectivePresentation) return;

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
        await generateAllImagesAsync(effectivePresentation.id);

        // Start polling for status updates
        pollRef.current = pollImageGeneration(effectivePresentation.id, handleStatusUpdate, 3000);
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
   * Generate a single slide's image using backend.
   */
  const generateSingleImage = useCallback(
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

  return {
    generateAllImages,
    generateSingleImage,
  };
}
