/**
 * Ideation Mutation Hooks
 *
 * TanStack Query mutation hooks with optimistic updates.
 * Handles create, update, delete operations with rollback on failure.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createIdeationSession,
  updateIdeationSession,
  deleteIdeationSession,
  addNote,
  updateNote,
  deleteNote,
  addConnection,
  removeConnection,
  linkToPresentation,
  addJournalEntry,
} from '../../services/api/ideationService';
import { ideationKeys } from '../queries/useIdeationQueries';
import { IdeationSession, IdeaNote, JournalEntry, createNote } from '../../types/ideation';

/**
 * Hook to create a new ideation session
 */
export function useCreateIdeation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIdeationSession,
    onSuccess: (newSession) => {
      // Add to detail cache
      queryClient.setQueryData(ideationKeys.detail(newSession.id), newSession);
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ideationKeys.lists() });
    },
  });
}

/**
 * Hook to update ideation session metadata
 */
export function useUpdateIdeation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IdeationSession> }) =>
      updateIdeationSession(id, updates),

    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(id) });

      // Snapshot previous value
      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(id));

      // Optimistically update
      if (previous) {
        queryClient.setQueryData(ideationKeys.detail(id), {
          ...previous,
          ...updates,
          lastModified: Date.now(),
          syncStatus: 'pending' as const,
        });
      }

      return { previous };
    },

    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(id), {
          ...context.previous,
          syncStatus: 'error' as const,
        });
      }
    },

    onSuccess: (data, { id }) => {
      // Update with server response
      queryClient.setQueryData(ideationKeys.detail(id), {
        ...data,
        syncStatus: 'synced' as const,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ideationKeys.lists() });
    },
  });
}

/**
 * Hook to delete an ideation session
 */
export function useDeleteIdeation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIdeationSession,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.lists() });

      // Remove from cache immediately
      queryClient.removeQueries({ queryKey: ideationKeys.detail(id) });

      return { id };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ideationKeys.lists() });
    },
  });
}

/**
 * Hook to add a note to an ideation session
 */
export function useAddIdeationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, note }: { sessionId: string; note: IdeaNote }) =>
      addNote(sessionId, note),

    onMutate: async ({ sessionId, note }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        // Create temporary note
        const tempNote: IdeaNote = {
          ...note,
          id: note.id || `temp-${Date.now()}`,
        };

        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          notes: [...previous.notes, tempNote],
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },

    onSuccess: (newNote, { sessionId }) => {
      // Replace temp note with real note
      const current = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));
      if (current) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...current,
          notes: current.notes.map(note =>
            note.id.startsWith('temp-') ? newNote : note
          ),
        });
      }
    },
  });
}

/**
 * Hook to update a note
 */
export function useUpdateIdeationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      noteId,
      updates,
    }: {
      sessionId: string;
      noteId: string;
      updates: Partial<IdeaNote>;
    }) => updateNote(sessionId, noteId, updates),

    onMutate: async ({ sessionId, noteId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          notes: previous.notes.map(note =>
            note.id === noteId ? { ...note, ...updates } : note
          ),
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },
  });
}

/**
 * Hook to delete a note
 */
export function useDeleteIdeationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, noteId }: { sessionId: string; noteId: string }) =>
      deleteNote(sessionId, noteId),

    onMutate: async ({ sessionId, noteId }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          notes: previous.notes.filter(note => note.id !== noteId),
          // Also remove connections involving this note
          connections: previous.connections.filter(
            conn => conn.fromId !== noteId && conn.toId !== noteId
          ),
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },
  });
}

/**
 * Hook to add a connection between notes
 */
export function useAddIdeationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      fromId,
      toId,
    }: {
      sessionId: string;
      fromId: string;
      toId: string;
    }) => addConnection(sessionId, fromId, toId),

    onMutate: async ({ sessionId, fromId, toId }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          connections: [
            ...previous.connections,
            { id: `temp-${Date.now()}`, fromId, toId },
          ],
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },

    onSuccess: (newConnection, { sessionId }) => {
      const current = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));
      if (current) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...current,
          connections: current.connections.map(conn =>
            conn.id.startsWith('temp-') ? newConnection : conn
          ),
        });
      }
    },
  });
}

/**
 * Hook to remove a connection
 */
export function useRemoveIdeationConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      connectionId,
    }: {
      sessionId: string;
      connectionId: string;
    }) => removeConnection(sessionId, connectionId),

    onMutate: async ({ sessionId, connectionId }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          connections: previous.connections.filter(conn => conn.id !== connectionId),
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },
  });
}

/**
 * Hook to link an ideation to a presentation (One-to-Many)
 */
export function useLinkIdeationToDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      presentationId,
    }: {
      sessionId: string;
      presentationId: string;
    }) => linkToPresentation(sessionId, presentationId),

    onMutate: async ({ sessionId, presentationId }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        const existingIds = previous.generatedPresentationIds || [];
        if (!existingIds.includes(presentationId)) {
          queryClient.setQueryData(ideationKeys.detail(sessionId), {
            ...previous,
            generatedPresentationIds: [...existingIds, presentationId],
            lastModified: Date.now(),
          });
        }
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },
  });
}

/**
 * Hook to add a journal entry to an ideation session
 */
export function useAddJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      entry,
    }: {
      sessionId: string;
      entry: JournalEntry;
    }) => addJournalEntry(sessionId, entry),

    onMutate: async ({ sessionId, entry }) => {
      await queryClient.cancelQueries({ queryKey: ideationKeys.detail(sessionId) });

      const previous = queryClient.getQueryData<IdeationSession>(ideationKeys.detail(sessionId));

      if (previous) {
        const existingJournal = previous.creativeJournal || { entries: [] };
        queryClient.setQueryData(ideationKeys.detail(sessionId), {
          ...previous,
          creativeJournal: {
            ...existingJournal,
            entries: [...existingJournal.entries, entry],
          },
          lastModified: Date.now(),
        });
      }

      return { previous };
    },

    onError: (_err, { sessionId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ideationKeys.detail(sessionId), context.previous);
      }
    },
  });
}

export default {
  useCreateIdeation,
  useUpdateIdeation,
  useDeleteIdeation,
  useAddIdeationNote,
  useUpdateIdeationNote,
  useDeleteIdeationNote,
  useAddIdeationConnection,
  useRemoveIdeationConnection,
  useLinkIdeationToDeck,
  useAddJournalEntry,
};
