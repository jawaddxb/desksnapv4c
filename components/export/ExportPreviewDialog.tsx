/**
 * Export Preview Dialog
 *
 * Smart dialog that:
 * 1. Analyzes theme compatibility
 * 2. Recommends the best export mode
 * 3. Shows a preview of font substitutions
 * 4. Lets users override the recommendation
 */

import React, { useState, useMemo } from 'react';
import { X, FileSpreadsheet, Image, Type, Check, AlertTriangle, Info } from 'lucide-react';
import type { Presentation, Theme, ExportMode } from '../../types';
import {
  getThemeCompatibility,
  getRecommendedExportMode,
  getExportModeReason,
  extractFontName,
  type PptxCompatibility,
} from '../../lib/fontCompatibility';
import {
  exportPresentation,
  downloadBlob,
  type ExportProgress,
} from '../../services/pptExportStrategies';
import { generatePPT } from '../../services/pptService';

interface ExportPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presentation: Presentation;
  theme: Theme;
  viewMode?: 'standard' | 'wabi-sabi';
  wabiSabiLayout?: string;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

// Match quality badge component
const MatchBadge: React.FC<{ match: 'excellent' | 'good' | 'moderate' | 'poor' }> = ({ match }) => {
  const styles = {
    excellent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    poor: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${styles[match]}`}>
      {match}
    </span>
  );
};

export const ExportPreviewDialog: React.FC<ExportPreviewDialogProps> = ({
  isOpen,
  onClose,
  presentation,
  theme,
  viewMode = 'standard',
  wabiSabiLayout,
  onExportStart,
  onExportComplete,
  onExportError,
}) => {
  const [selectedMode, setSelectedMode] = useState<ExportMode | null>(null);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);

  // Compute compatibility and recommendation (considering viewMode)
  const compatibility = useMemo(() => getThemeCompatibility(theme), [theme]);
  const recommendedMode = useMemo(() => getRecommendedExportMode(theme, viewMode), [theme, viewMode]);
  const modeReason = useMemo(() => getExportModeReason(theme, viewMode, wabiSabiLayout), [theme, viewMode, wabiSabiLayout]);

  // Use selected mode or fall back to recommendation
  const activeMode = selectedMode || recommendedMode;

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    onExportStart?.();

    try {
      // Create domExportFn for visual-match mode
      const domExportFn = async () => {
        await generatePPT(presentation, theme, {
          viewMode,
          wabiSabiLayout,
          onProgress: (progress) => {
            setProgress({
              currentSlide: progress.currentSlide,
              totalSlides: progress.totalSlides,
              phase: progress.phase,
              message: progress.message,
            });
          },
        });
      };

      const result = await exportPresentation(
        presentation,
        theme,
        activeMode,
        {
          includeNotes,
          viewMode,
          wabiSabiLayout,
          onProgress: setProgress,
        },
        domExportFn
      );

      if (result instanceof Blob) {
        const filename = `${presentation.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
        downloadBlob(result, filename);
      }

      onExportComplete?.();
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      onExportError?.(error instanceof Error ? error : new Error('Export failed'));
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  if (!isOpen) return null;

  const headingFont = extractFontName(theme.fonts.heading);
  const bodyFont = extractFontName(theme.fonts.body);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-[#111111] border border-white/20 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#c5a47e]" />
              <h2 className="text-lg font-bold text-white">Export to PowerPoint</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 transition-colors"
              disabled={isExporting}
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Theme Info */}
            <div className="p-4 bg-black/50 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{theme.name}</span>
                  {viewMode === 'wabi-sabi' && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">
                      {wabiSabiLayout || 'Organic'}
                    </span>
                  )}
                </div>
                {compatibility.safe && viewMode === 'standard' && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                    PowerPoint Safe
                  </span>
                )}
              </div>

              {/* Font Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Heading:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{headingFont}</span>
                    <span className="text-white/40">→</span>
                    <span className="text-white/80">{compatibility.pptxHeadingFont}</span>
                    <MatchBadge match={compatibility.headingMatch} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Body:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{bodyFont}</span>
                    <span className="text-white/40">→</span>
                    <span className="text-white/80">{compatibility.pptxBodyFont}</span>
                    <MatchBadge match={compatibility.bodyMatch} />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Info className="w-4 h-4" />
                <span>{modeReason}</span>
              </div>

              <div className="space-y-2">
                {/* Editable Mode */}
                <button
                  onClick={() => setSelectedMode('editable')}
                  className={`w-full p-3 text-left border transition-all ${
                    activeMode === 'editable'
                      ? 'border-[#c5a47e] bg-[#c5a47e]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-white/60" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Editable</span>
                        {recommendedMode === 'editable' && (
                          <span className="px-1.5 py-0.5 bg-[#c5a47e]/20 text-[#c5a47e] text-[8px] font-bold uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/50">
                        All text editable in PowerPoint. Fonts substituted.
                      </span>
                    </div>
                    {activeMode === 'editable' && (
                      <Check className="w-5 h-5 text-[#c5a47e]" />
                    )}
                  </div>
                </button>

                {/* Hybrid Mode */}
                <button
                  onClick={() => setSelectedMode('hybrid')}
                  className={`w-full p-3 text-left border transition-all ${
                    activeMode === 'hybrid'
                      ? 'border-[#c5a47e] bg-[#c5a47e]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Image className="w-4 h-4 text-white/60" />
                      <Type className="w-4 h-4 text-white/60 -ml-1" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Hybrid</span>
                        {recommendedMode === 'hybrid' && (
                          <span className="px-1.5 py-0.5 bg-[#c5a47e]/20 text-[#c5a47e] text-[8px] font-bold uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/50">
                        Headers as images, body text editable.
                      </span>
                    </div>
                    {activeMode === 'hybrid' && (
                      <Check className="w-5 h-5 text-[#c5a47e]" />
                    )}
                  </div>
                </button>

                {/* Visual Match Mode */}
                <button
                  onClick={() => setSelectedMode('visual-match')}
                  className={`w-full p-3 text-left border transition-all ${
                    activeMode === 'visual-match'
                      ? 'border-[#c5a47e] bg-[#c5a47e]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-white/60" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Visual Match</span>
                        {recommendedMode === 'visual-match' && (
                          <span className="px-1.5 py-0.5 bg-[#c5a47e]/20 text-[#c5a47e] text-[8px] font-bold uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-white/50">
                        Pixel-accurate rendering. Limited editability.
                      </span>
                    </div>
                    {activeMode === 'visual-match' && (
                      <Check className="w-5 h-5 text-[#c5a47e]" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Speaker Notes Toggle */}
            <div className="flex items-center justify-between p-3 bg-black/50 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Include speaker notes</span>
                {activeMode === 'visual-match' && (
                  <span className="text-[10px] text-amber-400">(not supported)</span>
                )}
              </div>
              <button
                onClick={() => setIncludeNotes(!includeNotes)}
                disabled={activeMode === 'visual-match'}
                className={`w-10 h-5 rounded-full transition-colors ${
                  includeNotes && activeMode !== 'visual-match'
                    ? 'bg-[#c5a47e]'
                    : 'bg-white/20'
                } ${activeMode === 'visual-match' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    includeNotes && activeMode !== 'visual-match' ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Progress */}
            {isExporting && progress && (
              <div className="p-3 bg-black/50 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{progress.message}</span>
                  <span className="text-xs text-white/60">
                    {progress.currentSlide}/{progress.totalSlides}
                  </span>
                </div>
                <div className="h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-[#c5a47e] transition-all duration-300"
                    style={{
                      width: `${(progress.currentSlide / progress.totalSlides) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 bg-[#c5a47e] text-black text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
            >
              {isExporting ? 'Exporting...' : 'Export PowerPoint'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportPreviewDialog;
