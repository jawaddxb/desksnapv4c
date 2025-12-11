/**
 * Version Mutation Hooks
 *
 * TanStack Query mutation hooks for version history operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createVersion,
  restoreVersion,
  deleteVersion,
} from '../../services/api/versionService';
import { versionKeys } from '../queries/useVersionQueries';
import { presentationKeys } from '../queries/usePresentationQueries';

/**
 * Hook to create a new version checkpoint
 */
export function useCreateVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      label,
    }: {
      presentationId: string;
      label?: string;
    }) => createVersion(presentationId, label),

    onSuccess: (_, { presentationId }) => {
      // Invalidate version list to show the new version
      queryClient.invalidateQueries({ queryKey: versionKeys.list(presentationId) });
    },
  });
}

/**
 * Hook to restore a presentation to a specific version
 */
export function useRestoreVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      versionId,
    }: {
      presentationId: string;
      versionId: string;
    }) => restoreVersion(presentationId, versionId),

    onSuccess: (_, { presentationId }) => {
      // Invalidate both presentation detail and version list
      queryClient.invalidateQueries({ queryKey: presentationKeys.detail(presentationId) });
      queryClient.invalidateQueries({ queryKey: versionKeys.list(presentationId) });
    },
  });
}

/**
 * Hook to delete a version checkpoint
 */
export function useDeleteVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      presentationId,
      versionId,
    }: {
      presentationId: string;
      versionId: string;
    }) => deleteVersion(presentationId, versionId),

    onSuccess: (_, { presentationId }) => {
      queryClient.invalidateQueries({ queryKey: versionKeys.list(presentationId) });
    },
  });
}

export default {
  useCreateVersion,
  useRestoreVersion,
  useDeleteVersion,
};
