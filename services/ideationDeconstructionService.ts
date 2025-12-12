/**
 * Ideation Deconstruction Service
 *
 * Handles transformation of pasted content into structured ideation format.
 * Single responsibility: Parse and structure raw content into the 5-column narrative framework.
 */

import { getAIClient } from './aiClient';
import { parseAIJsonResponse } from './ai/parseJson';
import {
  IdeaNote,
  NoteConnection,
  JournalEntry,
  JournalStage,
  createNote,
} from '../types/ideation';
import {
  CONTENT_DECONSTRUCTION_PROMPT,
  CONTENT_DECONSTRUCTION_SCHEMA,
} from '../lib/prompts';

/**
 * Result from content deconstruction.
 */
export interface DeconstructionResult {
  topic: string;
  notes: IdeaNote[];
  connections: NoteConnection[];
  journalEntry: JournalEntry;
}

/**
 * Raw response from AI (before processing).
 */
interface RawDeconstructionResponse {
  topic: string;
  notes: Array<{
    content: string;
    column: number;
    reasoning: string;
  }>;
  connections: Array<{
    fromIndex: number;
    toIndex: number;
  }>;
  journalEntry: {
    title: string;
    narrative: string;
    stage: string;
  };
}

/**
 * Deconstruct pasted content into a structured ideation map.
 *
 * When users paste content directly into the AI chat (bypassing the ideation flow),
 * this function analyzes the content and breaks it down into the 5-column narrative
 * framework: Hook, Problem, Solution, Proof, CTA.
 *
 * Returns notes organized by column with AI reasoning, plus a journal entry
 * documenting the Creative Director's analysis process.
 *
 * @param pastedContent - Raw content pasted by user
 * @returns Structured ideation result with notes, connections, and journal
 */
export const deconstructContentToIdeation = async (
  pastedContent: string
): Promise<DeconstructionResult> => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${CONTENT_DECONSTRUCTION_PROMPT}

USER'S CONTENT TO ANALYZE:
"""
${pastedContent}
"""

Analyze this content and return the structured JSON response.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: CONTENT_DECONSTRUCTION_SCHEMA,
    },
  });

  const rawResult = parseAIJsonResponse<RawDeconstructionResponse>(response.text);

  // Convert raw notes to IdeaNote format
  const notes: IdeaNote[] = rawResult.notes.map((note, index) => {
    // Create a proper IdeaNote with all required fields
    const ideaNote = createNote(
      note.content,
      note.column,
      'ai', // AI-generated note
      'blue', // AI suggestion color
      undefined // No parent
    );
    // Set row based on position in column
    ideaNote.row = rawResult.notes
      .slice(0, index)
      .filter((n) => n.column === note.column).length;
    ideaNote.approved = true; // Auto-approve deconstructed notes
    return ideaNote;
  });

  // Convert index-based connections to ID-based connections
  const connections: NoteConnection[] = rawResult.connections
    .filter((conn) => conn.fromIndex < notes.length && conn.toIndex < notes.length)
    .map((conn) => ({
      id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fromId: notes[conn.fromIndex].id,
      toId: notes[conn.toIndex].id,
    }));

  // Create the journal entry
  const journalEntry: JournalEntry = {
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    stage: (rawResult.journalEntry.stage as JournalStage) || 'analyzing',
    title: rawResult.journalEntry.title,
    narrative: rawResult.journalEntry.narrative,
    relatedNoteIds: notes.map((n) => n.id),
  };

  return {
    topic: rawResult.topic,
    notes,
    connections,
    journalEntry,
  };
};

/**
 * Check if content should be deconstructed (substantial pasted content).
 *
 * Heuristics for "substantial" content:
 * - More than 200 characters
 * - Contains multiple paragraphs (double newlines)
 * - Contains list markers (bullets, numbers)
 *
 * @param content - Raw content to check
 * @returns True if content should be deconstructed
 */
export const shouldDeconstructContent = (content: string): boolean => {
  const hasLength = content.length > 200;
  const hasParagraphs = content.includes('\n\n');
  const hasListMarkers = /^[\s]*[-•*]|\d+\./m.test(content);

  return hasLength || hasParagraphs || hasListMarkers;
};
