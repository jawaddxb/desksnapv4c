/**
 * RoughDraftCanvas Component
 *
 * Main container for the rough draft review stage.
 * Runs the rough draft agent and displays slides as they are generated.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  runRoughDraftAgent,
  RoughDraftInput,
  RoughDraftSlide,
  RoughDraftResult,
  SlideContent,
  regenerateSlideWithAgent,
} from '../../services/agents/roughDraftAgent';
import { JournalEntry } from '../../types/ideation';
import { AgentLog } from '../../services/agents/types';
import { THEMES } from '../../config/themes';
import { RoughDraftSlideCard } from './RoughDraftSlideCard';
import { AgentNarrativePanel } from './AgentNarrativePanel';

interface RoughDraftCanvasProps {
  /** Input for the rough draft agent */
  input: RoughDraftInput;
  /** Source of the draft request */
  source: 'ideation' | 'copilot';
  /** Optional ideation session ID for back navigation */
  ideationSessionId?: string;
  /** Called when user approves the draft */
  onApprove: (result: RoughDraftResult) => void;
  /** Called when user goes back (to ideation or copilot) */
  onBack: () => void;
  /** Called when user discards the draft */
  onDiscard: () => void;
}

type GenerationPhase = 'initializing' | 'generating-content' | 'refining-prompts' | 'generating-images' | 'complete';

export const RoughDraftCanvas: React.FC<RoughDraftCanvasProps> = ({
  input,
  source,
  ideationSessionId,
  onApprove,
  onBack,
  onDiscard,
}) => {
  // Slides state
  const [slides, setSlides] = useState<RoughDraftSlide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);

  // Generation state
  const [phase, setPhase] = useState<GenerationPhase>('initializing');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(-1);
  const [totalSlides, setTotalSlides] = useState<number>(0);

  // Agent activity state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [isNarrativePanelOpen, setIsNarrativePanelOpen] = useState(true);

  // Result state
  const [result, setResult] = useState<RoughDraftResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Regeneration state
  const [regeneratingSlideId, setRegeneratingSlideId] = useState<string | null>(null);

  // Ref to prevent double execution in React Strict Mode
  const hasStartedRef = useRef(false);

  const theme = THEMES[input.themeId] || THEMES.executive;

  // Run the rough draft agent on mount
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const runAgent = async () => {
      try {
        setPhase('generating-content');

        const agentResult = await runRoughDraftAgent(input, {
          onContentGenerated: (index, content) => {
            // Add slide with content (no image yet)
            const newSlide: RoughDraftSlide = {
              ...content,
              id: `slide-${Date.now()}-${index}`,
              isImageLoading: true,
              approvalState: 'pending',
            };
            setSlides(prev => {
              const updated = [...prev];
              updated[index] = newSlide;
              return updated;
            });
            setTotalSlides(prev => Math.max(prev, index + 1));
          },

          onContentPhaseComplete: (slideContents) => {
            setTotalSlides(slideContents.length);
            setPhase('refining-prompts');
          },

          onImagePromptRefined: (index, prompt, wasRefined) => {
            setSlides(prev => prev.map((s, i) =>
              i === index ? { ...s, imagePrompt: prompt } : s
            ));
            if (wasRefined) {
              setAgentLogs(prev => [...prev, {
                slideIndex: index,
                iteration: 0,
                action: 'rewrite',
                input: '',
                output: prompt,
                reasoning: `Refined prompt for slide ${index + 1}`,
                timestamp: Date.now(),
              }]);
            }
          },

          onSlideStart: (index, total) => {
            setCurrentSlideIndex(index);
            setTotalSlides(total);
            if (phase !== 'generating-images') {
              setPhase('generating-images');
            }
          },

          onImageGenerated: (index, imageUrl) => {
            setSlides(prev => prev.map((s, i) =>
              i === index ? { ...s, imageUrl, isImageLoading: false } : s
            ));
          },

          onImageError: (index, errorMsg) => {
            setSlides(prev => prev.map((s, i) =>
              i === index ? { ...s, imageError: errorMsg, isImageLoading: false } : s
            ));
          },

          onSlideComplete: (index, slide) => {
            setSlides(prev => prev.map((s, i) =>
              i === index ? slide : s
            ));
          },

          onNarrativeEntry: (entry) => {
            setJournalEntries(prev => [...prev, entry]);
          },

          onLog: (log) => {
            setAgentLogs(prev => [...prev, log]);
          },

          onComplete: (finalResult) => {
            setResult(finalResult);
            setSlides(finalResult.slides);
            setPhase('complete');
          },
        });

        setResult(agentResult);
        setPhase('complete');
      } catch (err) {
        console.error('Rough draft agent error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate draft');
        setPhase('complete');
      }
    };

    runAgent();
  }, [input]);

  // Handle slide selection
  const handleSelectSlide = useCallback((slideId: string) => {
    setSelectedSlideId(prevId => prevId === slideId ? null : slideId);
  }, []);

  // Handle slide content update
  const handleUpdateSlide = useCallback((slideId: string, updates: Partial<RoughDraftSlide>) => {
    setSlides(prev => prev.map(s =>
      s.id === slideId ? { ...s, ...updates, approvalState: 'modified' } : s
    ));
  }, []);

  // Handle slide approval
  const handleApproveSlide = useCallback((slideId: string) => {
    setSlides(prev => prev.map(s =>
      s.id === slideId ? { ...s, approvalState: 'approved' } : s
    ));
  }, []);

  // Handle image regeneration for a single slide
  const handleRegenerateImage = useCallback(async (slideId: string) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setRegeneratingSlideId(slideId);
    setSlides(prev => prev.map(s =>
      s.id === slideId ? { ...s, isImageLoading: true, imageError: undefined } : s
    ));

    try {
      const updatedSlide = await regenerateSlideWithAgent(
        slide,
        input.topic,
        input.visualStyle,
        {
          onLog: (log) => setAgentLogs(prev => [...prev, log]),
          onImageGenerated: (imageUrl) => {
            setSlides(prev => prev.map(s =>
              s.id === slideId ? { ...s, imageUrl, isImageLoading: false, imageError: undefined } : s
            ));
          },
          onError: (errorMsg) => {
            setSlides(prev => prev.map(s =>
              s.id === slideId ? { ...s, imageError: errorMsg, isImageLoading: false } : s
            ));
          },
        }
      );

      setSlides(prev => prev.map(s =>
        s.id === slideId ? updatedSlide : s
      ));
    } catch (err) {
      console.error('Image regeneration error:', err);
      setSlides(prev => prev.map(s =>
        s.id === slideId ? {
          ...s,
          imageError: err instanceof Error ? err.message : 'Regeneration failed',
          isImageLoading: false,
        } : s
      ));
    } finally {
      setRegeneratingSlideId(null);
    }
  }, [slides, input.topic, input.visualStyle]);

  // Handle approve all
  const handleApproveAll = useCallback(() => {
    if (!result) return;

    // Update result with current slides
    const finalResult: RoughDraftResult = {
      ...result,
      slides: slides.map(s => ({ ...s, approvalState: 'approved' })),
    };

    onApprove(finalResult);
  }, [result, slides, onApprove]);

  // Calculate progress
  const completedSlides = slides.filter(s => !s.isImageLoading).length;
  const approvedSlides = slides.filter(s => s.approvalState === 'approved').length;
  const hasErrors = slides.some(s => s.imageError);

  // Phase label
  const getPhaseLabel = () => {
    switch (phase) {
      case 'initializing': return 'Initializing...';
      case 'generating-content': return 'Structuring slides...';
      case 'refining-prompts': return 'Refining image prompts...';
      case 'generating-images': return `Generating images (${completedSlides}/${totalSlides})...`;
      case 'complete': return hasErrors ? 'Draft ready (some images failed)' : 'Draft ready for review';
    }
  };

  return (
    <div className="flex h-screen w-full bg-black">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-white/60 hover:text-[#c5a47e] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
            {/* Icon container - matches ThemePreviewPanel */}
            <div className="w-8 h-8 border border-[#c5a47e] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white uppercase tracking-wide">{input.topic}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  {getPhaseLabel()}
                </span>
                {phase !== 'complete' && (
                  <div className="w-3 h-3 border border-[#c5a47e] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-white/50">
              <span>{slides.length} slides</span>
              {approvedSlides > 0 && (
                <span className="text-[#c5a47e]">{approvedSlides} approved</span>
              )}
            </div>

            {/* Narrative toggle */}
            <button
              onClick={() => setIsNarrativePanelOpen(!isNarrativePanelOpen)}
              className={`p-2 transition-colors ${
                isNarrativePanelOpen ? 'bg-[#c5a47e]/20 text-[#c5a47e]' : 'hover:bg-white/5 text-white/60'
              }`}
              title={isNarrativePanelOpen ? 'Hide agent activity' : 'Show agent activity'}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar - enhanced with gradient */}
        {phase !== 'complete' && totalSlides > 0 && (
          <div className="h-1.5 bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c5a47e] to-[#d4b896] transition-all duration-500 ease-out"
              style={{ width: `${(completedSlides / totalSlides) * 100}%` }}
            />
          </div>
        )}

        {/* Slide Grid */}
        <div className="flex-1 overflow-auto p-6">
          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 border border-red-500/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <p className="text-white mb-2 font-bold uppercase tracking-wide">Generation Failed</p>
                <p className="text-white/50 text-sm mb-4">{error}</p>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-[#c5a47e] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : slides.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border border-[#c5a47e] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#c5a47e]/10 to-transparent animate-pulse" />
                  <svg className="w-8 h-8 text-[#c5a47e] relative z-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <p className="text-white/60 uppercase tracking-widest text-sm font-bold">Generating slides...</p>
                <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">Preparing your presentation</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
              {slides.map((slide, index) => (
                <RoughDraftSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                  theme={theme}
                  isSelected={selectedSlideId === slide.id}
                  isRegenerating={regeneratingSlideId === slide.id}
                  onSelect={() => handleSelectSlide(slide.id)}
                  onUpdate={(updates) => handleUpdateSlide(slide.id, updates)}
                  onApprove={() => handleApproveSlide(slide.id)}
                  onRegenerateImage={() => handleRegenerateImage(slide.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="h-16 bg-black border-t border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onDiscard}
              className="px-4 py-2.5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-wider
                         hover:border-[#c5a47e]/50 hover:text-white transition-all duration-200"
            >
              Discard
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2.5 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-wider
                         hover:border-[#c5a47e]/50 hover:text-white transition-all duration-200"
            >
              Back to {source === 'ideation' ? 'Ideation' : 'Copilot'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {phase === 'complete' && (
              <button
                onClick={handleApproveAll}
                disabled={slides.length === 0}
                className="px-6 py-2 bg-[#c5a47e] text-black font-bold text-xs uppercase tracking-wider
                           hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Approve & Build Deck
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Agent Narrative Panel */}
      {isNarrativePanelOpen && (
        <AgentNarrativePanel
          entries={journalEntries}
          logs={agentLogs}
          currentPhase={phase}
          currentSlideIndex={currentSlideIndex}
          totalSlides={totalSlides}
          onClose={() => setIsNarrativePanelOpen(false)}
        />
      )}
    </div>
  );
};

export default RoughDraftCanvas;
