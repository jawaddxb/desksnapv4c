/**
 * ThumbnailPreviewContainer
 *
 * Hidden off-screen container for rendering slides at a fixed size
 * for thumbnail capture. Renders with printMode=true for clean output.
 */

import React, { forwardRef } from 'react';
import { Slide, Theme } from '@/types';
import { WabiSabiStage } from '../WabiSabiStage';
import { SplitLayout } from '../StandardLayouts';

// ============ Types ============

export interface ThumbnailPreviewContainerProps {
  /** Slide data to render */
  slide: Slide;
  /** Theme to apply */
  theme: Theme;
  /** Render mode: 'theme' for standard layouts, 'archetype' for Wabi-Sabi */
  mode: 'theme' | 'archetype';
  /** Archetype name (required when mode='archetype') */
  archetypeName?: string;
  /** Whether the container is visible (for debugging) */
  visible?: boolean;
}

// ============ Constants ============

/** Container dimensions (16:9 aspect ratio at 2x for crisp output) */
const CONTAINER_WIDTH = 800;
const CONTAINER_HEIGHT = 600;

// ============ Component ============

export const ThumbnailPreviewContainer = forwardRef<HTMLDivElement, ThumbnailPreviewContainerProps>(
  ({ slide, theme, mode, archetypeName, visible = false }, ref) => {
    return (
      <div
        ref={ref}
        className="overflow-hidden"
        style={{
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT,
          // Position off-screen unless visible for debugging
          position: visible ? 'relative' : 'fixed',
          left: visible ? 'auto' : '-9999px',
          top: visible ? 'auto' : '-9999px',
          // Ensure consistent rendering
          zIndex: visible ? 1 : -1,
          pointerEvents: 'none',
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background: theme.colors.background,
          }}
        >
          {mode === 'archetype' ? (
            <WabiSabiStage
              slide={slide}
              theme={theme}
              layoutStyle={archetypeName || 'Editorial'}
              printMode={true}
            />
          ) : (
            <SplitLayout
              slide={slide}
              theme={theme}
              printMode={true}
            />
          )}
        </div>
      </div>
    );
  }
);

ThumbnailPreviewContainer.displayName = 'ThumbnailPreviewContainer';

// ============ Exports ============

export { CONTAINER_WIDTH, CONTAINER_HEIGHT };
