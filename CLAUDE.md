# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeckSnap is an AI-powered presentation generator built with React 19 and Vite. It uses Gemini AI to generate slide content and images based on user prompts, with support for multiple visual themes and layout styles.

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run preview    # Preview production build
```

## Environment Setup

Create `.env.local` with your API configuration:
```
GEMINI_API_KEY=your_key_here
VITE_API_URL=http://localhost:8000
```

**Important:** A backend API server must be running at the configured `VITE_API_URL` (default: `http://localhost:8000`). The frontend requires the backend for all persistence operations.

## Architecture

### Core Flow
1. User enters topic in `ChatInterface` component
2. `useDeck` hook calls `presentationPlanService.generatePresentationPlan()` to create slide structure
3. Gemini AI selects theme and generates content with image prompts
4. Images are generated asynchronously via `generateSlideImage()` using Gemini image models
5. Presentations are persisted via backend API (`services/api/presentationService.ts`)

### Key Files

- `App.tsx` - Main application shell, presentation mode, analytics tracking
- `hooks/useDeck.ts` - Core state management hook for presentations (create, save, load, delete, image generation)
- `services/presentationPlanService.ts` - Gemini AI integration for content generation
- `services/api/presentationService.ts` - API client for backend persistence
- `types.ts` - TypeScript interfaces (Slide, Presentation, Theme, Message)
- `lib/themes.ts` - 30+ visual themes with colors, fonts, and image style prompts
- `lib/prompts.ts` - AI prompt templates and JSON schema for structured output

### Component Structure

- `components/MainStage.tsx` - Slide display area or dashboard when no deck loaded
- `components/Dashboard.tsx` - Saved decks grid with import/export
- `components/ChatInterface.tsx` - AI chat for creating/editing decks
- `components/AppHeader.tsx` - Theme/typography/layout controls
- `components/AppSidebar.tsx` - Slide list and navigation
- `components/StandardLayouts.tsx` - Slide layout templates (split, full-bleed, statement, gallery)
- `components/WabiSabiStage.tsx` - Alternative artistic layout system

### Data Model

```typescript
Presentation {
  id, topic, themeId, visualStyle, slides[], analytics[]
}

Slide {
  id, title, content[], contentBlocks[], speakerNotes, imagePrompt, imageUrl,
  layoutType, alignment, fontScale, layoutVariant
}

ContentBlock (discriminated union) {
  type: 'paragraph' | 'bullets' | 'numbered' | 'quote' | 'statistic' | 'chart' | 'callout' | 'diagram'
  // Type-specific fields: text, items[], value, label, chartType, data, etc.
}
```

### Image Generation Pipeline

Uses fallback strategy with multiple Gemini models:
1. `gemini-3-pro-image-preview` (high-res 1K)
2. `gemini-2.5-flash-image` (standard)

Image prompts combine the theme's `visualStyle` with slide-specific `imagePrompt`.

### Styling

- Tailwind CSS loaded via CDN in `index.html`
- Google Fonts loaded inline for theme support
- Theme system defines colors, fonts, border radius, shadows per theme
- Z-index layering system defined in `lib/themes.ts` via `LayoutLayer` constants
