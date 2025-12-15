/**
 * useClickOutside Hook
 *
 * Detects clicks outside a referenced element.
 * Extracted from ToolbarDropdown for reusability.
 *
 * KISS: Simple, focused hook < 30 lines
 * DRY: Reusable across all dropdowns and modals
 */

import { useEffect, RefObject } from 'react';

/**
 * Hook that triggers a callback when clicking outside the referenced element
 * @param ref - React ref to the element to monitor
 * @param callback - Function to call when a click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback, enabled]);
}
