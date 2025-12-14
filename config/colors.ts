/**
 * Color Constants
 *
 * Single source of truth for all color values used across the application.
 * These complement the STUDIO_NOIR design tokens in lib/designTokens.ts.
 *
 * Updated for Clean & Minimal design with softer, warmer tones.
 */

// Brand Colors
export const COLORS = {
  // Primary brand color (gold)
  brand: '#c5a47e',
  brandHover: '#d4b68e',
  brandLight: 'rgba(197, 164, 126, 0.5)',
  brandSubtle: 'rgba(197, 164, 126, 0.2)',
  brandMuted: 'rgba(197, 164, 126, 0.1)',

  // Surfaces - Softened for less harsh contrast
  surface: {
    primary: '#0d0d0d',      // Softened from pure black
    secondary: '#171717',    // Warmer dark gray
    tertiary: '#1f1f1f',     // More visible surface
    elevated: '#141414',     // Card backgrounds
    card: '#1a1a1a',         // Card surfaces
    hover: '#242424',        // Hover state backgrounds
  },

  // Borders - Warmer tones
  border: {
    default: 'rgba(255, 255, 255, 0.08)',   // Subtler base borders
    hover: 'rgba(197, 164, 126, 0.3)',      // Warm hover states
    active: 'rgba(197, 164, 126, 0.5)',     // Active borders
    brand: 'rgba(197, 164, 126, 0.4)',
    brandStrong: '#c5a47e',
    subtle: 'rgba(255, 255, 255, 0.05)',    // Very subtle dividers
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.65)',  // Slightly brighter for readability
    tertiary: 'rgba(255, 255, 255, 0.45)',
    muted: 'rgba(255, 255, 255, 0.25)',
    brand: '#c5a47e',
    onBrand: '#000000',
  },

  // State colors
  state: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.04)',
    medium: 'rgba(255, 255, 255, 0.08)',
    dark: 'rgba(0, 0, 0, 0.4)',
    darker: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.85)',
  },

  // Interaction states
  interaction: {
    hoverLift: '0 8px 24px rgba(0, 0, 0, 0.3)',
    focusRing: '0 0 0 2px rgba(197, 164, 126, 0.5)',
  },
} as const;

// Tailwind class mappings for common color patterns
// Updated for Clean & Minimal design
export const COLOR_CLASSES = {
  // Background - Softened surfaces
  bgPrimary: 'bg-[#0d0d0d]',
  bgSecondary: 'bg-[#171717]',
  bgTertiary: 'bg-[#1f1f1f]',
  bgCard: 'bg-[#1a1a1a]',
  bgElevated: 'bg-[#141414]',
  bgBrand: 'bg-[#c5a47e]',
  bgWhite: 'bg-white',
  bgOverlay: 'bg-white/4',

  // Text - Better contrast hierarchy
  textPrimary: 'text-white',
  textSecondary: 'text-white/65',
  textTertiary: 'text-white/45',
  textMuted: 'text-white/25',
  textBrand: 'text-[#c5a47e]',
  textOnBrand: 'text-black',

  // Border - Warmer tones
  borderDefault: 'border-white/8',
  borderSubtle: 'border-white/5',
  borderHover: 'border-[#c5a47e]/30',
  borderActive: 'border-[#c5a47e]/50',
  borderBrand: 'border-[#c5a47e]/40',
  borderBrandStrong: 'border-[#c5a47e]',

  // Hover states - Enhanced feedback
  hoverBgSubtle: 'hover:bg-white/4',
  hoverBgOverlay: 'hover:bg-[#242424]',
  hoverBgBrand: 'hover:bg-[#c5a47e]',
  hoverBgWhite: 'hover:bg-white',
  hoverTextBrand: 'hover:text-[#c5a47e]',
  hoverTextWhite: 'hover:text-white',
  hoverBorderBrand: 'hover:border-[#c5a47e]/40',

  // Focus states
  focusBrand: 'focus:border-[#c5a47e]',
  focusRingBrand: 'focus-visible:ring-2 focus-visible:ring-[#c5a47e]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]',

  // Transition utilities
  transitionBase: 'transition-all duration-200 ease-out',
  transitionFast: 'transition-all duration-150 ease-out',
} as const;

export type Colors = typeof COLORS;
export type ColorClasses = typeof COLOR_CLASSES;
