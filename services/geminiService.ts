/**
 * Gemini Service
 *
 * This file re-exports from the focused service modules for backward compatibility.
 *
 * DEPRECATION NOTICE: Direct imports from geminiService.ts are deprecated.
 * Please import from the specific service modules instead:
 *
 * - imagePromptService.ts: refineImagePrompt, enhanceImagePrompt
 * - contentRefinementService.ts: refineSlideContent, refineSlideContentByType
 * - presentationPlanService.ts: generatePresentationPlan, generateHolisticImageSuggestions
 * - ideationDeconstructionService.ts: deconstructContentToIdeation, shouldDeconstructContent
 * - imageGenerationService.ts: generateSlideImage, generatePresentationImagesWithAgent
 */

// Re-export API key helper (stays here as it's general purpose)
export { ensureApiKeySelection } from './ensureApiKeySelection';

// Re-export from imagePromptService
export {
  refineImagePrompt,
  enhanceImagePrompt,
} from './imagePromptService';
export type { RefinementFocus } from './imagePromptService';

// Re-export from contentRefinementService
export {
  refineSlideContent,
  refineSlideContentByType,
} from './contentRefinementService';
export type { ContentRefinementResult } from './contentRefinementService';

// Re-export from presentationPlanService
export {
  generatePresentationPlan,
  generateHolisticImageSuggestions,
} from './presentationPlanService';
export type { ImageStyleOverride } from './presentationPlanService';

// Re-export from ideationDeconstructionService
export {
  deconstructContentToIdeation,
  shouldDeconstructContent,
} from './ideationDeconstructionService';
export type { DeconstructionResult } from './ideationDeconstructionService';

// Re-export from imageGenerationService
export {
  generateSlideImage,
  generatePresentationImagesWithAgent,
} from './imageGenerationService';
export type {
  SlideImageOptions,
  SlideForImageGeneration,
} from './imageGenerationService';
