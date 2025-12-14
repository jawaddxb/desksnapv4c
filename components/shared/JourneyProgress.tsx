import React from 'react';
import { Check, ChevronRight, Lightbulb, FileEdit, FileText, ArrowRight } from 'lucide-react';

export type JourneyStage = 'ideation' | 'rough-draft' | 'final-deck';

interface JourneyProgressProps {
  currentStage: JourneyStage;
  onNavigateToStage?: (stage: JourneyStage) => void;
  /** Optional: Show a compact version */
  compact?: boolean;
  /** Optional: Show the next action prompt */
  showNextAction?: boolean;
  onNextAction?: () => void;
  nextActionLabel?: string;
}

const stages: { id: JourneyStage; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'ideation', label: 'Ideation', icon: Lightbulb },
  { id: 'rough-draft', label: 'Draft', icon: FileEdit },
  { id: 'final-deck', label: 'Final', icon: FileText },
];

/**
 * JourneyProgress - Shows the unified linear flow:
 * Ideation → Rough Draft → Final Deck
 *
 * Provides visual context for where the user is in their creation journey
 */
export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentStage,
  onNavigateToStage,
  compact = false,
  showNextAction = false,
  onNextAction,
  nextActionLabel,
}) => {
  const currentIndex = stages.findIndex(s => s.id === currentStage);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = stage.id === currentStage;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onNavigateToStage?.(stage.id)}
                disabled={!onNavigateToStage}
                className={`
                  flex items-center gap-1.5 px-2 py-1 rounded transition-all duration-200
                  ${isCurrent
                    ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]'
                    : isCompleted
                      ? 'text-[#6B8E6B]/60 hover:text-[#6B8E6B] cursor-pointer'
                      : 'text-[#8FA58F]'
                  }
                  ${!onNavigateToStage ? 'cursor-default' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span className={isCurrent ? 'font-medium' : ''}>{stage.label}</span>
              </button>

              {index < stages.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#8FA58F]" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D4E5D4] rounded-lg p-4">
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-4">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = stage.id === currentStage;
          const isUpcoming = index > currentIndex;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              {/* Step */}
              <button
                onClick={() => onNavigateToStage?.(stage.id)}
                disabled={!onNavigateToStage || isUpcoming}
                className={`
                  flex flex-col items-center gap-2 transition-all duration-200
                  ${onNavigateToStage && !isUpcoming ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                {/* Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                    ${isCurrent
                      ? 'bg-[#6B8E6B] text-white'
                      : isCompleted
                        ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]'
                        : 'bg-[#EDF5F0] text-[#8FA58F]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    text-xs font-medium transition-colors duration-200
                    ${isCurrent
                      ? 'text-[#6B8E6B]'
                      : isCompleted
                        ? 'text-[#8FA58F]'
                        : 'text-[#8FA58F]'
                    }
                  `}
                >
                  {stage.label}
                </span>
              </button>

              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-0.5 bg-[#EDF5F0] rounded" />
                  <div
                    className="absolute top-0 left-0 h-0.5 bg-[#6B8E6B] rounded transition-all duration-500"
                    style={{
                      width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Next action prompt */}
      {showNextAction && onNextAction && nextActionLabel && currentIndex < stages.length - 1 && (
        <button
          onClick={onNextAction}
          className="w-full flex items-center justify-between p-3 bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 rounded-lg hover:bg-[#6B8E6B]/15 transition-colors duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6B8E6B]/20 rounded-full flex items-center justify-center">
              {React.createElement(stages[currentIndex + 1].icon, {
                className: 'w-4 h-4 text-[#6B8E6B]',
              })}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[#1E2E1E]">
                Next: {stages[currentIndex + 1].label}
              </p>
              <p className="text-xs text-[#8FA58F]">{nextActionLabel}</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#6B8E6B] transform group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};

/**
 * JourneyCompletionCard - Shows when a stage is complete
 * with a prompt to continue to the next stage
 */
interface JourneyCompletionCardProps {
  completedStage: JourneyStage;
  onContinue: () => void;
  onGoBack?: () => void;
  summary?: string;
}

export const JourneyCompletionCard: React.FC<JourneyCompletionCardProps> = ({
  completedStage,
  onContinue,
  onGoBack,
  summary,
}) => {
  const currentIndex = stages.findIndex(s => s.id === completedStage);
  const nextStage = stages[currentIndex + 1];
  const completedStageInfo = stages[currentIndex];

  if (!nextStage) return null;

  return (
    <div className="bg-gradient-to-br from-[#6B8E6B]/10 to-transparent border border-[#6B8E6B]/20 rounded-lg p-6">
      {/* Completion badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#6B8E6B] rounded-full flex items-center justify-center">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#6B8E6B]">
            {completedStageInfo.label} Complete
          </p>
          {summary && (
            <p className="text-xs text-[#8FA58F]">{summary}</p>
          )}
        </div>
      </div>

      {/* Next step card */}
      <div className="bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <nextStage.icon className="w-5 h-5 text-[#8FA58F]" />
          <p className="text-sm font-medium text-[#1E2E1E]">
            Next: {nextStage.label}
          </p>
        </div>
        <p className="text-xs text-[#8FA58F] leading-relaxed">
          {nextStage.id === 'rough-draft'
            ? 'AI will generate slides based on your ideas. You can review and refine them before finalizing.'
            : 'Polish your presentation with the final theme, typography, and layout settings.'
          }
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="flex-1 py-2.5 text-sm text-[#8FA58F] hover:text-[#1E2E1E] border border-[#D4E5D4] rounded transition-colors"
          >
            Back to {completedStageInfo.label}
          </button>
        )}
        <button
          onClick={onContinue}
          className="flex-1 py-2.5 text-sm bg-[#6B8E6B] text-white font-medium rounded hover:bg-[#5A7A5A] transition-colors flex items-center justify-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
