/**
 * AgentNarrativePanel Component
 *
 * Side panel showing real-time agent activity and narrative journal entries.
 * Provides insight into the AI's decision-making process.
 */

import React, { useRef, useEffect, useState } from 'react';
import { JournalEntry, JournalStage } from '../../types/ideation';
import { AgentLog } from '../../services/agents/types';

interface AgentNarrativePanelProps {
  entries: JournalEntry[];
  logs: AgentLog[];
  currentPhase: string;
  currentSlideIndex: number;
  totalSlides: number;
  onClose: () => void;
}

// Stage color mapping - Studio Noir palette (gold + white only)
const STAGE_COLORS: Record<JournalStage, { bg: string; text: string; icon: string }> = {
  analyzing: { bg: 'bg-white/10', text: 'text-white/70', icon: 'search' },
  exploring: { bg: 'bg-white/10', text: 'text-white/70', icon: 'explore' },
  deciding: { bg: 'bg-[#c5a47e]/10', text: 'text-[#c5a47e]/80', icon: 'lightbulb' },
  creating: { bg: 'bg-[#c5a47e]/20', text: 'text-[#c5a47e]', icon: 'create' },
  refining: { bg: 'bg-[#c5a47e]/20', text: 'text-[#c5a47e]', icon: 'tune' },
};

// Icons for different stages
const StageIcon: React.FC<{ stage: JournalStage; className?: string }> = ({ stage, className = '' }) => {
  const icons: Record<JournalStage, JSX.Element> = {
    analyzing: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    exploring: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z"/>
      </svg>
    ),
    deciding: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
      </svg>
    ),
    creating: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    ),
    refining: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
      </svg>
    ),
  };
  return icons[stage];
};

export const AgentNarrativePanel: React.FC<AgentNarrativePanelProps> = ({
  entries,
  logs,
  currentPhase,
  currentSlideIndex,
  totalSlides,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'narrative' | 'logs'>('narrative');
  const entriesEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (activeTab === 'narrative') {
      entriesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries, logs, activeTab]);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="w-80 flex-shrink-0 bg-[#111111] border-l border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-black">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
          </svg>
          <span className="font-bold text-white text-sm uppercase tracking-wide">Agent Activity</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-white/5 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      {/* Progress indicator */}
      {currentPhase !== 'complete' && totalSlides > 0 && (
        <div className="px-4 py-2 bg-[#c5a47e]/10 border-b border-[#c5a47e]/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c5a47e] uppercase tracking-wider font-bold">
              {currentSlideIndex >= 0 ? `Slide ${currentSlideIndex + 1} of ${totalSlides}` : 'Processing...'}
            </span>
            <span className="text-white/50">{currentPhase.replace(/-/g, ' ')}</span>
          </div>
        </div>
      )}

      {/* Tab bar with animated indicator */}
      <div className="flex border-b border-white/10 bg-black/50 relative">
        {/* Animated tab indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-[#c5a47e] transition-all duration-200 ease-out"
          style={{
            left: activeTab === 'narrative' ? '0%' : '50%',
            width: '50%'
          }}
        />
        <button
          onClick={() => setActiveTab('narrative')}
          className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            activeTab === 'narrative'
              ? 'text-[#c5a47e]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Narrative
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            activeTab === 'logs'
              ? 'text-[#c5a47e]'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Logs ({logs.length})
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'narrative' ? (
          <div className="p-4 space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 border border-white/10 flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                  </svg>
                </div>
                <p className="text-xs text-white/40 uppercase tracking-wider">Waiting for agent...</p>
              </div>
            ) : (
              entries.map((entry, index) => {
                const stageStyle = STAGE_COLORS[entry.stage];
                return (
                  <div
                    key={entry.id}
                    className="relative"
                    style={{
                      animation: 'fadeInUp 0.3s ease-out forwards',
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                    }}
                  >
                    {/* Stage badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 ${stageStyle.bg} mb-2`}>
                      <StageIcon stage={entry.stage} className={`w-3 h-3 ${stageStyle.text}`} />
                      <span className={`text-[10px] uppercase tracking-wider font-bold ${stageStyle.text}`}>
                        {entry.stage}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-white text-sm mb-1">{entry.title}</h4>

                    {/* Narrative */}
                    <p className="text-xs text-white/70 leading-relaxed mb-2">{entry.narrative}</p>

                    {/* Decision */}
                    {entry.decision && (
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-[#c5a47e] font-bold uppercase tracking-wider">Decision:</span>
                        <span className="text-white/60">{entry.decision}</span>
                      </div>
                    )}

                    {/* Confidence - enhanced with gradient */}
                    {entry.confidence !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#c5a47e]/70 to-[#c5a47e] rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${entry.confidence}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 font-bold">{entry.confidence}%</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-[10px] text-white/30 mt-2">{formatTime(entry.timestamp)}</p>
                  </div>
                );
              })
            )}
            <div ref={entriesEndRef} />
          </div>
        ) : (
          <div className="p-4 space-y-2 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/40">No logs yet...</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="p-2.5 bg-white/5 border border-white/10 hover:border-white/20 transition-colors duration-200"
                  style={{
                    animation: 'fadeInUp 0.2s ease-out forwards',
                    animationDelay: `${index * 30}ms`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${
                      log.action === 'validate' ? 'text-white/60' :
                      log.action === 'rewrite' ? 'text-[#c5a47e]/80' :
                      log.action === 'finalize' ? 'text-[#c5a47e]' :
                      'text-white/50'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-white/30">
                      Slide {log.slideIndex + 1}
                    </span>
                  </div>
                  {log.reasoning && (
                    <p className="text-white/60 line-clamp-2">{log.reasoning}</p>
                  )}
                  {log.durationMs && (
                    <p className="text-white/30 mt-1">{log.durationMs}ms</p>
                  )}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentNarrativePanel;
