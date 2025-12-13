/**
 * SlideJournalOverlay
 *
 * A compact overlay showing AI's thinking for a specific slide.
 * Triggered by an info icon on the slide and displays filtered journal entries.
 */

import React from 'react';
import { JournalEntry, JournalStage } from '@/types/ideation';
import { X, Lightbulb, Paintbrush, Image, Type, Layout, Check } from 'lucide-react';

interface SlideJournalOverlayProps {
  slideId: string;
  slideIndex: number;
  journalEntries: JournalEntry[];
  onClose: () => void;
}

/**
 * Get icon for entry based on title/content
 */
function getEntryIcon(entry: JournalEntry): React.ReactNode {
  const title = entry.title.toLowerCase();
  if (title.includes('layout') || title.includes('flow')) {
    return <Layout className="w-4 h-4" />;
  }
  if (title.includes('image') || title.includes('visual')) {
    return <Image className="w-4 h-4" />;
  }
  if (title.includes('content') || title.includes('structure')) {
    return <Type className="w-4 h-4" />;
  }
  if (title.includes('theme') || title.includes('style')) {
    return <Paintbrush className="w-4 h-4" />;
  }
  return <Lightbulb className="w-4 h-4" />;
}

/**
 * Get color for stage
 */
function getStageColor(stage: JournalStage): string {
  switch (stage) {
    case 'analyzing':
      return 'text-blue-400 bg-blue-500/20';
    case 'exploring':
      return 'text-amber-400 bg-amber-500/20';
    case 'deciding':
      return 'text-purple-400 bg-purple-500/20';
    case 'creating':
      return 'text-green-400 bg-green-500/20';
    case 'refining':
      return 'text-pink-400 bg-pink-500/20';
    default:
      return 'text-white/60 bg-white/10';
  }
}

export const SlideJournalOverlay: React.FC<SlideJournalOverlayProps> = ({
  slideId,
  slideIndex,
  journalEntries,
  onClose,
}) => {
  // Filter entries related to this slide
  const relatedEntries = journalEntries.filter(entry => {
    // Check if explicitly related to this slide
    if (entry.relatedSlideIds?.includes(slideId)) return true;
    if (entry.relatedSlideIds?.includes(`slide-${slideIndex}`)) return true;

    // For general entries (layout decisions, etc.), include them for any slide context
    const title = entry.title.toLowerCase();
    if (title.includes('layout') || title.includes('visual') || title.includes('content')) {
      return true;
    }

    return false;
  });

  // If no specific entries, show a helpful message
  if (relatedEntries.length === 0) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-bold text-white">Slide {slideIndex + 1} Insights</span>
            <button
              onClick={onClose}
              className="p-1 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 text-center">
            <Lightbulb className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm">
              No specific AI insights available for this slide.
            </p>
            <p className="text-white/40 text-xs mt-2">
              The Creative Director's Journal captures decisions at key moments during deck creation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#c5a47e]/20 rounded flex items-center justify-center">
              <Lightbulb className="w-3 h-3 text-[#c5a47e]" />
            </div>
            <span className="text-sm font-bold text-white">Slide {slideIndex + 1} Insights</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {relatedEntries.map((entry) => (
            <div key={entry.id} className="bg-black/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStageColor(entry.stage)}`}>
                  {getEntryIcon(entry)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${getStageColor(entry.stage).split(' ')[0]}`}>
                      {entry.stage}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">
                    {entry.title}
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {entry.narrative}
                  </p>

                  {/* Decision */}
                  {entry.decision && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-[10px] text-white/50">Decision:</span>
                      <span className="text-xs text-white font-medium">
                        {entry.decision}
                      </span>
                    </div>
                  )}

                  {/* Alternatives */}
                  {entry.alternatives && entry.alternatives.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] text-white/40">Also considered:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.alternatives.map((alt, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-white/40 px-2 py-0.5 bg-white/5 rounded"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confidence */}
                  {entry.confidence !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#c5a47e] rounded-full"
                          style={{ width: `${entry.confidence}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-white/40">{entry.confidence}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 flex-shrink-0 bg-black/30">
          <p className="text-[10px] text-white/40 text-center">
            These insights show how the AI approached this slide's design and content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlideJournalOverlay;
