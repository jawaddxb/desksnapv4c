
import { GoogleGenAI } from "@google/genai";
import { PresentationPlanResponse, GenerationMode } from "../types";
import { getThemeOptions, REFINEMENT_INSTRUCTIONS, SYSTEM_INSTRUCTION_VISUAL_DIRECTOR, PRESENTATION_SCHEMA, getGenerationModeInstruction } from "../lib/prompts";

// Helper to ensure we have a valid key for High Quality image generation
export const ensureApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
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
