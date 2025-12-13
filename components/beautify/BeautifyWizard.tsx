/**
 * BeautifyWizard Component
 *
 * Full-screen wizard for the "Make My Ugly Deck Beautiful" feature.
 * KISS: Single component with inline step renderers.
 * SOLID: Single responsibility - orchestrates the beautification flow.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Rocket,
  PenTool,
  GraduationCap,
  Briefcase,
  Cpu,
  ChevronRight,
  ChevronLeft,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Zap,
  Wand2,
  RefreshCw,
} from 'lucide-react';
import type { Slide } from '@/types';
import type { BeautifySession, TransformIntensity, SlideIR, StylePack } from '@/types/beautify';
import { beautifyService } from '@/services/api/beautifyService';
import { STYLE_PACKS, getDefaultStylePack } from '@/lib/stylePacks';
import { THEMES } from '@/config/themes';
import { BeforeAfterSlider } from './BeforeAfterSlider';

// =============================================================================
// TYPES
// =============================================================================

type WizardStep = 'upload' | 'analyze' | 'configure' | 'transform' | 'review';

interface BeautifyWizardProps {
  /** Called when wizard is closed */
  onClose: () => void;
  /** Called when transformation is complete with the new slides */
  onComplete: (slides: Slide[], themeId: string) => void;
}

// =============================================================================
// ICON MAP
// =============================================================================

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Rocket,
  PenTool,
  GraduationCap,
  Briefcase,
  Cpu,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const BeautifyWizard: React.FC<BeautifyWizardProps> = ({ onClose, onComplete }) => {
  // Step state
  const [step, setStep] = useState<WizardStep>('upload');

  // Session state
  const [session, setSession] = useState<BeautifySession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // User selections
  const [selectedPack, setSelectedPack] = useState<StylePack>(getDefaultStylePack());
  const [intensity, setIntensity] = useState<TransformIntensity>('redesign');

  // Transform results
  const [transformedSlides, setTransformedSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.name.endsWith('.pptx')) {
      setError('Please upload a .pptx file');
      return;
    }

    setError(null);
    setStep('upload');

    try {
      // Upload file
      const { sessionId } = await beautifyService.upload(file);

      // Start polling for session status
      const pollSession = async () => {
        try {
          const updatedSession = await beautifyService.getSession(sessionId);
          setSession(updatedSession);

          if (updatedSession.status === 'ready') {
            // Parsing complete, move to analyze step
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setStep('analyze');
          } else if (updatedSession.status === 'error') {
            if (pollingRef.current) {
              clearInterval(pollingRef.current);
              pollingRef.current = null;
            }
            setError(updatedSession.errorMessage || 'Failed to parse deck');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      };

      // Initial poll
      await pollSession();

      // Continue polling if not ready
      pollingRef.current = setInterval(pollSession, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleTransform = useCallback(async () => {
    if (!session) return;

    setStep('transform');
    setError(null);

    try {
      const { slides } = await beautifyService.transform(
        session.id,
        selectedPack.themeId,
        intensity
      );
      setTransformedSlides(slides);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transformation failed');
      setStep('configure');
    }
  }, [session, selectedPack, intensity]);

  const handleComplete = useCallback(() => {
    onComplete(transformedSlides, selectedPack.themeId);
  }, [transformedSlides, selectedPack, onComplete]);

  // ---------------------------------------------------------------------------
  // STEP RENDERERS
  // ---------------------------------------------------------------------------

  const renderUpload = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div
        className="w-full max-w-xl aspect-video border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#c5a47e] hover:bg-white/5 transition-all"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {session?.status === 'parsing' || session?.status === 'analyzing' ? (
          <>
            <Loader2 className="w-12 h-12 text-[#c5a47e] animate-spin" />
            <p className="text-white/80 text-lg">
              {session.status === 'parsing' ? 'Extracting slides...' : 'Analyzing deck...'}
            </p>
            <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c5a47e] transition-all duration-300"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-white/60" />
            <p className="text-white/80 text-lg">Drop your ugly PPTX here</p>
            <p className="text-white/40 text-sm">or click to browse</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pptx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );

  const renderAnalyze = () => {
    if (!session) return null;

    const getScoreColor = (score: number) => {
      if (score < 30) return 'text-green-400';
      if (score < 60) return 'text-yellow-400';
      return 'text-red-400';
    };

    return (
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header with overall score */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{session.fileName}</h2>
            <p className="text-white/60">{session.slides.length} slides analyzed</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm uppercase tracking-wide">Mess Score</p>
            <p className={`text-4xl font-bold ${getScoreColor(session.overallMessScore)}`}>
              {Math.round(session.overallMessScore)}
            </p>
          </div>
        </div>

        {/* Slide grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {session.slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-[#c5a47e]/50 transition-all"
              >
                {/* Slide preview placeholder */}
                <div className="aspect-video bg-black/30 rounded mb-2 flex items-center justify-center text-white/40 text-sm">
                  Slide {index + 1}
                </div>

                {/* Slide info */}
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs uppercase">{slide.type}</span>
                  <span className={`text-sm font-medium ${getScoreColor(slide.messScore)}`}>
                    {Math.round(slide.messScore)}
                  </span>
                </div>

                {/* Issues preview */}
                {slide.messIssues.length > 0 && (
                  <p className="text-white/40 text-xs mt-1 truncate">
                    {slide.messIssues[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setStep('configure')}
            className="flex items-center gap-2 bg-[#c5a47e] hover:bg-[#b8956f] text-black px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all"
          >
            Choose Style
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderConfigure = () => (
    <div className="flex-1 flex flex-col p-8 overflow-hidden">
      {/* Style Pack Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Choose Your Style</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STYLE_PACKS.map((pack) => {
            const Icon = ICON_MAP[pack.icon] || Sparkles;
            const isSelected = selectedPack.id === pack.id;
            const theme = THEMES[pack.themeId];

            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#c5a47e] bg-[#c5a47e]/10'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme?.colors.accent || '#c5a47e' }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{pack.name}</p>
                  </div>
                </div>
                <p className="text-white/50 text-sm">{pack.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Transformation Intensity</h2>
        <div className="flex gap-4">
          {[
            { id: 'cleanup', name: 'Clean Up', icon: Sparkles, desc: 'Fix typography & alignment' },
            { id: 'redesign', name: 'Redesign', icon: Wand2, desc: 'New layouts, keep images' },
            { id: 'rebuild', name: 'Rebuild', icon: Zap, desc: 'Full transformation' },
          ].map(({ id, name, icon: IntIcon, desc }) => (
            <button
              key={id}
              onClick={() => setIntensity(id as TransformIntensity)}
              className={`flex-1 p-4 rounded-lg border-2 text-left transition-all ${
                intensity === id
                  ? 'border-[#c5a47e] bg-[#c5a47e]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <IntIcon className={`w-6 h-6 mb-2 ${intensity === id ? 'text-[#c5a47e]' : 'text-white/60'}`} />
              <p className="text-white font-medium">{name}</p>
              <p className="text-white/50 text-sm">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-auto flex justify-between">
        <button
          onClick={() => setStep('analyze')}
          className="flex items-center gap-2 text-white/60 hover:text-white px-4 py-2 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleTransform}
          className="flex items-center gap-2 bg-[#c5a47e] hover:bg-[#b8956f] text-black px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all"
        >
          Transform
          <Wand2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderTransform = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <Loader2 className="w-16 h-16 text-[#c5a47e] animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Transforming Your Deck</h2>
      <p className="text-white/60">Applying {selectedPack.name} style with {intensity} intensity...</p>
    </div>
  );

  const renderReview = () => {
    if (!session || transformedSlides.length === 0) return null;

    const beforeSlide = session.slides[currentSlideIndex];
    const afterSlide = transformedSlides[currentSlideIndex];

    return (
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Before & After</h2>
            <p className="text-white/60">
              Slide {currentSlideIndex + 1} of {transformedSlides.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentSlideIndex(Math.min(transformedSlides.length - 1, currentSlideIndex + 1))
              }
              disabled={currentSlideIndex === transformedSlides.length - 1}
              className="p-2 text-white/60 hover:text-white disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Before/After Comparison */}
        <div className="flex-1 overflow-hidden">
          <BeforeAfterSlider
            beforeSlide={beforeSlide}
            afterSlide={afterSlide}
            themeId={selectedPack.themeId}
          />
        </div>

        {/* Slide thumbnails */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {transformedSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-16 h-10 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs transition-all ${
                index === currentSlideIndex
                  ? 'border-[#c5a47e] bg-[#c5a47e]/20 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setStep('configure')}
            className="flex items-center gap-2 text-white/60 hover:text-white px-4 py-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Try Different Style
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 bg-[#c5a47e] hover:bg-[#b8956f] text-black px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save to Library
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Wand2 className="w-6 h-6 text-[#c5a47e]" />
          <h1 className="text-lg font-bold text-white uppercase tracking-wide">
            Make My Deck Beautiful
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {(['upload', 'analyze', 'configure', 'review'] as const).map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <div className="w-8 h-px bg-white/20" />}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? 'bg-[#c5a47e] text-black'
                    : ['upload', 'analyze', 'configure', 'review'].indexOf(step) > i
                    ? 'bg-[#c5a47e]/30 text-[#c5a47e]'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {i + 1}
              </div>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={onClose}
          className="p-2 text-white/60 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      {step === 'upload' && renderUpload()}
      {step === 'analyze' && renderAnalyze()}
      {step === 'configure' && renderConfigure()}
      {step === 'transform' && renderTransform()}
      {step === 'review' && renderReview()}
    </div>
  );
};
