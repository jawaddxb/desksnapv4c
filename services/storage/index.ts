/**
 * Storage Module
 *
 * Exports storage adapters and utilities.
 */

export {
  createStorageAdapter,
  createFallbackAdapter,
  createCachedAdapter,
} from './StorageAdapter';

export type {
  StorageAdapter,
  StorageAdapterOptions,
} from './StorageAdapter';
