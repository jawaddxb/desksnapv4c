/**
 * Ideation Query Hooks
 *
 * TanStack Query hooks for fetching ideation sessions from the API.
 * These replace the local IndexedDB queries.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { listIdeationSessions, getIdeationSession } from '@/services/api/ideationService';
import { IdeationSession } from '@/types/ideation';

// Query keys for cache management
export const ideationKeys = {
  all: ['ideations'] as const,
  lists: () => [...ideationKeys.all, 'list'] as const,
  list: (page: number, pageSize: number) => [...ideationKeys.lists(), { page, pageSize }] as const,
  details: () => [...ideationKeys.all, 'detail'] as const,
  detail: (id: string) => [...ideationKeys.details(), id] as const,
};

interface IdeationListResult {
  sessions: IdeationSession[];
  total: number;
  pages: number;
}

/**
 * Hook to fetch list of ideation sessions
 */
export function useIdeationSessions(
  page: number = 1,
  pageSize: number = 50,
  options?: Omit<UseQueryOptions<IdeationListResult, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ideationKeys.list(page, pageSize),
    queryFn: () => listIdeationSessions(page, pageSize),
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Hook to fetch a single ideation session with all data
 */
export function useIdeationSession(
  id: string | null,
  options?: Omit<UseQueryOptions<IdeationSession, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery({
    queryKey: ideationKeys.detail(id || ''),
    queryFn: () => getIdeationSession(id!),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  });
}

/**
 * Convenience hook to get all ideation sessions as a flat list
 */
export function useSavedIdeations() {
  const { data, ...rest } = useIdeationSessions();
  return {
    ...rest,
    savedIdeations: data?.sessions ?? [],
    total: data?.total ?? 0,
  };
}

/**
 * Hook to get recent ideation sessions (for sidebar quick access)
 */
export function useRecentIdeations(limit: number = 5) {
  const { savedIdeations, ...rest } = useSavedIdeations();
  return {
    ...rest,
    recentIdeations: savedIdeations.slice(0, limit),
  };
}

export default {
  useIdeationSessions,
  useIdeationSession,
  useSavedIdeations,
  useRecentIdeations,
};
