/**
 * useIdeationConnections Hook
 *
 * Manages note connections for ideation sessions.
 * Handles creating and removing links between notes.
 *
 * SRP: Connection management within ideation sessions.
 */

import { useCallback } from 'react';
import { IdeationSession, NoteConnection } from '../../types/ideation';

export interface UseIdeationConnectionsOptions {
  /** Setter for local session state */
  setLocalSession: React.Dispatch<React.SetStateAction<IdeationSession | null>>;
}

export interface UseIdeationConnectionsResult {
  /** Connect two notes */
  connectNotes: (fromId: string, toId: string) => void;
  /** Disconnect two notes */
  disconnectNotes: (fromId: string, toId: string) => void;
}

/**
 * Hook for managing ideation note connections.
 */
export function useIdeationConnections({
  setLocalSession,
}: UseIdeationConnectionsOptions): UseIdeationConnectionsResult {

  const connectNotes = useCallback((fromId: string, toId: string) => {
    setLocalSession(prev => {
      if (!prev) return null;

      // Check if connection already exists
      const exists = prev.connections.some(
        c => c.fromId === fromId && c.toId === toId
      );
      if (exists) return prev;

      const connection: NoteConnection = {
        id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fromId,
        toId,
      };

      return {
        ...prev,
        connections: [...prev.connections, connection],
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, [setLocalSession]);

  const disconnectNotes = useCallback((fromId: string, toId: string) => {
    setLocalSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        connections: prev.connections.filter(
          c => !(c.fromId === fromId && c.toId === toId)
        ),
        lastModified: Date.now(),
        syncStatus: 'pending' as const,
      };
    });
  }, [setLocalSession]);

  return {
    connectNotes,
    disconnectNotes,
  };
}
