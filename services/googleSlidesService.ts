/**
 * Google Slides Export Service
 *
 * Exports DeckSnap presentations to Google Slides using the Google Slides API.
 * Handles slide creation, layout mapping, image upload, and speaker notes.
 */

import type { Presentation, Theme, Slide, LayoutType } from '@/types';
import { ensureAuthenticated, isGoogleAuthenticated as checkAuth, getAccessToken, isGoogleConfigured } from './googleAuthService';

// Re-export auth checks for ExportMenu
export { checkAuth as isGoogleAuthenticated, isGoogleConfigured };

export interface GoogleSlidesProgress {
  currentSlide: number;
  totalSlides: number;
  phase: 'preparing' | 'creating' | 'uploading' | 'complete' | 'error';
  message?: string;
}

export interface GoogleSlidesResult {
  presentationId: string;
  url: string;
}

// =============================================================================
// FONT MAPPING: Google Fonts -> Google Slides safe equivalents
// =============================================================================

const FONT_MAP: Record<string, string> = {
  // Display/Serif fonts
  'Abril Fatface': 'Georgia',
  'Playfair Display': 'Playfair Display', // Available in Google Slides
  'Cormorant Garamond': 'EB Garamond',
  'Libre Baskerville': 'Libre Baskerville',
  'Crimson Text': 'Crimson Text',
  'Merriweather': 'Merriweather',
  'DM Serif Display': 'DM Serif Display',
  'Lora': 'Lora',
  'Newsreader': 'Georgia',
  'Source Serif 4': 'Source Serif Pro',

  // Sans-serif fonts
  'Space Grotesk': 'Space Grotesk',
  'DM Sans': 'DM Sans',
  'Inter': 'Inter',
  'Oswald': 'Oswald',
  'Work Sans': 'Work Sans',
  'Plus Jakarta Sans': 'Plus Jakarta Sans',
  'Manrope': 'Manrope',
  'Poppins': 'Poppins',
  'Open Sans': 'Open Sans',
  'Raleway': 'Raleway',
  'Montserrat': 'Montserrat',
  'Nunito': 'Nunito',
  'Roboto': 'Roboto',
  'Lato': 'Lato',
  'Outfit': 'Outfit',

  // Monospace fonts
  'Space Mono': 'Space Mono',
  'Fira Code': 'Fira Mono',

  // Decorative fonts
  'Caveat': 'Caveat',
  'Permanent Marker': 'Permanent Marker',

  // Defaults
  'Arial': 'Arial',
  'Georgia': 'Georgia',
  'serif': 'Georgia',
  'sans-serif': 'Arial',
  'monospace': 'Courier New',
};

const getFont = (fontString: string): string => {
  const primaryFont = fontString.split(',')[0].replace(/['"]/g, '').trim();
  return FONT_MAP[primaryFont] || 'Arial';
};

// =============================================================================
// COLOR UTILITIES
// =============================================================================

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

function parseColorToRgb(colorString: string): RgbColor {
  if (!colorString) return { red: 0, green: 0, blue: 0 };

  // Handle rgba/rgb
  const rgbaMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbaMatch) {
    return {
      red: parseInt(rgbaMatch[1]) / 255,
      green: parseInt(rgbaMatch[2]) / 255,
      blue: parseInt(rgbaMatch[3]) / 255,
    };
  }

  // Handle hex
  let hex = colorString.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    return {
      red: parseInt(hex.slice(0, 2), 16) / 255,
      green: parseInt(hex.slice(2, 4), 16) / 255,
      blue: parseInt(hex.slice(4, 6), 16) / 255,
    };
  }

  return { red: 0, green: 0, blue: 0 };
}

// =============================================================================
// LAYOUT MAPPING
// =============================================================================

interface SlideLayout {
  titlePosition: { x: number; y: number; w: number; h: number };
  contentPosition: { x: number; y: number; w: number; h: number };
  imagePosition?: { x: number; y: number; w: number; h: number };
}

// Positions in EMU (English Metric Units) - 914400 EMU = 1 inch
// Slide dimensions: 10 inches x 5.625 inches (16:9 aspect ratio)
const EMU_PER_INCH = 914400;
const SLIDE_WIDTH = 10 * EMU_PER_INCH;
const SLIDE_HEIGHT = 5.625 * EMU_PER_INCH;

const LAYOUT_CONFIGS: Record<LayoutType, SlideLayout> = {
  'split': {
    titlePosition: { x: 0.5, y: 0.5, w: 4.5, h: 1 },
    contentPosition: { x: 0.5, y: 1.6, w: 4.5, h: 3.5 },
    imagePosition: { x: 5.25, y: 0.5, w: 4.25, h: 4.625 },
  },
  'full-bleed': {
    titlePosition: { x: 0.5, y: 2, w: 5, h: 1.2 },
    contentPosition: { x: 0.5, y: 3.3, w: 5, h: 1.8 },
    imagePosition: { x: 0, y: 0, w: 10, h: 5.625 }, // Full background
  },
  'statement': {
    titlePosition: { x: 0.5, y: 0.8, w: 9, h: 1.5 },
    contentPosition: { x: 0.5, y: 2.4, w: 9, h: 0.8 },
    imagePosition: { x: 1, y: 3.4, w: 8, h: 2 },
  },
  'gallery': {
    titlePosition: { x: 0.5, y: 3.8, w: 4, h: 0.8 },
    contentPosition: { x: 4.75, y: 3.8, w: 4.75, h: 1.3 },
    imagePosition: { x: 0.5, y: 0.4, w: 9, h: 3.2 },
  },
  'card': {
    titlePosition: { x: 2.5, y: 1.5, w: 5, h: 0.8 },
    contentPosition: { x: 2.5, y: 2.4, w: 5, h: 2 },
    imagePosition: { x: 0, y: 0, w: 10, h: 5.625 }, // Background
  },
  'horizontal': {
    titlePosition: { x: 0.5, y: 2.8, w: 9, h: 0.8 },
    contentPosition: { x: 0.5, y: 3.7, w: 9, h: 1.5 },
    imagePosition: { x: 0.5, y: 0.4, w: 9, h: 2.2 },
  },
  'magazine': {
    titlePosition: { x: 3.75, y: 0.5, w: 5.75, h: 1 },
    contentPosition: { x: 3.75, y: 1.6, w: 5.75, h: 3.5 },
    imagePosition: { x: 0.5, y: 0.5, w: 3, h: 4.625 },
  },
};

function inchesToEmu(inches: number): number {
  return Math.round(inches * EMU_PER_INCH);
}

// =============================================================================
// GOOGLE SLIDES API HELPERS
// =============================================================================

async function createPresentation(title: string): Promise<string> {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to create presentation');
  }

  const data = await response.json();
  return data.presentationId;
}

async function uploadImageToDrive(imageUrl: string): Promise<string | null> {
  const token = getAccessToken();
  if (!token) return null;

  try {
    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return null;

    const blob = await imageResponse.blob();

    // Create file metadata
    const metadata = {
      name: `slide_image_${Date.now()}.jpg`,
      mimeType: 'image/jpeg',
    };

    // Create form data for multipart upload
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    // Upload to Drive
    const uploadResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      }
    );

    if (!uploadResponse.ok) return null;

    const data = await uploadResponse.json();

    // Make the file publicly readable
    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });

    return data.id;
  } catch (error) {
    console.error('Image upload failed:', error);
    return null;
  }
}

async function batchUpdatePresentation(presentationId: string, requests: unknown[]): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update presentation');
  }
}

// =============================================================================
// SLIDE CREATION
// =============================================================================

function createTextElement(
  objectId: string,
  text: string,
  position: { x: number; y: number; w: number; h: number },
  fontFamily: string,
  fontSize: number,
  color: RgbColor,
  bold: boolean = false
): unknown[] {
  return [
    {
      createShape: {
        objectId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: objectId.replace(/_\w+$/, ''),
          size: {
            width: { magnitude: inchesToEmu(position.w), unit: 'EMU' },
            height: { magnitude: inchesToEmu(position.h), unit: 'EMU' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: inchesToEmu(position.x),
            translateY: inchesToEmu(position.y),
            unit: 'EMU',
          },
        },
      },
    },
    {
      insertText: {
        objectId,
        text,
        insertionIndex: 0,
      },
    },
    {
      updateTextStyle: {
        objectId,
        style: {
          fontFamily,
          fontSize: { magnitude: fontSize, unit: 'PT' },
          foregroundColor: { opaqueColor: { rgbColor: color } },
          bold,
        },
        textRange: { type: 'ALL' },
        fields: 'fontFamily,fontSize,foregroundColor,bold',
      },
    },
  ];
}

async function createSlide(
  presentationId: string,
  slide: Slide,
  theme: Theme,
  slideIndex: number,
  imageFileId: string | null
): Promise<string> {
  const slideId = `slide_${slideIndex}`;
  const layout = LAYOUT_CONFIGS[slide.layoutType] || LAYOUT_CONFIGS['split'];

  const requests: unknown[] = [];

  // Create slide
  requests.push({
    createSlide: {
      objectId: slideId,
      insertionIndex: slideIndex,
      slideLayoutReference: {
        predefinedLayout: 'BLANK',
      },
    },
  });

  // Set background color
  const bgColor = parseColorToRgb(theme.colors.background);
  requests.push({
    updatePageProperties: {
      objectId: slideId,
      pageProperties: {
        pageBackgroundFill: {
          solidFill: {
            color: { rgbColor: bgColor },
          },
        },
      },
      fields: 'pageBackgroundFill.solidFill.color',
    },
  });

  await batchUpdatePresentation(presentationId, requests);

  // Add content elements
  const contentRequests: unknown[] = [];
  const textColor = parseColorToRgb(theme.colors.text);
  const headingFont = getFont(theme.fonts.heading);
  const bodyFont = getFont(theme.fonts.body);

  // Add title
  const titleId = `${slideId}_title`;
  contentRequests.push(
    ...createTextElement(
      titleId,
      slide.title,
      layout.titlePosition,
      headingFont,
      32,
      textColor,
      true
    )
  );

  // Add content bullets
  if (slide.content.length > 0) {
    const contentId = `${slideId}_content`;
    const contentText = slide.content.map(item => `• ${item}`).join('\n');
    contentRequests.push(
      ...createTextElement(
        contentId,
        contentText,
        layout.contentPosition,
        bodyFont,
        16,
        textColor,
        false
      )
    );
  }

  // Add image if available
  if (imageFileId && layout.imagePosition) {
    const imageId = `${slideId}_image`;
    const isBackground = slide.layoutType === 'full-bleed' || slide.layoutType === 'card';

    contentRequests.push({
      createImage: {
        objectId: imageId,
        url: `https://drive.google.com/uc?id=${imageFileId}`,
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: inchesToEmu(layout.imagePosition.w), unit: 'EMU' },
            height: { magnitude: inchesToEmu(layout.imagePosition.h), unit: 'EMU' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: inchesToEmu(layout.imagePosition.x),
            translateY: inchesToEmu(layout.imagePosition.y),
            unit: 'EMU',
          },
        },
      },
    });

    // For background images, send to back
    if (isBackground) {
      contentRequests.push({
        updatePageElementTransform: {
          objectId: imageId,
          applyMode: 'RELATIVE',
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 0,
            translateY: 0,
            unit: 'EMU',
          },
        },
      });
    }
  }

  if (contentRequests.length > 0) {
    await batchUpdatePresentation(presentationId, contentRequests);
  }

  // Add speaker notes if present
  if (slide.speakerNotes) {
    await addSpeakerNotes(presentationId, slideId, slide.speakerNotes);
  }

  return slideId;
}

async function addSpeakerNotes(
  presentationId: string,
  slideId: string,
  notes: string
): Promise<void> {
  const token = getAccessToken();
  if (!token) return;

  // Get the slide to find the notes page object ID
  const response = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${slideId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!response.ok) return;

  const slideData = await response.json();
  const notesId = slideData.slideProperties?.notesPage?.notesProperties?.speakerNotesObjectId;

  if (notesId) {
    await batchUpdatePresentation(presentationId, [
      {
        insertText: {
          objectId: notesId,
          text: notes,
          insertionIndex: 0,
        },
      },
    ]);
  }
}

async function deleteInitialSlide(presentationId: string): Promise<void> {
  // Get the presentation to find the initial slide
  const token = getAccessToken();
  if (!token) return;

  const response = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!response.ok) return;

  const data = await response.json();
  const slides = data.slides || [];

  // Find and delete slides that aren't ours (slides without our naming convention)
  const slidesToDelete = slides
    .filter((s: { objectId: string }) => !s.objectId.startsWith('slide_'))
    .map((s: { objectId: string }) => s.objectId);

  if (slidesToDelete.length > 0) {
    await batchUpdatePresentation(
      presentationId,
      slidesToDelete.map((objectId: string) => ({ deleteObject: { objectId } }))
    );
  }
}

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

export async function exportToGoogleSlides(
  presentation: Presentation,
  theme: Theme,
  onProgress?: (progress: GoogleSlidesProgress) => void
): Promise<GoogleSlidesResult> {
  try {
    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
      message: 'Authenticating with Google...',
    });

    // Ensure authenticated
    await ensureAuthenticated();

    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'creating',
      message: 'Creating presentation...',
    });

    // Create the presentation
    const presentationId = await createPresentation(presentation.topic);

    // Process each slide
    for (let i = 0; i < presentation.slides.length; i++) {
      const slide = presentation.slides[i];

      onProgress?.({
        currentSlide: i + 1,
        totalSlides: presentation.slides.length,
        phase: 'uploading',
        message: `Creating slide ${i + 1} of ${presentation.slides.length}...`,
      });

      // Upload image if available
      let imageFileId: string | null = null;
      if (slide.imageUrl) {
        imageFileId = await uploadImageToDrive(slide.imageUrl);
      }

      // Create the slide
      await createSlide(presentationId, slide, theme, i, imageFileId);
    }

    // Delete the initial blank slide
    await deleteInitialSlide(presentationId);

    const url = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    onProgress?.({
      currentSlide: presentation.slides.length,
      totalSlides: presentation.slides.length,
      phase: 'complete',
      message: 'Google Slides created successfully!',
    });

    return { presentationId, url };
  } catch (error) {
    console.error('Google Slides export failed:', error);
    onProgress?.({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'error',
      message: error instanceof Error ? error.message : 'Export failed',
    });
    throw error;
  }
}
