/**
 * Conversion Utilities
 *
 * Generic utilities for converting between frontend (camelCase) and
 * backend (snake_case) object formats. Eliminates duplication across
 * API services.
 */

// ============ Case Conversion Primitives ============

/**
 * Convert a single string from snake_case to camelCase.
 */
export const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Convert a single string from camelCase to snake_case.
 */
export const camelToSnake = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

// ============ Object Key Conversion ============

type AnyObject = Record<string, unknown>;

/**
 * Recursively convert all keys in an object from snake_case to camelCase.
 */
export const snakeToCamelObject = <T extends AnyObject>(obj: T): AnyObject => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((item) =>
    typeof item === 'object' && item !== null ? snakeToCamelObject(item as AnyObject) : item
  ) as unknown as AnyObject;
  if (typeof obj !== 'object') return obj;

  const result: AnyObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    if (value !== null && typeof value === 'object') {
      result[camelKey] = Array.isArray(value)
        ? value.map((item) => typeof item === 'object' && item !== null ? snakeToCamelObject(item as AnyObject) : item)
        : snakeToCamelObject(value as AnyObject);
    } else {
      result[camelKey] = value;
    }
  }
  return result;
};

/**
 * Recursively convert all keys in an object from camelCase to snake_case.
 */
export const camelToSnakeObject = <T extends AnyObject>(obj: T): AnyObject => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map((item) =>
    typeof item === 'object' && item !== null ? camelToSnakeObject(item as AnyObject) : item
  ) as unknown as AnyObject;
  if (typeof obj !== 'object') return obj;

  const result: AnyObject = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    if (value !== null && typeof value === 'object') {
      result[snakeKey] = Array.isArray(value)
        ? value.map((item) => typeof item === 'object' && item !== null ? camelToSnakeObject(item as AnyObject) : item)
        : camelToSnakeObject(value as AnyObject);
    } else {
      result[snakeKey] = value;
    }
  }
  return result;
};

// ============ Field Mapping Utilities ============

/**
 * Map object fields with type-safe transformation.
 * Allows specifying which fields to include and how to transform values.
 */
export interface FieldMapping<TFrom, TTo> {
  /** Source field name (snake_case or camelCase) */
  from: keyof TFrom;
  /** Target field name */
  to: keyof TTo;
  /** Optional transform function */
  transform?: (value: unknown) => unknown;
  /** Default value if source is null/undefined */
  defaultValue?: unknown;
}

/**
 * Apply field mappings to convert an object.
 */
export const mapFields = <TFrom extends AnyObject, TTo extends AnyObject>(
  source: TFrom,
  mappings: FieldMapping<TFrom, TTo>[]
): Partial<TTo> => {
  const result: Partial<TTo> = {};

  for (const mapping of mappings) {
    const sourceValue = source[mapping.from as string];
    let value = sourceValue;

    if (sourceValue === null || sourceValue === undefined) {
      if (mapping.defaultValue !== undefined) {
        value = mapping.defaultValue;
      } else {
        continue;
      }
    }

    if (mapping.transform) {
      value = mapping.transform(value);
    }

    (result as AnyObject)[mapping.to as string] = value;
  }

  return result;
};

// ============ Null/Undefined Handling ============

/**
 * Convert undefined to null (for backend compatibility).
 */
export const undefinedToNull = <T>(value: T | undefined): T | null =>
  value === undefined ? null : value;

/**
 * Convert null to undefined (for frontend compatibility).
 */
export const nullToUndefined = <T>(value: T | null): T | undefined =>
  value === null ? undefined : value;

/**
 * Convert empty string to null (for backend compatibility).
 */
export const emptyToNull = (value: string | null | undefined): string | null =>
  value === '' || value === undefined ? null : value;

/**
 * Convert null/undefined to empty string (for frontend compatibility).
 */
export const nullToEmpty = (value: string | null | undefined): string =>
  value ?? '';

// ============ Date Conversion ============

/**
 * Convert ISO date string to timestamp (milliseconds).
 */
export const isoToTimestamp = (isoDate: string | null | undefined): number =>
  isoDate ? new Date(isoDate).getTime() : Date.now();

/**
 * Convert timestamp to ISO date string.
 */
export const timestampToIso = (timestamp: number): string =>
  new Date(timestamp).toISOString();

// ============ Partial Update Helpers ============

/**
 * Create a backend update object from frontend partial updates.
 * Only includes fields that are present in the updates object.
 *
 * @example
 * const backendUpdates = createPartialUpdate(
 *   { title: 'New Title', speakerNotes: 'Notes' },
 *   {
 *     title: 'title',
 *     speakerNotes: 'speaker_notes',
 *     imagePrompt: 'image_prompt',
 *   }
 * );
 * // Result: { title: 'New Title', speaker_notes: 'Notes' }
 */
export const createPartialUpdate = <
  TFrontend extends AnyObject,
  TBackend extends AnyObject
>(
  updates: Partial<TFrontend>,
  fieldMap: Record<keyof TFrontend, keyof TBackend>
): Partial<TBackend> => {
  const result: Partial<TBackend> = {};

  for (const [frontendKey, value] of Object.entries(updates)) {
    const backendKey = fieldMap[frontendKey as keyof TFrontend];
    if (backendKey !== undefined) {
      (result as AnyObject)[backendKey as string] = value;
    }
  }

  return result;
};

// ============ Exports ============

export default {
  snakeToCamel,
  camelToSnake,
  snakeToCamelObject,
  camelToSnakeObject,
  mapFields,
  undefinedToNull,
  nullToUndefined,
  emptyToNull,
  nullToEmpty,
  isoToTimestamp,
  timestampToIso,
  createPartialUpdate,
};
