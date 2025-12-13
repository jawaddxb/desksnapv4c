/**
 * Archetype Contrast Configuration
 *
 * Uses config/archetypeRegistry.ts for base custom contrast definitions.
 * This file handles special cases like conditional contrasts that depend on theme.
 */

import { Theme } from '@/types';
import { ContrastConfig } from './contrast';
import { getArchetypeCustomContrast } from '../config/archetypeRegistry';

// Re-export for convenience
export type { ContrastConfig } from './contrast';

// =============================================================================
// CONDITIONAL CONTRAST HANDLERS
// Special cases that depend on runtime theme values
// =============================================================================

/**
 * Conditional contrast handlers for archetypes with theme-dependent contrast
 */
const CONDITIONAL_CONTRASTS: Record<
  string,
  (theme: Theme) => ContrastConfig | null
> = {
  Schematic: (theme) => {
    if (theme.colors.background === '#ffffff') {
      return {
        bg: '#f0f9ff',
        text: '#0033cc',
        accent: theme.colors.accent,
        secondary: theme.colors.secondary,
        border: theme.colors.border,
        mode: 'blueprint',
      };
    }
    return null; // Use default theme colors
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the contrast configuration for an archetype
 * Returns custom contrast if defined, otherwise uses theme colors
 */
export const getArchetypeContrast = (
  archetype: string,
  theme: Theme
): ContrastConfig => {
  // Check for static custom contrast from registry
  const customContrast = getArchetypeCustomContrast(archetype);
  if (customContrast) {
    return customContrast;
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
    mode: 'theme',
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
