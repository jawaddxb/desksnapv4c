/**
 * DraftSetupOverlay Component
 *
 * Reusable overlay wrapper for DraftSetupPanel.
 * Handles the modal backdrop and conditional rendering.
 *
 * DRY: Replaces duplicated overlay wrapper code in SourcesWizard and CopilotPanel.
 * KISS: Simple conditional render with consistent styling.
 */

import React from 'react';
import { DraftSetupPanel } from './DraftSetupPanel';
import { ThemeSuggestion } from '@/types/ideation';
import { ContentDensity } from '@/lib/contentBlockPrompts';

export interface DraftSetupOverlayProps {
  /** Whether the overlay is visible */
  isOpen: boolean;
  /** Called when overlay should close (back button or backdrop click) */
  onClose: () => void;
  /** Currently selected theme ID */
  selectedThemeId: string;
  /** Called when theme is changed */
  onSelectTheme: (themeId: string) => void;
  /** Currently selected density */
  contentDensity: ContentDensity;
  /** Called when density is changed */
  onSelectDensity: (density: ContentDensity) => void;
  /** Called when user confirms. mode: 'direct' builds immediately, 'draft' goes to rough draft review */
  onConfirm: (mode: 'direct' | 'draft') => void;
  /** AI-suggested theme (optional) */
  suggestion?: ThemeSuggestion;
  /** Whether generation is in progress */
  isLoading?: boolean;
  /** Show only draft mode button (hide direct build) */
  draftOnly?: boolean;
}

/**
 * Overlay wrapper for DraftSetupPanel
 *
 * @example
 * ```tsx
 * const draftSetup = useDraftSetup();
 *
 * <DraftSetupOverlay
 *   isOpen={draftSetup.isOpen}
 *   onClose={draftSetup.close}
 *   selectedThemeId={draftSetup.themeId}
 *   onSelectTheme={draftSetup.setTheme}
 *   contentDensity={draftSetup.contentDensity}
 *   onSelectDensity={draftSetup.setDensity}
 *   onConfirm={handleConfirmBuild}
 *   isLoading={false}
 * />
 * ```
 */
export const DraftSetupOverlay: React.FC<DraftSetupOverlayProps> = ({
  isOpen,
  onClose,
  selectedThemeId,
  onSelectTheme,
  contentDensity,
  onSelectDensity,
  onConfirm,
  suggestion,
  isLoading = false,
  draftOnly = true, // Default to draft-only for Sources flow
}) => {
  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center">
      <DraftSetupPanel
        suggestion={suggestion}
        selectedThemeId={selectedThemeId}
        onSelectTheme={onSelectTheme}
        contentDensity={contentDensity}
        onSelectDensity={onSelectDensity}
        onConfirm={onConfirm}
        onBack={onClose}
        isLoading={isLoading}
        draftOnly={draftOnly}
      />
    </div>
  );
};

export default DraftSetupOverlay;
