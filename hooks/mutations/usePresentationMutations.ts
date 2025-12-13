/**
 * Presentation Mutation Hooks
 *
 * TanStack Query mutation hooks with optimistic updates.
 * These handle create, update, delete operations with rollback on failure.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPresentation,
  updatePresentation,
  deletePresentation,
  duplicatePresentation,
  updateSlide,
  addSlide,
  deleteSlide,
} from '@/services/api/presentationService';
import { presentationKeys } from '../queries/usePresentationQueries';
import { Presentation, Slide } from '@/types';

/**
 * Hook to create a new presentation
 */
export function useCreatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPresentation,
    onSuccess: (newPresentation) => {
      // Add to list cache
      queryClient.setQueryData(presentationKeys.detail(newPresentation.id), newPresentation);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to update presentation metadata
 */
export function useUpdatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Presentation> }) =>
      updatePresentation(id, updates),

    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: presentationKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData<Presentation>(presentationKeys.detail(id));

      // Optimistically update
      if (previous) {
        queryClient.setQueryData(presentationKeys.detail(id), {
          ...previous,
          ...updates,
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(presentationKeys.detail(id), context.previous);
      }
    },

    onSettled: (_data, _error, { id }) => {
      // Only invalidate the list, not the detail
      // Detail updates are handled optimistically to preserve local state (e.g., images being generated)
      // Real-time sync via WebSocket handles propagating server changes
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to delete a presentation
 */
export function useDeletePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePresentation,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: presentationKeys.lists() });

      // Remove from cache immediately
      queryClient.removeQueries({ queryKey: presentationKeys.detail(id) });

      return { id };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to duplicate/clone a presentation
 */
export function useDuplicatePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicatePresentation,

    onSuccess: (newPresentation) => {
      // Add to cache
      queryClient.setQueryData(presentationKeys.detail(newPresentation.id), newPresentation);
      // Invalidate list to show the new clone
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to update a slide with optimistic updates
 */
export function useUpdateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      slideId,
      updates,
    }: {
      presentationId: string;
      slideId: string;
      updates: Partial<Slide>;
    }) => updateSlide(presentationId, slideId, updates),

    onMutate: async ({ presentationId, slideId, updates }) => {
      await queryClient.cancelQueries({ queryKey: presentationKeys.detail(presentationId) });

      const previous = queryClient.getQueryData<Presentation>(presentationKeys.detail(presentationId));

      if (previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), {
          ...previous,
          slides: previous.slides.map(slide =>
            slide.id === slideId ? { ...slide, ...updates } : slide
          ),
        });
      }

      return { previous };
    },

    onError: (_err, { presentationId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), context.previous);
      }
    },

    onSettled: (_data, _error, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to add a new slide
 */
export function useAddSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      slide,
      position,
    }: {
      presentationId: string;
      slide: Partial<Slide>;
      position: number;
    }) => addSlide(presentationId, slide, position),

    onMutate: async ({ presentationId, slide, position }) => {
      await queryClient.cancelQueries({ queryKey: presentationKeys.detail(presentationId) });

      const previous = queryClient.getQueryData<Presentation>(presentationKeys.detail(presentationId));

      if (previous) {
        // Create temporary slide with temp ID
        const tempSlide: Slide = {
          id: `temp-${Date.now()}`,
          title: slide.title || '',
          content: slide.content || [],
          speakerNotes: slide.speakerNotes || '',
          imagePrompt: slide.imagePrompt || '',
          isImageLoading: false,
          layoutType: slide.layoutType || 'split',
          alignment: slide.alignment || 'left',
          ...slide,
        };

        const newSlides = [...previous.slides];
        newSlides.splice(position, 0, tempSlide);

        queryClient.setQueryData(presentationKeys.detail(presentationId), {
          ...previous,
          slides: newSlides,
        });
      }

      return { previous };
    },

    onError: (_err, { presentationId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), context.previous);
      }
    },

    onSuccess: (newSlide, { presentationId }) => {
      // Replace temp slide with real slide
      const current = queryClient.getQueryData<Presentation>(presentationKeys.detail(presentationId));
      if (current) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), {
          ...current,
          slides: current.slides.map(slide =>
            slide.id.startsWith('temp-') ? newSlide : slide
          ),
        });
      }
    },

    onSettled: (_data, _error, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to delete a slide
 */
export function useDeleteSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      slideId,
    }: {
      presentationId: string;
      slideId: string;
    }) => deleteSlide(presentationId, slideId),

    onMutate: async ({ presentationId, slideId }) => {
      await queryClient.cancelQueries({ queryKey: presentationKeys.detail(presentationId) });

      const previous = queryClient.getQueryData<Presentation>(presentationKeys.detail(presentationId));

      if (previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), {
          ...previous,
          slides: previous.slides.filter(slide => slide.id !== slideId),
        });
      }

      return { previous };
    },

    onError: (_err, { presentationId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), context.previous);
      }
    },

    onSettled: (_data, _error, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
    },
  });
}

/**
 * Hook to reorder slides
 */
export function useReorderSlides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      presentationId,
      slideOrders,
    }: {
      presentationId: string;
      slideOrders: Array<{ slideId: string; newPosition: number }>;
    }) => {
      // The actual API call would go here
      // For now, we rely on WebSocket for sync
      return { presentationId, slideOrders };
    },

    onMutate: async ({ presentationId, slideOrders }) => {
      await queryClient.cancelQueries({ queryKey: presentationKeys.detail(presentationId) });

      const previous = queryClient.getQueryData<Presentation>(presentationKeys.detail(presentationId));

      if (previous) {
        const slideMap = new Map(previous.slides.map(s => [s.id, s]));
        const reorderedSlides = slideOrders
          .sort((a, b) => a.newPosition - b.newPosition)
          .map(order => slideMap.get(order.slideId))
          .filter((s): s is Slide => s !== undefined);

        queryClient.setQueryData(presentationKeys.detail(presentationId), {
          ...previous,
          slides: reorderedSlides,
        });
      }

      return { previous };
    },

    onError: (_err, { presentationId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(presentationKeys.detail(presentationId), context.previous);
      }
    },
  });
}

export default {
  useCreatePresentation,
  useUpdatePresentation,
  useDeletePresentation,
  useDuplicatePresentation,
  useUpdateSlide,
  useAddSlide,
  useDeleteSlide,
  useReorderSlides,
};
