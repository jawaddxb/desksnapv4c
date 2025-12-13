/**
 * Deck Helper Functions
 *
 * Pure functions for creating slides and presentations from plans.
 * Extracted to reduce duplication between createDeck and createDeckFromPlan.
 */

import { Slide, Presentation } from '@/types';

export interface SlidePlan {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
  imageVisualDescription: string;
  layoutType: string;
  alignment: string;
  existingImageUrl?: string;
}

export interface PresentationPlan {
  topic: string;
  slides: SlidePlan[];
  themeId: string;
  visualStyle: string;
}

/**
 * Create slides from a plan.
 */
export function createSlidesFromPlan(slides: SlidePlan[]): Slide[] {
  return slides.map((s, i) => ({
    id: `slide-${i}`,
    title: s.title,
    content: s.bulletPoints,
    speakerNotes: s.speakerNotes,
    imagePrompt: s.imageVisualDescription,
    imageUrl: s.existingImageUrl,
    isImageLoading: !s.existingImageUrl,
    layoutType: s.layoutType as Slide['layoutType'],
    alignment: s.alignment as Slide['alignment'],
    fontScale: 'auto' as const,
    layoutVariant: Math.floor(Math.random() * 1000),
  }));
}

/**
 * Create a new presentation object.
 */
export function createPresentation(
  topic: string,
  slides: Slide[],
  themeId: string,
  visualStyle: string,
  wabiSabiLayout: string
): Presentation {
  return {
    id: crypto.randomUUID(),
    lastModified: Date.now(),
    topic,
    visualStyle,
    themeId,
    slides,
    wabiSabiLayout,
    analytics: [],
  };
}

/**
 * Export a presentation to a downloadable JSON file.
 */
export function exportPresentationToFile(presentation: Presentation): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
    JSON.stringify(presentation, null, 2)
  );
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `${presentation.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

/**
 * Parse and validate an imported presentation file.
 */
export async function parseImportedDeck(file: File): Promise<Presentation> {
  const text = await file.text();
  const deck = JSON.parse(text) as Presentation;

  // Basic validation
  if (!deck.id || !deck.slides) {
    throw new Error("Invalid deck format");
  }

  // Ensure ID is unique to avoid collision
  deck.id = crypto.randomUUID();
  deck.lastModified = Date.now();
  if (!deck.analytics) deck.analytics = [];

  return deck;
}
