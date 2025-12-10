/**
 * Storage Service
 *
 * High-level storage operations for decks and ideation sessions.
 * Uses the generic dbHelpers for all IndexedDB operations.
 */

import { Presentation } from '../types';
import { IdeationSession } from '../types/ideation';
import {
  STORES,
  getAllFromStore,
  getByIdFromStore,
  saveToStore,
  deleteFromStore,
  openDB,
  mutateStore,
} from './db/dbHelpers';

// ============ DECK STORAGE ============

export const getSavedDecks = async (): Promise<Presentation[]> => {
  try {
    return await getAllFromStore<Presentation>(STORES.DECKS);
  } catch (e) {
    console.error("Failed to load decks from DB", e);
    return [];
  }
};

export const saveDeckToStorage = async (deck: Presentation): Promise<void> => {
  try {
    await saveToStore(STORES.DECKS, deck);
  } catch (e) {
    console.error("Failed to save deck to DB", e);
  }
};

export const deleteDeckFromStorage = async (deckId: string): Promise<void> => {
  try {
    await deleteFromStore(STORES.DECKS, deckId);
  } catch (e) {
    console.error("Failed to delete deck from DB", e);
  }
};

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

// ============ MIGRATION ============

/**
 * Migrate legacy data from localStorage to IndexedDB.
 * This is a one-time operation for users upgrading from older versions.
 */
export const migrateLegacyData = async (): Promise<void> => {
  const LEGACY_KEY = 'decksnap_saved_decks';
  const LEGACY_KEY_2 = 'decksnap_decks';

  const rawData = localStorage.getItem(LEGACY_KEY) || localStorage.getItem(LEGACY_KEY_2);

  if (!rawData) return;

  try {
    const decks = JSON.parse(rawData);
    if (Array.isArray(decks) && decks.length > 0) {
      console.log(`Migrating ${decks.length} legacy decks to IndexedDB...`);
      const db = await openDB();
      const transaction = db.transaction(STORES.DECKS, 'readwrite');
      const store = transaction.objectStore(STORES.DECKS);

      for (const deck of decks) {
        // Ensure ID exists
        if (!deck.id) deck.id = crypto.randomUUID();
        store.put(deck);
      }

      // Clear legacy data after successful migration to prevent duplicates
      transaction.oncomplete = () => {
        localStorage.removeItem(LEGACY_KEY);
        localStorage.removeItem(LEGACY_KEY_2);
        console.log("Migration complete.");
      };
    }
  } catch (e) {
    console.error("Migration failed", e);
  }
};
