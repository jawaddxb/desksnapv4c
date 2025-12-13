/**
 * Version Query Hooks
 *
 * TanStack Query hooks for fetching version history data.
 */

import { useQuery } from '@tanstack/react-query';
import { listVersions, Version } from '@/services/api/versionService';

// Query keys factory
export const versionKeys = {
  all: ['versions'] as const,
  list: (presentationId: string) => [...versionKeys.all, 'list', presentationId] as const,
};

/**
 * Hook to fetch version history for a presentation
 */
export function useVersions(presentationId: string | null) {
  return useQuery<Version[], Error>({
    queryKey: versionKeys.list(presentationId || ''),
    queryFn: () => listVersions(presentationId!),
    enabled: !!presentationId,
    staleTime: 60 * 1000, // 1 minute
  });
}

export default {
  useVersions,
};
