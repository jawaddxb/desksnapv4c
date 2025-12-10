

// Style override types for editing
export interface TextStyleOverride {
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
}

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
  // Layout Engine Properties
  layoutType: 'split' | 'full-bleed' | 'statement' | 'gallery' | 'card' | 'horizontal' | 'magazine';
  alignment: 'left' | 'right' | 'center';
  fontScale?: 'auto' | 'compact' | 'hero' | 'classic' | 'modern';
  layoutVariant?: number | 'default' | 'inverted'; // Seed for generative layouts or variant name
  // Style overrides (optional - layouts use defaults if undefined)
  titleFontSize?: number;
  contentFontSize?: number;
  textStyles?: {
    title?: TextStyleOverride;
    content?: TextStyleOverride;
  };
  imageStyles?: ImageStyleOverride;
}

export interface AnalyticsSession {
  id: string;
  timestamp: number;
  totalDuration: number;
  slideDurations: Record<string, number>; // slideId -> seconds
}

export interface Presentation {
  id: string;
  lastModified: number;
  topic: string;
  visualStyle: string;
  themeId: string;
  slides: Slide[];
  wabiSabiLayout?: string;
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
    layoutType: 'split' | 'full-bleed' | 'statement' | 'gallery' | 'card' | 'horizontal' | 'magazine';
    alignment: 'left' | 'right' | 'center';
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