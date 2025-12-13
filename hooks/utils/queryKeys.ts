/**
 * Query Keys Factory
 *
 * Generic factory for creating consistent TanStack Query cache keys.
 * Ensures type-safe, hierarchical key structure across all queries.
 */

// ============ Types ============

/**
 * Base query key structure.
 * All query keys follow a hierarchical pattern:
 * [resource] → [resource, 'list'] → [resource, 'list', { filters }]
 * [resource] → [resource, 'detail'] → [resource, 'detail', id]
 */
export interface QueryKeyFactory<TFilters = Record<string, unknown>> {
  /** Root key for this resource */
  all: readonly string[];
  /** Key for list queries */
  lists: () => readonly string[];
  /** Key for a specific list with filters */
  list: (filters?: TFilters) => readonly (string | TFilters)[];
  /** Key for detail queries */
  details: () => readonly string[];
  /** Key for a specific detail by ID */
  detail: (id: string) => readonly string[];
}

// ============ Factory Function ============

/**
 * Create a query key factory for a resource.
 *
 * @param resource - The resource name (e.g., 'presentations', 'ideations')
 * @returns A factory object with methods for generating query keys
 *
 * @example
 * const presentationKeys = createQueryKeys('presentations');
 *
 * // Use in queries
 * useQuery({ queryKey: presentationKeys.list({ page: 1 }) });
 * useQuery({ queryKey: presentationKeys.detail('abc-123') });
 *
 * // Use in mutations for invalidation
 * queryClient.invalidateQueries({ queryKey: presentationKeys.lists() });
 */
export const createQueryKeys = <TFilters = Record<string, unknown>>(
  resource: string
): QueryKeyFactory<TFilters> => ({
  all: [resource] as const,
  lists: () => [resource, 'list'] as const,
  list: (filters?: TFilters) =>
    filters
      ? ([resource, 'list', filters] as const)
      : ([resource, 'list'] as const),
  details: () => [resource, 'detail'] as const,
  detail: (id: string) => [resource, 'detail', id] as const,
});

// ============ Pre-defined Keys ============

/**
 * Pre-defined query keys for common resources.
 * These match the existing patterns in the codebase.
 */

export interface PresentationFilters {
  page?: number;
  pageSize?: number;
}

export const presentationKeys = createQueryKeys<PresentationFilters>('presentations');

export interface IdeationFilters {
  page?: number;
  pageSize?: number;
}

export const ideationKeys = createQueryKeys<IdeationFilters>('ideations');

export interface RoughDraftFilters {
  page?: number;
  pageSize?: number;
  status?: string;
}

export const roughDraftKeys = createQueryKeys<RoughDraftFilters>('rough-drafts');

export interface VersionFilters {
  presentationId?: string;
}

export const versionKeys = createQueryKeys<VersionFilters>('versions');

// ============ Utility Functions ============

/**
 * Check if a query key matches a pattern.
 * Useful for selective invalidation.
 *
 * @example
 * // Invalidate all presentation-related queries
 * queryClient.invalidateQueries({
 *   predicate: (query) => matchesKeyPattern(query.queryKey, ['presentations'])
 * });
 */
export const matchesKeyPattern = (
  queryKey: readonly unknown[],
  pattern: readonly string[]
): boolean => {
  if (pattern.length > queryKey.length) return false;
  return pattern.every((segment, i) => queryKey[i] === segment);
};

/**
 * Create a compound key for related resources.
 * Useful for queries that span multiple resources.
 *
 * @example
 * const slideImagesKey = compoundKey('presentations', 'abc-123', 'images');
 * // Result: ['presentations', 'abc-123', 'images']
 */
export const compoundKey = (...segments: string[]): readonly string[] =>
  segments as readonly string[];

// ============ Exports ============

export default {
  createQueryKeys,
  presentationKeys,
  ideationKeys,
  roughDraftKeys,
  versionKeys,
  matchesKeyPattern,
  compoundKey,
};
