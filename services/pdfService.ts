/**
 * PDF Export Service
 *
 * Generates high-resolution PDF exports of presentations using html2canvas and jsPDF.
 * Captures each slide at 1920x1080 resolution for pixel-perfect quality.
 */

import type { Presentation, Theme } from '@/types';
import type { ExportProgress, PDFExportOptions } from '../types/export';
import { waitForImages, waitForFonts } from '../utils/exportHelpers';
import {
  SLIDE_DIMENSIONS,
  EXPORT_EVENTS,
  EXPORT_ELEMENT_IDS,
  EXPORT_TIMING,
  EXPORT_QUALITY,
} from '../config/exportConstants';

/**
 * @deprecated Use ExportProgress from types/export.ts instead
 */
export type PDFExportProgress = ExportProgress;

// Re-export PDFExportOptions for backwards compatibility
export type { PDFExportOptions } from '../types/export';

const DEFAULT_OPTIONS: Required<Omit<PDFExportOptions, 'filename' | 'onProgress'>> = {
  width: SLIDE_DIMENSIONS.width,
  height: SLIDE_DIMENSIONS.height,
  quality: EXPORT_QUALITY.PDF_JPEG_QUALITY,
};

/**
 * Capture a slide container to canvas at specified resolution
 */
async function captureSlideToCanvas(
  container: HTMLElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  // Dynamic import for code splitting - using html2canvas-pro for oklch color support
  const html2canvas = (await import('html2canvas-pro')).default;

  // Wait for assets
  await Promise.all([waitForFonts(), waitForImages(container)]);

  // Capture with html2canvas-pro (natively supports oklch, oklab, and other modern CSS colors)
  const canvas = await html2canvas(container, {
    width,
    height,
    windowWidth: width,   // Render as if browser window is 1920px wide - ensures text wraps correctly
    windowHeight: height, // Render as if browser window is 1080px tall
    scale: 1, // Already at target resolution
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: EXPORT_TIMING.IMAGE_TIMEOUT_MS,
    // Enforce explicit pixel widths on cloned elements to ensure text wrapping works
    onclone: (_clonedDoc: Document, element: HTMLElement) => {
      // Convert textareas to styled divs for consistent PDF text rendering
      // Textareas don't calculate scrollHeight correctly in cloned/hidden DOM,
      // causing text to appear on a single line and get cut off
      const textareas = element.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        const div = _clonedDoc.createElement('div');

        // Copy computed styles from the original textarea
        const computed = window.getComputedStyle(textarea);
        div.style.cssText = textarea.style.cssText;
        div.style.fontFamily = computed.fontFamily;
        div.style.fontSize = computed.fontSize;
        div.style.fontWeight = computed.fontWeight;
        div.style.fontStyle = computed.fontStyle;
        div.style.lineHeight = computed.lineHeight;
        div.style.color = computed.color;
        div.style.textAlign = computed.textAlign;
        div.style.width = computed.width;
        div.style.maxWidth = '100%';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordBreak = 'break-word';
        div.style.overflowWrap = 'break-word';
        div.style.boxSizing = 'border-box';

        // Copy content and classes
        div.textContent = textarea.value;
        div.className = textarea.className;

        // Replace textarea with div
        textarea.parentNode?.replaceChild(div, textarea);
      });

      // Enforce explicit pixel widths on all elements
      const allElements = element.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const computed = window.getComputedStyle(el);
          const computedWidth = computed.width;
          // Set explicit width on elements that have a computed width
          if (computedWidth && computedWidth !== 'auto' && !computedWidth.includes('%')) {
            el.style.width = computedWidth;
            el.style.maxWidth = computedWidth;
            el.style.boxSizing = 'border-box';
          }
        }
      });
    },
  });

  return canvas;
}

/**
 * Generate PDF from presentation
 */
export async function generatePDF(
  presentation: Presentation,
  theme: Theme,
  viewMode: 'standard' | 'wabi-sabi',
  wabiSabiLayout: string | undefined,
  onProgress?: (progress: PDFExportProgress) => void,
  options: PDFExportOptions = {}
): Promise<void> {
  const { width, height, quality } = { ...DEFAULT_OPTIONS, ...options };
  const filename = options.filename || `${presentation.topic.replace(/[^a-z0-9]/gi, '_')}_presentation.pdf`;

  try {
    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
      message: 'Loading PDF library...',
    });

    // Dynamic import jsPDF for code splitting
    const { jsPDF } = await import('jspdf');

    // Create PDF with landscape orientation matching slide dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [width, height],
      hotfixes: ['px_scaling'],
    });

    // Get the render container (created by ExportMenu)
    const renderContainer = document.getElementById(EXPORT_ELEMENT_IDS.PDF_RENDERER);
    if (!renderContainer) {
      throw new Error('Export renderer not found. Please try again.');
    }

    // Process each slide
    for (let i = 0; i < presentation.slides.length; i++) {
      onProgress?.({
        currentSlide: i + 1,
        totalSlides: presentation.slides.length,
        phase: 'rendering',
        message: `Rendering slide ${i + 1} of ${presentation.slides.length}...`,
      });

      // Dispatch custom event to update the renderer with current slide
      const slideEvent = new CustomEvent(EXPORT_EVENTS.PDF_RENDER, {
        detail: {
          slideIndex: i,
          presentation,
          theme,
          viewMode,
          wabiSabiLayout,
        },
      });
      window.dispatchEvent(slideEvent);

      // Wait for render to complete
      await new Promise((resolve) => setTimeout(resolve, EXPORT_TIMING.SLIDE_WAIT_MS));

      // Capture the slide
      const canvas = await captureSlideToCanvas(renderContainer, width, height);

      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage([width, height], 'landscape');
      }

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', quality);
      pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    }

    onProgress?.({
      currentSlide: presentation.slides.length,
      totalSlides: presentation.slides.length,
      phase: 'compiling',
      message: 'Generating PDF file...',
    });

    // Save the PDF
    pdf.save(filename);

    onProgress?.({
      currentSlide: presentation.slides.length,
      totalSlides: presentation.slides.length,
      phase: 'complete',
      message: 'PDF exported successfully!',
    });
  } catch (error) {
    console.error('PDF export failed:', error);
    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'error',
      message: error instanceof Error ? error.message : 'PDF export failed',
    });
    throw error;
  }
}
