/**
 * RoughDraftCanvas Component
 *
 * Main container for the rough draft review stage.
 * Runs the rough draft agent and displays slides as they are generated.
 * Persists rough drafts to the database for later retrieval.
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
import { THEMES, getTextModel } from '../../config';
import { RoughDraftSlideCard } from './RoughDraftSlideCard';
import { AgentNarrativePanel } from './AgentNarrativePanel';
import { getAIClient } from '../../services/aiClient';
import {
  createRoughDraft,
  updateRoughDraft,
  updateSlide as apiUpdateSlide,
  approveRoughDraft,
} from '../../services/api/roughDraftService';
import { RoughDraft } from '../../types/roughDraft';
import { useRoughDraft } from '../../hooks/queries/useRoughDraftQueries';

/**
 * Check if a string is a valid UUID (v4 format)
 */
function isValidUUID(str: string | undefined): boolean {
  if (!str) return false;
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

interface RoughDraftCanvasProps {
  /** Input for the rough draft agent (for generating new drafts) */
  input?: RoughDraftInput;
  /** ID of an existing draft to load (mutually exclusive with input) */
  existingDraftId?: string;
  /** Source of the draft request */
  source: 'ideation' | 'copilot' | 'existing';
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
  existingDraftId,
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

  // AI enhance state
  const [enhancingSlideId, setEnhancingSlideId] = useState<string | null>(null);

  // Database persistence state
  const [persistedDraft, setPersistedDraft] = useState<RoughDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to prevent double execution in React Strict Mode
  const hasStartedRef = useRef(false);

  // Fetch existing draft if existingDraftId is provided
  const { data: existingDraft, isLoading: isLoadingExisting } = useRoughDraft(
    existingDraftId || null
  );

  // Determine values from input or existing draft
  const themeId = input?.themeId || existingDraft?.themeId || 'executive';
  const theme = THEMES[themeId] || THEMES.executive;
  const topic = input?.topic || existingDraft?.topic || 'Presentation';
  const visualStyle = input?.visualStyle || existingDraft?.visualStyle || '';

  // Persist rough draft to database (only for newly generated drafts)
  const persistDraft = useCallback(async (finalSlides: RoughDraftSlide[]) => {
    // Only persist when generating new drafts, not when loading existing
    if (!input) return;

    try {
      setIsSaving(true);
      // Only pass ideationSessionId if it's a valid UUID (server-generated)
      // Client-generated IDs like "session-1234567890-abc12" will be rejected by the API
      const validSessionId = isValidUUID(ideationSessionId) ? ideationSessionId : undefined;

      if (ideationSessionId && !validSessionId) {
        console.warn('[RoughDraftCanvas] Invalid session ID format, skipping API link:', ideationSessionId);
      }

      const draft = await createRoughDraft({
        topic: topic,
        themeId: themeId,
        visualStyle: visualStyle || '',
        status: 'ready',
        ideationSessionId: validSessionId,
        slides: finalSlides.map((s, index) => ({
          position: index,
          title: s.title,
          content: s.content,
          speakerNotes: s.speakerNotes,
          imagePrompt: s.imagePrompt,
          imageUrl: s.imageUrl,
          layoutType: s.layoutType,
          alignment: s.alignment,
          approvalState: s.approvalState,
        })),
      });
      setPersistedDraft(draft);
      console.log('[RoughDraftCanvas] Draft persisted to database:', draft.id);
    } catch (err) {
      console.error('[RoughDraftCanvas] Failed to persist draft:', err);
      // Don't fail the whole operation - draft can still work locally
    } finally {
      setIsSaving(false);
    }
  }, [input, ideationSessionId]);

  // Debounced save for slide updates
  const debouncedSaveSlide = useCallback((slideId: string, updates: Partial<RoughDraftSlide>) => {
    if (!persistedDraft) return;

    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(async () => {
      const slideToUpdate = persistedDraft.slides.find(s => s.id === slideId);
      if (!slideToUpdate) return;

      try {
        setIsSaving(true);
        await apiUpdateSlide(persistedDraft.id, slideId, {
          title: updates.title,
          content: updates.content,
          speakerNotes: updates.speakerNotes,
          imagePrompt: updates.imagePrompt,
          imageUrl: updates.imageUrl,
          layoutType: updates.layoutType,
          alignment: updates.alignment,
          approvalState: updates.approvalState,
        });
        console.log('[RoughDraftCanvas] Slide saved:', slideId);
      } catch (err) {
        console.error('[RoughDraftCanvas] Failed to save slide:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);
  }, [persistedDraft]);

  // Load existing draft when existingDraftId is provided
  useEffect(() => {
    if (existingDraftId && existingDraft && !hasStartedRef.current) {
      hasStartedRef.current = true;
      // Populate state from existing draft
      const loadedSlides: RoughDraftSlide[] = existingDraft.slides.map(s => ({
        id: s.id,
        position: s.position,
        title: s.title,
        content: s.content,
        speakerNotes: s.speakerNotes || '',
        imagePrompt: s.imagePrompt || '',
        imageUrl: s.imageUrl || '',
        layoutType: s.layoutType || 'split-left',
        alignment: s.alignment || 'center',
        approvalState: s.approvalState || 'pending',
        isImageLoading: false,
      }));
      setSlides(loadedSlides);
      setPersistedDraft(existingDraft);
      setPhase('complete');
      setTotalSlides(loadedSlides.length);
      console.log('[RoughDraftCanvas] Loaded existing draft:', existingDraft.id);
    }
  }, [existingDraftId, existingDraft]);

  // Run the rough draft agent on mount (only for new drafts)
  useEffect(() => {
    // Skip if we're loading an existing draft or already started
    if (existingDraftId || !input || hasStartedRef.current) return;
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

          onComplete: async (finalResult) => {
            setResult(finalResult);
            setSlides(finalResult.slides);
            setPhase('complete');
            // Persist to database
            await persistDraft(finalResult.slides);
          },
        });

        setResult(agentResult);
        setPhase('complete');
        // Persist to database if not already done via onComplete
        if (!persistedDraft) {
          await persistDraft(agentResult.slides);
        }
      } catch (err) {
        console.error('Rough draft agent error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate draft');
        setPhase('complete');
      }
    };

    runAgent();
  }, [input, existingDraftId]);

  // Handle slide selection
  const handleSelectSlide = useCallback((slideId: string) => {
    setSelectedSlideId(prevId => prevId === slideId ? null : slideId);
  }, []);

  // Handle slide content update
  const handleUpdateSlide = useCallback((slideId: string, updates: Partial<RoughDraftSlide>) => {
    setSlides(prev => prev.map(s =>
      s.id === slideId ? { ...s, ...updates, approvalState: 'modified' } : s
    ));
    // Trigger debounced save to database
    debouncedSaveSlide(slideId, updates);
  }, [debouncedSaveSlide]);

  // Handle slide approval
  const handleApproveSlide = useCallback((slideId: string) => {
    setSlides(prev => prev.map(s =>
      s.id === slideId ? { ...s, approvalState: 'approved' } : s
    ));
    // Save the approval state to database
    debouncedSaveSlide(slideId, { approvalState: 'approved' });
  }, [debouncedSaveSlide]);

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
        topic,
        visualStyle,
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
  }, [slides, topic, visualStyle]);

  // Handle AI text enhancement
  const handleAIEnhance = useCallback(async (
    slideId: string,
    mode: 'research' | 'rewrite' | 'custom',
    customPrompt?: string
  ) => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    setEnhancingSlideId(slideId);

    try {
      const ai = getAIClient();

      // Build the enhancement prompt based on mode
      let systemPrompt = '';
      if (mode === 'research') {
        systemPrompt = `You are enhancing a presentation slide about "${topic}". Research and add more specific facts, statistics, or details to make the content more compelling. Keep the same structure but enrich the content.`;
      } else if (mode === 'rewrite') {
        systemPrompt = `You are enhancing a presentation slide. Rewrite the content to be clearer, more concise, and more impactful. Remove filler words, strengthen the language, and improve flow.`;
      } else {
        systemPrompt = `You are enhancing a presentation slide. Follow this instruction: ${customPrompt}`;
      }

      const userPrompt = `Current slide content:
Title: ${slide.title}
Bullets:
${slide.content.map((b, i) => `${i + 1}. ${b}`).join('\n')}
Speaker Notes: ${slide.speakerNotes || 'None'}

Return ONLY a JSON object with the enhanced content in this exact format:
{"title": "enhanced title", "bullets": ["bullet 1", "bullet 2", ...], "speakerNotes": "enhanced notes"}`;

      const response = await ai.models.generateContent({
        model: getTextModel(),
        contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      const enhanced = JSON.parse(responseText);

      // Update the slide with enhanced content
      setSlides(prev => prev.map(s =>
        s.id === slideId ? {
          ...s,
          title: enhanced.title || s.title,
          content: enhanced.bullets || s.content,
          speakerNotes: enhanced.speakerNotes || s.speakerNotes,
          approvalState: 'modified',
        } : s
      ));

    } catch (err) {
      console.error('AI enhancement error:', err);
    } finally {
      setEnhancingSlideId(null);
    }
  }, [slides, topic]);

  // Handle approve all
  const handleApproveAll = useCallback(async () => {
    if (!result) return;

    // If we have a persisted draft, use the API to approve
    if (persistedDraft) {
      try {
        setIsSaving(true);
        const presentation = await approveRoughDraft(persistedDraft.id, {
          topic: topic,
          themeId: themeId,
          visualStyle: visualStyle,
        });
        console.log('[RoughDraftCanvas] Draft approved, presentation created:', presentation.id);
        // The presentation was created via API, just call onApprove with the result
        const finalResult: RoughDraftResult = {
          ...result,
          slides: slides.map(s => ({ ...s, approvalState: 'approved' })),
        };
        onApprove(finalResult);
      } catch (err) {
        console.error('[RoughDraftCanvas] Failed to approve draft:', err);
        // Fall back to local approval
        const finalResult: RoughDraftResult = {
          ...result,
          slides: slides.map(s => ({ ...s, approvalState: 'approved' })),
        };
        onApprove(finalResult);
      } finally {
        setIsSaving(false);
      }
    } else {
      // No persisted draft, use local approval
      const finalResult: RoughDraftResult = {
        ...result,
        slides: slides.map(s => ({ ...s, approvalState: 'approved' })),
      };
      onApprove(finalResult);
    }
  }, [result, slides, onApprove, persistedDraft, topic, themeId, visualStyle]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate progress
  const completedSlides = slides.filter(s => !s.isImageLoading).length;
  const approvedSlides = slides.filter(s => s.approvalState === 'approved').length;
  const hasErrors = slides.some(s => s.imageError);

  // Phase label
  const getPhaseLabel = () => {
    // Show loading state when fetching existing draft
    if (isLoadingExisting) return 'Loading draft...';

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
              <h1 className="font-bold text-white uppercase tracking-wide">{topic}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 uppercase tracking-widest">
                  {getPhaseLabel()}
                </span>
                {(phase !== 'complete' || isLoadingExisting) && (
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
              {isSaving && (
                <span className="flex items-center gap-1 text-white/30">
                  <div className="w-2 h-2 border border-white/30 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              )}
              {persistedDraft && !isSaving && (
                <span className="text-green-400/60">Saved</span>
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
                  visualStyle={visualStyle}
                  isSelected={selectedSlideId === slide.id}
                  isRegenerating={regeneratingSlideId === slide.id}
                  onSelect={() => handleSelectSlide(slide.id)}
                  onUpdate={(updates) => handleUpdateSlide(slide.id, updates)}
                  onApprove={() => handleApproveSlide(slide.id)}
                  onRegenerateImage={() => handleRegenerateImage(slide.id)}
                  onAIEnhance={(mode, customPrompt) => handleAIEnhance(slide.id, mode, customPrompt)}
                  isEnhancing={enhancingSlideId === slide.id}
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
