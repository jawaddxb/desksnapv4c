/**
 * IdeationWorkspace Component
 *
 * Full-screen workspace for the ideation copilot.
 * Wraps IdeationCopilot with workspace-aware navigation.
 *
 * SRP: Single responsibility - ideation workspace UI.
 */

import React, { useCallback } from 'react';
import { IdeationCopilot } from '../ideation/IdeationCopilot';
import { useWorkspaceMode } from '@/contexts/WorkspaceModeContext';
import { PresentationPlanResponse } from '@/types';
import { RoughDraftInput } from '@/services/agents';

export interface IdeationWorkspaceProps {
  /** Session ID to load (optional, for resuming) */
  sessionId?: string;
  /** Callback when deck is built from ideation */
  onBuildDeck?: (deckPlan: {
    topic: string;
    slides: Array<{
      title: string;
      bulletPoints: string[];
      speakerNotes: string;
      imageVisualDescription: string;
      layoutType: string;
      alignment: string;
    }>;
    themeId: string;
    visualStyle: string;
  }) => Promise<void>;
  /** Callback to record last session ID for resume prompt */
  onSessionClose?: (sessionId?: string) => void;
}

export const IdeationWorkspace: React.FC<IdeationWorkspaceProps> = ({
  sessionId,
  onBuildDeck,
  onSessionClose,
}) => {
  const { goToDashboard, goToRoughDraft } = useWorkspaceMode();

  /**
   * Handle closing ideation - return to dashboard.
   */
  const handleClose = useCallback((closedSessionId?: string) => {
    onSessionClose?.(closedSessionId);
    goToDashboard();
  }, [goToDashboard, onSessionClose]);

  /**
   * Handle building deck from ideation.
   */
  const handleBuildDeck = useCallback(async (deckPlan: {
    topic: string;
    slides: Array<{
      title: string;
      bulletPoints: string[];
      speakerNotes: string;
      imageVisualDescription: string;
      layoutType: string;
      alignment: string;
    }>;
    themeId: string;
    visualStyle: string;
  }) => {
    await onBuildDeck?.(deckPlan);
    goToDashboard();
  }, [onBuildDeck, goToDashboard]);

  /**
   * Handle routing to rough draft from ideation.
   */
  const handleRoughDraft = useCallback((
    deckPlan: PresentationPlanResponse,
    ideationSessionId: string,
    notes?: Array<{ content: string; column: number }>
  ) => {
    // Transform notes to RoughDraftInput format
    const input: RoughDraftInput = {
      ideationNotes: notes?.map((n, i) => ({
        id: `note-${i}`,
        content: n.content,
        type: 'user' as const,
        column: n.column,
        row: 0,
        color: 'yellow' as const,
        approved: true,
        createdAt: Date.now(),
      })),
      topic: deckPlan.topic,
      themeId: deckPlan.themeId,
      visualStyle: deckPlan.visualStyle,
    };

    goToRoughDraft('ideation', {
      input,
      ideationSessionId,
    });
  }, [goToRoughDraft]);

  return (
    <IdeationCopilot
      sessionId={sessionId}
      onClose={handleClose}
      onBuildDeck={handleBuildDeck}
      onRoughDraft={handleRoughDraft}
    />
  );
};

export default IdeationWorkspace;
