/**
 * WabiSabi Unified Text Engine
 *
 * Philosophy: Headlines are IMPACTFUL first. Container space is secondary.
 * If text doesn't fit, it overflows gracefully - user edits shorter.
 *
 * This is the single source of truth for all WabiSabi text behavior.
 */

export type TextRole = 'headline' | 'subhead' | 'body' | 'caption';

export type FitStrategy = 'fit-both' | 'width-only' | 'height-only';

export interface TextRoleConfig {
    minFontSize: number;        // Floor - never shrink below this
    maxFontSize: number;        // Ceiling - start binary search here
    minContainerHeight: number; // Guarantee this vertical space
    minContainerWidth: number;  // Guarantee this horizontal space
    lineHeight: number;         // For consistent spacing
    overflow: 'visible' | 'hidden' | 'clip';
    fitStrategy: FitStrategy;   // How binary search constrains: width-only ignores height
}

/**
 * Role-based text configuration
 *
 * All roles use fit-both strategy with tuned min/max values:
 * - Headlines: 48-100px (impactful but readable)
 * - Subhead: 32-72px
 * - Body: 16-32px
 * - Caption: 12-24px
 */
export const WABI_SABI_TEXT: Record<TextRole, TextRoleConfig> = {
    headline: {
        minFontSize: 48,          // Impact floor - won't shrink below this
        maxFontSize: 100,         // Reasonable ceiling - readable even at max
        minContainerHeight: 80,
        minContainerWidth: 200,
        lineHeight: 0.95,         // Tighter for impact
        overflow: 'visible',      // Edge cases overflow gracefully
        fitStrategy: 'fit-both'   // Balanced scaling
    },
    subhead: {
        minFontSize: 32,
        maxFontSize: 72,
        minContainerHeight: 50,
        minContainerWidth: 150,
        lineHeight: 1.1,
        overflow: 'visible',
        fitStrategy: 'fit-both'
    },
    body: {
        minFontSize: 16,
        maxFontSize: 32,
        minContainerHeight: 35,
        minContainerWidth: 100,
        lineHeight: 1.4,
        overflow: 'visible',      // Never clip body text
        fitStrategy: 'fit-both'
    },
    caption: {
        minFontSize: 12,
        maxFontSize: 24,
        minContainerHeight: 20,
        minContainerWidth: 80,
        lineHeight: 1.3,
        overflow: 'visible',
        fitStrategy: 'fit-both'
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
        fitStrategy: overrides?.fitStrategy ?? base.fitStrategy,
    };
}
