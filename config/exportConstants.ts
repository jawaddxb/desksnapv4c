/**
 * Export Constants
 *
 * Centralized configuration for PDF and PPT export operations.
 * DRY: Single source of truth for dimensions, event names, and element IDs.
 */

// =============================================================================
// DIMENSIONS
// =============================================================================

/**
 * Default slide dimensions for export (1080p HD)
 */
export const SLIDE_DIMENSIONS = {
  width: 1920,
  height: 1080,
} as const;

// =============================================================================
// EVENT NAMES
// =============================================================================

/**
 * Custom event names for export rendering pipeline.
 * Components dispatch these events to coordinate slide rendering.
 */
export const EXPORT_EVENTS = {
  // PDF export events
  PDF_RENDER: 'render-slide-for-pdf',
  PDF_COMPLETE: 'pdf-export-complete',

  // PPT export events
  PPT_RENDER: 'render-slide-for-ppt',
  PPT_COMPLETE: 'ppt-export-complete',
} as const;

// =============================================================================
// ELEMENT IDS
// =============================================================================

/**
 * DOM element IDs used by export renderers.
 * These IDs are referenced by export services to locate rendered content.
 */
export const EXPORT_ELEMENT_IDS = {
  PDF_RENDERER: 'pdf-export-renderer',
  PPT_RENDERER: 'ppt-export-renderer',
  PPT_SLIDE_CONTENT: 'ppt-slide-content',
} as const;

// =============================================================================
// TIMING
// =============================================================================

/**
 * Timing constants for export operations
 */
export const EXPORT_TIMING = {
  /** Delay after rendering to ensure fonts/images are ready */
  RENDER_DELAY_MS: 200,
  /** Wait time between slides for DOM to settle */
  SLIDE_WAIT_MS: 500,
  /** Timeout for image loading */
  IMAGE_TIMEOUT_MS: 15000,
} as const;

// =============================================================================
// QUALITY SETTINGS
// =============================================================================

/**
 * Default quality settings for exports
 */
export const EXPORT_QUALITY = {
  /** JPEG quality for PDF images (0-1) */
  PDF_JPEG_QUALITY: 0.92,
  /** PNG compression for PPT images */
  PPT_IMAGE_FORMAT: 'JPEG' as const,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ExportEventType = typeof EXPORT_EVENTS[keyof typeof EXPORT_EVENTS];
export type ExportElementId = typeof EXPORT_ELEMENT_IDS[keyof typeof EXPORT_ELEMENT_IDS];
