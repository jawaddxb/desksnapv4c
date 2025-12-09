
import { Presentation } from '../types';
import { IdeationSession } from '../types/ideation';

const DB_NAME = 'decksnap_db';
const DECKS_STORE = 'decks';
const IDEATION_STORE = 'ideation_sessions';
const DB_VERSION = 2; // Incremented for new store

// Helper to open the database
const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create decks store if not exists (v1)
            if (!db.objectStoreNames.contains(DECKS_STORE)) {
                db.createObjectStore(DECKS_STORE, { keyPath: 'id' });
            }

            // Create ideation sessions store (v2)
            if (!db.objectStoreNames.contains(IDEATION_STORE)) {
                db.createObjectStore(IDEATION_STORE, { keyPath: 'id' });
            }
        };
    });
};

// ============ DECK STORAGE ============

export const getSavedDecks = async (): Promise<Presentation[]> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(DECKS_STORE, 'readonly');
            const store = transaction.objectStore(DECKS_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const decks = request.result as Presentation[];
                resolve(decks.sort((a, b) => b.lastModified - a.lastModified));
            };
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to load decks from DB", e);
        return [];
    }
};

export const saveDeckToStorage = async (deck: Presentation): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(DECKS_STORE, 'readwrite');
            const store = transaction.objectStore(DECKS_STORE);
            const request = store.put(deck);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to save deck to DB", e);
    }
};

export const deleteDeckFromStorage = async (deckId: string): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(DECKS_STORE, 'readwrite');
            const store = transaction.objectStore(DECKS_STORE);
            const request = store.delete(deckId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to delete deck from DB", e);
    }
};

// ============ IDEATION SESSION STORAGE ============

export const getIdeationSessions = async (): Promise<IdeationSession[]> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(IDEATION_STORE, 'readonly');
            const store = transaction.objectStore(IDEATION_STORE);
            const request = store.getAll();

            request.onsuccess = () => {
                const sessions = request.result as IdeationSession[];
                resolve(sessions.sort((a, b) => b.lastModified - a.lastModified));
            };
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to load ideation sessions from DB", e);
        return [];
    }
};

export const getIdeationSession = async (id: string): Promise<IdeationSession | null> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(IDEATION_STORE, 'readonly');
            const store = transaction.objectStore(IDEATION_STORE);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to load ideation session from DB", e);
        return null;
    }
};

export const saveIdeationSession = async (session: IdeationSession): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(IDEATION_STORE, 'readwrite');
            const store = transaction.objectStore(IDEATION_STORE);
            const request = store.put({ ...session, lastModified: Date.now() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to save ideation session to DB", e);
    }
};

export const deleteIdeationSession = async (sessionId: string): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(IDEATION_STORE, 'readwrite');
            const store = transaction.objectStore(IDEATION_STORE);
            const request = store.delete(sessionId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("Failed to delete ideation session from DB", e);
    }
};

// NEW: Recover lost data from localStorage
export const migrateLegacyData = async (): Promise<void> => {
    const LEGACY_KEY = 'decksnap_saved_decks'; // Checking common variations
    const LEGACY_KEY_2 = 'decksnap_decks';
    
    let rawData = localStorage.getItem(LEGACY_KEY) || localStorage.getItem(LEGACY_KEY_2);
    
    if (!rawData) return;

    try {
        const decks = JSON.parse(rawData);
        if (Array.isArray(decks) && decks.length > 0) {
            console.log(`Migrating ${decks.length} legacy decks to IndexedDB...`);
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
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
