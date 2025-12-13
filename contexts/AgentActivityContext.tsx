/**
 * AgentActivityContext
 *
 * Manages agent processing state and generated images.
 * Tracks real-time agent activity, progress, and image generation results.
 *
 * Single Responsibility: Agent processing lifecycle and output tracking.
 *
 * Usage:
 * 1. Wrap your app with <AgentActivityProvider>
 * 2. Use useAgentActivity() hook in child components
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { AgentLog } from '../services/agents/types';

// ============ Types ============

/** Slide info for agent activity panel */
export interface SlideInfo {
  index: number;
  title: string;
}

export interface AgentActivityState {
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

export interface AgentActivityActions {
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

export interface AgentActivityContextValue extends AgentActivityState {
  actions: AgentActivityActions;
}

// ============ Context ============

const AgentActivityContext = createContext<AgentActivityContextValue | null>(null);

// ============ Provider ============

export interface AgentActivityProviderProps {
  children: ReactNode;
}

export const AgentActivityProvider: React.FC<AgentActivityProviderProps> = ({ children }) => {
  // Agent logs storage
  const [agentLogs, setAgentLogsState] = useState<Map<string, AgentLog[]>>(new Map());

  // Real-time agent activity state
  const [currentAgentActivity, setCurrentAgentActivityState] = useState<AgentLog | null>(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [agentTotalSlides, setAgentTotalSlides] = useState(0);
  const [agentCompletedSlides, setAgentCompletedSlides] = useState(0);
  const [agentSlides, setAgentSlides] = useState<SlideInfo[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Map<number, string>>(new Map());

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
  const actions = useMemo<AgentActivityActions>(() => ({
    setAgentLogs,
    getAgentLogs,
    clearAgentLogs,
    setCurrentActivity,
    startAgentProcessing,
    updateAgentProgress,
    stopAgentProcessing,
    recordGeneratedImage,
    clearGeneratedImages,
  }), [setAgentLogs, getAgentLogs, clearAgentLogs, setCurrentActivity, startAgentProcessing, updateAgentProgress, stopAgentProcessing, recordGeneratedImage, clearGeneratedImages]);

  // Memoize context value
  const value = useMemo<AgentActivityContextValue>(() => ({
    agentLogs,
    currentAgentActivity,
    isAgentActive,
    agentTotalSlides,
    agentCompletedSlides,
    agentSlides,
    generatedImages,
    actions,
  }), [agentLogs, currentAgentActivity, isAgentActive, agentTotalSlides, agentCompletedSlides, agentSlides, generatedImages, actions]);

  return (
    <AgentActivityContext.Provider value={value}>
      {children}
    </AgentActivityContext.Provider>
  );
};

// ============ Hooks ============

/**
 * Access agent activity state and actions.
 * Must be used within an AgentActivityProvider.
 */
export const useAgentActivity = (): AgentActivityContextValue => {
  const context = useContext(AgentActivityContext);
  if (!context) {
    throw new Error('useAgentActivity must be used within an AgentActivityProvider');
  }
  return context;
};

/**
 * Access agent activity state safely.
 * Returns null if not within an AgentActivityProvider.
 */
export const useAgentActivitySafe = (): AgentActivityContextValue | null => {
  return useContext(AgentActivityContext);
};

/**
 * Check if agent is currently active (for conditional rendering).
 */
export const useIsAgentActive = (): boolean => {
  const context = useContext(AgentActivityContext);
  return context?.isAgentActive ?? false;
};

export default AgentActivityContext;
