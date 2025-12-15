/**
 * Onboarding Hints Configuration
 *
 * Contextual hints for first-time users.
 * Non-blocking, subtle tooltips to help discover features.
 *
 * KISS: Simple data structure
 * DRY: Single source of truth for hints
 */

export interface OnboardingHint {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  context: 'dashboard' | 'editing' | 'presenting' | 'any';
  priority: number;
}

export const ONBOARDING_HINTS: OnboardingHint[] = [
  // Dashboard hints
  {
    id: 'create-first-deck',
    title: 'Create Your First Deck',
    description: 'Type a topic and press Enter to generate a presentation instantly.',
    context: 'dashboard',
    priority: 1,
  },
  {
    id: 'saved-decks',
    title: 'Your Saved Decks',
    description: 'All your presentations are saved automatically and appear here.',
    context: 'dashboard',
    priority: 2,
  },

  // Editing hints
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Press ? anytime to see all available keyboard shortcuts.',
    context: 'editing',
    priority: 1,
  },
  {
    id: 'quick-present',
    title: 'Quick Present',
    description: 'Press Cmd+Enter to start presenting immediately.',
    context: 'editing',
    priority: 2,
  },
  {
    id: 'ai-refinement',
    title: 'AI Content Refinement',
    description: 'Use Expand, Simplify, or Tone options to refine your content with AI.',
    context: 'editing',
    priority: 3,
  },
  {
    id: 'layout-selection',
    title: 'Change Layouts',
    description: 'Click the Layout dropdown to switch between different slide layouts.',
    context: 'editing',
    priority: 4,
  },
  {
    id: 'image-regenerate',
    title: 'Regenerate Images',
    description: 'Click "Regen Image" to generate a new image for this slide.',
    context: 'editing',
    priority: 5,
  },

  // Presenting hints
  {
    id: 'navigation-keys',
    title: 'Navigate Slides',
    description: 'Use arrow keys or space to move between slides. Press Esc to exit.',
    context: 'presenting',
    priority: 1,
  },
];

/**
 * Get hints for a specific context
 */
export function getHintsForContext(context: OnboardingHint['context']): OnboardingHint[] {
  return ONBOARDING_HINTS
    .filter(h => h.context === context || h.context === 'any')
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Local storage key for tracking shown hints
 */
export const HINTS_STORAGE_KEY = 'decksnap_shown_hints';

/**
 * Check if a hint has been shown
 */
export function hasHintBeenShown(hintId: string): boolean {
  try {
    const shown = localStorage.getItem(HINTS_STORAGE_KEY);
    if (!shown) return false;
    const shownHints: string[] = JSON.parse(shown);
    return shownHints.includes(hintId);
  } catch {
    return false;
  }
}

/**
 * Mark a hint as shown
 */
export function markHintAsShown(hintId: string): void {
  try {
    const shown = localStorage.getItem(HINTS_STORAGE_KEY);
    const shownHints: string[] = shown ? JSON.parse(shown) : [];
    if (!shownHints.includes(hintId)) {
      shownHints.push(hintId);
      localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify(shownHints));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Reset all hints (for testing/development)
 */
export function resetAllHints(): void {
  try {
    localStorage.removeItem(HINTS_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
