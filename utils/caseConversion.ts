/**
 * Case Conversion Utilities
 *
 * Generic utilities for converting between snake_case (backend) and camelCase (frontend).
 * Centralizes conversion logic that was previously duplicated across API services.
 *
 * DRY Principle: Single source of truth for case conversion logic.
 */

// ============ Type Definitions ============

/**
 * Converts snake_case string literal type to camelCase.
 * Example: "user_name" → "userName"
 */
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

/**
 * Converts camelCase string literal type to snake_case.
 * Example: "userName" → "user_name"
 */
type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
  : S;

/**
 * Recursively converts object keys from snake_case to camelCase.
 */
export type SnakeToCamel<T> = T extends Array<infer U>
  ? Array<SnakeToCamel<U>>
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: SnakeToCamel<T[K]>;
      }
    : T;

/**
 * Recursively converts object keys from camelCase to snake_case.
 */
export type CamelToSnake<T> = T extends Array<infer U>
  ? Array<CamelToSnake<U>>
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelToSnakeCase<K> : K]: CamelToSnake<T[K]>;
      }
    : T;

// ============ String Conversion Functions ============

/**
 * Converts a snake_case string to camelCase.
 *
 * @example
 * snakeToCamelString("user_name") // "userName"
 * snakeToCamelString("created_at") // "createdAt"
 */
export function snakeToCamelString(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts a camelCase string to snake_case.
 *
 * @example
 * camelToSnakeString("userName") // "user_name"
 * camelToSnakeString("createdAt") // "created_at"
 */
export function camelToSnakeString(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// ============ Object Conversion Functions ============

/**
 * Type guard to check if a value is a plain object (not array, null, Date, etc.)
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

/**
 * Recursively converts all keys in an object from snake_case to camelCase.
 * Handles nested objects and arrays.
 *
 * @example
 * snakeToCamel({ user_name: "John", created_at: "2024-01-01" })
 * // { userName: "John", createdAt: "2024-01-01" }
 *
 * snakeToCamel({ user_data: { first_name: "John" } })
 * // { userData: { firstName: "John" } }
 */
export function snakeToCamel<T>(obj: T): SnakeToCamel<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item)) as SnakeToCamel<T>;
  }

  if (!isPlainObject(obj)) {
    return obj as SnakeToCamel<T>;
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const camelKey = snakeToCamelString(key);
    const value = obj[key];
    result[camelKey] = snakeToCamel(value);
  }

  return result as SnakeToCamel<T>;
}

/**
 * Recursively converts all keys in an object from camelCase to snake_case.
 * Handles nested objects and arrays.
 *
 * @example
 * camelToSnake({ userName: "John", createdAt: "2024-01-01" })
 * // { user_name: "John", created_at: "2024-01-01" }
 *
 * camelToSnake({ userData: { firstName: "John" } })
 * // { user_data: { first_name: "John" } }
 */
export function camelToSnake<T>(obj: T): CamelToSnake<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item)) as CamelToSnake<T>;
  }

  if (!isPlainObject(obj)) {
    return obj as CamelToSnake<T>;
  }

  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const snakeKey = camelToSnakeString(key);
    const value = obj[key];
    result[snakeKey] = camelToSnake(value);
  }

  return result as CamelToSnake<T>;
}

// ============ Selective Conversion Functions ============

/**
 * Converts specific keys from snake_case to camelCase.
 * Useful when you need partial conversion with custom handling.
 *
 * @example
 * convertKeys({ user_name: "John", raw_data: {...} }, ["user_name"])
 * // { userName: "John", raw_data: {...} }
 */
export function convertKeysSnakeToCamel<T extends Record<string, unknown>>(
  obj: T,
  keysToConvert: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const shouldConvert = keysToConvert.includes(key);
    const newKey = shouldConvert ? snakeToCamelString(key) : key;
    result[newKey] = obj[key];
  }

  return result;
}

/**
 * Converts specific keys from camelCase to snake_case.
 * Useful when you need partial conversion with custom handling.
 *
 * @example
 * convertKeysCamelToSnake({ userName: "John", rawData: {...} }, ["userName"])
 * // { user_name: "John", rawData: {...} }
 */
export function convertKeysCamelToSnake<T extends Record<string, unknown>>(
  obj: T,
  keysToConvert: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const shouldConvert = keysToConvert.includes(key);
    const newKey = shouldConvert ? camelToSnakeString(key) : key;
    result[newKey] = obj[key];
  }

  return result;
}

// ============ API Response Helpers ============

/**
 * Wrapper for API responses that converts backend snake_case to frontend camelCase.
 * Use this when the entire response needs conversion.
 *
 * @example
 * const response = await fetch('/api/user');
 * const user = fromBackend<User>(await response.json());
 */
export function fromBackend<T>(data: unknown): T {
  return snakeToCamel(data) as T;
}

/**
 * Wrapper for API requests that converts frontend camelCase to backend snake_case.
 * Use this when sending data to the backend.
 *
 * @example
 * await fetch('/api/user', {
 *   body: JSON.stringify(toBackend(userData))
 * });
 */
export function toBackend<T>(data: T): CamelToSnake<T> {
  return camelToSnake(data);
}
