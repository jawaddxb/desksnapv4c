/**
 * Presentation Service
 *
 * API calls for presentation CRUD operations.
 * Handles conversion between frontend (camelCase) and backend (snake_case) formats.
 */

import { api } from './apiClient';
import { Presentation, Slide } from '@/types';

// ============ Backend Types (snake_case) ============

interface BackendSlide {
  id: string;
  presentation_id: string;
  position: number;
  title: string | null;
  content: string[] | null;
  speaker_notes: string | null;
  image_prompt: string | null;
  image_url: string | null;
  layout_type: string | null;
  alignment: string | null;
  font_scale: string | null;
  layout_variant: string | null;
  style_overrides: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface BackendPresentation {
  id: string;
  owner_id: string;
  topic: string;
  theme_id: string | null;
  visual_style: string | null;
  wabi_sabi_layout: string | null;
  view_mode: string | null;
  thumbnail_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  slides?: BackendSlide[];
}

interface PresentationListResponse {
  items: BackendPresentation[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// Export format (camelCase) from backend
interface ExportedPresentation {
  id: string;
  topic: string;
  themeId: string | null;
  visualStyle: string | null;
  wabiSabiLayout: string | null;
  viewMode: string | null;
  slides: Array<{
    id: string;
    title: string | null;
    content: string[];
    speakerNotes: string | null;
    imagePrompt: string | null;
    imageUrl: string | null;
    layoutType: string | null;
    alignment: string | null;
    fontScale: string | null;
    layoutVariant: string | null;
    styleOverrides: Record<string, unknown> | null;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ============ Conversion Helpers ============

const backendSlideToFrontend = (slide: BackendSlide): Slide => ({
  id: slide.id,
  title: slide.title || '',
  content: slide.content || [],
  speakerNotes: slide.speaker_notes || '',
  imagePrompt: slide.image_prompt || '',
  imageUrl: slide.image_url || undefined,
  isImageLoading: false,
  layoutType: (slide.layout_type as Slide['layoutType']) || 'split',
  alignment: (slide.alignment as Slide['alignment']) || 'left',
  fontScale: (slide.font_scale as Slide['fontScale']) || undefined,
  layoutVariant: (slide.layout_variant as Slide['layoutVariant']) || undefined,
  textStyles: slide.style_overrides?.textStyles as Slide['textStyles'],
  imageStyles: slide.style_overrides?.imageStyles as Slide['imageStyles'],
  contentItemStyles: slide.style_overrides?.contentItemStyles as Slide['contentItemStyles'],
});

const backendToFrontend = (backend: BackendPresentation): Presentation => ({
  id: backend.id,
  topic: backend.topic,
  themeId: backend.theme_id || 'neoBrutalist',
  visualStyle: backend.visual_style || '',
  wabiSabiLayout: backend.wabi_sabi_layout || undefined,
  viewMode: (backend.view_mode as Presentation['viewMode']) || 'standard',
  lastModified: new Date(backend.updated_at).getTime(),
  slides: (backend.slides || []).map(backendSlideToFrontend),
  analytics: [],
});

const frontendSlideToBackend = (slide: Slide, position: number) => ({
  position,
  title: slide.title || null,
  content: slide.content || [],
  speaker_notes: slide.speakerNotes || null,
  image_prompt: slide.imagePrompt || null,
  image_url: slide.imageUrl || null,
  layout_type: slide.layoutType || null,
  alignment: slide.alignment || null,
  font_scale: slide.fontScale || null,
  layout_variant: typeof slide.layoutVariant === 'number'
    ? String(slide.layoutVariant)
    : slide.layoutVariant || null,
  style_overrides: {
    textStyles: slide.textStyles,
    imageStyles: slide.imageStyles,
    contentItemStyles: slide.contentItemStyles,
  },
});

const frontendToBackendCreate = (presentation: Presentation) => ({
  topic: presentation.topic,
  theme_id: presentation.themeId || null,
  visual_style: presentation.visualStyle || null,
  wabi_sabi_layout: presentation.wabiSabiLayout || null,
  view_mode: presentation.viewMode || 'standard',
  is_public: false,
  slides: presentation.slides.map((slide, i) => frontendSlideToBackend(slide, i)),
});

const exportedToFrontend = (exported: ExportedPresentation): Presentation => ({
  id: exported.id,
  topic: exported.topic,
  themeId: exported.themeId || 'neoBrutalist',
  visualStyle: exported.visualStyle || '',
  wabiSabiLayout: exported.wabiSabiLayout || undefined,
  viewMode: (exported.viewMode as Presentation['viewMode']) || 'standard',
  lastModified: new Date(exported.updatedAt).getTime(),
  slides: exported.slides.map((slide, index) => ({
    id: slide.id,
    title: slide.title || '',
    content: slide.content || [],
    speakerNotes: slide.speakerNotes || '',
    imagePrompt: slide.imagePrompt || '',
    imageUrl: slide.imageUrl || undefined,
    isImageLoading: false,
    layoutType: (slide.layoutType as Slide['layoutType']) || 'split',
    alignment: (slide.alignment as Slide['alignment']) || 'left',
    fontScale: (slide.fontScale as Slide['fontScale']) || undefined,
    layoutVariant: (slide.layoutVariant as Slide['layoutVariant']) || undefined,
  })),
  analytics: [],
});

// ============ API Calls ============

/**
 * List all presentations for the current user
 */
export const listPresentations = async (
  page: number = 1,
  pageSize: number = 50
): Promise<{ presentations: Presentation[]; total: number; pages: number }> => {
  const response = await api.get<PresentationListResponse>(
    `/api/v1/presentations?page=${page}&page_size=${pageSize}`
  );
  return {
    presentations: response.items.map(backendToFrontend),
    total: response.total,
    pages: response.pages,
  };
};

/**
 * Get a single presentation with slides
 */
export const getPresentation = async (id: string): Promise<Presentation> => {
  const response = await api.get<BackendPresentation>(`/api/v1/presentations/${id}`);
  return backendToFrontend(response);
};

/**
 * Create a new presentation
 */
export const createPresentation = async (presentation: Presentation): Promise<Presentation> => {
  const backendData = frontendToBackendCreate(presentation);
  const response = await api.post<BackendPresentation>('/api/v1/presentations', backendData);
  return backendToFrontend(response);
};

/**
 * Update a presentation
 */
export const updatePresentation = async (
  id: string,
  updates: Partial<Presentation>
): Promise<Presentation> => {
  const backendUpdates: Record<string, unknown> = {};

  if (updates.topic !== undefined) backendUpdates.topic = updates.topic;
  if (updates.themeId !== undefined) backendUpdates.theme_id = updates.themeId;
  if (updates.visualStyle !== undefined) backendUpdates.visual_style = updates.visualStyle;
  if (updates.wabiSabiLayout !== undefined) backendUpdates.wabi_sabi_layout = updates.wabiSabiLayout;
  if (updates.viewMode !== undefined) backendUpdates.view_mode = updates.viewMode;

  const response = await api.put<BackendPresentation>(`/api/v1/presentations/${id}`, backendUpdates);
  return backendToFrontend(response);
};

/**
 * Delete a presentation
 */
export const deletePresentation = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/presentations/${id}`);
};

/**
 * Duplicate a presentation
 */
export const duplicatePresentation = async (id: string): Promise<Presentation> => {
  const response = await api.post<BackendPresentation>(`/api/v1/presentations/${id}/duplicate`);
  return backendToFrontend(response);
};

/**
 * Export a presentation (returns camelCase format)
 */
export const exportPresentation = async (id: string): Promise<Presentation> => {
  const response = await api.get<ExportedPresentation>(`/api/v1/presentations/${id}/export`);
  return exportedToFrontend(response);
};

/**
 * Import a presentation from JSON
 */
export const importPresentation = async (data: {
  topic: string;
  themeId?: string;
  visualStyle?: string;
  wabiSabiLayout?: string;
  slides: Array<{
    title?: string;
    content?: string[];
    speakerNotes?: string;
    imagePrompt?: string;
    imageUrl?: string;
    layoutType?: string;
    alignment?: string;
    fontScale?: string;
    layoutVariant?: string;
  }>;
}): Promise<Presentation> => {
  const response = await api.post<BackendPresentation>('/api/v1/presentations/import', data);
  return backendToFrontend(response);
};

/**
 * Sync a full presentation (create or update based on existence)
 */
export const syncPresentation = async (presentation: Presentation): Promise<Presentation> => {
  try {
    // Try to get existing presentation
    await api.get<BackendPresentation>(`/api/v1/presentations/${presentation.id}`);
    // If exists, update it
    return await updatePresentation(presentation.id, presentation);
  } catch {
    // If not found, create new
    return await createPresentation(presentation);
  }
};

// ============ Slide Operations ============

/**
 * Add a slide to a presentation
 */
export const addSlide = async (
  presentationId: string,
  slide: Partial<Slide>,
  position: number
): Promise<Slide> => {
  const backendSlide = {
    position,
    title: slide.title || null,
    content: slide.content || [],
    speaker_notes: slide.speakerNotes || null,
    image_prompt: slide.imagePrompt || null,
    image_url: slide.imageUrl || null,
    layout_type: slide.layoutType || null,
    alignment: slide.alignment || null,
    font_scale: slide.fontScale || null,
    layout_variant: slide.layoutVariant || null,
  };

  const response = await api.post<BackendSlide>(
    `/api/v1/presentations/${presentationId}/slides`,
    backendSlide
  );
  return backendSlideToFrontend(response);
};

/**
 * Update a slide
 */
export const updateSlide = async (
  presentationId: string,
  slideId: string,
  updates: Partial<Slide>
): Promise<Slide> => {
  const backendUpdates: Record<string, unknown> = {};

  if (updates.title !== undefined) backendUpdates.title = updates.title;
  if (updates.content !== undefined) backendUpdates.content = updates.content;
  if (updates.speakerNotes !== undefined) backendUpdates.speaker_notes = updates.speakerNotes;
  if (updates.imagePrompt !== undefined) backendUpdates.image_prompt = updates.imagePrompt;
  if (updates.imageUrl !== undefined) backendUpdates.image_url = updates.imageUrl;
  if (updates.layoutType !== undefined) backendUpdates.layout_type = updates.layoutType;
  if (updates.alignment !== undefined) backendUpdates.alignment = updates.alignment;
  if (updates.fontScale !== undefined) backendUpdates.font_scale = updates.fontScale;
  if (updates.layoutVariant !== undefined) backendUpdates.layout_variant = updates.layoutVariant;

  const response = await api.put<BackendSlide>(
    `/api/v1/presentations/${presentationId}/slides/${slideId}`,
    backendUpdates
  );
  return backendSlideToFrontend(response);
};

/**
 * Delete a slide
 */
export const deleteSlide = async (presentationId: string, slideId: string): Promise<void> => {
  await api.delete(`/api/v1/presentations/${presentationId}/slides/${slideId}`);
};

export default {
  listPresentations,
  getPresentation,
  createPresentation,
  updatePresentation,
  deletePresentation,
  duplicatePresentation,
  exportPresentation,
  importPresentation,
  syncPresentation,
  addSlide,
  updateSlide,
  deleteSlide,
};
