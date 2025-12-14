/**
 * Design Showcase Module
 *
 * A self-contained design system showcase featuring 20 truly distinct design systems.
 * Each system differs in typography, layout, borders, shadows, buttons, and overall aesthetic.
 * Access at /design-showcase route.
 */

export { DesignShowcase } from './DesignShowcase';
export { ThemeNav } from './ThemeNav';
export { ThemeSwatch } from './ThemeSwatch';
export { DashboardDemo } from './DashboardDemo';
export {
  DESIGN_SYSTEMS,
  DESIGN_THEMES, // Alias for backwards compatibility
  getSystemById,
  getThemeById, // Alias for backwards compatibility
  getSystemsByCategory,
  getThemesByCategory, // Alias for backwards compatibility
  getCategories,
  generateCSSVariables,
  applySystemToElement as applyThemeToElement, // Backwards compatible name
  type DesignSystem,
  type DesignTheme, // Alias for backwards compatibility
} from './themes';
