/**
 * useIdeationTools Hook
 *
 * Handles tool execution for the agentic copilot.
 * Maps tool calls to ideation operations.
 *
 * SRP: Tool execution and agent integration.
 */

import { useCallback } from 'react';
import { Message, MessageRole, MessageRoleType } from '../../types';
import {
  IdeationSession,
  IdeationStage,
  JournalEntry,
  NoteColor,
  COLUMNS,
} from '../../types/ideation';
import { AddNoteOptions } from './useIdeationNotes';

export interface UseIdeationToolsOptions {
  /** Add a note to the board */
  addNote: (content: string, column: number | string, options?: AddNoteOptions) => string;
  /** Update an existing note */
  updateNote: (noteId: string, updates: { content?: string }) => void;
  /** Delete a note */
  deleteNote: (noteId: string) => void;
  /** Connect two notes */
  connectNotes: (fromId: string, toId: string) => void;
  /** Move a note */
  moveNote: (noteId: string, column: number, row: number) => void;
  /** Add a chat message */
  addMessage: (role: MessageRoleType, text: string) => void;
  /** Set the ideation stage */
  setStage: (stage: IdeationStage) => void;
  /** Update the topic */
  updateTopic: (topic: string) => void;
  /** Add a journal entry */
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
}

export interface UseIdeationToolsResult {
  /** Execute a tool call from the agent */
  executeToolCall: (tool: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Hook for executing agent tool calls.
 */
export function useIdeationTools({
  addNote,
  updateNote,
  deleteNote,
  connectNotes,
  moveNote,
  addMessage,
  setStage,
  updateTopic,
  addJournalEntry,
}: UseIdeationToolsOptions): UseIdeationToolsResult {

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

  return {
    executeToolCall,
  };
}
