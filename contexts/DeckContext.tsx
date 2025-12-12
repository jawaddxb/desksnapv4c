/**
 * Deck Context
 *
 * Provides presentation/deck state to the component tree.
 * Single responsibility: Deck state, slide navigation, and deck actions.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { Presentation, Slide, Theme, ViewMode, GenerationMode, AnalyticsSession } from '../types';
import { useDeck } from '../hooks/useDeck';
import { IMAGE_STYLES } from '../lib/themes';

type ImageStyle = typeof IMAGE_STYLES[number];
type SaveStatus = 'idle' | 'saving' | 'saved';

/**
 * Deck CRUD actions.
 */
export interface DeckActions {
  // Deck CRUD
  createDeck: (topic: string, imageStyleOverride: ImageStyle, generationMode?: GenerationMode) => Promise<Slide[]>;
  createDeckFromPlan: (plan: {
    topic: string;
    slides: Array<{
      title: string;
      bulletPoints: string[];
      speakerNotes: string;
      imageVisualDescription: string;
      layoutType: string;
      alignment: string;
    }>;
    themeId: string;
    visualStyle: string;
  }) => Promise<Slide[]>;
  saveDeck: () => Promise<void>;
  loadDeck: (id: string) => Promise<void>;
  closeDeck: () => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  importDeck: (file: File) => Promise<void>;
  exportDeck: () => void;

  // Slide operations
  updateSlide: (updates: Partial<Slide>) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  shuffleLayoutVariants: () => void;

  // Image generation
  regenerateSlideImage: (mode: 'same' | 'varied') => void;
  regenerateAllImages: (slides?: Slide[], visualStyle?: string) => void;
  remixDeck: (newStyle: string) => void;

  // Content refinement
  refineSlideContent: () => void;
  enhanceSlideImage: () => void;

  // Theme & layout
  applyTheme: (themeId: string) => void;
  applyTypography: (headingFont: string, bodyFont: string) => void;
  setWabiSabiLayout: (layoutName: string) => void;
  cycleWabiSabiLayout: () => void;
  updateVisualStyleAndRegenerateImages: (newVisualStyle: string, regenerate?: boolean) => void;

  // Analytics
  recordSession: (session: AnalyticsSession) => void;
}

export interface DeckContextValue {
  // Presentation state
  currentPresentation: Presentation | null;
  savedDecks: Presentation[];

  // Navigation
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;

  // Loading/status
  isGenerating: boolean;
  isRefining: boolean;
  saveStatus: SaveStatus;
  isLoadingDecks: boolean;
  isLoadingPresentation: boolean;

  // Theme and view
  activeTheme: Theme;
  activeWabiSabiLayout: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Real-time sync
  isRealtimeConnected: boolean;
  activeUsers: string[];

  // Actions
  actions: DeckActions;
}

const DeckContext = createContext<DeckContextValue | null>(null);

export interface DeckProviderProps {
  children: ReactNode;
}

/**
 * Provider for deck-related state.
 * Wraps the useDeck hook and provides it to the component tree.
 */
export function DeckProvider({ children }: DeckProviderProps) {
  const deckHook = useDeck();

  const value = useMemo<DeckContextValue>(() => ({
    // Presentation state
    currentPresentation: deckHook.currentPresentation,
    savedDecks: deckHook.savedDecks,

    // Navigation
    activeSlideIndex: deckHook.activeSlideIndex,
    setActiveSlideIndex: deckHook.setActiveSlideIndex,

    // Loading/status
    isGenerating: deckHook.isGenerating,
    isRefining: deckHook.isRefining,
    saveStatus: deckHook.saveStatus,
    isLoadingDecks: deckHook.isLoadingDecks,
    isLoadingPresentation: deckHook.isLoadingPresentation,

    // Theme and view
    activeTheme: deckHook.activeTheme,
    activeWabiSabiLayout: deckHook.activeWabiSabiLayout,
    viewMode: deckHook.viewMode,
    setViewMode: deckHook.setViewMode,

    // Real-time sync
    isRealtimeConnected: deckHook.isRealtimeConnected,
    activeUsers: deckHook.activeUsers,

    // Actions (typed as DeckActions)
    actions: deckHook.actions as DeckActions,
  }), [
    deckHook.currentPresentation,
    deckHook.savedDecks,
    deckHook.activeSlideIndex,
    deckHook.setActiveSlideIndex,
    deckHook.isGenerating,
    deckHook.isRefining,
    deckHook.saveStatus,
    deckHook.isLoadingDecks,
    deckHook.isLoadingPresentation,
    deckHook.activeTheme,
    deckHook.activeWabiSabiLayout,
    deckHook.viewMode,
    deckHook.setViewMode,
    deckHook.isRealtimeConnected,
    deckHook.activeUsers,
    deckHook.actions,
  ]);

  return (
    <DeckContext.Provider value={value}>
      {children}
    </DeckContext.Provider>
  );
}

/**
 * Hook to access deck context.
 * Throws if used outside of DeckProvider.
 */
export function useDeckContext(): DeckContextValue {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDeckContext must be used within a DeckProvider');
  }
  return context;
}

/**
 * Safe hook that returns null if outside provider.
 */
export function useDeckContextSafe(): DeckContextValue | null {
  return useContext(DeckContext);
}

/**
 * Hook to get just the current slide.
 * Useful for components that only need the active slide.
 */
export function useCurrentSlide(): Slide | null {
  const { currentPresentation, activeSlideIndex } = useDeckContext();
  if (!currentPresentation) return null;
  return currentPresentation.slides[activeSlideIndex] || null;
}
