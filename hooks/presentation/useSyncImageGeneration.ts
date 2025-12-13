/**
 * useSyncImageGeneration Hook
 *
 * Handles synchronous image generation using frontend Gemini API.
 * Single responsibility: Sync image generation with concurrency control.
 */

import { useCallback, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Presentation, Slide } from '@/types';
import {
  generateSlideImage as generateSlideImageFrontend,
  generatePresentationImagesWithAgent,
} from '@/services/imageGenerationService';
import { ensureApiKeySelection } from '@/services/ensureApiKeySelection';
import { AgentLog } from '@/types/agents';
import { useAgentMode as USE_AGENT_MODE } from '@/config/featureFlags';
import { createSlideIndexMap, getOriginalIndex, slidesNeedingImages, updateSlidesWhere } from '@/utils';

/** Type for the updateSlide mutation */
type UpdateSlideMutation = UseMutationResult<
  Slide,
  Error,
  { presentationId: string; slideId: string; updates: Partial<Slide> }
>;

/** Concurrency limit for batch image generation */
const CONCURRENCY = 3;

export interface UseSyncImageGenerationOptions {
  /** Current presentation */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Update slide at specific index */
  updateSlideAtIndex: (index: number, updates: Partial<Slide>) => void;
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

export interface UseSyncImageGenerationReturn {
  /** Generate images for all slides */
  generateAllImages: (slides: Slide[], style: string, topic?: string, presentationOverride?: Presentation) => Promise<void>;
  /** Generate a single slide's image */
  generateSingleImage: (index: number, prompt: string, style: string) => Promise<void>;
  /** Whether agent mode is active */
  isAgentMode: boolean;
  /** Recent agent logs (for debugging) */
  agentLogs: AgentLog[];
}

/**
 * Hook for synchronous image generation using frontend Gemini.
 */
export function useSyncImageGeneration({
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
}: UseSyncImageGenerationOptions): UseSyncImageGenerationReturn {
  // Store agent logs for debugging
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const isAgentMode = USE_AGENT_MODE;

  /**
   * Generate a single slide's image.
   */
  const generateSingleImage = useCallback(
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
   * Generate images for all slides (basic mode without agent).
   */
  const generateAllImagesBasic = useCallback(
    async (slides: Slide[], style: string) => {
      try {
        await ensureApiKeySelection();
        const queue = slides.map((slide, index) => ({ index, prompt: slide.imagePrompt }));

        const processQueue = async () => {
          while (queue.length > 0) {
            const batch = queue.splice(0, CONCURRENCY);
            await Promise.allSettled(
              batch.map(async ({ index, prompt }) => {
                await generateSingleImage(index, prompt, style);
              })
            );
          }
        };

        await processQueue();
      } catch (e) {
        console.error('Batch generation error', e);
      }
    },
    [generateSingleImage]
  );

  /**
   * Generate images using the intelligent agent system.
   */
  const generateAllImagesWithAgent = useCallback(
    async (slides: Slide[], style: string, topic?: string, presentationOverride?: Presentation) => {
      const effectivePresentation = presentationOverride || presentation;
      if (!effectivePresentation) return;

      // Filter out slides that already have images
      const slidesToGenerate = slides.filter(slidesNeedingImages);
      if (slidesToGenerate.length === 0) {
        console.log('[Agent] All slides already have images, skipping generation');
        return;
      }

      // Create index mapping from filtered array back to original
      const indexMap = createSlideIndexMap(slides, slidesNeedingImages);

      // Capture values upfront to avoid stale closure issues
      const presentationTopic = topic || effectivePresentation.topic;
      const themeId = effectivePresentation.themeId;
      const effectivePresentationId = presentationOverride?.id || presentationId;
      const slidesCopy = [...slidesToGenerate];

      try {
        await ensureApiKeySelection();

        // Notify that agent processing is starting
        onAgentStart?.(slidesToGenerate.length);

        // Set only slides that need images to loading
        setPresentation((prev) =>
          updateSlidesWhere(
            prev,
            (s) => slidesToGenerate.some(sni => sni.id === s.id),
            { isImageLoading: true }
          )
        );

        // Run agent-based generation
        const result = await generatePresentationImagesWithAgent(
          presentationTopic,
          slidesToGenerate.map((s) => ({
            title: s.title,
            content: s.content,
            imagePrompt: s.imagePrompt,
          })),
          style,
          themeId,
          {
            onLog: (log) => {
              const originalIndex = getOriginalIndex(indexMap, log.slideIndex);
              console.log(`[Agent] Slide ${originalIndex}: ${log.action}`, log);
              onAgentActivity?.({ ...log, slideIndex: originalIndex });
            },
            onImageGenerated: async (filteredIndex, imageUrl) => {
              const originalIndex = getOriginalIndex(indexMap, filteredIndex);

              updateSlideAtIndex(originalIndex, {
                imageUrl,
                isImageLoading: false,
                imageError: undefined,
              });

              onImageGenerated?.(originalIndex, imageUrl);

              // Persist to API
              const slide = slidesCopy[filteredIndex];
              if (slide && effectivePresentationId) {
                try {
                  await updateSlideMutation.mutateAsync({
                    presentationId: effectivePresentationId,
                    slideId: slide.id,
                    updates: { imageUrl },
                  });
                } catch (apiError) {
                  console.warn('Failed to persist image URL to API:', apiError);
                }
              }
            },
            onImageError: (filteredIndex, error) => {
              const originalIndex = getOriginalIndex(indexMap, filteredIndex);
              updateSlideAtIndex(originalIndex, {
                isImageLoading: false,
                imageError: error.message,
              });
            },
          }
        );

        setAgentLogs(result.agentLogs);
        onAgentLogs?.(result.agentLogs);
        onAgentComplete?.();

        console.log(`[Agent] Completed in ${result.totalDurationMs}ms. Errors: ${result.errors.length}`);
      } catch (e) {
        console.error('Agent generation error', e);
        onAgentComplete?.();
        // Reset loading states
        setPresentation((prev) =>
          updateSlidesWhere(
            prev,
            (s) => slidesToGenerate.some(sni => sni.id === s.id),
            { isImageLoading: false, imageError: 'Failed to generate images' }
          )
        );
      }
    },
    [presentation, setPresentation, updateSlideAtIndex, presentationId, updateSlideMutation, onAgentLogs, onAgentActivity, onAgentStart, onAgentComplete, onImageGenerated]
  );

  /**
   * Generate all images - uses agent if enabled, otherwise basic.
   */
  const generateAllImages = useCallback(
    async (slides: Slide[], style: string, topic?: string, presentationOverride?: Presentation) => {
      if (USE_AGENT_MODE) {
        await generateAllImagesWithAgent(slides, style, topic, presentationOverride);
      } else {
        await generateAllImagesBasic(slides, style);
      }
    },
    [generateAllImagesWithAgent, generateAllImagesBasic]
  );

  return {
    generateAllImages,
    generateSingleImage,
    isAgentMode,
    agentLogs,
  };
}
