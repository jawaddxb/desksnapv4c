/**
 * useRealtimeSync Hook
 *
 * Manages the global WebSocket connection lifecycle.
 * Connects when authenticated, disconnects on logout.
 */

import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService, ConnectionStatus } from '@/services/api/websocketService';
import { useAuth } from '@/contexts/AuthContext';

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  // Set up query client for WebSocket service
  useEffect(() => {
    wsService.setQueryClient(queryClient);
  }, [queryClient]);

  // Subscribe to connection status changes
  useEffect(() => {
    const unsubscribe = wsService.onStatusChange(setConnectionStatus);
    return unsubscribe;
  }, []);

  // Disconnect when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      wsService.disconnect();
    }
  }, [isAuthenticated]);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting' || connectionStatus === 'reconnecting',
  };
}

export default useRealtimeSync;
