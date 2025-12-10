/**
 * Hybrid Storage Service
 *
 * Provides unified storage operations that work both locally (IndexedDB)
 * and remotely (API) based on authentication status.
 *
 * Strategy:
 * - Unauthenticated: Use IndexedDB only (existing behavior)
 * - Authenticated: Use API for primary storage, IndexedDB for offline cache
 *
 * This enables:
 * - Seamless offline-first experience
 * - Cloud sync when logged in
 * - Migration from local to cloud on login
 */

import { Presentation } from '../types';
import { isAuthenticated } from './api/apiClient';
import {
  listPresentations,
  getPresentation,
  createPresentation as apiCreatePresentation,
  updatePresentation as apiUpdatePresentation,
  deletePresentation as apiDeletePresentation,
  syncPresentation,
} from './api/presentationService';
import {
  getSavedDecks as getLocalDecks,
  saveDeckToStorage as saveLocalDeck,
  deleteDeckFromStorage as deleteLocalDeck,
} from './storageService';

// ============ Hybrid Storage Operations ============

/**
 * Get all saved presentations.
 * Uses API if authenticated, otherwise IndexedDB.
 */
export const getDecks = async (): Promise<Presentation[]> => {
  if (isAuthenticated()) {
    try {
      const { presentations } = await listPresentations(1, 100);
      // Also cache locally for offline access
      for (const p of presentations) {
        await saveLocalDeck(p);
      }
      return presentations;
    } catch (error) {
      console.warn('Failed to fetch from API, falling back to local storage', error);
      return getLocalDecks();
    }
  }
  return getLocalDecks();
};

/**
 * Save a presentation.
 * Saves to API if authenticated (with local cache), otherwise just local.
 */
export const saveDeck = async (deck: Presentation): Promise<Presentation> => {
  // Always save locally first (offline-first)
  await saveLocalDeck(deck);

  if (isAuthenticated()) {
    try {
      // Sync to API
      const synced = await syncPresentation(deck);
      // Update local cache with server response (includes server-generated fields)
      await saveLocalDeck(synced);
      return synced;
    } catch (error) {
      console.warn('Failed to sync to API, saved locally', error);
      return deck;
    }
  }
  return deck;
};

/**
 * Delete a presentation.
 * Deletes from both API (if authenticated) and local storage.
 */
export const deleteDeck = async (deckId: string): Promise<void> => {
  // Always delete locally
  await deleteLocalDeck(deckId);

  if (isAuthenticated()) {
    try {
      await apiDeletePresentation(deckId);
    } catch (error) {
      console.warn('Failed to delete from API', error);
    }
  }
};

/**
 * Load a specific presentation by ID.
 * Tries API first if authenticated, falls back to local.
 */
export const loadDeck = async (deckId: string): Promise<Presentation | null> => {
  if (isAuthenticated()) {
    try {
      const presentation = await getPresentation(deckId);
      // Update local cache
      await saveLocalDeck(presentation);
      return presentation;
    } catch (error) {
      console.warn('Failed to load from API, trying local', error);
    }
  }

  // Try local storage
  const localDecks = await getLocalDecks();
  return localDecks.find(d => d.id === deckId) || null;
};

// ============ Migration Operations ============

/**
 * Migrate local presentations to the cloud after login.
 * This syncs any locally-created presentations to the user's account.
 */
export const migrateLocalToCloud = async (): Promise<{
  migrated: number;
  failed: number;
}> => {
  if (!isAuthenticated()) {
    return { migrated: 0, failed: 0 };
  }

  const localDecks = await getLocalDecks();
  let migrated = 0;
  let failed = 0;

  for (const deck of localDecks) {
    try {
      await syncPresentation(deck);
      migrated++;
    } catch {
      failed++;
    }
  }

  return { migrated, failed };
};

/**
 * Download all cloud presentations to local storage for offline access.
 */
export const syncCloudToLocal = async (): Promise<number> => {
  if (!isAuthenticated()) {
    return 0;
  }

  try {
    const { presentations } = await listPresentations(1, 100);
    for (const p of presentations) {
      await saveLocalDeck(p);
    }
    return presentations.length;
  } catch {
    return 0;
  }
};

// ============ Export for Easy Migration ============

export default {
  getDecks,
  saveDeck,
  deleteDeck,
  loadDeck,
  migrateLocalToCloud,
  syncCloudToLocal,
};
