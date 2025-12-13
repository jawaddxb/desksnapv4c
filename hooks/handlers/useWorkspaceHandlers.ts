/**
 * Workspace Handlers Hook
 *
 * Handles workspace navigation and session management.
 * Extracted from AppContent.tsx for better organization.
 */

import { useCallback } from 'react';
import { deleteIdeationSession } from '../../services/api/ideationService';

export interface UseWorkspaceHandlersOptions {
  // Ideation state
  lastIdeationSessionId: string | null;
  setLastIdeationSessionId: (id: string | null) => void;
  setShowIdeationResumePrompt: (show: boolean) => void;

  // Workspace navigation
  goToIdeation: (id?: string) => void;
  goToRoughDraft: (
    source: string,
    options?: { existingDraftId?: string }
  ) => void;
  goToSources: (preset: 'video' | 'web' | 'mixed', recipe?: 'training' | 'explainer' | 'brief' | 'pitch') => void;
  goToBeautify: () => void;

  // Ideation queries
  refetchIdeations: () => Promise<unknown>;

  // Rough draft mutations
  deleteRoughDraftMutation: {
    mutate: (id: string) => void;
  };
  approveRoughDraftMutation: {
    mutate: (
      args: { id: string },
      options: { onSuccess: (presentation: { id: string }) => void }
    ) => void;
  };

  // Deck actions
  loadDeck: (id: string) => Promise<void>;

  // Onboarding
  markWelcomeSeen: () => void;
  handleCreateNew: () => void;
}

export interface UseWorkspaceHandlersReturn {
  // Navigation handlers
  handleIdeate: () => void;
  handleOpenSources: (
    preset: 'video' | 'web' | 'mixed',
    recipe?: 'training' | 'explainer' | 'brief' | 'pitch'
  ) => void;
  handleOpenBeautify: () => void;

  // Ideation handlers
  handleLoadIdeation: (id: string) => void;
  handleDeleteIdeation: (id: string) => Promise<void>;

  // Rough draft handlers
  handleLoadRoughDraft: (id: string) => void;
  handleDeleteRoughDraft: (id: string) => void;
  handleApproveRoughDraftFromDashboard: (id: string) => void;

  // Source viewing handlers
  handleViewSourceIdeation: (id: string) => void;
  handleViewSourceRoughDraft: (id: string) => void;

  // Welcome modal handlers
  handleWelcomePathSelect: (path: 'new-deck' | 'ideate' | 'beautify') => void;
  handleWelcomeSkip: () => void;

  // Resume prompt handlers
  handleResumeLastSession: () => void;
  handleStartFreshSession: () => void;
  handleChooseFromSaved: () => void;
  handleCloseResumePrompt: () => void;
}

export function useWorkspaceHandlers(
  options: UseWorkspaceHandlersOptions
): UseWorkspaceHandlersReturn {
  const {
    lastIdeationSessionId,
    setLastIdeationSessionId,
    setShowIdeationResumePrompt,
    goToIdeation,
    goToRoughDraft,
    goToSources,
    goToBeautify,
    refetchIdeations,
    deleteRoughDraftMutation,
    approveRoughDraftMutation,
    loadDeck,
    markWelcomeSeen,
    handleCreateNew,
  } = options;

  // Navigation handlers
  const handleIdeate = useCallback(() => {
    if (lastIdeationSessionId) {
      setShowIdeationResumePrompt(true);
    } else {
      goToIdeation();
    }
  }, [lastIdeationSessionId, goToIdeation, setShowIdeationResumePrompt]);

  const handleOpenSources = useCallback(
    (
      preset: 'video' | 'web' | 'mixed',
      recipe: 'training' | 'explainer' | 'brief' | 'pitch' = 'training'
    ) => {
      goToSources(preset, recipe);
    },
    [goToSources]
  );

  const handleOpenBeautify = useCallback(() => {
    goToBeautify();
  }, [goToBeautify]);

  // Ideation handlers
  const handleLoadIdeation = useCallback(
    (id: string) => {
      goToIdeation(id);
    },
    [goToIdeation]
  );

  const handleDeleteIdeation = useCallback(
    async (id: string) => {
      try {
        await deleteIdeationSession(id);
        refetchIdeations();
      } catch (error) {
        console.error('Failed to delete ideation:', error);
      }
    },
    [refetchIdeations]
  );

  // Rough draft handlers
  const handleLoadRoughDraft = useCallback(
    (id: string) => {
      goToRoughDraft('existing', { existingDraftId: id });
    },
    [goToRoughDraft]
  );

  const handleDeleteRoughDraft = useCallback(
    (id: string) => {
      deleteRoughDraftMutation.mutate(id);
    },
    [deleteRoughDraftMutation]
  );

  const handleApproveRoughDraftFromDashboard = useCallback(
    (id: string) => {
      approveRoughDraftMutation.mutate(
        { id },
        {
          onSuccess: (presentation) => {
            loadDeck(presentation.id);
          },
        }
      );
    },
    [approveRoughDraftMutation, loadDeck]
  );

  // Source viewing handlers
  const handleViewSourceIdeation = useCallback(
    (id: string) => {
      goToIdeation(id);
    },
    [goToIdeation]
  );

  const handleViewSourceRoughDraft = useCallback(
    (id: string) => {
      goToRoughDraft('existing', { existingDraftId: id });
    },
    [goToRoughDraft]
  );

  // Welcome modal handlers
  const handleWelcomePathSelect = useCallback(
    (path: 'new-deck' | 'ideate' | 'beautify') => {
      markWelcomeSeen();
      switch (path) {
        case 'new-deck':
          handleCreateNew();
          break;
        case 'ideate':
          goToIdeation();
          break;
        case 'beautify':
          goToBeautify();
          break;
      }
    },
    [markWelcomeSeen, goToIdeation, goToBeautify, handleCreateNew]
  );

  const handleWelcomeSkip = useCallback(() => {
    markWelcomeSeen();
  }, [markWelcomeSeen]);

  // Resume prompt handlers
  const handleResumeLastSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    if (lastIdeationSessionId) {
      goToIdeation(lastIdeationSessionId);
    } else {
      goToIdeation();
    }
  }, [lastIdeationSessionId, goToIdeation, setShowIdeationResumePrompt]);

  const handleStartFreshSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    setLastIdeationSessionId(null);
    goToIdeation();
  }, [goToIdeation, setShowIdeationResumePrompt, setLastIdeationSessionId]);

  const handleChooseFromSaved = useCallback(() => {
    setShowIdeationResumePrompt(false);
  }, [setShowIdeationResumePrompt]);

  const handleCloseResumePrompt = useCallback(() => {
    setShowIdeationResumePrompt(false);
  }, [setShowIdeationResumePrompt]);

  return {
    handleIdeate,
    handleOpenSources,
    handleOpenBeautify,
    handleLoadIdeation,
    handleDeleteIdeation,
    handleLoadRoughDraft,
    handleDeleteRoughDraft,
    handleApproveRoughDraftFromDashboard,
    handleViewSourceIdeation,
    handleViewSourceRoughDraft,
    handleWelcomePathSelect,
    handleWelcomeSkip,
    handleResumeLastSession,
    handleStartFreshSession,
    handleChooseFromSaved,
    handleCloseResumePrompt,
  };
}
