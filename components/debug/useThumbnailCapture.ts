/**
 * useThumbnailCapture Hook
 *
 * Provides functionality to capture DOM elements as PNG thumbnails
 * using html2canvas. Used for generating theme and archetype previews.
 */

import { useCallback, useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { downloadBlob, canvasToBlob } from '@/services/thumbnailService';

// ============ Types ============

export interface CaptureOptions {
  /** Output width in pixels (default: 400) */
  width?: number;
  /** Output height in pixels (default: 300) */
  height?: number;
  /** PNG quality (0-1, default: 0.92) */
  quality?: number;
  /** Scale factor for rendering (default: 2 for crisp output) */
  scale?: number;
  /** Background color (default: null for transparent) */
  backgroundColor?: string | null;
}

export interface CaptureResult {
  blob: Blob;
  dataUrl: string;
}

export interface UseThumbnailCaptureReturn {
  /** Reference to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Whether a capture is currently in progress */
  isCapturing: boolean;
  /** Last error message, if any */
  error: string | null;
  /** Capture the container and return the result */
  capture: (options?: CaptureOptions) => Promise<CaptureResult | null>;
  /** Capture and immediately download */
  captureAndDownload: (filename: string, options?: CaptureOptions) => Promise<boolean>;
  /** Wait for fonts to be ready */
  waitForFonts: () => Promise<void>;
}

// ============ Default Options ============

const DEFAULT_OPTIONS: Required<CaptureOptions> = {
  width: 400,
  height: 300,
  quality: 0.92,
  scale: 2,
  backgroundColor: null,
};

// ============ Hook ============

export function useThumbnailCapture(): UseThumbnailCaptureReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Wait for all fonts to be loaded.
   */
  const waitForFonts = useCallback(async () => {
    try {
      await document.fonts.ready;
      // Additional delay to ensure fonts are rendered
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch {
      console.warn('Font loading check failed, continuing anyway');
    }
  }, []);

  /**
   * Capture the container element as a PNG.
   */
  const capture = useCallback(
    async (options?: CaptureOptions): Promise<CaptureResult | null> => {
      if (!containerRef.current) {
        setError('Container ref not attached');
        return null;
      }

      setIsCapturing(true);
      setError(null);

      const opts = { ...DEFAULT_OPTIONS, ...options };

      try {
        // Wait for fonts to load
        await waitForFonts();

        // Capture with html2canvas
        const canvas = await html2canvas(containerRef.current, {
          scale: opts.scale,
          backgroundColor: opts.backgroundColor,
          useCORS: true,
          allowTaint: false,
          logging: false,
          // Render at the container's actual size
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });

        // Create a new canvas at the target size
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = opts.width;
        outputCanvas.height = opts.height;
        const ctx = outputCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Draw the captured canvas scaled to output size
        ctx.drawImage(canvas, 0, 0, opts.width, opts.height);

        // Convert to blob
        const blob = await canvasToBlob(outputCanvas, opts.quality);
        const dataUrl = outputCanvas.toDataURL('image/png', opts.quality);

        return { blob, dataUrl };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Capture failed';
        setError(message);
        console.error('Thumbnail capture error:', err);
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    [waitForFonts]
  );

  /**
   * Capture and immediately download as a file.
   */
  const captureAndDownload = useCallback(
    async (filename: string, options?: CaptureOptions): Promise<boolean> => {
      const result = await capture(options);
      if (result) {
        downloadBlob(result.blob, filename);
        return true;
      }
      return false;
    },
    [capture]
  );

  return {
    containerRef,
    isCapturing,
    error,
    capture,
    captureAndDownload,
    waitForFonts,
  };
}

// ============ Batch Capture Utility ============

export interface BatchCaptureItem {
  id: string;
  render: () => React.ReactNode;
}

export interface BatchCaptureProgress {
  total: number;
  completed: number;
  current: string | null;
  errors: Array<{ id: string; error: string }>;
}

/**
 * Capture multiple items in sequence.
 * Returns an array of blobs with their IDs.
 */
export async function batchCapture(
  containerRef: React.RefObject<HTMLDivElement>,
  items: string[],
  renderItem: (id: string) => void,
  options?: CaptureOptions,
  onProgress?: (progress: BatchCaptureProgress) => void
): Promise<Array<{ id: string; blob: Blob }>> {
  const results: Array<{ id: string; blob: Blob }> = [];
  const errors: Array<{ id: string; error: string }> = [];
  const opts = { ...DEFAULT_OPTIONS, ...options };

  for (let i = 0; i < items.length; i++) {
    const id = items[i];

    onProgress?.({
      total: items.length,
      completed: i,
      current: id,
      errors,
    });

    try {
      // Render the item
      renderItem(id);

      // Wait for render and fonts
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 150));

      if (!containerRef.current) {
        throw new Error('Container not found');
      }

      // Capture
      const canvas = await html2canvas(containerRef.current, {
        scale: opts.scale,
        backgroundColor: opts.backgroundColor,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      // Scale to output size
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = opts.width;
      outputCanvas.height = opts.height;
      const ctx = outputCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(canvas, 0, 0, opts.width, opts.height);

      const blob = await canvasToBlob(outputCanvas, opts.quality);
      results.push({ id, blob });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Capture failed';
      errors.push({ id, error: message });
      console.error(`Failed to capture ${id}:`, err);
    }
  }

  onProgress?.({
    total: items.length,
    completed: items.length,
    current: null,
    errors,
  });

  return results;
}
