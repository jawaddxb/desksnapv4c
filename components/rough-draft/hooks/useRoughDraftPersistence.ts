/**
 * useRoughDraftPersistence Hook
 *
 * Handles database persistence for rough drafts.
 * SRP: Single responsibility - persisting draft data to backend.
 *
 * Extracted from RoughDraftCanvas.tsx to improve maintainability.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { RoughDraftSlide } from '../../../services/agents/roughDraftAgent';
import { RoughDraft } from '../../../types/roughDraft';
import {
  createRoughDraft,
  updateSlide as apiUpdateSlide,
  approveRoughDraft,
} from '../../../services/api/roughDraftService';

/**
 * Check if a string is a valid UUID (v4 format)
 */
function isValidUUID(str: string | undefined): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export interface UseRoughDraftPersistenceOptions {
  /** Topic for the draft */
  topic: string;
  /** Theme ID */
  themeId: string;
  /** Visual style */
  visualStyle: string;
  /** Optional ideation session ID */
  ideationSessionId?: string;
  /** Whether this is a new draft (vs loading existing) */
  isNewDraft: boolean;
}

export interface UseRoughDraftPersistenceReturn {
  /** The persisted draft (after save) */
  persistedDraft: RoughDraft | null;
  /** Set the persisted draft (for loading existing) */
  setPersistedDraft: (draft: RoughDraft | null) => void;
  /** Whether a save is in progress */
  isSaving: boolean;
  /** Persist a new draft to the database */
  persistDraft: (slides: RoughDraftSlide[]) => Promise<void>;
  /** Save a single slide update (debounced) */
  debouncedSaveSlide: (slideId: string, updates: Partial<RoughDraftSlide>) => void;
  /** Approve the draft and create a presentation */
  approveDraft: (slides: RoughDraftSlide[]) => Promise<{ presentationId?: string }>;
}

/**
 * Hook for managing rough draft persistence.
 */
export function useRoughDraftPersistence(
  options: UseRoughDraftPersistenceOptions
): UseRoughDraftPersistenceReturn {
  const { topic, themeId, visualStyle, ideationSessionId, isNewDraft } = options;

  const [persistedDraft, setPersistedDraft] = useState<RoughDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Persist a new draft to the database.
   */
  const persistDraft = useCallback(async (slides: RoughDraftSlide[]) => {
    // Only persist when generating new drafts
    if (!isNewDraft) return;

    try {
      setIsSaving(true);

      // Only pass ideationSessionId if it's a valid UUID
      const validSessionId = isValidUUID(ideationSessionId) ? ideationSessionId : undefined;

      if (ideationSessionId && !validSessionId) {
        console.warn('[useRoughDraftPersistence] Invalid session ID format, skipping API link:', ideationSessionId);
      }

      const draft = await createRoughDraft({
        topic,
        themeId,
        visualStyle: visualStyle || '',
        status: 'ready',
        ideationSessionId: validSessionId,
        slides: slides.map((s, index) => ({
          position: index,
          title: s.title,
          content: s.content,
          speakerNotes: s.speakerNotes,
          imagePrompt: s.imagePrompt,
          imageUrl: s.imageUrl,
          layoutType: s.layoutType,
          alignment: s.alignment,
          approvalState: s.approvalState,
        })),
      });

      setPersistedDraft(draft);
      console.log('[useRoughDraftPersistence] Draft persisted:', draft.id);
    } catch (err) {
      console.error('[useRoughDraftPersistence] Failed to persist draft:', err);
      // Don't fail - draft can still work locally
    } finally {
      setIsSaving(false);
    }
  }, [topic, themeId, visualStyle, ideationSessionId, isNewDraft]);

  /**
   * Debounced save for slide updates.
   */
  const debouncedSaveSlide = useCallback((slideId: string, updates: Partial<RoughDraftSlide>) => {
    if (!persistedDraft) return;

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(async () => {
      const slideToUpdate = persistedDraft.slides.find(s => s.id === slideId);
      if (!slideToUpdate) return;

      try {
        setIsSaving(true);
        await apiUpdateSlide(persistedDraft.id, slideId, {
          title: updates.title,
          content: updates.content,
          speakerNotes: updates.speakerNotes,
          imagePrompt: updates.imagePrompt,
          imageUrl: updates.imageUrl,
          layoutType: updates.layoutType,
          alignment: updates.alignment,
          approvalState: updates.approvalState,
        });
        console.log('[useRoughDraftPersistence] Slide saved:', slideId);
      } catch (err) {
        console.error('[useRoughDraftPersistence] Failed to save slide:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, [persistedDraft]);

  /**
   * Approve the draft and create a presentation.
   */
  const approveDraft = useCallback(async (slides: RoughDraftSlide[]): Promise<{ presentationId?: string }> => {
    if (!persistedDraft) {
      return {}; // No persisted draft, approval handled locally
    }

    try {
      setIsSaving(true);
      const presentation = await approveRoughDraft(persistedDraft.id, {
        topic,
        themeId,
        visualStyle,
      });
      console.log('[useRoughDraftPersistence] Draft approved, presentation created:', presentation.id);
      return { presentationId: presentation.id };
    } catch (err) {
      console.error('[useRoughDraftPersistence] Failed to approve draft:', err);
      return {}; // Fall back to local approval
    } finally {
      setIsSaving(false);
    }
  }, [persistedDraft, topic, themeId, visualStyle]);

  return {
    persistedDraft,
    setPersistedDraft,
    isSaving,
    persistDraft,
    debouncedSaveSlide,
    approveDraft,
  };
}
