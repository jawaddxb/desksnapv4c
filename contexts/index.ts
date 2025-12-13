/**
 * Context Providers
 *
 * Exports all context providers and hooks for the application.
 */

// Authentication
export { AuthProvider, useAuth, useAuthSafe } from './AuthContext';

// React Query
export { QueryProvider } from './QueryContext';

// Network status
export { NetworkProvider, useNetwork } from './NetworkContext';

// Debug/Agent activity - Focused contexts (preferred for new code)
export {
  DebugUIProvider,
  useDebugUI,
  useDebugUISafe,
  useIsDebugAvailable,
  useIsDebugEnabled,
} from './DebugUIContext';
export type { DebugUIState, DebugUIActions, DebugUIContextValue } from './DebugUIContext';

export {
  AgentActivityProvider,
  useAgentActivity,
  useAgentActivitySafe,
  useIsAgentActive,
} from './AgentActivityContext';
export type {
  SlideInfo,
  AgentActivityState,
  AgentActivityActions,
  AgentActivityContextValue,
} from './AgentActivityContext';

// Debug/Agent activity - Legacy facade (for backward compatibility)
export { DebugProvider, useDebug, useDebugSafe } from './DebugContext';
export type { DebugState, DebugActions, DebugContextValue } from './DebugContext';

// Service injection
export { ServiceProvider, useServices, useServicesSafe } from './ServiceContext';
export type { Services, ServiceProviderProps } from './ServiceContext';

// Chat UI state (active context for chat/copilot interface)
export { ChatUIProvider, useChatUI } from './ChatUIContext';

// Workspace Mode
export {
  WorkspaceModeProvider,
  useWorkspaceMode,
  useWorkspaceModeSafe,
} from './WorkspaceModeContext';
export type {
  WorkspaceMode,
  WorkspaceModeContextValue,
  WorkspaceModeProviderProps,
  RoughDraftSource,
  RoughDraftNavigationOptions,
  SourcesPreset,
  SourcesRecipe,
} from './WorkspaceModeContext';

// Text selection
export { TextSelectionProvider, useTextSelection } from './TextSelectionContext';

// Legacy presentation context (if still used)
export { PresentationProvider, usePresentationContext } from './PresentationContext';
