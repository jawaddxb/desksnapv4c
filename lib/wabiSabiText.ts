/**
 * WabiSabi Content-First Text Engine
 *
 * Philosophy: Text renders at a preferred size, container expands to fit.
 * No shrinking, no clipping, no complex measurement.
 *
 * This is the single source of truth for text sizing in WabiSabi layouts.
 */

export type TextRole = 'headline' | 'subhead' | 'body' | 'caption';

export interface TextRoleConfig {
    preferredFontSize: number;  // Render text at this size
    lineHeight: number;         // Line height multiplier
}

/**
 * Role-based text configuration
 *
 * Each role has a preferred size that produces readable, impactful text.
 * Containers expand to fit, rather than text shrinking to fit containers.
 */
export const WABI_SABI_TEXT: Record<TextRole, TextRoleConfig> = {
    headline: {
        preferredFontSize: 64,   // Large, impactful headlines
        lineHeight: 0.95,        // Tight for impact
    },
    subhead: {
        preferredFontSize: 36,   // Secondary headlines
        lineHeight: 1.1,
    },
    body: {
        preferredFontSize: 18,   // Readable body text
        lineHeight: 1.4,         // Comfortable reading
    },
    caption: {
        preferredFontSize: 14,   // Small supporting text
        lineHeight: 1.3,
    }
};

/**
 * Get config for a text role
 */
export function getTextConfig(role: TextRole): TextRoleConfig {
    return WABI_SABI_TEXT[role];
}

/**
 * Get config with optional overrides
 *
 * Allows archetypes to customize sizing while maintaining consistency.
 */
export function getTextConfigWithOverrides(
    role: TextRole,
    overrides?: Partial<TextRoleConfig>
): TextRoleConfig {
    const base = WABI_SABI_TEXT[role];

    return {
        ...base,
        preferredFontSize: overrides?.preferredFontSize ?? base.preferredFontSize,
        lineHeight: overrides?.lineHeight ?? base.lineHeight,
    };
}
