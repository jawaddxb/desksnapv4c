/**
 * RelatedContentPanel
 *
 * Displays related content when editing a presentation.
 * Shows source ideation and rough draft history if available.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, FileEdit, Clock, Layers, ExternalLink } from 'lucide-react';

interface RelatedIdeation {
  id: string;
  topic: string;
  lastModified: number;
  notesCount: number;
}

interface RelatedRoughDraft {
  id: string;
  topic: string;
  lastModified: number;
  slidesCount: number;
  status: string;
}

interface RelatedContentPanelProps {
  ideation?: RelatedIdeation | null;
  roughDraft?: RelatedRoughDraft | null;
  onViewIdeation?: (id: string) => void;
  onViewRoughDraft?: (id: string) => void;
}

export const RelatedContentPanel: React.FC<RelatedContentPanelProps> = ({
  ideation,
  roughDraft,
  onViewIdeation,
  onViewRoughDraft,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't render if no related content
  if (!ideation && !roughDraft) {
    return null;
  }

  return (
    <div className="border-t border-[#D4E5D4] bg-[#EDF5F0]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-[#8FA58F] hover:text-[#1E2E1E] transition-colors duration-150"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#6B8E6B]" />
          Related Content
        </span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Source Ideation */}
          {ideation && onViewIdeation && (
            <button
              onClick={() => onViewIdeation(ideation.id)}
              className="w-full p-3 bg-[#6B8E6B]/10 hover:bg-[#6B8E6B]/20 border border-[#6B8E6B]/30 hover:border-[#6B8E6B]/50 transition-all duration-150 text-left group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6B8E6B]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#6B8E6B]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B8E6B] mb-0.5">
                      Source Ideation
                    </p>
                    <p className="text-sm text-[#1E2E1E] font-medium line-clamp-1 group-hover:text-[#6B8E6B] transition-colors duration-150">
                      {ideation.topic || 'Untitled'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#6B8E6B]/50 group-hover:text-[#6B8E6B] transition-colors duration-150 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8FA58F]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ideation.lastModified).toLocaleDateString()}
                </span>
                <span className="px-1.5 py-0.5 bg-[#EDF5F0]">
                  {ideation.notesCount} notes
                </span>
              </div>
            </button>
          )}

          {/* Source Rough Draft */}
          {roughDraft && onViewRoughDraft && (
            <button
              onClick={() => onViewRoughDraft(roughDraft.id)}
              className="w-full p-3 bg-white hover:bg-[#F5FAF7] border border-[#D4E5D4] hover:border-[#6B8E6B] transition-all duration-150 text-left group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#EDF5F0] flex items-center justify-center flex-shrink-0">
                    <FileEdit className="w-4 h-4 text-[#8FA58F]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8FA58F] mb-0.5">
                      Source Draft
                    </p>
                    <p className="text-sm text-[#1E2E1E] font-medium line-clamp-1 group-hover:text-[#6B8E6B] transition-colors duration-150">
                      {roughDraft.topic || 'Untitled'}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8FA58F] group-hover:text-[#6B8E6B] transition-colors duration-150 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8FA58F]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(roughDraft.lastModified).toLocaleDateString()}
                </span>
                <span className="px-1.5 py-0.5 bg-[#EDF5F0] flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {roughDraft.slidesCount} slides
                </span>
                <span className={`px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                  roughDraft.status === 'approved'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[#EDF5F0] text-[#8FA58F]'
                }`}>
                  {roughDraft.status}
                </span>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatedContentPanel;
