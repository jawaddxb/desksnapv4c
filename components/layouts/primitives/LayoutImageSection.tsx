/**
 * LayoutImageSection Primitive
 *
 * Consistent image section wrapper with variant styles.
 * DRY: Consolidates image container patterns across layouts.
 */

import React from 'react';
import { Slide, Theme } from '../../../types';
import { ImageContainer } from '../../StandardLayouts';

export type ImageSectionVariant =
  | 'side' // Split layout - takes up half width/height
  | 'full' // Full bleed - absolute positioned
  | 'background' // Background layer with overlay support
  | 'strip' // Horizontal strip (gallery/statement)
  | 'thumbnail' // Small preview
  | 'card'; // Card background

export interface LayoutImageSectionProps {
  /** Slide data containing image info */
  slide: Slide;
  /** Theme for styling */
  theme: Theme;
  /** Layout variant */
  variant: ImageSectionVariant;
  /** Optional toolbar overlay */
  toolbar?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Order in flex container */
  order?: number;
  /** Flex sizing */
  flex?: string;
  /** Children (overlays, gradients, etc.) */
  children?: React.ReactNode;
}

const variantBaseClasses: Record<ImageSectionVariant, string> = {
  side: 'relative shrink-0 group',
  full: 'absolute inset-0 z-0',
  background: 'absolute inset-0 z-0',
  strip: 'relative shrink-0 group',
  thumbnail: 'relative overflow-hidden',
  card: 'absolute inset-0 z-0',
};

const variantDefaultStyles: Record<ImageSectionVariant, React.CSSProperties> = {
  side: {},
  full: {},
  background: {},
  strip: { minHeight: '30%' },
  thumbnail: { width: '8rem', height: '6rem' },
  card: {},
};

export const LayoutImageSection: React.FC<LayoutImageSectionProps> = ({
  slide,
  theme,
  variant,
  toolbar,
  className = '',
  style = {},
  order,
  flex,
  children,
}) => {
  const classes = [variantBaseClasses[variant], className].filter(Boolean).join(' ');

  const combinedStyle: React.CSSProperties = {
    ...variantDefaultStyles[variant],
    order,
    flex,
    ...style,
  };

  return (
    <div className={classes} style={combinedStyle}>
      <ImageContainer slide={slide} theme={theme} toolbar={toolbar} className="h-full" />
      {children}
    </div>
  );
};
