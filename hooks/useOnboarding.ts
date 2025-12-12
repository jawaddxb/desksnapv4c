import { useState, useEffect, useCallback } from 'react';

const ONBOARDING_STORAGE_KEY = 'decksnap_onboarding';

export type OnboardingStep =
  | 'create_deck'
  | 'try_ideation'
  | 'explore_themes'
  | 'export_deck';

interface OnboardingState {
  hasSeenWelcome: boolean;
  completedSteps: OnboardingStep[];
  dismissedChecklist: boolean;
  dismissedTips: string[];
}

const defaultState: OnboardingState = {
  hasSeenWelcome: false,
  completedSteps: [],
  dismissedChecklist: false,
  dismissedTips: [],
};

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OnboardingState;
        setState(parsed);
      }
    } catch (e) {
      console.warn('Failed to load onboarding state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist state to localStorage
  const persistState = useCallback((newState: OnboardingState) => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to persist onboarding state:', e);
    }
  }, []);

  // Mark welcome as seen
  const markWelcomeSeen = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, hasSeenWelcome: true };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  // Mark a step as complete
  const markStepComplete = useCallback((step: OnboardingStep) => {
    setState(prev => {
      if (prev.completedSteps.includes(step)) return prev;
      const newState = {
        ...prev,
        completedSteps: [...prev.completedSteps, step],
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  // Dismiss the checklist permanently
  const dismissChecklist = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, dismissedChecklist: true };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  // Dismiss a specific tooltip
  const dismissTip = useCallback((tipId: string) => {
    setState(prev => {
      if (prev.dismissedTips.includes(tipId)) return prev;
      const newState = {
        ...prev,
        dismissedTips: [...prev.dismissedTips, tipId],
      };
      persistState(newState);
      return newState;
    });
  }, [persistState]);

  // Check if a tip has been dismissed
  const isTipDismissed = useCallback((tipId: string) => {
    return state.dismissedTips.includes(tipId);
  }, [state.dismissedTips]);

  // Computed values
  const isFirstTimeUser = !state.hasSeenWelcome;
  const allStepsComplete = state.completedSteps.length >= 4;
  const shouldShowChecklist = !state.dismissedChecklist && !allStepsComplete;
  const completionProgress = state.completedSteps.length;

  return {
    // State
    isLoaded,
    isFirstTimeUser,
    hasSeenWelcome: state.hasSeenWelcome,
    completedSteps: state.completedSteps,
    shouldShowChecklist,
    completionProgress,
    allStepsComplete,

    // Actions
    markWelcomeSeen,
    markStepComplete,
    dismissChecklist,
    dismissTip,
    isTipDismissed,
  };
}
