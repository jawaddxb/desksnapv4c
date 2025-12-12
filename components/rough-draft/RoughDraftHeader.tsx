/**
 * RoughDraftHeader Component
 *
 * Header bar with title, status, and narrative toggle.
 * SRP: Single responsibility - header display and status.
 *
 * Extracted from RoughDraftCanvas.tsx for better separation of concerns.
 */

import React from 'react';

type GenerationPhase = 'initializing' | 'generating-content' | 'refining-prompts' | 'generating-images' | 'complete';

export interface RoughDraftHeaderProps {
  /** Topic of the presentation */
  topic: string;
  /** Current generation phase */
  phase: GenerationPhase;
  /** Whether loading an existing draft */
  isLoadingExisting: boolean;
  /** Number of completed slides */
  completedSlides: number;
  /** Total number of slides */
  totalSlides: number;
  /** Number of approved slides */
  approvedSlides: number;
  /** Whether there are any image errors */
  hasErrors: boolean;
  /** Whether a save is in progress */
  isSaving: boolean;
  /** Whether draft is persisted */
  isPersisted: boolean;
  /** Whether narrative panel is open */
  isNarrativePanelOpen: boolean;
  /** Toggle narrative panel */
  onToggleNarrativePanel: () => void;
  /** Go back */
  onBack: () => void;
}

export const RoughDraftHeader: React.FC<RoughDraftHeaderProps> = ({
  topic,
  phase,
  isLoadingExisting,
  completedSlides,
  totalSlides,
  approvedSlides,
  hasErrors,
  isSaving,
  isPersisted,
  isNarrativePanelOpen,
  onToggleNarrativePanel,
  onBack,
}) => {
  // Phase label
  const getPhaseLabel = () => {
    if (isLoadingExisting) return 'Loading draft...';

    switch (phase) {
      case 'initializing': return 'Initializing...';
      case 'generating-content': return 'Structuring slides...';
      case 'refining-prompts': return 'Refining image prompts...';
      case 'generating-images': return `Generating images (${completedSlides}/${totalSlides})...`;
      case 'complete': return hasErrors ? 'Draft ready (some images failed)' : 'Draft ready for review';
    }
  };

  const isInProgress = phase !== 'complete' || isLoadingExisting;

  return (
    <div className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-4 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Back button */}
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/5 transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white/60 hover:text-[#c5a47e] transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {/* Icon */}
        <div className="w-8 h-8 border border-[#c5a47e] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>

        {/* Title and status */}
        <div>
          <h1 className="font-bold text-white uppercase tracking-wide">{topic}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest">
              {getPhaseLabel()}
            </span>
            {isInProgress && (
              <div className="w-3 h-3 border border-[#c5a47e] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-white/50">
          <span>{totalSlides} slides</span>
          {approvedSlides > 0 && (
            <span className="text-[#c5a47e]">{approvedSlides} approved</span>
          )}
          {isSaving && (
            <span className="flex items-center gap-1 text-white/30">
              <div className="w-2 h-2 border border-white/30 border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          )}
          {isPersisted && !isSaving && (
            <span className="text-green-400/60">Saved</span>
          )}
        </div>

        {/* Narrative toggle */}
        <button
          onClick={onToggleNarrativePanel}
          className={`p-2 transition-colors ${
            isNarrativePanelOpen ? 'bg-[#c5a47e]/20 text-[#c5a47e]' : 'hover:bg-white/5 text-white/60'
          }`}
          title={isNarrativePanelOpen ? 'Hide agent activity' : 'Show agent activity'}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RoughDraftHeader;
