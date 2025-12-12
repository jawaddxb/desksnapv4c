/**
 * Feature Flags Configuration
 *
 * Centralized feature flags for runtime behavior configuration.
 * These can be overridden via environment variables.
 */

export type ImageGenerationMode = 'sync' | 'async' | 'auto';

export interface FeatureFlags {
  /**
   * Image generation mode.
   * - 'sync': Frontend generates images directly via Gemini API
   * - 'async': Backend generates images via Celery workers
   * - 'auto': Use async if authenticated, sync otherwise
   */
  imageGenerationMode: ImageGenerationMode;

  /**
   * Enable intelligent agent-based image generation.
   * When enabled, the agent validates and refines prompts before generating images.
   */
  useAgentMode: boolean;

  /**
   * Enable real-time sync via WebSocket.
   */
  enableRealtimeSync: boolean;

  /**
   * Enable analytics tracking.
   */
  enableAnalytics: boolean;

  /**
   * Enable debug panel in development.
   */
  enableDebugPanel: boolean;
}

/**
 * Parse environment variable as boolean.
 * Returns true if value is 'true', '1', or 'yes' (case-insensitive).
 * Returns defaultValue if undefined or empty.
 */
function parseEnvBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') return defaultValue;
  return ['true', '1', 'yes'].includes(value.toLowerCase());
}

/**
 * Parse environment variable as image generation mode.
 */
function parseImageGenerationMode(
  value: string | undefined,
  defaultValue: ImageGenerationMode
): ImageGenerationMode {
  if (value === 'sync' || value === 'async' || value === 'auto') {
    return value;
  }
  return defaultValue;
}

/**
 * Feature flags with environment variable overrides.
 *
 * Environment variables:
 * - VITE_IMAGE_GEN_MODE: 'sync' | 'async' | 'auto'
 * - VITE_USE_AGENT_MODE: 'true' | 'false'
 * - VITE_ENABLE_REALTIME_SYNC: 'true' | 'false'
 * - VITE_ENABLE_ANALYTICS: 'true' | 'false'
 * - VITE_ENABLE_DEBUG_PANEL: 'true' | 'false'
 */
export const FEATURE_FLAGS: FeatureFlags = {
  imageGenerationMode: parseImageGenerationMode(
    import.meta.env.VITE_IMAGE_GEN_MODE,
    'sync'
  ),
  useAgentMode: parseEnvBoolean(
    import.meta.env.VITE_USE_AGENT_MODE,
    true
  ),
  enableRealtimeSync: parseEnvBoolean(
    import.meta.env.VITE_ENABLE_REALTIME_SYNC,
    true
  ),
  enableAnalytics: parseEnvBoolean(
    import.meta.env.VITE_ENABLE_ANALYTICS,
    true
  ),
  enableDebugPanel: parseEnvBoolean(
    import.meta.env.VITE_ENABLE_DEBUG_PANEL,
    import.meta.env.DEV
  ),
};

/**
 * Get the effective image generation mode.
 * If 'auto', returns 'async' if user is authenticated, 'sync' otherwise.
 */
export function getEffectiveImageGenerationMode(isAuthenticated: boolean): 'sync' | 'async' {
  if (FEATURE_FLAGS.imageGenerationMode === 'auto') {
    return isAuthenticated ? 'async' : 'sync';
  }
  return FEATURE_FLAGS.imageGenerationMode;
}

// Export individual flags for convenience
export const {
  imageGenerationMode,
  useAgentMode,
  enableRealtimeSync,
  enableAnalytics,
  enableDebugPanel,
} = FEATURE_FLAGS;
