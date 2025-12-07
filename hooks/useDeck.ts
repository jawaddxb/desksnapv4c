import { useState, useEffect, useRef } from 'react';
import { Presentation, Slide, Theme, GenerationMode } from '../types';
import { generatePresentationPlan, generateSlideImage, refineImagePrompt, ensureApiKeySelection, RefinementFocus } from '../services/geminiService';
import { THEMES, IMAGE_STYLES } from '../lib/themes';
import { WABI_SABI_LAYOUT_NAMES } from '../components/WabiSabiStage';
import { loadGoogleFont } from '../lib/fonts';
import { getSavedDecks, saveDeckToStorage, deleteDeckFromStorage } from '../services/storageService';

export const useDeck = () => {
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [savedDecks, setSavedDecks] = useState<Presentation[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES.neoBrutalist);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState<string>('Editorial');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Track previous presentation state to detect changes for auto-save
  const prevPresentationRef = useRef<string | null>(null);

  // Load decks on mount
  useEffect(() => {
      refreshDeckList();
  }, []);

  const refreshDeckList = async () => {
      const decks = await getSavedDecks();
      setSavedDecks(decks);
  };

  // Auto-Save Logic
  useEffect(() => {
      if (!currentPresentation) return;

      const currentString = JSON.stringify(currentPresentation);
      if (prevPresentationRef.current !== currentString) {
          setSaveStatus('saving');
          const timer = setTimeout(async () => {
              await saveDeckToStorage(currentPresentation);
              setSaveStatus('saved');
              refreshDeckList();
              setTimeout(() => setSaveStatus('idle'), 2000);
          }, 2000); // 2 second debounce
          
          prevPresentationRef.current = currentString;
          return () => clearTimeout(timer);
      }
  }, [currentPresentation]);

  // --- ACTIONS ---

  const createDeck = async (topic: string, imageStyleOverride: typeof IMAGE_STYLES[0], generationMode: GenerationMode = 'balanced'): Promise<Slide[]> => {
    setIsGenerating(true);
    try {
      const imageStyleToPass = imageStyleOverride.id !== 'auto' ? imageStyleOverride : undefined;
      const plan = await generatePresentationPlan(topic, imageStyleToPass, generationMode);
      
      const newSlides: Slide[] = plan.slides.map((s, i) => ({
        id: `slide-${i}`,
        title: s.title,
        content: s.bulletPoints,
        speakerNotes: s.speakerNotes,
        imagePrompt: s.imageVisualDescription,
        isImageLoading: true,
        layoutType: s.layoutType,
        alignment: s.alignment,
        fontScale: 'auto',
        layoutVariant: Math.floor(Math.random() * 1000)
      }));

      if (plan.themeId && THEMES[plan.themeId]) setActiveTheme(THEMES[plan.themeId]);
      else setActiveTheme(THEMES.neoBrutalist);

      const startLayout = WABI_SABI_LAYOUT_NAMES[Math.floor(Math.random() * WABI_SABI_LAYOUT_NAMES.length)];
      setActiveWabiSabiLayout(startLayout);

      const newDeck: Presentation = {
          id: crypto.randomUUID(),
          lastModified: Date.now(),
          topic: plan.topic,
          visualStyle: plan.visualStyle,
          themeId: plan.themeId || 'neoBrutalist',
          slides: newSlides,
          wabiSabiLayout: startLayout
      };

      setCurrentPresentation(newDeck);
      setActiveSlideIndex(0);
      
      // Initial Save
      await saveDeckToStorage(newDeck);
      refreshDeckList();
      
      // Trigger background generation
      generateAllImages(newSlides, plan.visualStyle);
      
      return newSlides;
    } finally {
      setIsGenerating(false);
    }
  };

  const saveDeck = async () => {
      if (!currentPresentation) return;
      setSaveStatus('saving');
      const updatedDeck = {
          ...currentPresentation,
          lastModified: Date.now(),
          themeId: activeTheme.id,
          wabiSabiLayout: activeWabiSabiLayout
      };
      await saveDeckToStorage(updatedDeck);
      setCurrentPresentation(updatedDeck);
      await refreshDeckList();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const loadDeck = (id: string) => {
      const deck = savedDecks.find(d => d.id === id);
      if (deck) {
          setCurrentPresentation(deck);
          setActiveTheme(THEMES[deck.themeId] || THEMES.neoBrutalist);
          setActiveWabiSabiLayout(deck.wabiSabiLayout || 'Editorial');
          setActiveSlideIndex(0);
          prevPresentationRef.current = JSON.stringify(deck);
      }
  };

  const closeDeck = async () => {
      // Final save before close
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

  const generateAllImages = async (slides: Slide[], style: string) => {
    try { 
        await ensureApiKeySelection(); 
        for (const [index, slide] of slides.entries()) {
            await new Promise(r => setTimeout(r, 1000)); // Rate limit buffer
            await generateSingleImage(index, slide.imagePrompt, style, slides);
        }
    } catch (e) { console.error("Batch generation error", e); }
  };

  const generateSingleImage = async (index: number, prompt: string, style: string, currentSlidesOverride?: Slide[]) => {
      setCurrentPresentation(prev => {
        if (!prev) return null;
        const updatedSlides = [...prev.slides];
        if (updatedSlides[index]) updatedSlides[index] = { ...updatedSlides[index], isImageLoading: true };
        return { ...prev, slides: updatedSlides };
      });

      try {
          const url = await generateSlideImage(prompt, style);
          setCurrentPresentation(prev => {
            if (!prev) return null;
            const slidesRef = currentSlidesOverride || prev.slides; 
            const updatedSlides = [...prev.slides];
            if (updatedSlides[index]) updatedSlides[index] = { ...updatedSlides[index], imageUrl: url, isImageLoading: false };
            const nextState = { ...prev, slides: updatedSlides };
            return nextState;
          });
      } catch (err) {
          console.warn("Image generation failed", err);
          setCurrentPresentation(prev => {
             if (!prev) return null;
             const updatedSlides = [...prev.slides];
             if (updatedSlides[index]) updatedSlides[index] = { ...updatedSlides[index], isImageLoading: false };
             return { ...prev, slides: updatedSlides };
          });
      }
  };

  const updateSlide = (updates: Partial<Slide>) => {
    if (!currentPresentation) return;
    setCurrentPresentation(prev => {
        if (!prev) return null;
        const newSlides = [...prev.slides];
        newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], ...updates };
        return { ...prev, slides: newSlides };
    });
  };

  const regenerateSlideImage = async (mode: 'same' | 'varied') => {
      if (!currentPresentation) return;
      const index = activeSlideIndex;
      const slide = currentPresentation.slides[index];
      let prompt = slide.imagePrompt;

      try {
        await ensureApiKeySelection();
        if (mode === 'varied') {
            updateSlide({ isImageLoading: true });
            prompt = await refineImagePrompt(prompt);
            updateSlide({ imagePrompt: prompt });
        }
        await generateSingleImage(index, prompt, currentPresentation.visualStyle);
      } catch (e) { console.error(e); }
  };

  const remixDeck = async () => {
    if (!currentPresentation || isGenerating) return;
    try {
        await ensureApiKeySelection();
        const focuses: RefinementFocus[] = ['lighting', 'camera', 'composition', 'mood'];
        setCurrentPresentation(prev => prev ? { ...prev, slides: prev.slides.map(s => ({ ...s, isImageLoading: true })) } : null);

        const slides = [...currentPresentation.slides];
        for (const [index, slide] of slides.entries()) {
             try {
                const randomFocus = focuses[Math.floor(Math.random() * focuses.length)];
                const newPrompt = await refineImagePrompt(slide.imagePrompt, randomFocus);
                
                setCurrentPresentation(prev => {
                    if (!prev) return null;
                    const s = [...prev.slides];
                    s[index] = { ...s[index], imagePrompt: newPrompt };
                    return { ...prev, slides: s };
                });
                
                await generateSingleImage(index, newPrompt, currentPresentation.visualStyle);
             } catch(e) { console.error(e); }
        }
    } catch (e) { console.error(e); }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
      if (!currentPresentation) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === currentPresentation.slides.length - 1) return;

      const newSlides = [...currentPresentation.slides];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

      setCurrentPresentation({ ...currentPresentation, slides: newSlides });
      if (activeSlideIndex === index) setActiveSlideIndex(targetIndex);
      else if (activeSlideIndex === targetIndex) setActiveSlideIndex(index);
  };

  const applyTheme = (themeId: string) => {
    const newTheme = THEMES[themeId];
    if (newTheme) {
        setActiveTheme(newTheme);
        if (currentPresentation) {
            setCurrentPresentation({ ...currentPresentation, visualStyle: newTheme.imageStyle, themeId: themeId });
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
              body: `"${bodyFont}", sans-serif`
          }
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

  const regenerateAllImagesAction = async () => {
      if (!currentPresentation) return;
      generateAllImages(currentPresentation.slides, currentPresentation.visualStyle);
  };
  
  const shuffleLayoutVariants = () => {
    if (!currentPresentation) return;
    setCurrentPresentation(prev => {
        if (!prev) return null;
        return {
            ...prev,
            slides: prev.slides.map(s => ({
                ...s,
                layoutVariant: Math.floor(Math.random() * 1000)
            }))
        };
    });
  };

  return {
      currentPresentation,
      savedDecks,
      activeSlideIndex,
      setActiveSlideIndex,
      isGenerating,
      activeTheme,
      activeWabiSabiLayout,
      saveStatus,
      actions: {
          createDeck,
          saveDeck,
          loadDeck,
          closeDeck,
          deleteDeck,
          updateSlide,
          regenerateSlideImage,
          remixDeck,
          moveSlide,
          applyTheme,
          applyTypography,
          setWabiSabiLayout,
          cycleWabiSabiLayout,
          regenerateAllImages: regenerateAllImagesAction,
          shuffleLayoutVariants
      }
  };
};