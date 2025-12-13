/**
 * useDeckSyncState Hook
 *
 * Manages synchronization between server-fetched presentation and local state.
 * Preserves locally-generated images during refetch to prevent UI flicker.
 *
 * SRP: Presentation state synchronization and hydration.
 */

import { useState, useEffect, useCallback } from 'react';
import { Presentation, ViewMode } from '@/types';
import { THEMES } from '@/config/themes';
import { Theme } from '@/types';

export interface UseDeckSyncStateOptions {
  /** Presentation fetched from server */
  fetchedPresentation: Presentation | null | undefined;
  /** Callback to hydrate theme state */
  onHydrateTheme?: (theme: Theme) => void;
  /** Callback to hydrate view mode state */
  onHydrateViewMode?: (viewMode: ViewMode) => void;
  /** Callback to hydrate layout state */
  onHydrateLayout?: (layout: string) => void;
}

export interface UseDeckSyncStateResult {
  /** Local presentation state (merged from server with local image preservation) */
  localPresentation: Presentation | null;
  /** Setter for local presentation */
  setLocalPresentation: React.Dispatch<React.SetStateAction<Presentation | null>>;
  /** Clear local presentation state */
  clearPresentation: () => void;
}

/**
 * Hook for managing presentation state synchronization.
 * Handles merge strategy to preserve locally-generated images during refetch.
 */
export function useDeckSyncState({
  fetchedPresentation,
  onHydrateTheme,
  onHydrateViewMode,
  onHydrateLayout,
}: UseDeckSyncStateOptions): UseDeckSyncStateResult {
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

      // Hydrate UI state from the fetched presentation
      if (fetchedPresentation.viewMode && onHydrateViewMode) {
        onHydrateViewMode(fetchedPresentation.viewMode);
      }
      if (fetchedPresentation.wabiSabiLayout && onHydrateLayout) {
        onHydrateLayout(fetchedPresentation.wabiSabiLayout);
      }
      if (fetchedPresentation.themeId && THEMES[fetchedPresentation.themeId] && onHydrateTheme) {
        onHydrateTheme(THEMES[fetchedPresentation.themeId]);
      }
    }
  }, [fetchedPresentation, onHydrateTheme, onHydrateViewMode, onHydrateLayout]);

  // Clear presentation state
  const clearPresentation = useCallback(() => {
    setLocalPresentation(null);
  }, []);

  return {
    localPresentation,
    setLocalPresentation,
    clearPresentation,
  };
}
