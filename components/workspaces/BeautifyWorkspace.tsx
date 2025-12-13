/**
 * BeautifyWorkspace Component
 *
 * Full-screen workspace for the beautify wizard.
 * Transforms ugly decks into beautiful presentations.
 *
 * SRP: Single responsibility - beautify workspace UI.
 */

import React, { useCallback } from 'react';
import { BeautifyWizard } from '../beautify/BeautifyWizard';
import { useWorkspaceMode } from '../../contexts/WorkspaceModeContext';
import { Slide } from '../../types';

export interface BeautifyWorkspaceProps {
  /** Callback when beautification is complete */
  onComplete?: (slides: Slide[], themeId: string) => Promise<void>;
}

export const BeautifyWorkspace: React.FC<BeautifyWorkspaceProps> = ({
  onComplete,
}) => {
  const { goToDashboard } = useWorkspaceMode();

  /**
   * Handle closing the wizard.
   */
  const handleClose = useCallback(() => {
    goToDashboard();
  }, [goToDashboard]);

  /**
   * Handle completion of beautification.
   */
  const handleComplete = useCallback(async (slides: Slide[], themeId: string) => {
    await onComplete?.(slides, themeId);
    goToDashboard();
  }, [onComplete, goToDashboard]);

  return (
    <BeautifyWizard
      onClose={handleClose}
      onComplete={handleComplete}
    />
  );
};

export default BeautifyWorkspace;
