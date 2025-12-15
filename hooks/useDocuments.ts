/**
 * useDocuments Hook
 *
 * Manages document library state for AI reference material.
 * KISS: Simple hook combining queries and mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDocuments,
  getDocument,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentsForContext,
} from '@/services/api/documentService';
import type {
  Document,
  DocumentWithText,
  DocumentListResponse,
  DocumentUpdateRequest,
} from '@/types/documents';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (params?: { page?: number; status?: string }) =>
    [...documentKeys.lists(), params] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

// =============================================================================
// HOOK
// =============================================================================

export interface UseDocumentsReturn {
  // State
  documents: Document[];
  total: number;
  isLoading: boolean;
  isUploading: boolean;
  error: Error | null;

  // Operations
  upload: (file: File) => Promise<{ id: string }>;
  update: (id: string, updates: DocumentUpdateRequest) => Promise<Document>;
  remove: (id: string) => Promise<void>;
  refetch: () => Promise<void>;

  // For ideation context
  getForContext: (documentIds: string[]) => Promise<DocumentWithText[]>;
}

export function useDocuments(): UseDocumentsReturn {
  const queryClient = useQueryClient();

  // Query: List all documents
  const listQuery = useQuery({
    queryKey: documentKeys.list(),
    queryFn: () => getDocuments(),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutation: Upload document
  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      // Invalidate list to show new document
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });

  // Mutation: Update document
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: DocumentUpdateRequest }) =>
      updateDocument(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.list() });

      const previous = queryClient.getQueryData<DocumentListResponse>(documentKeys.list());

      if (previous) {
        queryClient.setQueryData(documentKeys.list(), {
          ...previous,
          items: previous.items.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(documentKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });

  // Mutation: Delete document
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: documentKeys.list() });

      const previous = queryClient.getQueryData<DocumentListResponse>(documentKeys.list());

      if (previous) {
        queryClient.setQueryData(documentKeys.list(), {
          ...previous,
          items: previous.items.filter((doc) => doc.id !== id),
          total: previous.total - 1,
        });
      }

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: documentKeys.detail(id) });

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(documentKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    documents: listQuery.data?.items ?? [],
    total: listQuery.data?.total ?? 0,
    isLoading: listQuery.isLoading,
    isUploading: uploadMutation.isPending,
    error: listQuery.error,

    // Operations
    upload: async (file: File) => {
      return uploadMutation.mutateAsync(file);
    },
    update: async (id: string, updates: DocumentUpdateRequest) => {
      return updateMutation.mutateAsync({ id, updates });
    },
    remove: async (id: string) => {
      return deleteMutation.mutateAsync(id);
    },
    refetch: async () => {
      await listQuery.refetch();
    },

    // For ideation context
    getForContext: getDocumentsForContext,
  };
}

// =============================================================================
// SINGLE DOCUMENT HOOK (for detail view)
// =============================================================================

export function useDocument(id: string | null) {
  return useQuery({
    queryKey: documentKeys.detail(id || ''),
    queryFn: () => getDocument(id!),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
}

export default useDocuments;
