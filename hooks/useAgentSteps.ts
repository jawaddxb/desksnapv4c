/**
 * useAgentSteps Hook
 *
 * Manages custom agent steps stored in localStorage.
 * Simple string array per agent - no complex schema needed for MVP.
 *
 * Single Responsibility: Load/save agent custom steps.
 */

import { useState, useCallback, useEffect } from 'react';
import { AgentId } from '@/types/agents';

const STORAGE_KEY = 'decksnap_agent_steps';

/**
 * Custom steps for each agent
 */
export interface AgentCustomSteps {
  [agentId: string]: string[];
}

/**
 * Default steps for each agent (not editable, shown for reference)
 */
export const AGENT_DEFAULT_STEPS: Record<AgentId, string[]> = {
  scout: [
    'Search web for statistics',
    'Search X for trends',
    'Find relevant citations',
  ],
  sage: [
    'Analyze topic characteristics',
    'Match to best theme',
    'Select optimal layout',
  ],
  aria: [
    'Structure narrative arc',
    'Write headlines and content',
    'Add speaker notes',
  ],
  nova: [
    'Validate image prompts',
    'Generate visual concepts',
    'Apply theme aesthetics',
  ],
  coach: [
    'Review content clarity',
    'Check audience fit',
    'Suggest improvements',
  ],
};

/**
 * Load custom steps from localStorage
 */
function loadSteps(): AgentCustomSteps {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save custom steps to localStorage
 */
function saveSteps(steps: AgentCustomSteps): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
  } catch (error) {
    console.warn('[AgentSteps] Failed to save to localStorage:', error);
  }
}

/**
 * Hook for managing custom agent steps
 */
export function useAgentSteps() {
  const [customSteps, setCustomSteps] = useState<AgentCustomSteps>(loadSteps);

  // Sync to localStorage when steps change
  useEffect(() => {
    saveSteps(customSteps);
  }, [customSteps]);

  /**
   * Get steps for a specific agent (default + custom)
   */
  const getAgentSteps = useCallback((agentId: AgentId) => {
    return {
      defaultSteps: AGENT_DEFAULT_STEPS[agentId] || [],
      customSteps: customSteps[agentId] || [],
    };
  }, [customSteps]);

  /**
   * Add a custom step to an agent
   */
  const addStep = useCallback((agentId: AgentId, step: string) => {
    const trimmed = step.trim();
    if (!trimmed) return;

    setCustomSteps(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), trimmed],
    }));
  }, []);

  /**
   * Remove a custom step from an agent
   */
  const removeStep = useCallback((agentId: AgentId, index: number) => {
    setCustomSteps(prev => {
      const current = prev[agentId] || [];
      return {
        ...prev,
        [agentId]: current.filter((_, i) => i !== index),
      };
    });
  }, []);

  /**
   * Clear all custom steps for an agent
   */
  const clearAgentSteps = useCallback((agentId: AgentId) => {
    setCustomSteps(prev => {
      const next = { ...prev };
      delete next[agentId];
      return next;
    });
  }, []);

  /**
   * Clear all custom steps
   */
  const clearAllSteps = useCallback(() => {
    setCustomSteps({});
  }, []);

  return {
    customSteps,
    getAgentSteps,
    addStep,
    removeStep,
    clearAgentSteps,
    clearAllSteps,
  };
}

export default useAgentSteps;
