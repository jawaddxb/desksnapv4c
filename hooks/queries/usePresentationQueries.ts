/**
 * Presentation Query Hooks
 *
 * TanStack Query hooks for fetching presentations from the API.
 * These replace the local IndexedDB queries.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { listPresentations, getPresentation } from '../../services/api/presentationService';
import { Presentation } from '../../types';

// Query keys for cache management
export const presentationKeys = {
  all: ['presentations'] as const,
  lists: () => [...presentationKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...presentationKeys.lists(), { page, pageSize }] as const,
  details: () => [...presentationKeys.all, 'detail'] as const,
  detail: (id: string) => [...presentationKeys.details(), id] as const,
};

interface PresentationsListResult {
  presentations: Presentation[];
  total: number;
  pages: number;
}

/**
 * Hook to fetch list of presentations
 */
export function usePresentations(
  page: number = 1,
  pageSize: number = 50,
  options?: Omit<UseQueryOptions<PresentationsListResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: presentationKeys.list(page, pageSize),
    queryFn: () => listPresentations(page, pageSize),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Hook to fetch a single presentation with slides
 */
export function usePresentation(
  id: string | null,
  options?: Omit<UseQueryOptions<Presentation, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery({
    queryKey: presentationKeys.detail(id || ''),
    queryFn: () => getPresentation(id!),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Convenience hook to get all presentations as a flat list
 */
export function useSavedDecks() {
  const { data, ...rest } = usePresentations();
  return {
    ...rest,
    savedDecks: data?.presentations ?? [],
    total: data?.total ?? 0,
  };
}

export default {
  usePresentations,
  usePresentation,
  useSavedDecks,
};
