/**
 * Standardized text size presets
 * Provides consistent min/max font sizes across all layouts
 * Can be overridden per-archetype for artistic intent
 */

import { FontScale } from '@/types';

export const TEXT_PRESETS = {
    // Standard layouts (SlideContentEditor)
    title: { maxFontSize: 200, minFontSize: 32 },
    body: { maxFontSize: 48, minFontSize: 18 },
    caption: { maxFontSize: 24, minFontSize: 14 },

    // Artistic layouts (WabiSabi) - high minimums to maintain VISUAL IMPACT
    artisticTitle: { maxFontSize: 160, minFontSize: 48 },
    artisticBody: { maxFontSize: 36, minFontSize: 16 },

    // Special case archetypes that need different constraints
    receipt: { maxFontSize: 32, minFontSize: 12 },      // Intentionally small for receipt aesthetic
    schematic: { maxFontSize: 48, minFontSize: 12 },    // Technical drawing style
    cyberDeck: { maxFontSize: 80, minFontSize: 16 },    // Terminal/HUD style
} as const;

export type PresetName = keyof typeof TEXT_PRESETS;

/**
 * Get preset values by name
 */
export function getPreset(name: PresetName) {
    return TEXT_PRESETS[name];
}

/**
 * Get preset with optional overrides
 */
export function getPresetWithOverrides(
    name: PresetName,
    overrides?: { maxFontSize?: number; minFontSize?: number }
) {
    const preset = TEXT_PRESETS[name];
    return {
        maxFontSize: overrides?.maxFontSize ?? preset.maxFontSize,
        minFontSize: overrides?.minFontSize ?? preset.minFontSize,
    };
}

/** Multipliers for fontScale presets */
export const FONT_SCALE_MULTIPLIERS: Record<FontScale, number> = {
    compact: 0.8,   // 80% - denser text
    auto: 1.0,      // 100% - baseline
    hero: 1.3,      // 130% - impactful headlines
    classic: 1.0,   // 100% - same as auto
    modern: 1.1,    // 110% - slightly larger
};

/** Apply fontScale multiplier to a base font size with bounds */
export function applyFontScale(
    baseSize: number,
    fontScale: FontScale | undefined,
    min = 12,
    max = 200
): number {
    const multiplier = FONT_SCALE_MULTIPLIERS[fontScale || 'auto'];
    return Math.round(Math.max(min, Math.min(max, baseSize * multiplier)));
}
