/**
 * NetworkContext
 *
 * Tracks online/offline status for the application.
 * Used to block functionality when offline (no offline support).
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

interface NetworkState {
  isOnline: boolean;
  lastOnlineAt: number | null;
}

interface NetworkContextValue extends NetworkState {
  checkConnection: () => Promise<boolean>;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [state, setState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastOnlineAt: null,
  });

  // Check connection by making a request to the API
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        cache: 'no-store',
      });
      const isOnline = response.ok;
      setState(prev => ({
        isOnline,
        lastOnlineAt: isOnline ? Date.now() : prev.lastOnlineAt,
      }));
      return isOnline;
    } catch {
      setState(prev => ({ ...prev, isOnline: false }));
      return false;
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setState({
        isOnline: true,
        lastOnlineAt: Date.now(),
      });
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    // Listen for browser online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection check
    checkConnection();

    // Periodic connection check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection]);

  return (
    <NetworkContext.Provider value={{ ...state, checkConnection }}>
      {children}
    </NetworkContext.Provider>
  );
};

// Hook to use network status
export const useNetwork = (): NetworkContextValue => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

// Hook for just online status
export const useIsOnline = (): boolean => {
  const { isOnline } = useNetwork();
  return isOnline;
};

export default NetworkProvider;
