/**
 * Rough Draft Query Hooks
 *
 * TanStack Query hooks for fetching rough drafts from the API.
 * Follows the same patterns as useIdeationQueries.
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  listRoughDrafts,
  getRoughDraft,
  createRoughDraft,
  updateRoughDraft,
  deleteRoughDraft,
  approveRoughDraft,
  addSlide,
  updateSlide,
  deleteSlide,
} from '@/services/api/roughDraftService';
import { RoughDraft, RoughDraftSlide, RoughDraftStatus } from '@/types/roughDraft';

// Query keys for cache management
export const roughDraftKeys = {
  all: ['roughDrafts'] as const,
  lists: () => [...roughDraftKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, status?: RoughDraftStatus) =>
    [...roughDraftKeys.lists(), { page, pageSize, status }] as const,
  details: () => [...roughDraftKeys.all, 'detail'] as const,
  detail: (id: string) => [...roughDraftKeys.details(), id] as const,
};

interface RoughDraftListResult {
  drafts: RoughDraft[];
  total: number;
  pages: number;
}

/**
 * Hook to fetch list of rough drafts
 */
export function useRoughDrafts(
  page: number = 1,
  pageSize: number = 50,
  statusFilter?: RoughDraftStatus,
  options?: Omit<UseQueryOptions<RoughDraftListResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: roughDraftKeys.list(page, pageSize, statusFilter),
    queryFn: () => listRoughDrafts(page, pageSize, statusFilter),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Hook to fetch a single rough draft with all slides
 */
export function useRoughDraft(
  id: string | null,
  options?: Omit<UseQueryOptions<RoughDraft, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery({
    queryKey: roughDraftKeys.detail(id || ''),
    queryFn: () => getRoughDraft(id!),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Convenience hook to get all rough drafts as a flat list
 */
export function useSavedRoughDrafts(statusFilter?: RoughDraftStatus) {
  const { data, ...rest } = useRoughDrafts(1, 50, statusFilter);
  return {
    ...rest,
    savedRoughDrafts: data?.drafts ?? [],
    total: data?.total ?? 0,
  };
}

/**
 * Hook to get recent rough drafts (for sidebar quick access)
 */
export function useRecentRoughDrafts(limit: number = 5) {
  const { savedRoughDrafts, ...rest } = useSavedRoughDrafts();
  return {
    ...rest,
    recentRoughDrafts: savedRoughDrafts.slice(0, limit),
  };
}

// ============ Mutation Hooks ============

/**
 * Hook for creating a new rough draft
 */
export function useCreateRoughDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: Partial<RoughDraft>) => createRoughDraft(draft),
    onSuccess: () => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.lists() });
    },
  });
}

/**
 * Hook for updating a rough draft
 */
export function useUpdateRoughDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<RoughDraft> }) =>
      updateRoughDraft(id, updates),
    onSuccess: (data) => {
      // Update the specific draft in cache
      queryClient.setQueryData(roughDraftKeys.detail(data.id), data);
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.lists() });
    },
  });
}

/**
 * Hook for deleting a rough draft
 */
export function useDeleteRoughDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoughDraft(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: roughDraftKeys.detail(id) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.lists() });
    },
  });
}

/**
 * Hook for approving a rough draft (converting to presentation)
 */
export function useApproveRoughDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      overrides,
    }: {
      id: string;
      overrides?: { topic?: string; themeId?: string; visualStyle?: string };
    }) => approveRoughDraft(id, overrides),
    onSuccess: (_, { id }) => {
      // Invalidate the draft (it's now approved)
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.detail(id) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.lists() });
      // Invalidate presentations list (new one was created)
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
    },
  });
}

// ============ Slide Mutation Hooks ============

/**
 * Hook for adding a slide to a rough draft
 */
export function useAddSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ draftId, slide }: { draftId: string; slide: Partial<RoughDraftSlide> }) =>
      addSlide(draftId, slide),
    onSuccess: (_, { draftId }) => {
      // Invalidate the draft to refetch with new slide
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.detail(draftId) });
    },
  });
}

/**
 * Hook for updating a slide in a rough draft
 */
export function useUpdateSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      draftId,
      slideId,
      updates,
    }: {
      draftId: string;
      slideId: string;
      updates: Partial<RoughDraftSlide>;
    }) => updateSlide(draftId, slideId, updates),
    onSuccess: (_, { draftId }) => {
      // Invalidate the draft to refetch with updated slide
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.detail(draftId) });
    },
  });
}

/**
 * Hook for deleting a slide from a rough draft
 */
export function useDeleteSlide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ draftId, slideId }: { draftId: string; slideId: string }) =>
      deleteSlide(draftId, slideId),
    onSuccess: (_, { draftId }) => {
      // Invalidate the draft to refetch without the slide
      queryClient.invalidateQueries({ queryKey: roughDraftKeys.detail(draftId) });
    },
  });
}

export default {
  useRoughDrafts,
  useRoughDraft,
  useSavedRoughDrafts,
  useRecentRoughDrafts,
  useCreateRoughDraft,
  useUpdateRoughDraft,
  useDeleteRoughDraft,
  useApproveRoughDraft,
  useAddSlide,
  useUpdateSlide,
  useDeleteSlide,
};
