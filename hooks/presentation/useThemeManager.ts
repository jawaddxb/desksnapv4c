/**
 * useThemeManager Hook
 *
 * Handles theme selection, typography, and layout management.
 * Single responsibility: Manage visual theme settings for presentations.
 */

import { useState, useCallback } from 'react';
import { Theme, ViewMode, Presentation } from '../../types';
import { THEMES } from '../../config/themes';
import { loadThemeFonts } from '../../lib/fonts';
import { WABI_SABI_LAYOUT_NAMES } from '../../config/layoutConstants';

export interface UseThemeManagerOptions {
  /** Current presentation */
  presentation: Presentation | null;
  /** State setter for presentation */
  setPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Mutation for updating presentation on server */
  updateMutation: {
    mutate: (data: { id: string; updates: Partial<Presentation> }) => void;
  };
  /** Presentation ID */
  presentationId: string | null;
  /** Function to regenerate all images with new style */
  regenerateAllImages?: (slides: Presentation['slides'], visualStyle: string) => void;
}

export interface UseThemeManagerResult {
  // State
  activeTheme: Theme;
  activeWabiSabiLayout: string;
  viewMode: ViewMode;

  // Setters
  setActiveTheme: (theme: Theme) => void;
  setViewMode: (mode: ViewMode) => void;

  // Actions
  applyTheme: (newTheme: Theme) => void;
  applyTypography: (typography: { headingFont: string; bodyFont: string }) => void;
  setWabiSabiLayout: (layoutName: string) => void;
  cycleWabiSabiLayout: (direction: 'next' | 'prev') => void;
  updateVisualStyleAndRegenerateImages: (newVisualStyle: string, regenerate?: boolean) => void;
}

/**
 * Hook for managing presentation theme and visual settings.
 */
export function useThemeManager({
  presentation,
  setPresentation,
  updateMutation,
  presentationId,
  regenerateAllImages,
}: UseThemeManagerOptions): UseThemeManagerResult {
  // Theme state
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES.neoBrutalist);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState<string>('Editorial');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');

  /**
   * Apply a new theme to the presentation.
   */
  const applyTheme = useCallback(
    (newTheme: Theme) => {
      setActiveTheme(newTheme);
      loadThemeFonts(newTheme.fonts.heading, newTheme.fonts.body);

      if (presentation && presentationId) {
        setPresentation({
          ...presentation,
          themeId: newTheme.id,
        });

        updateMutation.mutate({
          id: presentationId,
          updates: { themeId: newTheme.id },
        });
      }
    },
    [presentation, presentationId, setPresentation, updateMutation]
  );

  /**
   * Apply custom typography to the current theme.
   */
  const applyTypography = useCallback(
    (typography: { headingFont: string; bodyFont: string }) => {
      const customTheme: Theme = {
        ...activeTheme,
        fonts: {
          heading: typography.headingFont,
          body: typography.bodyFont,
        },
      };
      setActiveTheme(customTheme);
      loadThemeFonts(typography.headingFont, typography.bodyFont);
    },
    [activeTheme]
  );

  /**
   * Set the WabiSabi layout by name.
   */
  const setWabiSabiLayout = useCallback(
    (layoutName: string) => {
      setActiveWabiSabiLayout(layoutName);

      if (presentation && presentationId) {
        setPresentation({
          ...presentation,
          wabiSabiLayout: layoutName,
        });

        updateMutation.mutate({
          id: presentationId,
          updates: { wabiSabiLayout: layoutName },
        });
      }
    },
    [presentation, presentationId, setPresentation, updateMutation]
  );

  /**
   * Cycle through WabiSabi layouts.
   */
  const cycleWabiSabiLayout = useCallback(
    (direction: 'next' | 'prev') => {
      const currentIndex = WABI_SABI_LAYOUT_NAMES.indexOf(activeWabiSabiLayout);
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % WABI_SABI_LAYOUT_NAMES.length
          : (currentIndex - 1 + WABI_SABI_LAYOUT_NAMES.length) % WABI_SABI_LAYOUT_NAMES.length;
      setWabiSabiLayout(WABI_SABI_LAYOUT_NAMES[nextIndex]);
    },
    [activeWabiSabiLayout, setWabiSabiLayout]
  );

  /**
   * Update the visual style and optionally regenerate all images.
   */
  const updateVisualStyleAndRegenerateImages = useCallback(
    (newVisualStyle: string, regenerate: boolean = true) => {
      if (!presentation || !presentationId) return;

      setPresentation({
        ...presentation,
        visualStyle: newVisualStyle,
      });

      updateMutation.mutate({
        id: presentationId,
        updates: { visualStyle: newVisualStyle },
      });

      if (regenerate && regenerateAllImages) {
        regenerateAllImages(presentation.slides, newVisualStyle);
      }
    },
    [presentation, presentationId, setPresentation, updateMutation, regenerateAllImages]
  );

  return {
    // State
    activeTheme,
    activeWabiSabiLayout,
    viewMode,

    // Setters
    setActiveTheme,
    setViewMode,

    // Actions
    applyTheme,
    applyTypography,
    setWabiSabiLayout,
    cycleWabiSabiLayout,
    updateVisualStyleAndRegenerateImages,
  };
}
