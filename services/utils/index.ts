/**
 * Service Utilities
 *
 * Central exports for service utility functions.
 */

export {
  // Case conversion primitives
  snakeToCamel,
  camelToSnake,
  // Object key conversion
  snakeToCamelObject,
  camelToSnakeObject,
  // Field mapping
  mapFields,
  // Null/undefined handling
  undefinedToNull,
  nullToUndefined,
  emptyToNull,
  nullToEmpty,
  // Date conversion
  isoToTimestamp,
  timestampToIso,
  // Partial update helpers
  createPartialUpdate,
} from './conversion';

export type { FieldMapping } from './conversion';
