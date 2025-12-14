/**
 * WorkspaceModeContext
 *
 * Type-safe workspace mode management using discriminated unions.
 * Extends useAppModality pattern with all workspace modes and history.
 *
 * SRP: Single responsibility - workspace mode state and navigation.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useRef } from 'react';
import { RoughDraftInput } from '@/services/agents';

/**
 * Source of rough draft content.
 */
export type RoughDraftSource = 'ideation' | 'copilot' | 'existing' | 'sources';

/**
 * Sources wizard preset type.
 */
export type SourcesPreset = 'video' | 'web' | 'mixed';

/**
 * Sources wizard recipe type.
 */
export type SourcesRecipe = 'training' | 'explainer' | 'brief' | 'pitch';

/**
 * Workspace mode discriminated union.
 * Only one mode can be active at a time.
 */
export type WorkspaceMode =
  | { type: 'dashboard' }
  | { type: 'deck'; presentationId: string }
  | { type: 'ideation'; sessionId?: string }
  | {
      type: 'roughDraft';
      source: RoughDraftSource;
      input?: RoughDraftInput;
      ideationSessionId?: string;
      existingDraftId?: string;
      sourcesSessionId?: string;
      sourcesPreset?: SourcesPreset;
      sourcesRecipe?: SourcesRecipe;
    }
  | { type: 'beautify' }
  | { type: 'sources'; preset: SourcesPreset; recipe: SourcesRecipe }
  | { type: 'presenting'; previousMode: WorkspaceMode; mobile?: boolean };

/**
 * Navigation options for rough draft mode.
 */
export interface RoughDraftNavigationOptions {
  input?: RoughDraftInput;
  ideationSessionId?: string;
  existingDraftId?: string;
  sourcesSessionId?: string;
  sourcesPreset?: SourcesPreset;
  sourcesRecipe?: SourcesRecipe;
}

export interface WorkspaceModeContextValue {
  /** Current workspace mode */
  mode: WorkspaceMode;

  /** Type guards */
  isDashboard: boolean;
  isDeck: boolean;
  isIdeation: boolean;
  isRoughDraft: boolean;
  isBeautify: boolean;
  isSources: boolean;
  isPresenting: boolean;
  isMobilePresenting: boolean;

  /** Navigation actions */
  goToDashboard: () => void;
  goToDeck: (presentationId: string) => void;
  goToIdeation: (sessionId?: string) => void;
  goToRoughDraft: (source: RoughDraftSource, options?: RoughDraftNavigationOptions) => void;
  goToBeautify: () => void;
  goToSources: (preset: SourcesPreset, recipe: SourcesRecipe) => void;
  startPresenting: () => void;
  startMobilePresenting: () => void;
  stopPresenting: () => void;

  /** History navigation */
  goBack: () => void;
  canGoBack: boolean;

  /** Getters for type-safe access */
  getPresentationId: () => string | null;
  getIdeationSessionId: () => string | null;
  getRoughDraftState: () => (WorkspaceMode & { type: 'roughDraft' }) | null;
  getSourcesState: () => { preset: SourcesPreset; recipe: SourcesRecipe } | null;
}

const WorkspaceModeContext = createContext<WorkspaceModeContextValue | null>(null);

export interface WorkspaceModeProviderProps {
  children: ReactNode;
  initialMode?: WorkspaceMode;
}

/**
 * Provider for workspace mode state.
 */
export function WorkspaceModeProvider({
  children,
  initialMode = { type: 'dashboard' },
}: WorkspaceModeProviderProps) {
  const [mode, setMode] = useState<WorkspaceMode>(initialMode);
  const historyRef = useRef<WorkspaceMode[]>([]);

  // Push current mode to history before navigating
  const navigateTo = useCallback((newMode: WorkspaceMode) => {
    setMode(current => {
      // Don't push presenting mode to history (it's a temporary overlay)
      if (current.type !== 'presenting') {
        historyRef.current.push(current);
        // Keep history limited to prevent memory leaks
        if (historyRef.current.length > 10) {
          historyRef.current.shift();
        }
      }
      return newMode;
    });
  }, []);

  // Type guards
  const isDashboard = mode.type === 'dashboard';
  const isDeck = mode.type === 'deck';
  const isIdeation = mode.type === 'ideation';
  const isRoughDraft = mode.type === 'roughDraft';
  const isBeautify = mode.type === 'beautify';
  const isSources = mode.type === 'sources';
  const isPresenting = mode.type === 'presenting';
  const isMobilePresenting = mode.type === 'presenting' && mode.mobile === true;

  // Navigation actions
  const goToDashboard = useCallback(() => {
    navigateTo({ type: 'dashboard' });
  }, [navigateTo]);

  const goToDeck = useCallback((presentationId: string) => {
    navigateTo({ type: 'deck', presentationId });
  }, [navigateTo]);

  const goToIdeation = useCallback((sessionId?: string) => {
    navigateTo({ type: 'ideation', sessionId });
  }, [navigateTo]);

  const goToRoughDraft = useCallback((
    source: RoughDraftSource,
    options?: RoughDraftNavigationOptions
  ) => {
    navigateTo({
      type: 'roughDraft',
      source,
      ...options,
    });
  }, [navigateTo]);

  const goToBeautify = useCallback(() => {
    navigateTo({ type: 'beautify' });
  }, [navigateTo]);

  const goToSources = useCallback((preset: SourcesPreset, recipe: SourcesRecipe) => {
    navigateTo({ type: 'sources', preset, recipe });
  }, [navigateTo]);

  // Presenting is special - it overlays the current mode
  const startPresenting = useCallback(() => {
    setMode(current => {
      // Don't nest presenting modes
      if (current.type === 'presenting') return current;
      return { type: 'presenting', previousMode: current };
    });
  }, []);

  // Mobile presenting - same as presenting but with mobile flag
  const startMobilePresenting = useCallback(() => {
    setMode(current => {
      // Don't nest presenting modes
      if (current.type === 'presenting') return current;
      return { type: 'presenting', previousMode: current, mobile: true };
    });
  }, []);

  const stopPresenting = useCallback(() => {
    setMode(current => {
      if (current.type === 'presenting') {
        // Validate previousMode exists and has valid type
        const prev = current.previousMode;
        if (prev && prev.type && prev.type !== 'presenting') {
          return prev;
        }
        // Fallback to dashboard if previousMode is invalid
        return { type: 'dashboard' };
      }
      return current;
    });
  }, []);

  // History navigation - use state callback for atomicity (prevents race conditions)
  const goBack = useCallback(() => {
    setMode(current => {
      const history = historyRef.current;
      if (history.length === 0) return current;
      const previous = history.pop()!;
      return previous;
    });
  }, []);

  // canGoBack is a getter since historyRef doesn't trigger re-renders
  const canGoBack = historyRef.current.length > 0;

  // Type-safe getters
  const getPresentationId = useCallback((): string | null => {
    if (mode.type === 'deck') return mode.presentationId;
    return null;
  }, [mode]);

  const getIdeationSessionId = useCallback((): string | null => {
    if (mode.type === 'ideation') return mode.sessionId || null;
    return null;
  }, [mode]);

  const getRoughDraftState = useCallback((): (WorkspaceMode & { type: 'roughDraft' }) | null => {
    if (mode.type === 'roughDraft') return mode;
    return null;
  }, [mode]);

  const getSourcesState = useCallback((): { preset: SourcesPreset; recipe: SourcesRecipe } | null => {
    if (mode.type === 'sources') {
      return { preset: mode.preset, recipe: mode.recipe };
    }
    return null;
  }, [mode]);

  const value = useMemo<WorkspaceModeContextValue>(() => ({
    mode,
    isDashboard,
    isDeck,
    isIdeation,
    isRoughDraft,
    isBeautify,
    isSources,
    isPresenting,
    isMobilePresenting,
    goToDashboard,
    goToDeck,
    goToIdeation,
    goToRoughDraft,
    goToBeautify,
    goToSources,
    startPresenting,
    startMobilePresenting,
    stopPresenting,
    goBack,
    canGoBack,
    getPresentationId,
    getIdeationSessionId,
    getRoughDraftState,
    getSourcesState,
  }), [
    // Only include mode and stable callbacks - derived booleans are computed from mode
    mode,
    goToDashboard,
    goToDeck,
    goToIdeation,
    goToRoughDraft,
    goToBeautify,
    goToSources,
    startPresenting,
    startMobilePresenting,
    stopPresenting,
    goBack,
    getPresentationId,
    getIdeationSessionId,
    getRoughDraftState,
    getSourcesState,
  ]);

  return (
    <WorkspaceModeContext.Provider value={value}>
      {children}
    </WorkspaceModeContext.Provider>
  );
}

/**
 * Hook to access workspace mode context.
 * Throws if used outside of WorkspaceModeProvider.
 */
export function useWorkspaceMode(): WorkspaceModeContextValue {
  const context = useContext(WorkspaceModeContext);
  if (!context) {
    throw new Error('useWorkspaceMode must be used within a WorkspaceModeProvider');
  }
  return context;
}

/**
 * Safe hook that returns null if outside provider.
 */
export function useWorkspaceModeSafe(): WorkspaceModeContextValue | null {
  return useContext(WorkspaceModeContext);
}
