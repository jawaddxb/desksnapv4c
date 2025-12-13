/**
 * useDeckUIState Hook
 *
 * Manages UI state for deck editing: theme, layout, view mode, and save status.
 * Extracted from useDeck to reduce complexity and group related state.
 *
 * SRP: UI state management for deck editing.
 */

import { useState, useCallback } from 'react';
import { Theme, ViewMode } from '@/types';
import { THEMES } from '@/config/themes';
import { loadGoogleFont } from '@/lib/fonts';

/** Save status for UI feedback */
export type SaveStatus = 'idle' | 'saving' | 'saved';

export interface UseDeckUIStateOptions {
  /** Initial theme (defaults to neoBrutalist) */
  initialTheme?: Theme;
  /** Initial layout (defaults to 'Editorial') */
  initialLayout?: string;
  /** Initial view mode (defaults to 'standard') */
  initialViewMode?: ViewMode;
}

export interface UseDeckUIStateResult {
  // State
  activeTheme: Theme;
  setActiveTheme: React.Dispatch<React.SetStateAction<Theme>>;
  activeWabiSabiLayout: string;
  setActiveWabiSabiLayout: React.Dispatch<React.SetStateAction<string>>;
  viewMode: ViewMode;
  setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  saveStatus: SaveStatus;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;

  // Self-contained actions (no external dependencies)
  actions: {
    /** Apply custom typography to the active theme */
    applyTypography: (headingFont: string, bodyFont: string) => void;
  };
}

/**
 * Hook for managing deck UI state.
 * Provides state and setters for theme, layout, view mode, and save status.
 * Complex actions that need presentation data remain in useDeck.
 */
export function useDeckUIState(options: UseDeckUIStateOptions = {}): UseDeckUIStateResult {
  const {
    initialTheme = THEMES.neoBrutalist,
    initialLayout = 'Editorial',
    initialViewMode = 'standard',
  } = options;

  // UI State
  const [activeTheme, setActiveTheme] = useState<Theme>(initialTheme);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState<string>(initialLayout);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Typography customization (self-contained - no external dependencies)
  const applyTypography = useCallback((headingFont: string, bodyFont: string) => {
    loadGoogleFont(headingFont);
    loadGoogleFont(bodyFont);
    setActiveTheme(prev => ({
      ...prev,
      fonts: {
        heading: `"${headingFont}", sans-serif`,
        body: `"${bodyFont}", sans-serif`,
      },
    }));
  }, []);

  return {
    activeTheme,
    setActiveTheme,
    activeWabiSabiLayout,
    setActiveWabiSabiLayout,
    viewMode,
    setViewMode,
    saveStatus,
    setSaveStatus,
    actions: {
      applyTypography,
    },
  };
}
