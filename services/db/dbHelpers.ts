/**
 * IndexedDB Helper Layer
 *
 * Generic, reusable functions for IndexedDB operations.
 * Eliminates DRY violations by providing a common pattern for all DB operations.
 */

const DB_NAME = 'decksnap_db';
const DB_VERSION = 2;

// Store name constants
export const STORES = {
  DECKS: 'decks',
  IDEATION: 'ideation_sessions',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

/**
 * Open the IndexedDB database.
 * Handles version upgrades and store creation.
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create decks store if not exists (v1)
      if (!db.objectStoreNames.contains(STORES.DECKS)) {
        db.createObjectStore(STORES.DECKS, { keyPath: 'id' });
      }

      // Create ideation sessions store (v2)
      if (!db.objectStoreNames.contains(STORES.IDEATION)) {
        db.createObjectStore(STORES.IDEATION, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Generic query helper for read operations.
 * Handles the common pattern of opening a transaction and executing a request.
 */
export async function queryStore<T>(
  storeName: StoreName,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Generic mutation helper for write operations.
 * Handles the common pattern of opening a readwrite transaction.
 */
export async function mutateStore<T = void>(
  storeName: StoreName,
  operation: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all items from a store, sorted by lastModified (descending).
 */
export async function getAllFromStore<T extends { lastModified: number }>(
  storeName: StoreName
): Promise<T[]> {
  const items = await queryStore<T[]>(storeName, (store) => store.getAll());
  return items.sort((a, b) => b.lastModified - a.lastModified);
}

/**
 * Get a single item by ID from a store.
 */
export async function getByIdFromStore<T>(
  storeName: StoreName,
  id: string
): Promise<T | null> {
  const item = await queryStore<T | undefined>(storeName, (store) => store.get(id));
  return item ?? null;
}

/**
 * Save (put) an item to a store.
 */
export async function saveToStore<T extends { id: string }>(
  storeName: StoreName,
  item: T
): Promise<void> {
  await mutateStore(storeName, (store) => store.put(item));
}

/**
 * Delete an item from a store by ID.
 */
export async function deleteFromStore(
  storeName: StoreName,
  id: string
): Promise<void> {
  await mutateStore(storeName, (store) => store.delete(id));
}

/**
 * Result type for operations that can fail gracefully.
 */
export type DBResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

/**
 * Wrap a DB operation with error handling that returns a Result type.
 * This allows callers to distinguish between "no data" and "operation failed".
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<DBResult<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error('Database operation failed:', error);
    return { success: false, error: error as Error };
  }
}
