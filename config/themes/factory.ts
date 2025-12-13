/**
 * Theme Factory
 *
 * Helper functions for creating themes with sensible defaults.
 * Reduces boilerplate and ensures consistency.
 */

import { Theme } from '@/types';

/**
 * Theme configuration with optional fields that have defaults.
 */
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
  };
  colors: {
    background: string;
    surface?: string;
    text: string;
    accent: string;
    border?: string;
    secondary?: string;
    backgroundPattern?: string;
  };
  layout?: {
    radius?: string;
    borderWidth?: string;
    shadow?: string;
    headingTransform?: string;
    headingWeight?: string;
  };
  imageStyle: string;
}

/**
 * Default layout values.
 */
const DEFAULT_LAYOUT = {
  radius: '8px',
  borderWidth: '1px',
  shadow: 'none',
  headingTransform: 'none',
  headingWeight: '600',
};

/**
 * Create a theme with sensible defaults.
 */
export function createTheme(config: ThemeConfig): Theme {
  const { colors, layout = {} } = config;

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    fonts: config.fonts,
    colors: {
      background: colors.background,
      surface: colors.surface ?? colors.background,
      text: colors.text,
      accent: colors.accent,
      border: colors.border ?? colors.text,
      secondary: colors.secondary ?? colors.text,
      backgroundPattern: colors.backgroundPattern,
    },
    layout: {
      radius: layout.radius ?? DEFAULT_LAYOUT.radius,
      borderWidth: layout.borderWidth ?? DEFAULT_LAYOUT.borderWidth,
      shadow: layout.shadow ?? DEFAULT_LAYOUT.shadow,
      headingTransform: layout.headingTransform ?? DEFAULT_LAYOUT.headingTransform,
      headingWeight: layout.headingWeight ?? DEFAULT_LAYOUT.headingWeight,
    },
    imageStyle: config.imageStyle,
  };
}

/**
 * Create multiple themes at once.
 */
export function createThemes(configs: ThemeConfig[]): Record<string, Theme> {
  const themes: Record<string, Theme> = {};
  for (const config of configs) {
    themes[config.id] = createTheme(config);
  }
  return themes;
}
