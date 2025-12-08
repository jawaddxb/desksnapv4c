

export interface Slide {
  id: string;
  title: string;
  content: string[];
  speakerNotes: string;
  imagePrompt: string;
  imageUrl?: string;
  isImageLoading: boolean;
  // Layout Engine Properties
  layoutType: 'split' | 'full-bleed' | 'statement' | 'gallery' | 'card' | 'horizontal' | 'magazine';
  alignment: 'left' | 'right' | 'center';
  fontScale?: 'auto' | 'compact' | 'hero' | 'classic' | 'modern';
  layoutVariant?: number; // Seed for generative layouts
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