/**
 * PresentationContext
 *
 * @deprecated This context is not used in the application.
 * Use TanStack Query hooks from hooks/queries/usePresentationQueries.ts instead.
 * Kept for reference but may be removed in a future cleanup.
 *
 * Centralized state management for presentation editing.
 * Eliminates prop drilling by providing slide, theme, and actions via context.
 *
 * Usage:
 * 1. Wrap your app with <PresentationProvider>
 * 2. Use usePresentation() hook in child components
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Slide, Theme, Presentation, ImageStylePreset } from '@/types';

// ============ Types ============

export interface PresentationActions {
  /** Update the current slide's properties */
  updateSlide: (updates: Partial<Slide>) => void;
  /** Regenerate the current slide's image */
  regenerateSlideImage: (mode: 'same' | 'varied') => void;
  /** Regenerate all slides' images */
  regenerateAllImages: (mode: 'same' | 'varied') => void;
  /** Refine slide content (tone or content type) */
  refineContent: (type: 'tone' | 'content', subType: string) => Promise<void>;
  /** Enhance slide image with a style preset */
  enhanceImage: (preset: ImageStylePreset) => Promise<void>;
}

export interface PresentationState {
  /** Currently active slide */
  slide: Slide | null;
  /** Current presentation theme */
  theme: Theme;
  /** Index of the active slide */
  activeSlideIndex: number;
  /** Current view mode */
  viewMode: 'standard' | 'wabi-sabi';
  /** Current Wabi-Sabi archetype layout */
  activeWabiSabiLayout: string;
  /** Whether in presentation/print mode */
  printMode: boolean;
  /** Whether AI refinement is in progress */
  isRefining: boolean;
  /** Full presentation object (for metadata access) */
  presentation: Presentation | null;
}

export interface PresentationContextValue extends PresentationState {
  actions: PresentationActions;
}

// ============ Context ============

const PresentationContext = createContext<PresentationContextValue | null>(null);

// ============ Provider Props ============

export interface PresentationProviderProps {
  children: ReactNode;
  /** Current slide to display */
  slide: Slide | null;
  /** Current theme */
  theme: Theme;
  /** Active slide index */
  activeSlideIndex: number;
  /** View mode */
  viewMode?: 'standard' | 'wabi-sabi';
  /** Wabi-Sabi layout name */
  activeWabiSabiLayout?: string;
  /** Print/presentation mode */
  printMode?: boolean;
  /** Whether AI refinement is in progress */
  isRefining?: boolean;
  /** Full presentation object */
  presentation?: Presentation | null;
  /** Callback to update slide */
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  /** Callback to regenerate slide image */
  onRegenerateSlide?: (mode: 'same' | 'varied') => void;
  /** Callback to regenerate all images */
  onRegenerateAll?: (mode: 'same' | 'varied') => void;
  /** Callback to refine content */
  onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
  /** Callback to enhance image */
  onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
}

// ============ Provider Component ============

export const PresentationProvider: React.FC<PresentationProviderProps> = ({
  children,
  slide,
  theme,
  activeSlideIndex,
  viewMode = 'standard',
  activeWabiSabiLayout = 'Editorial',
  printMode = false,
  isRefining = false,
  presentation = null,
  onUpdateSlide,
  onRegenerateSlide,
  onRegenerateAll,
  onRefineContent,
  onEnhanceImage,
}) => {
  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo<PresentationActions>(() => ({
    updateSlide: (updates) => onUpdateSlide?.(updates),
    regenerateSlideImage: (mode) => onRegenerateSlide?.(mode),
    regenerateAllImages: (mode) => onRegenerateAll?.(mode),
    refineContent: async (type, subType) => {
      await onRefineContent?.(type, subType);
    },
    enhanceImage: async (preset) => {
      await onEnhanceImage?.(preset);
    },
  }), [onUpdateSlide, onRegenerateSlide, onRegenerateAll, onRefineContent, onEnhanceImage]);

  // Memoize the context value
  const value = useMemo<PresentationContextValue>(() => ({
    slide,
    theme,
    activeSlideIndex,
    viewMode,
    activeWabiSabiLayout,
    printMode,
    isRefining,
    presentation,
    actions,
  }), [
    slide,
    theme,
    activeSlideIndex,
    viewMode,
    activeWabiSabiLayout,
    printMode,
    isRefining,
    presentation,
    actions,
  ]);

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
};

// ============ Hook ============

/**
 * Access presentation state and actions.
 * Must be used within a PresentationProvider.
 */
export const usePresentation = (): PresentationContextValue => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};

/**
 * Access presentation state and actions safely.
 * Returns null if not within a PresentationProvider (useful for optional contexts).
 */
export const usePresentationSafe = (): PresentationContextValue | null => {
  return useContext(PresentationContext);
};

// ============ Utility Hooks ============

/**
 * Access just the current slide (for components that only need slide data).
 */
export const useCurrentSlide = (): Slide | null => {
  const context = useContext(PresentationContext);
  return context?.slide ?? null;
};

/**
 * Access just the theme (for components that only need styling).
 */
export const useTheme = (): Theme | null => {
  const context = useContext(PresentationContext);
  return context?.theme ?? null;
};

/**
 * Access just the actions (for components that only dispatch actions).
 */
export const usePresentationActions = (): PresentationActions | null => {
  const context = useContext(PresentationContext);
  return context?.actions ?? null;
};

export default PresentationContext;
