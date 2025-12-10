/**
 * Auth Service
 *
 * Authentication API calls for register, login, logout, etc.
 */

import { api, setTokens, clearTokens, ApiError } from './apiClient';

// ============ Types ============

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  auth_provider: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

// ============ API Calls ============

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/v1/auth/register', data, {
    skipAuth: true,
  });
  setTokens(response.tokens.access_token, response.tokens.refresh_token);
  return response;
};

/**
 * Login with email and password
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/v1/auth/login', data, {
    skipAuth: true,
  });
  setTokens(response.tokens.access_token, response.tokens.refresh_token);
  return response;
};

/**
 * Logout the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/api/v1/auth/logout');
  } catch {
    // Ignore errors - we're logging out anyway
  }
  clearTokens();
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  return api.get<User>('/api/v1/auth/me');
};

/**
 * Change password
 */
export const changePassword = async (data: PasswordChangeData): Promise<void> => {
  await api.put('/api/v1/auth/password', data);
};

/**
 * Check if user is logged in and fetch their profile
 * Returns null if not authenticated
 */
export const checkAuth = async (): Promise<User | null> => {
  try {
    return await getCurrentUser();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearTokens();
      return null;
    }
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
  checkAuth,
};
