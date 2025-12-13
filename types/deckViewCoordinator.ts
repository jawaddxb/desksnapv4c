/**
 * DeckViewCoordinator Props - Domain-Specific Interfaces
 *
 * Splits the DeckViewCoordinatorProps into focused domain interfaces
 * following the Interface Segregation Principle (ISP).
 */

import type { Presentation, Theme, ViewMode, Slide } from '@/types';
import type { Message } from '@/hooks/useChat';
import type { IdeationSession } from '@/types/ideation';
import type { RoughDraft } from '@/types/roughDraft';

// ============================================
// Presentation State
// ============================================

/**
 * Core presentation state values.
 */
export interface PresentationState {
  currentPresentation: Presentation | null;
  savedDecks: Presentation[];
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  isGenerating: boolean;
  isRefining: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

/**
 * Theme and layout state.
 */
export interface ThemeLayoutState {
  activeTheme: Theme;
  activeWabiSabiLayout: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

// ============================================
// Deck Actions
// ============================================

/**
 * Theme and styling actions.
 */
export interface ThemeActions {
  applyTheme: (themeId: string) => void;
  applyTypography: (fontFamily: string) => void;
  setWabiSabiLayout: (layoutName: string) => void;
  cycleWabiSabiLayout: () => void;
  shuffleLayoutVariants: () => void;
  updateVisualStyleAndRegenerateImages: (visualStyle: string, regenerate?: boolean) => void;
}

/**
 * Slide manipulation actions.
 */
export interface SlideActions {
  updateSlide: (slideIndex: number, updates: Partial<Slide>) => void;
  refineSlideContent: (slideIndex: number, refinementType: string) => void;
  enhanceSlideImage: (slideIndex: number) => void;
  moveSlide: (from: number, to: number) => void;
}

/**
 * Image generation actions.
 */
export interface ImageActions {
  regenerateAllImages: () => void;
  regenerateSlideImage: (slideIndex: number) => void;
}

/**
 * Deck lifecycle actions.
 */
export interface DeckLifecycleActions {
  saveDeck: () => void;
  closeDeck: () => void;
  loadDeck: (id: string) => void;
  deleteDeck: (id: string) => void;
  importDeck: (file: File) => void;
  exportDeck: () => void;
  remixDeck: () => void;
}

/**
 * Combined deck actions object (for backward compatibility).
 */
export interface DeckActions extends
  ThemeActions,
  SlideActions,
  ImageActions,
  DeckLifecycleActions {}

// ============================================
// Chat State
// ============================================

/**
 * Chat-related state.
 */
export interface ChatState {
  messages: Message[];
  sidebarScrollRef: React.RefObject<HTMLDivElement>;
}

// ============================================
// Workspace Data
// ============================================

/**
 * Ideation-related data.
 */
export interface IdeationData {
  savedIdeations: IdeationSession[];
  isLoadingIdeations: boolean;
}

/**
 * Rough draft-related data.
 */
export interface RoughDraftData {
  savedRoughDrafts: RoughDraft[];
  isLoadingRoughDrafts: boolean;
}

/**
 * Source content references.
 */
export interface SourceContentData {
  sourceIdeation: IdeationSession | null | undefined;
  sourceRoughDraft: RoughDraft | null | undefined;
}

// ============================================
// Event Handlers
// ============================================

/**
 * Deck-related event handlers.
 */
export interface DeckHandlers {
  onSendMessage: () => void;
  onCreateDeck: () => void;
  onCloneDeck: (id: string) => void;
  onCloneCurrentDeck: () => void;
  onStartPresenting: () => void;
}

/**
 * Ideation-related event handlers.
 */
export interface IdeationHandlers {
  onIdeate: () => void;
  onLoadIdeation: (id: string) => void;
  onDeleteIdeation: (id: string) => void;
  onViewSourceIdeation: (id: string) => void;
}

/**
 * Rough draft-related event handlers.
 */
export interface RoughDraftHandlers {
  onLoadRoughDraft: (id: string) => void;
  onDeleteRoughDraft: (id: string) => void;
  onApproveRoughDraft: (id: string) => void;
  onViewSourceRoughDraft: (id: string) => void;
}

/**
 * Mode navigation handlers.
 */
export interface ModeNavigationHandlers {
  onOpenSources: (preset: 'video' | 'web' | 'mixed', recipe?: 'training' | 'explainer' | 'brief' | 'pitch') => void;
  onOpenBeautify: () => void;
}

// ============================================
// Combined Props
// ============================================

/**
 * Complete DeckViewCoordinatorProps using intersection of domain interfaces.
 * This maintains backward compatibility while enabling focused usage.
 */
export interface DeckViewCoordinatorProps extends
  PresentationState,
  ThemeLayoutState,
  ChatState,
  IdeationData,
  RoughDraftData,
  SourceContentData,
  DeckHandlers,
  IdeationHandlers,
  RoughDraftHandlers,
  ModeNavigationHandlers {
  // Actions object (kept as nested for backward compatibility)
  actions: DeckActions;
}
