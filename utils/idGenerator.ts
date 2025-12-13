/**
 * ID Generator Utility
 *
 * Provides consistent ID generation across the application.
 * DRY: Extracted from 3+ identical patterns in hooks.
 */

/**
 * Generate a unique ID with a prefix.
 * Uses timestamp + random string for uniqueness.
 *
 * @example
 * generateId('msg')    // 'msg-1699876543210-a1b2c3d'
 * generateId('conn')   // 'conn-1699876543210-x9y8z7w'
 * generateId('slide')  // 'slide-1699876543210-p5q6r7s'
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate a simple numeric ID (for layout variants, etc.).
 * Returns a random number between 0 and max (exclusive).
 */
export function generateNumericId(max: number = 1000): number {
  return Math.floor(Math.random() * max);
}

/**
 * Generate a UUID v4 compatible string.
 * Use when you need a standardized UUID format.
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
