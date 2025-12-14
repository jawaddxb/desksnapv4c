/**
 * useTouchNavigation Hook
 *
 * Handles touch/swipe navigation for mobile presentation mode.
 * Left swipe → next slide, Right swipe → previous slide.
 */

import { useCallback, useRef } from 'react';

export interface UseTouchNavigationOptions {
  /** Whether touch navigation is enabled */
  enabled: boolean;
  /** Callback for next slide */
  onNext: () => void;
  /** Callback for previous slide */
  onPrevious: () => void;
  /** Optional callback for swipe down to exit */
  onExit?: () => void;
  /** Minimum horizontal swipe distance in pixels (default: 50) */
  threshold?: number;
  /** Minimum vertical swipe distance for exit gesture (default: 100) */
  exitThreshold?: number;
}

export interface TouchHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export interface UseTouchNavigationReturn {
  /** Touch event handlers to spread on container */
  handlers: TouchHandlers;
  /** Whether a swipe is currently in progress */
  isSwiping: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
}

export function useTouchNavigation({
  enabled,
  onNext,
  onPrevious,
  onExit,
  threshold = 50,
  exitThreshold = 100,
}: UseTouchNavigationOptions): UseTouchNavigationReturn {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
  });

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isSwiping: true,
      };
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !touchState.current.isSwiping) return;

      const touch = e.touches[0];
      touchState.current.currentX = touch.clientX;
      touchState.current.currentY = touch.clientY;
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (_e: React.TouchEvent) => {
      if (!enabled || !touchState.current.isSwiping) return;

      const { startX, startY, currentX, currentY } = touchState.current;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Reset state
      touchState.current.isSwiping = false;

      // Check for vertical swipe (exit gesture)
      if (onExit && absDeltaY > exitThreshold && absDeltaY > absDeltaX) {
        // Swipe down to exit
        if (deltaY > 0) {
          onExit();
          return;
        }
      }

      // Check for horizontal swipe (navigation)
      if (absDeltaX > threshold && absDeltaX > absDeltaY) {
        if (deltaX < 0) {
          // Swiped left → next slide
          onNext();
        } else {
          // Swiped right → previous slide
          onPrevious();
        }
      }
    },
    [enabled, onNext, onPrevious, onExit, threshold, exitThreshold]
  );

  const handlers: TouchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    handlers,
    isSwiping: touchState.current.isSwiping,
  };
}

export default useTouchNavigation;
