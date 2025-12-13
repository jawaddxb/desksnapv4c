/**
 * RoughDraftWorkspace Component
 *
 * Full-screen workspace for reviewing and editing rough drafts.
 * Wraps RoughDraftCanvas with workspace-aware navigation.
 *
 * SRP: Single responsibility - rough draft workspace UI.
 */

import React, { useCallback } from 'react';
import { RoughDraftCanvas } from '../rough-draft';
import { useWorkspaceMode, RoughDraftSource, SourcesPreset, SourcesRecipe } from '../../contexts/WorkspaceModeContext';
import { RoughDraftInput, RoughDraftResult } from '../../services/agents';

export interface RoughDraftWorkspaceProps {
  /** Source of the draft */
  source: RoughDraftSource;
  /** Input for generating new draft */
  input?: RoughDraftInput;
  /** ID of existing draft to load */
  existingDraftId?: string;
  /** Ideation session ID (for back navigation) */
  ideationSessionId?: string;
  /** Sources session ID (for back navigation) */
  sourcesSessionId?: string;
  /** Sources preset (for back navigation) */
  sourcesPreset?: SourcesPreset;
  /** Sources recipe (for back navigation) */
  sourcesRecipe?: SourcesRecipe;
  /** Callback when draft is approved */
  onApprove?: (result: RoughDraftResult) => Promise<void>;
}

export const RoughDraftWorkspace: React.FC<RoughDraftWorkspaceProps> = ({
  source,
  input,
  existingDraftId,
  ideationSessionId,
  sourcesSessionId,
  sourcesPreset,
  sourcesRecipe,
  onApprove,
}) => {
  const { goToDashboard, goToIdeation, goToSources } = useWorkspaceMode();

  /**
   * Handle approving the draft.
   */
  const handleApprove = useCallback(async (result: RoughDraftResult) => {
    await onApprove?.(result);
    goToDashboard();
  }, [onApprove, goToDashboard]);

  /**
   * Handle going back to the previous workspace.
   */
  const handleBack = useCallback(() => {
    if (source === 'ideation' && ideationSessionId) {
      goToIdeation(ideationSessionId);
    } else if (source === 'sources' && sourcesPreset && sourcesRecipe) {
      goToSources(sourcesPreset, sourcesRecipe);
    } else {
      goToDashboard();
    }
  }, [source, ideationSessionId, sourcesPreset, sourcesRecipe, goToIdeation, goToSources, goToDashboard]);

  /**
   * Handle discarding the draft.
   */
  const handleDiscard = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  return (
    <RoughDraftCanvas
      input={input}
      existingDraftId={existingDraftId}
      source={source === 'sources' ? 'copilot' : source}
      ideationSessionId={ideationSessionId}
      onApprove={handleApprove}
      onBack={handleBack}
      onDiscard={handleDiscard}
    />
  );
};

export default RoughDraftWorkspace;
