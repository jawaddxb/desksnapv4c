/**
 * Hook Utilities
 *
 * Central exports for hook utility functions.
 */

// Query key factories
export {
  createQueryKeys,
  presentationKeys,
  ideationKeys,
  roughDraftKeys,
  versionKeys,
  matchesKeyPattern,
  compoundKey,
} from './queryKeys';

export type {
  QueryKeyFactory,
  PresentationFilters,
  IdeationFilters,
  RoughDraftFilters,
  VersionFilters,
} from './queryKeys';

// Mutation factories
export {
  createOptimisticMutation,
  createSimpleMutation,
  createAddToListMutation,
  createRemoveFromListMutation,
} from './mutationFactory';

export type {
  OptimisticMutationConfig,
  SimpleMutationConfig,
  ListMutationConfig,
} from './mutationFactory';
