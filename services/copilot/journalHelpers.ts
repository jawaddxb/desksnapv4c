/**
 * Journal Entry Helpers
 *
 * Utilities for creating and managing journal entries in the copilot agent.
 * Extracted from copilotAgent.ts for better SRP.
 */

import { JournalEntry, JournalStage } from '@/types/ideation';

export interface JournalEntryOptions {
  decision?: string;
  alternatives?: string[];
  confidence?: number;
  relatedNoteIds?: string[];
  relatedSlideIds?: string[];
  toolsCalled?: string[];
}

/**
 * Create a journal entry with unique ID and timestamp
 */
export function createJournalEntry(
  stage: JournalStage,
  title: string,
  narrative: string,
  options?: JournalEntryOptions
): JournalEntry {
  return {
    id: `journal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    stage,
    title,
    narrative,
    decision: options?.decision,
    alternatives: options?.alternatives,
    confidence: options?.confidence,
    relatedNoteIds: options?.relatedNoteIds,
    relatedSlideIds: options?.relatedSlideIds,
    toolsCalled: options?.toolsCalled,
  };
}
