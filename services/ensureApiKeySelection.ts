/**
 * API Key Selection Helper
 *
 * Handles API key validation and selection flow.
 * Supports both environment variable keys and AIStudio key selection.
 */

/**
 * Ensure a valid API key is selected for image generation.
 *
 * If no API_KEY environment variable is set, checks if AIStudio key selection
 * is available and triggers the selection flow if needed.
 *
 * This is primarily used for high-quality image generation which requires
 * a validated API key.
 */
export const ensureApiKeySelection = async (): Promise<void> => {
  if (process.env.API_KEY) return;

  // Handle potential window.aistudio check safely
  const win = window as Record<string, unknown>;
  if (
    typeof win !== 'undefined' &&
    win.aistudio &&
    typeof win.aistudio === 'object'
  ) {
    const aistudio = win.aistudio as {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };

    if (aistudio.hasSelectedApiKey && aistudio.openSelectKey) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
    }
  }
};
