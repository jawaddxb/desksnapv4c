/**
 * Debug Service
 *
 * API calls for debug endpoints to diagnose data issues.
 * Only works when the backend is in debug mode.
 */

import { api } from './apiClient';

// ============ Types ============

export interface DebugUser {
  id: string;
  email: string;
  name: string | null;
  auth_provider: string;
  is_active: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
  presentation_count?: number;
  is_current_user?: boolean;
}

export interface DebugPresentation {
  id: string;
  topic: string;
  theme_id: string | null;
  slide_count: number;
  is_public?: boolean;
  created_at: string;
  updated_at?: string;
  owner?: {
    id: string | null;
    email: string;
    is_current_user: boolean;
  };
}

export interface DebugMeResponse {
  user: DebugUser;
  presentations: {
    count: number;
    items: DebugPresentation[];
  };
}

export interface DebugUsersResponse {
  total: number;
  page: number;
  page_size: number;
  current_user_id: string;
  users: DebugUser[];
}

export interface DebugPresentationsResponse {
  total: number;
  page: number;
  page_size: number;
  current_user_id: string;
  presentations: DebugPresentation[];
}

export interface DebugLookupResponse {
  found: boolean;
  email: string;
  message?: string;
  user?: DebugUser;
  is_current_user?: boolean;
  presentations?: DebugPresentation[];
}

export interface DebugStatsResponse {
  totals: {
    users: number;
    presentations: number;
  };
  top_users_by_presentations: Array<{
    email: string;
    id: string;
    presentation_count: number;
    is_current_user: boolean;
  }>;
  current_user: {
    id: string;
    email: string;
  };
}

// ============ API Calls ============

/**
 * Get current user's debug info with their presentations
 */
export const getDebugMe = async (): Promise<DebugMeResponse> => {
  return api.get<DebugMeResponse>('/api/v1/debug/me');
};

/**
 * List all users in the system (debug only)
 */
export const getDebugUsers = async (
  page: number = 1,
  pageSize: number = 20
): Promise<DebugUsersResponse> => {
  return api.get<DebugUsersResponse>(
    `/api/v1/debug/users?page=${page}&page_size=${pageSize}`
  );
};

/**
 * List all presentations in the system (debug only)
 */
export const getDebugPresentations = async (
  page: number = 1,
  pageSize: number = 20
): Promise<DebugPresentationsResponse> => {
  return api.get<DebugPresentationsResponse>(
    `/api/v1/debug/presentations?page=${page}&page_size=${pageSize}`
  );
};

/**
 * Lookup a user by email
 */
export const lookupUserByEmail = async (email: string): Promise<DebugLookupResponse> => {
  return api.get<DebugLookupResponse>(`/api/v1/debug/lookup/email/${encodeURIComponent(email)}`);
};

/**
 * Get database statistics
 */
export const getDebugStats = async (): Promise<DebugStatsResponse> => {
  return api.get<DebugStatsResponse>('/api/v1/debug/stats');
};

export default {
  getDebugMe,
  getDebugUsers,
  getDebugPresentations,
  lookupUserByEmail,
  getDebugStats,
};
