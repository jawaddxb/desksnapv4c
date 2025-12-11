/**
 * Storage Service
 *
 * IndexedDB storage operations for ideation sessions.
 * NOTE: Deck storage has been migrated to the backend API.
 * Ideation will be migrated in a future iteration.
 */

import { IdeationSession } from '../types/ideation';
import {
  STORES,
  getAllFromStore,
  getByIdFromStore,
  saveToStore,
  deleteFromStore,
} from './db/dbHelpers';

// ============ IDEATION SESSION STORAGE ============

export const getIdeationSessions = async (): Promise<IdeationSession[]> => {
  try {
    return await getAllFromStore<IdeationSession>(STORES.IDEATION);
  } catch (e) {
    console.error("Failed to load ideation sessions from DB", e);
    return [];
  }
};

export const getIdeationSession = async (id: string): Promise<IdeationSession | null> => {
  try {
    return await getByIdFromStore<IdeationSession>(STORES.IDEATION, id);
  } catch (e) {
    console.error("Failed to load ideation session from DB", e);
    return null;
  }
};

export const saveIdeationSession = async (session: IdeationSession): Promise<void> => {
  try {
    await saveToStore(STORES.IDEATION, { ...session, lastModified: Date.now() });
  } catch (e) {
    console.error("Failed to save ideation session to DB", e);
  }
};

export const deleteIdeationSession = async (sessionId: string): Promise<void> => {
  try {
    await deleteFromStore(STORES.IDEATION, sessionId);
  } catch (e) {
    console.error("Failed to delete ideation session from DB", e);
  }
};
