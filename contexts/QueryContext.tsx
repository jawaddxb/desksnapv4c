/**
 * QueryContext
 *
 * TanStack Query provider for server state management.
 * Configures caching, refetching, and retry behavior.
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client with optimized defaults for real-time sync
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache data for 5 minutes after component unmount
      gcTime: 5 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus for fresh data
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Export query client for direct access (e.g., WebSocket cache updates)
export { queryClient };

export default QueryProvider;
