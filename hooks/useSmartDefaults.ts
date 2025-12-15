/**
 * useSmartDefaults Hook
 *
 * Analyzes user input and provides smart defaults for presentation generation.
 * Extracted from ChatInterface and CreateTopicInput to avoid duplication.
 *
 * KISS: Simple debounced analysis < 50 lines
 * SOLID-S: Only handles smart defaults detection
 * DRY: Single source of truth for smart defaults logic
 */

import { useState, useEffect } from 'react';
import { analyzeTopicForDefaults, SmartDefaultsResult } from '@/lib/smartDefaults';
import { GenerationMode } from '@/types';

interface UseSmartDefaultsOptions {
  /** Minimum input length to trigger analysis */
  minLength?: number;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Whether to auto-apply defaults (default: true) */
  autoApply?: boolean;
  /** Callback when generation mode should change */
  onModeChange?: (mode: GenerationMode) => void;
  /** Skip analysis when true (e.g., when editing existing presentation) */
  skip?: boolean;
}

interface UseSmartDefaultsReturn {
  /** Analyzed smart defaults (null if not yet analyzed) */
  smartDefaults: SmartDefaultsResult | null;
  /** Whether defaults have high confidence (> 0.3) */
  hasConfidentDefaults: boolean;
  /** Reset the smart defaults state */
  reset: () => void;
}

const CONFIDENCE_THRESHOLD = 0.3;

export function useSmartDefaults(
  inputValue: string,
  options: UseSmartDefaultsOptions = {}
): UseSmartDefaultsReturn {
  const {
    minLength = 10,
    debounceMs = 500,
    autoApply = true,
    onModeChange,
    skip = false,
  } = options;

  const [smartDefaults, setSmartDefaults] = useState<SmartDefaultsResult | null>(null);

  useEffect(() => {
    if (skip) {
      setSmartDefaults(null);
      return;
    }

    if (inputValue.trim().length > minLength) {
      const timeoutId = setTimeout(() => {
        const defaults = analyzeTopicForDefaults(inputValue);
        setSmartDefaults(defaults);

        // Auto-apply generation mode if callback provided
        if (autoApply && onModeChange) {
          onModeChange(defaults.density);
        }
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    } else {
      setSmartDefaults(null);
    }
  }, [inputValue, minLength, debounceMs, autoApply, onModeChange, skip]);

  const reset = () => setSmartDefaults(null);

  return {
    smartDefaults,
    hasConfidentDefaults: smartDefaults !== null && smartDefaults.confidence > CONFIDENCE_THRESHOLD,
    reset,
  };
}
