/**
 * Storage Adapter Interface
 *
 * Defines a unified interface for data persistence.
 * Single responsibility: Abstract storage operations.
 */

/**
 * Generic storage adapter interface.
 * Implementations can use IndexedDB, API, localStorage, etc.
 */
export interface StorageAdapter<T, ID = string> {
  /**
   * Get an item by ID.
   */
  get(id: ID): Promise<T | null>;

  /**
   * Get all items.
   */
  getAll(): Promise<T[]>;

  /**
   * Save an item (create or update).
   */
  save(item: T): Promise<T>;

  /**
   * Delete an item by ID.
   */
  delete(id: ID): Promise<void>;

  /**
   * Check if an item exists.
   */
  exists?(id: ID): Promise<boolean>;

  /**
   * Query items with a filter.
   */
  query?(filter: (item: T) => boolean): Promise<T[]>;

  /**
   * Count items.
   */
  count?(): Promise<number>;
}

/**
 * Storage adapter options.
 */
export interface StorageAdapterOptions {
  /** Storage key/table name */
  storeName: string;
  /** ID field name in the stored object */
  idField?: string;
}

/**
 * Create a typed storage adapter.
 * Factory function for creating storage adapters.
 */
export function createStorageAdapter<T extends { id: string }>(
  implementation: StorageAdapter<T>
): StorageAdapter<T> {
  return implementation;
}

/**
 * Combine multiple storage adapters with fallback support.
 * Primary adapter is tried first, falls back to secondary on failure.
 */
export function createFallbackAdapter<T>(
  primary: StorageAdapter<T>,
  secondary: StorageAdapter<T>
): StorageAdapter<T> {
  return {
    async get(id: string): Promise<T | null> {
      try {
        const result = await primary.get(id);
        if (result) return result;
      } catch (error) {
        console.warn('[FallbackAdapter] Primary get failed, trying secondary', error);
      }
      return secondary.get(id);
    },

    async getAll(): Promise<T[]> {
      try {
        return await primary.getAll();
      } catch (error) {
        console.warn('[FallbackAdapter] Primary getAll failed, trying secondary', error);
        return secondary.getAll();
      }
    },

    async save(item: T): Promise<T> {
      try {
        return await primary.save(item);
      } catch (error) {
        console.warn('[FallbackAdapter] Primary save failed, trying secondary', error);
        return secondary.save(item);
      }
    },

    async delete(id: string): Promise<void> {
      try {
        await primary.delete(id);
      } catch (error) {
        console.warn('[FallbackAdapter] Primary delete failed, trying secondary', error);
        await secondary.delete(id);
      }
    },
  };
}

/**
 * Create a cached storage adapter.
 * Caches reads in memory for faster subsequent access.
 */
export function createCachedAdapter<T extends { id: string }>(
  adapter: StorageAdapter<T>,
  ttlMs: number = 60000
): StorageAdapter<T> {
  const cache = new Map<string, { item: T; timestamp: number }>();
  let allItemsCache: { items: T[]; timestamp: number } | null = null;

  const isExpired = (timestamp: number) => Date.now() - timestamp > ttlMs;

  return {
    async get(id: string): Promise<T | null> {
      const cached = cache.get(id);
      if (cached && !isExpired(cached.timestamp)) {
        return cached.item;
      }
      const item = await adapter.get(id);
      if (item) {
        cache.set(id, { item, timestamp: Date.now() });
      }
      return item;
    },

    async getAll(): Promise<T[]> {
      if (allItemsCache && !isExpired(allItemsCache.timestamp)) {
        return allItemsCache.items;
      }
      const items = await adapter.getAll();
      allItemsCache = { items, timestamp: Date.now() };
      items.forEach(item => {
        cache.set(item.id, { item, timestamp: Date.now() });
      });
      return items;
    },

    async save(item: T): Promise<T> {
      const saved = await adapter.save(item);
      cache.set(saved.id, { item: saved, timestamp: Date.now() });
      allItemsCache = null; // Invalidate all items cache
      return saved;
    },

    async delete(id: string): Promise<void> {
      await adapter.delete(id);
      cache.delete(id);
      allItemsCache = null; // Invalidate all items cache
    },
  };
}
