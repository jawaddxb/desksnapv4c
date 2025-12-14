/**
 * Design System Showcase - 20 Truly Distinct Design Systems
 *
 * Each system differs in typography, layout, borders, shadows, buttons, and overall aesthetic.
 * Not just color palettes - complete visual languages.
 */

export interface DesignSystem {
  id: string;
  name: string;
  category: string;
  description: string;

  // Colors
  colors: {
    background: string;
    backgroundGradient?: string;
    surface: string;
    surfaceHover: string;
    accent: string;
    accentHover: string;
    accentForeground: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderHover: string;
  };

  // Typography - CRITICAL FOR DIFFERENTIATION
  typography: {
    fontFamily: string;
    headingFont: string;
    monoFont: string;
    baseFontSize: string;
    headingSize: string;
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: string;
    headingLetterSpacing: string;
    lineHeight: string;
    textTransform: 'none' | 'uppercase' | 'lowercase';
  };

  // Layout - CRITICAL FOR DIFFERENTIATION
  layout: {
    density: 'compact' | 'comfortable' | 'spacious';
    cardStyle: 'flat' | 'elevated' | 'bordered' | 'glass' | 'brutalist' | 'neumorphic' | 'retro';
    gridStyle: 'traditional' | 'bento' | 'masonry' | 'list' | 'single-column';
    containerPadding: string;
    cardPadding: string;
    gap: string;
  };

  // Borders & Corners
  borders: {
    radius: string;
    cardRadius: string;
    buttonRadius: string;
    width: string;
    style: 'solid' | 'dashed' | 'double' | 'none';
  };

  // Shadows
  shadows: {
    card: string;
    cardHover: string;
    button: string;
    buttonHover: string;
  };

  // Buttons
  buttons: {
    style: 'filled' | 'outline' | 'ghost' | 'brutalist' | 'underline' | 'bracket' | 'beveled';
    textTransform: 'none' | 'uppercase' | 'lowercase';
    fontWeight: number;
    padding: string;
  };

  // Special Effects
  effects: {
    blur?: string;
    grain?: boolean;
    scanlines?: boolean;
    dotPattern?: boolean;
    linePattern?: boolean;
  };
}

export const DESIGN_SYSTEMS: DesignSystem[] = [
  // ============================================
  // 1. SWISS PRECISION
  // ============================================
  {
    id: 'swiss-precision',
    name: 'Swiss Precision',
    category: 'Minimalist',
    description: 'International Typographic Style. Grid-based, asymmetric balance, bold typography with strict hierarchy.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceHover: '#F5F5F5',
      accent: '#E53935',
      accentHover: '#C62828',
      accentForeground: '#FFFFFF',
      text: '#000000',
      textSecondary: '#424242',
      textMuted: '#9E9E9E',
      border: '#000000',
      borderHover: '#000000',
    },
    typography: {
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      headingFont: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '32px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '-0.02em',
      headingLetterSpacing: '-0.03em',
      lineHeight: '1.4',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'flat',
      gridStyle: 'traditional',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '24px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: 'none',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'outline',
      textTransform: 'uppercase',
      fontWeight: 700,
      padding: '12px 24px',
    },
    effects: {
      linePattern: true,
    },
  },

  // ============================================
  // 2. NEO-BRUTALIST POP
  // ============================================
  {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Pop',
    category: 'Bold',
    description: 'Bold, raw, anti-design with playful colors. Thick black borders, hard shadows, chunky elements.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFEB3B',
      surfaceHover: '#FFF176',
      accent: '#000000',
      accentHover: '#212121',
      accentForeground: '#FFEB3B',
      text: '#000000',
      textSecondary: '#000000',
      textMuted: '#424242',
      border: '#000000',
      borderHover: '#000000',
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      headingFont: '"Space Grotesk", sans-serif',
      monoFont: '"Space Mono", monospace',
      baseFontSize: '16px',
      headingSize: '36px',
      headingWeight: 700,
      bodyWeight: 500,
      letterSpacing: '-0.01em',
      headingLetterSpacing: '-0.02em',
      lineHeight: '1.3',
      textTransform: 'uppercase',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'brutalist',
      gridStyle: 'traditional',
      containerPadding: '32px',
      cardPadding: '24px',
      gap: '20px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '4px',
      style: 'solid',
    },
    shadows: {
      card: '6px 6px 0px #000000',
      cardHover: '8px 8px 0px #000000',
      button: '4px 4px 0px #000000',
      buttonHover: '2px 2px 0px #000000',
    },
    buttons: {
      style: 'brutalist',
      textTransform: 'uppercase',
      fontWeight: 700,
      padding: '14px 28px',
    },
    effects: {},
  },

  // ============================================
  // 3. EDITORIAL LUXURY
  // ============================================
  {
    id: 'editorial-luxury',
    name: 'Editorial Luxury',
    category: 'Elegant',
    description: 'High-end magazine aesthetic. Serif typography, dramatic whitespace, understated elegance.',
    colors: {
      background: '#FAF9F7',
      surface: '#FFFFFF',
      surfaceHover: '#F5F4F2',
      accent: '#B8860B',
      accentHover: '#996F00',
      accentForeground: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
      textMuted: '#8A8A8A',
      border: '#E5E5E5',
      borderHover: '#CCCCCC',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"Playfair Display", Georgia, serif',
      monoFont: 'monospace',
      baseFontSize: '16px',
      headingSize: '42px',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'flat',
      gridStyle: 'single-column',
      containerPadding: '64px',
      cardPadding: '40px',
      gap: '32px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '0.5px',
      style: 'solid',
    },
    shadows: {
      card: '0 1px 2px rgba(0,0,0,0.04)',
      cardHover: '0 2px 4px rgba(0,0,0,0.06)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'underline',
      textTransform: 'uppercase',
      fontWeight: 500,
      padding: '8px 0',
    },
    effects: {},
  },

  // ============================================
  // 4. SOFT CLOUD (NEUMORPHISM)
  // ============================================
  {
    id: 'soft-cloud',
    name: 'Soft Cloud',
    category: 'Soft UI',
    description: 'Neumorphic design with extruded, tactile elements. Soft shadows create depth illusion.',
    colors: {
      background: '#E8E8E8',
      surface: '#E8E8E8',
      surfaceHover: '#F0F0F0',
      accent: '#6366F1',
      accentHover: '#4F46E5',
      accentForeground: '#FFFFFF',
      text: '#374151',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      border: 'transparent',
      borderHover: 'transparent',
    },
    typography: {
      fontFamily: '"Nunito", sans-serif',
      headingFont: '"Nunito", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '28px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.6',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'neumorphic',
      gridStyle: 'traditional',
      containerPadding: '40px',
      cardPadding: '28px',
      gap: '24px',
    },
    borders: {
      radius: '20px',
      cardRadius: '24px',
      buttonRadius: '12px',
      width: '0px',
      style: 'none',
    },
    shadows: {
      card: '8px 8px 16px #CBCBCB, -8px -8px 16px #FFFFFF',
      cardHover: '12px 12px 20px #CBCBCB, -12px -12px 20px #FFFFFF',
      button: '4px 4px 8px #CBCBCB, -4px -4px 8px #FFFFFF',
      buttonHover: 'inset 4px 4px 8px #CBCBCB, inset -4px -4px 8px #FFFFFF',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 600,
      padding: '14px 28px',
    },
    effects: {},
  },

  // ============================================
  // 5. TERMINAL / HACKER
  // ============================================
  {
    id: 'terminal-hacker',
    name: 'Terminal',
    category: 'Developer',
    description: 'Command-line interface aesthetic. Monospace typography, dense layout, matrix vibes.',
    colors: {
      background: '#0D1117',
      surface: '#161B22',
      surfaceHover: '#21262D',
      accent: '#39D353',
      accentHover: '#2EA043',
      accentForeground: '#0D1117',
      text: '#E6EDF3',
      textSecondary: '#7D8590',
      textMuted: '#484F58',
      border: '#30363D',
      borderHover: '#484F58',
    },
    typography: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      headingFont: '"JetBrains Mono", monospace',
      monoFont: '"JetBrains Mono", monospace',
      baseFontSize: '14px',
      headingSize: '20px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '0',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'compact',
      cardStyle: 'bordered',
      gridStyle: 'list',
      containerPadding: '24px',
      cardPadding: '16px',
      gap: '12px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: 'none',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'bracket',
      textTransform: 'none',
      fontWeight: 400,
      padding: '8px 16px',
    },
    effects: {
      scanlines: true,
    },
  },

  // ============================================
  // BENTO COLLECTION - 10 Variations
  // ============================================

  // 6a. BENTO ZEN (Original)
  {
    id: 'bento-zen',
    name: 'Bento Zen',
    category: 'Bento',
    description: 'Japanese minimalism meets bento box layouts. Zen-like balance, stone garden tranquility.',
    colors: {
      background: '#FAFAF9',
      surface: '#FFFFFF',
      surfaceHover: '#F5F5F4',
      accent: '#78716C',
      accentHover: '#57534E',
      accentForeground: '#FFFFFF',
      text: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#A8A29E',
      border: '#E7E5E4',
      borderHover: '#D6D3D1',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 300,
      bodyWeight: 400,
      letterSpacing: '0.02em',
      headingLetterSpacing: '0.05em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '4px',
      cardRadius: '8px',
      buttonRadius: '4px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(0,0,0,0.03)',
      cardHover: '0 8px 32px rgba(0,0,0,0.06)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'ghost',
      textTransform: 'none',
      fontWeight: 400,
      padding: '10px 20px',
    },
    effects: {},
  },

  // 6b. BENTO SAKURA
  {
    id: 'bento-sakura',
    name: 'Bento Sakura',
    category: 'Bento',
    description: 'Cherry blossom season. Soft pinks and blush tones with gentle spring warmth.',
    colors: {
      background: '#FFF8F6',
      surface: '#FFFFFF',
      surfaceHover: '#FFF0EC',
      accent: '#E879A0',
      accentHover: '#D4608A',
      accentForeground: '#FFFFFF',
      text: '#3D2832',
      textSecondary: '#6B4D5A',
      textMuted: '#B08A98',
      border: '#F5D5DE',
      borderHover: '#EABFCC',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"DM Sans", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.03em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '8px',
      cardRadius: '12px',
      buttonRadius: '9999px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(232,121,160,0.08)',
      cardHover: '0 8px 32px rgba(232,121,160,0.12)',
      button: '0 2px 8px rgba(232,121,160,0.2)',
      buttonHover: '0 4px 12px rgba(232,121,160,0.3)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 24px',
    },
    effects: {},
  },

  // 6c. BENTO MATCHA
  {
    id: 'bento-matcha',
    name: 'Bento Matcha',
    category: 'Bento',
    description: 'Tea ceremony calm. Forest greens and mint cream for meditative focus.',
    colors: {
      background: '#F5FAF7',
      surface: '#FFFFFF',
      surfaceHover: '#EDF5F0',
      accent: '#6B8E6B',
      accentHover: '#5A7A5A',
      accentForeground: '#FFFFFF',
      text: '#1E2E1E',
      textSecondary: '#4A5D4A',
      textMuted: '#8FA58F',
      border: '#D4E5D4',
      borderHover: '#C0D6C0',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.04em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '4px',
      cardRadius: '8px',
      buttonRadius: '6px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(107,142,107,0.06)',
      cardHover: '0 8px 32px rgba(107,142,107,0.1)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'ghost',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 20px',
    },
    effects: {},
  },

  // 6d. BENTO INDIGO
  {
    id: 'bento-indigo',
    name: 'Bento Indigo',
    category: 'Bento',
    description: 'Traditional Japanese indigo dyeing. Deep blues with serene sophistication.',
    colors: {
      background: '#F5F7FA',
      surface: '#FFFFFF',
      surfaceHover: '#EDF0F7',
      accent: '#4F5B93',
      accentHover: '#3D4A7A',
      accentForeground: '#FFFFFF',
      text: '#1A1F33',
      textSecondary: '#4A5068',
      textMuted: '#8B92A8',
      border: '#D4DAE8',
      borderHover: '#BBC4DA',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '0.02em',
      lineHeight: '1.6',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '4px',
      cardRadius: '6px',
      buttonRadius: '4px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(79,91,147,0.06)',
      cardHover: '0 8px 32px rgba(79,91,147,0.1)',
      button: 'none',
      buttonHover: '0 2px 8px rgba(79,91,147,0.2)',
    },
    buttons: {
      style: 'outline',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 20px',
    },
    effects: {},
  },

  // 6e. BENTO SUNSET
  {
    id: 'bento-sunset',
    name: 'Bento Sunset',
    category: 'Bento',
    description: 'Golden hour warmth. Coral and amber tones for inviting evening ambiance.',
    colors: {
      background: '#FFF9F5',
      surface: '#FFFFFF',
      surfaceHover: '#FFF3EC',
      accent: '#E07B54',
      accentHover: '#C96A45',
      accentForeground: '#FFFFFF',
      text: '#3D2A1F',
      textSecondary: '#6B5244',
      textMuted: '#A8917F',
      border: '#F5DDD0',
      borderHover: '#EACABC',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"DM Sans", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.03em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '12px',
      cardRadius: '16px',
      buttonRadius: '12px',
      width: '0px',
      style: 'none',
    },
    shadows: {
      card: '0 4px 24px rgba(224,123,84,0.08)',
      cardHover: '0 8px 32px rgba(224,123,84,0.14)',
      button: '0 2px 8px rgba(224,123,84,0.25)',
      buttonHover: '0 4px 12px rgba(224,123,84,0.35)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '12px 24px',
    },
    effects: {},
  },

  // 6f. BENTO MONO
  {
    id: 'bento-mono',
    name: 'Bento Mono',
    category: 'Bento',
    description: 'High-fashion minimalism. Pure grayscale with stark contrast and sharp edges.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceHover: '#F5F5F5',
      accent: '#1A1A1A',
      accentHover: '#333333',
      accentForeground: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#525252',
      textMuted: '#A3A3A3',
      border: '#E5E5E5',
      borderHover: '#D4D4D4',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 700,
      bodyWeight: 300,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.6',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '2px',
      cardRadius: '4px',
      buttonRadius: '2px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: 'none',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'outline',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 20px',
    },
    effects: {},
  },

  // 6g. BENTO OCEAN
  {
    id: 'bento-ocean',
    name: 'Bento Ocean',
    category: 'Bento',
    description: 'Coastal serenity. Aqua and teal tones inspired by calm seas.',
    colors: {
      background: '#F5FAFA',
      surface: '#FFFFFF',
      surfaceHover: '#EDF7F7',
      accent: '#2B8A8A',
      accentHover: '#237575',
      accentForeground: '#FFFFFF',
      text: '#1A2E2E',
      textSecondary: '#3D5C5C',
      textMuted: '#7FA3A3',
      border: '#C8E4E4',
      borderHover: '#AED6D6',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.03em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '6px',
      cardRadius: '10px',
      buttonRadius: '8px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(43,138,138,0.06)',
      cardHover: '0 8px 32px rgba(43,138,138,0.1)',
      button: '0 2px 8px rgba(43,138,138,0.2)',
      buttonHover: '0 4px 12px rgba(43,138,138,0.3)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 22px',
    },
    effects: {},
  },

  // 6h. BENTO EARTH
  {
    id: 'bento-earth',
    name: 'Bento Earth',
    category: 'Bento',
    description: 'Clay pottery warmth. Terracotta and earthy browns with organic character.',
    colors: {
      background: '#FAF6F1',
      surface: '#FFFFFF',
      surfaceHover: '#F5EFE8',
      accent: '#B86B4A',
      accentHover: '#A05A3C',
      accentForeground: '#FFFFFF',
      text: '#2E2118',
      textSecondary: '#5C4A3A',
      textMuted: '#9C8777',
      border: '#E8D9C8',
      borderHover: '#DCCAB5',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"DM Sans", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.03em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '4px',
      cardRadius: '8px',
      buttonRadius: '8px',
      width: '2px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(184,107,74,0.06)',
      cardHover: '0 8px 32px rgba(184,107,74,0.1)',
      button: '0 2px 8px rgba(184,107,74,0.2)',
      buttonHover: '0 4px 12px rgba(184,107,74,0.3)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 22px',
    },
    effects: {},
  },

  // 6i. BENTO NIGHT
  {
    id: 'bento-night',
    name: 'Bento Night',
    category: 'Bento',
    description: 'Dark mode zen. Moonlit garden aesthetics with soft contrast.',
    colors: {
      background: '#18181B',
      surface: '#27272A',
      surfaceHover: '#3F3F46',
      accent: '#E4E4E7',
      accentHover: '#FAFAFA',
      accentForeground: '#18181B',
      text: '#FAFAFA',
      textSecondary: '#A1A1AA',
      textMuted: '#71717A',
      border: '#3F3F46',
      borderHover: '#52525B',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 300,
      bodyWeight: 400,
      letterSpacing: '0.02em',
      headingLetterSpacing: '0.05em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '4px',
      cardRadius: '8px',
      buttonRadius: '4px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      cardHover: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'ghost',
      textTransform: 'none',
      fontWeight: 400,
      padding: '10px 20px',
    },
    effects: {},
  },

  // 6j. BENTO LAVENDER
  {
    id: 'bento-lavender',
    name: 'Bento Lavender',
    category: 'Bento',
    description: 'Soft purple serenity. Calming lavender hues for peaceful productivity.',
    colors: {
      background: '#FAF8FF',
      surface: '#FFFFFF',
      surfaceHover: '#F5F0FF',
      accent: '#8B7EC8',
      accentHover: '#7668B5',
      accentForeground: '#FFFFFF',
      text: '#2D2640',
      textSecondary: '#5A4D73',
      textMuted: '#9B8FB8',
      border: '#E5DEF5',
      borderHover: '#D4CAE8',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"DM Sans", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '0.03em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'bento',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '16px',
    },
    borders: {
      radius: '8px',
      cardRadius: '12px',
      buttonRadius: '10px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 24px rgba(139,126,200,0.08)',
      cardHover: '0 8px 32px rgba(139,126,200,0.12)',
      button: '0 2px 8px rgba(139,126,200,0.2)',
      buttonHover: '0 4px 12px rgba(139,126,200,0.3)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 24px',
    },
    effects: {},
  },

  // ============================================
  // 7. RETRO COMPUTING
  // ============================================
  {
    id: 'retro-computing',
    name: 'Retro Computing',
    category: 'Retro',
    description: '1980s computer interfaces. Window chrome, beveled buttons, pixel-perfect nostalgia.',
    colors: {
      background: '#C0C0C0',
      surface: '#C0C0C0',
      surfaceHover: '#D4D4D4',
      accent: '#000080',
      accentHover: '#0000A0',
      accentForeground: '#FFFFFF',
      text: '#000000',
      textSecondary: '#404040',
      textMuted: '#808080',
      border: '#808080',
      borderHover: '#404040',
    },
    typography: {
      fontFamily: '"VT323", "Courier New", monospace',
      headingFont: '"VT323", monospace',
      monoFont: '"VT323", monospace',
      baseFontSize: '16px',
      headingSize: '24px',
      headingWeight: 400,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '0',
      lineHeight: '1.4',
      textTransform: 'none',
    },
    layout: {
      density: 'compact',
      cardStyle: 'retro',
      gridStyle: 'traditional',
      containerPadding: '16px',
      cardPadding: '8px',
      gap: '8px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '2px',
      style: 'solid',
    },
    shadows: {
      card: 'inset -2px -2px 0 #808080, inset 2px 2px 0 #FFFFFF',
      cardHover: 'inset -2px -2px 0 #808080, inset 2px 2px 0 #FFFFFF',
      button: 'inset -2px -2px 0 #808080, inset 2px 2px 0 #FFFFFF',
      buttonHover: 'inset 2px 2px 0 #808080, inset -2px -2px 0 #FFFFFF',
    },
    buttons: {
      style: 'beveled',
      textTransform: 'none',
      fontWeight: 400,
      padding: '6px 16px',
    },
    effects: {},
  },

  // ============================================
  // 8. GLASSMORPHISM AURORA
  // ============================================
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'Modern',
    description: 'Frosted glass over colorful gradients. Translucent surfaces, soft glows, layered depth.',
    colors: {
      background: '#667EEA',
      backgroundGradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
      surface: 'rgba(255, 255, 255, 0.25)',
      surfaceHover: 'rgba(255, 255, 255, 0.35)',
      accent: '#FFFFFF',
      accentHover: '#F0F0F0',
      accentForeground: '#667EEA',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.85)',
      textMuted: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.2)',
      borderHover: 'rgba(255, 255, 255, 0.4)',
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      headingFont: '"Poppins", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '28px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.6',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'glass',
      gridStyle: 'traditional',
      containerPadding: '40px',
      cardPadding: '28px',
      gap: '20px',
    },
    borders: {
      radius: '20px',
      cardRadius: '24px',
      buttonRadius: '12px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 8px 32px rgba(0, 0, 0, 0.15)',
      cardHover: '0 12px 48px rgba(0, 0, 0, 0.2)',
      button: '0 4px 16px rgba(0, 0, 0, 0.1)',
      buttonHover: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '12px 24px',
    },
    effects: {
      blur: '16px',
    },
  },

  // ============================================
  // 9. CORPORATE CLEAN
  // ============================================
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    category: 'Professional',
    description: 'Enterprise software aesthetic. Structured, predictable, professional reliability.',
    colors: {
      background: '#F3F4F6',
      surface: '#FFFFFF',
      surfaceHover: '#F9FAFB',
      accent: '#2563EB',
      accentHover: '#1D4ED8',
      accentForeground: '#FFFFFF',
      text: '#111827',
      textSecondary: '#4B5563',
      textMuted: '#9CA3AF',
      border: '#E5E7EB',
      borderHover: '#D1D5DB',
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '14px',
      headingSize: '24px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'elevated',
      gridStyle: 'traditional',
      containerPadding: '32px',
      cardPadding: '24px',
      gap: '16px',
    },
    borders: {
      radius: '6px',
      cardRadius: '8px',
      buttonRadius: '6px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      cardHover: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      button: '0 1px 2px rgba(0, 0, 0, 0.05)',
      buttonHover: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '10px 16px',
    },
    effects: {},
  },

  // ============================================
  // 10. ORGANIC CURVES
  // ============================================
  {
    id: 'organic-curves',
    name: 'Organic Curves',
    category: 'Playful',
    description: 'Blob-shaped, nature-inspired fluidity. Soft pastels, flowing shapes, gentle aesthetics.',
    colors: {
      background: '#FEF7F0',
      backgroundGradient: 'linear-gradient(180deg, #FEF7F0 0%, #FDF2E9 100%)',
      surface: '#FFFFFF',
      surfaceHover: '#FFF9F5',
      accent: '#F97316',
      accentHover: '#EA580C',
      accentForeground: '#FFFFFF',
      text: '#422006',
      textSecondary: '#78350F',
      textMuted: '#C2410C',
      border: '#FED7AA',
      borderHover: '#FDBA74',
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingFont: '"Outfit", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '16px',
      headingSize: '32px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.6',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'traditional',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '24px',
    },
    borders: {
      radius: '9999px',
      cardRadius: '32px',
      buttonRadius: '9999px',
      width: '0px',
      style: 'none',
    },
    shadows: {
      card: '0 8px 24px rgba(249, 115, 22, 0.1)',
      cardHover: '0 16px 40px rgba(249, 115, 22, 0.15)',
      button: '0 4px 12px rgba(249, 115, 22, 0.2)',
      buttonHover: '0 6px 16px rgba(249, 115, 22, 0.3)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '14px 32px',
    },
    effects: {},
  },

  // ============================================
  // 11. NEWSPRINT
  // ============================================
  {
    id: 'newsprint',
    name: 'Newsprint',
    category: 'Editorial',
    description: 'Classic newspaper layout. Multi-column, serif typography, timeless print aesthetic.',
    colors: {
      background: '#FDF6E3',
      surface: '#FFFCF5',
      surfaceHover: '#FFF9EE',
      accent: '#000000',
      accentHover: '#262626',
      accentForeground: '#FDF6E3',
      text: '#1A1A1A',
      textSecondary: '#4A4A4A',
      textMuted: '#8A8A8A',
      border: '#D4C8B0',
      borderHover: '#C4B8A0',
    },
    typography: {
      fontFamily: '"Libre Baskerville", Georgia, serif',
      headingFont: '"Libre Baskerville", serif',
      monoFont: '"Courier New", monospace',
      baseFontSize: '16px',
      headingSize: '36px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.02em',
      lineHeight: '1.8',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'flat',
      gridStyle: 'masonry',
      containerPadding: '40px',
      cardPadding: '24px',
      gap: '1px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: 'none',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'underline',
      textTransform: 'none',
      fontWeight: 400,
      padding: '4px 0',
    },
    effects: {
      grain: true,
    },
  },

  // ============================================
  // 12. NEON CYBERPUNK
  // ============================================
  {
    id: 'neon-cyberpunk',
    name: 'Neon Cyberpunk',
    category: 'Dark',
    description: 'Blade Runner vibes. Neon glows, dark backgrounds, high-tech low-life aesthetic.',
    colors: {
      background: '#0A0A0F',
      surface: '#12121A',
      surfaceHover: '#1A1A25',
      accent: '#00F0FF',
      accentHover: '#00D4E4',
      accentForeground: '#0A0A0F',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      textMuted: '#606060',
      border: '#00F0FF',
      borderHover: '#FF00FF',
    },
    typography: {
      fontFamily: '"Orbitron", sans-serif',
      headingFont: '"Orbitron", sans-serif',
      monoFont: '"Share Tech Mono", monospace',
      baseFontSize: '14px',
      headingSize: '28px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '0.05em',
      headingLetterSpacing: '0.1em',
      lineHeight: '1.5',
      textTransform: 'uppercase',
    },
    layout: {
      density: 'compact',
      cardStyle: 'bordered',
      gridStyle: 'traditional',
      containerPadding: '24px',
      cardPadding: '20px',
      gap: '16px',
    },
    borders: {
      radius: '0px',
      cardRadius: '4px',
      buttonRadius: '0px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 0 20px rgba(0, 240, 255, 0.3)',
      cardHover: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(255, 0, 255, 0.2)',
      button: '0 0 10px rgba(0, 240, 255, 0.5)',
      buttonHover: '0 0 20px rgba(0, 240, 255, 0.8)',
    },
    buttons: {
      style: 'outline',
      textTransform: 'uppercase',
      fontWeight: 700,
      padding: '12px 24px',
    },
    effects: {
      scanlines: true,
    },
  },

  // ============================================
  // 13. SCANDINAVIAN WARMTH
  // ============================================
  {
    id: 'scandinavian-warmth',
    name: 'Scandinavian Warmth',
    category: 'Cozy',
    description: 'Nordic hygge design. Warm neutrals, natural textures, cozy minimalism.',
    colors: {
      background: '#FAF7F2',
      surface: '#FFFFFF',
      surfaceHover: '#FBF8F3',
      accent: '#C4785C',
      accentHover: '#B56B4F',
      accentForeground: '#FFFFFF',
      text: '#3D2E24',
      textSecondary: '#6B5A4D',
      textMuted: '#A08D7E',
      border: '#E8DED4',
      borderHover: '#D4C6B8',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      headingFont: '"DM Sans", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '16px',
      headingSize: '28px',
      headingWeight: 500,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.7',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'elevated',
      gridStyle: 'traditional',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '24px',
    },
    borders: {
      radius: '12px',
      cardRadius: '16px',
      buttonRadius: '10px',
      width: '0px',
      style: 'none',
    },
    shadows: {
      card: '0 4px 20px rgba(60, 46, 36, 0.06)',
      cardHover: '0 8px 30px rgba(60, 46, 36, 0.1)',
      button: '0 2px 8px rgba(60, 46, 36, 0.1)',
      buttonHover: '0 4px 12px rgba(60, 46, 36, 0.15)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '14px 28px',
    },
    effects: {},
  },

  // ============================================
  // 14. DASHBOARD DENSE
  // ============================================
  {
    id: 'dashboard-dense',
    name: 'Dashboard Dense',
    category: 'Professional',
    description: 'Data-heavy admin panels. Compact, efficient, information-rich interface.',
    colors: {
      background: '#F1F5F9',
      surface: '#FFFFFF',
      surfaceHover: '#F8FAFC',
      accent: '#0EA5E9',
      accentHover: '#0284C7',
      accentForeground: '#FFFFFF',
      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      border: '#E2E8F0',
      borderHover: '#CBD5E1',
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingFont: '"Inter", sans-serif',
      monoFont: '"JetBrains Mono", monospace',
      baseFontSize: '13px',
      headingSize: '18px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.4',
      textTransform: 'none',
    },
    layout: {
      density: 'compact',
      cardStyle: 'bordered',
      gridStyle: 'traditional',
      containerPadding: '16px',
      cardPadding: '16px',
      gap: '12px',
    },
    borders: {
      radius: '4px',
      cardRadius: '6px',
      buttonRadius: '4px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: '0 1px 2px rgba(0, 0, 0, 0.05)',
      cardHover: '0 2px 4px rgba(0, 0, 0, 0.08)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 500,
      padding: '6px 12px',
    },
    effects: {},
  },

  // ============================================
  // 15. ART DECO REVIVAL
  // ============================================
  {
    id: 'art-deco',
    name: 'Art Deco',
    category: 'Elegant',
    description: '1920s geometric luxury. Gold accents, symmetrical patterns, gatsby glamour.',
    colors: {
      background: '#1A1A1A',
      surface: '#242424',
      surfaceHover: '#2E2E2E',
      accent: '#D4AF37',
      accentHover: '#C4A030',
      accentForeground: '#1A1A1A',
      text: '#F5F5F5',
      textSecondary: '#CCCCCC',
      textMuted: '#888888',
      border: '#D4AF37',
      borderHover: '#E5C040',
    },
    typography: {
      fontFamily: '"Josefin Sans", sans-serif',
      headingFont: '"Poiret One", cursive',
      monoFont: 'monospace',
      baseFontSize: '15px',
      headingSize: '36px',
      headingWeight: 400,
      bodyWeight: 300,
      letterSpacing: '0.1em',
      headingLetterSpacing: '0.2em',
      lineHeight: '1.6',
      textTransform: 'uppercase',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'traditional',
      containerPadding: '48px',
      cardPadding: '32px',
      gap: '24px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '2px',
      style: 'double',
    },
    shadows: {
      card: 'none',
      cardHover: '0 0 20px rgba(212, 175, 55, 0.2)',
      button: 'none',
      buttonHover: '0 0 15px rgba(212, 175, 55, 0.3)',
    },
    buttons: {
      style: 'outline',
      textTransform: 'uppercase',
      fontWeight: 400,
      padding: '14px 32px',
    },
    effects: {
      linePattern: true,
    },
  },

  // ============================================
  // 16. PLAYFUL ROUNDED
  // ============================================
  {
    id: 'playful-rounded',
    name: 'Playful Rounded',
    category: 'Playful',
    description: 'Friendly, toy-like design. Bright colors, bouncy typography, child-like joy.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceHover: '#F0F9FF',
      accent: '#3B82F6',
      accentHover: '#2563EB',
      accentForeground: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      border: '#3B82F6',
      borderHover: '#2563EB',
    },
    typography: {
      fontFamily: '"Quicksand", sans-serif',
      headingFont: '"Quicksand", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '16px',
      headingSize: '32px',
      headingWeight: 700,
      bodyWeight: 500,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'spacious',
      cardStyle: 'bordered',
      gridStyle: 'traditional',
      containerPadding: '32px',
      cardPadding: '28px',
      gap: '20px',
    },
    borders: {
      radius: '24px',
      cardRadius: '28px',
      buttonRadius: '9999px',
      width: '3px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 0 #3B82F6',
      cardHover: '0 6px 0 #3B82F6',
      button: '0 4px 0 #1D4ED8',
      buttonHover: '0 2px 0 #1D4ED8',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 700,
      padding: '16px 32px',
    },
    effects: {},
  },

  // ============================================
  // 17. NOTION-ESQUE
  // ============================================
  {
    id: 'notion-esque',
    name: 'Notion-esque',
    category: 'Minimal',
    description: 'Clean productivity tool aesthetic. Hover reveals, inline editing feel, understated.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceHover: '#F7F7F7',
      accent: '#2383E2',
      accentHover: '#1B6EC2',
      accentForeground: '#FFFFFF',
      text: '#37352F',
      textSecondary: '#6B6B6B',
      textMuted: '#B0B0B0',
      border: '#E9E9E7',
      borderHover: '#DFDFDD',
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      headingFont: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      monoFont: '"SFMono-Regular", Consolas, monospace',
      baseFontSize: '15px',
      headingSize: '24px',
      headingWeight: 600,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '-0.01em',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'flat',
      gridStyle: 'list',
      containerPadding: '96px',
      cardPadding: '16px',
      gap: '4px',
    },
    borders: {
      radius: '3px',
      cardRadius: '4px',
      buttonRadius: '4px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: '0 1px 2px rgba(0, 0, 0, 0.04)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'ghost',
      textTransform: 'none',
      fontWeight: 500,
      padding: '6px 12px',
    },
    effects: {},
  },

  // ============================================
  // 18. BRUTALIST RAW
  // ============================================
  {
    id: 'brutalist-raw',
    name: 'Brutalist Raw',
    category: 'Experimental',
    description: 'Intentionally undesigned. Browser defaults, raw HTML energy, anti-aesthetic statement.',
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      surfaceHover: '#F0F0F0',
      accent: '#0000EE',
      accentHover: '#551A8B',
      accentForeground: '#FFFFFF',
      text: '#000000',
      textSecondary: '#333333',
      textMuted: '#666666',
      border: '#000000',
      borderHover: '#000000',
    },
    typography: {
      fontFamily: '"Times New Roman", Times, serif',
      headingFont: '"Times New Roman", Times, serif',
      monoFont: '"Courier New", Courier, monospace',
      baseFontSize: '16px',
      headingSize: '24px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '0',
      headingLetterSpacing: '0',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'compact',
      cardStyle: 'flat',
      gridStyle: 'single-column',
      containerPadding: '20px',
      cardPadding: '10px',
      gap: '16px',
    },
    borders: {
      radius: '0px',
      cardRadius: '0px',
      buttonRadius: '0px',
      width: '1px',
      style: 'solid',
    },
    shadows: {
      card: 'none',
      cardHover: 'none',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'underline',
      textTransform: 'none',
      fontWeight: 400,
      padding: '0',
    },
    effects: {},
  },

  // ============================================
  // 19. Y2K MILLENNIUM
  // ============================================
  {
    id: 'y2k-millennium',
    name: 'Y2K Millennium',
    category: 'Retro',
    description: 'Early 2000s web aesthetic. Chrome effects, bubble shapes, iMac-era optimism.',
    colors: {
      background: '#E8E8E8',
      backgroundGradient: 'linear-gradient(180deg, #F5F5F5 0%, #E0E0E0 100%)',
      surface: '#FFFFFF',
      surfaceHover: '#F8F8F8',
      accent: '#FF6600',
      accentHover: '#E65C00',
      accentForeground: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      textMuted: '#999999',
      border: '#CCCCCC',
      borderHover: '#AAAAAA',
    },
    typography: {
      fontFamily: '"Century Gothic", "Arial Rounded MT Bold", sans-serif',
      headingFont: '"Century Gothic", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '14px',
      headingSize: '28px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '0.02em',
      headingLetterSpacing: '0.05em',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'elevated',
      gridStyle: 'traditional',
      containerPadding: '32px',
      cardPadding: '20px',
      gap: '16px',
    },
    borders: {
      radius: '20px',
      cardRadius: '24px',
      buttonRadius: '20px',
      width: '2px',
      style: 'solid',
    },
    shadows: {
      card: '0 4px 0 #CCCCCC, inset 0 2px 0 rgba(255,255,255,0.8)',
      cardHover: '0 6px 0 #CCCCCC, inset 0 2px 0 rgba(255,255,255,0.9)',
      button: '0 3px 0 #CC5500, inset 0 1px 0 rgba(255,255,255,0.5)',
      buttonHover: '0 1px 0 #CC5500, inset 0 1px 0 rgba(255,255,255,0.5)',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 700,
      padding: '12px 24px',
    },
    effects: {},
  },

  // ============================================
  // 20. DARK MODE PREMIUM
  // ============================================
  {
    id: 'dark-premium',
    name: 'Dark Premium',
    category: 'Dark',
    description: 'Refined dark mode. Layered darks, subtle gradients, Spotify/Discord sophistication.',
    colors: {
      background: '#121212',
      surface: '#181818',
      surfaceHover: '#282828',
      accent: '#1DB954',
      accentHover: '#1ED760',
      accentForeground: '#000000',
      text: '#FFFFFF',
      textSecondary: '#B3B3B3',
      textMuted: '#727272',
      border: '#282828',
      borderHover: '#3E3E3E',
    },
    typography: {
      fontFamily: '"Circular", -apple-system, BlinkMacSystemFont, sans-serif',
      headingFont: '"Circular", sans-serif',
      monoFont: 'monospace',
      baseFontSize: '14px',
      headingSize: '28px',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: '0.01em',
      headingLetterSpacing: '-0.02em',
      lineHeight: '1.5',
      textTransform: 'none',
    },
    layout: {
      density: 'comfortable',
      cardStyle: 'elevated',
      gridStyle: 'traditional',
      containerPadding: '32px',
      cardPadding: '20px',
      gap: '16px',
    },
    borders: {
      radius: '8px',
      cardRadius: '8px',
      buttonRadius: '9999px',
      width: '0px',
      style: 'none',
    },
    shadows: {
      card: '0 8px 24px rgba(0, 0, 0, 0.5)',
      cardHover: '0 12px 32px rgba(0, 0, 0, 0.6)',
      button: 'none',
      buttonHover: 'none',
    },
    buttons: {
      style: 'filled',
      textTransform: 'none',
      fontWeight: 700,
      padding: '14px 32px',
    },
    effects: {},
  },
];

/**
 * Get systems grouped by category
 */
export function getSystemsByCategory(): Record<string, DesignSystem[]> {
  return DESIGN_SYSTEMS.reduce((acc, system) => {
    if (!acc[system.category]) {
      acc[system.category] = [];
    }
    acc[system.category].push(system);
    return acc;
  }, {} as Record<string, DesignSystem[]>);
}

/**
 * Get a system by ID
 */
export function getSystemById(id: string): DesignSystem | undefined {
  return DESIGN_SYSTEMS.find(system => system.id === id);
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(DESIGN_SYSTEMS.map(s => s.category))];
}

// Re-export with old names for compatibility
export const DESIGN_THEMES = DESIGN_SYSTEMS;
export type DesignTheme = DesignSystem;
export const getThemeById = getSystemById;
export const getThemesByCategory = getSystemsByCategory;

/**
 * Generate CSS variables from a design system
 */
export function generateCSSVariables(system: DesignSystem): Record<string, string> {
  return {
    '--ds-bg': system.colors.background,
    '--ds-bg-gradient': system.colors.backgroundGradient || system.colors.background,
    '--ds-surface': system.colors.surface,
    '--ds-surface-hover': system.colors.surfaceHover,
    '--ds-accent': system.colors.accent,
    '--ds-accent-hover': system.colors.accentHover,
    '--ds-accent-fg': system.colors.accentForeground,
    '--ds-text': system.colors.text,
    '--ds-text-secondary': system.colors.textSecondary,
    '--ds-text-muted': system.colors.textMuted,
    '--ds-border': system.colors.border,
    '--ds-border-hover': system.colors.borderHover,
    '--ds-font': system.typography.fontFamily,
    '--ds-font-heading': system.typography.headingFont,
    '--ds-font-mono': system.typography.monoFont,
    '--ds-font-size': system.typography.baseFontSize,
    '--ds-heading-size': system.typography.headingSize,
    '--ds-heading-weight': String(system.typography.headingWeight),
    '--ds-body-weight': String(system.typography.bodyWeight),
    '--ds-letter-spacing': system.typography.letterSpacing,
    '--ds-line-height': system.typography.lineHeight,
    '--ds-radius': system.borders.radius,
    '--ds-card-radius': system.borders.cardRadius,
    '--ds-button-radius': system.borders.buttonRadius,
    '--ds-border-width': system.borders.width,
    '--ds-shadow-card': system.shadows.card,
    '--ds-shadow-card-hover': system.shadows.cardHover,
    '--ds-shadow-button': system.shadows.button,
    '--ds-container-padding': system.layout.containerPadding,
    '--ds-card-padding': system.layout.cardPadding,
    '--ds-gap': system.layout.gap,
  };
}

/**
 * Apply system to a container element
 */
export function applySystemToElement(element: HTMLElement, system: DesignSystem): void {
  const vars = generateCSSVariables(system);
  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}
