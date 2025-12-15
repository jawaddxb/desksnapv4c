/**
 * AgentActivityContext
 *
 * Manages agent processing state and generated images.
 * Tracks real-time agent activity, progress, and image generation results.
 *
 * ## Architecture Note: Two Distinct Concerns
 *
 * This context intentionally combines two related but distinct concerns:
 *
 * ### 1. Persistent Agent Logs (Concern A)
 * - `agentLogs`: Map<presentationId, AgentLog[]>
 * - `setAgentLogs`, `getAgentLogs`, `clearAgentLogs`
 * - **Lifecycle**: Persists across sessions, keyed by presentation ID
 * - **Purpose**: Historical record of agent reasoning for debugging/review
 *
 * ### 2. Real-time Progress Tracking (Concern B)
 * - `currentAgentActivity`, `isAgentActive`, `agentTotalSlides`, `agentCompletedSlides`
 * - `agentSlides`, `generatedImages`
 * - `startAgentProcessing`, `updateAgentProgress`, `stopAgentProcessing`, `recordGeneratedImage`
 * - **Lifecycle**: Ephemeral, resets after each processing run
 * - **Purpose**: Real-time UI updates during image generation
 *
 * ### Why Combined?
 * These concerns are kept together because:
 * 1. They always co-occur (logs are generated during processing)
 * 2. Components that display progress also need access to logs
 * 3. Splitting would add indirection without clear benefit
 *
 * If splitting becomes necessary in the future, extract:
 * - `AgentLogsContext` for persistent history
 * - `AgentProgressContext` for real-time state
 *
 * Usage:
 * 1. Wrap your app with <AgentActivityProvider>
 * 2. Use useAgentActivity() hook in child components
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { AgentLog, AgentId, AgentStatus, AgentTeamMember, AGENT_TEAM } from '@/types/agents';

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

  // ========================================
  // CONCERN C: Agent Team State
  // ========================================
  /** Agent team members and their current state */
  agentTeam: Map<AgentId, AgentTeamMember>;
  /** Currently active agent (if any) */
  activeAgentId: AgentId | null;
  /** Whether the team panel should be visible */
  isTeamActive: boolean;
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

  // ========================================
  // CONCERN C: Agent Team Actions
  // ========================================
  /** Initialize the agent team (reset all to idle) */
  initAgentTeam: () => void;
  /** Update a specific agent's status and message */
  updateAgentStatus: (agentId: AgentId, status: AgentStatus, message?: string) => void;
  /** Set the output for a specific agent */
  setAgentOutput: (agentId: AgentId, output: unknown) => void;
  /** Set the currently active agent */
  setActiveAgent: (agentId: AgentId | null) => void;
  /** Clear the agent team state */
  clearAgentTeam: () => void;
  /** Show/hide the team panel */
  setTeamActive: (active: boolean) => void;
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

/** Helper to create initial team state */
const createInitialTeamState = (): Map<AgentId, AgentTeamMember> => {
  const team = new Map<AgentId, AgentTeamMember>();
  AGENT_TEAM.forEach(config => {
    team.set(config.id, { id: config.id, status: 'idle' });
  });
  return team;
};

export const AgentActivityProvider: React.FC<AgentActivityProviderProps> = ({ children }) => {
  // ========================================
  // CONCERN A: Persistent Agent Logs
  // ========================================
  const [agentLogs, setAgentLogsState] = useState<Map<string, AgentLog[]>>(new Map());

  // ========================================
  // CONCERN B: Real-time Progress Tracking
  // ========================================
  const [currentAgentActivity, setCurrentAgentActivityState] = useState<AgentLog | null>(null);
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [agentTotalSlides, setAgentTotalSlides] = useState(0);
  const [agentCompletedSlides, setAgentCompletedSlides] = useState(0);
  const [agentSlides, setAgentSlides] = useState<SlideInfo[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Map<number, string>>(new Map());

  // ========================================
  // CONCERN C: Agent Team State
  // ========================================
  const [agentTeam, setAgentTeam] = useState<Map<AgentId, AgentTeamMember>>(createInitialTeamState);
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
  const [isTeamActive, setIsTeamActive] = useState(false);

  // ========================================
  // CONCERN A: Agent Logs Actions
  // ========================================
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

  // ========================================
  // CONCERN B: Real-time Progress Actions
  // ========================================
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

  // ========================================
  // CONCERN C: Agent Team Actions
  // ========================================
  const initAgentTeam = useCallback(() => {
    setAgentTeam(createInitialTeamState());
    setActiveAgentId(null);
    setIsTeamActive(true);
  }, []);

  const updateAgentStatus = useCallback((agentId: AgentId, status: AgentStatus, message?: string) => {
    setAgentTeam(prev => {
      const next = new Map(prev);
      const member = next.get(agentId);
      if (member) {
        next.set(agentId, {
          ...member,
          status,
          message,
          ...(status === 'working' ? { startedAt: Date.now() } : {}),
          ...(status === 'done' || status === 'error' ? { completedAt: Date.now() } : {}),
        });
      }
      return next;
    });
    // Auto-set active agent when working
    if (status === 'working') {
      setActiveAgentId(agentId);
    } else if (status === 'done' || status === 'error') {
      setActiveAgentId(null);
    }
  }, []);

  const setAgentOutput = useCallback((agentId: AgentId, output: unknown) => {
    setAgentTeam(prev => {
      const next = new Map(prev);
      const member = next.get(agentId);
      if (member) {
        next.set(agentId, { ...member, output });
      }
      return next;
    });
  }, []);

  const setActiveAgent = useCallback((agentId: AgentId | null) => {
    setActiveAgentId(agentId);
  }, []);

  const clearAgentTeam = useCallback(() => {
    setAgentTeam(createInitialTeamState());
    setActiveAgentId(null);
    setIsTeamActive(false);
  }, []);

  const setTeamActive = useCallback((active: boolean) => {
    setIsTeamActive(active);
  }, []);

  // Memoize actions
  const actions = useMemo<AgentActivityActions>(() => ({
    // Concern A: Agent Logs
    setAgentLogs,
    getAgentLogs,
    clearAgentLogs,
    // Concern B: Real-time Progress
    setCurrentActivity,
    startAgentProcessing,
    updateAgentProgress,
    stopAgentProcessing,
    recordGeneratedImage,
    clearGeneratedImages,
    // Concern C: Agent Team
    initAgentTeam,
    updateAgentStatus,
    setAgentOutput,
    setActiveAgent,
    clearAgentTeam,
    setTeamActive,
  }), [
    setAgentLogs, getAgentLogs, clearAgentLogs,
    setCurrentActivity, startAgentProcessing, updateAgentProgress, stopAgentProcessing, recordGeneratedImage, clearGeneratedImages,
    initAgentTeam, updateAgentStatus, setAgentOutput, setActiveAgent, clearAgentTeam, setTeamActive,
  ]);

  // Memoize context value
  const value = useMemo<AgentActivityContextValue>(() => ({
    // Concern A: Agent Logs
    agentLogs,
    // Concern B: Real-time Progress
    currentAgentActivity,
    isAgentActive,
    agentTotalSlides,
    agentCompletedSlides,
    agentSlides,
    generatedImages,
    // Concern C: Agent Team
    agentTeam,
    activeAgentId,
    isTeamActive,
    // Actions
    actions,
  }), [
    agentLogs,
    currentAgentActivity, isAgentActive, agentTotalSlides, agentCompletedSlides, agentSlides, generatedImages,
    agentTeam, activeAgentId, isTeamActive,
    actions,
  ]);

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

/**
 * Check if the agent team panel should be visible.
 */
export const useIsTeamActive = (): boolean => {
  const context = useContext(AgentActivityContext);
  return context?.isTeamActive ?? false;
};

/**
 * Get the agent team state for display.
 */
export const useAgentTeam = () => {
  const context = useContext(AgentActivityContext);
  return {
    team: context?.agentTeam ?? new Map(),
    activeAgentId: context?.activeAgentId ?? null,
    isTeamActive: context?.isTeamActive ?? false,
  };
};

export default AgentActivityContext;
