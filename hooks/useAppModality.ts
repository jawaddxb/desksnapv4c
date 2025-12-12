/**
 * useAppModality Hook
 *
 * State machine for managing app-level modality/views.
 * Single responsibility: Manage which major view is active.
 */

import { useState, useCallback, useMemo } from 'react';
import { RoughDraftInput } from '../services/agents';

/**
 * Source of rough draft content.
 */
export type RoughDraftSource = 'ideation' | 'copilot' | 'existing';

/**
 * Application modality states.
 * Only one modality can be active at a time.
 */
export type AppModality =
  | { type: 'dashboard' }
  | { type: 'presentation'; presentationId: string }
  | { type: 'ideation'; sessionId: string | null }
  | { type: 'roughDraft'; source: RoughDraftSource; input?: RoughDraftInput; ideationSessionId?: string; existingDraftId?: string };

export interface UseAppModalityResult {
  // Current modality
  modality: AppModality;

  // Type checks
  isDashboard: boolean;
  isPresentation: boolean;
  isIdeation: boolean;
  isRoughDraft: boolean;

  // Actions
  goToDashboard: () => void;
  goToPresentation: (presentationId: string) => void;
  goToIdeation: (sessionId?: string | null) => void;
  goToRoughDraft: (
    source: RoughDraftSource,
    options?: {
      input?: RoughDraftInput;
      ideationSessionId?: string;
      existingDraftId?: string;
    }
  ) => void;

  // Get specific modality data
  getPresentationId: () => string | null;
  getIdeationSessionId: () => string | null;
  getRoughDraftState: () => {
    source: RoughDraftSource;
    input?: RoughDraftInput;
    ideationSessionId?: string;
    existingDraftId?: string;
  } | null;
}

/**
 * Hook for managing application modality.
 */
export function useAppModality(
  initialModality: AppModality = { type: 'dashboard' }
): UseAppModalityResult {
  const [modality, setModality] = useState<AppModality>(initialModality);

  // Type checks
  const isDashboard = modality.type === 'dashboard';
  const isPresentation = modality.type === 'presentation';
  const isIdeation = modality.type === 'ideation';
  const isRoughDraft = modality.type === 'roughDraft';

  // Actions
  const goToDashboard = useCallback(() => {
    setModality({ type: 'dashboard' });
  }, []);

  const goToPresentation = useCallback((presentationId: string) => {
    setModality({ type: 'presentation', presentationId });
  }, []);

  const goToIdeation = useCallback((sessionId: string | null = null) => {
    setModality({ type: 'ideation', sessionId });
  }, []);

  const goToRoughDraft = useCallback((
    source: RoughDraftSource,
    options?: {
      input?: RoughDraftInput;
      ideationSessionId?: string;
      existingDraftId?: string;
    }
  ) => {
    setModality({
      type: 'roughDraft',
      source,
      ...options,
    });
  }, []);

  // Getters
  const getPresentationId = useCallback(() => {
    return modality.type === 'presentation' ? modality.presentationId : null;
  }, [modality]);

  const getIdeationSessionId = useCallback(() => {
    return modality.type === 'ideation' ? modality.sessionId : null;
  }, [modality]);

  const getRoughDraftState = useCallback(() => {
    if (modality.type !== 'roughDraft') return null;
    return {
      source: modality.source,
      input: modality.input,
      ideationSessionId: modality.ideationSessionId,
      existingDraftId: modality.existingDraftId,
    };
  }, [modality]);

  return useMemo(() => ({
    modality,
    isDashboard,
    isPresentation,
    isIdeation,
    isRoughDraft,
    goToDashboard,
    goToPresentation,
    goToIdeation,
    goToRoughDraft,
    getPresentationId,
    getIdeationSessionId,
    getRoughDraftState,
  }), [
    modality,
    isDashboard,
    isPresentation,
    isIdeation,
    isRoughDraft,
    goToDashboard,
    goToPresentation,
    goToIdeation,
    goToRoughDraft,
    getPresentationId,
    getIdeationSessionId,
    getRoughDraftState,
  ]);
}
