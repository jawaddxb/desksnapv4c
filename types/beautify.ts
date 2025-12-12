/**
 * Beautify Feature Types
 *
 * KISS: Only types unique to the "Make My Ugly Deck Beautiful" feature.
 * DRY: Reuses LayoutType, Alignment from ../types
 */

import type { LayoutType, Alignment, Slide } from '../types';

// =============================================================================
// SLIDE CLASSIFICATION
// =============================================================================

export const SLIDE_TYPES = [
  'title',
  'bullets',
  'two-column',
  'chart',
  'image-focus',
  'quote',
  'unknown',
] as const;
export type SlideType = typeof SLIDE_TYPES[number];

// =============================================================================
// TRANSFORMATION
// =============================================================================

export const TRANSFORM_INTENSITIES = ['cleanup', 'redesign', 'rebuild'] as const;
export type TransformIntensity = typeof TRANSFORM_INTENSITIES[number];

// =============================================================================
// SLIDE INTERMEDIATE REPRESENTATION (IR)
// =============================================================================

/**
 * Original slide content extracted from PPTX.
 * Preserves raw data for before/after comparison.
 */
export interface OriginalSlideContent {
  texts: Array<{
    value: string;
    fontSize?: number;
    fontFamily?: string;
    isBold?: boolean;
    isTitle?: boolean;
  }>;
  images: Array<{
    url: string;  // base64 data URL or blob URL
    width?: number;
    height?: number;
  }>;
  notes?: string;
  backgroundColor?: string;
}

/**
 * SlideIR: Intermediate representation bridging original PPTX → transformed Slide.
 * Contains both extracted content and analysis results.
 */
export interface SlideIR {
  id: string;
  position: number;

  // Classification
  type: SlideType;
  typeConfidence: number;  // 0-1

  // Extracted content (normalized)
  title: string;
  content: string[];
  notes: string;

  // Best image from original slide
  imageUrl?: string;

  // Analysis
  messScore: number;  // 0-100 (KISS: single aggregate score)
  messIssues: string[];  // Human-readable issues

  // Transformation hints (DRY: uses existing types)
  suggestedLayout: LayoutType;
  suggestedAlignment: Alignment;

  // Original for before preview
  original: OriginalSlideContent;
}

// =============================================================================
// SESSION STATE
// =============================================================================

export const SESSION_STATUSES = [
  'uploading',
  'parsing',
  'analyzing',
  'ready',
  'transforming',
  'done',
  'error',
] as const;
export type SessionStatus = typeof SESSION_STATUSES[number];

/**
 * BeautifySession: Complete state for a deck transformation.
 */
export interface BeautifySession {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: number;

  // Extracted slides
  slides: SlideIR[];

  // User selections
  intensity: TransformIntensity;
  themeId: string;  // DRY: References existing theme IDs

  // Overall analysis
  overallMessScore: number;  // Average of slide mess scores

  // Progress
  status: SessionStatus;
  progress: number;  // 0-100
  errorMessage?: string;

  // Results
  transformedSlides?: Slide[];  // DRY: Uses existing Slide type
  shareId?: string;
}

// =============================================================================
// STYLE PACKS
// =============================================================================

/**
 * StylePack: A preset combining theme + layout preferences.
 * KISS: Just references existing themes, no new styling logic.
 */
export interface StylePack {
  id: string;
  name: string;
  description: string;
  themeId: string;  // Maps to THEMES[themeId]
  icon: string;  // Lucide icon name
  // Optional: override default layout mapping for specific slide types
  layoutOverrides?: Partial<Record<SlideType, LayoutType>>;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface UploadResponse {
  sessionId: string;
}

export interface TransformRequest {
  themeId: string;
  intensity: TransformIntensity;
}

export interface TransformResponse {
  slides: Slide[];
}

export interface ShareResponse {
  shareId: string;
  shareUrl: string;
}

export interface ShareViewData {
  fileName: string;
  beforeSlides: SlideIR[];
  afterSlides: Slide[];
  themeId: string;
  createdAt: number;
}
