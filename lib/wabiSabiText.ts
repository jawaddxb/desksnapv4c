/**
 * WabiSabi Unified Text Engine
 *
 * Philosophy: Headlines are IMPACTFUL first. Container space is secondary.
 * If text doesn't fit, it overflows gracefully - user edits shorter.
 *
 * This is the single source of truth for all WabiSabi text behavior.
 */

export type TextRole = 'headline' | 'subhead' | 'body' | 'caption';

export interface TextRoleConfig {
    minFontSize: number;        // Floor - never shrink below this
    maxFontSize: number;        // Ceiling - start binary search here
    minContainerHeight: number; // Guarantee this vertical space
    minContainerWidth: number;  // Guarantee this horizontal space
    lineHeight: number;         // For consistent spacing
    overflow: 'visible' | 'hidden' | 'clip';
}

/**
 * Role-based text configuration
 *
 * Headlines: Large floor (64px), visible overflow - IMPACT over fitting
 * Subhead: Medium floor (40px), visible overflow
 * Body: Lower floor (16px), can shrink more but guaranteed minimum space
 * Caption: Smallest floor (12px), hidden overflow
 */
export const WABI_SABI_TEXT: Record<TextRole, TextRoleConfig> = {
    headline: {
        minFontSize: 64,         // Large floor - headlines stay impactful
        maxFontSize: 200,        // Can be huge if space allows
        minContainerHeight: 80,  // Guarantees headline visibility
        minContainerWidth: 200,
        lineHeight: 1.0,
        overflow: 'visible'      // Never hide headline text
    },
    subhead: {
        minFontSize: 40,
        maxFontSize: 100,
        minContainerHeight: 60,
        minContainerWidth: 150,
        lineHeight: 1.1,
        overflow: 'visible'
    },
    body: {
        minFontSize: 16,         // Body CAN shrink more
        maxFontSize: 36,
        minContainerHeight: 30,  // But guaranteed to show
        minContainerWidth: 100,
        lineHeight: 1.4,
        overflow: 'hidden'
    },
    caption: {
        minFontSize: 12,
        maxFontSize: 24,
        minContainerHeight: 20,
        minContainerWidth: 80,
        lineHeight: 1.3,
        overflow: 'hidden'
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
 * Allows archetypes to customize while maintaining safety floors:
 * - Headlines never go below 48px even with overrides
 * - Other roles never go below 12px
 */
export function getTextConfigWithOverrides(
    role: TextRole,
    overrides?: Partial<TextRoleConfig>
): TextRoleConfig {
    const base = WABI_SABI_TEXT[role];

    // Safety floors based on role
    const safetyFloor = role === 'headline' ? 48 : role === 'subhead' ? 32 : 12;

    return {
        ...base,
        minFontSize: Math.max(overrides?.minFontSize ?? base.minFontSize, safetyFloor),
        maxFontSize: overrides?.maxFontSize ?? base.maxFontSize,
        minContainerHeight: overrides?.minContainerHeight ?? base.minContainerHeight,
        minContainerWidth: overrides?.minContainerWidth ?? base.minContainerWidth,
        lineHeight: overrides?.lineHeight ?? base.lineHeight,
        overflow: overrides?.overflow ?? base.overflow,
    };
}
