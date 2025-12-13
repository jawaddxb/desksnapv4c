/**
 * Mutation Factory
 *
 * Generic factory for creating TanStack Query mutations with optimistic updates.
 * Eliminates boilerplate for common mutation patterns.
 */

import { useMutation, useQueryClient, UseMutationOptions, QueryClient } from '@tanstack/react-query';

// ============ Types ============

/**
 * Configuration for an optimistic update mutation.
 */
export interface OptimisticMutationConfig<TData, TVariables, TContext = unknown> {
  /** The mutation function to call */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Query keys to cancel and update optimistically */
  queryKey: (variables: TVariables) => readonly unknown[];
  /** Function to create the optimistic data */
  optimisticUpdate?: (current: TData | undefined, variables: TVariables) => TData;
  /** Query keys to invalidate on settlement */
  invalidateKeys?: readonly unknown[][];
  /** Additional mutation options */
  options?: Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>;
}

/**
 * Context returned by onMutate for rollback.
 */
interface OptimisticContext<TData> {
  previous: TData | undefined;
}

// ============ Factory Functions ============

/**
 * Create an optimistic update mutation hook.
 *
 * @example
 * const useUpdatePresentation = createOptimisticMutation({
 *   mutationFn: ({ id, updates }) => updatePresentation(id, updates),
 *   queryKey: ({ id }) => presentationKeys.detail(id),
 *   optimisticUpdate: (current, { updates }) => ({ ...current, ...updates }),
 *   invalidateKeys: [presentationKeys.lists()],
 * });
 */
export const createOptimisticMutation = <TData, TVariables>(
  config: OptimisticMutationConfig<TData, TVariables, OptimisticContext<TData>>
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables, OptimisticContext<TData>>({
      mutationFn: config.mutationFn,

      onMutate: async (variables) => {
        const queryKey = config.queryKey(variables);

        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey });

        // Snapshot previous value
        const previous = queryClient.getQueryData<TData>(queryKey);

        // Optimistically update
        if (config.optimisticUpdate && previous !== undefined) {
          const optimisticData = config.optimisticUpdate(previous, variables);
          queryClient.setQueryData(queryKey, optimisticData);
        }

        return { previous };
      },

      onError: (_err, variables, context) => {
        // Rollback on error
        if (context?.previous !== undefined) {
          const queryKey = config.queryKey(variables);
          queryClient.setQueryData(queryKey, context.previous);
        }
      },

      onSettled: () => {
        // Invalidate related queries
        if (config.invalidateKeys) {
          for (const key of config.invalidateKeys) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }
      },

      ...config.options,
    });
  };
};

/**
 * Create a simple mutation hook without optimistic updates.
 *
 * @example
 * const useDeletePresentation = createSimpleMutation({
 *   mutationFn: deletePresentation,
 *   invalidateKeys: [presentationKeys.lists()],
 *   onSuccess: (_, id) => {
 *     queryClient.removeQueries({ queryKey: presentationKeys.detail(id) });
 *   },
 * });
 */
export interface SimpleMutationConfig<TData, TVariables> {
  /** The mutation function to call */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Query keys to invalidate on success */
  invalidateKeys?: readonly unknown[][];
  /** Additional mutation options */
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>;
}

export const createSimpleMutation = <TData, TVariables>(
  config: SimpleMutationConfig<TData, TVariables>
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
      mutationFn: config.mutationFn,

      onSuccess: (...args) => {
        // Invalidate related queries
        if (config.invalidateKeys) {
          for (const key of config.invalidateKeys) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }

        // Call user-provided onSuccess
        config.options?.onSuccess?.(...args);
      },

      ...config.options,
    });
  };
};

// ============ List Mutation Helpers ============

/**
 * Configuration for list-based optimistic mutations (add/remove items).
 */
export interface ListMutationConfig<TItem, TVariables> {
  /** The mutation function to call */
  mutationFn: (variables: TVariables) => Promise<TItem>;
  /** Query key for the list */
  listQueryKey: readonly unknown[];
  /** Query key for the parent detail (if applicable) */
  detailQueryKey?: (variables: TVariables) => readonly unknown[];
  /** Function to create a temporary item for optimistic add */
  createTempItem?: (variables: TVariables) => TItem;
  /** Function to get item ID from variables (for remove) */
  getItemId?: (variables: TVariables) => string;
  /** Query keys to invalidate on settlement */
  invalidateKeys?: readonly unknown[][];
}

/**
 * Create a mutation for adding items to a list with optimistic update.
 */
export const createAddToListMutation = <
  TItem extends { id: string },
  TList extends { items: TItem[] } | TItem[],
  TVariables
>(
  config: ListMutationConfig<TItem, TVariables> & {
    createTempItem: (variables: TVariables) => TItem;
  }
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<TItem, Error, TVariables, { previous: TList | undefined }>({
      mutationFn: config.mutationFn,

      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: config.listQueryKey });

        const previous = queryClient.getQueryData<TList>(config.listQueryKey);

        if (previous) {
          const tempItem = config.createTempItem(variables);

          if (Array.isArray(previous)) {
            queryClient.setQueryData(config.listQueryKey, [...previous, tempItem]);
          } else if ('items' in previous) {
            queryClient.setQueryData(config.listQueryKey, {
              ...previous,
              items: [...previous.items, tempItem],
            });
          }
        }

        return { previous };
      },

      onError: (_err, _variables, context) => {
        if (context?.previous !== undefined) {
          queryClient.setQueryData(config.listQueryKey, context.previous);
        }
      },

      onSuccess: (newItem, variables) => {
        // Replace temp item with real item
        const current = queryClient.getQueryData<TList>(config.listQueryKey);
        if (current) {
          if (Array.isArray(current)) {
            queryClient.setQueryData(
              config.listQueryKey,
              current.map((item) =>
                item.id.startsWith('temp-') ? newItem : item
              )
            );
          } else if ('items' in current) {
            queryClient.setQueryData(config.listQueryKey, {
              ...current,
              items: current.items.map((item) =>
                item.id.startsWith('temp-') ? newItem : item
              ),
            });
          }
        }
      },

      onSettled: () => {
        if (config.invalidateKeys) {
          for (const key of config.invalidateKeys) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }
      },
    });
  };
};

/**
 * Create a mutation for removing items from a list with optimistic update.
 */
export const createRemoveFromListMutation = <
  TItem extends { id: string },
  TList extends { items: TItem[] } | TItem[],
  TVariables
>(
  config: ListMutationConfig<TItem, TVariables> & {
    getItemId: (variables: TVariables) => string;
  }
) => {
  return () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, TVariables, { previous: TList | undefined }>({
      mutationFn: config.mutationFn as (variables: TVariables) => Promise<void>,

      onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey: config.listQueryKey });

        const previous = queryClient.getQueryData<TList>(config.listQueryKey);

        if (previous) {
          const itemId = config.getItemId(variables);

          if (Array.isArray(previous)) {
            queryClient.setQueryData(
              config.listQueryKey,
              previous.filter((item) => item.id !== itemId)
            );
          } else if ('items' in previous) {
            queryClient.setQueryData(config.listQueryKey, {
              ...previous,
              items: previous.items.filter((item) => item.id !== itemId),
            });
          }
        }

        return { previous };
      },

      onError: (_err, _variables, context) => {
        if (context?.previous !== undefined) {
          queryClient.setQueryData(config.listQueryKey, context.previous);
        }
      },

      onSettled: () => {
        if (config.invalidateKeys) {
          for (const key of config.invalidateKeys) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        }
      },
    });
  };
};

// ============ Exports ============

export default {
  createOptimisticMutation,
  createSimpleMutation,
  createAddToListMutation,
  createRemoveFromListMutation,
};
