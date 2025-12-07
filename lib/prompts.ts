
import { THEMES } from './themes';
import { Type } from "@google/genai";
import { GenerationMode } from '../types';

// --- HELPERS ---

export const getThemeOptions = () => Object.values(THEMES)
    .map(t => `- ID: "${t.id}" | Name: ${t.name} | Style Description: ${t.description}`)
    .join('\n');

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
Layout Options: 'split', 'full-bleed', 'statement', 'gallery'.
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
                enum: ['split', 'full-bleed', 'statement', 'gallery'],
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
