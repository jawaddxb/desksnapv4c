
// Layout type constants (single source of truth)
export const LAYOUT_TYPES = ['split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'] as const;
export type LayoutType = typeof LAYOUT_TYPES[number];

export const ALIGNMENTS = ['left', 'right', 'center'] as const;
export type Alignment = typeof ALIGNMENTS[number];

export const FONT_SCALES = ['auto', 'compact', 'hero', 'classic', 'modern'] as const;
export type FontScale = typeof FONT_SCALES[number];

export const LAYOUT_VARIANTS = ['default', 'inverted'] as const;
export type LayoutVariant = typeof LAYOUT_VARIANTS[number] | number;

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

export interface Slide {
  id: string;
  title: string;
  content: string[];
  speakerNotes: string;
  imagePrompt: string;
  imageUrl?: string;
  imageError?: string; // Error message if image generation failed
  isImageLoading: boolean;
  // Async image generation tracking
  imageTaskId?: string; // Celery task ID if generation in progress
  imageStorageKey?: string; // Storage provider key (S3 path, etc.)
  // Layout Engine Properties
  layoutType: LayoutType;
  alignment: Alignment;
  fontScale?: FontScale;
  layoutVariant?: LayoutVariant; // Seed for generative layouts or variant name
  // Style overrides (optional - layouts use defaults if undefined)
  titleFontSize?: number;
  contentFontSize?: number;
  textStyles?: {
    title?: TextStyleOverride;
    content?: TextStyleOverride;
  };
  imageStyles?: ImageStyleOverride;
  // Per-item content styles (indexed by content array position)
  contentItemStyles?: Record<number, ContentItemStyle>;
}

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
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

export interface PresentationPlanResponse {
  topic: string;
  visualStyle: string;
  themeId: string;
  slides: {
    title: string;
    bulletPoints: string[];
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
}

export type GenerationMode = 'concise' | 'balanced' | 'detailed' | 'verbatim';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}