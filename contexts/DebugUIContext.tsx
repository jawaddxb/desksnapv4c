/**
 * DebugUIContext
 *
 * Manages debug UI toggle state.
 * Controls visibility of developer tools and debug features.
 *
 * Single Responsibility: Debug UI visibility toggles.
 *
 * Usage:
 * 1. Wrap your app with <DebugUIProvider>
 * 2. Use useDebugUI() hook in child components
 *
 * Environment:
 * - Set VITE_DEBUG_MODE=true in .env.local to enable debug features
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

// ============ Constants ============

const STORAGE_KEY = 'decksnap_debug_ui';

// ============ Types ============

export interface DebugUIState {
  /** Whether debug mode is available (based on VITE_DEBUG_MODE env var) */
  isDebugModeAvailable: boolean;
  /** Whether debug UI is enabled (user toggle, persisted to localStorage) */
  isDebugUIEnabled: boolean;
  /** Whether dev toolbar is visible */
  showDevToolbar: boolean;
}

export interface DebugUIActions {
  /** Toggle debug UI on/off */
  toggleDebugUI: () => void;
  /** Set debug UI enabled state */
  setDebugUIEnabled: (enabled: boolean) => void;
  /** Toggle dev toolbar visibility */
  toggleDevToolbar: () => void;
  /** Set dev toolbar visibility */
  setDevToolbarVisible: (visible: boolean) => void;
  /** Clear all debug-related localStorage */
  clearDebugStorage: () => void;
}

export interface DebugUIContextValue extends DebugUIState {
  actions: DebugUIActions;
}

// ============ Context ============

const DebugUIContext = createContext<DebugUIContextValue | null>(null);

// ============ Provider ============

export interface DebugUIProviderProps {
  children: ReactNode;
}

export const DebugUIProvider: React.FC<DebugUIProviderProps> = ({ children }) => {
  // Check if debug mode is available from environment
  const isDebugModeAvailable = import.meta.env.VITE_DEBUG_MODE === 'true';

  // Initialize state from localStorage
  const [isDebugUIEnabled, setIsDebugUIEnabled] = useState<boolean>(() => {
    if (!isDebugModeAvailable) return false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [showDevToolbar, setShowDevToolbar] = useState<boolean>(() => {
    if (!isDebugModeAvailable) return false;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_toolbar`);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Persist debug UI state to localStorage
  useEffect(() => {
    if (isDebugModeAvailable) {
      try {
        localStorage.setItem(STORAGE_KEY, String(isDebugUIEnabled));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [isDebugUIEnabled, isDebugModeAvailable]);

  // Persist toolbar state to localStorage
  useEffect(() => {
    if (isDebugModeAvailable) {
      try {
        localStorage.setItem(`${STORAGE_KEY}_toolbar`, String(showDevToolbar));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [showDevToolbar, isDebugModeAvailable]);

  // Actions
  const toggleDebugUI = useCallback(() => {
    if (isDebugModeAvailable) {
      setIsDebugUIEnabled(prev => !prev);
    }
  }, [isDebugModeAvailable]);

  const setDebugUIEnabledAction = useCallback((enabled: boolean) => {
    if (isDebugModeAvailable) {
      setIsDebugUIEnabled(enabled);
    }
  }, [isDebugModeAvailable]);

  const toggleDevToolbar = useCallback(() => {
    if (isDebugModeAvailable) {
      setShowDevToolbar(prev => !prev);
    }
  }, [isDebugModeAvailable]);

  const setDevToolbarVisible = useCallback((visible: boolean) => {
    if (isDebugModeAvailable) {
      setShowDevToolbar(visible);
    }
  }, [isDebugModeAvailable]);

  const clearDebugStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_toolbar`);
      setIsDebugUIEnabled(false);
      setShowDevToolbar(false);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Memoize actions
  const actions = useMemo<DebugUIActions>(() => ({
    toggleDebugUI,
    setDebugUIEnabled: setDebugUIEnabledAction,
    toggleDevToolbar,
    setDevToolbarVisible,
    clearDebugStorage,
  }), [toggleDebugUI, setDebugUIEnabledAction, toggleDevToolbar, setDevToolbarVisible, clearDebugStorage]);

  // Memoize context value
  const value = useMemo<DebugUIContextValue>(() => ({
    isDebugModeAvailable,
    isDebugUIEnabled: isDebugModeAvailable && isDebugUIEnabled,
    showDevToolbar: isDebugModeAvailable && showDevToolbar,
    actions,
  }), [isDebugModeAvailable, isDebugUIEnabled, showDevToolbar, actions]);

  return (
    <DebugUIContext.Provider value={value}>
      {children}
    </DebugUIContext.Provider>
  );
};

// ============ Hooks ============

/**
 * Access debug UI state and actions.
 * Must be used within a DebugUIProvider.
 */
export const useDebugUI = (): DebugUIContextValue => {
  const context = useContext(DebugUIContext);
  if (!context) {
    throw new Error('useDebugUI must be used within a DebugUIProvider');
  }
  return context;
};

/**
 * Access debug UI state safely.
 * Returns null if not within a DebugUIProvider.
 */
export const useDebugUISafe = (): DebugUIContextValue | null => {
  return useContext(DebugUIContext);
};

/**
 * Check if debug mode is available (for conditional rendering).
 */
export const useIsDebugAvailable = (): boolean => {
  const context = useContext(DebugUIContext);
  return context?.isDebugModeAvailable ?? false;
};

/**
 * Check if debug UI is enabled (for conditional rendering).
 */
export const useIsDebugEnabled = (): boolean => {
  const context = useContext(DebugUIContext);
  return context?.isDebugUIEnabled ?? false;
};

export default DebugUIContext;
