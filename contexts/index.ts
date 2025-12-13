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

// Debug/Agent activity
export { DebugProvider, useDebug, useDebugSafe } from './DebugContext';

// Service injection
export { ServiceProvider, useServices, useServicesSafe } from './ServiceContext';
export type { Services, ServiceProviderProps } from './ServiceContext';

// Chat/Copilot
export { ChatProvider, useChatContext, useChatContextSafe } from './ChatContext';
export type { ChatContextValue, ChatProviderProps, ImageStyle } from './ChatContext';

// UI State
export { UIStateProvider, useUIState, useUIStateSafe } from './UIStateContext';
export type {
  UIStateContextValue,
  UIStateProviderProps,
  RoughDraftState,
  ArchetypeChangeDialogState,
} from './UIStateContext';

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

// Chat UI state
export { ChatUIProvider, useChatUI } from './ChatUIContext';

// Legacy presentation context (if still used)
export { PresentationProvider, usePresentationContext } from './PresentationContext';
