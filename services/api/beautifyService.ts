/**
 * Beautify Service
 *
 * API client for the "Make My Ugly Deck Beautiful" feature.
 * SRP: Single service for all beautify-related API calls.
 */

import { api } from './apiClient';
import { API_BASE_URL } from '@/config';
import type { Slide } from '@/types';
import type {
  BeautifySession,
  SlideIR,
  TransformIntensity,
  UploadResponse,
  TransformResponse,
  ShareResponse,
  ShareViewData,
} from '@/types/beautify';

// =============================================================================
// BACKEND TYPES (snake_case)
// =============================================================================

interface BackendSlideIR {
  id: string;
  position: number;
  type: string;
  type_confidence: number;
  title: string;
  content: string[];
  notes: string;
  image_url?: string;
  mess_score: number;
  mess_issues: string[];
  suggested_layout: string;
  suggested_alignment: string;
  original: {
    texts: Array<{
      value: string;
      font_size?: number;
      font_family?: string;
      is_bold?: boolean;
      is_title?: boolean;
    }>;
    images: Array<{
      url: string;
      width?: number;
      height?: number;
    }>;
    notes?: string;
    background_color?: string;
  };
}

interface BackendSession {
  id: string;
  file_name: string;
  file_size: number;
  created_at: number;
  slides: BackendSlideIR[];
  intensity: string;
  theme_id: string;
  overall_mess_score: number;
  status: string;
  progress: number;
  error_message?: string;
  share_id?: string;
}

// =============================================================================
// CONVERSION HELPERS
// =============================================================================

function toSlideIR(backend: BackendSlideIR): SlideIR {
  return {
    id: backend.id,
    position: backend.position,
    type: backend.type as SlideIR['type'],
    typeConfidence: backend.type_confidence,
    title: backend.title,
    content: backend.content,
    notes: backend.notes,
    imageUrl: backend.image_url,
    messScore: backend.mess_score,
    messIssues: backend.mess_issues,
    suggestedLayout: backend.suggested_layout as SlideIR['suggestedLayout'],
    suggestedAlignment: backend.suggested_alignment as SlideIR['suggestedAlignment'],
    original: {
      texts: backend.original.texts.map((t) => ({
        value: t.value,
        fontSize: t.font_size,
        fontFamily: t.font_family,
        isBold: t.is_bold,
        isTitle: t.is_title,
      })),
      images: backend.original.images,
      notes: backend.original.notes,
      backgroundColor: backend.original.background_color,
    },
  };
}

function toBeautifySession(backend: BackendSession): BeautifySession {
  return {
    id: backend.id,
    fileName: backend.file_name,
    fileSize: backend.file_size,
    createdAt: backend.created_at,
    slides: backend.slides.map(toSlideIR),
    intensity: backend.intensity as TransformIntensity,
    themeId: backend.theme_id,
    overallMessScore: backend.overall_mess_score,
    status: backend.status as BeautifySession['status'],
    progress: backend.progress,
    errorMessage: backend.error_message,
    shareId: backend.share_id,
  };
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Upload a PPTX file for beautification.
 * Returns a session ID for tracking progress.
 */
export async function uploadPptx(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Use fetch directly for FormData (api client JSON-ifies body)
  const response = await fetch(
    `${API_BASE_URL}/api/v1/beautify/upload`,
    {
      method: 'POST',
      body: formData,
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Upload failed');
  }

  const data = await response.json();
  return { sessionId: data.session_id };
}

/**
 * Get the current state of a beautify session.
 * Poll this while status is 'parsing' or 'analyzing'.
 */
export async function getSession(sessionId: string): Promise<BeautifySession> {
  const backend = await api.get<BackendSession>(`/api/v1/beautify/${sessionId}`);
  return toBeautifySession(backend);
}

/**
 * Transform the uploaded deck with selected style and intensity.
 * Returns transformed slides using the existing Slide type.
 */
export async function transformDeck(
  sessionId: string,
  themeId: string,
  intensity: TransformIntensity
): Promise<TransformResponse> {
  const response = await api.post<{ slides: Slide[] }>(
    `/api/v1/beautify/${sessionId}/transform`,
    { theme_id: themeId, intensity }
  );
  return { slides: response.slides };
}

/**
 * Create a shareable before/after link.
 */
export async function createShareLink(sessionId: string): Promise<ShareResponse> {
  const response = await api.post<{ share_id: string; share_url: string }>(
    `/api/v1/beautify/${sessionId}/share`
  );
  return {
    shareId: response.share_id,
    shareUrl: response.share_url,
  };
}

/**
 * Get public share data for a before/after view.
 * This endpoint doesn't require authentication.
 */
export async function getShareData(shareId: string): Promise<ShareViewData> {
  const response = await api.get<{
    file_name: string;
    before_slides: BackendSlideIR[];
    after_slides: Slide[];
    theme_id: string;
    created_at: number;
  }>(`/api/v1/share/beautify/${shareId}`, { skipAuth: true });

  return {
    fileName: response.file_name,
    beforeSlides: response.before_slides.map(toSlideIR),
    afterSlides: response.after_slides,
    themeId: response.theme_id,
    createdAt: response.created_at,
  };
}

// =============================================================================
// CONVENIENCE EXPORT
// =============================================================================

export const beautifyService = {
  upload: uploadPptx,
  getSession,
  transform: transformDeck,
  share: createShareLink,
  getShareData,
};
