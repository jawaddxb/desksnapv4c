/**
 * IdeationHistoryPanel
 *
 * Displays a grid of saved ideation sessions.
 * Users can load, delete, or generate new decks from ideations.
 */

import React from 'react';
import { IdeationSession, COLUMNS } from '@/types/ideation';
import { Lightbulb, Trash2, Clock, FileText, ArrowRight, BookOpen } from 'lucide-react';

interface IdeationHistoryPanelProps {
  ideations: IdeationSession[];
  isLoading: boolean;
  onSelectIdeation: (id: string) => void;
  onDeleteIdeation: (id: string) => void;
  onGenerateDeck: (id: string) => void;
  onViewJournal?: (id: string) => void;
}

/**
 * Get stage badge color and label
 */
function getStageBadge(stage: string): { color: string; label: string } {
  switch (stage) {
    case 'discover':
      return { color: 'bg-blue-500/20 text-blue-400', label: 'Discovering' };
    case 'expand':
      return { color: 'bg-purple-500/20 text-purple-400', label: 'Expanding' };
    case 'structure':
      return { color: 'bg-amber-500/20 text-amber-400', label: 'Structuring' };
    case 'ready':
      return { color: 'bg-green-500/20 text-green-400', label: 'Ready' };
    case 'review':
      return { color: 'bg-orange-500/20 text-orange-400', label: 'Reviewing' };
    case 'style-preview':
      return { color: 'bg-pink-500/20 text-pink-400', label: 'Styling' };
    default:
      return { color: 'bg-white/10 text-white/60', label: stage };
  }
}

/**
 * Count notes per column for visual indicator
 */
function getColumnCounts(notes: IdeationSession['notes']): number[] {
  const counts = [0, 0, 0, 0, 0];
  notes.forEach(note => {
    if (note.column >= 0 && note.column < 5) {
      counts[note.column]++;
    }
  });
  return counts;
}

export const IdeationHistoryPanel: React.FC<IdeationHistoryPanelProps> = ({
  ideations,
  isLoading,
  onSelectIdeation,
  onDeleteIdeation,
  onGenerateDeck,
  onViewJournal,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#6B8E6B] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#8FA58F] text-sm">Loading ideations...</p>
        </div>
      </div>
    );
  }

  if (ideations.length === 0) {
    return (
      <div className="border border-dashed border-[#D4E5D4] p-16 text-center flex flex-col items-center justify-center bg-[#EDF5F0] rounded-lg">
        <div className="w-16 h-16 bg-[#6B8E6B]/10 flex items-center justify-center mb-6">
          <Lightbulb className="w-8 h-8 text-[#6B8E6B]/60" />
        </div>
        <h3 className="text-xl font-light text-[#1E2E1E] mb-2">Start with a brainstorm</h3>
        <p className="text-[#8FA58F] mb-6 max-w-md mx-auto">
          Ideations help you structure your thoughts before building slides.
          Use the AI copilot to explore ideas, organize content, and plan your presentation.
        </p>
        <div className="flex flex-col items-center gap-2 text-sm">
          <div className="flex items-center gap-4 text-[#8FA58F]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Discover
            </span>
            <ArrowRight className="w-3 h-3" />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Expand
            </span>
            <ArrowRight className="w-3 h-3" />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Structure
            </span>
            <ArrowRight className="w-3 h-3" />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              Build
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideations.map(ideation => {
        const stageBadge = getStageBadge(ideation.stage);
        const columnCounts = getColumnCounts(ideation.notes);
        const totalNotes = ideation.notes.length;
        const linkedDecks = ideation.generatedPresentationIds?.length || 0;
        const hasJournal = ideation.creativeJournal && ideation.creativeJournal.entries.length > 0;

        return (
          <div
            key={ideation.id}
            className="group bg-white border border-[#D4E5D4] hover:border-[#6B8E6B] transition-all duration-150 flex flex-col overflow-hidden relative rounded-lg"
          >
            {/* Header */}
            <div
              className="p-5 cursor-pointer"
              onClick={() => onSelectIdeation(ideation.id)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6B8E6B]/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-[#6B8E6B]" />
                  </div>
                  <h3 className="font-bold text-[#1E2E1E] line-clamp-2 group-hover:text-[#6B8E6B] transition-colors duration-150">
                    {ideation.topic || 'Untitled Ideation'}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${stageBadge.color}`}>
                  {stageBadge.label}
                </span>
              </div>

              {/* Column counts visualization */}
              <div className="flex gap-1 mb-4">
                {COLUMNS.map((col, idx) => (
                  <div key={col} className="flex-1" title={`${col}: ${columnCounts[idx]} notes`}>
                    <div className="h-1 bg-[#D4E5D4] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6B8E6B] transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (columnCounts[idx] / Math.max(1, totalNotes)) * 100 * 2)}%`,
                        }}
                      />
                    </div>
                    <span className="text-[8px] text-[#8FA58F] mt-1 block text-center">
                      {col.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 text-[10px] text-[#8FA58F] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ideation.lastModified).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-[#EDF5F0] text-[#8FA58F]">
                  {totalNotes} Notes
                </span>
                {linkedDecks > 0 && (
                  <span className="px-2 py-1 bg-[#6B8E6B]/10 text-[#6B8E6B]">
                    {linkedDecks} Deck{linkedDecks > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-[#D4E5D4] p-3 flex items-center gap-2 bg-[#EDF5F0]">
              <button
                onClick={() => onGenerateDeck(ideation.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-150"
              >
                <FileText className="w-3 h-3" />
                Generate Deck
              </button>

              {hasJournal && onViewJournal && (
                <button
                  onClick={() => onViewJournal(ideation.id)}
                  className="p-2 bg-white hover:bg-[#D4E5D4] text-[#8FA58F] hover:text-[#6B8E6B] transition-all duration-150"
                  title="View Creative Journal"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => onSelectIdeation(ideation.id)}
                className="p-2 bg-white hover:bg-[#D4E5D4] text-[#8FA58F] hover:text-[#1E2E1E] transition-all duration-150"
                title="Continue Editing"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteIdeation(ideation.id);
              }}
              className="absolute top-3 right-3 p-2 bg-white text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700 transition-all duration-150 z-10 rounded"
              title="Delete Ideation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default IdeationHistoryPanel;
