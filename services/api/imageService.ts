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
): { stop: () => void } => {
  let active = true;
  let errorCount = 0;
  const maxErrors = 5;

  const poll = async () => {
    if (!active) return;

    try {
      const status = await getPresentationImageStatus(presentationId);
      onStatusUpdate(status);
      errorCount = 0; // Reset on success

      if (!status.all_complete && active) {
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
        // Exponential backoff on error
        setTimeout(poll, pollInterval * Math.pow(2, errorCount));
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
): { stop: () => void } => {
  let active = true;

  const poll = async () => {
    if (!active) return;

    try {
      const status = await getTaskStatus(taskId);
      onStatusUpdate(status);

      const isComplete = status.status === 'SUCCESS' || status.status === 'FAILURE';
      if (!isComplete && active) {
        setTimeout(poll, pollInterval);
      }
    } catch (error) {
      console.error('Poll error:', error);
      if (active) {
        setTimeout(poll, pollInterval * 2);
      }
    }
  };

  poll();

  return {
    stop: () => {
      active = false;
    },
  };
};
