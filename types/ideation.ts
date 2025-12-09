/**
 * Ideation Copilot Types
 *
 * Flat, simple data structures for the agentic ideation flow.
 * Notes connect via parentId references, positioned in swimlane columns.
 */

import { Message } from '../types';

// Swimlane column names (presentation narrative flow)
export const COLUMNS = ['Hook', 'Problem', 'Solution', 'Proof', 'CTA'] as const;
export type ColumnName = typeof COLUMNS[number];

// Note colors for visual categorization
export const NOTE_COLORS = {
  yellow: 'bg-amber-100 border-amber-300',      // User ideas
  blue: 'bg-blue-100 border-blue-300',          // AI suggestions
  green: 'bg-emerald-100 border-emerald-300',   // Research findings
  pink: 'bg-pink-100 border-pink-300',          // Questions/unknowns
  purple: 'bg-purple-100 border-purple-300',    // Key insights
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;

// Source of the note
export type NoteType = 'user' | 'ai' | 'research';

/**
 * A single sticky note on the ideation canvas.
 * Flat structure - connections via parentId, position via column/row.
 */
export interface IdeaNote {
  id: string;
  content: string;
  type: NoteType;
  sourceUrl?: string;           // URL source for research notes
  sourceTitle?: string;         // Title of research source
  parentId?: string;            // ID of parent note (for connectors)
  column: number;               // 0-4 index into COLUMNS
  row: number;                  // Vertical position within column
  color: NoteColor;
  approved: boolean;            // User has confirmed this note
  createdAt: number;
}

/**
 * Connection between two notes (for explicit multi-parent relationships)
 */
export interface NoteConnection {
  id: string;
  fromId: string;
  toId: string;
}

/**
 * An ideation session - the full state of a brainstorming canvas.
 */
export interface IdeationSession {
  id: string;
  topic: string;
  notes: IdeaNote[];
  connections: NoteConnection[];  // Additional connections beyond parentId
  messages: Message[];            // Conversation history with copilot
  stage: IdeationStage;
  createdAt: number;
  lastModified: number;
}

/**
 * Stages of the ideation process (for copilot guidance)
 */
export type IdeationStage = 'discover' | 'expand' | 'structure' | 'ready';

/**
 * Response from the agentic copilot
 */
export interface CopilotResponse {
  text: string;                   // Text response to display
  toolCalls?: ToolCall[];         // Tools the LLM called
}

/**
 * A tool call from the LLM
 */
export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

/**
 * Research result from web search
 */
export interface ResearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: string;              // Why this is relevant
}

/**
 * Deck plan preview before building
 */
export interface DeckPlan {
  sections: DeckPlanSection[];
  estimatedSlides: number;
  suggestedTheme?: string;
}

export interface DeckPlanSection {
  name: string;
  noteIds: string[];
  slideCount: number;
  layoutSuggestion: string;
}

// Helper functions

export function createNote(
  content: string,
  column: number,
  type: NoteType = 'user',
  color: NoteColor = 'yellow',
  parentId?: string
): IdeaNote {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    content,
    type,
    column,
    row: 0, // Will be computed based on existing notes in column
    color,
    parentId,
    approved: type === 'user', // User notes are auto-approved
    createdAt: Date.now(),
  };
}

export function createSession(topic: string): IdeationSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic,
    notes: [],
    connections: [],
    messages: [],
    stage: 'discover',
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
}

export function getColumnIndex(column: ColumnName | number): number {
  if (typeof column === 'number') return column;
  return COLUMNS.indexOf(column);
}

export function getColumnName(index: number): ColumnName {
  return COLUMNS[index] ?? 'Hook';
}
