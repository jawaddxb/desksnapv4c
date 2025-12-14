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
import { CreativeJournal as CreativeJournalType, JournalEntry, JournalStage } from '@/types/ideation';
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
        color: 'text-blue-600 bg-blue-100',
        label: 'Analyzing',
      };
    case 'exploring':
      return {
        icon: <Lightbulb className="w-4 h-4" />,
        color: 'text-amber-600 bg-amber-100',
        label: 'Exploring',
      };
    case 'deciding':
      return {
        icon: <GitBranch className="w-4 h-4" />,
        color: 'text-purple-600 bg-purple-100',
        label: 'Deciding',
      };
    case 'creating':
      return {
        icon: <Paintbrush className="w-4 h-4" />,
        color: 'text-green-600 bg-green-100',
        label: 'Creating',
      };
    case 'refining':
      return {
        icon: <Sparkles className="w-4 h-4" />,
        color: 'text-pink-600 bg-pink-100',
        label: 'Refining',
      };
    default:
      return {
        icon: <HelpCircle className="w-4 h-4" />,
        color: 'text-[#8FA58F] bg-[#EDF5F0]',
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
        <div className="absolute left-[18px] top-10 bottom-0 w-[2px] bg-[#D4E5D4]" />
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
            <span className="text-[10px] text-[#8FA58F]">
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isCompact && (
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-[#8FA58F]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#8FA58F]" />
                )}
              </span>
            )}
          </div>

          <h4 className={`font-medium text-[#1E2E1E] ${isCompact ? 'text-sm' : 'text-base'} mb-2`}>
            {entry.title}
          </h4>

          {(isExpanded || !isCompact) && (
            <>
              <p className={`text-[#1E2E1E] opacity-70 ${isCompact ? 'text-xs' : 'text-sm'} leading-relaxed mb-3`}>
                {entry.narrative}
              </p>

              {/* Decision badge */}
              {entry.decision && (
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-[#8FA58F]">Decision:</span>
                  <span className="text-xs text-[#1E2E1E] font-medium px-2 py-0.5 bg-[#EDF5F0] rounded">
                    {entry.decision}
                  </span>
                </div>
              )}

              {/* Alternatives considered */}
              {entry.alternatives && entry.alternatives.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] text-[#8FA58F] uppercase tracking-widest">Also considered:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.alternatives.map((alt, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-[#8FA58F] px-2 py-0.5 bg-[#F5FAF7] rounded"
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
                  <span className="text-[10px] text-[#8FA58F]">Confidence:</span>
                  <div className="flex-1 max-w-[100px] h-1.5 bg-[#D4E5D4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#6B8E6B] rounded-full transition-all duration-300"
                      style={{ width: `${entry.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8FA58F]">{entry.confidence}%</span>
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
        <BookOpen className="w-8 h-8 text-[#D4E5D4] mx-auto mb-3" />
        <p className="text-sm text-[#8FA58F]">No journal entries yet</p>
        <p className="text-xs text-[#8FA58F] mt-1">
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
        className={`flex items-center justify-between ${variant === 'panel' ? 'px-4 py-3' : 'px-6 py-4'} border-b border-[#D4E5D4]`}
        onClick={variant === 'panel' && onToggleExpand ? onToggleExpand : undefined}
        style={variant === 'panel' ? { cursor: 'pointer' } : undefined}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#6B8E6B]" />
          <span className="text-sm font-bold text-[#1E2E1E]">Creative Director's Journal</span>
        </div>

        {variant === 'panel' && onToggleExpand && (
          isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[#8FA58F]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#8FA58F]" />
          )
        )}
      </div>

      {isExpanded && (
        <>
          {/* Progress indicator (for full and overlay views) */}
          {variant !== 'panel' && (
            <div className="px-6 py-4 bg-[#EDF5F0] border-b border-[#D4E5D4]">
              <div className="flex items-center justify-between">
                {Object.entries(stageProgress).map(([stage, completed], idx, arr) => (
                  <React.Fragment key={stage}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completed
                            ? getStageConfig(stage as JournalStage).color
                            : 'bg-[#F5FAF7] text-[#8FA58F]'
                        }`}
                      >
                        {getStageConfig(stage as JournalStage).icon}
                      </div>
                      <span className={`text-[10px] mt-1 ${completed ? 'text-[#1E2E1E]' : 'text-[#8FA58F]'}`}>
                        {getStageConfig(stage as JournalStage).label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex-1 h-[2px] bg-[#D4E5D4] mx-2 mt-[-16px]">
                        <div
                          className="h-full bg-[#6B8E6B] transition-all duration-500"
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
              <div className="p-4 bg-[#EDF5F0] border border-[#6B8E6B] rounded">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B8E6B] block mb-2">
                  Summary
                </span>
                <p className="text-sm text-[#1E2E1E] leading-relaxed">{journal.summary}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreativeJournal;
