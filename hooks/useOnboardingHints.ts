/**
 * useOnboardingHints Hook
 *
 * Manages onboarding hints for a specific context.
 * Tracks shown/dismissed hints and provides the next hint to display.
 *
 * KISS: Simple state management < 50 lines
 * SOLID-S: Only manages hint state, no rendering
 * DRY: Reads from config/onboarding.ts
 */

import { useState, useMemo } from 'react';
import {
  OnboardingHint,
  ONBOARDING_HINTS,
  hasHintBeenShown,
  markHintAsShown,
} from '@/config/onboarding';

interface UseOnboardingHintsReturn {
  /** Current hint to display (null if none) */
  currentHint: OnboardingHint | null;
  /** Dismiss the current hint and move to next */
  dismissCurrentHint: () => void;
  /** Whether there are any hints to show */
  hasHints: boolean;
}

/**
 * Hook to manage onboarding hints for a context
 * @param context - The context to filter hints for ('dashboard' | 'editing' | 'presenting' | 'any')
 */
export function useOnboardingHints(
  context: OnboardingHint['context']
): UseOnboardingHintsReturn {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [dismissedHints, setDismissedHints] = useState<Set<string>>(new Set());

  const hints = useMemo(() => {
    return ONBOARDING_HINTS
      .filter((h) => h.context === context || h.context === 'any')
      .filter((h) => !hasHintBeenShown(h.id) && !dismissedHints.has(h.id))
      .sort((a, b) => a.priority - b.priority);
  }, [context, dismissedHints]);

  const currentHint = hints[currentHintIndex] || null;

  const dismissCurrentHint = () => {
    if (currentHint) {
      setDismissedHints((prev) => new Set([...prev, currentHint.id]));
      markHintAsShown(currentHint.id);
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  return {
    currentHint,
    dismissCurrentHint,
    hasHints: hints.length > 0,
  };
}
