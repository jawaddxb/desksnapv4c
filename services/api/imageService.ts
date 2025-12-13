/**
 * Image Generation API Service
 *
 * Handles async image generation via backend Celery tasks.
 * Provides polling utilities for tracking generation progress.
 */
import { api } from './apiClient';

export interface ImageTaskStatus {
  task_id: string;
  status: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'NONE' | 'COMPLETE';
  slide_id: string | null;
  image_url: string | null;
  error: string | null;
}

export interface BatchStatusResponse {
  slide_statuses: Record<string, ImageTaskStatus>;
  completed: number;
  total: number;
  all_complete: boolean;
}

export interface ImageGenerationResponse {
  task_id: string;
  slide_id: string;
  status: string;
}

export interface BatchImageGenerationResponse {
  tasks: Record<string, string>; // slide_id -> task_id
  total_slides: number;
}

const API_PREFIX = '/api/v1/presentations';

// ============================================================================
// Generic Polling Factory
// ============================================================================

interface PollingOptions<T> {
  /** Function that fetches the status */
  fetchStatus: () => Promise<T>;
  /** Called with each status update */
  onStatusUpdate: (status: T) => void;
  /** Returns true if polling should stop */
  isComplete: (status: T) => boolean;
  /** Base interval between polls in ms (default: 3000) */
  pollInterval?: number;
  /** Maximum consecutive errors before stopping (default: 5) */
  maxErrors?: number;
  /** Use exponential backoff on errors (default: true) */
  exponentialBackoff?: boolean;
}

interface PollHandle {
  stop: () => void;
}

/**
 * Generic polling factory for async task tracking.
 * Handles polling lifecycle, error recovery, and exponential backoff.
 */
export const createPoller = <T>(options: PollingOptions<T>): PollHandle => {
  const {
    fetchStatus,
    onStatusUpdate,
    isComplete,
    pollInterval = 3000,
    maxErrors = 5,
    exponentialBackoff = true,
  } = options;

  let active = true;
  let errorCount = 0;

  const poll = async () => {
    if (!active) return;

    try {
      const status = await fetchStatus();
      onStatusUpdate(status);
      errorCount = 0; // Reset on success

      if (!isComplete(status) && active) {
        setTimeout(poll, pollInterval);
      }
    } catch (error) {
      console.error('Poll error:', error);
      errorCount++;

      if (errorCount >= maxErrors) {
        console.error('Max poll errors reached, stopping');
        return;
      }

      if (active) {
        const nextInterval = exponentialBackoff
          ? pollInterval * Math.pow(2, errorCount)
          : pollInterval * 2;
        setTimeout(poll, nextInterval);
      }
    }
  };

  // Start polling
  poll();

  return {
    stop: () => {
      active = false;
    },
  };
};

// ============================================================================
// Image Generation API
// ============================================================================

/**
 * Generate image for a single slide.
 * Returns immediately with task_id - use polling to track progress.
 */
export const generateSlideImageAsync = async (
  presentationId: string,
  slideId: string
): Promise<ImageGenerationResponse> => {
  return api.post<ImageGenerationResponse>(
    `${API_PREFIX}/${presentationId}/slides/${slideId}/generate-image`
  );
};

/**
 * Regenerate image for a slide (clears existing image first).
 */
export const regenerateSlideImageAsync = async (
  presentationId: string,
  slideId: string
): Promise<ImageGenerationResponse> => {
  return api.post<ImageGenerationResponse>(
    `${API_PREFIX}/${presentationId}/slides/${slideId}/regenerate-image`
  );
};

/**
 * Generate images for all slides (or specific slides).
 * Returns immediately with task_ids - use polling to track progress.
 */
export const generateAllImagesAsync = async (
  presentationId: string,
  slideIds?: string[]
): Promise<BatchImageGenerationResponse> => {
  return api.post<BatchImageGenerationResponse>(
    `${API_PREFIX}/${presentationId}/generate-images`,
    { slide_ids: slideIds || [] }
  );
};

/**
 * Get status of a single task.
 */
export const getTaskStatus = async (taskId: string): Promise<ImageTaskStatus> => {
  return api.get<ImageTaskStatus>(`${API_PREFIX}/tasks/${taskId}`);
};

/**
 * Get status of all image tasks for a presentation.
 */
export const getPresentationImageStatus = async (
  presentationId: string
): Promise<BatchStatusResponse> => {
  return api.get<BatchStatusResponse>(`${API_PREFIX}/${presentationId}/image-status`);
};

/**
 * Poll for image generation completion.
 * Calls onStatusUpdate with status updates until all_complete is true.
 *
 * @param presentationId - The presentation to poll
 * @param onStatusUpdate - Callback with status updates
 * @param pollInterval - Milliseconds between polls (default 3000)
 * @returns Object with stop() method to cancel polling
 */
export const pollImageGeneration = (
  presentationId: string,
  onStatusUpdate: (status: BatchStatusResponse) => void,
  pollInterval = 3000
): PollHandle => {
  return createPoller<BatchStatusResponse>({
    fetchStatus: () => getPresentationImageStatus(presentationId),
    onStatusUpdate,
    isComplete: (status) => status.all_complete,
    pollInterval,
    maxErrors: 5,
    exponentialBackoff: true,
  });
};

/**
 * Poll for a single task completion.
 *
 * @param taskId - The task to poll
 * @param onStatusUpdate - Callback with status updates
 * @param pollInterval - Milliseconds between polls (default 2000)
 * @returns Object with stop() method to cancel polling
 */
export const pollSingleTask = (
  taskId: string,
  onStatusUpdate: (status: ImageTaskStatus) => void,
  pollInterval = 2000
): PollHandle => {
  return createPoller<ImageTaskStatus>({
    fetchStatus: () => getTaskStatus(taskId),
    onStatusUpdate,
    isComplete: (status) => status.status === 'SUCCESS' || status.status === 'FAILURE',
    pollInterval,
    maxErrors: 5,
    exponentialBackoff: false, // Original used simple doubling, not exponential
  });
};
