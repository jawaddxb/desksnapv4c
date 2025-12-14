/**
 * useDraftSetup Hook
 *
 * Reusable state management for the DraftSetupPanel.
 * Encapsulates: isOpen, contentDensity, themeId, and their setters.
 *
 * DRY: Replaces duplicated useState calls in SourcesWizard and IdeationCopilot.
 * KISS: Simple interface, no complex logic.
 */

import { useState, useCallback } from 'react';
import { ContentDensity } from '@/lib/contentBlockPrompts';
import { DEFAULT_THEME_ID, DEFAULT_CONTENT_DENSITY } from '@/config/defaults';

/**
 * State and actions for draft setup (density + theme selection)
 */
export interface DraftSetupState {
  /** Whether the DraftSetupPanel is visible */
  isOpen: boolean;
  /** Selected content density */
  contentDensity: ContentDensity;
  /** Selected theme ID */
  themeId: string;
  /** Open the DraftSetupPanel */
  open: () => void;
  /** Close the DraftSetupPanel */
  close: () => void;
  /** Update content density */
  setDensity: (density: ContentDensity) => void;
  /** Update theme ID */
  setTheme: (themeId: string) => void;
}

/**
 * Hook for managing draft setup state (DraftSetupPanel)
 *
 * @returns DraftSetupState object with state and actions
 *
 * @example
 * ```tsx
 * const draftSetup = useDraftSetup();
 *
 * // Open panel when user clicks "Build Deck"
 * const handleBuildDeck = () => draftSetup.open();
 *
 * // Confirm with selected values
 * const handleConfirm = () => {
 *   onBuildDeck(session, draftSetup.contentDensity, draftSetup.themeId);
 *   draftSetup.close();
 * };
 *
 * // Render
 * <DraftSetupOverlay
 *   isOpen={draftSetup.isOpen}
 *   onClose={draftSetup.close}
 *   contentDensity={draftSetup.contentDensity}
 *   onSelectDensity={draftSetup.setDensity}
 *   selectedThemeId={draftSetup.themeId}
 *   onSelectTheme={draftSetup.setTheme}
 *   onConfirm={handleConfirm}
 * />
 * ```
 */
export function useDraftSetup(): DraftSetupState {
  const [isOpen, setIsOpen] = useState(false);
  const [contentDensity, setContentDensity] = useState<ContentDensity>(DEFAULT_CONTENT_DENSITY);
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    contentDensity,
    themeId,
    open,
    close,
    setDensity: setContentDensity,
    setTheme: setThemeId,
  };
}

export default useDraftSetup;
