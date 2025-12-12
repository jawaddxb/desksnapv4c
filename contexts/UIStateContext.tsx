/**
 * UI State Context
 *
 * Manages UI-related state like modal visibility, presentation mode, and view modes.
 * Single responsibility: UI flags and display modes.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { PresentationPlanResponse } from '../types';
import { RoughDraftInput } from '../services/agents';

/**
 * State for rough draft view.
 */
export interface RoughDraftState {
  isOpen: boolean;
  source: 'ideation' | 'copilot' | 'existing';
  input?: RoughDraftInput;
  ideationSessionId?: string;
  existingDraftId?: string;
}

/**
 * State for archetype change dialog.
 */
export interface ArchetypeChangeDialogState {
  isOpen: boolean;
  previousArchetype: string;
  newArchetype: string;
}

export interface UIStateContextValue {
  // Modal states
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  showCreateChat: boolean;
  setShowCreateChat: (show: boolean) => void;

  // Presentation mode
  isPresenting: boolean;
  setIsPresenting: (presenting: boolean) => void;

  // Ideation mode
  isIdeating: boolean;
  setIsIdeating: (ideating: boolean) => void;
  ideationSessionIdToLoad: string | null;
  setIdeationSessionIdToLoad: (id: string | null) => void;

  // Rough draft mode
  roughDraftState: RoughDraftState | null;
  setRoughDraftState: (state: RoughDraftState | null) => void;
  openRoughDraft: (
    source: 'ideation' | 'copilot' | 'existing',
    options?: {
      input?: RoughDraftInput;
      ideationSessionId?: string;
      existingDraftId?: string;
    }
  ) => void;
  closeRoughDraft: () => void;

  // Archetype change dialog
  archetypeChangeDialog: ArchetypeChangeDialogState;
  setArchetypeChangeDialog: (state: ArchetypeChangeDialogState) => void;
  openArchetypeChangeDialog: (previousArchetype: string, newArchetype: string) => void;
  closeArchetypeChangeDialog: () => void;
}

const UIStateContext = createContext<UIStateContextValue | null>(null);

export interface UIStateProviderProps {
  children: ReactNode;
}

/**
 * Provider for UI-related state.
 */
export function UIStateProvider({ children }: UIStateProviderProps) {
  // Modal states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false);

  // Presentation mode
  const [isPresenting, setIsPresenting] = useState(false);

  // Ideation mode
  const [isIdeating, setIsIdeating] = useState(false);
  const [ideationSessionIdToLoad, setIdeationSessionIdToLoad] = useState<string | null>(null);

  // Rough draft mode
  const [roughDraftState, setRoughDraftState] = useState<RoughDraftState | null>(null);

  // Archetype change dialog
  const [archetypeChangeDialog, setArchetypeChangeDialog] = useState<ArchetypeChangeDialogState>({
    isOpen: false,
    previousArchetype: '',
    newArchetype: '',
  });

  // Rough draft helpers
  const openRoughDraft = useCallback((
    source: 'ideation' | 'copilot' | 'existing',
    options?: {
      input?: RoughDraftInput;
      ideationSessionId?: string;
      existingDraftId?: string;
    }
  ) => {
    setRoughDraftState({
      isOpen: true,
      source,
      ...options,
    });
  }, []);

  const closeRoughDraft = useCallback(() => {
    setRoughDraftState(null);
  }, []);

  // Archetype dialog helpers
  const openArchetypeChangeDialog = useCallback((previousArchetype: string, newArchetype: string) => {
    setArchetypeChangeDialog({
      isOpen: true,
      previousArchetype,
      newArchetype,
    });
  }, []);

  const closeArchetypeChangeDialog = useCallback(() => {
    setArchetypeChangeDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  const value = useMemo<UIStateContextValue>(() => ({
    // Modal states
    isChatOpen,
    setIsChatOpen,
    showCreateChat,
    setShowCreateChat,

    // Presentation mode
    isPresenting,
    setIsPresenting,

    // Ideation mode
    isIdeating,
    setIsIdeating,
    ideationSessionIdToLoad,
    setIdeationSessionIdToLoad,

    // Rough draft mode
    roughDraftState,
    setRoughDraftState,
    openRoughDraft,
    closeRoughDraft,

    // Archetype change dialog
    archetypeChangeDialog,
    setArchetypeChangeDialog,
    openArchetypeChangeDialog,
    closeArchetypeChangeDialog,
  }), [
    isChatOpen,
    showCreateChat,
    isPresenting,
    isIdeating,
    ideationSessionIdToLoad,
    roughDraftState,
    openRoughDraft,
    closeRoughDraft,
    archetypeChangeDialog,
    openArchetypeChangeDialog,
    closeArchetypeChangeDialog,
  ]);

  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}

/**
 * Hook to access UI state context.
 * Throws if used outside of UIStateProvider.
 */
export function useUIState(): UIStateContextValue {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}

/**
 * Safe hook that returns null if outside provider.
 */
export function useUIStateSafe(): UIStateContextValue | null {
  return useContext(UIStateContext);
}
