/**
 * WorkspaceRenderer Component
 *
 * Central component for rendering overlay workspaces (ideation, rough draft, etc).
 * Returns null for deck/dashboard modes - App.tsx handles those directly.
 *
 * SRP: Single responsibility - workspace routing for overlay modes.
 */

import React from 'react';
import { useWorkspaceMode } from '@/contexts/WorkspaceModeContext';
import {
  IdeationWorkspace,
  RoughDraftWorkspace,
  BeautifyWorkspace,
  SourcesWorkspace,
} from './workspaces';
import { IdeationWorkspaceProps } from './workspaces/IdeationWorkspace';
import { BeautifyWorkspaceProps } from './workspaces/BeautifyWorkspace';
import { RoughDraftResult } from '@/services/agents';

/**
 * Props for the WorkspaceRenderer.
 * Only includes props for overlay workspaces (not deck/dashboard).
 */
export interface WorkspaceRendererProps {
  /** Props for IdeationWorkspace */
  ideationProps: Omit<IdeationWorkspaceProps, 'sessionId'>;
  /** Props for BeautifyWorkspace */
  beautifyProps: BeautifyWorkspaceProps;
  /** Callback when rough draft is approved */
  onApproveRoughDraft: (result: RoughDraftResult) => Promise<void>;
}

/**
 * Renders the appropriate overlay workspace based on current mode.
 * Returns null for deck/dashboard/presenting modes - App.tsx handles those.
 */
export const WorkspaceRenderer: React.FC<WorkspaceRendererProps> = ({
  ideationProps,
  beautifyProps,
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
        />
      );

    // Deck, dashboard, and presenting modes return null
    // App.tsx handles these directly to avoid massive prop drilling
    case 'presenting':
    case 'deck':
    case 'dashboard':
    default:
      return null;
  }
};

export default WorkspaceRenderer;
