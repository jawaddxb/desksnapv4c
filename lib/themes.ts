/**
 * Themes Re-export
 *
 * This file re-exports from the new config/ structure for backward compatibility.
 * New code should import directly from '@config' or 'config/'.
 *
 * @deprecated Import from 'config/' or '@config/' instead.
 */

// Z-Index layering
export { LayoutLayer } from '../config/zIndex';

// Background patterns
export { PATTERNS } from '../config/patterns';

// Image styles
export { IMAGE_STYLES } from '../config/imageStyles';

// Themes
export { THEMES, SYSTEM_THEME } from '../config/themes';
