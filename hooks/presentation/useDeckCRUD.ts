/**
 * useDeckCRUD Hook
 *
 * Handles deck Create, Read, Update, Delete operations.
 * Single responsibility: Manage deck persistence and lifecycle.
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Presentation, Slide, Theme, GenerationMode } from '../../types';
import { generatePresentationPlan, ensureApiKeySelection } from '../../services/geminiService';
import { THEMES, IMAGE_STYLES } from '../../lib/themes';
import { WABI_SABI_LAYOUT_NAMES } from '../../components/WabiSabiStage';
import { loadThemeFonts } from '../../lib/fonts';

// Query and mutation hooks
import { useSavedDecks, presentationKeys } from '../queries/usePresentationQueries';
import {
  useCreatePresentation,
  useDeletePresentation,
} from '../mutations/usePresentationMutations';

// Presentation utilities
import {
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from '../presentation';

export interface UseDeckCRUDOptions {
  /** Callback when a theme is set */
  onThemeChange?: (theme: Theme) => void;
  /** Callback when wabi-sabi layout changes */
  onWabiSabiLayoutChange?: (layout: string) => void;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: string) => void;
  /** Image generation function for new decks */
  generateAllImages?: (
    slides: Slide[],
    visualStyle: string,
    themeId?: string,
    presentation?: Presentation
  ) => void;
}

export interface UseDeckCRUDResult {
  // State
  savedDecks: Presentation[];
  currentPresentationId: string | null;
  currentPresentation: Presentation | null;
  isLoadingDecks: boolean;

  // State setters (for external composition)
  setCurrentPresentationId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;

  // CRUD Actions
  createDeck: (
    topic: string,
    imageStyleOverride: typeof IMAGE_STYLES[0],
    generationMode?: GenerationMode
  ) => Promise<Slide[]>;
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
  loadDeck: (id: string) => Promise<void>;
  closeDeck: () => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  importDeck: (file: File) => Promise<void>;
  exportDeck: () => void;

  // Utility
  refreshDeckList: () => void;
}

/**
 * Hook for managing deck CRUD operations.
 */
export function useDeckCRUD(options: UseDeckCRUDOptions = {}): UseDeckCRUDResult {
  const {
    onThemeChange,
    onWabiSabiLayoutChange,
    onViewModeChange,
    generateAllImages,
  } = options;

  const queryClient = useQueryClient();

  // ============ Query-Based State ============

  // Fetch list of saved presentations from API
  const { savedDecks, isLoading: isLoadingDecks } = useSavedDecks();

  // Track which presentation is currently loaded
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);

  // Local state for presentation
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);

  // Generation state
  const [isCreating, setIsCreating] = useState(false);

  // ============ Mutations ============

  const createMutation = useCreatePresentation();
  const deleteMutation = useDeletePresentation();

  // ============ Utilities ============

  const refreshDeckList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
  }, [queryClient]);

  // ============ CRUD Operations ============

  /**
   * Create a new deck from a topic using AI generation.
   */
  const createDeck = useCallback(async (
    topic: string,
    imageStyleOverride: typeof IMAGE_STYLES[0],
    generationMode: GenerationMode = 'balanced'
  ): Promise<Slide[]> => {
    setIsCreating(true);
    try {
      await ensureApiKeySelection();
      const imageStyleToPass = imageStyleOverride.id !== 'auto' ? imageStyleOverride : undefined;
      const plan = await generatePresentationPlan(topic, imageStyleToPass, generationMode);

      const newSlides = createSlidesFromPlan(plan.slides);

      // Set theme
      const themeId = plan.themeId && THEMES[plan.themeId] ? plan.themeId : 'neoBrutalist';
      const theme = THEMES[themeId];
      onThemeChange?.(theme);

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      onWabiSabiLayoutChange?.(startLayout);

      // Create presentation object
      const newDeck = createPresentation(
        plan.topic,
        newSlides,
        themeId,
        plan.visualStyle,
        startLayout
      );

      // Save to API
      const savedDeck = await createMutation.mutateAsync(newDeck);

      // Set as current presentation
      setCurrentPresentationId(savedDeck.id);
      setCurrentPresentation(savedDeck);

      // Refresh deck list
      refreshDeckList();

      // Start background image generation if provided
      generateAllImages?.(savedDeck.slides, plan.visualStyle, undefined, savedDeck);

      return savedDeck.slides;
    } finally {
      setIsCreating(false);
    }
  }, [createMutation, refreshDeckList, onThemeChange, onWabiSabiLayoutChange, generateAllImages]);

  /**
   * Create a deck from an existing plan (e.g., from rough draft).
   */
  const createDeckFromPlan = useCallback(async (plan: {
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
  }): Promise<Slide[]> => {
    setIsCreating(true);
    try {
      const newSlides = createSlidesFromPlan(plan.slides);

      // Set theme
      const themeId = plan.themeId && THEMES[plan.themeId] ? plan.themeId : 'neoBrutalist';
      const theme = THEMES[themeId];
      onThemeChange?.(theme);

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      onWabiSabiLayoutChange?.(startLayout);

      const visualStyle = plan.visualStyle || theme?.imageStyle || 'Professional photography';
      const newDeck = createPresentation(
        plan.topic,
        newSlides,
        themeId,
        visualStyle,
        startLayout
      );

      // Save to API
      const savedDeck = await createMutation.mutateAsync(newDeck);

      // Set as current presentation
      setCurrentPresentationId(savedDeck.id);
      setCurrentPresentation(savedDeck);

      // Refresh deck list
      refreshDeckList();

      // Start background image generation if provided
      generateAllImages?.(savedDeck.slides, visualStyle, undefined, savedDeck);

      return savedDeck.slides;
    } finally {
      setIsCreating(false);
    }
  }, [createMutation, refreshDeckList, onThemeChange, onWabiSabiLayoutChange, generateAllImages]);

  /**
   * Load a deck by ID.
   */
  const loadDeck = useCallback(async (id: string) => {
    // Find deck from saved decks list
    const deck = savedDecks.find(d => d.id === id);
    if (deck) {
      const theme = THEMES[deck.themeId] || THEMES.neoBrutalist;
      // Load theme fonts before displaying
      await loadThemeFonts(theme);

      // Set current presentation ID (triggers query and WebSocket subscription)
      setCurrentPresentationId(id);
      setCurrentPresentation(deck);
      onThemeChange?.(theme);
      onWabiSabiLayoutChange?.(deck.wabiSabiLayout || 'Editorial');
      onViewModeChange?.(deck.viewMode || 'standard');
    } else {
      // If not in list, just set ID and let query fetch it
      setCurrentPresentationId(id);
    }
  }, [savedDecks, onThemeChange, onWabiSabiLayoutChange, onViewModeChange]);

  /**
   * Close the current deck.
   */
  const closeDeck = useCallback(async () => {
    setCurrentPresentationId(null);
    setCurrentPresentation(null);
    refreshDeckList();
  }, [refreshDeckList]);

  /**
   * Delete a deck by ID.
   */
  const deleteDeck = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id);
    refreshDeckList();
    if (currentPresentationId === id) {
      setCurrentPresentationId(null);
      setCurrentPresentation(null);
    }
  }, [deleteMutation, refreshDeckList, currentPresentationId]);

  /**
   * Export the current deck to a JSON file.
   */
  const exportDeck = useCallback(() => {
    if (currentPresentation) {
      exportPresentationToFile(currentPresentation);
    }
  }, [currentPresentation]);

  /**
   * Import a deck from a JSON file.
   */
  const importDeck = useCallback(async (file: File) => {
    try {
      const deck = await parseImportedDeck(file);
      // Save to API
      const savedDeck = await createMutation.mutateAsync(deck);
      refreshDeckList();
      // Load the imported deck
      await loadDeck(savedDeck.id);
    } catch (e) {
      console.error("Import failed", e);
      throw new Error("Failed to import deck. Invalid file format.");
    }
  }, [createMutation, refreshDeckList, loadDeck]);

  // ============ Return ============

  return {
    // State
    savedDecks,
    currentPresentationId,
    currentPresentation,
    isLoadingDecks,

    // State setters
    setCurrentPresentationId,
    setCurrentPresentation,

    // CRUD Actions
    createDeck,
    createDeckFromPlan,
    loadDeck,
    closeDeck,
    deleteDeck,
    importDeck,
    exportDeck,

    // Utility
    refreshDeckList,
  };
}
