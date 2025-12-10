/**
 * Token Manager
 *
 * Centralized token storage and retrieval.
 * Single responsibility: manage access/refresh tokens in localStorage.
 */

// Storage keys
const ACCESS_TOKEN_KEY = 'decksnap_access_token';
const REFRESH_TOKEN_KEY = 'decksnap_refresh_token';

/**
 * Get the current access token.
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the current refresh token.
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store both access and refresh tokens.
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Clear all tokens (logout).
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user has tokens stored (may be expired).
 */
export const hasTokens = (): boolean => {
  return getAccessToken() !== null;
};
