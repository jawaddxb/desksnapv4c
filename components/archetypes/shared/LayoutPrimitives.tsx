import React from 'react';
import { LayoutLayer } from '../../../config/zIndex';
import { Slide, Theme } from '../../../types';
import { ImageContainer } from '../../StandardLayouts';

/**
 * Base container used by all archetypes
 * Provides consistent full-size, relative positioning with overflow hidden
 */
export const ArchetypeContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <div
    className={`w-full h-full relative overflow-hidden ${className}`}
    style={style}
  >
    {children}
  </div>
);

/**
 * Background image layer - covers entire container
 * Used for full-bleed background images
 */
export const BackgroundImage: React.FC<{
  slide: Slide;
  theme: Theme;
  className?: string;
  imageClassName?: string;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ slide, theme, className = '', imageClassName, opacity = 1, style }) => (
  <div
    className={`absolute inset-0 ${className}`}
    style={{ zIndex: LayoutLayer.BACKGROUND, opacity, ...style }}
  >
    <ImageContainer slide={slide} theme={theme} className={imageClassName} />
  </div>
);

/**
 * Media panel - for positioned image containers
 * Used for split layouts, side panels, etc.
 */
export const MediaPanel: React.FC<{
  slide: Slide;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
  imageClassName?: string;
}> = ({ slide, theme, className = '', style, imageClassName }) => (
  <div
    className={className}
    style={{ zIndex: LayoutLayer.MEDIA, ...style }}
  >
    <ImageContainer slide={slide} theme={theme} className={imageClassName} />
  </div>
);

/**
 * Content layer wrapper - applies z-index for content hierarchy
 */
export const ContentLayer: React.FC<{
  children: React.ReactNode;
  layer?: keyof typeof LayoutLayer;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, layer = 'CONTENT_BASE', className = '', style }) => (
  <div
    className={className}
    style={{ zIndex: LayoutLayer[layer], ...style }}
  >
    {children}
  </div>
);

/**
 * Decoration layer - for visual accents that don't carry content
 */
export const DecorationLayer: React.FC<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <div
    className={className}
    style={{ zIndex: LayoutLayer.DECORATION, ...style }}
  >
    {children}
  </div>
);

/**
 * Overlay layer - for gradients, filters over images
 */
export const OverlayLayer: React.FC<{
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', style }) => (
  <div
    className={className}
    style={{ zIndex: LayoutLayer.OVERLAY, ...style }}
  >
    {children}
  </div>
);

/**
 * Gradient overlay - commonly used over background images
 */
export const GradientOverlay: React.FC<{
  direction?: 'to-t' | 'to-b' | 'to-l' | 'to-r' | 'to-tl' | 'to-tr' | 'to-bl' | 'to-br';
  from?: string;
  via?: string;
  to?: string;
  className?: string;
}> = ({ direction = 'to-b', from = 'transparent', via, to = 'black/90', className = '' }) => {
  const viaClass = via ? `via-${via}` : '';
  return (
    <div
      className={`absolute inset-0 bg-gradient-${direction} from-${from} ${viaClass} to-${to} ${className}`}
      style={{ zIndex: LayoutLayer.DECORATION }}
    />
  );
};
