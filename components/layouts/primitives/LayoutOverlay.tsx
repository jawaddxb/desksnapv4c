/**
 * LayoutOverlay Primitive
 *
 * Gradient and color overlays for image backgrounds.
 * DRY: Consolidates overlay patterns used in FullBleed, Card layouts.
 */

import React from 'react';

export type OverlayDirection = 'top' | 'bottom' | 'left' | 'right' | 'center';
export type OverlayStyle = 'gradient' | 'solid' | 'blur';

export interface LayoutOverlayProps {
  /** Base color (usually theme.colors.surface) */
  color: string;
  /** Direction of gradient fade */
  direction?: OverlayDirection;
  /** Overlay style type */
  overlayStyle?: OverlayStyle;
  /** Opacity levels [start, mid, end] for gradients */
  opacity?: [string, string, string];
  /** Z-index layer */
  zIndex?: number;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Generate gradient based on direction and color.
 */
const getGradient = (
  color: string,
  direction: OverlayDirection,
  opacity: [string, string, string]
): string => {
  const [startOpacity, midOpacity, endOpacity] = opacity;

  const directionMap: Record<OverlayDirection, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
    center: 'to top', // Center uses radial, but we need a fallback
  };

  // For center, use a bottom-heavy gradient
  if (direction === 'center') {
    return `linear-gradient(to top, ${color}${startOpacity} 0%, ${color}${midOpacity} 60%, transparent 100%)`;
  }

  return `linear-gradient(${directionMap[direction]}, ${color}${startOpacity} 0%, ${color}${midOpacity} 50%, transparent 100%)`;
};

export const LayoutOverlay: React.FC<LayoutOverlayProps> = ({
  color,
  direction = 'left',
  overlayStyle = 'gradient',
  opacity = ['F2', 'B3', '00'], // ~95%, ~70%, 0%
  zIndex = 10,
  className = '',
  style = {},
}) => {
  let background: string;

  switch (overlayStyle) {
    case 'solid':
      background = `${color}${opacity[1]}`;
      break;
    case 'blur':
      background = `${color}80`; // 50% for blur effect base
      break;
    case 'gradient':
    default:
      background = getGradient(color, direction, opacity);
      break;
  }

  const classes = [
    'absolute inset-0',
    'pointer-events-none',
    overlayStyle === 'blur' ? 'backdrop-blur-md' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        background,
        zIndex,
        ...style,
      }}
    />
  );
};

/**
 * Common overlay presets for quick usage.
 */
export const OverlayPresets = {
  /** Left-to-right fade for right-aligned content */
  fadeLeft: (color: string) => (
    <LayoutOverlay color={color} direction="left" opacity={['F2', 'B3', '00']} />
  ),
  /** Right-to-left fade for left-aligned content */
  fadeRight: (color: string) => (
    <LayoutOverlay color={color} direction="right" opacity={['F2', 'B3', '00']} />
  ),
  /** Bottom-to-top fade for centered content */
  fadeUp: (color: string) => (
    <LayoutOverlay color={color} direction="center" opacity={['F2', '80', '00']} />
  ),
  /** Light darkening overlay */
  darken: () => <LayoutOverlay color="#000000" overlayStyle="solid" opacity={['00', '1A', '00']} />,
  /** Blur glass effect */
  glass: (color: string) => <LayoutOverlay color={color} overlayStyle="blur" />,
};
