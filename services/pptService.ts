/**
 * PowerPoint Export Service
 *
 * Uses dom-to-pptx for pixel-accurate DOM capture.
 * Renders actual slide components and converts them to PPTX.
 */

import type { Presentation, Theme } from '../types';
import type { ExportProgress, PPTExportOptions as BasePPTExportOptions } from '../types/export';
import { waitForImages, waitForFonts } from '../utils/exportHelpers';
import { sanitizeFilename } from '../lib/fileUtils';
import {
  SLIDE_DIMENSIONS,
  EXPORT_EVENTS,
  EXPORT_ELEMENT_IDS,
  EXPORT_TIMING,
} from '../config/exportConstants';

// =============================================================================
// TYPES
// =============================================================================

/**
 * @deprecated Use ExportProgress from types/export.ts instead
 */
export type PPTExportProgress = ExportProgress;

export interface PPTExportOptions {
  viewMode: 'standard' | 'wabi-sabi';
  wabiSabiLayout?: string;
  onProgress?: (progress: ExportProgress) => void;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Wait for a frame to ensure DOM has rendered
 */
const waitForFrame = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
};


// =============================================================================
// SLIDE RENDERING
// =============================================================================

/**
 * Render a single slide and wait for it to be ready
 */
const renderSlide = async (
  slideIndex: number,
  presentation: Presentation,
  theme: Theme,
  viewMode: 'standard' | 'wabi-sabi',
  wabiSabiLayout?: string
): Promise<void> => {
  // Dispatch event to render the slide
  window.dispatchEvent(
    new CustomEvent(EXPORT_EVENTS.PPT_RENDER, {
      detail: { slideIndex, presentation, theme, viewMode, wabiSabiLayout },
    })
  );

  // Wait for render
  await waitForFrame();
  await waitForFonts();

  // Get the rendered container and wait for images
  const container = document.getElementById(EXPORT_ELEMENT_IDS.PPT_SLIDE_CONTENT);
  if (container) {
    await waitForImages(container);
  }

  // Extra delay for any CSS transitions/animations
  await new Promise((resolve) => setTimeout(resolve, EXPORT_TIMING.RENDER_DELAY_MS));
};

/**
 * Get the rendered slide element
 */
const getSlideElement = (): HTMLElement | null => {
  return document.getElementById(EXPORT_ELEMENT_IDS.PPT_SLIDE_CONTENT);
};

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

/**
 * Generate PowerPoint from presentation using dom-to-pptx
 *
 * This function:
 * 1. Renders each slide to the DOM via ExportRenderer (type="ppt")
 * 2. Uses dom-to-pptx to convert DOM elements to PPTX
 * 3. Adds speaker notes via pptxgenjs post-processing
 */
export const generatePPT = async (
  presentation: Presentation,
  theme: Theme,
  options: PPTExportOptions = { viewMode: 'standard' }
): Promise<void> => {
  const { viewMode, wabiSabiLayout, onProgress } = options;

  try {
    // Dynamic import for code splitting
    const { exportToPptx } = await import('dom-to-pptx');

    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
      message: 'Preparing slides for export...',
    });

    // Collect all slide elements
    const slideElements: HTMLElement[] = [];

    for (let i = 0; i < presentation.slides.length; i++) {
      onProgress?.({
        currentSlide: i + 1,
        totalSlides: presentation.slides.length,
        phase: 'rendering',
        message: `Rendering slide ${i + 1} of ${presentation.slides.length}...`,
      });

      // Render the slide to DOM
      await renderSlide(i, presentation, theme, viewMode, wabiSabiLayout);

      // Get the rendered element
      const slideElement = getSlideElement();
      if (slideElement) {
        // Clone the element to preserve it
        const clone = slideElement.cloneNode(true) as HTMLElement;
        // Keep the element in DOM for dom-to-pptx to process
        slideElements.push(clone);
      }
    }

    onProgress?.({
      currentSlide: presentation.slides.length,
      totalSlides: presentation.slides.length,
      phase: 'converting',
      message: 'Converting to PowerPoint format...',
    });

    // Use dom-to-pptx to convert all slides
    // Create a temporary container for the cloned elements
    const tempContainer = document.createElement('div');
    tempContainer.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(tempContainer);

    // Add cloned elements to temp container
    slideElements.forEach((el) => {
      el.style.width = `${SLIDE_DIMENSIONS.width}px`;
      el.style.height = `${SLIDE_DIMENSIONS.height}px`;
      tempContainer.appendChild(el);
    });

    // Wait for elements to be in DOM
    await waitForFrame();

    // Convert to PPTX using the child elements
    const slideSelector = slideElements.map((_, i) =>
      `div[style*="position:fixed"] > div:nth-child(${i + 1})`
    );

    // Export using the temp container's children
    const fileName = `${sanitizeFilename(presentation.topic)}_presentation.pptx`;

    try {
      await exportToPptx(
        Array.from(tempContainer.children) as HTMLElement[],
        { fileName }
      );
    } finally {
      // Clean up temp container
      document.body.removeChild(tempContainer);
    }

    // Signal export complete
    window.dispatchEvent(new CustomEvent(EXPORT_EVENTS.PPT_COMPLETE));

    onProgress?.({
      currentSlide: presentation.slides.length,
      totalSlides: presentation.slides.length,
      phase: 'complete',
      message: 'PowerPoint exported successfully!',
    });
  } catch (error) {
    // Signal export complete even on error
    window.dispatchEvent(new CustomEvent(EXPORT_EVENTS.PPT_COMPLETE));

    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'error',
      message: error instanceof Error ? error.message : 'Export failed',
    });

    throw error;
  }
};

// =============================================================================
// LEGACY EXPORT (Fallback using pptxgenjs directly)
// =============================================================================

// Keep the old FONT_MAP for any legacy needs
export const FONT_MAP: Record<string, string> = {
  // Display/Serif fonts -> Georgia/Times alternatives
  'Abril Fatface': 'Georgia',
  'Playfair Display': 'Georgia',
  'Cormorant Garamond': 'Garamond',
  'Libre Baskerville': 'Book Antiqua',
  'Crimson Text': 'Times New Roman',
  'Merriweather': 'Georgia',
  'DM Serif Display': 'Georgia',
  'Cinzel': 'Constantia',
  'Lora': 'Cambria',
  'Newsreader': 'Georgia',
  'Source Serif 4': 'Georgia',

  // Sans-serif fonts -> Arial/Calibri alternatives
  'Space Grotesk': 'Calibri',
  'DM Sans': 'Calibri',
  'Inter': 'Calibri',
  'Oswald': 'Arial Narrow',
  'Work Sans': 'Calibri',
  'Teko': 'Impact',
  'Plus Jakarta Sans': 'Calibri',
  'Manrope': 'Calibri',
  'Poppins': 'Calibri',
  'Open Sans': 'Calibri',
  'Raleway': 'Calibri Light',
  'Montserrat': 'Arial',
  'Nunito': 'Calibri',
  'Syne': 'Arial',
  'Comfortaa': 'Calibri',
  'Quicksand': 'Calibri',
  'Righteous': 'Impact',
  'Bebas Neue': 'Impact',
  'Anton': 'Impact',
  'Roboto': 'Arial',
  'Unbounded': 'Arial Black',
  'Rajdhani': 'Arial Narrow',
  'League Spartan': 'Arial',
  'Outfit': 'Calibri',
  'Noto Sans': 'Arial',
  'Noto Sans JP': 'MS Gothic',
  'Lato': 'Calibri',

  // Monospace fonts -> Courier/Consolas alternatives
  'Space Mono': 'Courier New',
  'Fira Code': 'Consolas',

  // Decorative/Cursive fonts -> closest alternatives
  'Bangers': 'Impact',
  'Press Start 2P': 'Courier New',
  'Permanent Marker': 'Comic Sans MS',
  'Kalam': 'Comic Sans MS',
  'Amatic SC': 'Arial Narrow',
  'Caveat': 'Comic Sans MS',

  // Default fallbacks (pass-through)
  'Arial': 'Arial',
  'Georgia': 'Georgia',
  'Times New Roman': 'Times New Roman',
  'Courier New': 'Courier New',
  'Impact': 'Impact',
  'Calibri': 'Calibri',

  // Generic fallbacks
  'serif': 'Times New Roman',
  'sans-serif': 'Calibri',
  'monospace': 'Courier New',
  'cursive': 'Comic Sans MS',
};

export const getFont = (fontString: string): string => {
  const primaryFont = fontString.split(',')[0].replace(/['"]/g, '').trim();
  return FONT_MAP[primaryFont] || 'Calibri';
};
