/**
 * EnhancedModePanel Component
 *
 * Premium overlay for the Research Co-Pilot feature.
 * Provides humanized conversation flow with visual feedback:
 * - Intro step: Welcome and explain value
 * - Preferences step: Select research types
 * - Researching step: Show progress and discoveries
 * - Results step: Synthesis and mind map
 */

import React, { useState, useCallback } from 'react';
import type {
  ResearchPreferences,
  ProgressState,
  Finding,
  EnhancedModeStep,
} from '../../types';
import { ResearchProgress } from './ResearchProgress';
import { ResearchMindMap } from './ResearchMindMap';

interface EnhancedModePanelProps {
  isActive: boolean;
  topic: string;
  onResearch: (preferences: ResearchPreferences) => void;
  onCreateNotes: (findings: Finding[]) => void;
  onClose: () => void;
  onExpandModal?: () => void;
  findings: Finding[];
  progress: ProgressState | null;
  synthesis?: string;
  isPremium?: boolean;
}

// Intro step - humanized welcome
const IntroStep: React.FC<{
  topic: string;
  onContinue: () => void;
}> = ({ topic, onContinue }) => (
  <div className="space-y-4 animate-fadeIn">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl">🔬</span>
      <div>
        <h3 className="text-white font-medium">Research Co-Pilot</h3>
        <span className="text-xs text-[#c5a47e]">Enhanced Research Mode</span>
      </div>
    </div>

    <p className="text-white/80">
      I'd love to help you research{' '}
      <span className="text-[#c5a47e] font-medium">"{topic}"</span>.
    </p>

    <p className="text-white/60 text-sm">
      I'll search the web and X/Twitter to find compelling evidence for your
      presentation. Let me ask a few questions to make sure I find exactly what
      you need.
    </p>

    <div className="pt-4">
      <button
        onClick={onContinue}
        className="w-full px-4 py-3 bg-[#c5a47e] text-black rounded-lg
                   font-medium hover:bg-[#b8956e] transition-colors
                   flex items-center justify-center gap-2"
      >
        Let's get started
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 17l5-5-5-5v10z" />
        </svg>
      </button>
    </div>

    <p className="text-xs text-white/30 text-center">
      Powered by Grok AI with real-time web & X/Twitter search
    </p>
  </div>
);

// Preferences step - select research types
const PreferencesStep: React.FC<{
  onSubmit: (prefs: ResearchPreferences) => void;
  onBack: () => void;
}> = ({ onSubmit, onBack }) => {
  const [selected, setSelected] = useState<string[]>(['stats', 'trends']);

  const options = [
    {
      id: 'stats',
      label: '📊 Market Statistics',
      desc: 'Size, growth rates, projections',
    },
    {
      id: 'trends',
      label: '🔥 Trends & Buzz',
      desc: 'What people are saying on X',
    },
    {
      id: 'competitors',
      label: '🏢 Competitors',
      desc: 'Key players in the space',
    },
    {
      id: 'experts',
      label: '💬 Expert Opinions',
      desc: 'Quotes and case studies',
    },
  ];

  const handleToggle = (id: string) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      includeStats: selected.includes('stats'),
      includeXSearch: selected.includes('trends'),
      includeCompetitors: selected.includes('competitors'),
      includeExperts: selected.includes('experts'),
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
        Back
      </button>

      <p className="text-white/80">
        What type of evidence would be most compelling for your audience?
      </p>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleToggle(opt.id)}
            className={`p-3 rounded-lg text-left transition-all ${
              selected.includes(opt.id)
                ? 'bg-[#c5a47e] text-black'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            <div className="font-medium text-sm">{opt.label}</div>
            <div
              className={`text-xs ${
                selected.includes(opt.id) ? 'text-black/70' : 'text-white/50'
              }`}
            >
              {opt.desc}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="w-full px-4 py-3 bg-[#c5a47e] text-black rounded-lg
                   font-medium hover:bg-[#b8956e] transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        Start Research
      </button>
    </div>
  );
};

// Researching step - show progress
const ResearchingStep: React.FC<{
  progress: ProgressState | null;
  findings: Finding[];
}> = ({ progress, findings }) => (
  <div className="space-y-4 animate-fadeIn">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">🔬</span>
      <span className="text-white font-medium">Researching...</span>
    </div>
    <ResearchProgress progress={progress} findings={findings} />
  </div>
);

// Results step - synthesis and actions
const ResultsStep: React.FC<{
  findings: Finding[];
  topic: string;
  synthesis?: string;
  onCreateNotes: (findings: Finding[]) => void;
  onResearchMore: () => void;
  onExpandModal?: () => void;
}> = ({ findings, topic, synthesis, onCreateNotes, onResearchMore, onExpandModal }) => {
  const [selectedFindings, setSelectedFindings] = useState<Set<string>>(
    new Set(findings.map((f) => f.id))
  );

  const toggleFinding = (id: string) => {
    setSelectedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreateNotes = () => {
    const selected = findings.filter((f) => selectedFindings.has(f.id));
    onCreateNotes(selected);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Research complete header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span className="font-medium">Research Complete</span>
        </div>
        {onExpandModal && findings.length > 0 && (
          <button
            onClick={onExpandModal}
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#c5a47e] hover:bg-white/10 rounded transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z" />
            </svg>
            Expand
          </button>
        )}
      </div>

      {/* Synthesis */}
      {synthesis && (
        <div className="p-3 bg-white/5 rounded-lg">
          <p className="text-white/80 text-sm leading-relaxed">
            {synthesis.slice(0, 300)}
            {synthesis.length > 300 ? '...' : ''}
          </p>
        </div>
      )}

      {/* Mind map */}
      <div className="mt-4">
        <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Research Map
        </h4>
        <ResearchMindMap
          findings={findings}
          topic={topic}
          onNodeClick={(finding) => toggleFinding(finding.id)}
        />
      </div>

      {/* Findings list with checkboxes */}
      <div className="mt-4">
        <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Select findings to add as notes ({selectedFindings.size}/{findings.length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {findings.map((finding) => (
            <label
              key={finding.id}
              className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedFindings.has(finding.id)
                  ? 'bg-[#c5a47e]/20'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFindings.has(finding.id)}
                onChange={() => toggleFinding(finding.id)}
                className="mt-1 accent-[#c5a47e]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span>{finding.icon}</span>
                  <span className="text-[#c5a47e] text-xs capitalize">
                    {finding.type}
                  </span>
                </div>
                <p className="text-white/80 text-sm line-clamp-2">
                  {finding.summary}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleCreateNotes}
          disabled={selectedFindings.size === 0}
          className="flex-1 px-4 py-2 bg-[#c5a47e] text-black rounded-lg
                     font-medium hover:bg-[#b8956e] transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" />
          </svg>
          Create Notes
        </button>
        <button
          onClick={onResearchMore}
          className="px-4 py-2 bg-white/10 text-white rounded-lg
                     hover:bg-white/20 transition-colors"
        >
          Research More
        </button>
      </div>
    </div>
  );
};

export const EnhancedModePanel: React.FC<EnhancedModePanelProps> = ({
  isActive,
  topic,
  onResearch,
  onCreateNotes,
  onClose,
  onExpandModal,
  findings,
  progress,
  synthesis,
  isPremium = true,
}) => {
  const [step, setStep] = useState<EnhancedModeStep>('intro');

  const handleResearch = useCallback(
    (prefs: ResearchPreferences) => {
      setStep('researching');
      onResearch(prefs);
    },
    [onResearch]
  );

  // Auto-transition to results when research is complete
  React.useEffect(() => {
    if (step === 'researching' && progress?.percent === 100) {
      // Small delay for visual feedback
      const timer = setTimeout(() => setStep('results'), 500);
      return () => clearTimeout(timer);
    }
  }, [step, progress?.percent]);

  const handleResearchMore = useCallback(() => {
    setStep('preferences');
  }, []);

  if (!isActive) return null;

  // Premium gate
  if (!isPremium) {
    return (
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔬</span>
            <span className="font-medium text-white">Research Co-Pilot</span>
            <span className="px-2 py-0.5 bg-[#c5a47e] text-black text-xs rounded-full">
              Pro
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-4 border-2 border-[#c5a47e] rounded-full flex items-center justify-center">
            <span className="text-4xl">🔬</span>
          </div>
          <h3 className="text-white font-medium mb-2">
            Upgrade to Pro for Enhanced Research
          </h3>
          <p className="text-white/60 text-sm mb-4 max-w-xs">
            Get real-time web search, X/Twitter trends, and AI-powered research
            synthesis with citations.
          </p>
          <button className="px-6 py-2 bg-[#c5a47e] text-black rounded-lg font-medium hover:bg-[#b8956e]">
            Upgrade to Pro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔬</span>
          <span className="font-medium text-white">Research Co-Pilot</span>
          <span className="px-2 py-0.5 bg-[#c5a47e] text-black text-xs rounded-full">
            Pro
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 'intro' && (
          <IntroStep
            topic={topic}
            onContinue={() => setStep('preferences')}
          />
        )}

        {step === 'preferences' && (
          <PreferencesStep
            onSubmit={handleResearch}
            onBack={() => setStep('intro')}
          />
        )}

        {step === 'researching' && (
          <ResearchingStep progress={progress} findings={findings} />
        )}

        {step === 'results' && (
          <ResultsStep
            findings={findings}
            topic={topic}
            synthesis={synthesis}
            onCreateNotes={onCreateNotes}
            onResearchMore={handleResearchMore}
            onExpandModal={onExpandModal}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedModePanel;
