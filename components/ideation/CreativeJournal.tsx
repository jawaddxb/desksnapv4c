/**
 * CreativeJournal
 *
 * Displays the AI's creative thinking process as an engaging narrative timeline.
 * Shows each decision point with explanations of what the AI considered and why.
 *
 * Variants:
 * - panel: Compact sidebar view for IdeationCopilot
 * - overlay: Modal-style popup
 * - full: Full page "Behind the Scenes" view
 */

import React, { useState } from 'react';
import { CreativeJournal as CreativeJournalType, JournalEntry, JournalStage } from '../../types/ideation';
import {
  BookOpen,
  Lightbulb,
  Search,
  GitBranch,
  Paintbrush,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Check,
  HelpCircle,
} from 'lucide-react';

interface CreativeJournalProps {
  journal: CreativeJournalType;
  variant: 'panel' | 'overlay' | 'full';
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

/**
 * Get icon and color for each stage
 */
function getStageConfig(stage: JournalStage): { icon: React.ReactNode; color: string; label: string } {
  switch (stage) {
    case 'analyzing':
      return {
        icon: <Search className="w-4 h-4" />,
        color: 'text-blue-400 bg-blue-500/20',
        label: 'Analyzing',
      };
    case 'exploring':
      return {
        icon: <Lightbulb className="w-4 h-4" />,
        color: 'text-amber-400 bg-amber-500/20',
        label: 'Exploring',
      };
    case 'deciding':
      return {
        icon: <GitBranch className="w-4 h-4" />,
        color: 'text-purple-400 bg-purple-500/20',
        label: 'Deciding',
      };
    case 'creating':
      return {
        icon: <Paintbrush className="w-4 h-4" />,
        color: 'text-green-400 bg-green-500/20',
        label: 'Creating',
      };
    case 'refining':
      return {
        icon: <Sparkles className="w-4 h-4" />,
        color: 'text-pink-400 bg-pink-500/20',
        label: 'Refining',
      };
    default:
      return {
        icon: <HelpCircle className="w-4 h-4" />,
        color: 'text-white/60 bg-white/10',
        label: stage,
      };
  }
}

/**
 * Single journal entry component
 */
const JournalEntryCard: React.FC<{
  entry: JournalEntry;
  variant: 'panel' | 'overlay' | 'full';
  isLast: boolean;
}> = ({ entry, variant, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(variant !== 'panel');
  const stageConfig = getStageConfig(entry.stage);

  const isCompact = variant === 'panel';

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[18px] top-10 bottom-0 w-[2px] bg-white/10" />
      )}

      <div
        className={`relative flex gap-3 ${isCompact ? 'cursor-pointer' : ''}`}
        onClick={isCompact ? () => setIsExpanded(!isExpanded) : undefined}
      >
        {/* Stage icon */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${stageConfig.color}`}
        >
          {stageConfig.icon}
        </div>

        {/* Content */}
        <div className="flex-1 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${stageConfig.color.replace('bg-', 'text-').split(' ')[0]}`}>
              {stageConfig.label}
            </span>
            <span className="text-[10px] text-white/30">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isCompact && (
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-white/40" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-white/40" />
                )}
              </span>
            )}
          </div>

          <h4 className={`font-medium text-white ${isCompact ? 'text-sm' : 'text-base'} mb-2`}>
            {entry.title}
          </h4>

          {(isExpanded || !isCompact) && (
            <>
              <p className={`text-white/70 ${isCompact ? 'text-xs' : 'text-sm'} leading-relaxed mb-3`}>
                {entry.narrative}
              </p>

              {/* Decision badge */}
              {entry.decision && (
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-white/60">Decision:</span>
                  <span className="text-xs text-white font-medium px-2 py-0.5 bg-white/10 rounded">
                    {entry.decision}
                  </span>
                </div>
              )}

              {/* Alternatives considered */}
              {entry.alternatives && entry.alternatives.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">Also considered:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.alternatives.map((alt, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-white/50 px-2 py-0.5 bg-white/5 rounded"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Confidence meter */}
              {entry.confidence !== undefined && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-white/40">Confidence:</span>
                  <div className="flex-1 max-w-[100px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c5a47e] rounded-full transition-all duration-300"
                      style={{ width: `${entry.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/50">{entry.confidence}%</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const CreativeJournal: React.FC<CreativeJournalProps> = ({
  journal,
  variant,
  isExpanded = true,
  onToggleExpand,
}) => {
  if (!journal.entries || journal.entries.length === 0) {
    return (
      <div className={`${variant === 'panel' ? 'p-4' : 'p-6'} text-center`}>
        <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
        <p className="text-sm text-white/40">No journal entries yet</p>
        <p className="text-xs text-white/30 mt-1">
          The AI will document its creative process as it works
        </p>
      </div>
    );
  }

  // Group entries by stage for progress indicator
  const stageProgress = {
    analyzing: journal.entries.some(e => e.stage === 'analyzing'),
    exploring: journal.entries.some(e => e.stage === 'exploring'),
    deciding: journal.entries.some(e => e.stage === 'deciding'),
    creating: journal.entries.some(e => e.stage === 'creating'),
    refining: journal.entries.some(e => e.stage === 'refining'),
  };

  return (
    <div className={variant === 'full' ? '' : ''}>
      {/* Header */}
      <div
        className={`flex items-center justify-between ${variant === 'panel' ? 'px-4 py-3' : 'px-6 py-4'} border-b border-white/10`}
        onClick={variant === 'panel' && onToggleExpand ? onToggleExpand : undefined}
        style={variant === 'panel' ? { cursor: 'pointer' } : undefined}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#c5a47e]" />
          <span className="text-sm font-bold text-white">Creative Director's Journal</span>
        </div>

        {variant === 'panel' && onToggleExpand && (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/40" />
          )
        )}
      </div>

      {isExpanded && (
        <>
          {/* Progress indicator (for full and overlay views) */}
          {variant !== 'panel' && (
            <div className="px-6 py-4 bg-black/30 border-b border-white/10">
              <div className="flex items-center justify-between">
                {Object.entries(stageProgress).map(([stage, completed], idx, arr) => (
                  <React.Fragment key={stage}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completed
                            ? getStageConfig(stage as JournalStage).color
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        {getStageConfig(stage as JournalStage).icon}
                      </div>
                      <span className={`text-[10px] mt-1 ${completed ? 'text-white/60' : 'text-white/30'}`}>
                        {getStageConfig(stage as JournalStage).label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex-1 h-[2px] bg-white/10 mx-2 mt-[-16px]">
                        <div
                          className="h-full bg-[#c5a47e] transition-all duration-500"
                          style={{ width: completed ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Journal entries timeline */}
          <div className={variant === 'panel' ? 'px-4 py-4' : 'px-6 py-6'}>
            {journal.entries.map((entry, idx) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                variant={variant}
                isLast={idx === journal.entries.length - 1}
              />
            ))}
          </div>

          {/* Summary */}
          {journal.summary && (
            <div className={`${variant === 'panel' ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
              <div className="p-4 bg-[#c5a47e]/10 border border-[#c5a47e]/30 rounded">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a47e] block mb-2">
                  Summary
                </span>
                <p className="text-sm text-white/80 leading-relaxed">{journal.summary}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreativeJournal;
