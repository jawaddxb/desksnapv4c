/**
 * Deck Conversion Service
 *
 * Converts ideation sessions into presentation deck plans.
 * Extracted from copilotAgent.ts for better SRP.
 */

import { Type } from '@google/genai';
import { getAIClient } from '../aiClient';
import { parseAIJsonResponse } from '../ai/parseJson';
import { PresentationPlanResponse } from '../../types';
import { IdeationSession, COLUMNS, JournalEntry } from '../../types/ideation';
import { THEMES } from '../../config/themes';
import { getTextModel } from '../../config';
import { createJournalEntry } from './journalHelpers';

// Schema for deck plan conversion - ensures proper JSON escaping
const DECK_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "The main topic of the presentation" },
    visualStyle: { type: Type.STRING, description: "The visual style prompt for images" },
    themeId: { type: Type.STRING, description: "The ID of the selected theme" },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Compelling slide title" },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-4 key points" },
          speakerNotes: { type: Type.STRING, description: "Speaker notes (2-3 sentences)" },
          imageVisualDescription: { type: Type.STRING, description: "Visual description for image generation" },
          layoutType: {
            type: Type.STRING,
            enum: ['split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'],
            description: "The structural layout of the slide"
          },
          alignment: {
            type: Type.STRING,
            enum: ['left', 'right', 'center'],
            description: "Content alignment"
          }
        },
        required: ["title", "bulletPoints", "speakerNotes", "imageVisualDescription", "layoutType", "alignment"]
      }
    }
  },
  required: ["topic", "slides"]
};

/**
 * Slide data structure
 */
export interface SlideData {
  title: string;
  bulletPoints: string[];
  speakerNotes: string;
  imageVisualDescription: string;
  layoutType: string;
  alignment: string;
}

/**
 * Deck plan result
 */
export interface DeckPlan {
  topic: string;
  slides: SlideData[];
  themeId: string;
  visualStyle: string;
}

/**
 * Deck plan result with journal entries
 */
export interface DeckPlanWithJournal extends DeckPlan {
  journalEntries: JournalEntry[];
}

/**
 * Convert session to deck plan for building
 */
export async function convertSessionToDeckPlan(
  session: IdeationSession
): Promise<DeckPlan> {
  const ai = getAIClient();

  // Build context from all notes
  const notesContext = session.notes
    .map(n => `[${n.column}] ${n.content}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `Convert these ideation notes into a presentation plan.

Topic: ${session.topic}

Notes:
${notesContext}

Create a structured presentation with 6-12 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual description for image generation
- layoutType: One of: split, full-bleed, statement, gallery, card
- alignment: left, right, or center

Also suggest:
- themeId: A theme that fits (e.g., startup, enterprise, luxury, minimalist)
- visualStyle: Image style prompt (e.g., "Professional photography, corporate setting")

Return as JSON.`,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text?.replace(/```json|```/g, '').trim();
  if (!text) throw new Error('Failed to generate deck plan');

  return JSON.parse(text);
}

/**
 * Convert session to deck plan WITH a pre-selected theme.
 * SECOND STEP of the split conversion flow - uses the user's confirmed theme choice.
 * Includes Creative Director's Journal entries for layout and content decisions.
 */
export async function convertSessionToDeckPlanWithTheme(
  session: IdeationSession,
  themeId: string
): Promise<DeckPlanWithJournal> {
  const ai = getAIClient();

  // Get theme's bundled visual style
  const theme = THEMES[themeId] || THEMES.executive;
  const visualStyle = theme.imageStyle;

  // Build context from all notes
  const notesContext = session.notes
    .map(n => `[${COLUMNS[n.column]}] ${n.content}`)
    .join('\n');

  const response = await ai.models.generateContent({
    model: getTextModel(),
    contents: `Convert these ideation notes into a presentation plan.

Topic: ${session.topic}
Selected Theme: ${themeId} - ${theme.name}
Theme Description: ${theme.description}
Visual Style: ${visualStyle}

Notes:
${notesContext}

Create a structured presentation with 6-12 slides. For each slide provide:
- title: Compelling slide title
- bulletPoints: 2-4 key points (array of strings)
- speakerNotes: What to say (2-3 sentences)
- imageVisualDescription: Visual description that matches the "${theme.name}" theme style: ${visualStyle}
- layoutType: One of: split, full-bleed, statement, gallery, card
- alignment: left, right, or center

IMPORTANT: The imageVisualDescription should match the theme's visual style: ${visualStyle}

Return as JSON with structure:
{
  "topic": "...",
  "slides": [...],
  "themeId": "${themeId}",
  "visualStyle": "${visualStyle}"
}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: DECK_PLAN_SCHEMA,
    },
  });

  // Use parseAIJsonResponse for robust JSON parsing with repair logic
  const result = parseAIJsonResponse<PresentationPlanResponse>(response.text);
  // Ensure themeId and visualStyle are preserved
  result.themeId = themeId;
  result.visualStyle = visualStyle;

  // Generate journal entries for the deck plan
  const journalEntries: JournalEntry[] = [];

  // Layout decision journal entry
  const layoutCounts: Record<string, number> = {};
  result.slides.forEach((slide: { layoutType: string }) => {
    layoutCounts[slide.layoutType] = (layoutCounts[slide.layoutType] || 0) + 1;
  });
  const layoutSummary = Object.entries(layoutCounts)
    .map(([layout, count]) => `${count} ${layout}`)
    .join(', ');

  journalEntries.push(createJournalEntry(
    'creating',
    'Designing Your Visual Flow',
    `I designed a ${result.slides.length}-slide presentation with a visual rhythm that keeps your audience engaged. The layout mix includes ${layoutSummary} layouts. I started with a ${result.slides[0]?.layoutType || 'statement'} layout to make a strong first impression, then varied the layouts to create visual interest while maintaining your message's flow.`,
    {
      decision: `${result.slides.length} slides with ${Object.keys(layoutCounts).length} layout types`,
      relatedSlideIds: result.slides.map((_: unknown, i: number) => `slide-${i}`),
    }
  ));

  // Content structure journal entry
  journalEntries.push(createJournalEntry(
    'creating',
    'Structuring Your Content',
    `Your presentation tells a compelling story: we open with "${result.slides[0]?.title || 'an introduction'}", build through the key points, and conclude with "${result.slides[result.slides.length - 1]?.title || 'a call to action'}". Each slide flows naturally from the last, creating a narrative arc that will resonate with your audience.`,
    {
      relatedNoteIds: session.notes.map(n => n.id),
    }
  ));

  // Image direction journal entry
  journalEntries.push(createJournalEntry(
    'creating',
    'Setting the Visual Direction',
    `For the imagery, I'm using the ${theme.name} aesthetic with ${visualStyle}. This creates a cohesive visual language throughout your presentation. Each image is designed to reinforce the message of its slide while maintaining the overall professional look.`,
    {
      decision: visualStyle,
    }
  ));

  return {
    ...result,
    journalEntries,
  };
}
