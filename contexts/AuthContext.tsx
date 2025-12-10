/**
 * AuthContext
 *
 * Centralized authentication state management.
 * Provides user state, login/logout actions, and auth status.
 *
 * Usage:
 * 1. Wrap your app with <AuthProvider>
 * 2. Use useAuth() hook in child components
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import {
  User,
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  checkAuth,
  RegisterData,
  LoginData,
} from '../services/api/authService';
import { isAuthenticated, clearTokens } from '../services/api/apiClient';

// ============ Types ============

export interface AuthState {
  /** Currently authenticated user, or null if not logged in */
  user: User | null;
  /** Whether authentication state is being loaded */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Authentication error message */
  error: string | null;
}

export interface AuthActions {
  /** Register a new user */
  register: (data: RegisterData) => Promise<void>;
  /** Login with email and password */
  login: (data: LoginData) => Promise<void>;
  /** Logout the current user */
  logout: () => Promise<void>;
  /** Clear any auth errors */
  clearError: () => void;
  /** Refresh user data from server */
  refreshUser: () => Promise<void>;
}

export interface AuthContextValue extends AuthState {
  actions: AuthActions;
}

// ============ Context ============

const AuthContext = createContext<AuthContextValue | null>(null);

// ============ Provider ============

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          const currentUser = await checkAuth();
          setUser(currentUser);
        } catch {
          // Token invalid or expired
          clearTokens();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  // Actions
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRegister(data);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLogin(data);
      setUser(response.user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await apiLogout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const currentUser = await checkAuth();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Memoize actions
  const actions = useMemo<AuthActions>(() => ({
    register,
    login,
    logout,
    clearError,
    refreshUser,
  }), [register, login, logout, clearError, refreshUser]);

  // Memoize context value
  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    actions,
  }), [user, isLoading, error, actions]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============ Hooks ============

/**
 * Access auth state and actions.
 * Must be used within an AuthProvider.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Access auth state safely.
 * Returns null if not within an AuthProvider.
 */
export const useAuthSafe = (): AuthContextValue | null => {
  return useContext(AuthContext);
};

/**
 * Access just the user (for components that only need user data).
 */
export const useUser = (): User | null => {
  const context = useContext(AuthContext);
  return context?.user ?? null;
};

/**
 * Check if user is authenticated (for conditional rendering).
 */
export const useIsAuthenticated = (): boolean => {
  const context = useContext(AuthContext);
  return context?.isAuthenticated ?? false;
};

export default AuthContext;
