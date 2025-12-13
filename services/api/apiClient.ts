/**
 * API Client
 *
 * Centralized API client for backend communication.
 * Refactored: Token management and refresh logic moved to separate modules.
 */

import { getAccessToken, clearTokens, hasTokens } from './tokenManager';
import { refreshAccessToken } from './tokenRefresh';
import { API_BASE_URL } from '@/config';

// Re-export token management for backward compatibility
export { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenManager';

// ============ API Error Handling ============

export class ApiError extends Error {
  status: number;
  detail: string;
  errorCode?: string;
  errorId?: string;

  constructor(status: number, detail: string, errorCode?: string, errorId?: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.errorCode = errorCode;
    this.errorId = errorId;
  }
}

/**
 * Check if the user has valid tokens (may be expired).
 */
export const isAuthenticated = (): boolean => {
  return hasTokens();
};

// ============ Core Request Function ============

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Make an API request with automatic token handling.
 *
 * @param endpoint - API endpoint (e.g., '/api/v1/presentations')
 * @param options - Fetch options plus skipAuth flag
 * @returns Parsed JSON response
 * @throws ApiError on non-2xx responses
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { skipAuth = false, ...fetchOptions } = options;

  // Build headers, safely handling existing headers
  const existingHeaders = fetchOptions.headers || {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(typeof existingHeaders === 'object' && !Array.isArray(existingHeaders)
      ? (existingHeaders as Record<string, string>)
      : {}),
  };

  // Add auth header if authenticated and not skipping auth
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 - try to refresh token once
  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry with new token
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
    } else {
      // Refresh failed, clear tokens
      clearTokens();
    }
  }

  // Handle error responses
  if (!response.ok) {
    let detail = 'An error occurred';
    let errorCode: string | undefined;
    let errorId: string | undefined;

    try {
      const errorData = await response.json();
      // Handle validation errors with detailed field messages
      if (errorData.error_code === 'VALIDATION_ERROR' && errorData.details?.errors) {
        const fieldErrors = errorData.details.errors
          .map((e: { field: string; message: string }) => e.message)
          .join('. ');
        detail = fieldErrors || errorData.message || detail;
      } else {
        detail = errorData.detail || errorData.message || detail;
      }
      errorCode = errorData.error_code;
      errorId = errorData.error_id;
    } catch {
      // Response wasn't JSON
    }

    throw new ApiError(response.status, detail, errorCode, errorId);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  return response.json();
};

// ============ Convenience Methods ============

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
