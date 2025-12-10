/**
 * useAnalytics Hook
 *
 * Tracks presentation analytics including:
 * - Session start/end times
 * - Per-slide dwell time
 * - Total presentation duration
 */

import { useRef, useEffect, useCallback } from 'react';
import { Presentation, AnalyticsSession } from '../types';

export interface UseAnalyticsOptions {
  /** Whether presentation mode is active */
  isPresenting: boolean;
  /** Current presentation */
  presentation: Presentation | null;
  /** Currently active slide index */
  activeSlideIndex: number;
  /** Callback to record an analytics session */
  onRecordSession: (session: AnalyticsSession) => void;
}

export interface UseAnalyticsReturn {
  /** No return values - analytics is tracked automatically via effects */
}

export function useAnalytics({
  isPresenting,
  presentation,
  activeSlideIndex,
  onRecordSession,
}: UseAnalyticsOptions): UseAnalyticsReturn {
  // Session timing refs
  const sessionStartTime = useRef<number>(0);
  const slideEnterTime = useRef<number>(0);
  const slideDurations = useRef<Record<string, number>>({});
  const prevSlideIndexRef = useRef(activeSlideIndex);

  /**
   * Track session start and end.
   */
  useEffect(() => {
    if (isPresenting) {
      // Start session
      sessionStartTime.current = Date.now();
      slideEnterTime.current = Date.now();
      slideDurations.current = {};
    } else {
      // End session (if we were just presenting)
      if (sessionStartTime.current > 0 && presentation) {
        // Capture final slide dwell time
        const now = Date.now();
        const lastSlideId = presentation.slides[activeSlideIndex]?.id;
        if (lastSlideId) {
          const dwell = (now - slideEnterTime.current) / 1000;
          slideDurations.current[lastSlideId] = (slideDurations.current[lastSlideId] || 0) + dwell;
        }

        // Save session
        const totalDuration = (now - sessionStartTime.current) / 1000;
        onRecordSession({
          id: crypto.randomUUID(),
          timestamp: sessionStartTime.current,
          totalDuration,
          slideDurations: { ...slideDurations.current },
        });

        // Reset
        sessionStartTime.current = 0;
      }
    }
  }, [isPresenting, presentation, activeSlideIndex, onRecordSession]);

  /**
   * Track slide transitions and dwell time.
   */
  useEffect(() => {
    if (isPresenting && presentation) {
      const now = Date.now();
      const duration = (now - slideEnterTime.current) / 1000;
      const prevSlideId = presentation.slides[prevSlideIndexRef.current]?.id;

      if (prevSlideId) {
        slideDurations.current[prevSlideId] = (slideDurations.current[prevSlideId] || 0) + duration;
      }

      slideEnterTime.current = now;
      prevSlideIndexRef.current = activeSlideIndex;
    } else {
      prevSlideIndexRef.current = activeSlideIndex;
    }
  }, [activeSlideIndex, isPresenting, presentation]);

  return {};
}

export default useAnalytics;
