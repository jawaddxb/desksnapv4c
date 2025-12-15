/**
 * Content Item Visual Style Presets
 *
 * Single source of truth for content item container styling.
 * Each preset defines complete visual treatment.
 */

import type { ContentItemVisualPreset, Theme } from '@/types';

/**
 * Preset configuration with all styling properties.
 */
interface PresetConfig {
  showBullet: boolean;  // Whether to show bullet marker (fixes O/C principle)
  getStyle: (theme: Theme) => React.CSSProperties;
}

/**
 * Preset definitions - each is self-contained with all styling logic.
 */
const PRESETS: Record<ContentItemVisualPreset, PresetConfig> = {
  pill: {
    showBullet: false,
    getStyle: (theme) => ({
      borderRadius: '9999px',
      backgroundColor: `${theme.colors.accent}20`,
      border: `1px solid ${theme.colors.accent}30`,
      padding: '12px 24px',
    }),
  },

  card: {
    showBullet: false,
    getStyle: (theme) => ({
      borderRadius: '8px',
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      padding: '16px 20px',
    }),
  },

  sharp: {
    showBullet: false,
    getStyle: (theme) => ({
      borderRadius: '0',
      backgroundColor: `${theme.colors.accent}12`,
      borderLeft: `3px solid ${theme.colors.accent}`,
      padding: '12px 16px',
    }),
  },

  glass: {
    showBullet: false,
    getStyle: () => ({
      borderRadius: '12px',
      backgroundColor: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.15)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      padding: '14px 20px',
    }),
  },

  underline: {
    showBullet: true,  // Underline shows bullets
    getStyle: (theme) => ({
      borderRadius: '0',
      backgroundColor: 'transparent',
      borderBottom: `2px solid ${theme.colors.accent}`,
      padding: '8px 0',
    }),
  },

  solid: {
    showBullet: false,
    getStyle: (theme) => ({
      borderRadius: '4px',
      backgroundColor: theme.colors.accent,
      padding: '14px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }),
  },

  minimal: {
    showBullet: true,  // Minimal shows bullets
    getStyle: () => ({
      borderRadius: '0',
      backgroundColor: 'transparent',
      padding: '4px 0',
    }),
  },
};

/**
 * Get CSS styles for a preset.
 */
export function getPresetStyle(
  preset: ContentItemVisualPreset,
  theme: Theme
): React.CSSProperties {
  return PRESETS[preset].getStyle(theme);
}

/**
 * Check if preset shows bullet markers.
 */
export function presetShowsBullet(preset: ContentItemVisualPreset): boolean {
  return PRESETS[preset].showBullet;
}

/**
 * Get effective preset with fallback logic.
 * Priority: slide override > theme contentStyle > layout-based default
 */
export function getEffectivePreset(
  slidePreset: ContentItemVisualPreset | undefined,
  themeContentStyle: { visualPreset?: ContentItemVisualPreset } | undefined,
  isStatement: boolean
): ContentItemVisualPreset {
  // Slide override
  if (slidePreset) return slidePreset;

  // Theme content style
  if (themeContentStyle?.visualPreset) return themeContentStyle.visualPreset;

  // Layout-based default
  return isStatement ? 'pill' : 'minimal';
}
