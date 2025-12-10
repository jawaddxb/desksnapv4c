/**
 * useIdeation Hook
 *
 * Single source of truth for ideation session state.
 * Handles CRUD operations, auto-save, and tool execution for the agentic copilot.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, MessageRole } from '../types';
import {
  IdeationSession,
  IdeaNote,
  NoteConnection,
  NoteColor,
  NoteType,
  IdeationStage,
  COLUMNS,
  createSession,
  createNote,
  getColumnIndex,
} from '../types/ideation';
import {
  getIdeationSessions,
  getIdeationSession,
  saveIdeationSession,
  deleteIdeationSession,
} from '../services/storageService';

export interface UseIdeationReturn {
  // State
  session: IdeationSession | null;
  savedSessions: IdeationSession[];
  notes: IdeaNote[];
  messages: Message[];
  stage: IdeationStage;
  isThinking: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';

  // Session operations
  startSession: (topic: string) => void;
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
  const [session, setSession] = useState<IdeationSession | null>(null);
  const [savedSessions, setSavedSessions] = useState<IdeationSession[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Track previous session state for auto-save change detection
  const prevSessionRef = useRef<string | null>(null);

  // Load sessions on mount
  useEffect(() => {
    refreshSessionList();
  }, []);

  // Auto-save with 2s debounce
  useEffect(() => {
    if (!session) return;

    const currentString = JSON.stringify(session);
    if (prevSessionRef.current !== currentString) {
      setSaveStatus('saving');
      const timer = setTimeout(async () => {
        await saveIdeationSession(session);
        setSaveStatus('saved');
        refreshSessionList();
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 2000);

      prevSessionRef.current = currentString;
      return () => clearTimeout(timer);
    }
  }, [session]);

  // ============ SESSION OPERATIONS ============

  const refreshSessionList = async () => {
    const sessions = await getIdeationSessions();
    setSavedSessions(sessions);
  };

  const startSession = (topic: string) => {
    const newSession = createSession(topic);
    setSession(newSession);
    prevSessionRef.current = JSON.stringify(newSession);

    // Save immediately
    saveIdeationSession(newSession).then(refreshSessionList);
  };

  const loadSession = async (id: string) => {
    const loaded = await getIdeationSession(id);
    if (loaded) {
      setSession(loaded);
      prevSessionRef.current = JSON.stringify(loaded);
    }
  };

  const closeSession = async () => {
    if (session) {
      await saveIdeationSession(session);
    }
    setSession(null);
    prevSessionRef.current = null;
    refreshSessionList();
  };

  const deleteSession = async (id: string) => {
    await deleteIdeationSession(id);
    if (session?.id === id) {
      setSession(null);
      prevSessionRef.current = null;
    }
    refreshSessionList();
  };

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

    setSession(prev => {
      if (!prev) return null;
      const newRow = computeNextRow(prev.notes, colIndex);
      return {
        ...prev,
        notes: [...prev.notes, { ...note, row: newRow }],
        lastModified: Date.now(),
      };
    });

    return note.id;
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<IdeaNote>) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.map(n =>
          n.id === noteId ? { ...n, ...updates } : n
        ),
        lastModified: Date.now(),
      };
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.filter(n => n.id !== noteId),
        // Also remove connections involving this note
        connections: prev.connections.filter(
          c => c.fromId !== noteId && c.toId !== noteId
        ),
        lastModified: Date.now(),
      };
    });
  }, []);

  const moveNote = useCallback((noteId: string, column: number, row: number) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: prev.notes.map(n =>
          n.id === noteId ? { ...n, column, row } : n
        ),
        lastModified: Date.now(),
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
    setSession(prev => {
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
      };
    });
  }, []);

  const disconnectNotes = useCallback((fromId: string, toId: string) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        connections: prev.connections.filter(
          c => !(c.fromId === fromId && c.toId === toId)
        ),
        lastModified: Date.now(),
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

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, message],
        lastModified: Date.now(),
      };
    });
  }, []);

  // ============ STAGE OPERATIONS ============

  const setStage = useCallback((stage: IdeationStage) => {
    setSession(prev => {
      if (!prev) return null;
      return { ...prev, stage, lastModified: Date.now() };
    });
  }, []);

  // ============ TOPIC OPERATIONS ============

  const updateTopic = useCallback((topic: string) => {
    setSession(prev => {
      if (!prev) return null;
      return { ...prev, topic, lastModified: Date.now() };
    });
  }, []);

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
        // For now, just add a system message about the structure
        addMessage(
          MessageRole.SYSTEM,
          `Suggested structure: ${structure.join(' → ')}\n\nRationale: ${rationale}`
        );
        return { success: true, structure };
      }

      case 'mark_ready': {
        const { summary } = args as { summary: string };
        setStage('ready');
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
  }, [addNote, updateNote, deleteNote, connectNotes, moveNote, addMessage, setStage, updateTopic]);

  // ============ RETURN ============

  return {
    // State
    session,
    savedSessions,
    notes: session?.notes ?? [],
    messages: session?.messages ?? [],
    stage: session?.stage ?? 'discover',
    isThinking,
    saveStatus,

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

    // Tool executor
    executeToolCall,
  };
}
