/**
 * Handler Hooks
 *
 * Focused hooks for handling user interactions.
 * Extracted from AppContent.tsx for better organization.
 */

export { useChatHandlers } from './useChatHandlers';
export type { UseChatHandlersOptions, UseChatHandlersReturn } from './useChatHandlers';

export { useDeckHandlers } from './useDeckHandlers';
export type {
  UseDeckHandlersOptions,
  UseDeckHandlersReturn,
  DeckPlan,
} from './useDeckHandlers';

export { useWorkspaceHandlers } from './useWorkspaceHandlers';
export type {
  UseWorkspaceHandlersOptions,
  UseWorkspaceHandlersReturn,
} from './useWorkspaceHandlers';
