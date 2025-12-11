/**
 * usePresentationSubscription Hook
 *
 * Subscribes to real-time updates for a specific presentation.
 * Connects/disconnects WebSocket when presentation ID changes.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { wsService, ConnectionStatus, WebSocketMessage, UserInfo } from '../services/api/websocketService';
import { useAuth } from '../contexts/AuthContext';

interface PresentationSubscriptionState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionStatus: ConnectionStatus;
  activeUsers: UserInfo[];
  error: string | null;
}

export function usePresentationSubscription(presentationId: string | null) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<PresentationSubscriptionState>({
    isConnected: false,
    isConnecting: false,
    connectionStatus: 'disconnected',
    activeUsers: [],
    error: null,
  });

  // Track current presentation ID to handle StrictMode
  const currentPresentationIdRef = useRef<string | null>(null);

  // Connect to presentation room
  useEffect(() => {
    if (!presentationId || !isAuthenticated) {
      wsService.disconnect();
      currentPresentationIdRef.current = null;
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        connectionStatus: 'disconnected',
        activeUsers: [],
      }));
      return;
    }

    let mounted = true;
    currentPresentationIdRef.current = presentationId;

    const connect = async () => {
      try {
        setState(prev => ({ ...prev, isConnecting: true, error: null }));
        await wsService.connect(presentationId);
        if (mounted) {
          setState(prev => ({ ...prev, isConnecting: false }));
        }
      } catch (err) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            isConnecting: false,
            error: err instanceof Error ? err.message : 'Failed to connect',
          }));
        }
      }
    };

    connect();

    return () => {
      mounted = false;
      // Only disconnect if we're not immediately reconnecting to the same presentation
      // This handles React StrictMode which unmounts/remounts components
      setTimeout(() => {
        // If the ref still matches, we haven't remounted with the same ID
        if (currentPresentationIdRef.current !== presentationId) {
          wsService.disconnect();
        }
      }, 0);
    };
  }, [presentationId, isAuthenticated]);

  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = wsService.onStatusChange((status) => {
      setState(prev => ({
        ...prev,
        connectionStatus: status,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting' || status === 'reconnecting',
      }));
    });

    return unsubscribe;
  }, []);

  // Subscribe to user join/leave events
  useEffect(() => {
    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'user:joined' || message.type === 'user:left' || message.type === 'sync:state') {
        const activeUsers = (message.active_users as UserInfo[]) || [];
        setState(prev => ({ ...prev, activeUsers }));
      }
    });

    return unsubscribe;
  }, []);

  // Send slide update via WebSocket
  const sendSlideUpdate = useCallback(
    async (slideId: string, changes: Record<string, unknown>, baseVersion: number) => {
      return wsService.send({
        type: 'slide:update',
        slide_id: slideId,
        changes,
        base_version: baseVersion,
      });
    },
    []
  );

  // Send slide create via WebSocket
  const sendSlideCreate = useCallback(
    async (position: number, slideData: Record<string, unknown>, tempId: string) => {
      return wsService.send({
        type: 'slide:create',
        position,
        slide_data: slideData,
        temp_id: tempId,
      });
    },
    []
  );

  // Send slide delete via WebSocket
  const sendSlideDelete = useCallback(
    async (slideId: string, baseVersion: number) => {
      return wsService.send({
        type: 'slide:delete',
        slide_id: slideId,
        base_version: baseVersion,
      });
    },
    []
  );

  // Send slide reorder via WebSocket
  const sendSlideReorder = useCallback(
    async (slideOrders: Array<{ slide_id: string; new_position: number }>) => {
      return wsService.send({
        type: 'slide:reorder',
        slide_orders: slideOrders,
      });
    },
    []
  );

  // Send presentation update via WebSocket
  const sendPresentationUpdate = useCallback(
    async (changes: Record<string, unknown>, baseVersion: number) => {
      return wsService.send({
        type: 'presentation:update',
        changes,
        base_version: baseVersion,
      });
    },
    []
  );

  // Send cursor position (no ACK needed)
  const sendCursorMove = useCallback(
    (slideId: string | null, x: number, y: number) => {
      wsService.sendNoAck({
        type: 'cursor:move',
        slide_id: slideId,
        x,
        y,
      });
    },
    []
  );

  // Send selection change (no ACK needed)
  const sendSelectionChange = useCallback(
    (slideId: string | null, elementId: string | null) => {
      wsService.sendNoAck({
        type: 'selection:change',
        slide_id: slideId,
        element_id: elementId,
      });
    },
    []
  );

  return {
    ...state,
    sendSlideUpdate,
    sendSlideCreate,
    sendSlideDelete,
    sendSlideReorder,
    sendPresentationUpdate,
    sendCursorMove,
    sendSelectionChange,
  };
}

export default usePresentationSubscription;
