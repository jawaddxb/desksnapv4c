/**
 * Token Refresh
 *
 * Handles access token refresh with deduplication.
 * Single responsibility: refresh tokens when they expire.
 */

import { getRefreshToken, setTokens, clearTokens } from './tokenManager';
import { API_BASE_URL } from '@/config';

// ============ Error Types ============

export type TokenRefreshErrorCode =
  | 'NO_REFRESH_TOKEN'
  | 'REFRESH_FAILED'
  | 'NETWORK_ERROR'
  | 'INVALID_RESPONSE';

/**
 * Structured error for token refresh failures.
 * Provides typed error codes for programmatic handling.
 */
export class TokenRefreshError extends Error {
  code: TokenRefreshErrorCode;
  cause?: unknown;

  constructor(code: TokenRefreshErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'TokenRefreshError';
    this.code = code;
    this.cause = cause;
  }
}

// ============ State ============

// Track if a refresh is currently in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];
/** Last error encountered during refresh (for debugging/inspection) */
let lastRefreshError: TokenRefreshError | null = null;

/**
 * Subscribe to the current refresh attempt.
 * Returns a promise that resolves with the new token or null if refresh fails.
 */
const subscribeToRefresh = (): Promise<string | null> => {
  return new Promise((resolve) => {
    refreshSubscribers.push(resolve);
  });
};

/**
 * Notify all subscribers of the refresh result.
 */
const notifySubscribers = (token: string | null): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Attempt to refresh the access token.
 *
 * If a refresh is already in progress, returns a promise that resolves
 * when the current refresh completes.
 *
 * @returns The new access token, or null if refresh fails
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  // If already refreshing, wait for that to complete
  if (isRefreshing) {
    return subscribeToRefresh();
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    lastRefreshError = new TokenRefreshError(
      'NO_REFRESH_TOKEN',
      'No refresh token available'
    );
    clearTokens();
    return null;
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      lastRefreshError = new TokenRefreshError(
        'REFRESH_FAILED',
        `Token refresh failed with status ${response.status}`
      );
      clearTokens();
      notifySubscribers(null);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.tokens.access_token;
    const newRefreshToken = data.tokens.refresh_token;

    setTokens(newAccessToken, newRefreshToken);
    notifySubscribers(newAccessToken);
    lastRefreshError = null; // Clear error on success

    return newAccessToken;
  } catch (error) {
    lastRefreshError = new TokenRefreshError(
      'NETWORK_ERROR',
      'Network error during token refresh',
      error
    );
    clearTokens();
    notifySubscribers(null);
    return null;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Check if a refresh is currently in progress.
 */
export const isRefreshInProgress = (): boolean => {
  return isRefreshing;
};

/**
 * Get the last token refresh error.
 * Returns null if no error occurred or if the last refresh was successful.
 *
 * @example
 * const token = await refreshAccessToken();
 * if (!token) {
 *   const error = getLastRefreshError();
 *   if (error?.code === 'NO_REFRESH_TOKEN') {
 *     // User needs to log in again
 *   }
 * }
 */
export const getLastRefreshError = (): TokenRefreshError | null => {
  return lastRefreshError;
};

/**
 * Clear the last refresh error.
 * Useful for resetting state after handling an error.
 */
export const clearLastRefreshError = (): void => {
  lastRefreshError = null;
};
