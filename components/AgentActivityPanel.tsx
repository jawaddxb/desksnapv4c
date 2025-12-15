/**
 * AgentActivityPanel
 *
 * Story-driven panel showing agent reasoning during image generation.
 * Displays all slides with their processing status and generated thumbnails.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Brain,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  X,
  ImageIcon,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useAgentActivitySafe, SlideInfo } from '@/contexts/AgentActivityContext';
import { AgentLog, AGENT_TEAM, getAgentConfig } from '@/types/agents';
import { PromptValidationResult } from '@/services/agents/types';

// Agent color constants from the team
const NOVA_COLOR = getAgentConfig('nova')?.color || '#A78BFA';  // Purple - Visual Designer
const SAGE_COLOR = getAgentConfig('sage')?.color || '#6B8E6B';  // Green - Design Architect

export interface AgentActivityPanelProps {
  className?: string;
}

// Slide processing status
type SlideStatus = 'pending' | 'validating' | 'rewriting' | 'generating' | 'complete' | 'error';

interface SlideState {
  index: number;
  title: string;
  status: SlideStatus;
  statusText: string;
  validationScore?: number;
  wasRewritten?: boolean;
  approvedPrompt?: string;
  error?: string;
}

export function AgentActivityPanel({ className }: AgentActivityPanelProps) {
  const agentContext = useAgentActivitySafe();
  const [isDismissed, setIsDismissed] = useState(false);
  const [slideStates, setSlideStates] = useState<Map<number, SlideState>>(new Map());
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeSlideRef = useRef<HTMLDivElement>(null);

  // Get state from context
  const currentActivity = agentContext?.currentAgentActivity;
  const isAgentActive = agentContext?.isAgentActive ?? false;
  const totalSlides = agentContext?.agentTotalSlides ?? 0;
  const completedSlides = agentContext?.agentCompletedSlides ?? 0;
  const agentSlides = agentContext?.agentSlides ?? [];
  const generatedImages = agentContext?.generatedImages ?? new Map();

  // Initialize slide states when agent starts
  useEffect(() => {
    if (isAgentActive && agentSlides.length > 0) {
      setIsDismissed(false);
      const initialStates = new Map<number, SlideState>();
      agentSlides.forEach((slide) => {
        initialStates.set(slide.index, {
          index: slide.index,
          title: slide.title,
          status: 'pending',
          statusText: 'Waiting...',
        });
      });
      setSlideStates(initialStates);
    }
  }, [isAgentActive, agentSlides]);

  // Update slide states based on current activity
  useEffect(() => {
    if (!currentActivity) return;

    const slideIndex = currentActivity.slideIndex ?? 0;

    setSlideStates((prev) => {
      const next = new Map(prev);
      const current = next.get(slideIndex) || {
        index: slideIndex,
        title: agentSlides[slideIndex]?.title || `Slide ${slideIndex + 1}`,
        status: 'pending' as SlideStatus,
        statusText: 'Waiting...',
      };

      // Update based on action
      switch (currentActivity.action) {
        case 'extract_keywords':
          next.set(slideIndex, {
            ...current,
            status: 'validating',
            statusText: 'Analyzing topic...',
          });
          break;

        case 'validate':
          try {
            const result: PromptValidationResult = JSON.parse(currentActivity.output);
            next.set(slideIndex, {
              ...current,
              status: result.isValid ? 'generating' : 'rewriting',
              statusText: result.isValid
                ? `Validated (${result.score}/100)`
                : `Needs refinement (${result.score}/100)`,
              validationScore: result.score,
            });
          } catch {
            next.set(slideIndex, {
              ...current,
              status: 'validating',
              statusText: 'Validating prompt...',
            });
          }
          break;

        case 'rewrite':
          next.set(slideIndex, {
            ...current,
            status: 'rewriting',
            statusText: 'Refining prompt...',
            wasRewritten: true,
          });
          break;

        case 'finalize':
          next.set(slideIndex, {
            ...current,
            status: 'generating',
            statusText: 'Generating image...',
            approvedPrompt: currentActivity.output,
          });
          break;
      }

      return next;
    });
  }, [currentActivity, agentSlides]);

  // Mark slides as complete when images arrive
  useEffect(() => {
    if (generatedImages.size === 0) return;

    setSlideStates((prev) => {
      const next = new Map(prev);
      generatedImages.forEach((_, slideIndex) => {
        const current = next.get(slideIndex);
        if (current && current.status !== 'complete') {
          next.set(slideIndex, {
            ...current,
            status: 'complete',
            statusText: current.wasRewritten ? 'Refined & generated' : 'Generated',
          });
        }
      });
      return next;
    });
  }, [generatedImages]);

  // Auto-scroll to active slide
  useEffect(() => {
    if (activeSlideRef.current && scrollRef.current) {
      activeSlideRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentActivity?.slideIndex]);

  // Don't render if not active or dismissed
  if (!isAgentActive || isDismissed) return null;

  // Calculate progress percentage
  const progressPercent = totalSlides > 0
    ? Math.round((completedSlides / totalSlides) * 100)
    : 0;

  // Get current active slide index
  const activeSlideIndex = currentActivity?.slideIndex ?? -1;

  // Convert map to sorted array
  const sortedSlides = Array.from(slideStates.values()).sort((a, b) => a.index - b.index);

  return (
    <div
      className={`fixed top-20 right-4 z-[150] w-[420px] bg-black/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0" style={{ background: `linear-gradient(to right, ${NOVA_COLOR}15, transparent)` }}>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 animate-pulse" style={{ color: NOVA_COLOR }} />
          <span className="text-sm font-medium text-white">Agent Processing</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60">
            {completedSlides}/{totalSlides} complete
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 shrink-0">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(to right, ${NOVA_COLOR}, ${SAGE_COLOR})`
          }}
        />
      </div>

      {/* Slide timeline */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
      >
        {sortedSlides.length === 0 && (
          <div className="text-center text-white/40 text-sm py-8">
            <Sparkles className="w-6 h-6 mx-auto mb-2 animate-pulse" />
            Initializing agent...
          </div>
        )}

        {sortedSlides.map((slide) => (
          <SlideCard
            key={slide.index}
            ref={activeSlideIndex === slide.index ? activeSlideRef : null}
            slide={slide}
            imageUrl={generatedImages.get(slide.index)}
            isActive={activeSlideIndex === slide.index}
            currentActivity={activeSlideIndex === slide.index ? currentActivity : null}
          />
        ))}
      </div>
    </div>
  );
}

// Individual slide card component
interface SlideCardProps {
  slide: SlideState;
  imageUrl?: string;
  isActive: boolean;
  currentActivity: AgentLog | null;
}

const SlideCard = React.forwardRef<HTMLDivElement, SlideCardProps>(
  ({ slide, imageUrl, isActive, currentActivity }, ref) => {
    const getStatusIcon = () => {
      switch (slide.status) {
        case 'pending':
          return <Clock className="w-4 h-4 text-white/30" />;
        case 'validating':
        case 'rewriting':
        case 'generating':
          return <RefreshCw className="w-4 h-4 animate-spin" style={{ color: NOVA_COLOR }} />;
        case 'complete':
          return <CheckCircle className="w-4 h-4" style={{ color: SAGE_COLOR }} />;
        case 'error':
          return <AlertTriangle className="w-4 h-4 text-red-400" />;
      }
    };

    const getStatusBadge = () => {
      switch (slide.status) {
        case 'pending':
          return (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/40 uppercase tracking-wider">
              Pending
            </span>
          );
        case 'validating':
        case 'rewriting':
        case 'generating':
          return (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ backgroundColor: `${NOVA_COLOR}33`, color: NOVA_COLOR }}
            >
              {isActive ? 'Now' : 'Working'}
            </span>
          );
        case 'complete':
          return (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider"
              style={{ backgroundColor: `${SAGE_COLOR}33`, color: SAGE_COLOR }}
            >
              Done
            </span>
          );
        case 'error':
          return (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 uppercase tracking-wider">
              Error
            </span>
          );
      }
    };

    const getBorderStyle = () => {
      if (isActive) return { borderColor: `${NOVA_COLOR}80`, boxShadow: `0 0 0 1px ${NOVA_COLOR}4D` };
      if (slide.status === 'complete') return { borderColor: `${SAGE_COLOR}4D` };
      if (slide.status === 'error') return { borderColor: 'rgba(239, 68, 68, 0.3)' };
      return { borderColor: 'rgba(255, 255, 255, 0.1)' };
    };

    return (
      <div
        ref={ref}
        className="rounded-lg border bg-white/5 p-3 transition-all duration-300"
        style={getBorderStyle()}
      >
        {/* Main row: thumbnail + info + status */}
        <div className="flex gap-3">
          {/* Thumbnail area */}
          <div className="shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Slide ${slide.index + 1}`}
                className="w-16 h-12 object-cover rounded border border-white/10 transition-opacity duration-500"
              />
            ) : (
              <div className="w-16 h-12 bg-white/10 rounded border border-white/5 flex items-center justify-center">
                {slide.status === 'generating' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" style={{ color: NOVA_COLOR }} />
                ) : (
                  <ImageIcon className="w-4 h-4 text-white/20" />
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] text-white/40">Slide {slide.index + 1}</span>
              {getStatusBadge()}
            </div>
            <h4 className="text-sm font-medium text-white truncate">{slide.title}</h4>
            <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
              {getStatusIcon()}
              <span>{slide.statusText}</span>
            </p>
          </div>
        </div>

        {/* Expanded details for active slide */}
        {isActive && slide.status !== 'pending' && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
            {/* Validation score indicator */}
            {slide.validationScore !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Score:</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${slide.validationScore}%`,
                      backgroundColor: slide.validationScore >= 70 ? SAGE_COLOR : NOVA_COLOR
                    }}
                  />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: slide.validationScore >= 70 ? SAGE_COLOR : NOVA_COLOR }}
                >
                  {slide.validationScore}
                </span>
              </div>
            )}

            {/* Approved prompt preview */}
            {slide.approvedPrompt && (
              <div className="text-xs">
                <span className="text-white/40 block mb-1">Approved prompt:</span>
                <p
                  className="text-white/70 rounded p-2 line-clamp-3"
                  style={{ backgroundColor: `${SAGE_COLOR}1A`, border: `1px solid ${SAGE_COLOR}33` }}
                >
                  {slide.approvedPrompt}
                </p>
              </div>
            )}

            {/* Rewrite indicator */}
            {slide.wasRewritten && slide.status === 'generating' && (
              <p className="text-xs flex items-center gap-1" style={{ color: `${NOVA_COLOR}CC` }}>
                <Sparkles className="w-3 h-3" />
                Prompt was refined for better topic relevance
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

SlideCard.displayName = 'SlideCard';

export default AgentActivityPanel;
