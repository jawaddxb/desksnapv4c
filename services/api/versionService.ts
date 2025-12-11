/**
 * Version History Service
 * API calls for version CRUD operations
 */
import { api } from './apiClient';

// ============ Types ============

export interface Version {
  id: string;
  versionNumber: number;
  label: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface VersionDetail extends Version {
  snapshot: Record<string, unknown>;
}

// Backend types (snake_case)
interface BackendVersion {
  id: string;
  version_number: number;
  label: string | null;
  thumbnail_url: string | null;
  created_at: string;
}

interface BackendVersionDetail extends BackendVersion {
  snapshot: Record<string, unknown>;
}

interface BackendVersionListResponse {
  items: BackendVersion[];
  total: number;
}

// ============ Conversion Helpers ============

const backendToFrontend = (v: BackendVersion): Version => ({
  id: v.id,
  versionNumber: v.version_number,
  label: v.label,
  thumbnailUrl: v.thumbnail_url,
  createdAt: v.created_at,
});

const backendDetailToFrontend = (v: BackendVersionDetail): VersionDetail => ({
  ...backendToFrontend(v),
  snapshot: v.snapshot,
});

// ============ API Calls ============

/**
 * List all versions for a presentation
 */
export const listVersions = async (presentationId: string): Promise<Version[]> => {
  const response = await api.get<BackendVersionListResponse>(
    `/api/v1/presentations/${presentationId}/versions`
  );
  return response.items.map(backendToFrontend);
};

/**
 * Create a new version checkpoint
 */
export const createVersion = async (
  presentationId: string,
  label?: string
): Promise<Version> => {
  const response = await api.post<BackendVersion>(
    `/api/v1/presentations/${presentationId}/versions`,
    { label: label || null }
  );
  return backendToFrontend(response);
};

/**
 * Get version details with snapshot
 */
export const getVersionDetail = async (
  presentationId: string,
  versionId: string
): Promise<VersionDetail> => {
  const response = await api.get<BackendVersionDetail>(
    `/api/v1/presentations/${presentationId}/versions/${versionId}`
  );
  return backendDetailToFrontend(response);
};

/**
 * Restore presentation to a specific version
 */
export const restoreVersion = async (
  presentationId: string,
  versionId: string
): Promise<void> => {
  await api.post(`/api/v1/presentations/${presentationId}/versions/${versionId}/restore`);
};

/**
 * Delete a version checkpoint
 */
export const deleteVersion = async (
  presentationId: string,
  versionId: string
): Promise<void> => {
  await api.delete(`/api/v1/presentations/${presentationId}/versions/${versionId}`);
};

export default {
  listVersions,
  createVersion,
  getVersionDetail,
  restoreVersion,
  deleteVersion,
};
