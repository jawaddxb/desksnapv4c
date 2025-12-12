/**
 * Layout Primitives Index
 *
 * Reusable building blocks for creating slide layouts.
 * DRY: Consolidates repeated patterns from StandardLayouts.tsx
 */

// Grid/Flex container
export { LayoutGrid } from './LayoutGrid';
export type { LayoutGridProps } from './LayoutGrid';

// Image section wrapper
export { LayoutImageSection } from './LayoutImageSection';
export type { LayoutImageSectionProps, ImageSectionVariant } from './LayoutImageSection';

// Content section wrapper
export { LayoutContentSection } from './LayoutContentSection';
export type { LayoutContentSectionProps, ContentAlignment } from './LayoutContentSection';

// Overlay gradients
export { LayoutOverlay, OverlayPresets } from './LayoutOverlay';
export type { LayoutOverlayProps, OverlayDirection, OverlayStyle } from './LayoutOverlay';
