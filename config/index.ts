/**
 * Configuration Exports
 *
 * Central export point for all configuration modules.
 */

// Z-Index layering system
export { LayoutLayer } from './zIndex';
export type { LayoutLayerKey, LayoutLayerValue } from './zIndex';

// Background patterns
export { PATTERNS } from './patterns';
export type { PatternKey, PatternValue } from './patterns';

// Image styles
export { IMAGE_STYLES, getImageStyleById, getAutoImageStyle } from './imageStyles';
export type { ImageStyle } from './imageStyles';

// Themes
export {
  THEMES,
  SYSTEM_THEME,
  THEME_CATEGORIES,
  getThemeById,
  getThemeIds,
  getThemesByCategory,
  createTheme,
  createThemes,
} from './themes';
export type { ThemeConfig } from './themes';

// Colors
export { COLORS, COLOR_CLASSES } from './colors';
export type { Colors, ColorClasses } from './colors';

// Feature Flags
export {
  FEATURE_FLAGS,
  getEffectiveImageGenerationMode,
  imageGenerationMode,
  useAgentMode,
  enableRealtimeSync,
  enableAnalytics,
  enableDebugPanel,
} from './featureFlags';
export type { FeatureFlags, ImageGenerationMode } from './featureFlags';
