/**
 * ImageAgentDebugPanel
 *
 * Debug panel for inspecting the image prompt agent's reasoning.
 * Shows validation scores, issues, and prompt refinements for each slide.
 */

import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Eye,
  Sparkles,
} from 'lucide-react';
import { AgentLog } from '@/types/agents';

// ============ Types ============

interface SlideAgentCardProps {
  slideIndex: number;
  slideTitle?: string;
  logs: AgentLog[];
  onCopyPrompt?: (prompt: string) => void;
}

interface ImageAgentDebugPanelProps {
  presentationId?: string;
  presentationTopic?: string;
  agentLogs: AgentLog[];
  slideTitles?: string[];
  onRerunSlide?: (slideIndex: number) => void;
}

// ============ Helper Functions ============

function parseValidationResult(output: string): {
  score: number;
  issues: string[];
  suggestions: string[];
} | null {
  try {
    return JSON.parse(output);
  } catch {
    return null;
  }
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/20';
  if (score >= 60) return 'bg-amber-500/20';
  return 'bg-red-500/20';
}

// ============ Slide Agent Card ============

function SlideAgentCard({ slideIndex, slideTitle, logs, onCopyPrompt }: SlideAgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get summary info from logs
  const summary = useMemo(() => {
    const validateLogs = logs.filter((l) => l.action === 'validate');
    const rewriteLogs = logs.filter((l) => l.action === 'rewrite');
    const finalizeLogs = logs.filter((l) => l.action === 'finalize');

    const firstValidation = validateLogs[0];
    const lastValidation = validateLogs[validateLogs.length - 1];
    const finalPrompt = finalizeLogs[0]?.output || '';

    let initialScore = 0;
    let finalScore = 0;

    if (firstValidation) {
      const parsed = parseValidationResult(firstValidation.output);
      if (parsed) initialScore = parsed.score;
    }

    if (lastValidation) {
      const parsed = parseValidationResult(lastValidation.output);
      if (parsed) finalScore = parsed.score;
    }

    return {
      iterations: new Set(logs.map((l) => l.iteration)).size,
      wasRefined: rewriteLogs.length > 0,
      initialScore,
      finalScore,
      finalPrompt,
      totalDurationMs: logs.reduce((acc, l) => acc + (l.durationMs || 0), 0),
    };
  }, [logs]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopyPrompt?.(text);
  };

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-white/50" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/50" />
          )}
          <span className="font-medium">Slide {slideIndex + 1}</span>
          {slideTitle && (
            <span className="text-white/50 text-sm truncate max-w-[200px]">
              {slideTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Status badges */}
          {summary.wasRefined ? (
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Refined
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Passed
            </span>
          )}

          {/* Score */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-mono ${getScoreBgColor(
              summary.finalScore
            )} ${getScoreColor(summary.finalScore)}`}
          >
            {summary.finalScore}/100
          </span>

          {/* Iterations */}
          <span className="text-white/50 text-xs">
            {summary.iterations} iter{summary.iterations !== 1 ? 's' : ''}
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* Score Progression */}
          {summary.wasRefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/50">Score:</span>
              <span className={getScoreColor(summary.initialScore)}>{summary.initialScore}</span>
              <span className="text-white/30">→</span>
              <span className={getScoreColor(summary.finalScore)}>{summary.finalScore}</span>
              <span className="text-green-400">
                (+{summary.finalScore - summary.initialScore})
              </span>
            </div>
          )}

          {/* Log Timeline */}
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <LogEntry key={idx} log={log} onCopy={copyToClipboard} />
            ))}
          </div>

          {/* Final Prompt */}
          {summary.finalPrompt && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#c5a47e]">Final Prompt</span>
                <button
                  onClick={() => copyToClipboard(summary.finalPrompt)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Copy prompt"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-white/70 font-mono break-words">
                {summary.finalPrompt}
              </p>
            </div>
          )}

          {/* Timing */}
          <div className="text-xs text-white/40 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            {summary.totalDurationMs}ms total
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Log Entry ============

interface LogEntryProps {
  log: AgentLog;
  onCopy: (text: string) => void;
}

function LogEntry({ log, onCopy }: LogEntryProps) {
  const [showDetails, setShowDetails] = useState(false);

  const actionIcons = {
    validate: Eye,
    rewrite: Sparkles,
    finalize: CheckCircle,
    extract_keywords: Sparkles,
  };

  const actionColors = {
    validate: 'text-blue-400',
    rewrite: 'text-amber-400',
    finalize: 'text-green-400',
    extract_keywords: 'text-purple-400',
  };

  const actionLabels = {
    validate: 'Validate',
    rewrite: 'Rewrite',
    finalize: 'Finalize',
    extract_keywords: 'Extract Keywords',
  };

  const Icon = actionIcons[log.action];
  const color = actionColors[log.action];
  const label = actionLabels[log.action];

  // Parse validation result if applicable
  const validationResult =
    log.action === 'validate' ? parseValidationResult(log.output) : null;

  return (
    <div className="text-sm">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-start gap-2 text-left"
      >
        <div className={`mt-0.5 ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${color}`}>{label}</span>
            <span className="text-white/30 text-xs">iter {log.iteration}</span>
            {log.durationMs && (
              <span className="text-white/30 text-xs">{log.durationMs}ms</span>
            )}
          </div>

          {/* Validation score inline */}
          {validationResult && (
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${getScoreBgColor(
                  validationResult.score
                )} ${getScoreColor(validationResult.score)}`}
              >
                Score: {validationResult.score}
              </span>
              {validationResult.issues.length > 0 && (
                <span className="text-red-400/70 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationResult.issues.length} issue
                  {validationResult.issues.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Rewrite reasoning inline */}
          {log.action === 'rewrite' && log.reasoning && (
            <p className="text-white/50 text-xs mt-1 truncate">
              {log.reasoning}
            </p>
          )}
        </div>

        <ChevronRight
          className={`w-4 h-4 text-white/30 transition-transform ${
            showDetails ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Expanded Details */}
      {showDetails && (
        <div className="ml-6 mt-2 p-3 bg-white/5 rounded-lg space-y-3">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs mb-1">Input:</span>
              <button
                onClick={() => onCopy(log.input)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs font-mono text-white/70 break-words">
              {log.input.substring(0, 200)}
              {log.input.length > 200 && '...'}
            </p>
          </div>

          {/* Validation Issues */}
          {validationResult && validationResult.issues.length > 0 && (
            <div>
              <span className="text-white/50 text-xs mb-1 block">Issues:</span>
              <ul className="text-xs text-red-400/80 space-y-1">
                {validationResult.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validation Suggestions */}
          {validationResult && validationResult.suggestions.length > 0 && (
            <div>
              <span className="text-white/50 text-xs mb-1 block">Suggestions:</span>
              <ul className="text-xs text-blue-400/80 space-y-1">
                {validationResult.suggestions.map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Output */}
          {log.action === 'rewrite' && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs mb-1">Rewritten:</span>
                <button
                  onClick={() => onCopy(log.output)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <p className="text-xs font-mono text-green-400/80 break-words">
                {log.output}
              </p>
            </div>
          )}

          {/* Reasoning */}
          {log.reasoning && log.action !== 'rewrite' && (
            <div>
              <span className="text-white/50 text-xs mb-1 block">Reasoning:</span>
              <p className="text-xs text-white/70">{log.reasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Main Component ============

export function ImageAgentDebugPanel({
  presentationId,
  presentationTopic,
  agentLogs,
  slideTitles = [],
  onRerunSlide,
}: ImageAgentDebugPanelProps) {
  // Group logs by slide
  const slideGroups = useMemo(() => {
    const groups: Map<number, AgentLog[]> = new Map();

    agentLogs.forEach((log) => {
      if (log.slideIndex < 0) return; // Skip global logs
      const existing = groups.get(log.slideIndex) || [];
      groups.set(log.slideIndex, [...existing, log]);
    });

    return groups;
  }, [agentLogs]);

  // Get global logs (keyword extraction, etc.)
  const globalLogs = useMemo(
    () => agentLogs.filter((l) => l.slideIndex < 0),
    [agentLogs]
  );

  // Summary stats
  const stats = useMemo(() => {
    const slides = Array.from(slideGroups.values());
    const refinedCount = slides.filter((logs) =>
      logs.some((l) => l.action === 'rewrite')
    ).length;
    const totalDuration = agentLogs.reduce((acc, l) => acc + (l.durationMs || 0), 0);

    return {
      totalSlides: slideGroups.size,
      refinedSlides: refinedCount,
      passedSlides: slideGroups.size - refinedCount,
      totalDuration,
    };
  }, [slideGroups, agentLogs]);

  if (agentLogs.length === 0) {
    return (
      <div className="text-center py-12 text-white/50">
        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-2">No Agent Logs</h3>
        <p className="text-sm">
          Generate images for a presentation to see the agent's reasoning here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c5a47e]" />
          Image Agent Inspector
        </h2>
        {presentationTopic && (
          <p className="text-sm text-white/50 mt-1">Topic: {presentationTopic}</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#c5a47e]">{stats.totalSlides}</div>
          <div className="text-xs text-white/50">Slides</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.passedSlides}</div>
          <div className="text-xs text-white/50">Passed</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.refinedSlides}</div>
          <div className="text-xs text-white/50">Refined</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white/70">
            {(stats.totalDuration / 1000).toFixed(1)}s
          </div>
          <div className="text-xs text-white/50">Duration</div>
        </div>
      </div>

      {/* Global Logs (Keywords) */}
      {globalLogs.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2 text-purple-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Topic Keywords
          </h3>
          {globalLogs.map((log, idx) => {
            if (log.action === 'extract_keywords') {
              try {
                const keywords = JSON.parse(log.output);
                return (
                  <div key={idx} className="text-sm space-y-2">
                    <div>
                      <span className="text-white/50">Keywords:</span>{' '}
                      <span className="text-white/80">
                        {keywords.keywords?.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">Visual Subjects:</span>{' '}
                      <span className="text-white/80">
                        {keywords.visualSubjects?.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">Avoid:</span>{' '}
                      <span className="text-red-400/70">
                        {keywords.avoidTerms?.join(', ')}
                      </span>
                    </div>
                  </div>
                );
              } catch {
                return null;
              }
            }
            return null;
          })}
        </div>
      )}

      {/* Slide Cards */}
      <div className="space-y-3">
        {Array.from(slideGroups.entries())
          .sort(([a], [b]) => a - b)
          .map(([slideIndex, logs]) => (
            <SlideAgentCard
              key={slideIndex}
              slideIndex={slideIndex}
              slideTitle={slideTitles[slideIndex]}
              logs={logs}
            />
          ))}
      </div>
    </div>
  );
}

export default ImageAgentDebugPanel;
