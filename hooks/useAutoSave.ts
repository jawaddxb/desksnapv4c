/**
 * useAutoSave Hook
 *
 * Reusable auto-save logic with debouncing and status tracking.
 * Extracts the common pattern from useDeck and useIdeation.
 *
 * Features:
 * - JSON-based change detection
 * - Configurable debounce delay
 * - Status tracking (idle -> saving -> saved -> idle)
 * - Cleanup on unmount
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved';

export interface UseAutoSaveOptions<T> {
  /** The data to monitor for changes */
  data: T | null;
  /** Function to persist the data */
  onSave: (data: T) => Promise<void>;
  /** Optional callback after successful save */
  onSaveComplete?: () => void;
  /** Debounce delay in milliseconds (default: 2000) */
  debounceMs?: number;
  /** Duration to show 'saved' status before returning to 'idle' (default: 2000) */
  savedDurationMs?: number;
  /** Whether auto-save is enabled (default: true) */
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  /** Current save status */
  saveStatus: SaveStatus;
  /** Manually trigger a save */
  forceSave: () => Promise<void>;
  /** Reset the change tracking (call after loading new data) */
  resetTracking: (data: unknown) => void;
}

export function useAutoSave<T>({
  data,
  onSave,
  onSaveComplete,
  debounceMs = 2000,
  savedDurationMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Track previous data state for change detection
  const prevDataRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup function to clear all timers
  const clearTimers = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
  }, []);

  // Reset tracking (useful after loading new data)
  const resetTracking = useCallback((newData: unknown) => {
    prevDataRef.current = newData ? JSON.stringify(newData) : null;
    clearTimers();
    setSaveStatus('idle');
  }, [clearTimers]);

  // Force save (bypass debounce)
  const forceSave = useCallback(async () => {
    if (!data) return;

    clearTimers();
    setSaveStatus('saving');

    try {
      await onSave(data);
      prevDataRef.current = JSON.stringify(data);
      setSaveStatus('saved');
      onSaveComplete?.();

      statusTimerRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, savedDurationMs);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('idle');
    }
  }, [data, onSave, onSaveComplete, savedDurationMs, clearTimers]);

  // Auto-save effect with debouncing
  useEffect(() => {
    if (!enabled || !data) return;

    const currentString = JSON.stringify(data);

    // Check if data has changed
    if (prevDataRef.current !== currentString) {
      setSaveStatus('saving');

      // Clear any existing save timer
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      // Debounced save
      saveTimerRef.current = setTimeout(async () => {
        try {
          await onSave(data);
          prevDataRef.current = currentString;
          setSaveStatus('saved');
          onSaveComplete?.();

          // Reset to idle after showing 'saved' status
          statusTimerRef.current = setTimeout(() => {
            setSaveStatus('idle');
          }, savedDurationMs);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setSaveStatus('idle');
        }
      }, debounceMs);

      // Cleanup function
      return () => {
        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current);
        }
      };
    }
  }, [data, onSave, onSaveComplete, debounceMs, savedDurationMs, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return {
    saveStatus,
    forceSave,
    resetTracking,
  };
}

export default useAutoSave;
