/**
 * Export Helpers
 *
 * Shared utilities for PDF and PPT export operations.
 * DRY: Extracted from identical patterns in pdfService.ts and pptService.ts
 */

/**
 * Wait for all images in a container to load.
 * Resolves immediately for already-loaded images.
 * Continues even if some images fail to load.
 *
 * @param container - The HTML element containing images
 */
export async function waitForImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll('img');
  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Continue even if image fails
    });
  });
  await Promise.all(promises);
}

/**
 * Wait for all fonts to be loaded and painted.
 * Uses the Font Loading API with an additional delay for paint.
 *
 * @param additionalDelayMs - Extra delay after fonts are ready (default: 100ms)
 */
export async function waitForFonts(additionalDelayMs: number = 100): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // Additional delay to ensure fonts are painted
  await new Promise((resolve) => setTimeout(resolve, additionalDelayMs));
}

/**
 * Wait for both images and fonts to be ready.
 * Convenience wrapper for common export preparation.
 *
 * @param container - The HTML element containing images
 */
export async function waitForRenderReady(container: HTMLElement): Promise<void> {
  await Promise.all([
    waitForImages(container),
    waitForFonts(),
  ]);
}
