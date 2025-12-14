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
      return { color: 'bg-blue-500/20 text-blue-600', label: 'In Progress' };
    case 'ready':
      return { color: 'bg-green-500/20 text-green-600', label: 'Ready' };
    case 'approved':
      return { color: 'bg-[#6B8E6B]/20 text-[#6B8E6B]', label: 'Approved' };
    case 'discarded':
      return { color: 'bg-red-500/20 text-red-600', label: 'Discarded' };
    default:
      return { color: 'bg-[#D4E5D4] text-[#8FA58F]', label: status };
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
          <div className="w-8 h-8 border-2 border-[#6B8E6B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8FA58F] text-sm">Loading rough drafts...</p>
        </div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="border border-dashed border-[#D4E5D4] p-16 text-center flex flex-col items-center justify-center bg-white rounded-lg">
        <div className="w-16 h-16 bg-[#6B8E6B]/10 flex items-center justify-center mb-6 rounded-lg">
          <FileEdit className="w-8 h-8 text-[#6B8E6B]/60" />
        </div>
        <h3 className="text-xl font-light text-[#1E2E1E] mb-2">Review before you build</h3>
        <p className="text-[#8FA58F] mb-6 max-w-md mx-auto">
          Rough drafts give you a chance to review and refine AI-generated slides
          before creating your final presentation.
        </p>
        <div className="flex items-center gap-3 text-sm text-[#8FA58F]">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EDF5F0] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#8FA58F]/50"></span>
            <span>Pending</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EDF5F0] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Modified</span>
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EDF5F0] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
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
            className="group bg-white border border-[#D4E5D4] hover:border-[#6B8E6B]/50 transition-all duration-150 flex flex-col overflow-hidden relative rounded-lg"
          >
            {/* Header */}
            <div
              className="p-5 cursor-pointer"
              onClick={() => !isApproved && !isDiscarded && onSelectDraft(draft.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6B8E6B]/10 flex items-center justify-center flex-shrink-0 rounded-lg">
                    <FileEdit className="w-4 h-4 text-[#6B8E6B]" />
                  </div>
                  <h3 className="font-bold text-[#1E2E1E] line-clamp-2 group-hover:text-[#6B8E6B] transition-colors duration-150">
                    {draft.topic || 'Untitled Draft'}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 rounded-lg ${statusBadge.color}`}
                >
                  {statusBadge.label}
                </span>
              </div>

              {/* Slide approval visualization */}
              {totalSlides > 0 && (
                <div className="mb-4">
                  <div className="flex h-2 rounded-full overflow-hidden bg-[#D4E5D4]">
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
                        className="bg-[#8FA58F]/50 transition-all duration-300"
                        style={{ width: `${(distribution.pending / totalSlides) * 100}%` }}
                        title={`${distribution.pending} pending`}
                      />
                    )}
                  </div>
                  <div className="flex justify-between mt-1 text-[8px] text-[#8FA58F]">
                    <span>{distribution.approved} approved</span>
                    <span>{distribution.pending} pending</span>
                  </div>
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-4 text-[10px] text-[#8FA58F] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-[#EDF5F0] text-[#1E2E1E] flex items-center gap-1 rounded-lg">
                  <Layers className="w-3 h-3" />
                  {totalSlides} Slides
                </span>
                {draft.presentationId && (
                  <span className="px-2 py-1 bg-[#6B8E6B]/10 text-[#6B8E6B] flex items-center gap-1 rounded-lg">
                    <CheckCircle className="w-3 h-3" />
                    Deck Created
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#D4E5D4] p-3 flex items-center gap-2 bg-[#EDF5F0]">
              {!isApproved && !isDiscarded ? (
                <>
                  <button
                    onClick={() => onApproveDraft(draft.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#6B8E6B] hover:bg-[#1E2E1E] text-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-150 rounded-lg"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Approve & Build
                  </button>

                  <button
                    onClick={() => onSelectDraft(draft.id)}
                    className="p-2 bg-white hover:bg-[#EDF5F0] text-[#8FA58F] hover:text-[#1E2E1E] transition-all duration-150 rounded-lg"
                    title="Continue Editing"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex-1 text-center text-[#8FA58F] text-xs uppercase tracking-wide py-2">
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
              className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-600 transition-all duration-150 z-10 rounded-lg"
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
