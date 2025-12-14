/**
 * Rough Draft Types
 *
 * Frontend types for rough draft presentations.
 * Matches the backend API schema.
 */

import { LayoutType, Alignment, SlideApprovalState } from '@/types';
import { ContentBlock } from '@/types/contentBlocks';
import { ContentDensity } from '@/lib/contentBlockPrompts';

// ============ Frontend Types ============

export type RoughDraftStatus = 'in_progress' | 'ready' | 'approved' | 'discarded';

// Use the canonical SlideApprovalState from types.ts (DRY compliance)
export type ApprovalState = SlideApprovalState;
export type GenerationPhase = 'initializing' | 'generating-content' | 'refining-prompts' | 'generating-images' | 'complete';

export interface RoughDraftSlide {
  id: string;
  roughDraftId: string;
  position: number;
  title: string | null;
  content: string[] | null;
  contentBlocks?: ContentBlock[] | null;  // Rich content blocks (takes precedence over content)
  speakerNotes: string | null;
  imagePrompt: string | null;
  imageUrl: string | null;
  layoutType: LayoutType | null;
  alignment: Alignment | null;
  approvalState: ApprovalState;
  createdAt: number;
  updatedAt: number;
}

export interface RoughDraft {
  id: string;
  ownerId: string;
  ideationSessionId: string | null;
  presentationId: string | null;
  topic: string;
  themeId: string;
  visualStyle: string | null;
  contentDensity?: ContentDensity;  // User-selected content density
  status: RoughDraftStatus;
  slides: RoughDraftSlide[];
  createdAt: number;
  updatedAt: number;
}

// ============ Backend Types (snake_case) ============

export interface BackendRoughDraftSlide {
  id: string;
  rough_draft_id: string;
  position: number;
  title: string | null;
  content: string[] | null;
  content_blocks?: ContentBlock[] | null;  // Rich content blocks
  speaker_notes: string | null;
  image_prompt: string | null;
  image_url: string | null;
  layout_type: string | null;
  alignment: string | null;
  approval_state: string;
  created_at: string;
  updated_at: string;
}

export interface BackendRoughDraft {
  id: string;
  owner_id: string;
  ideation_session_id: string | null;
  presentation_id: string | null;
  topic: string;
  theme_id: string;
  visual_style: string | null;
  content_density?: string;  // User-selected content density
  status: string;
  slides?: BackendRoughDraftSlide[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedRoughDraftResponse {
  items: BackendRoughDraft[];
  total: number;
  page: number;
  page_size: number;
}

// ============ Request Types ============

export interface CreateRoughDraftSlideRequest {
  position: number;
  title: string | null;
  content: string[] | null;
  content_blocks?: ContentBlock[] | null;
  speaker_notes: string | null;
  image_prompt: string | null;
  image_url: string | null;
  layout_type: string | null;
  alignment: string | null;
  approval_state: string;
}

export interface CreateRoughDraftRequest {
  topic: string;
  theme_id: string;
  visual_style: string | null;
  content_density?: string;
  status: string;
  ideation_session_id: string | null;
  slides: CreateRoughDraftSlideRequest[];
}

export interface UpdateRoughDraftRequest {
  topic?: string;
  theme_id?: string;
  visual_style?: string;
  content_density?: string;
  status?: string;
}

export interface UpdateRoughDraftSlideRequest {
  position?: number;
  title?: string;
  content?: string[];
  content_blocks?: ContentBlock[];
  speaker_notes?: string;
  image_prompt?: string;
  image_url?: string;
  layout_type?: string;
  alignment?: string;
  approval_state?: string;
}

export interface ApproveRoughDraftRequest {
  topic?: string;
  theme_id?: string;
  visual_style?: string;
}
