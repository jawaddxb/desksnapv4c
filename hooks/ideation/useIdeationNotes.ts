/**
 * useIdeationNotes Hook
 *
 * Manages note operations for ideation sessions.
 * Handles create, update, delete, and move operations.
 *
 * SRP: Note management within ideation sessions.
 */

import { useCallback } from 'react';
import {
  IdeationSession,
  IdeaNote,
  NoteColor,
  NoteType,
  createNote,
  getColumnIndex,
} from '@/types/ideation';

export interface AddNoteOptions {
  type?: NoteType;
  color?: NoteColor;
  parentId?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  approved?: boolean;
}

export interface UseIdeationNotesOptions {
  /** Setter for local session state */
  setLocalSession: React.Dispatch<React.SetStateAction<IdeationSession | null>>;
}

export interface UseIdeationNotesResult {
  /** Add a new note to a column */
  addNote: (content: string, column: number | string, options?: AddNoteOptions) => string;
  /** Update an existing note */
  updateNote: (noteId: string, updates: Partial<IdeaNote>) => void;
  /** Delete a note */
  deleteNote: (noteId: string) => void;
  /** Move a note to a new position */
  moveNote: (noteId: string, column: number, row: number) => void;
  /** Mark a note as approved */
  approveNote: (noteId: string) => void;
  /** Reject (delete) a note */
  rejectNote: (noteId: string) => void;
}

/**
 * Compute the next available row in a column.
 */
function computeNextRow(notes: IdeaNote[], column: number): number {
  const columnNotes = notes.filter(n => n.column === column);
  return columnNotes.length > 0 ? Math.max(...columnNotes.map(n => n.row)) + 1 : 0;
}

/**
 * Hook for managing ideation notes.
 */
export function useIdeationNotes({
  setLocalSession,
}: UseIdeationNotesOptions): UseIdeationNotesResult {

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
  }, [setLocalSession]);

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
  }, [setLocalSession]);

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
  }, [setLocalSession]);

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
  }, [setLocalSession]);

  const approveNote = useCallback((noteId: string) => {
    updateNote(noteId, { approved: true });
  }, [updateNote]);

  const rejectNote = useCallback((noteId: string) => {
    deleteNote(noteId);
  }, [deleteNote]);

  return {
    addNote,
    updateNote,
    deleteNote,
    moveNote,
    approveNote,
    rejectNote,
  };
}
