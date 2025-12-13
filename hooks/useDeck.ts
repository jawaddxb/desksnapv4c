/**
 * useDeck Hook
 *
 * Main orchestrator hook for presentation management.
 * Composes focused hooks for slides, images, content refinement, UI state, and sync.
 *
 * REFACTORED: Now API-driven with real-time sync via WebSocket.
 * - TanStack Query for server state
 * - WebSocket subscription for real-time updates
 * - Composed hooks for focused responsibilities (SRP)
 */

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Presentation, Slide, Theme, GenerationMode, AnalyticsSession } from '@/types';
import { generatePresentationPlan, ensureApiKeySelection } from '@/services/geminiService';
import { THEMES } from '@/config/themes';
import { IMAGE_STYLES } from '@/config/imageStyles';
import { WABI_SABI_LAYOUT_NAMES } from '@/config/layoutConstants';
import { loadThemeFonts } from '@/lib/fonts';

// Query and mutation hooks
import { useSavedDecks, usePresentation, presentationKeys } from './queries/usePresentationQueries';
import {
  useCreatePresentation,
  useUpdatePresentation,
  useDeletePresentation,
  useUpdateSlide,
} from './mutations/usePresentationMutations';

// Real-time sync
import { usePresentationSubscription } from './usePresentationSubscription';

// Composed hooks
import {
  useSlideUpdater,
  useImageGeneration,
  useContentRefinement,
  useDeckUIState,
  useDeckSyncState,
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from './presentation';

// Agent activity context for agent logs
import { useAgentActivitySafe } from '@/contexts/AgentActivityContext';

export const useDeck = () => {
  const queryClient = useQueryClient();

  // Agent activity context for activity display (safe - returns null if no provider)
  const agentContext = useAgentActivitySafe();

  // ============ Query-Based State ============

  // Fetch list of saved presentations from API
  const { savedDecks, isLoading: isLoadingDecks } = useSavedDecks();

  // Track which presentation is currently loaded
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);

  // Fetch current presentation from API (enabled when ID is set)
  const {
    data: fetchedPresentation,
    isLoading: isLoadingPresentation,
  } = usePresentation(currentPresentationId);

  // ============ Mutations ============

  const createMutation = useCreatePresentation();
  const updateMutation = useUpdatePresentation();
  const deleteMutation = useDeletePresentation();
  const updateSlideMutation = useUpdateSlide();

  // ============ UI State (Composed) ============

  const uiState = useDeckUIState();

  const {
    activeTheme,
    setActiveTheme,
    activeWabiSabiLayout,
    setActiveWabiSabiLayout,
    viewMode,
    setViewMode,
    saveStatus,
    setSaveStatus,
    actions: { applyTypography },
  } = uiState;

  // ============ Sync State (Composed) ============

  const {
    localPresentation,
    setLocalPresentation,
    clearPresentation,
  } = useDeckSyncState({
    fetchedPresentation,
    onHydrateTheme: setActiveTheme,
    onHydrateViewMode: setViewMode,
    onHydrateLayout: setActiveWabiSabiLayout,
  });

  // Current presentation is the local synced state
  const currentPresentation = localPresentation;

  // ============ Local UI State (Additional) ============

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // ============ Real-Time Sync ============

  // Subscribe to WebSocket updates for the current presentation
  const {
    isConnected: isRealtimeConnected,
    activeUsers,
    sendSlideUpdate,
    sendPresentationUpdate,
  } = usePresentationSubscription(currentPresentationId);

  // ============ Deck List Management ============

  const refreshDeckList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
  }, [queryClient]);

  // ============ Auto-Save via API ============

  // Debounced save to API when presentation changes
  useEffect(() => {
    if (!currentPresentation || !currentPresentationId) return;

    const saveTimeout = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await updateMutation.mutateAsync({
          id: currentPresentationId,
          updates: {
            themeId: activeTheme.id,
            wabiSabiLayout: activeWabiSabiLayout,
            viewMode,
          },
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('idle');
      }
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [currentPresentation?.themeId, currentPresentation?.wabiSabiLayout, currentPresentation?.viewMode, activeTheme.id, activeWabiSabiLayout, viewMode]);

  // ============ Composed Hooks ============

  // Slide update operations (now uses local state + API sync)
  const slideUpdater = useSlideUpdater({
    presentation: currentPresentation,
    setPresentation: setLocalPresentation,
    activeSlideIndex,
  });

  // Image generation operations
  const imageGen = useImageGeneration({
    presentation: currentPresentation,
    setPresentation: setLocalPresentation,
    activeSlideIndex,
    isGenerating,
    updateSlideAtIndex: slideUpdater.updateSlideAtIndex,
    updateSlide: slideUpdater.updateSlide,
    presentationId: currentPresentationId,
    updateSlideMutation,
    // Wire agent logs to activity context for history/debugging
    onAgentLogs: (logs) => {
      if (currentPresentationId && agentContext) {
        agentContext.actions.setAgentLogs(currentPresentationId, logs);
      }
    },
    // Wire real-time agent activity for live UI display
    onAgentActivity: (log) => {
      agentContext?.actions.setCurrentActivity(log);
    },
    onAgentStart: (totalSlides) => {
      // Pass slide titles to activity context for panel display
      const slideInfo = currentPresentation?.slides.map((s, i) => ({
        index: i,
        title: s.title,
      })) || [];
      agentContext?.actions.startAgentProcessing(totalSlides, slideInfo);
    },
    onAgentComplete: () => {
      agentContext?.actions.stopAgentProcessing();
    },
    // Wire image generation to activity context for thumbnail display
    onImageGenerated: (slideIndex, imageUrl) => {
      agentContext?.actions.recordGeneratedImage(slideIndex, imageUrl);
    },
  });

  // Content refinement operations
  const contentRefinement = useContentRefinement({
    presentation: currentPresentation,
    setPresentation: setLocalPresentation,
    activeSlideIndex,
    generateSingleImage: imageGen.generateSingleImage,
  });

  // ============ Deck CRUD Operations ============

  /**
   * Internal helper to create and persist a presentation.
   * Consolidates common logic: theme resolution, layout selection,
   * presentation creation, API save, and state setup.
   */
  interface CreateDeckInternalOptions {
    slides: Slide[];
    topic: string;
    themeId?: string;
    visualStyle?: string;
    skipImageGeneration?: boolean;
  }

  const createDeckInternal = async (options: CreateDeckInternalOptions): Promise<Presentation> => {
    const { slides, topic, themeId, visualStyle, skipImageGeneration } = options;

    // 1. Resolve theme with fallback
    const resolvedThemeId = themeId && THEMES[themeId] ? themeId : 'neoBrutalist';
    const theme = THEMES[resolvedThemeId];
    setActiveTheme(theme);

    // 2. Select random wabi-sabi layout
    const startLayout = WABI_SABI_LAYOUT_NAMES[
      Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)
    ];
    setActiveWabiSabiLayout(startLayout);

    // 3. Resolve visual style
    const resolvedVisualStyle = visualStyle || theme.imageStyle || 'Professional photography';

    // 4. Create presentation object
    const newDeck = createPresentation(
      topic,
      slides,
      resolvedThemeId,
      resolvedVisualStyle,
      startLayout
    );

    // 5. Save to API
    const savedDeck = await createMutation.mutateAsync(newDeck);

    // 6. Update state
    setCurrentPresentationId(savedDeck.id);
    setLocalPresentation(savedDeck);
    setActiveSlideIndex(0);

    // 7. Refresh deck list
    refreshDeckList();

    // 8. Start image generation (optional)
    if (!skipImageGeneration) {
      imageGen.generateAllImages(savedDeck.slides, resolvedVisualStyle, undefined, savedDeck);
    }

    return savedDeck;
  };

  const createDeck = async (
    topic: string,
    imageStyleOverride: typeof IMAGE_STYLES[0],
    generationMode: GenerationMode = 'balanced'
  ): Promise<Slide[]> => {
    setIsGenerating(true);
    try {
      await ensureApiKeySelection();
      const imageStyleToPass = imageStyleOverride.id !== 'auto' ? imageStyleOverride : undefined;
      const plan = await generatePresentationPlan(topic, imageStyleToPass, generationMode);
      const slides = createSlidesFromPlan(plan.slides);

      const savedDeck = await createDeckInternal({
        slides,
        topic: plan.topic,
        themeId: plan.themeId,
        visualStyle: plan.visualStyle,
      });

      return savedDeck.slides;
    } finally {
      setIsGenerating(false);
    }
  };

  const createDeckFromPlan = async (plan: {
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
    setIsGenerating(true);
    try {
      const slides = createSlidesFromPlan(plan.slides);

      const savedDeck = await createDeckInternal({
        slides,
        topic: plan.topic,
        themeId: plan.themeId,
        visualStyle: plan.visualStyle,
      });

      return savedDeck.slides;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Create a presentation from pre-transformed slides (e.g., from Beautify feature).
   * Unlike createDeck, this takes already-formatted Slide[] and just saves them.
   */
  const createPresentationFromSlides = async (
    slides: Slide[],
    themeId: string,
    topic?: string
  ): Promise<Presentation> => {
    setIsGenerating(true);
    try {
      return await createDeckInternal({
        slides,
        topic: topic || 'Beautified Deck',
        themeId,
        skipImageGeneration: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDeck = async () => {
    if (!currentPresentation || !currentPresentationId) return;

    setSaveStatus('saving');
    try {
      await updateMutation.mutateAsync({
        id: currentPresentationId,
        updates: {
          themeId: activeTheme.id,
          wabiSabiLayout: activeWabiSabiLayout,
        },
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('idle');
    }
  };

  const loadDeck = async (id: string) => {
    // Find deck from saved decks list
    const deck = savedDecks.find(d => d.id === id);
    if (deck) {
      const theme = THEMES[deck.themeId] || THEMES.neoBrutalist;
      // Load theme fonts before displaying
      await loadThemeFonts(theme);

      // Set current presentation ID (triggers query and WebSocket subscription)
      setCurrentPresentationId(id);
      setLocalPresentation(deck);
      setActiveTheme(theme);
      setActiveWabiSabiLayout(deck.wabiSabiLayout || 'Editorial');
      setViewMode(deck.viewMode || 'standard');
      setActiveSlideIndex(0);
    } else {
      // If not in list, just set ID and let query fetch it
      setCurrentPresentationId(id);
      setActiveSlideIndex(0);
    }
  };

  const closeDeck = async () => {
    // Save any pending changes
    if (currentPresentation && currentPresentationId) {
      await saveDeck();
    }
    setCurrentPresentationId(null);
    setLocalPresentation(null);
    refreshDeckList();
  };

  const deleteDeck = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    refreshDeckList();
    if (currentPresentationId === id) {
      setCurrentPresentationId(null);
      setLocalPresentation(null);
    }
  };

  // ============ Import / Export ============

  const exportDeck = () => {
    if (currentPresentation) {
      exportPresentationToFile(currentPresentation);
    }
  };

  const importDeck = async (file: File) => {
    try {
      const deck = await parseImportedDeck(file);
      // Save to API
      const savedDeck = await createMutation.mutateAsync(deck);
      refreshDeckList();
      // Load the imported deck
      loadDeck(savedDeck.id);
    } catch (e) {
      console.error("Import failed", e);
      alert("Failed to import deck. Invalid file format.");
    }
  };

  // ============ Analytics ============

  const recordSession = (session: AnalyticsSession) => {
    if (!currentPresentation) return;
    setLocalPresentation(prev => {
      if (!prev) return null;
      const updatedAnalytics = [...(prev.analytics || []), session];
      return { ...prev, analytics: updatedAnalytics };
    });
  };

  // ============ Theme & Layout ============

  const applyTheme = async (themeId: string) => {
    const newTheme = THEMES[themeId];
    if (newTheme) {
      // Load theme fonts before applying
      await loadThemeFonts(newTheme);
      setActiveTheme(newTheme);
      if (currentPresentation && currentPresentationId) {
        setLocalPresentation({
          ...currentPresentation,
          visualStyle: newTheme.imageStyle,
          themeId,
        });
        // Sync to server
        updateMutation.mutate({
          id: currentPresentationId,
          updates: { themeId, visualStyle: newTheme.imageStyle },
        });
      }
    }
  };

  const cycleWabiSabiLayout = () => {
    const idx = WABI_SABI_LAYOUT_NAMES.indexOf(activeWabiSabiLayout);
    const nextIdx = (idx + 1) % WABI_SABI_LAYOUT_NAMES.length;
    const newLayout = WABI_SABI_LAYOUT_NAMES[nextIdx];
    setActiveWabiSabiLayout(newLayout);

    // Sync to server if presentation is loaded
    if (currentPresentationId) {
      updateMutation.mutate({
        id: currentPresentationId,
        updates: { wabiSabiLayout: newLayout },
      });
    }
  };

  const setWabiSabiLayout = (layoutName: string) => {
    if (WABI_SABI_LAYOUT_NAMES.includes(layoutName)) {
      setActiveWabiSabiLayout(layoutName);

      // Sync to server if presentation is loaded
      if (currentPresentationId) {
        updateMutation.mutate({
          id: currentPresentationId,
          updates: { wabiSabiLayout: layoutName },
        });
      }
    }
  };

  // Update visual style and optionally regenerate all images
  const updateVisualStyleAndRegenerateImages = async (newVisualStyle: string, regenerate: boolean = true) => {
    if (!currentPresentation || !currentPresentationId) return;

    // Update the visual style in presentation
    setLocalPresentation({
      ...currentPresentation,
      visualStyle: newVisualStyle,
    });

    // Sync to server
    updateMutation.mutate({
      id: currentPresentationId,
      updates: { visualStyle: newVisualStyle },
    });

    // Regenerate all images with the new style if requested
    if (regenerate) {
      imageGen.regenerateAllImages(currentPresentation.slides, newVisualStyle);
    }
  };

  // ============ Enhanced Slide Update with API Sync ============

  // Wrap slide updater to also sync to API
  const updateSlideWithSync = useCallback((updates: Partial<Slide>) => {
    // Apply local update immediately (optimistic)
    slideUpdater.updateSlide(updates);

    // Sync to API
    if (currentPresentation && currentPresentationId) {
      const currentSlide = currentPresentation.slides[activeSlideIndex];
      if (currentSlide) {
        updateSlideMutation.mutate({
          presentationId: currentPresentationId,
          slideId: currentSlide.id,
          updates,
        });
      }
    }
  }, [slideUpdater, currentPresentation, currentPresentationId, activeSlideIndex, updateSlideMutation]);

  // ============ Return ============

  return {
    // State
    currentPresentation,
    savedDecks,
    activeSlideIndex,
    setActiveSlideIndex,
    isGenerating,
    isRefining: contentRefinement.isRefining,
    activeTheme,
    activeWabiSabiLayout,
    viewMode,
    setViewMode,
    saveStatus,

    // Real-time sync info
    isRealtimeConnected,
    activeUsers,

    // Loading states
    isLoadingDecks,
    isLoadingPresentation,

    // Actions
    actions: {
      // Deck CRUD
      createDeck,
      createDeckFromPlan,
      createPresentationFromSlides,
      saveDeck,
      loadDeck,
      closeDeck,
      deleteDeck,
      importDeck,
      exportDeck,

      // Slide operations (with API sync)
      updateSlide: updateSlideWithSync,
      moveSlide: slideUpdater.moveSlide,
      shuffleLayoutVariants: slideUpdater.shuffleLayoutVariants,

      // Image generation
      regenerateSlideImage: imageGen.regenerateSlideImage,
      regenerateAllImages: imageGen.regenerateAllImages,
      remixDeck: imageGen.remixDeck,

      // Content refinement
      refineSlideContent: contentRefinement.refineSlideContent,
      enhanceSlideImage: contentRefinement.enhanceSlideImage,

      // Theme & layout
      applyTheme,
      applyTypography,
      setWabiSabiLayout,
      cycleWabiSabiLayout,
      updateVisualStyleAndRegenerateImages,

      // Analytics
      recordSession,
    },
  };
};
