/**
 * useDeck Hook
 *
 * Main orchestrator hook for presentation management.
 * Composes focused hooks for slides, images, and content refinement.
 *
 * Refactored from 527 lines to ~250 lines using composition.
 */

import { useState, useEffect, useCallback } from 'react';
import { Presentation, Slide, Theme, GenerationMode, AnalyticsSession } from '../types';
import { generatePresentationPlan, ensureApiKeySelection } from '../services/geminiService';
import { THEMES, IMAGE_STYLES } from '../lib/themes';
import { WABI_SABI_LAYOUT_NAMES } from '../components/WabiSabiStage';
import { loadGoogleFont, loadThemeFonts } from '../lib/fonts';
import { getSavedDecks, saveDeckToStorage, deleteDeckFromStorage, migrateLegacyData } from '../services/storageService';
import { useAutoSave } from './useAutoSave';
import {
  useSlideUpdater,
  useImageGeneration,
  useContentRefinement,
  createSlidesFromPlan,
  createPresentation,
  exportPresentationToFile,
  parseImportedDeck,
} from './presentation';

export const useDeck = () => {
  // ============ Core State ============
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [savedDecks, setSavedDecks] = useState<Presentation[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES.neoBrutalist);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState<string>('Editorial');

  // ============ Deck List Management ============
  const refreshDeckList = useCallback(async () => {
    const decks = await getSavedDecks();
    setSavedDecks(decks);
  }, []);

  // Auto-save using reusable hook
  const { saveStatus, resetTracking } = useAutoSave({
    data: currentPresentation,
    onSave: saveDeckToStorage,
    onSaveComplete: refreshDeckList,
  });

  // Load decks on mount
  useEffect(() => {
    const init = async () => {
      await migrateLegacyData();
      await refreshDeckList();
    };
    init();
  }, [refreshDeckList]);

  // ============ Composed Hooks ============

  // Slide update operations
  const slideUpdater = useSlideUpdater({
    presentation: currentPresentation,
    setPresentation: setCurrentPresentation,
    activeSlideIndex,
  });

  // Image generation operations
  const imageGen = useImageGeneration({
    presentation: currentPresentation,
    setPresentation: setCurrentPresentation,
    activeSlideIndex,
    isGenerating,
    updateSlideAtIndex: slideUpdater.updateSlideAtIndex,
    updateSlide: slideUpdater.updateSlide,
  });

  // Content refinement operations
  const contentRefinement = useContentRefinement({
    presentation: currentPresentation,
    setPresentation: setCurrentPresentation,
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
      if (plan.themeId && THEMES[plan.themeId]) {
        setActiveTheme(THEMES[plan.themeId]);
      } else {
        setActiveTheme(THEMES.neoBrutalist);
      }

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      setActiveWabiSabiLayout(startLayout);

      const newDeck = createPresentation(
        plan.topic,
        newSlides,
        plan.themeId || 'neoBrutalist',
        plan.visualStyle,
        startLayout
      );

      setCurrentPresentation(newDeck);
      setActiveSlideIndex(0);

      // Initial save and background image generation
      await saveDeckToStorage(newDeck);
      refreshDeckList();
      imageGen.generateAllImages(newSlides, plan.visualStyle);

      return newSlides;
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
      if (plan.themeId && THEMES[plan.themeId]) {
        setActiveTheme(THEMES[plan.themeId]);
      } else {
        setActiveTheme(THEMES.neoBrutalist);
      }

      // Set random wabi-sabi layout
      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      setActiveWabiSabiLayout(startLayout);

      const visualStyle = plan.visualStyle || THEMES[plan.themeId]?.imageStyle || 'Professional photography';
      const newDeck = createPresentation(
        plan.topic,
        newSlides,
        plan.themeId || 'neoBrutalist',
        visualStyle,
        startLayout
      );

      setCurrentPresentation(newDeck);
      setActiveSlideIndex(0);

      // Initial save and background image generation
      await saveDeckToStorage(newDeck);
      refreshDeckList();
      imageGen.generateAllImages(newSlides, newDeck.visualStyle);

      return newSlides;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDeck = async () => {
    if (!currentPresentation) return;
    const updatedDeck = {
      ...currentPresentation,
      lastModified: Date.now(),
      themeId: activeTheme.id,
      wabiSabiLayout: activeWabiSabiLayout,
    };
    setCurrentPresentation(updatedDeck);
  };

  const loadDeck = async (id: string) => {
    const deck = savedDecks.find(d => d.id === id);
    if (deck) {
      const theme = THEMES[deck.themeId] || THEMES.neoBrutalist;
      // Load theme fonts before displaying
      await loadThemeFonts(theme);
      setCurrentPresentation(deck);
      setActiveTheme(theme);
      setActiveWabiSabiLayout(deck.wabiSabiLayout || 'Editorial');
      setActiveSlideIndex(0);
      resetTracking(deck);
    }
  };

  const closeDeck = async () => {
    if (currentPresentation) await saveDeckToStorage(currentPresentation);
    setCurrentPresentation(null);
    refreshDeckList();
  };

  const deleteDeck = async (id: string) => {
    await deleteDeckFromStorage(id);
    refreshDeckList();
    if (currentPresentation?.id === id) {
      setCurrentPresentation(null);
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
      await saveDeckToStorage(deck);
      await refreshDeckList();
      loadDeck(deck.id);
    } catch (e) {
      console.error("Import failed", e);
      alert("Failed to import deck. Invalid file format.");
    }
  };

  // ============ Analytics ============

  const recordSession = (session: AnalyticsSession) => {
    if (!currentPresentation) return;
    setCurrentPresentation(prev => {
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
      if (currentPresentation) {
        setCurrentPresentation({
          ...currentPresentation,
          visualStyle: newTheme.imageStyle,
          themeId,
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
    setActiveWabiSabiLayout(WABI_SABI_LAYOUT_NAMES[nextIdx]);
  };

  const setWabiSabiLayout = (layoutName: string) => {
    if (WABI_SABI_LAYOUT_NAMES.includes(layoutName)) {
      setActiveWabiSabiLayout(layoutName);
    }
  };

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
    saveStatus,

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

      // Slide operations
      updateSlide: slideUpdater.updateSlide,
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

      // Analytics
      recordSession,
    },
  };
};
