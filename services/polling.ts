/**
 * Generic Polling Service
 *
 * Provides reusable polling utilities with configurable backoff strategies.
 * DRY: Consolidates polling patterns used across the codebase.
 *
 * Used by:
 * - BeautifyWizard (session status polling)
 * - imageService (image generation polling)
 * - Any async operation that requires status polling
 */

// ============ Types ============

export interface PollingOptions<T> {
  /** Function to fetch the current status */
  fetcher: () => Promise<T>;

  /** Callback when status is fetched successfully */
  onUpdate: (data: T) => void;

  /** Determine if polling should stop (return true to stop) */
  isComplete: (data: T) => boolean;

  /** Callback when polling errors occur */
  onError?: (error: Error, errorCount: number) => void;

  /** Callback when polling completes (either success or max errors) */
  onComplete?: (data: T | null, reason: 'success' | 'max_errors' | 'stopped') => void;

  /** Initial polling interval in ms (default: 2000) */
  interval?: number;

  /** Maximum consecutive errors before stopping (default: 5) */
  maxErrors?: number;

  /** Backoff strategy for errors (default: 'exponential') */
  backoffStrategy?: 'exponential' | 'linear' | 'none';

  /** Maximum interval after backoff in ms (default: 30000) */
  maxInterval?: number;

  /** Whether to poll immediately on start (default: true) */
  immediate?: boolean;
}

export interface PollingController {
  /** Stop polling */
  stop: () => void;

  /** Check if polling is active */
  isActive: () => boolean;

  /** Resume polling if stopped */
  resume: () => void;
}

// ============ Polling Function ============

/**
 * Creates a polling controller with configurable options.
 *
 * @example
 * // Simple polling
 * const poller = createPoller({
 *   fetcher: () => api.getStatus(id),
 *   onUpdate: (status) => setStatus(status),
 *   isComplete: (status) => status.done === true,
 * });
 *
 * // Stop polling when component unmounts
 * useEffect(() => () => poller.stop(), []);
 *
 * @example
 * // With error handling and custom backoff
 * const poller = createPoller({
 *   fetcher: () => fetchTaskStatus(taskId),
 *   onUpdate: handleStatusUpdate,
 *   isComplete: (status) => ['SUCCESS', 'FAILURE'].includes(status.state),
 *   onError: (err, count) => console.warn(`Poll error ${count}:`, err),
 *   interval: 3000,
 *   maxErrors: 10,
 *   backoffStrategy: 'exponential',
 * });
 */
export function createPoller<T>(options: PollingOptions<T>): PollingController {
  const {
    fetcher,
    onUpdate,
    isComplete,
    onError,
    onComplete,
    interval = 2000,
    maxErrors = 5,
    backoffStrategy = 'exponential',
    maxInterval = 30000,
    immediate = true,
  } = options;

  let active = true;
  let errorCount = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastData: T | null = null;

  /**
   * Calculate the next interval based on error count and backoff strategy.
   */
  const getNextInterval = (): number => {
    if (errorCount === 0) return interval;

    let nextInterval: number;

    switch (backoffStrategy) {
      case 'exponential':
        nextInterval = interval * Math.pow(2, errorCount);
        break;
      case 'linear':
        nextInterval = interval * (errorCount + 1);
        break;
      case 'none':
        nextInterval = interval;
        break;
      default:
        nextInterval = interval;
    }

    return Math.min(nextInterval, maxInterval);
  };

  /**
   * Schedule the next poll.
   */
  const scheduleNext = () => {
    if (!active) return;

    const nextInterval = getNextInterval();
    timeoutId = setTimeout(poll, nextInterval);
  };

  /**
   * Execute a single poll iteration.
   */
  const poll = async () => {
    if (!active) return;

    try {
      const data = await fetcher();
      lastData = data;
      errorCount = 0; // Reset on success

      onUpdate(data);

      if (isComplete(data)) {
        active = false;
        onComplete?.(data, 'success');
      } else {
        scheduleNext();
      }
    } catch (error) {
      errorCount++;
      const err = error instanceof Error ? error : new Error(String(error));

      onError?.(err, errorCount);

      if (errorCount >= maxErrors) {
        active = false;
        onComplete?.(lastData, 'max_errors');
      } else {
        scheduleNext();
      }
    }
  };

  // Start polling
  if (immediate) {
    poll();
  } else {
    scheduleNext();
  }

  return {
    stop: () => {
      if (!active) return;
      active = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      onComplete?.(lastData, 'stopped');
    },
    isActive: () => active,
    resume: () => {
      if (active) return;
      active = true;
      errorCount = 0;
      poll();
    },
  };
}

// ============ React Hook Helper ============

/**
 * Creates a cleanup function suitable for use in useEffect.
 *
 * @example
 * useEffect(() => {
 *   const poller = createPoller({ ... });
 *   return createPollerCleanup(poller);
 * }, [dependency]);
 */
export function createPollerCleanup(controller: PollingController): () => void {
  return () => controller.stop();
}

// ============ Interval-Based Polling ============

/**
 * Simple interval-based polling (like setInterval but with stop control).
 * Use this for simpler cases that don't need completion detection.
 *
 * @example
 * const controller = createIntervalPoller(() => {
 *   fetchAndUpdate();
 * }, 5000);
 *
 * // Later: stop polling
 * controller.stop();
 */
export function createIntervalPoller(
  callback: () => void | Promise<void>,
  interval: number
): PollingController {
  let active = true;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const start = () => {
    if (intervalId) return;
    intervalId = setInterval(async () => {
      if (active) {
        try {
          await callback();
        } catch (error) {
          console.error('Interval poll error:', error);
        }
      }
    }, interval);
  };

  start();

  return {
    stop: () => {
      active = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    isActive: () => active,
    resume: () => {
      if (active) return;
      active = true;
      start();
    },
  };
}

// ============ Promise-Based Polling ============

/**
 * Poll until a condition is met, returning a promise.
 * Useful for one-time async operations that need to wait for completion.
 *
 * @example
 * const result = await pollUntil({
 *   fetcher: () => getTaskStatus(taskId),
 *   isComplete: (status) => status.done,
 *   timeout: 60000,
 * });
 */
export interface PollUntilOptions<T> {
  fetcher: () => Promise<T>;
  isComplete: (data: T) => boolean;
  interval?: number;
  maxErrors?: number;
  timeout?: number;
  backoffStrategy?: 'exponential' | 'linear' | 'none';
}

export async function pollUntil<T>(options: PollUntilOptions<T>): Promise<T> {
  const {
    fetcher,
    isComplete,
    interval = 2000,
    maxErrors = 5,
    timeout = 60000,
    backoffStrategy = 'exponential',
  } = options;

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const controller = createPoller({
      fetcher,
      onUpdate: () => {
        // onComplete handles resolution
      },
      isComplete,
      interval,
      maxErrors,
      backoffStrategy,
      onComplete: (data, reason) => {
        if (reason === 'success' && data) {
          resolve(data);
        } else if (reason === 'max_errors') {
          reject(new Error('Polling failed: max errors reached'));
        } else {
          reject(new Error(`Polling stopped: ${reason}`));
        }
      },
      onError: () => {
        // Check timeout on each error
        if (Date.now() - startTime > timeout) {
          controller.stop();
          reject(new Error('Polling timeout'));
        }
      },
    });

    // Set timeout check
    setTimeout(() => {
      if (controller.isActive()) {
        controller.stop();
        reject(new Error('Polling timeout'));
      }
    }, timeout);
  });
}
