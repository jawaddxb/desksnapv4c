/**
 * MainStage Props - Domain-Specific Interfaces
 *
 * Splits the monolithic MainStageProps (57 props) into focused domain interfaces
 * following the Interface Segregation Principle (ISP).
 */

import type { Slide, Theme, Presentation, ImageStylePreset } from '@/types';
import type { IdeationSession } from '@/types/ideation';
import type { RoughDraft } from '@/types/roughDraft';

// ============================================
// Core Slide Display Props
// ============================================

/**
 * Core props for displaying a slide.
 * These are always needed when rendering slide content.
 */
export interface SlideDisplayProps {
  slide: Slide | null;
  theme: Theme;
  viewMode?: 'standard' | 'wabi-sabi';
  printMode?: boolean;
  activeWabiSabiLayout?: string;
}

/**
 * Props for slide editing operations.
 */
export interface SlideEditingProps {
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  onRegenerateSlide?: (mode: 'same' | 'varied') => void;
  onRegenerateAll?: (mode: 'same' | 'varied') => void;
}

/**
 * Props for AI refinement features.
 */
export interface AIRefinementProps {
  onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
  onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
  isRefining?: boolean;
}

/**
 * Props for presentation context (image suggestions).
 */
export interface PresentationContextProps {
  presentation?: Presentation | null;
  activeSlideIndex?: number;
}

// ============================================
// Dashboard Domain Props
// ============================================

/**
 * Props for saved deck operations in Dashboard.
 */
export interface DeckOperationsProps {
  savedDecks?: Presentation[];
  onLoadDeck?: (id: string) => void;
  onDeleteDeck?: (id: string) => void;
  onCloneDeck?: (id: string) => void;
  onCreateDeck?: () => void;
  onImport?: (file: File) => void;
}

/**
 * Props for ideation session operations.
 */
export interface IdeationOperationsProps {
  savedIdeations?: IdeationSession[];
  isLoadingIdeations?: boolean;
  onLoadIdeation?: (id: string) => void;
  onDeleteIdeation?: (id: string) => void;
  onGenerateDeckFromIdeation?: (id: string) => void;
  onViewJournal?: (id: string) => void;
}

/**
 * Props for rough draft operations.
 */
export interface RoughDraftOperationsProps {
  savedRoughDrafts?: RoughDraft[];
  isLoadingRoughDrafts?: boolean;
  onLoadRoughDraft?: (id: string) => void;
  onDeleteRoughDraft?: (id: string) => void;
  onApproveRoughDraft?: (id: string) => void;
}

/**
 * Props for workspace mode navigation.
 */
export interface WorkspaceModeProps {
  onIdeate?: () => void;
  onOpenSources?: (preset: 'video' | 'web' | 'mixed') => void;
  onBeautify?: () => void;
}

// ============================================
// Combined Dashboard Props
// ============================================

/**
 * All props needed for Dashboard rendering.
 * Used when slide is null.
 */
export interface DashboardProps extends
  DeckOperationsProps,
  IdeationOperationsProps,
  RoughDraftOperationsProps,
  WorkspaceModeProps {}

// ============================================
// Complete MainStage Props
// ============================================

/**
 * Complete MainStageProps using intersection of domain interfaces.
 * This maintains backward compatibility while enabling focused usage.
 */
export interface MainStageProps extends
  SlideDisplayProps,
  SlideEditingProps,
  AIRefinementProps,
  PresentationContextProps,
  DashboardProps {}
