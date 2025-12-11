/**
 * Type Definitions for Homepage Prototypes
 *
 * Design tokens and interfaces for themed homepage variations.
 */

export interface DesignTokens {
  // Identity
  id: string;
  name: string;
  description: string;
  category: 'dark' | 'light' | 'organic' | 'editorial' | 'gradient';

  // Colors
  colors: {
    // Backgrounds
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceHover: string;

    // Text
    text: string;
    textMuted: string;
    textOnDark: string;
    textOnLight: string;

    // Accents
    accent: string;
    accentHover: string;
    accentMuted: string;

    // Borders & Dividers
    border: string;
    borderHover: string;
    divider: string;
  };

  // Typography
  typography: {
    fontHeading: string;
    fontBody: string;
    fontAccent?: string;

    headingWeight: string;
    headingTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    headingTracking: string;

    bodyLineHeight: string;
  };

  // Layout
  layout: {
    borderRadius: string;
    borderRadiusLarge: string;
    borderRadiusSmall: string;
    borderWidth: string;

    cardShadow: string;
    cardShadowHover: string;

    containerMaxWidth: string;
    sectionPadding: string;
  };

  // Effects
  effects: {
    // Background patterns/textures
    backgroundPattern?: string;
    backgroundTexture?: string;

    // Glow/blur effects
    glowColor?: string;
    backdropBlur?: string;

    // Animation style
    transitionDuration: string;
    animationStyle: 'none' | 'subtle' | 'playful' | 'dramatic';

    // Decorative elements
    decorativeShapes: boolean;
    decorativeLines: boolean;
  };

  // Component-specific overrides
  components: {
    // Navbar
    navbarBackground: string;
    navbarText: string;
    navbarBorder: string;

    // Hero
    heroBackground: string;
    heroMinHeight: string;
    heroAlignment: 'left' | 'center' | 'right';

    // Cards
    cardBackground: string;
    cardBorder: string;

    // Buttons
    buttonPrimaryBg: string;
    buttonPrimaryText: string;
    buttonPrimaryHoverBg: string;
    buttonSecondaryBg: string;
    buttonSecondaryText: string;
    buttonSecondaryBorder: string;

    // Footer
    footerBackground: string;
    footerText: string;
    footerBorder: string;
  };
}

export interface PrototypeInfo {
  id: string;
  name: string;
  description: string;
  previewColors: [string, string, string]; // Three colors for preview
  category: DesignTokens['category'];
}

// List of all prototypes for the switcher
export const PROTOTYPE_LIST: PrototypeInfo[] = [
  {
    id: 'studio-noir',
    name: 'Studio Noir',
    description: 'High-contrast B&W gallery aesthetic',
    previewColors: ['#000000', '#ffffff', '#c5a47e'],
    category: 'dark',
  },
  {
    id: 'soft-canvas',
    name: 'Soft Canvas',
    description: 'Soft pastels, organic shapes',
    previewColors: ['#fefbf6', '#f8e1d9', '#d4e4d1'],
    category: 'light',
  },
  {
    id: 'paper-texture',
    name: 'Paper Texture',
    description: 'Tactile editorial warmth',
    previewColors: ['#faf6f1', '#333333', '#bc6c4c'],
    category: 'editorial',
  },
  {
    id: 'ink-gold',
    name: 'Ink & Gold',
    description: 'Dark elegant luxury',
    previewColors: ['#0f172a', '#c5a47e', '#faf5eb'],
    category: 'dark',
  },
  {
    id: 'atelier-light',
    name: 'Atelier Light',
    description: 'Minimal studio aesthetic',
    previewColors: ['#ffffff', '#4a4a4a', '#c4a35a'],
    category: 'light',
  },
  {
    id: 'fluid-forms',
    name: 'Fluid Forms',
    description: 'Organic flowing gradients',
    previewColors: ['#9cb686', '#87ceeb', '#b4a7d6'],
    category: 'gradient',
  },
  {
    id: 'sketchbook',
    name: 'Sketchbook',
    description: 'Hand-drawn personal feel',
    previewColors: ['#fdf6e8', '#444444', '#f5c6a5'],
    category: 'organic',
  },
  {
    id: 'gallery-white',
    name: 'Gallery White',
    description: 'Museum-quality clean',
    previewColors: ['#ffffff', '#1a1a1a', '#e5e5e5'],
    category: 'light',
  },
  {
    id: 'warm-terra',
    name: 'Warm Terra',
    description: 'Mediterranean warmth',
    previewColors: ['#f5ebe0', '#c66b3d', '#606c38'],
    category: 'organic',
  },
  {
    id: 'dusk-gradient',
    name: 'Dusk Gradient',
    description: 'Atmospheric twilight',
    previewColors: ['#2d1b4e', '#e8b4bc', '#f4a261'],
    category: 'gradient',
  },
];
