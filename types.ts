import { ContentBlock } from './types/contentBlocks';

// Layout type constants (single source of truth)
export const LAYOUT_TYPES = ['split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'] as const;
export type LayoutType = typeof LAYOUT_TYPES[number];

export const ALIGNMENTS = ['left', 'right', 'center'] as const;
export type Alignment = typeof ALIGNMENTS[number];

export const FONT_SCALES = ['auto', 'compact', 'hero', 'classic', 'modern'] as const;
export type FontScale = typeof FONT_SCALES[number];

export const LAYOUT_VARIANTS = ['default', 'inverted'] as const;
/**
 * Layout variant - either a preset name or a numeric seed for randomization.
 * - 'default' | 'inverted': Named presets with fixed layouts
 * - number: Seed for deterministic random layout generation
 */
export type LayoutVariant = typeof LAYOUT_VARIANTS[number] | number;

// Presentation workflow status
export const PRESENTATION_STATUSES = ['generating', 'rough-draft', 'approved'] as const;
export type PresentationStatus = typeof PRESENTATION_STATUSES[number];

// Slide approval state (for rough draft workflow)
export const SLIDE_APPROVAL_STATES = ['pending', 'approved', 'modified'] as const;
export type SlideApprovalState = typeof SLIDE_APPROVAL_STATES[number];

// Content types (user-selectable per slide)
export const CONTENT_TYPES = ['bullets', 'numbered', 'checkmarks', 'quotes', 'plain'] as const;
export type ContentType = typeof CONTENT_TYPES[number];

// Bullet marker styles (theme-defined)
export const BULLET_STYLES = ['dot', 'dash', 'arrow', 'check', 'square', 'circle', 'diamond', 'number', 'none'] as const;
export type BulletStyle = typeof BULLET_STYLES[number];

// Content item visual presets (container styling for content items)
export const CONTENT_ITEM_VISUAL_PRESETS = ['pill', 'card', 'sharp', 'glass', 'underline', 'solid', 'minimal'] as const;
export type ContentItemVisualPreset = typeof CONTENT_ITEM_VISUAL_PRESETS[number];

// Theme content styling configuration
export interface ThemeContentStyle {
  bulletStyle: BulletStyle;
  bulletSize?: number;           // 6-14px
  bulletColor?: 'accent' | 'text' | 'secondary';
  itemSpacing?: number;          // gap between items (8-20)
  numberedSuffix?: '.' | ')' | '';
  // Container visual preset (replaces itemPadding, itemBackground, itemBorderRadius)
  visualPreset?: ContentItemVisualPreset;
}

// Style override types for editing
export interface TextStyleOverride {
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
}

// Per-item style for content bullets (individual styling)
export interface ContentItemStyle {
  fontSize?: number;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
}

// Selection identifier for text sections in Wabi-Sabi mode
export type TextSelection =
  | { type: 'title' }
  | { type: 'content'; index: number }
  | null;

export interface ImageStyleOverride {
  opacity?: number;
  objectFit?: 'cover' | 'contain' | 'fill';
  brightness?: number;   // 0.5-1.5, default 1
  contrast?: number;     // 0.5-1.5, default 1
  saturation?: number;   // 0-2, default 1
}

// AI Refinement types
export type ToneType = 'professional' | 'casual' | 'technical' | 'persuasive' | 'executive';
export type ContentRefinementType = 'expand' | 'simplify' | 'clarify' | 'storytelling';
export type ImageStylePreset = 'vivid' | 'muted' | 'high-contrast' | 'soft';

// ============================================
// Slide Interface - Split by Concern (ISP)
// ============================================

/**
 * Core slide content that defines the slide's information.
 */
export interface SlideCore {
  id: string;
  title: string;
  /** Legacy bullet-point content (for backward compatibility) */
  content: string[];
  /** Rich content blocks (takes precedence over content if present) */
  contentBlocks?: ContentBlock[];
  speakerNotes: string;
  imagePrompt: string;
}

/**
 * Image generation state and storage references.
 */
export interface SlideImageState {
  imageUrl?: string;
  imageError?: string;          // Error message if image generation failed
  isImageLoading: boolean;
  imageTaskId?: string;         // Celery task ID if generation in progress
  imageStorageKey?: string;     // Storage provider key (S3 path, etc.)
}

/**
 * Layout engine properties for slide positioning and display.
 */
export interface SlideLayout {
  layoutType: LayoutType;
  alignment: Alignment;
  fontScale?: FontScale;
  layoutVariant?: LayoutVariant; // Seed for generative layouts or variant name
}

/**
 * Overlay style for full-bleed layouts.
 * Controls gradient intensity over background images.
 */
export type OverlayStyle = 'standard' | 'soft' | 'none';

/**
 * Style overrides for fine-grained visual control.
 */
export interface SlideStyles {
  titleFontSize?: number;
  contentFontSize?: number;
  textStyles?: {
    title?: TextStyleOverride;
    content?: TextStyleOverride;
  };
  imageStyles?: ImageStyleOverride;
  contentItemStyles?: Record<number, ContentItemStyle>; // Per-item content styles
  overlayStyle?: OverlayStyle; // Gradient overlay style for full-bleed layouts
  contentItemVisualPreset?: ContentItemVisualPreset; // Visual style for content items (slide override)
}

/**
 * Workflow-related properties for draft review and content type.
 */
export interface SlideWorkflow {
  contentType?: ContentType;           // Content display type (user-selectable)
  approvalState?: SlideApprovalState;  // For rough draft review workflow
}

/**
 * Complete Slide type - intersection of all concerns.
 * Use specific sub-interfaces when a component only needs partial data.
 */
export type Slide = SlideCore & SlideImageState & SlideLayout & SlideStyles & SlideWorkflow;

export interface AnalyticsSession {
  id: string;
  timestamp: number;
  totalDuration: number;
  slideDurations: Record<string, number>; // slideId -> seconds
}

// View mode for presentation display
export const VIEW_MODES = ['standard', 'wabi-sabi'] as const;
export type ViewMode = typeof VIEW_MODES[number];

// PowerPoint export modes
export const EXPORT_MODES = ['editable', 'hybrid', 'visual-match'] as const;
export type ExportMode = typeof EXPORT_MODES[number];

export interface ExportOptions {
  mode: ExportMode;
  includeNotes: boolean;
}

export interface Presentation {
  id: string;
  lastModified: number;
  topic: string;
  visualStyle: string;
  themeId: string;
  slides: Slide[];
  wabiSabiLayout?: string;
  viewMode?: ViewMode; // Persisted view mode preference (structured vs organic)
  analytics?: AnalyticsSession[];
  // Rough draft workflow
  status?: PresentationStatus; // Default: 'approved' for backwards compatibility
  // Source references (for traceability)
  ideationSessionId?: string;
  sourceRoughDraftId?: string;
}

export const MessageRole = {
  USER: 'user',
  MODEL: 'model',
  SYSTEM: 'system',
} as const;

export type MessageRoleType = typeof MessageRole[keyof typeof MessageRole];

export interface Message {
  id: string;
  role: MessageRoleType;
  text: string;
  timestamp: number;
}

export interface PresentationPlanResponse {
  topic: string;
  visualStyle: string;
  themeId: string;
  slides: {
    title: string;
    bulletPoints?: string[];  // Legacy format
    contentBlocks?: ContentBlock[];  // Rich content blocks (preferred)
    speakerNotes: string;
    imageVisualDescription: string;
    layoutType: LayoutType;
    alignment: Alignment;
  }[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    background: string; 
    surface: string; 
    text: string;
    accent: string;
    border: string;
    secondary: string;
    backgroundPattern?: string;
  };
  layout: {
    radius: string;
    borderWidth: string;
    shadow: string;
    headingTransform: 'uppercase' | 'none' | 'lowercase' | 'capitalize';
    headingWeight: string;
  };
  imageStyle: string;
  // Content/bullet styling (theme-driven variety)
  contentStyle?: ThemeContentStyle;
}

export type GenerationMode = 'concise' | 'balanced' | 'detailed' | 'verbatim';

// ============================================
// Research Co-Pilot Types (Enhanced Mode)
// ============================================

// Research preferences selected by user in Enhanced Mode
export interface ResearchPreferences {
  includeStats: boolean;       // Market statistics & growth data
  includeXSearch: boolean;     // X/Twitter trends and social proof
  includeCompetitors: boolean; // Competitor analysis
  includeExperts: boolean;     // Expert opinions & case studies
}

// Citation for research findings
export interface Citation {
  id: string;
  url: string;
  title: string;
  source: string;       // e.g., "Statista", "Forbes", "X/@username"
  accessedAt: number;   // timestamp
  reliability?: 1 | 2 | 3 | 4 | 5; // 1-5 star rating
}

// Research finding categories
export const FINDING_TYPES = ['market', 'trend', 'competitor', 'expert', 'social'] as const;
export type FindingType = typeof FINDING_TYPES[number];

// Individual research finding
export interface Finding {
  id: string;
  type: FindingType;
  summary: string;           // Brief text summary
  details?: string;          // Expanded details if available
  citation: Citation;
  icon: string;              // Emoji icon for display
  sentiment?: 'positive' | 'negative' | 'neutral';
  metrics?: {
    value: string;           // e.g., "$45.2B"
    label: string;           // e.g., "Market Size"
    change?: string;         // e.g., "+15% YoY"
  };
}

// X/Twitter specific trend data
export interface XTrend {
  query: string;
  mentionCount: number;
  sentiment: {
    positive: number;        // percentage
    negative: number;
    neutral: number;
  };
  keyVoices: string[];       // @usernames
  topPosts?: string[];       // sample post texts
}

// Progress step for visual tracking
export interface ProgressStep {
  id: string;
  label: string;
  done: boolean;
  active: boolean;
}

// Progress state for research visualization
export interface ProgressState {
  status: string;            // Current status message
  percent: number;           // 0-100
  steps: ProgressStep[];
}

// Progress update from Grok during research
export interface ProgressUpdate {
  tool: 'web_search' | 'x_search' | 'code_execution' | 'synthesizing';
  status: 'searching' | 'found' | 'processing' | 'complete' | 'error';
  message?: string;
  finding?: Finding;
}

// Complete research result with findings, citations, and synthesis
export interface ComprehensiveResearch {
  findings: Finding[];
  citations: Citation[];
  xTrends?: XTrend[];
  synthesis?: string;        // AI-generated summary
  mindMapData?: MindMapNode;
}

/**
 * @deprecated Use ComprehensiveResearch instead
 */
export type ResearchResult = ComprehensiveResearch;

// Mind map node structure for visualization
export interface MindMapNode {
  id: string;
  label: string;
  type: 'topic' | 'category' | 'finding';
  children?: MindMapNode[];
  finding?: Finding;
}

// Enhanced mode state for CopilotPanel
export type EnhancedModeStep = 'intro' | 'preferences' | 'researching' | 'results';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}