/**
 * RoughDraftControls Component
 *
 * Bottom toolbar with action buttons for rough draft review.
 * SRP: Single responsibility - action buttons and navigation.
 *
 * Extracted from RoughDraftCanvas.tsx for better separation of concerns.
 */

import React from 'react';
import { GenerationPhase } from '@/types/roughDraft';

export interface RoughDraftControlsProps {
  /** Current generation phase */
  phase: GenerationPhase;
  /** Number of slides */
  slideCount: number;
  /** Source of the draft */
  source: 'ideation' | 'copilot' | 'existing' | 'sources';
  /** Called when user discards the draft */
  onDiscard: () => void;
  /** Called when user goes back */
  onBack: () => void;
  /** Called when user approves all slides */
  onApproveAll: () => void;
}

export const RoughDraftControls: React.FC<RoughDraftControlsProps> = ({
  phase,
  slideCount,
  source,
  onDiscard,
  onBack,
  onApproveAll,
}) => {
  const sourceLabel = source === 'ideation' ? 'Ideation'
    : source === 'copilot' ? 'Copilot'
    : source === 'sources' ? 'Sources'
    : 'Drafts';

  return (
    <div className="h-16 bg-black border-t border-white/10 flex items-center justify-between px-4">
      {/* Left actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDiscard}
          className="px-4 py-2.5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-wider
                     hover:border-[#c5a47e]/50 hover:text-white transition-all duration-200"
        >
          Discard
        </button>
        <button
          onClick={onBack}
          className="px-4 py-2.5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-wider
                     hover:border-[#c5a47e]/50 hover:text-white transition-all duration-200"
        >
          Back to {sourceLabel}
        </button>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {phase === 'complete' && (
          <button
            onClick={onApproveAll}
            disabled={slideCount === 0}
            className="px-6 py-2 bg-[#c5a47e] text-black font-bold text-xs uppercase tracking-wider
                       hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Approve & Build Deck
          </button>
        )}
      </div>
    </div>
  );
};

export default RoughDraftControls;
