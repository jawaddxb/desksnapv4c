
import { THEMES } from '../config/themes';
import { Type } from "@google/genai";
import { GenerationMode } from '@/types';

// --- HELPERS ---

// Memoized theme options to avoid recalculating on every generation
let cachedThemeOptions: string | null = null;
export const getThemeOptions = () => {
    if (!cachedThemeOptions) {
        cachedThemeOptions = Object.values(THEMES)
            .map(t => `- ID: "${t.id}" | Name: ${t.name} | Style Description: ${t.description}`)
            .join('\n');
    }
    return cachedThemeOptions;
};

export const getGenerationModeInstruction = (mode: GenerationMode) => {
  switch(mode) {
    case 'concise': 
        return "LENGTH CONSTRAINT: Create a short, high-impact deck of 5-8 slides. Focus strictly on key takeaways and eliminate fluff. Merge related concepts.";
    case 'balanced': 
        return "LENGTH CONSTRAINT: Create a standard deck of approximately 10-12 slides. Balance depth with brevity. Ensure a complete narrative arc.";
    case 'detailed': 
        return "LENGTH CONSTRAINT: Create an in-depth, detailed deck. Expand on the provided topic significantly to cover nuances. Target 15+ slides if possible.";
    case 'verbatim': 
        return "CONTENT CONSTRAINT: Use the user's provided text input EXACTLY for the content. Do not summarize, rephrase, or rewrite the core message. Split the provided text logically across multiple slides to ensure readability, but preserve the original wording as much as possible in the bullet points.";
    default: 
        return "";
  }
};

// --- PROMPT TEMPLATES ---

export const REFINEMENT_INSTRUCTIONS = {
    lighting: "Change the lighting direction, intensity, or quality (e.g., golden hour, dramatic rim light, soft overcast, neon cinematic) to alter the mood while keeping the subject identical.",
    camera: "Change the camera angle, focal length, or perspective (e.g., drone shot, macro close-up, wide-angle, low angle hero shot) to present the subject in a new way.",
    composition: "Re-arrange the composition (e.g., rule of thirds, symmetry, negative space, dynamic diagonals) to create a stronger visual impact while keeping the subject consistent.",
    mood: "Alter the emotional atmosphere (e.g., mysterious, energetic, calm, ominous, ethereal) through color grading and weather effects.",
    general: "Create a fresh variation of the same scene. Keep the core subject and style, but subtly shift the camera, lighting, and composition for a new look."
};

export const SYSTEM_INSTRUCTION_VISUAL_DIRECTOR = `Act as a world-class Visual Director and Lead Prompt Engineer for high-end commercial design.
Your goal is to create a stunning, highly visual presentation plan.

Step 1: ESTABLISH UI THEME
Review the available Themes and select the ONE that best fits the vibe of the requested topic.

Step 2: ESTABLISH VISUAL DIRECTION
Determine the best 'visualStyle' prompt that matches its Art Direction.

Step 3: CREATE VISUAL STORYBOARD (Crucial Step)
You are not just generating slides; you are creating a cohesive visual narrative.

*Translation Rule (CRITICAL)*: 
The user is VERY sensitive to the "Subject Matter". 
- If style is 'Studio Photo', 'Cinematic', 'Analog Film', or 'Streetwear': YOU MUST DESCRIBE PEOPLE, PLACES, or PHYSICAL OBJECTS. 
- NEVER describe "abstract concepts" (like glowing nodes, floating brains, digital networks) for these realistic styles.

Step 4: ASSIGN ORGANIC LAYOUTS
For each slide, choose the layout that fits the CONTENT TYPE and EMOTIONAL BEAT.
Layout Options: 'split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'.
- split: Classic two-column (text + image side by side)
- full-bleed: Full-screen image with text overlay
- statement: Hero text above smaller image
- gallery: Image-dominant with metadata
- card: Centered card with backdrop image
- horizontal: Stacked (image top, text bottom)
- magazine: Asymmetric editorial layout
*Rhythm Rule*: Do NOT use the same layout 3 times in a row.

Step 5: CONSTRUCT SLIDES
For each slide, provide:
- title
- bulletPoints (3-4 max)
- speakerNotes
- layoutType & alignment
- imageVisualDescription (MASTER-LEVEL GENERATIVE PROMPT).

Use this **Layered Formula** for images:
1. [Subject] The core object/scene tailored to the Art Direction.
2. [Action] How it moves or sits.
3. [Lighting] Specific lighting setup.
4. [Composition] Camera angle.`;

// --- SCHEMAS ---

export const PRESENTATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: "The main topic of the presentation" },
      visualStyle: { type: Type.STRING, description: "The detailed prompt style string for images" },
      themeId: { type: Type.STRING, description: "The exact ID of the chosen theme from the provided list" },
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            speakerNotes: { type: Type.STRING },
            imageVisualDescription: { type: Type.STRING, description: "A comma-separated complex image prompt describing the SUBJECT only" },
            layoutType: {
                type: Type.STRING,
                enum: ['split', 'full-bleed', 'statement', 'gallery', 'card', 'horizontal', 'magazine'],
                description: "The structural layout of the slide"
            },
            alignment: {
                type: Type.STRING,
                enum: ['left', 'right', 'center'],
                description: "Content alignment for organic flow"
            }
          },
          required: ["title", "bulletPoints", "speakerNotes", "imageVisualDescription", "layoutType", "alignment"]
        }
      }
    },
    required: ["topic", "visualStyle", "themeId", "slides"]
};

// ============================================================================
// CONTENT DECONSTRUCTION (for pasted content → ideation map)
// ============================================================================

export const CONTENT_DECONSTRUCTION_PROMPT = `You are a Creative Director analyzing content for a presentation. Your task is to deconstruct the user's pasted content into a structured ideation map.

Organize the content into the 5-column narrative framework:
1. **Hook** (column 0) - Attention-grabbing opening points, surprising facts, or compelling questions
2. **Problem** (column 1) - Pain points, challenges, issues, or problems being addressed
3. **Solution** (column 2) - Proposed solutions, approaches, methods, or recommendations
4. **Proof** (column 3) - Evidence, data, statistics, case studies, testimonials, or examples
5. **CTA** (column 4) - Call-to-action, next steps, conclusions, or key takeaways

For each point extracted, create a note with:
- content: The key point (1-2 sentences, preserving the user's original phrasing where possible)
- column: 0-4 (matching the framework above)
- reasoning: A brief explanation of why you placed it in this column

Also provide your creative thinking as a journal entry that explains your analysis process.

Return JSON in this exact format:
{
  "topic": "Inferred presentation topic from the content",
  "notes": [
    {
      "content": "The extracted point",
      "column": 0,
      "reasoning": "Why this belongs in Hook"
    }
  ],
  "connections": [
    { "fromIndex": 0, "toIndex": 1 }
  ],
  "journalEntry": {
    "title": "Analyzing Your Content",
    "narrative": "I read through your content and identified the core message about [topic]. The content naturally organizes into [X] key points. I noticed strong evidence in [area] and opportunities to strengthen [area]...",
    "stage": "analyzing"
  }
}

Important guidelines:
- Extract ALL meaningful points from the content, don't skip important information
- Preserve the user's voice and key phrases where possible
- Create logical connections between related notes (e.g., problem → solution)
- If content doesn't fit a column naturally, use your best judgment
- Be thorough but avoid creating redundant notes`;

export const CONTENT_DECONSTRUCTION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING, description: "Inferred topic from the content" },
        notes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    content: { type: Type.STRING, description: "The extracted point" },
                    column: { type: Type.NUMBER, description: "Column index 0-4" },
                    reasoning: { type: Type.STRING, description: "Why this column" }
                },
                required: ["content", "column", "reasoning"]
            }
        },
        connections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    fromIndex: { type: Type.NUMBER },
                    toIndex: { type: Type.NUMBER }
                },
                required: ["fromIndex", "toIndex"]
            }
        },
        journalEntry: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                narrative: { type: Type.STRING },
                stage: { type: Type.STRING }
            },
            required: ["title", "narrative", "stage"]
        }
    },
    required: ["topic", "notes", "journalEntry"]
};

// ============================================================================
// CREATIVE DIRECTOR'S JOURNAL PROMPTS
// ============================================================================

export const JOURNAL_NARRATIVE_PROMPTS = {
    theme_selection: `Write a 2-3 sentence narrative explaining why you chose this theme. Be warm and collaborative, like a creative director explaining their vision to a client. Mention what you noticed about their content and why this theme fits. Example: "Looking at your content about [topic], I felt the [theme] aesthetic would really make your message shine. The [specific quality] captures the [mood/tone] you're going for..."`,

    layout_decision: `Write a 2-3 sentence narrative explaining the layout choices. Describe the visual rhythm you created and why certain slides got certain layouts. Example: "I designed a visual flow that builds momentum—starting with a bold full-bleed to grab attention, then alternating between split and statement layouts to give your audience breathing room between key points..."`,

    content_structure: `Write a 2-3 sentence narrative about how you structured the content flow. Explain the storytelling arc from Hook to CTA. Example: "Your presentation tells a compelling story: we open with a surprising hook about [topic], then walk through the challenges your audience faces before revealing your solution..."`,

    image_direction: `Write a 2-3 sentence narrative about the visual direction for images. Describe the mood, style, and cohesion you're aiming for. Example: "For the imagery, I'm going with [style] to create a [mood] atmosphere throughout. Each image builds on the visual theme while highlighting the specific message of its slide..."`,

    deconstruction_analysis: `Write a 2-3 sentence narrative about how you analyzed and organized the pasted content. Explain what patterns you found and how you structured them. Example: "I worked through your content and found [X] key themes emerging. The strongest evidence points naturally fall into the Proof column, while your core recommendations make compelling Solution points..."`
};
