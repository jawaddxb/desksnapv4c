/**
 * Image Generation Service
 *
 * Handles AI-powered image generation for slides.
 * Single responsibility: Generate images from prompts using AI models.
 */

import { getAIClient } from './aiClient';
import {
  runImagePromptAgent,
  AgentImageGenerationOptions,
  AgentImageGenerationResult,
} from './agents';

/**
 * Options for slide image generation.
 */
export interface SlideImageOptions {
  /** Presentation topic for context */
  topic?: string;
  /** Prevent text, brands, logos in image */
  noText?: boolean;
}

/**
 * Anti-text instruction to prevent brand/text hallucination.
 */
const ANTI_TEXT_GUARD = `CRITICAL: Do not include ANY text, words, letters, numbers, brand names, logos, watermarks, URLs, or typography of any kind in the image. The image must be completely free of readable text or branding. Generate only visual imagery.`;

/**
 * Generate an image for a slide using AI image models.
 *
 * Uses a fallback strategy with multiple models:
 * 1. gemini-3-pro-image-preview (high-res 1K)
 * 2. gemini-2.5-flash-image (standard)
 *
 * @param imagePrompt - Description of the image content (subject)
 * @param style - Visual style to apply to the image
 * @param options - Additional generation options
 * @returns Base64-encoded image data URL
 * @throws Error if all models fail
 */
export const generateSlideImage = async (
  imagePrompt: string,
  style: string,
  options?: SlideImageOptions
): Promise<string> => {
  const ai = getAIClient();

  // Build enhanced prompt with optional topic context and anti-text guard
  const topicContext = options?.topic ? `TOPIC CONTEXT: ${options.topic} . ` : '';
  const antiTextGuard = options?.noText ? `${ANTI_TEXT_GUARD} . ` : '';

  const enhancedPrompt = `${style} . ${topicContext}SUBJECT: ${imagePrompt} . ${antiTextGuard}High quality, 8k, detailed, award winning.`;

  console.log('Generating image with prompt:', enhancedPrompt);

  const strategies = [
    {
      model: 'gemini-3-pro-image-preview',
      label: 'Pro High-Res',
      config: { imageConfig: { aspectRatio: '16:9', imageSize: '1K' } },
    },
    {
      model: 'gemini-2.5-flash-image',
      label: 'Flash Standard',
      config: { imageConfig: { aspectRatio: '16:9' } },
    },
  ];

  for (const strategy of strategies) {
    try {
      const response = await ai.models.generateContent({
        model: strategy.model,
        contents: { parts: [{ text: enhancedPrompt }] },
        config: strategy.config,
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

  throw new Error('Failed to generate image after trying all available models.');
};

/**
 * Slide data for agent-based generation.
 */
export interface SlideForImageGeneration {
  title: string;
  content: string[];
  imagePrompt: string;
}

/**
 * Generate presentation images using the intelligent agent system.
 *
 * The agent will:
 * 1. Validate each image prompt against the topic
 * 2. Rewrite prompts that don't relate to the topic
 * 3. Generate images with the refined prompts
 * 4. Log all reasoning for debugging
 *
 * @param topic - The presentation topic
 * @param slides - Array of slides with their prompts
 * @param visualStyle - The visual style to apply
 * @param themeId - The theme being used
 * @param options - Agent generation options
 * @returns Result with images, logs, and errors
 */
export async function generatePresentationImagesWithAgent(
  topic: string,
  slides: SlideForImageGeneration[],
  visualStyle: string,
  themeId: string,
  options?: AgentImageGenerationOptions
): Promise<AgentImageGenerationResult> {
  const startTime = Date.now();
  const errors: Array<{ slideIndex: number; error: string }> = [];

  // Step 1: Run the agent to refine all prompts
  const agentResult = await runImagePromptAgent(
    {
      topic,
      themeId,
      visualStyle,
      slides: slides.map((s, i) => ({
        index: i,
        title: s.title,
        content: s.content,
        initialPrompt: s.imagePrompt,
      })),
    },
    {
      acceptanceThreshold: options?.acceptanceThreshold,
      maxIterations: options?.maxIterations,
      parallelValidation: options?.parallelValidation,
      onLog: options?.onLog,
      onSlideComplete: options?.onSlideComplete,
    }
  );

  // Step 2: Generate images with refined prompts (parallel)
  const images = await Promise.all(
    agentResult.refinedPrompts.map(async (prompt, index) => {
      try {
        const image = await generateSlideImage(prompt, visualStyle, {
          topic,
          noText: true,
        });
        options?.onImageGenerated?.(index, image);
        return image;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ slideIndex: index, error: errorMessage });
        options?.onImageError?.(
          index,
          error instanceof Error ? error : new Error(errorMessage)
        );
        return ''; // Return empty string for failed images
      }
    })
  );

  return {
    images,
    agentLogs: agentResult.logs,
    errors,
    totalDurationMs: Date.now() - startTime,
  };
}
