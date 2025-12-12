import React from 'react';
import { Check, Plus, Lightbulb, Palette, Download, X, ArrowRight } from 'lucide-react';
import { OnboardingStep } from '../../hooks/useOnboarding';

interface GettingStartedProps {
  completedSteps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
  onDismiss: () => void;
}

interface ChecklistItem {
  id: OnboardingStep;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'create_deck',
    icon: <Plus className="w-4 h-4" />,
    title: 'Create your first deck',
    description: 'Start a new presentation with AI assistance',
  },
  {
    id: 'try_ideation',
    icon: <Lightbulb className="w-4 h-4" />,
    title: 'Try the AI Ideation flow',
    description: 'Brainstorm and structure your ideas',
  },
  {
    id: 'explore_themes',
    icon: <Palette className="w-4 h-4" />,
    title: 'Explore presentation themes',
    description: 'Discover 30+ beautiful visual styles',
  },
  {
    id: 'export_deck',
    icon: <Download className="w-4 h-4" />,
    title: 'Export and share a deck',
    description: 'Download your presentation',
  },
];

export const GettingStarted: React.FC<GettingStartedProps> = ({
  completedSteps,
  onStepClick,
  onDismiss,
}) => {
  const completedCount = completedSteps.length;
  const totalSteps = checklistItems.length;
  const progressPercent = (completedCount / totalSteps) * 100;
  const canDismiss = completedCount > 0;

  return (
    <div className="mb-8 bg-[#0a0a0a] border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Getting Started
          </h2>
          <span className="text-xs text-white/40">
            {completedCount} of {totalSteps} complete
          </span>
        </div>
        {canDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-white/30 hover:text-white/60 transition-colors duration-150"
            aria-label="Dismiss getting started"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5">
        <div
          className="h-full bg-[#c5a47e] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {checklistItems.map((item) => {
            const isCompleted = completedSteps.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => !isCompleted && onStepClick(item.id)}
                disabled={isCompleted}
                className={`group p-4 text-left transition-all duration-150 flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-[#c5a47e]/10 border border-[#c5a47e]/20 cursor-default'
                    : 'bg-black border border-white/10 hover:border-white/30 hover:bg-white/5 cursor-pointer'
                }`}
              >
                {/* Checkbox/Icon */}
                <div
                  className={`w-8 h-8 flex-shrink-0 flex items-center justify-center transition-all duration-150 ${
                    isCompleted
                      ? 'bg-[#c5a47e] text-black'
                      : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    item.icon
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-medium mb-0.5 transition-colors duration-150 ${
                      isCompleted
                        ? 'text-[#c5a47e] line-through'
                        : 'text-white group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs transition-colors duration-150 ${
                      isCompleted ? 'text-white/30' : 'text-white/40'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Arrow for incomplete items */}
                {!isCompleted && (
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/40 flex-shrink-0 mt-2 transition-colors duration-150" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
