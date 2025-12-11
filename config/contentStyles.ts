import type { ThemeContentStyle } from '../types';

/**
 * Content style presets for theme-driven bullet variety.
 * Each theme can reference a preset or define custom styling.
 */
export const CONTENT_STYLE_PRESETS = {
  // Minimal: Small dots, clean spacing
  minimal: {
    bulletStyle: 'dot',
    bulletSize: 6,
    bulletColor: 'secondary',
    itemSpacing: 12,
  } satisfies ThemeContentStyle,

  // Modern: Dashes with left accent border
  modern: {
    bulletStyle: 'dash',
    bulletSize: 12,
    bulletColor: 'accent',
    itemSpacing: 16,
    leftAccentBorder: true,
    leftBorderWidth: 2,
  } satisfies ThemeContentStyle,

  // Numbered: Auto-numbered list style
  numbered: {
    bulletStyle: 'number',
    bulletColor: 'accent',
    itemSpacing: 16,
    numberedSuffix: '.',
  } satisfies ThemeContentStyle,

  // Statement: Pill-shaped backgrounds (current behavior, refined)
  statement: {
    bulletStyle: 'none',
    itemBackground: 'accent',
    itemPadding: '12px 24px',
    itemBorderRadius: 'full',
    itemSpacing: 8,
  } satisfies ThemeContentStyle,

  // Elegant: Diamond markers with generous spacing
  elegant: {
    bulletStyle: 'diamond',
    bulletSize: 8,
    bulletColor: 'accent',
    itemSpacing: 20,
  } satisfies ThemeContentStyle,

  // Technical: Square markers, compact
  technical: {
    bulletStyle: 'square',
    bulletSize: 8,
    bulletColor: 'text',
    itemSpacing: 12,
  } satisfies ThemeContentStyle,

  // Checklist: Checkmark markers
  checklist: {
    bulletStyle: 'check',
    bulletSize: 14,
    bulletColor: 'accent',
    itemSpacing: 12,
  } satisfies ThemeContentStyle,

  // Arrow: Arrow/chevron markers
  arrow: {
    bulletStyle: 'arrow',
    bulletSize: 10,
    bulletColor: 'accent',
    itemSpacing: 14,
  } satisfies ThemeContentStyle,

  // Circle: Outlined circles
  circle: {
    bulletStyle: 'circle',
    bulletSize: 10,
    bulletColor: 'accent',
    itemSpacing: 14,
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
