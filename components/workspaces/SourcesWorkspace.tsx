/**
 * SourcesWorkspace Component
 *
 * Full-screen workspace for the sources wizard.
 * VideoDeck / Research & Present functionality.
 *
 * SRP: Single responsibility - sources workspace UI.
 */

import React, { useCallback } from 'react';
import { SourcesWizard } from '../sources';
import { useWorkspaceMode, SourcesPreset, SourcesRecipe } from '@/contexts/WorkspaceModeContext';
import { IdeationSession } from '@/types/ideation';
import { ContentDensity } from '@/lib/contentBlockPrompts';
import { DEFAULT_THEME_ID, DEFAULT_CONTENT_DENSITY } from '@/config/defaults';

export interface SourcesWorkspaceProps {
  /** Preset mode: 'video' for VideoDeck, 'web' for Research & Present */
  preset: SourcesPreset;
  /** Recipe type for deck output */
  recipe: SourcesRecipe;
  /** Callback when building deck from sources (with density/theme from DraftSetupPanel) */
  onBuildDeck?: (session: IdeationSession, contentDensity?: ContentDensity, themeId?: string) => Promise<void>;
}

export const SourcesWorkspace: React.FC<SourcesWorkspaceProps> = ({
  preset,
  recipe,
  onBuildDeck,
}) => {
  const { goToDashboard, goToRoughDraft } = useWorkspaceMode();

  /**
   * Handle closing the wizard.
   */
  const handleClose = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  /**
   * Handle building deck from sources.
   * Routes to rough draft for preview with user-selected density/theme.
   */
  const handleBuildDeck = useCallback(async (
    session: IdeationSession,
    contentDensity?: ContentDensity,
    themeId?: string
  ) => {
    // Derive topic from session or sources
    const topic = session.topic || session.sources?.[0]?.title || 'Untitled';

    // Route to Rough Draft preview with user-selected density and theme
    // DRY: Uses centralized defaults from /config/defaults.ts
    goToRoughDraft('sources', {
      input: {
        topic,
        themeId: themeId || DEFAULT_THEME_ID,
        visualStyle: 'professional photography with clean backgrounds',
        ideationNotes: session.notes, // Include all notes
        source: 'sources', // Pass source type to agent for content preservation
        contentDensity: contentDensity || DEFAULT_CONTENT_DENSITY,
      },
      sourcesSessionId: session.id,
      sourcesPreset: preset,
      sourcesRecipe: recipe,
    });

    // Call the optional callback with density/theme
    await onBuildDeck?.(session, contentDensity, themeId);
  }, [goToRoughDraft, preset, recipe, onBuildDeck]);

  return (
    <SourcesWizard
      preset={preset}
      recipe={recipe}
      onClose={handleClose}
      onBuildDeck={handleBuildDeck}
    />
  );
};

export default SourcesWorkspace;
