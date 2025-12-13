/**
 * RoughDraftHistoryPanel
 *
 * Displays a grid of saved rough drafts.
 * Users can load, delete, or approve drafts to create final presentations.
 */

import React from 'react';
import { RoughDraft, RoughDraftStatus } from '@/types/roughDraft';
import { FileEdit, Trash2, Clock, Layers, ArrowRight, CheckCircle } from 'lucide-react';

interface RoughDraftHistoryPanelProps {
  drafts: RoughDraft[];
  isLoading: boolean;
  onSelectDraft: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onApproveDraft: (id: string) => void;
}

/**
 * Get status badge color and label
 */
function getStatusBadge(status: RoughDraftStatus): { color: string; label: string } {
  switch (status) {
    case 'in_progress':
      return { color: 'bg-blue-500/20 text-blue-400', label: 'In Progress' };
    case 'ready':
      return { color: 'bg-green-500/20 text-green-400', label: 'Ready' };
    case 'approved':
      return { color: 'bg-[#c5a47e]/20 text-[#c5a47e]', label: 'Approved' };
    case 'discarded':
      return { color: 'bg-red-500/20 text-red-400', label: 'Discarded' };
    default:
      return { color: 'bg-white/10 text-white/60', label: status };
  }
}

/**
 * Get approval state distribution for visual indicator
 */
function getApprovalDistribution(slides: RoughDraft['slides']): {
  pending: number;
  approved: number;
  modified: number;
} {
  return slides.reduce(
    (acc, slide) => {
      if (slide.approvalState === 'pending') acc.pending++;
      else if (slide.approvalState === 'approved') acc.approved++;
      else if (slide.approvalState === 'modified') acc.modified++;
      return acc;
    },
    { pending: 0, approved: 0, modified: 0 }
  );
}

export const RoughDraftHistoryPanel: React.FC<RoughDraftHistoryPanelProps> = ({
  drafts,
  isLoading,
  onSelectDraft,
  onDeleteDraft,
  onApproveDraft,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#c5a47e] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading rough drafts...</p>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="border border-dashed border-white/20 p-16 text-center flex flex-col items-center justify-center bg-black/50">
        <div className="w-16 h-16 bg-[#c5a47e]/10 flex items-center justify-center mb-6">
          <FileEdit className="w-8 h-8 text-[#c5a47e]/60" />
        </div>
        <h3 className="text-xl font-light text-white mb-2">Review before you build</h3>
        <p className="text-white/50 mb-6 max-w-md mx-auto">
          Rough drafts give you a chance to review and refine AI-generated slides
          before creating your final presentation.
        </p>
        <div className="flex items-center gap-3 text-sm text-white/40">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded">
            <span className="w-2 h-2 rounded-full bg-white/30"></span>
            <span>Pending</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Modified</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            <span>Approved</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drafts.map(draft => {
        const statusBadge = getStatusBadge(draft.status);
        const totalSlides = draft.slides.length;
        const distribution = getApprovalDistribution(draft.slides);
        const isApproved = draft.status === 'approved';
        const isDiscarded = draft.status === 'discarded';

        return (
          <div
            key={draft.id}
            className="group bg-[#1a1a1a] border border-white/10 hover:border-[#c5a47e]/50 transition-all duration-150 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div
              className="p-5 cursor-pointer"
              onClick={() => !isApproved && !isDiscarded && onSelectDraft(draft.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#c5a47e]/10 flex items-center justify-center flex-shrink-0">
                    <FileEdit className="w-4 h-4 text-[#c5a47e]" />
                  </div>
                  <h3 className="font-bold text-white line-clamp-2 group-hover:text-[#c5a47e] transition-colors duration-150">
                    {draft.topic || 'Untitled Draft'}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Slide approval visualization */}
              {totalSlides > 0 && (
                <div className="mb-4">
                  <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
                    {distribution.approved > 0 && (
                      <div
                        className="bg-green-500 transition-all duration-300"
                        style={{ width: `${(distribution.approved / totalSlides) * 100}%` }}
                        title={`${distribution.approved} approved`}
                      />
                    )}
                    {distribution.modified > 0 && (
                      <div
                        className="bg-amber-500 transition-all duration-300"
                        style={{ width: `${(distribution.modified / totalSlides) * 100}%` }}
                        title={`${distribution.modified} modified`}
                      />
                    )}
                    {distribution.pending > 0 && (
                      <div
                        className="bg-white/30 transition-all duration-300"
                        style={{ width: `${(distribution.pending / totalSlides) * 100}%` }}
                        title={`${distribution.pending} pending`}
                      />
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-white/40">
                    <span>{distribution.approved} approved</span>
                    <span>{distribution.pending} pending</span>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-white/5 text-white/60 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {totalSlides} Slides
                </span>
                {draft.presentationId && (
                  <span className="px-2 py-1 bg-[#c5a47e]/10 text-[#c5a47e] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Deck Created
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 p-3 flex items-center gap-2 bg-black/30">
              {!isApproved && !isDiscarded ? (
                <>
                  <button
                    onClick={() => onApproveDraft(draft.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#c5a47e] hover:bg-white text-black px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-150"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve & Build
                  </button>

                  <button
                    onClick={() => onSelectDraft(draft.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-150"
                    title="Continue Editing"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center text-white/40 text-xs uppercase tracking-wide py-2">
                  {isApproved ? 'Draft has been approved' : 'Draft was discarded'}
                </div>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteDraft(draft.id);
              }}
              className="absolute top-3 right-3 p-2 bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150 z-10"
              title="Delete Draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default RoughDraftHistoryPanel;
