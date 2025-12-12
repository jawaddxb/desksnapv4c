/**
 * Color Constants
 *
 * Single source of truth for all color values used across the application.
 * These complement the STUDIO_NOIR design tokens in lib/designTokens.ts.
 */

// Brand Colors
export const COLORS = {
  // Primary brand color (gold)
  brand: '#c5a47e',
  brandHover: '#d4b68e',
  brandLight: 'rgba(197, 164, 126, 0.5)',
  brandSubtle: 'rgba(197, 164, 126, 0.2)',
  brandMuted: 'rgba(197, 164, 126, 0.1)',

  // Surfaces
  surface: {
    primary: '#000000',
    secondary: '#111111',
    tertiary: '#1a1a1a',
    elevated: '#0a0a0a',
  },

  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.1)',
    hover: 'rgba(255, 255, 255, 0.2)',
    active: 'rgba(255, 255, 255, 0.4)',
    brand: 'rgba(197, 164, 126, 0.5)',
    brandStrong: '#c5a47e',
  },

  // Text
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.6)',
    tertiary: 'rgba(255, 255, 255, 0.4)',
    muted: 'rgba(255, 255, 255, 0.2)',
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
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.4)',
    darker: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
} as const;

// Tailwind class mappings for common color patterns
export const COLOR_CLASSES = {
  // Background
  bgPrimary: 'bg-black',
  bgSecondary: 'bg-[#111111]',
  bgTertiary: 'bg-[#1a1a1a]',
  bgBrand: 'bg-[#c5a47e]',
  bgWhite: 'bg-white',
  bgOverlay: 'bg-white/5',

  // Text
  textPrimary: 'text-white',
  textSecondary: 'text-white/60',
  textTertiary: 'text-white/40',
  textBrand: 'text-[#c5a47e]',
  textOnBrand: 'text-black',

  // Border
  borderDefault: 'border-white/10',
  borderHover: 'border-white/20',
  borderActive: 'border-white/40',
  borderBrand: 'border-[#c5a47e]/50',
  borderBrandStrong: 'border-[#c5a47e]',

  // Hover states
  hoverBgOverlay: 'hover:bg-white/5',
  hoverBgBrand: 'hover:bg-[#c5a47e]',
  hoverBgWhite: 'hover:bg-white',
  hoverTextBrand: 'hover:text-[#c5a47e]',
  hoverTextWhite: 'hover:text-white',
  hoverBorderBrand: 'hover:border-[#c5a47e]/50',

  // Focus states
  focusBrand: 'focus:border-[#c5a47e]',
  focusRingBrand: 'focus:ring-[#c5a47e]',
} as const;

export type Colors = typeof COLORS;
export type ColorClasses = typeof COLOR_CLASSES;
