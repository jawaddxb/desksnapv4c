/**
 * API Configuration
 *
 * Centralized configuration for API endpoints and URLs.
 * Single source of truth for all API-related constants.
 *
 * DRY Principle: Prevents duplicated URL definitions across services.
 */

// ============ Base URLs ============

/**
 * Base URL for REST API calls.
 * Falls back to localhost for development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Base URL for WebSocket connections.
 * Derived from API_BASE_URL by replacing http with ws.
 */
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

// ============ API Version ============

/**
 * Current API version prefix.
 */
export const API_VERSION = 'v1';

/**
 * Full API path prefix.
 */
export const API_PREFIX = `/api/${API_VERSION}`;

// ============ Endpoint Helpers ============

/**
 * Build a full API URL from a path.
 *
 * @param path - The API path (e.g., "/presentations" or "presentations")
 * @returns Full URL (e.g., "http://localhost:8000/api/v1/presentations")
 *
 * @example
 * buildApiUrl('/presentations') // "http://localhost:8000/api/v1/presentations"
 * buildApiUrl('presentations')  // "http://localhost:8000/api/v1/presentations"
 */
export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${API_PREFIX}${normalizedPath}`;
}

/**
 * Build a full WebSocket URL from a path.
 *
 * @param path - The WebSocket path (e.g., "/ws/presentations/123")
 * @returns Full WebSocket URL
 *
 * @example
 * buildWsUrl('/ws/presentations/123') // "ws://localhost:8000/api/v1/ws/presentations/123"
 */
export function buildWsUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${WS_BASE_URL}${API_PREFIX}${normalizedPath}`;
}

// ============ Common Endpoints ============

/**
 * Common API endpoint paths (without base URL or version prefix).
 * Use these with the api client which handles the base URL.
 */
export const ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Presentations
  presentations: {
    list: '/presentations',
    create: '/presentations',
    get: (id: string) => `/presentations/${id}`,
    update: (id: string) => `/presentations/${id}`,
    delete: (id: string) => `/presentations/${id}`,
    duplicate: (id: string) => `/presentations/${id}/duplicate`,
    export: (id: string) => `/presentations/${id}/export`,
    import: '/presentations/import',
  },

  // Slides
  slides: {
    create: (presentationId: string) => `/presentations/${presentationId}/slides`,
    update: (presentationId: string, slideId: string) =>
      `/presentations/${presentationId}/slides/${slideId}`,
    delete: (presentationId: string, slideId: string) =>
      `/presentations/${presentationId}/slides/${slideId}`,
  },

  // Ideation
  ideations: {
    list: '/ideations',
    create: '/ideations',
    get: (id: string) => `/ideations/${id}`,
    update: (id: string) => `/ideations/${id}`,
    delete: (id: string) => `/ideations/${id}`,
  },

  // Rough Drafts
  roughDrafts: {
    list: '/rough-drafts',
    create: '/rough-drafts',
    get: (id: string) => `/rough-drafts/${id}`,
    update: (id: string) => `/rough-drafts/${id}`,
    delete: (id: string) => `/rough-drafts/${id}`,
    approve: (id: string) => `/rough-drafts/${id}/approve`,
  },

  // Beautify
  beautify: {
    upload: '/beautify/upload',
    session: (id: string) => `/beautify/${id}`,
    transform: (id: string) => `/beautify/${id}/transform`,
    share: (id: string) => `/beautify/${id}/share`,
  },

  // Share
  share: {
    beautify: (shareId: string) => `/share/beautify/${shareId}`,
  },

  // Images
  images: {
    upload: '/images/upload',
    uploadSlide: (presentationId: string, slideId: string) =>
      `/presentations/${presentationId}/slides/${slideId}/image`,
  },

  // Health
  health: '/health',

  // WebSocket
  ws: {
    presentations: (id: string) => `/ws/presentations/${id}`,
  },
} as const;

// ============ Default Headers ============

/**
 * Default headers for JSON API requests.
 */
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// ============ Timeout Configuration ============

/**
 * Request timeout configuration (in milliseconds).
 */
export const TIMEOUTS = {
  /** Default request timeout */
  default: 30000,
  /** Upload timeout (larger files) */
  upload: 120000,
  /** Long-running operations */
  longRunning: 300000,
} as const;
