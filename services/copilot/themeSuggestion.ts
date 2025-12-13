/**
 * Theme Suggestion Service
 *
 * Analyzes ideation session content and suggests the best visual theme.
 * Extracted from copilotAgent.ts for better SRP.
 */

import { GoogleGenAI } from '@google/genai';
import { IdeationSession, ThemeSuggestion, COLUMNS, JournalEntry } from '../../types/ideation';
import { THEMES, THEME_CATEGORIES } from '../../config/themes';
import { getTextModel } from '../../config';
import { createJournalEntry } from './journalHelpers';

/**
 * Extended theme suggestion with journal entry
 */
export interface ThemeSuggestionWithJournal extends ThemeSuggestion {
  journalEntry: JournalEntry;
}

/**
 * Suggest a theme based on ideation session content.
 * FIRST STEP of the split conversion flow - analyzes content and suggests best theme.
 * Includes a Creative Director's Journal entry explaining the decision.
 */
export async function suggestThemeForSession(
  session: IdeationSession
): Promise<ThemeSuggestionWithJournal> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Build context from notes organized by column
  const notesContext = session.notes
    .map(n => `[${COLUMNS[n.column]}] ${n.content}`)
    .join('\n');

  const prompt = `You are a visual design expert. Analyze the ideation notes and recommend the best presentation theme.

## Presentation Topic
${session.topic}

## Ideation Notes
${notesContext}

## Available Themes

### Core (Modern Essentials)
${Object.values(THEME_CATEGORIES.core).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Business & Tech
${Object.values(THEME_CATEGORIES.business).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Luxury & Fashion
${Object.values(THEME_CATEGORIES.luxury).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Nature & Organic
${Object.values(THEME_CATEGORIES.nature).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Retro & Vintage
${Object.values(THEME_CATEGORIES.retro).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

### Artistic & Experimental
${Object.values(THEME_CATEGORIES.artistic).map(t => `- ${t.id}: ${t.name} - ${t.description}`).join('\n')}

## Your Task
1. Analyze the topic and notes to understand the content's tone, audience, and purpose
2. Select the ONE theme that best matches the content
3. Explain WHY in 1-2 sentences
4. Suggest 2-3 alternatives from DIFFERENT categories

Return JSON:
{
  "themeId": "exact_theme_id",
  "reasoning": "Brief explanation of why this theme fits the content and audience",
  "visualStyleHint": "Brief visual direction (e.g., 'Professional photography with blue tones')",
  "alternativeIds": ["alt1", "alt2", "alt3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: getTextModel(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response');

    const suggestion = JSON.parse(text) as ThemeSuggestion;

    // Validate themeId exists
    if (!THEMES[suggestion.themeId]) {
      suggestion.themeId = 'executive';
    }

    // Validate alternativeIds
    if (suggestion.alternativeIds) {
      suggestion.alternativeIds = suggestion.alternativeIds.filter(id => THEMES[id]);
    }

    // Create journal entry for theme selection
    const theme = THEMES[suggestion.themeId];
    const journalEntry = createJournalEntry(
      'deciding',
      'Selecting Your Visual Theme',
      `Looking at your content about "${session.topic}", I felt the ${theme?.name || suggestion.themeId} aesthetic would really make your message shine. ${suggestion.reasoning}${suggestion.alternativeIds?.length ? ` I also considered ${suggestion.alternativeIds.map(id => THEMES[id]?.name || id).join(', ')} as alternatives.` : ''}`,
      {
        decision: theme?.name || suggestion.themeId,
        alternatives: suggestion.alternativeIds?.map(id => THEMES[id]?.name || id),
        confidence: 85,
        relatedNoteIds: session.notes.map(n => n.id),
      }
    );

    return {
      ...suggestion,
      journalEntry,
    };
  } catch (error) {
    console.error('[suggestThemeForSession] Error:', error);
    // Fallback suggestion with journal entry
    const fallbackJournalEntry = createJournalEntry(
      'deciding',
      'Selecting Your Visual Theme',
      `For "${session.topic}", I'm recommending the Executive theme - a professional, versatile choice that works well for most presentations. It has clean lines and a corporate aesthetic that gives your content authority.`,
      {
        decision: 'Executive',
        alternatives: ['Startup', 'Minimalist', 'Swiss'],
        confidence: 70,
      }
    );

    return {
      themeId: 'executive',
      reasoning: 'A professional, versatile theme suitable for most presentations.',
      visualStyleHint: 'Clean corporate photography with modern aesthetics',
      alternativeIds: ['startup', 'minimalist', 'swiss'],
      journalEntry: fallbackJournalEntry,
    };
  }
}
