/**
 * useGenerationProgress Hook
 *
 * Tracks presentation generation progress and provides preview slides.
 * Designed for in-modal progress display during creation flow.
 *
 * KISS: < 80 lines, focused on progress tracking
 * SOLID-S: Only tracks generation progress state
 * SOLID-D: Uses callbacks for state updates, decoupled from useDeck
 * DRY: Reuses PreviewSlide type from DraftPreviewCards
 */

import { useState, useCallback } from 'react';
import { PreviewSlide } from '@/components/create-flow/DraftPreviewCards';

export type GenerationPhase = 'idle' | 'planning' | 'creating' | 'imaging' | 'complete';

interface GenerationProgress {
  phase: GenerationPhase;
  phaseLabel: string;
  percentage: number;
  previewSlides: PreviewSlide[];
}

interface PlanSlide {
  title: string;
  bulletPoints: string[];
}

/**
 * Hook for tracking generation progress with preview slides.
 * Call phase methods as generation progresses.
 */
export const useGenerationProgress = () => {
  const [phase, setPhase] = useState<GenerationPhase>('idle');
  const [previewSlides, setPreviewSlides] = useState<PreviewSlide[]>([]);

  const getPhaseInfo = (phase: GenerationPhase): { label: string; percentage: number } => {
    switch (phase) {
      case 'idle': return { label: '', percentage: 0 };
      case 'planning': return { label: 'Analyzing topic...', percentage: 15 };
      case 'creating': return { label: 'Creating slide structure...', percentage: 45 };
      case 'imaging': return { label: 'Generating visuals...', percentage: 75 };
      case 'complete': return { label: 'Complete!', percentage: 100 };
    }
  };

  const startPlanning = useCallback(() => {
    setPhase('planning');
    setPreviewSlides([]);
  }, []);

  const planComplete = useCallback((slides: PlanSlide[]) => {
    setPhase('creating');
    // Convert plan slides to preview slides with loading state
    const previews: PreviewSlide[] = slides.map((slide, index) => ({
      id: `preview-${index}`,
      title: slide.title,
      content: slide.bulletPoints,
      isLoading: false,
    }));
    setPreviewSlides(previews);
  }, []);

  const startImaging = useCallback(() => {
    setPhase('imaging');
  }, []);

  const complete = useCallback(() => {
    setPhase('complete');
  }, []);

  const reset = useCallback(() => {
    setPhase('idle');
    setPreviewSlides([]);
  }, []);

  const info = getPhaseInfo(phase);

  const progress: GenerationProgress = {
    phase,
    phaseLabel: info.label,
    percentage: info.percentage,
    previewSlides,
  };

  return {
    progress,
    isGenerating: phase !== 'idle' && phase !== 'complete',
    actions: {
      startPlanning,
      planComplete,
      startImaging,
      complete,
      reset,
    },
  };
};

export type { GenerationProgress, PlanSlide };
