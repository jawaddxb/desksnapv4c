/**
 * OnboardingHint
 *
 * Subtle, non-blocking hint tooltip for first-time users.
 * Shows contextual help and can be dismissed.
 *
 * KISS: Simple tooltip component < 50 lines
 * SOLID-S: Only renders hint UI
 * DRY: Reads from config/onboarding.ts
 */

import React, { useState, useEffect } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { OnboardingHint as HintType, hasHintBeenShown, markHintAsShown } from '@/config/onboarding';

// Re-export hook from dedicated file for backwards compatibility
export { useOnboardingHints } from '@/hooks/useOnboardingHints';

interface OnboardingHintProps {
  hint: HintType;
  onDismiss?: () => void;
  className?: string;
}

export const OnboardingHint: React.FC<OnboardingHintProps> = ({
  hint,
  onDismiss,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this hint has already been shown
    if (!hasHintBeenShown(hint.id)) {
      // Delay showing for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hint.id]);

  const handleDismiss = () => {
    setIsVisible(false);
    markHintAsShown(hint.id);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`animate-slide-in-bottom bg-white border border-[#D4E5D4] rounded-lg shadow-lg p-3 max-w-xs ${className}`}
      role="tooltip"
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EDF5F0] flex items-center justify-center">
          <Lightbulb className="w-3.5 h-3.5 text-[#6B8E6B]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#1E2E1E]">{hint.title}</h4>
            <button
              onClick={handleDismiss}
              className="p-0.5 text-[#8FA58F] hover:text-[#1E2E1E] transition-colors"
              aria-label="Dismiss hint"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-[#4A5D4A] mt-0.5 leading-relaxed">
            {hint.description}
          </p>
        </div>
      </div>
    </div>
  );
};
