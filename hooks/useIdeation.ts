/**
 * useIdeation Hook
 *
 * Single source of truth for ideation session state.
 * Handles CRUD operations via API, auto-save, and tool execution for the agentic copilot.
 *
 * Uses TanStack Query for server state and local state for optimistic updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { Message, MessageRole } from '../types';
import {
  IdeationSession,
  IdeaNote,
  NoteConnection,
  NoteColor,
  NoteType,
  IdeationStage,
  JournalEntry,
  JournalStage,
  CreativeJournal,
  COLUMNS,
  createSession,
  createNote,
  getColumnIndex,
} from '../types/ideation';
import { useSavedIdeations, useIdeationSession } from './queries/useIdeationQueries';
import {
  useCreateIdeation,
  useUpdateIdeation,
  useDeleteIdeation,
  useAddIdeationNote,
  useUpdateIdeationNote,
  useDeleteIdeationNote,
  useAddIdeationConnection,
  useLinkIdeationToDeck,
  useAddJournalEntry,
} from './mutations/useIdeationMutations';
import { useAutoSave } from './useAutoSave';
import { updateIdeationSession } from '../services/api/ideationService';

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
  addMessage: (role: MessageRole, text: string) => void;

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

interface AddNoteOptions {
  type?: NoteType;
  color?: NoteColor;
  parentId?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  approved?: boolean;
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
  const addJournalMutation = useAddJournalEntry();

  // Sync fetched session to local state
  useEffect(() => {
    if (fetchedSession && currentSessionId) {
      setLocalSession(prev => {
        // If we already have local state, merge carefully
        if (prev && prev.id === fetchedSession.id) {
          // Preserve local changes that haven't synced yet
          return {
            ...fetchedSession,
            notes: prev.notes.length > fetchedSession.notes.length ? prev.notes : fetchedSession.notes,
            messages: prev.messages.length > fetchedSession.messages.length ? prev.messages : fetchedSession.messages,
            creativeJournal: prev.creativeJournal || fetchedSession.creativeJournal,
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

  // ============ NOTE OPERATIONS ============

  const computeNextRow = (notes: IdeaNote[], column: number): number => {
    const columnNotes = notes.filter(n => n.column === column);
    return columnNotes.length > 0 ? Math.max(...columnNotes.map(n => n.row)) + 1 : 0;
  };

  const addNote = useCallback((
    content: string,
    column: number | string,
    options: AddNoteOptions = {}
  ): string => {
    const colIndex = typeof column === 'string' ? getColumnIndex(column as any) : column;

    const note = createNote(
      content,
      colIndex,
      options.type ?? 'user',
      options.color ?? (options.type === 'ai' ? 'blue' : options.type === 'research' ? 'green' : 'yellow'),
      options.parentId
    );

    if (options.sourceUrl) note.sourceUrl = options.sourceUrl;
    if (options.sourceTitle) note.sourceTitle = options.sourceTitle;
    if (options.approved !== undefined) note.approved = options.approved;

    setLocalSession(prev => {
      if (!prev) return null;
      const newRow = computeNextRow(prev.notes, colIndex);
      return {
        ...prev,
        notes: [...prev.notes, { ...note, row: newRow }],
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });

    return note.id;
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<IdeaNote>) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.map(n =>
          n.id === noteId ? { ...n, ...updates } : n
        ),
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.filter(n => n.id !== noteId),
        // Also remove connections involving this note
        connections: prev.connections.filter(
          c => c.fromId !== noteId && c.toId !== noteId
        ),
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  const moveNote = useCallback((noteId: string, column: number, row: number) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.map(n =>
          n.id === noteId ? { ...n, column, row } : n
        ),
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  const approveNote = useCallback((noteId: string) => {
    updateNote(noteId, { approved: true });
  }, [updateNote]);

  const rejectNote = useCallback((noteId: string) => {
    deleteNote(noteId);
  }, [deleteNote]);

  // ============ CONNECTION OPERATIONS ============

  const connectNotes = useCallback((fromId: string, toId: string) => {
    setLocalSession(prev => {
      if (!prev) return null;

      // Check if connection already exists
      const exists = prev.connections.some(
        c => c.fromId === fromId && c.toId === toId
      );
      if (exists) return prev;

      const connection: NoteConnection = {
        id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fromId,
        toId,
      };

      return {
        ...prev,
        connections: [...prev.connections, connection],
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  const disconnectNotes = useCallback((fromId: string, toId: string) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        connections: prev.connections.filter(
          c => !(c.fromId === fromId && c.toId === toId)
        ),
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, []);

  // ============ MESSAGE OPERATIONS ============

  const addMessage = useCallback((role: MessageRole, text: string) => {
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
      id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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

  // ============ TOOL EXECUTOR ============

  const executeToolCall = useCallback(async (
    tool: string,
    args: Record<string, unknown>
  ): Promise<unknown> => {
    switch (tool) {
      case 'set_topic': {
        const { topic } = args as { topic: string };
        updateTopic(topic);
        return { success: true, topic };
      }

      case 'create_note': {
        const { content, column, parentId, color } = args as {
          content: string;
          column: string;
          parentId?: string;
          color?: NoteColor;
        };
        const colIndex = COLUMNS.findIndex(
          c => c.toLowerCase() === (column as string).toLowerCase()
        );
        const noteId = addNote(content, colIndex >= 0 ? colIndex : 0, {
          type: 'ai',
          color: color ?? 'blue',
          parentId,
          approved: true, // AI notes are ready to use
        });
        return { success: true, noteId };
      }

      case 'update_note': {
        const { noteId, content } = args as { noteId: string; content: string };
        updateNote(noteId, { content });
        return { success: true };
      }

      case 'delete_note': {
        const { noteId } = args as { noteId: string };
        deleteNote(noteId);
        return { success: true };
      }

      case 'connect_notes': {
        const { fromId, toId } = args as { fromId: string; toId: string };
        connectNotes(fromId, toId);
        return { success: true };
      }

      case 'move_note': {
        const { noteId, column, row } = args as {
          noteId: string;
          column: string;
          row: number;
        };
        const colIndex = COLUMNS.findIndex(
          c => c.toLowerCase() === (column as string).toLowerCase()
        );
        if (colIndex >= 0) {
          moveNote(noteId, colIndex, row);
        }
        return { success: true };
      }

      case 'suggest_structure': {
        const { structure, rationale } = args as {
          structure: string[];
          rationale: string;
        };
        // Add journal entry for the structure suggestion
        addJournalEntry({
          stage: 'deciding',
          title: 'Suggesting Presentation Structure',
          narrative: rationale,
          decision: structure.join(' → '),
        });
        addMessage(
          MessageRole.SYSTEM,
          `Suggested structure: ${structure.join(' → ')}\n\nRationale: ${rationale}`
        );
        return { success: true, structure };
      }

      case 'mark_ready': {
        const { summary } = args as { summary: string };
        setStage('ready');
        addJournalEntry({
          stage: 'creating',
          title: 'Ideation Complete',
          narrative: summary,
        });
        addMessage(MessageRole.SYSTEM, `Deck plan ready: ${summary}`);
        return { success: true };
      }

      case 'ask_user': {
        // This is handled specially in the agent loop
        // The question is returned to the UI for display
        return { type: 'ask_user', ...args };
      }

      case 'research': {
        // Research results are passed in by the agent service
        const { query, results } = args as {
          query: string;
          results?: Array<{
            title: string;
            snippet: string;
            url?: string;
            relevance?: string;
          }>;
        };

        // Create notes from research findings if results provided
        if (results && results.length > 0) {
          for (const result of results.slice(0, 3)) {
            addNote(result.snippet, 3, { // Column 3 = Proof
              type: 'research',
              color: 'green',
              sourceUrl: result.url,
              sourceTitle: result.title,
              approved: true,
            });
          }

          // Add journal entry for research
          addJournalEntry({
            stage: 'exploring',
            title: 'Researching Your Topic',
            narrative: `I searched for "${query}" and found ${results.length} relevant sources to strengthen your presentation with data and evidence.`,
          });
        }

        return {
          success: true,
          query,
          resultsCount: results?.length ?? 0,
        };
      }

      default:
        console.warn(`Unknown tool: ${tool}`);
        return { success: false, error: `Unknown tool: ${tool}` };
    }
  }, [addNote, updateNote, deleteNote, connectNotes, moveNote, addMessage, setStage, updateTopic, addJournalEntry]);

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
