/**
 * Thumbnail Service
 *
 * Helper functions for theme and archetype thumbnail management.
 * Handles path generation, existence checking, and batch operations.
 */

// ============ Path Helpers ============

/**
 * Get the path to a theme thumbnail.
 */
export function getThemeThumbnailPath(themeId: string): string {
  return `/thumbnails/themes/${themeId}.png`;
}

/**
 * Get the path to an archetype thumbnail.
 */
export function getArchetypeThumbnailPath(archetypeId: string): string {
  return `/thumbnails/archetypes/${archetypeId}.png`;
}

// ============ Existence Checking ============

/**
 * Check if a thumbnail exists at the given path.
 * Uses a HEAD request to avoid downloading the full image.
 */
export async function checkThumbnailExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if a theme thumbnail exists.
 */
export async function hasThemeThumbnail(themeId: string): Promise<boolean> {
  return checkThumbnailExists(getThemeThumbnailPath(themeId));
}

/**
 * Check if an archetype thumbnail exists.
 */
export async function hasArchetypeThumbnail(archetypeId: string): Promise<boolean> {
  return checkThumbnailExists(getArchetypeThumbnailPath(archetypeId));
}

// ============ Batch Operations ============

/**
 * Check which themes have thumbnails.
 * Returns a map of themeId -> hasThumnail.
 */
export async function checkThemeThumbnails(themeIds: string[]): Promise<Record<string, boolean>> {
  const results = await Promise.all(
    themeIds.map(async (id) => ({
      id,
      exists: await hasThemeThumbnail(id),
    }))
  );
  return Object.fromEntries(results.map((r) => [r.id, r.exists]));
}

/**
 * Check which archetypes have thumbnails.
 * Returns a map of archetypeId -> hasThumnail.
 */
export async function checkArchetypeThumbnails(archetypeIds: string[]): Promise<Record<string, boolean>> {
  const results = await Promise.all(
    archetypeIds.map(async (id) => ({
      id,
      exists: await hasArchetypeThumbnail(id),
    }))
  );
  return Object.fromEntries(results.map((r) => [r.id, r.exists]));
}

// ============ Download Utilities ============

/**
 * Download a blob as a file.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert a canvas to a PNG blob.
 */
export function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      'image/png',
      quality
    );
  });
}

// ============ ZIP Utilities ============

/**
 * Create a simple ZIP file from blobs using JSZip (if available).
 * Falls back to individual downloads if JSZip is not available.
 */
export async function downloadAsZip(
  files: Array<{ name: string; blob: Blob }>,
  zipFilename: string
): Promise<void> {
  // Try to use JSZip if available
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const file of files) {
      zip.file(file.name, file.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, zipFilename);
  } catch {
    // Fallback to individual downloads
    console.warn('JSZip not available, downloading files individually');
    for (const file of files) {
      downloadBlob(file.blob, file.name);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
