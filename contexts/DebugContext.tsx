/**
 * DebugContext
 *
 * Centralized debug mode state management.
 * Controls visibility of developer tools and debug features.
 *
 * Usage:
 * 1. Wrap your app with <DebugProvider>
 * 2. Use useDebug() hook in child components
 *
 * Environment:
 * - Set VITE_DEBUG_MODE=true in .env.local to enable debug features
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AgentLog } from '../services/agents/types';

// ============ Constants ============

const STORAGE_KEY = 'decksnap_debug_ui';

// ============ Types ============

/** Slide info for agent activity panel */
export interface SlideInfo {
  index: number;
  title: string;
}

export interface DebugState {
  /** Whether debug mode is available (based on VITE_DEBUG_MODE env var) */
  isDebugModeAvailable: boolean;
  /** Whether debug UI is enabled (user toggle, persisted to localStorage) */
  isDebugUIEnabled: boolean;
  /** Whether dev toolbar is visible */
  showDevToolbar: boolean;
  /** Agent logs by presentation ID */
  agentLogs: Map<string, AgentLog[]>;
  /** Current agent activity (real-time) */
  currentAgentActivity: AgentLog | null;
  /** Whether agent is actively processing */
  isAgentActive: boolean;
  /** Total slides being processed */
  agentTotalSlides: number;
  /** Slides completed so far */
  agentCompletedSlides: number;
  /** Slide info for all slides being processed */
  agentSlides: SlideInfo[];
  /** Generated image URLs by slide index */
  generatedImages: Map<number, string>;
}

export interface DebugActions {
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
  /** Set agent logs for a presentation */
  setAgentLogs: (presentationId: string, logs: AgentLog[]) => void;
  /** Get agent logs for a presentation */
  getAgentLogs: (presentationId: string) => AgentLog[];
  /** Clear agent logs for a presentation */
  clearAgentLogs: (presentationId: string) => void;
  /** Set current agent activity (real-time display) */
  setCurrentActivity: (log: AgentLog | null) => void;
  /** Start agent processing with total slide count and slide info */
  startAgentProcessing: (totalSlides: number, slides?: SlideInfo[]) => void;
  /** Update agent progress */
  updateAgentProgress: (completedSlides: number) => void;
  /** Stop agent processing */
  stopAgentProcessing: () => void;
  /** Record a generated image URL for a slide */
  recordGeneratedImage: (slideIndex: number, imageUrl: string) => void;
  /** Clear all generated images */
  clearGeneratedImages: () => void;
}

export interface DebugContextValue extends DebugState {
  actions: DebugActions;
}

// ============ Context ============

const DebugContext = createContext<DebugContextValue | null>(null);

// ============ Provider ============

export interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
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

  // Agent logs storage
  const [agentLogs, setAgentLogsState] = useState<Map<string, AgentLog[]>>(new Map());

  // Real-time agent activity state
  const [currentAgentActivity, setCurrentAgentActivityState] = useState<AgentLog | null>(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [agentTotalSlides, setAgentTotalSlides] = useState(0);
  const [agentCompletedSlides, setAgentCompletedSlides] = useState(0);
  const [agentSlides, setAgentSlides] = useState<SlideInfo[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Map<number, string>>(new Map());

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

  // Agent logs actions
  const setAgentLogs = useCallback((presentationId: string, logs: AgentLog[]) => {
    setAgentLogsState(prev => {
      const next = new Map(prev);
      next.set(presentationId, logs);
      return next;
    });
  }, []);

  const getAgentLogs = useCallback((presentationId: string): AgentLog[] => {
    return agentLogs.get(presentationId) || [];
  }, [agentLogs]);

  const clearAgentLogs = useCallback((presentationId: string) => {
    setAgentLogsState(prev => {
      const next = new Map(prev);
      next.delete(presentationId);
      return next;
    });
  }, []);

  // Real-time agent activity actions
  const setCurrentActivity = useCallback((log: AgentLog | null) => {
    setCurrentAgentActivityState(log);
  }, []);

  const startAgentProcessing = useCallback((totalSlides: number, slides?: SlideInfo[]) => {
    setIsAgentActive(true);
    setAgentTotalSlides(totalSlides);
    setAgentCompletedSlides(0);
    setCurrentAgentActivityState(null);
    setAgentSlides(slides || []);
    setGeneratedImages(new Map());
  }, []);

  const updateAgentProgress = useCallback((completedSlides: number) => {
    setAgentCompletedSlides(completedSlides);
  }, []);

  const stopAgentProcessing = useCallback(() => {
    setIsAgentActive(false);
    setCurrentAgentActivityState(null);
    // Keep total/completed for summary display, reset after delay
    setTimeout(() => {
      setAgentTotalSlides(0);
      setAgentCompletedSlides(0);
      setAgentSlides([]);
      setGeneratedImages(new Map());
    }, 3000);
  }, []);

  const recordGeneratedImage = useCallback((slideIndex: number, imageUrl: string) => {
    setGeneratedImages(prev => {
      const next = new Map(prev);
      next.set(slideIndex, imageUrl);
      return next;
    });
    // Also increment completed slides counter
    setAgentCompletedSlides(prev => prev + 1);
  }, []);

  const clearGeneratedImages = useCallback(() => {
    setGeneratedImages(new Map());
  }, []);

  // Memoize actions
  const actions = useMemo<DebugActions>(() => ({
    toggleDebugUI,
    setDebugUIEnabled: setDebugUIEnabledAction,
    toggleDevToolbar,
    setDevToolbarVisible,
    clearDebugStorage,
    setAgentLogs,
    getAgentLogs,
    clearAgentLogs,
    setCurrentActivity,
    startAgentProcessing,
    updateAgentProgress,
    stopAgentProcessing,
    recordGeneratedImage,
    clearGeneratedImages,
  }), [toggleDebugUI, setDebugUIEnabledAction, toggleDevToolbar, setDevToolbarVisible, clearDebugStorage, setAgentLogs, getAgentLogs, clearAgentLogs, setCurrentActivity, startAgentProcessing, updateAgentProgress, stopAgentProcessing, recordGeneratedImage, clearGeneratedImages]);

  // Memoize context value
  const value = useMemo<DebugContextValue>(() => ({
    isDebugModeAvailable,
    isDebugUIEnabled: isDebugModeAvailable && isDebugUIEnabled,
    showDevToolbar: isDebugModeAvailable && showDevToolbar,
    agentLogs,
    currentAgentActivity,
    isAgentActive,
    agentTotalSlides,
    agentCompletedSlides,
    agentSlides,
    generatedImages,
    actions,
  }), [isDebugModeAvailable, isDebugUIEnabled, showDevToolbar, agentLogs, currentAgentActivity, isAgentActive, agentTotalSlides, agentCompletedSlides, agentSlides, generatedImages, actions]);

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};

// ============ Hooks ============

/**
 * Access debug state and actions.
 * Must be used within a DebugProvider.
 */
export const useDebug = (): DebugContextValue => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

/**
 * Access debug state safely.
 * Returns null if not within a DebugProvider.
 */
export const useDebugSafe = (): DebugContextValue | null => {
  return useContext(DebugContext);
};

/**
 * Check if debug mode is available (for conditional rendering).
 */
export const useIsDebugAvailable = (): boolean => {
  const context = useContext(DebugContext);
  return context?.isDebugModeAvailable ?? false;
};

/**
 * Check if debug UI is enabled (for conditional rendering).
 */
export const useIsDebugEnabled = (): boolean => {
  const context = useContext(DebugContext);
  return context?.isDebugUIEnabled ?? false;
};

export default DebugContext;
