
import { GoogleGenAI } from "@google/genai";
import { PresentationPlanResponse, GenerationMode, ToneType, ContentRefinementType, ImageStylePreset } from "../types";
import { getThemeOptions, REFINEMENT_INSTRUCTIONS, SYSTEM_INSTRUCTION_VISUAL_DIRECTOR, PRESENTATION_SCHEMA, getGenerationModeInstruction } from "../lib/prompts";

// Helper to ensure we have a valid key for High Quality image generation
export const ensureApiKeySelection = async (): Promise<void> => {
  if (process.env.API_KEY) return;

  // @ts-ignore - Handle potential window.aistudio check safely
  const win = window as any;
  if (typeof win !== 'undefined' && win.aistudio && win.aistudio.hasSelectedApiKey && win.aistudio.openSelectKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  }
};

export type RefinementFocus = keyof typeof REFINEMENT_INSTRUCTIONS;

export const refineImagePrompt = async (originalPrompt: string, focus: RefinementFocus = 'general'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = REFINEMENT_INSTRUCTIONS[focus];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Act as a Prompt Engineer. Rewrite the following image prompt to satisfy the specific refinement goal.

      Original Prompt: "${originalPrompt}"

      Refinement Goal: ${instruction}

      Return ONLY the new prompt string, no markdown or explanations.`
  });
  return response.text?.trim() || originalPrompt;
};

// ============================================
// AI REFINEMENT ACTIONS (Pitch-inspired)
// ============================================

const TONE_INSTRUCTIONS: Record<ToneType, string> = {
  professional: 'Rewrite in a formal, confident business tone. Use precise language, avoid colloquialisms, and maintain authority.',
  casual: 'Rewrite in a friendly, conversational tone. Use simple words, contractions, and a warm approach.',
  technical: 'Rewrite with precise, detailed technical language. Include specific terminology and quantifiable details where appropriate.',
  persuasive: 'Rewrite to be compelling and action-oriented. Use power words, create urgency, and emphasize benefits.',
  executive: 'Rewrite to be ultra-concise and bottom-line focused. Lead with conclusions, eliminate fluff, use bullet-friendly phrasing.'
};

const CONTENT_REFINEMENT_INSTRUCTIONS: Record<ContentRefinementType, string> = {
  expand: 'Add more depth and detail to each point. Include examples, supporting information, or context. Expand brief phrases into complete thoughts.',
  simplify: 'Make the content more accessible. Use shorter sentences, simpler vocabulary, and remove jargon. Target a general audience.',
  clarify: 'Improve clarity and readability. Remove ambiguity, make each point self-contained, and ensure logical flow between points.',
  storytelling: 'Add narrative elements. Use "we/you" language, create a journey, add emotional hooks, and frame points as part of a story arc.'
};

const IMAGE_STYLE_INSTRUCTIONS: Record<ImageStylePreset, string> = {
  vivid: 'Enhance for vibrant, saturated colors. Add rich color contrast, make the scene feel alive and energetic.',
  muted: 'Adjust for soft, desaturated tones. Create a calm, understated aesthetic with earth tones and pastels.',
  'high-contrast': 'Optimize for dramatic contrast. Deep blacks, bright highlights, strong shadows, cinematic feel.',
  soft: 'Create a soft, dreamy atmosphere. Gentle lighting, diffused edges, warm and inviting mood.'
};

export const refineSlideContent = async (
  title: string,
  content: string[],
  tone: ToneType
): Promise<{ title: string; content: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = TONE_INSTRUCTIONS[tone];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a presentation copywriter. Rewrite this slide content according to the tone instruction.

TONE INSTRUCTION: ${instruction}

CURRENT SLIDE:
Title: "${title}"
Bullets:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return ONLY valid JSON with this exact structure:
{"title": "new title", "content": ["bullet 1", "bullet 2", "bullet 3"]}

Keep the same number of bullets. Do not add markdown or explanations.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text?.trim() || '';
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const refineSlideContentByType = async (
  title: string,
  content: string[],
  refinementType: ContentRefinementType
): Promise<{ title: string; content: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = CONTENT_REFINEMENT_INSTRUCTIONS[refinementType];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are a presentation content optimizer. Transform this slide according to the refinement goal.

REFINEMENT GOAL: ${instruction}

CURRENT SLIDE:
Title: "${title}"
Bullets:
${content.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return ONLY valid JSON with this exact structure:
{"title": "new title", "content": ["bullet 1", "bullet 2", ...]}

You may adjust the number of bullets if the refinement requires it (e.g., expand may add bullets, simplify may merge). Do not add markdown or explanations.`,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text?.trim() || '';
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
};

export const enhanceImagePrompt = async (
  originalPrompt: string,
  stylePreset: ImageStylePreset
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const instruction = IMAGE_STYLE_INSTRUCTIONS[stylePreset];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an image prompt engineer. Enhance this prompt for a specific visual style.

STYLE GOAL: ${instruction}

ORIGINAL PROMPT: "${originalPrompt}"

Rewrite the prompt to achieve the style goal. Add lighting, color, and atmosphere modifiers. Keep the core subject intact.

Return ONLY the new prompt string, no markdown or explanations.`
  });

  return response.text?.trim() || originalPrompt;
};

interface ImageStyleOverride {
  id: string;
  prompt: string;
  subjectGuidance?: string;
}

export const generatePresentationPlan = async (
  prompt: string,
  imageStyle?: ImageStyleOverride,
  generationMode: GenerationMode = 'balanced'
): Promise<PresentationPlanResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Dynamic prompt construction
  const themeOptions = getThemeOptions();
  const modeInstruction = getGenerationModeInstruction(generationMode);
  const isAuto = !imageStyle || imageStyle.id === 'auto';

  const styleInstruction = isAuto
    ? `Review the selected theme and determine the best 'visualStyle' prompt that matches its Art Direction.`
    : `USER VISUAL OVERRIDE: The user has explicitly selected the image style: "${imageStyle.id}". CONSTRAINT: You MUST set the 'visualStyle' field in the JSON response to exactly this string: "${imageStyle.prompt}".`;

  const subjectLogic = (!isAuto && imageStyle.subjectGuidance)
    ? `CRITICAL ART DIRECTION RULES (Subject Matter): ${imageStyle.subjectGuidance}`
    : `Determine the appropriate subject matter (people vs abstract vs illustration) based on the theme's aesthetic.`;

  // Use Flash for the logical planning
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SYSTEM_INSTRUCTION_VISUAL_DIRECTOR}
    
    ${modeInstruction}
    
    CONTEXT:
    Available Themes:
    ${themeOptions}
    
    User Request: "${prompt}"
    
    ${styleInstruction}
    ${subjectLogic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: PRESENTATION_SCHEMA
    }
  });

  const text = response.text;
  if (!text) throw new Error("No plan generated");

  // Robustness: Strip markdown code blocks if present
  const cleanJson = text.replace(/```json|```/g, '').trim();

  return JSON.parse(cleanJson) as PresentationPlanResponse;
};

export const generateSlideImage = async (imagePrompt: string, style: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const enhancedPrompt = `${style} . SUBJECT: ${imagePrompt} . High quality, 8k, detailed, award winning.`;

  console.log("Generating image with prompt:", enhancedPrompt);

  const strategies = [
    {
      model: "gemini-3-pro-image-preview",
      label: "Pro High-Res",
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
    },
    {
      model: "gemini-2.5-flash-image",
      label: "Flash Standard",
      config: { imageConfig: { aspectRatio: "16:9" } }
    }
  ];

  for (const strategy of strategies) {
    try {
      const response = await ai.models.generateContent({
        model: strategy.model,
        contents: { parts: [{ text: enhancedPrompt }] },
        config: strategy.config
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.warn(`Generation failed on ${strategy.model}`, error);
    }
  }

  throw new Error("Failed to generate image after trying all available models.");
};
