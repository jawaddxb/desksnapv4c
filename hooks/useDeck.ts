/**
 * useDeck Hook
 *
 * Main orchestrator hook for presentation management.
 * Composes focused hooks for slides, images, and content refinement.
 *
 * REFACTORED: Now API-driven with real-time sync via WebSocket.
 * - TanStack Query for server state
 * - WebSocket subscription for real-time updates
 * - No local IndexedDB storage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Presentation, Slide, Theme, GenerationMode, AnalyticsSession, ViewMode } from '../types';
import { generatePresentationPlan, ensureApiKeySelection } from '../services/geminiService';
import { THEMES, IMAGE_STYLES } from '../lib/themes';
import { WABI_SABI_LAYOUT_NAMES } from '../components/WabiSabiStage';
import { loadGoogleFont, loadThemeFonts } from '../lib/fonts';

// API services
import { createPresentation as apiCreatePresentation } from '../services/api/presentationService';

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
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from './presentation';

// Debug context for agent logs
import { useDebugSafe } from '../contexts/DebugContext';

// Save status type for compatibility
type SaveStatus = 'idle' | 'saving' | 'saved';

export const useDeck = () => {
  const queryClient = useQueryClient();

  // Debug context for agent activity display (safe - returns null if no provider)
  const debugContext = useDebugSafe();

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

  // Local state for presentation (hydrated from query, updated optimistically)
  const [localPresentation, setLocalPresentation] = useState<Presentation | null>(null);

  // Sync fetched presentation to local state
  // Uses merge strategy to preserve locally-generated images during refetch
  useEffect(() => {
    if (fetchedPresentation) {
      setLocalPresentation(prev => {
        if (!prev) return fetchedPresentation;

        // Merge slides, preserving local imageUrls that server doesn't have yet
        // This prevents images from disappearing when switching view modes during generation
        const mergedSlides = fetchedPresentation.slides.map(serverSlide => {
          const localSlide = prev.slides.find(s => s.id === serverSlide.id);
          if (localSlide) {
            // Preserve local image if server doesn't have it
            const imageUrl = serverSlide.imageUrl || localSlide.imageUrl;
            // Preserve loading state if still generating
            const isImageLoading = localSlide.isImageLoading && !serverSlide.imageUrl;
            return {
              ...serverSlide,
              imageUrl,
              isImageLoading: isImageLoading || serverSlide.isImageLoading,
            };
          }
          return serverSlide;
        });

        return {
          ...fetchedPresentation,
          slides: mergedSlides,
        };
      });

      // Also restore UI state from the fetched presentation
      if (fetchedPresentation.viewMode) {
        setViewMode(fetchedPresentation.viewMode);
      }
      if (fetchedPresentation.wabiSabiLayout) {
        setActiveWabiSabiLayout(fetchedPresentation.wabiSabiLayout);
      }
      if (fetchedPresentation.themeId && THEMES[fetchedPresentation.themeId]) {
        setActiveTheme(THEMES[fetchedPresentation.themeId]);
      }
    }
  }, [fetchedPresentation]);

  // Current presentation is either local state or fetched data
  const currentPresentation = localPresentation;

  // ============ Real-Time Sync ============

  // Subscribe to WebSocket updates for the current presentation
  const {
    isConnected: isRealtimeConnected,
    activeUsers,
    sendSlideUpdate,
    sendPresentationUpdate,
  } = usePresentationSubscription(currentPresentationId);

  // ============ Local UI State ============

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES.neoBrutalist);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState<string>('Editorial');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // ============ Mutations ============

  const createMutation = useCreatePresentation();
  const updateMutation = useUpdatePresentation();
  const deleteMutation = useDeletePresentation();
  const updateSlideMutation = useUpdateSlide();

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
    // Wire agent logs to debug context for history/debugging
    onAgentLogs: (logs) => {
      if (currentPresentationId && debugContext) {
        debugContext.actions.setAgentLogs(currentPresentationId, logs);
      }
    },
    // Wire real-time agent activity for live UI display
    onAgentActivity: (log) => {
      debugContext?.actions.setCurrentActivity(log);
    },
    onAgentStart: (totalSlides) => {
      // Pass slide titles to debug context for panel display
      const slideInfo = currentPresentation?.slides.map((s, i) => ({
        index: i,
        title: s.title,
      })) || [];
      debugContext?.actions.startAgentProcessing(totalSlides, slideInfo);
    },
    onAgentComplete: () => {
      debugContext?.actions.stopAgentProcessing();
    },
    // Wire image generation to debug context for thumbnail display
    onImageGenerated: (slideIndex, imageUrl) => {
      debugContext?.actions.recordGeneratedImage(slideIndex, imageUrl);
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

      const newSlides = createSlidesFromPlan(plan.slides);

      // Set theme
      const themeId = plan.themeId && THEMES[plan.themeId] ? plan.themeId : 'neoBrutalist';
      setActiveTheme(THEMES[themeId]);

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      setActiveWabiSabiLayout(startLayout);

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
      setLocalPresentation(savedDeck);
      setActiveSlideIndex(0);

      // Refresh deck list
      refreshDeckList();

      // Start background image generation
      imageGen.generateAllImages(savedDeck.slides, plan.visualStyle);

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
      const newSlides = createSlidesFromPlan(plan.slides);

      // Set theme
      const themeId = plan.themeId && THEMES[plan.themeId] ? plan.themeId : 'neoBrutalist';
      setActiveTheme(THEMES[themeId]);

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      setActiveWabiSabiLayout(startLayout);

      const visualStyle = plan.visualStyle || THEMES[themeId]?.imageStyle || 'Professional photography';
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
      setLocalPresentation(savedDeck);
      setActiveSlideIndex(0);

      // Refresh deck list
      refreshDeckList();

      // Start background image generation
      imageGen.generateAllImages(savedDeck.slides, visualStyle);

      return savedDeck.slides;
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

  const applyTypography = (headingFont: string, bodyFont: string) => {
    loadGoogleFont(headingFont);
    loadGoogleFont(bodyFont);
    setActiveTheme(prev => ({
      ...prev,
      fonts: {
        heading: `"${headingFont}", sans-serif`,
        body: `"${bodyFont}", sans-serif`,
      },
    }));
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
