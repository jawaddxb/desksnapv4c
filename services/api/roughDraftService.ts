/**
 * Rough Draft Service
 *
 * API calls for rough draft CRUD operations.
 * Handles conversion between frontend (camelCase) and backend (snake_case) formats.
 */

import { api } from './apiClient';
import { LayoutType, Alignment, Presentation } from '../../types';
import {
  RoughDraft,
  RoughDraftSlide,
  BackendRoughDraft,
  BackendRoughDraftSlide,
  PaginatedRoughDraftResponse,
  CreateRoughDraftRequest,
  UpdateRoughDraftRequest,
  CreateRoughDraftSlideRequest,
  UpdateRoughDraftSlideRequest,
  ApproveRoughDraftRequest,
  RoughDraftStatus,
  ApprovalState,
} from '../../types/roughDraft';

// ============ Conversion Helpers ============

const backendSlideToFrontend = (slide: BackendRoughDraftSlide): RoughDraftSlide => ({
  id: slide.id,
  roughDraftId: slide.rough_draft_id,
  position: slide.position,
  title: slide.title,
  content: slide.content,
  speakerNotes: slide.speaker_notes,
  imagePrompt: slide.image_prompt,
  imageUrl: slide.image_url,
  layoutType: slide.layout_type as LayoutType | null,
  alignment: slide.alignment as Alignment | null,
  approvalState: slide.approval_state as ApprovalState,
  createdAt: new Date(slide.created_at).getTime(),
  updatedAt: new Date(slide.updated_at).getTime(),
});

const backendToFrontend = (backend: BackendRoughDraft): RoughDraft => ({
  id: backend.id,
  ownerId: backend.owner_id,
  ideationSessionId: backend.ideation_session_id,
  presentationId: backend.presentation_id,
  topic: backend.topic,
  themeId: backend.theme_id,
  visualStyle: backend.visual_style,
  status: backend.status as RoughDraftStatus,
  slides: (backend.slides || []).map(backendSlideToFrontend),
  createdAt: new Date(backend.created_at).getTime(),
  updatedAt: new Date(backend.updated_at).getTime(),
});

// Frontend to backend conversions

const frontendSlideToBackendCreate = (slide: Partial<RoughDraftSlide>): CreateRoughDraftSlideRequest => ({
  position: slide.position || 0,
  title: slide.title || null,
  content: slide.content || null,
  speaker_notes: slide.speakerNotes || null,
  image_prompt: slide.imagePrompt || null,
  image_url: slide.imageUrl || null,
  layout_type: slide.layoutType || null,
  alignment: slide.alignment || null,
  approval_state: slide.approvalState || 'pending',
});

const frontendToBackendCreate = (draft: Partial<RoughDraft>): CreateRoughDraftRequest => ({
  topic: draft.topic || '',
  theme_id: draft.themeId || '',
  visual_style: draft.visualStyle || null,
  status: draft.status || 'in_progress',
  ideation_session_id: draft.ideationSessionId || null,
  slides: (draft.slides || []).map(frontendSlideToBackendCreate),
});

// ============ API Calls ============

/**
 * List all rough drafts for the current user
 */
export const listRoughDrafts = async (
  page: number = 1,
  pageSize: number = 50,
  statusFilter?: RoughDraftStatus
): Promise<{ drafts: RoughDraft[]; total: number; pages: number }> => {
  let url = `/api/v1/rough-drafts?page=${page}&page_size=${pageSize}`;
  if (statusFilter) {
    url += `&status_filter=${statusFilter}`;
  }

  const response = await api.get<PaginatedRoughDraftResponse>(url);

  return {
    drafts: response.items.map(backendToFrontend),
    total: response.total,
    pages: Math.ceil(response.total / pageSize),
  };
};

/**
 * Get a single rough draft by ID
 */
export const getRoughDraft = async (id: string): Promise<RoughDraft> => {
  const response = await api.get<BackendRoughDraft>(`/api/v1/rough-drafts/${id}`);
  return backendToFrontend(response);
};

/**
 * Create a new rough draft
 */
export const createRoughDraft = async (draft: Partial<RoughDraft>): Promise<RoughDraft> => {
  const payload = frontendToBackendCreate(draft);
  const response = await api.post<BackendRoughDraft>('/api/v1/rough-drafts', payload);
  return backendToFrontend(response);
};

/**
 * Update an existing rough draft
 */
export const updateRoughDraft = async (
  id: string,
  updates: Partial<RoughDraft>
): Promise<RoughDraft> => {
  const payload: UpdateRoughDraftRequest = {};
  if (updates.topic !== undefined) payload.topic = updates.topic;
  if (updates.themeId !== undefined) payload.theme_id = updates.themeId;
  if (updates.visualStyle !== undefined) payload.visual_style = updates.visualStyle;
  if (updates.status !== undefined) payload.status = updates.status;

  const response = await api.put<BackendRoughDraft>(`/api/v1/rough-drafts/${id}`, payload);
  return backendToFrontend(response);
};

/**
 * Delete a rough draft
 */
export const deleteRoughDraft = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/rough-drafts/${id}`);
};

/**
 * Approve a rough draft and convert to presentation
 */
export const approveRoughDraft = async (
  id: string,
  overrides?: { topic?: string; themeId?: string; visualStyle?: string }
): Promise<Presentation> => {
  const payload: ApproveRoughDraftRequest = {};
  if (overrides?.topic) payload.topic = overrides.topic;
  if (overrides?.themeId) payload.theme_id = overrides.themeId;
  if (overrides?.visualStyle) payload.visual_style = overrides.visualStyle;

  const response = await api.post<Presentation>(`/api/v1/rough-drafts/${id}/approve`, payload);
  return response;
};

// ============ Slide Operations ============

/**
 * Add a slide to a rough draft
 */
export const addSlide = async (
  draftId: string,
  slide: Partial<RoughDraftSlide>
): Promise<RoughDraftSlide> => {
  const payload = frontendSlideToBackendCreate(slide);
  const response = await api.post<BackendRoughDraftSlide>(
    `/api/v1/rough-drafts/${draftId}/slides`,
    payload
  );
  return backendSlideToFrontend(response);
};

/**
 * Update a slide in a rough draft
 */
export const updateSlide = async (
  draftId: string,
  slideId: string,
  updates: Partial<RoughDraftSlide>
): Promise<RoughDraftSlide> => {
  const payload: UpdateRoughDraftSlideRequest = {};
  if (updates.position !== undefined) payload.position = updates.position;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.speakerNotes !== undefined) payload.speaker_notes = updates.speakerNotes;
  if (updates.imagePrompt !== undefined) payload.image_prompt = updates.imagePrompt;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.layoutType !== undefined) payload.layout_type = updates.layoutType;
  if (updates.alignment !== undefined) payload.alignment = updates.alignment;
  if (updates.approvalState !== undefined) payload.approval_state = updates.approvalState;

  const response = await api.put<BackendRoughDraftSlide>(
    `/api/v1/rough-drafts/${draftId}/slides/${slideId}`,
    payload
  );
  return backendSlideToFrontend(response);
};

/**
 * Delete a slide from a rough draft
 */
export const deleteSlide = async (draftId: string, slideId: string): Promise<void> => {
  await api.delete(`/api/v1/rough-drafts/${draftId}/slides/${slideId}`);
};

// Export all functions as default object for convenience
export default {
  listRoughDrafts,
  getRoughDraft,
  createRoughDraft,
  updateRoughDraft,
  deleteRoughDraft,
  approveRoughDraft,
  addSlide,
  updateSlide,
  deleteSlide,
};
