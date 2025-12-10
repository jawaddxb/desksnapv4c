/**
 * Token Refresh
 *
 * Handles access token refresh with deduplication.
 * Single responsibility: refresh tokens when they expire.
 */

import { getRefreshToken, setTokens, clearTokens } from './tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Track if a refresh is currently in progress
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

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
      clearTokens();
      notifySubscribers(null);
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.tokens.access_token;
    const newRefreshToken = data.tokens.refresh_token;

    setTokens(newAccessToken, newRefreshToken);
    notifySubscribers(newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
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
