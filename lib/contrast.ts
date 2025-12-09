/**
 * WCAG 2.1 Contrast Utilities
 * Auto-fixes text color if contrast ratio < 3:1
 */

export interface ContrastConfig {
    bg: string;
    text: string;
    accent: string;
    secondary: string;
    border: string;
    mode: string;
}

/**
 * Convert hex color to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
    // Handle shorthand hex (#fff -> #ffffff)
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
    }

    const num = parseInt(cleanHex, 16);
    return [
        (num >> 16) & 255,
        (num >> 8) & 255,
        num & 255
    ];
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb.map(c => {
        const sRGB = c / 255;
        return sRGB <= 0.03928
            ? sRGB / 12.92
            : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 (no contrast) and 21 (max contrast)
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 * WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export function getContrastRatio(fg: string, bg: string): number {
    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get safe text color - auto-fix if contrast < 3:1
 * Uses 3:1 as threshold (WCAG AA for large text)
 */
export function getSafeTextColor(textColor: string, bgColor: string): string {
    // Handle rgba/transparent values by returning original
    if (!textColor || !bgColor || textColor.includes('rgba') || bgColor.includes('rgba')) {
        return textColor;
    }

    try {
        const ratio = getContrastRatio(textColor, bgColor);
        if (ratio >= 3) return textColor;  // Already readable

        // Determine if we need light or dark text based on background luminance
        const bgLuminance = getLuminance(bgColor);
        return bgLuminance > 0.5 ? '#000000' : '#ffffff';
    } catch {
        // If parsing fails, return original color
        return textColor;
    }
}

/**
 * Validate and fix contrast object
 * Ensures text and secondary colors are readable against background
 */
export function ensureContrast(contrast: ContrastConfig): ContrastConfig {
    return {
        ...contrast,
        text: getSafeTextColor(contrast.text, contrast.bg),
        secondary: getSafeTextColor(contrast.secondary || contrast.text, contrast.bg),
    };
}

/**
 * Check if a color combination meets WCAG AA standards
 */
export function meetsWCAGAA(fg: string, bg: string, isLargeText: boolean = false): boolean {
    const ratio = getContrastRatio(fg, bg);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if a color combination meets WCAG AAA standards
 */
export function meetsWCAGAAA(fg: string, bg: string, isLargeText: boolean = false): boolean {
    const ratio = getContrastRatio(fg, bg);
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
}
