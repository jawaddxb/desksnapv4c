/**
 * Centralized Default Values
 *
 * Single source of truth for default theme and content density.
 * Used by all flows: Ideation, Sources, Copilot.
 *
 * DRY: Eliminates hardcoded 'executive' and 'detailed' across the codebase.
 */

import { ContentDensity } from '@/lib/contentBlockPrompts';

/** Default theme ID used when no theme is selected */
export const DEFAULT_THEME_ID = 'executive';

/** Default content density for new presentations */
export const DEFAULT_CONTENT_DENSITY: ContentDensity = 'detailed';
