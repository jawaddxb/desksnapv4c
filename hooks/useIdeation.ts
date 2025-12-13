/**
 * useIdeation Hook
 *
 * Single source of truth for ideation session state.
 * Orchestrates focused hooks for notes, connections, and tool execution.
 *
 * Uses TanStack Query for server state and local state for optimistic updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { Message, MessageRole, MessageRoleType } from '@/types';
import {
  IdeationSession,
  IdeaNote,
  IdeationStage,
  JournalEntry,
  createSession,
} from '@/types/ideation';
import { generateId } from '@/utils/idGenerator';
import { useSavedIdeations, useIdeationSession } from './queries/useIdeationQueries';
import {
  useCreateIdeation,
  useUpdateIdeation,
  useDeleteIdeation,
  useLinkIdeationToDeck,
} from './mutations/useIdeationMutations';
import { useAutoSave } from './useAutoSave';
import { updateIdeationSession } from '@/services/api/ideationService';

// Composed hooks
import {
  useIdeationNotes,
  useIdeationConnections,
  useIdeationTools,
  AddNoteOptions,
} from './ideation';

export interface UseIdeationReturn {
  // State
  session: IdeationSession | null;
  savedSessions: IdeationSession[];
  notes: IdeaNote[];
  messages: Message[];
  stage: IdeationStage;
  isThinking: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  isLoading: boolean;

  // Session operations
  startSession: (topic: string, sourceContent?: string) => void;
  loadSession: (id: string) => Promise<void>;
  closeSession: () => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  refreshSessionList: () => Promise<void>;

  // Note operations
  addNote: (content: string, column: number | string, options?: AddNoteOptions) => string;
  updateNote: (noteId: string, updates: Partial<IdeaNote>) => void;
  deleteNote: (noteId: string) => void;
  moveNote: (noteId: string, column: number, row: number) => void;
  approveNote: (noteId: string) => void;
  rejectNote: (noteId: string) => void;

  // Connection operations
  connectNotes: (fromId: string, toId: string) => void;
  disconnectNotes: (fromId: string, toId: string) => void;

  // Message operations
  addMessage: (role: MessageRoleType, text: string) => void;

  // Stage operations
  setStage: (stage: IdeationStage) => void;

  // Topic operations
  updateTopic: (topic: string) => void;

  // Journal operations
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;

  // Presentation linking (One-to-Many)
  linkToPresentation: (presentationId: string) => Promise<void>;

  // Tool executor (for agentic loop)
  executeToolCall: (tool: string, args: Record<string, unknown>) => Promise<unknown>;
}

export function useIdeation(): UseIdeationReturn {
  // Local session state (for optimistic updates)
  const [localSession, setLocalSession] = useState<IdeationSession | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Server state via TanStack Query
  const { savedIdeations, isLoading: isLoadingList, refetch: refetchList } = useSavedIdeations();
  const { data: fetchedSession, isLoading: isLoadingSession } = useIdeationSession(currentSessionId);

  // Mutations
  const createMutation = useCreateIdeation();
  const updateMutation = useUpdateIdeation();
  const deleteMutation = useDeleteIdeation();
  const linkToDeckMutation = useLinkIdeationToDeck();

  // ============ COMPOSED HOOKS ============

  // Note operations (composed)
  const {
    addNote,
    updateNote,
    deleteNote,
    moveNote,
    approveNote,
    rejectNote,
  } = useIdeationNotes({ setLocalSession });

  // Connection operations (composed)
  const {
    connectNotes,
    disconnectNotes,
  } = useIdeationConnections({ setLocalSession });

  // Sync fetched session to local state
  useEffect(() => {
    if (fetchedSession && currentSessionId) {
      setLocalSession(prev => {
        // If we already have local state, merge carefully
        if (prev && prev.id === fetchedSession.id) {
          // Use timestamp comparison instead of array length (more reliable)
          // If local session was modified after the fetch, preserve local changes
          const localIsNewer = prev.lastModified > fetchedSession.lastModified;
          return {
            ...fetchedSession,
            // Preserve local data if it's newer (user edited during fetch)
            notes: localIsNewer ? prev.notes : fetchedSession.notes,
            messages: localIsNewer ? prev.messages : fetchedSession.messages,
            creativeJournal: prev.creativeJournal || fetchedSession.creativeJournal,
            // Keep the later modification time
            lastModified: Math.max(prev.lastModified, fetchedSession.lastModified),
          };
        }
        return fetchedSession;
      });
    }
  }, [fetchedSession, currentSessionId]);

  // Auto-save handler
  const handleAutoSave = useCallback(async (session: IdeationSession) => {
    if (!session.id) return;
    try {
      await updateIdeationSession(session.id, session);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, []);

  // Auto-save using the reusable hook
  const { saveStatus, resetTracking, forceSave } = useAutoSave({
    data: localSession,
    onSave: handleAutoSave,
    onSaveComplete: () => refetchList(),
  });

  // ============ SESSION OPERATIONS ============

  const startSession = useCallback((topic: string, sourceContent?: string) => {
    const newSession: IdeationSession = {
      ...createSession(topic),
      sourceContent,
      generatedPresentationIds: [],
      creativeJournal: { entries: [] },
      syncStatus: 'pending',
    };

    setLocalSession(newSession);
    setCurrentSessionId(newSession.id);

    // Persist to API
    createMutation.mutate(newSession, {
      onSuccess: (savedSession) => {
        setLocalSession(savedSession);
        resetTracking(savedSession);
      },
    });
  }, [createMutation, resetTracking]);

  const loadSession = useCallback(async (id: string) => {
    setCurrentSessionId(id);
    // The useIdeationSession hook will fetch the data
    // and the useEffect will sync it to localSession
  }, []);

  const closeSession = useCallback(async () => {
    if (localSession) {
      await forceSave();
    }
    setLocalSession(null);
    setCurrentSessionId(null);
    resetTracking(null);
  }, [localSession, forceSave, resetTracking]);

  const deleteSession = useCallback(async (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        if (localSession?.id === id) {
          setLocalSession(null);
          setCurrentSessionId(null);
          resetTracking(null);
        }
      },
    });
  }, [deleteMutation, localSession, resetTracking]);

  const refreshSessionList = useCallback(async () => {
    await refetchList();
  }, [refetchList]);

  // ============ MESSAGE OPERATIONS ============

  const addMessage = useCallback((role: MessageRoleType, text: string) => {
    const message: Message = {
      id: generateId('msg'),
      role,
      text,
      timestamp: Date.now(),
    };

    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, message],
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  // ============ STAGE OPERATIONS ============

  const setStage = useCallback((stage: IdeationStage) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return { ...prev, stage, lastModified: Date.now(), syncStatus: 'pending' as const };
    });
  }, []);

  // ============ TOPIC OPERATIONS ============

  const updateTopic = useCallback((topic: string) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return { ...prev, topic, lastModified: Date.now(), syncStatus: 'pending' as const };
    });
  }, []);

  // ============ JOURNAL OPERATIONS ============

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const fullEntry: JournalEntry = {
      ...entry,
      id: generateId('journal'),
      timestamp: Date.now(),
    };

    setLocalSession(prev => {
      if (!prev) return null;
      const existingJournal = prev.creativeJournal || { entries: [] };
      return {
        ...prev,
        creativeJournal: {
          ...existingJournal,
          entries: [...existingJournal.entries, fullEntry],
        },
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  // ============ PRESENTATION LINKING ============

  const linkToPresentation = useCallback(async (presentationId: string) => {
    if (!localSession) return;

    // Optimistic update
    setLocalSession(prev => {
      if (!prev) return null;
      const existingIds = prev.generatedPresentationIds || [];
      if (existingIds.includes(presentationId)) return prev;
      return {
        ...prev,
        generatedPresentationIds: [...existingIds, presentationId],
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });

    // Persist to API
    linkToDeckMutation.mutate({
      sessionId: localSession.id,
      presentationId,
    });
  }, [localSession, linkToDeckMutation]);

  // ============ TOOL EXECUTOR (Composed) ============

  const { executeToolCall } = useIdeationTools({
    addNote,
    updateNote,
    deleteNote,
    connectNotes,
    moveNote,
    addMessage,
    setStage,
    updateTopic,
    addJournalEntry,
  });

  // ============ RETURN ============

  return {
    // State
    session: localSession,
    savedSessions: savedIdeations,
    notes: localSession?.notes ?? [],
    messages: localSession?.messages ?? [],
    stage: localSession?.stage ?? 'discover',
    isThinking,
    saveStatus,
    isLoading: isLoadingList || isLoadingSession,

    // Session operations
    startSession,
    loadSession,
    closeSession,
    deleteSession,
    refreshSessionList,

    // Note operations
    addNote,
    updateNote,
    deleteNote,
    moveNote,
    approveNote,
    rejectNote,

    // Connection operations
    connectNotes,
    disconnectNotes,

    // Message operations
    addMessage,

    // Stage operations
    setStage,

    // Topic operations
    updateTopic,

    // Journal operations
    addJournalEntry,

    // Presentation linking
    linkToPresentation,

    // Tool executor
    executeToolCall,
  };
}
