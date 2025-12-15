/**
 * Keyboard Shortcuts Configuration
 *
 * Central config for all keyboard shortcuts.
 * Used by ShortcutsOverlay and keyboard handlers.
 *
 * KISS: Simple data structure
 * DRY: Single source of truth for shortcuts
 */

export interface Shortcut {
  keys: string;
  description: string;
  context?: 'editing' | 'presenting' | 'any';
}

export interface ShortcutCategory {
  name: string;
  shortcuts: Shortcut[];
}

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    name: 'Navigation',
    shortcuts: [
      { keys: '→', description: 'Next slide', context: 'presenting' },
      { keys: '←', description: 'Previous slide', context: 'presenting' },
      { keys: 'Space', description: 'Next slide', context: 'presenting' },
      { keys: 'Esc', description: 'Exit presentation', context: 'presenting' },
    ],
  },
  {
    name: 'Presentation',
    shortcuts: [
      { keys: '⌘+Enter', description: 'Start presentation', context: 'editing' },
      { keys: '?', description: 'Show shortcuts', context: 'any' },
    ],
  },
  {
    name: 'Editing',
    shortcuts: [
      { keys: '⌘+S', description: 'Save deck', context: 'editing' },
      { keys: '⌘+B', description: 'Bold text', context: 'editing' },
      { keys: '⌘+I', description: 'Italic text', context: 'editing' },
    ],
  },
];
