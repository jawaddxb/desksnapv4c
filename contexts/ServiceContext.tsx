/**
 * Service Context
 *
 * Provides dependency injection for services across the application.
 * This enables:
 * - Easy mocking for tests
 * - Swapping implementations at runtime
 * - Centralized service management
 */

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { GoogleGenAI } from '@google/genai';
import { getAIClient, hasApiKey } from '../services/aiClient';

/**
 * Service interface definitions.
 * Each service can be replaced with a mock or alternative implementation.
 */
export interface Services {
  /**
   * Get the AI client instance.
   * Returns the Google GenAI client for AI operations.
   */
  getAIClient: () => GoogleGenAI;

  /**
   * Check if an API key is configured.
   */
  hasApiKey: () => boolean;
}

/**
 * Default service implementations using the actual services.
 */
const defaultServices: Services = {
  getAIClient,
  hasApiKey,
};

/**
 * Service context - provides access to services throughout the app.
 */
const ServiceContext = createContext<Services | null>(null);

/**
 * Props for the ServiceProvider component.
 */
export interface ServiceProviderProps {
  /**
   * Optional custom services to override defaults.
   * Useful for testing or alternative implementations.
   */
  services?: Partial<Services>;
  children: ReactNode;
}

/**
 * Service provider component.
 * Wraps the app to provide services via context.
 *
 * @example
 * // In App.tsx
 * <ServiceProvider>
 *   <App />
 * </ServiceProvider>
 *
 * // For testing with mocks
 * <ServiceProvider services={{ getAIClient: mockAIClient }}>
 *   <Component />
 * </ServiceProvider>
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  services: customServices,
  children,
}) => {
  const services = useMemo(
    () => ({
      ...defaultServices,
      ...customServices,
    }),
    [customServices]
  );

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Hook to access services.
 * Must be used within a ServiceProvider.
 *
 * @throws Error if used outside of ServiceProvider
 *
 * @example
 * const { getAIClient } = useServices();
 * const client = getAIClient();
 */
export const useServices = (): Services => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

/**
 * Hook to get the AI client.
 * Convenience wrapper around useServices().getAIClient().
 *
 * @example
 * const aiClient = useAIClient();
 */
export const useAIClient = (): GoogleGenAI => {
  const { getAIClient } = useServices();
  return getAIClient();
};

/**
 * Hook to check if API key is configured.
 * Convenience wrapper around useServices().hasApiKey().
 */
export const useHasApiKey = (): boolean => {
  const { hasApiKey } = useServices();
  return hasApiKey();
};
