/**
 * Z-Index Layering System
 *
 * Global z-index constants for consistent layering across the app.
 * Prevents overlap issues by assigning semantic layers to layout elements.
 */

export const LayoutLayer = {
  /** Texture, Colors, base patterns */
  BACKGROUND: 0,
  /** Shapes, Lines, decorative elements */
  DECORATION: 10,
  /** Images, Videos */
  MEDIA: 20,
  /** Standard content containers */
  CONTENT_BASE: 30,
  /** Titles, Hero text (or overlapping content) */
  CONTENT_HERO: 40,
  /** Badges, Floating tags, Atmospheric effects (Rain, Blinds, Bars) */
  OVERLAY: 50,
  /** Critical text that must float above atmospheric effects (Noir, Cinematic) */
  CONTENT_TOP: 60,
  /** Tooltips, drag handles (if any) */
  UI: 100,
} as const;

export type LayoutLayerKey = keyof typeof LayoutLayer;
export type LayoutLayerValue = (typeof LayoutLayer)[LayoutLayerKey];
