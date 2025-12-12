/**
 * Centralized AI Model Configuration
 *
 * This file defines all AI model names used throughout the application.
 * Changing models here will update them across all services.
 */

export const AI_MODELS = {
  // Text generation models
  text: {
    default: 'gemini-2.5-flash',
    fast: 'gemini-2.0-flash',
  },
  // Image generation models (with fallback order)
  image: {
    primary: 'gemini-3-pro-image-preview',
    fallback: 'gemini-2.5-flash-image',
  },
  // External AI services
  external: {
    grok: 'grok-4-1-fast',
  },
} as const;

// Type definitions for model selection
export type TextModelVariant = keyof typeof AI_MODELS.text;
export type ImageModelVariant = keyof typeof AI_MODELS.image;
export type ExternalModelVariant = keyof typeof AI_MODELS.external;

/**
 * Get a text generation model by variant
 * @param variant - 'default' | 'fast'
 * @returns The model name string
 */
export const getTextModel = (variant: TextModelVariant = 'default'): string =>
  AI_MODELS.text[variant];

/**
 * Get an image generation model by variant
 * @param variant - 'primary' | 'fallback'
 * @returns The model name string
 */
export const getImageModel = (variant: ImageModelVariant = 'primary'): string =>
  AI_MODELS.image[variant];

/**
 * Get an external AI model by variant
 * @param variant - 'grok'
 * @returns The model name string
 */
export const getExternalModel = (variant: ExternalModelVariant): string =>
  AI_MODELS.external[variant];

/**
 * Get all image models in fallback order for retry logic
 * @returns Array of model names in priority order
 */
export const getImageModelFallbacks = (): string[] => [
  AI_MODELS.image.primary,
  AI_MODELS.image.fallback,
];
