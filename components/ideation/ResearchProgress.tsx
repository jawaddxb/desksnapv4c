/**
 * ResearchProgress Component
 *
 * Displays real-time progress of research with animated discoveries.
 * Shows progress bar, step indicators, and live finding cards.
 */

import React from 'react';
import type { ProgressState, Finding } from '@/types';

interface ResearchProgressProps {
  progress: ProgressState | null;
  findings: Finding[];
}

export const ResearchProgress: React.FC<ResearchProgressProps> = ({
  progress,
  findings,
}) => {
  if (!progress) return null;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#1E2E1E] opacity-70">{progress.status}</span>
          <span className="text-[#6B8E6B]">{progress.percent}%</span>
        </div>
        <div className="h-2 bg-[#D4E5D4] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6B8E6B] to-[#5A7A5A] transition-all duration-500 ease-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="space-y-1">
        {progress.steps.map((step) => (
          <div key={step.id} className="flex items-center gap-2 text-sm">
            <span
              className={
                step.done
                  ? 'text-green-600'
                  : step.active
                  ? 'text-[#6B8E6B]'
                  : 'text-[#8FA58F]'
              }
            >
              {step.done ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              ) : step.active ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="4" />
                </svg>
              )}
            </span>
            <span
              className={
                step.done
                  ? 'text-[#1E2E1E] opacity-70'
                  : step.active
                  ? 'text-[#1E2E1E]'
                  : 'text-[#8FA58F]'
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Live discoveries */}
      {findings.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-xs uppercase tracking-wider text-[#8FA58F]">Discoveries</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {findings.map((finding, index) => (
              <div
                key={finding.id}
                className="p-3 bg-[#F5FAF7] rounded-lg animate-fadeIn border border-[#D4E5D4]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{finding.icon}</span>
                  <span className="text-[#6B8E6B] text-sm font-medium capitalize">
                    {finding.type}
                  </span>
                  {finding.citation.reliability && (
                    <span className="ml-auto text-xs text-[#8FA58F]">
                      {'★'.repeat(finding.citation.reliability)}
                      {'☆'.repeat(5 - finding.citation.reliability)}
                    </span>
                  )}
                </div>
                <p className="text-[#1E2E1E] opacity-80 text-sm line-clamp-2">{finding.summary}</p>
                {finding.metrics && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-[#6B8E6B]">
                      {finding.metrics.value}
                    </span>
                    <span className="text-xs text-[#8FA58F]">{finding.metrics.label}</span>
                    {finding.metrics.change && (
                      <span
                        className={`text-xs ${
                          finding.metrics.change.startsWith('+')
                            ? 'text-green-600'
                            : finding.metrics.change.startsWith('-')
                            ? 'text-red-600'
                            : 'text-[#8FA58F]'
                        }`}
                      >
                        {finding.metrics.change}
                      </span>
                    )}
                  </div>
                )}
                {finding.citation.url && (
                  <a
                    href={finding.citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    {finding.citation.source} - {finding.citation.title.slice(0, 40)}
                    {finding.citation.title.length > 40 ? '...' : ''}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state while searching */}
      {findings.length === 0 && progress.percent > 0 && progress.percent < 100 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-[#8FA58F] text-sm">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Searching for relevant information...
          </div>
        </div>
      )}
    </div>
  );
};

// Add CSS animation for fade-in
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
if (typeof document !== 'undefined' && !document.querySelector('#research-progress-styles')) {
  style.id = 'research-progress-styles';
  document.head.appendChild(style);
}

export default ResearchProgress;
