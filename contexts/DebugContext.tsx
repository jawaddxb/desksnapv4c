/**
 * DebugContext (Facade)
 *
 * @deprecated This facade is deprecated. Use the focused contexts directly:
 * - `DebugUIContext` for debug UI toggle state
 * - `AgentActivityContext` for agent processing and image generation
 *
 * BACKWARD COMPATIBILITY LAYER
 *
 * This context composes DebugUIContext and AgentActivityContext
 * to provide the legacy DebugContext API for existing consumers.
 * It will be removed in a future version.
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { AgentLog } from '../types/agents';
import {
  DebugUIProvider,
  useDebugUISafe,
  DebugUIState,
  DebugUIActions,
} from './DebugUIContext';
import {
  AgentActivityProvider,
  useAgentActivitySafe,
  AgentActivityState,
  AgentActivityActions,
  SlideInfo,
} from './AgentActivityContext';

// Re-export SlideInfo for backward compatibility
export type { SlideInfo } from './AgentActivityContext';

// ============ Types ============

export interface DebugState extends DebugUIState, AgentActivityState {}

export interface DebugActions extends DebugUIActions, AgentActivityActions {}

export interface DebugContextValue extends DebugState {
  actions: DebugActions;
}

// ============ Context ============

const DebugContext = createContext<DebugContextValue | null>(null);

// ============ Internal Composer ============

/**
 * Internal component that composes the two focused contexts
 */
const DebugContextComposer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const debugUI = useDebugUISafe();
  const agentActivity = useAgentActivitySafe();

  // Compose actions from both contexts
  const actions = useMemo<DebugActions>(() => ({
    // Debug UI actions
    toggleDebugUI: debugUI?.actions.toggleDebugUI ?? (() => {}),
    setDebugUIEnabled: debugUI?.actions.setDebugUIEnabled ?? (() => {}),
    toggleDevToolbar: debugUI?.actions.toggleDevToolbar ?? (() => {}),
    setDevToolbarVisible: debugUI?.actions.setDevToolbarVisible ?? (() => {}),
    clearDebugStorage: debugUI?.actions.clearDebugStorage ?? (() => {}),
    // Agent activity actions
    setAgentLogs: agentActivity?.actions.setAgentLogs ?? (() => {}),
    getAgentLogs: agentActivity?.actions.getAgentLogs ?? (() => []),
    clearAgentLogs: agentActivity?.actions.clearAgentLogs ?? (() => {}),
    setCurrentActivity: agentActivity?.actions.setCurrentActivity ?? (() => {}),
    startAgentProcessing: agentActivity?.actions.startAgentProcessing ?? (() => {}),
    updateAgentProgress: agentActivity?.actions.updateAgentProgress ?? (() => {}),
    stopAgentProcessing: agentActivity?.actions.stopAgentProcessing ?? (() => {}),
    recordGeneratedImage: agentActivity?.actions.recordGeneratedImage ?? (() => {}),
    clearGeneratedImages: agentActivity?.actions.clearGeneratedImages ?? (() => {}),
  }), [debugUI?.actions, agentActivity?.actions]);

  // Compose context value from both contexts
  const value = useMemo<DebugContextValue>(() => ({
    // Debug UI state
    isDebugModeAvailable: debugUI?.isDebugModeAvailable ?? false,
    isDebugUIEnabled: debugUI?.isDebugUIEnabled ?? false,
    showDevToolbar: debugUI?.showDevToolbar ?? false,
    // Agent activity state
    agentLogs: agentActivity?.agentLogs ?? new Map(),
    currentAgentActivity: agentActivity?.currentAgentActivity ?? null,
    isAgentActive: agentActivity?.isAgentActive ?? false,
    agentTotalSlides: agentActivity?.agentTotalSlides ?? 0,
    agentCompletedSlides: agentActivity?.agentCompletedSlides ?? 0,
    agentSlides: agentActivity?.agentSlides ?? [],
    generatedImages: agentActivity?.generatedImages ?? new Map(),
    // Composed actions
    actions,
  }), [debugUI, agentActivity, actions]);

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  );
};

// ============ Provider ============

export interface DebugProviderProps {
  children: ReactNode;
}

/**
 * Combined debug provider that includes both DebugUI and AgentActivity contexts.
 * Use this for backward compatibility with existing code.
 *
 * For new code, consider using DebugUIProvider and AgentActivityProvider separately.
 */
export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  return (
    <DebugUIProvider>
      <AgentActivityProvider>
        <DebugContextComposer>
          {children}
        </DebugContextComposer>
      </AgentActivityProvider>
    </DebugUIProvider>
  );
};

// ============ Hooks ============

/**
 * Access debug state and actions.
 * Must be used within a DebugProvider.
 *
 * @deprecated For new code, prefer useDebugUI() or useAgentActivity() directly.
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
 *
 * @deprecated For new code, prefer useDebugUISafe() or useAgentActivitySafe() directly.
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
