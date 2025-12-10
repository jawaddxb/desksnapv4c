import { Theme } from '../types';

export interface ContrastConfig {
  bg: string;
  text: string;
  accent: string;
  secondary: string;
  border: string;
  mode: string;
}

// Archetypes with custom contrast configurations
// Most archetypes use theme defaults - only overrides are listed here
const CUSTOM_CONTRASTS: Record<string, ContrastConfig> = {
  CyberDeck: {
    bg: '#050505',
    text: '#22d3ee',
    accent: '#22d3ee',
    secondary: '#22d3ee',
    border: '#164e63',
    mode: 'terminal'
  },
  Receipt: {
    bg: '#ffffff',
    text: '#18181b',
    accent: '#000000',
    secondary: '#18181b',
    border: '#e4e4e7',
    mode: 'paper'
  },
};

// Special case handlers for archetypes with conditional contrast
const CONDITIONAL_CONTRASTS: Record<string, (theme: Theme) => ContrastConfig | null> = {
  Schematic: (theme) => {
    if (theme.colors.background === '#ffffff') {
      return {
        bg: '#f0f9ff',
        text: '#0033cc',
        accent: theme.colors.accent,
        secondary: theme.colors.secondary,
        border: theme.colors.border,
        mode: 'blueprint'
      };
    }
    return null; // Use default theme colors
  },
};

/**
 * Get the contrast configuration for an archetype
 * Returns custom contrast if defined, otherwise uses theme colors
 */
export const getArchetypeContrast = (archetype: string, theme: Theme): ContrastConfig => {
  // Check for static custom contrast
  if (CUSTOM_CONTRASTS[archetype]) {
    return CUSTOM_CONTRASTS[archetype];
  }

  // Check for conditional contrast
  if (CONDITIONAL_CONTRASTS[archetype]) {
    const conditional = CONDITIONAL_CONTRASTS[archetype](theme);
    if (conditional) return conditional;
  }

  // Default: use theme colors
  return {
    bg: theme.colors.surface,
    text: theme.colors.text,
    accent: theme.colors.accent,
    secondary: theme.colors.secondary,
    border: theme.colors.border,
    mode: 'theme'
  };
};

/**
 * Apply typographic inversion for archetypes that support it
 */
export const applyTypographicInversion = (
  contrast: ContrastConfig,
  archetype: string,
  layoutVariant: string | number | undefined
): ContrastConfig => {
  if (archetype === 'Typographic' && layoutVariant === 'inverted') {
    return {
      ...contrast,
      bg: contrast.text,
      text: contrast.bg,
    };
  }
  return contrast;
};
