/**
 * WorkspaceRenderer Component
 *
 * Central component for rendering the active workspace.
 * Uses discriminated union pattern for type-safe mode switching.
 *
 * SRP: Single responsibility - workspace routing.
 */

import React from 'react';
import { useWorkspaceMode, WorkspaceMode } from '../contexts/WorkspaceModeContext';
import {
  IdeationWorkspace,
  RoughDraftWorkspace,
  BeautifyWorkspace,
  SourcesWorkspace,
  DeckWorkspace,
} from './workspaces';
import { DeckWorkspaceProps } from './workspaces/DeckWorkspace';
import { IdeationWorkspaceProps } from './workspaces/IdeationWorkspace';
import { BeautifyWorkspaceProps } from './workspaces/BeautifyWorkspace';
import { SourcesWorkspaceProps } from './workspaces/SourcesWorkspace';
import { RoughDraftResult } from '../services/agents';

/**
 * Props for the WorkspaceRenderer.
 * Collects all props needed by the various workspaces.
 */
export interface WorkspaceRendererProps {
  /** Props for DeckWorkspace (dashboard/deck editing) */
  deckProps: DeckWorkspaceProps;
  /** Props for IdeationWorkspace */
  ideationProps: Omit<IdeationWorkspaceProps, 'sessionId'>;
  /** Props for BeautifyWorkspace */
  beautifyProps: BeautifyWorkspaceProps;
  /** Props for SourcesWorkspace */
  sourcesProps: Omit<SourcesWorkspaceProps, 'preset' | 'recipe'>;
  /** Callback when rough draft is approved */
  onApproveRoughDraft: (result: RoughDraftResult) => Promise<void>;
}

/**
 * Renders the appropriate workspace based on current mode.
 */
export const WorkspaceRenderer: React.FC<WorkspaceRendererProps> = ({
  deckProps,
  ideationProps,
  beautifyProps,
  sourcesProps,
  onApproveRoughDraft,
}) => {
  const { mode } = useWorkspaceMode();

  // Render workspace based on mode type
  switch (mode.type) {
    case 'ideation':
      return (
        <IdeationWorkspace
          sessionId={mode.sessionId}
          {...ideationProps}
        />
      );

    case 'roughDraft':
      return (
        <RoughDraftWorkspace
          source={mode.source}
          input={mode.input}
          existingDraftId={mode.existingDraftId}
          ideationSessionId={mode.ideationSessionId}
          sourcesSessionId={mode.sourcesSessionId}
          sourcesPreset={mode.sourcesPreset}
          sourcesRecipe={mode.sourcesRecipe}
          onApprove={onApproveRoughDraft}
        />
      );

    case 'beautify':
      return <BeautifyWorkspace {...beautifyProps} />;

    case 'sources':
      return (
        <SourcesWorkspace
          preset={mode.preset}
          recipe={mode.recipe}
          {...sourcesProps}
        />
      );

    case 'presenting':
      // Presenting is an overlay on deck workspace
      // The DeckWorkspace handles the presenting overlay internally
      return <DeckWorkspace {...deckProps} />;

    case 'deck':
    case 'dashboard':
    default:
      return <DeckWorkspace {...deckProps} />;
  }
};

export default WorkspaceRenderer;
