/**
 * Standardized text size presets
 * Provides consistent min/max font sizes across all layouts
 * Can be overridden per-archetype for artistic intent
 */

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
