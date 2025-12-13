/**
 * Journal Entry Helpers
 *
 * Utilities for creating and managing journal entries in the copilot agent.
 * Extracted from copilotAgent.ts for better SRP.
 */

import { JournalEntry, JournalStage } from '@/types/ideation';
import { generateId } from '@/utils/idGenerator';

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
    id: generateId('journal'),
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
