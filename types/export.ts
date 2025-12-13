/**
 * Export Types
 *
 * Unified type definitions for PDF and PPT export operations.
 * DRY: Single source of truth for export-related interfaces.
 */

// =============================================================================
// EXPORT PROGRESS
// =============================================================================

/**
 * All possible export phases across PDF, PPT, and Google Slides exports.
 *
 * - preparing: Initial setup, loading libraries
 * - rendering: Capturing slides to images/DOM
 * - compiling: Assembling PDF document
 * - converting: Converting DOM to PPTX format
 * - adding-notes: Adding speaker notes to slides
 * - uploading: Uploading to external service (Google Slides)
 * - complete: Export finished successfully
 * - error: Export failed
 */
export type ExportPhase =
  | 'preparing'
  | 'rendering'
  | 'compiling'
  | 'converting'
  | 'adding-notes'
  | 'uploading'
  | 'complete'
  | 'error';

/**
 * Unified progress interface for all export operations.
 * Used by pdfService, pptService, pptExportStrategies, and ExportProgressModal.
 */
export interface ExportProgress {
  /** Current slide being processed (1-indexed for display) */
  currentSlide: number;
  /** Total number of slides to process */
  totalSlides: number;
  /** Current phase of the export operation */
  phase: ExportPhase;
  /** Optional human-readable status message */
  message?: string;
}

// =============================================================================
// EXPORT TYPE
// =============================================================================

/**
 * Supported export formats
 */
export type ExportType = 'pdf' | 'pptx' | 'google-slides';

/**
 * View mode for export rendering
 */
export type ExportViewMode = 'standard' | 'wabi-sabi';

// =============================================================================
// EXPORT OPTIONS
// =============================================================================

/**
 * Base options common to all export types
 */
export interface BaseExportOptions {
  /** Callback for progress updates */
  onProgress?: (progress: ExportProgress) => void;
  /** Custom filename (without extension) */
  filename?: string;
}

/**
 * PDF-specific export options
 */
export interface PDFExportOptions extends BaseExportOptions {
  /** Output width in pixels (default: 1920) */
  width?: number;
  /** Output height in pixels (default: 1080) */
  height?: number;
  /** JPEG quality 0-1 (default: 0.92) */
  quality?: number;
}

/**
 * PPT-specific export options
 */
export interface PPTExportOptions extends BaseExportOptions {
  /** View mode for rendering */
  viewMode: ExportViewMode;
  /** Layout name if using wabi-sabi mode */
  wabiSabiLayout?: string;
}

/**
 * Strategy-based PPT export options
 */
export interface PPTStrategyOptions extends BaseExportOptions {
  /** Include speaker notes in export */
  includeNotes: boolean;
  /** View mode for rendering */
  viewMode?: ExportViewMode;
  /** Layout name if using wabi-sabi mode */
  wabiSabiLayout?: string;
}

// =============================================================================
// RENDER EVENTS
// =============================================================================

/**
 * Event detail for slide rendering requests.
 * Used by ExportRenderer to receive slide data from export services.
 */
export interface RenderSlideEventDetail {
  /** Index of the slide to render (0-indexed) */
  slideIndex: number;
  /** Full presentation data */
  presentation: import('./index').Presentation;
  /** Theme to apply */
  theme: import('./index').Theme;
  /** Rendering mode */
  viewMode: ExportViewMode;
  /** Layout name if using wabi-sabi mode */
  wabiSabiLayout?: string;
}

// =============================================================================
// LEGACY TYPE ALIASES (for backwards compatibility)
// =============================================================================

/**
 * @deprecated Use ExportProgress instead
 */
export type PDFExportProgress = ExportProgress;

/**
 * @deprecated Use ExportProgress instead
 */
export type PPTExportProgress = ExportProgress;
