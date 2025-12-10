/**
 * Theme Registry
 *
 * Central export point for all themes.
 * Combines theme categories into a single THEMES object.
 */

import { Theme } from '../../types';
import {
  SYSTEM_THEME,
  coreThemes,
  businessThemes,
  luxuryThemes,
  natureThemes,
  retroThemes,
  artisticThemes,
} from './definitions';

// Re-export system theme
export { SYSTEM_THEME } from './definitions';

// Re-export factory
export { createTheme, createThemes } from './factory';
export type { ThemeConfig } from './factory';

/**
 * All themes merged into a single record.
 */
export const THEMES: Record<string, Theme> = {
  ...coreThemes,
  ...businessThemes,
  ...luxuryThemes,
  ...natureThemes,
  ...retroThemes,
  ...artisticThemes,
};

/**
 * Theme category exports for filtering/grouping.
 */
export const THEME_CATEGORIES = {
  core: coreThemes,
  business: businessThemes,
  luxury: luxuryThemes,
  nature: natureThemes,
  retro: retroThemes,
  artistic: artisticThemes,
} as const;

/**
 * Get a theme by ID with fallback to neoBrutalist.
 */
export function getThemeById(id: string): Theme {
  return THEMES[id] ?? THEMES.neoBrutalist;
}

/**
 * Get all theme IDs.
 */
export function getThemeIds(): string[] {
  return Object.keys(THEMES);
}

/**
 * Get themes by category.
 */
export function getThemesByCategory(category: keyof typeof THEME_CATEGORIES): Theme[] {
  return Object.values(THEME_CATEGORIES[category]);
}
