import type { ThemeContentStyle } from '@/types';

/**
 * Content style presets for theme-driven variety.
 * Combines bullet styling with container visual presets.
 */
export const CONTENT_STYLE_PRESETS = {
  // Minimal: Small dots, clean spacing, no container
  minimal: {
    bulletStyle: 'dot',
    bulletSize: 6,
    bulletColor: 'secondary',
    itemSpacing: 12,
    visualPreset: 'minimal',
  } satisfies ThemeContentStyle,

  // Modern: Sharp left-accent containers
  modern: {
    bulletStyle: 'none',
    itemSpacing: 16,
    visualPreset: 'sharp',
  } satisfies ThemeContentStyle,

  // Numbered: Auto-numbered list style
  numbered: {
    bulletStyle: 'number',
    bulletColor: 'accent',
    itemSpacing: 16,
    numberedSuffix: '.',
    visualPreset: 'minimal',
  } satisfies ThemeContentStyle,

  // Statement: Pill-shaped containers
  statement: {
    bulletStyle: 'none',
    itemSpacing: 8,
    visualPreset: 'pill',
  } satisfies ThemeContentStyle,

  // Card: Elevated card containers
  card: {
    bulletStyle: 'none',
    itemSpacing: 12,
    visualPreset: 'card',
  } satisfies ThemeContentStyle,

  // Glass: Modern glass morphism
  glass: {
    bulletStyle: 'none',
    itemSpacing: 12,
    visualPreset: 'glass',
  } satisfies ThemeContentStyle,

  // Elegant: Diamond markers with underline
  elegant: {
    bulletStyle: 'diamond',
    bulletSize: 8,
    bulletColor: 'accent',
    itemSpacing: 20,
    visualPreset: 'underline',
  } satisfies ThemeContentStyle,

  // Technical: Square markers, compact
  technical: {
    bulletStyle: 'square',
    bulletSize: 8,
    bulletColor: 'text',
    itemSpacing: 12,
    visualPreset: 'minimal',
  } satisfies ThemeContentStyle,

  // Checklist: Checkmark markers
  checklist: {
    bulletStyle: 'check',
    bulletSize: 14,
    bulletColor: 'accent',
    itemSpacing: 12,
    visualPreset: 'minimal',
  } satisfies ThemeContentStyle,

  // Arrow: Arrow/chevron markers
  arrow: {
    bulletStyle: 'arrow',
    bulletSize: 10,
    bulletColor: 'accent',
    itemSpacing: 14,
    visualPreset: 'minimal',
  } satisfies ThemeContentStyle,
} as const;

/**
 * Default content style used when theme doesn't specify one.
 */
export const DEFAULT_CONTENT_STYLE: ThemeContentStyle = {
  bulletStyle: 'dot',
  bulletSize: 8,
  bulletColor: 'accent',
  itemSpacing: 12,
};

export type ContentStylePresetKey = keyof typeof CONTENT_STYLE_PRESETS;
