/**
 * Content Item Visual Style Presets
 *
 * Defines visual treatments for content items (bullets, list items, etc.)
 * Similar to visual profiles for text over images, this provides categorical
 * styling rather than ad-hoc CSS properties.
 *
 * Each preset is designed for specific use cases and aesthetics.
 */

import { ContentItemVisualPreset, Theme } from '@/types';

/**
 * Style configuration for a content item visual preset.
 * Uses template strings like '{accent}' that get resolved to theme colors.
 */
export interface ContentItemVisualConfig {
  borderRadius: string;
  backgroundColor: string;
  border?: string;
  borderLeft?: string;
  borderBottom?: string;
  boxShadow?: string;
  backdropFilter?: string;
  padding: string;
}

/**
 * Preset definitions with template placeholders.
 * {accent}, {surface}, {border}, {text} get replaced with theme colors.
 */
export const CONTENT_ITEM_VISUAL_CONFIGS: Record<ContentItemVisualPreset, ContentItemVisualConfig> = {
  pill: {
    borderRadius: '9999px',
    backgroundColor: '{accent}20',
    border: '1px solid {accent}30',
    padding: '12px 24px',
  },
  card: {
    borderRadius: '8px',
    backgroundColor: '{surface}',
    border: '1px solid {border}',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '16px 20px',
  },
  sharp: {
    borderRadius: '0',
    backgroundColor: '{accent}12',
    borderLeft: '3px solid {accent}',
    padding: '12px 16px',
  },
  glass: {
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '14px 20px',
  },
  underline: {
    borderRadius: '0',
    backgroundColor: 'transparent',
    borderBottom: '2px solid {accent}',
    padding: '8px 0',
  },
  solid: {
    borderRadius: '4px',
    backgroundColor: '{accent}',
    padding: '14px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  minimal: {
    borderRadius: '0',
    backgroundColor: 'transparent',
    padding: '4px 0',
  },
};

/**
 * Resolve template placeholders in a string with actual theme colors.
 * e.g., '{accent}20' with accent=#3B82F6 becomes '#3B82F620'
 */
function resolveTemplate(template: string, theme: Theme): string {
  if (!template) return template;

  return template
    .replace(/\{accent\}/g, theme.colors.accent)
    .replace(/\{surface\}/g, theme.colors.surface)
    .replace(/\{border\}/g, theme.colors.border)
    .replace(/\{text\}/g, theme.colors.text)
    .replace(/\{secondary\}/g, theme.colors.secondary);
}

/**
 * Resolve a preset config to actual CSS values using the theme.
 */
export function resolveContentItemStyle(
  preset: ContentItemVisualPreset,
  theme: Theme
): React.CSSProperties {
  const config = CONTENT_ITEM_VISUAL_CONFIGS[preset];

  const style: React.CSSProperties = {
    borderRadius: config.borderRadius,
    backgroundColor: resolveTemplate(config.backgroundColor, theme),
    padding: config.padding,
  };

  if (config.border) {
    style.border = resolveTemplate(config.border, theme);
  }
  if (config.borderLeft) {
    style.borderLeft = resolveTemplate(config.borderLeft, theme);
  }
  if (config.borderBottom) {
    style.borderBottom = resolveTemplate(config.borderBottom, theme);
  }
  if (config.boxShadow) {
    style.boxShadow = config.boxShadow;
  }
  if (config.backdropFilter) {
    style.backdropFilter = config.backdropFilter;
    // Webkit prefix for Safari
    (style as any).WebkitBackdropFilter = config.backdropFilter;
  }

  return style;
}

/**
 * Get the effective content item visual preset for a slide.
 * Priority: slide override > theme default > fallback
 */
export function getEffectivePreset(
  slidePreset: ContentItemVisualPreset | undefined,
  themePreset: ContentItemVisualPreset | undefined,
  isStatement: boolean
): ContentItemVisualPreset {
  // 1. Slide-level override (highest priority)
  if (slidePreset) {
    return slidePreset;
  }

  // 2. Theme default
  if (themePreset) {
    return themePreset;
  }

  // 3. Fallback based on layout context
  // Statement layouts look better with pill by default
  return isStatement ? 'pill' : 'minimal';
}

/**
 * Check if a preset has visible container styling.
 * Used to determine if bullets should be hidden (for pill/card styles).
 */
export function presetHasVisibleContainer(preset: ContentItemVisualPreset): boolean {
  return preset !== 'minimal' && preset !== 'underline';
}
