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
import type { Presentation, Theme, ExportMode } from '@/types';
import {
  getThemeCompatibility,
  getRecommendedExportMode,
  getExportModeReason,
  extractFontName,
  type PptxCompatibility,
} from '@/lib/fontCompatibility';
import {
  exportPresentation,
  downloadBlob,
  type ExportProgress,
} from '@/services/pptExportStrategies';
import { generatePPT } from '@/services/pptService';

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
      <div className="fixed inset-0 bg-[#1E2E1E]/40 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-white border border-[#D4E5D4] shadow-[0_8px_32px_rgba(107,142,107,0.15)] rounded-lg animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#D4E5D4]">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#6B8E6B]" />
              <h2 className="text-lg font-bold text-[#1E2E1E]">Export to PowerPoint</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#EDF5F0] transition-colors rounded"
              disabled={isExporting}
            >
              <X className="w-5 h-5 text-[#8FA58F]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Theme Info */}
            <div className="p-4 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1E2E1E]">{theme.name}</span>
                  {viewMode === 'wabi-sabi' && (
                    <span className="px-2 py-0.5 bg-[#6B8E6B]/15 text-[#6B8E6B] text-[10px] font-bold uppercase tracking-wider border border-[#6B8E6B]/30 rounded">
                      {wabiSabiLayout || 'Organic'}
                    </span>
                  )}
                </div>
                {compatibility.safe && viewMode === 'standard' && (
                  <span className="px-2 py-0.5 bg-[#6B8E6B]/15 text-[#6B8E6B] text-[10px] font-bold uppercase tracking-wider border border-[#6B8E6B]/30 rounded">
                    PowerPoint Safe
                  </span>
                )}
              </div>

              {/* Font Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8FA58F]">Heading:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E2E1E] font-medium">{headingFont}</span>
                    <span className="text-[#8FA58F]">→</span>
                    <span className="text-[#4A5D4A]">{compatibility.pptxHeadingFont}</span>
                    <MatchBadge match={compatibility.headingMatch} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8FA58F]">Body:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E2E1E] font-medium">{bodyFont}</span>
                    <span className="text-[#8FA58F]">→</span>
                    <span className="text-[#4A5D4A]">{compatibility.pptxBodyFont}</span>
                    <MatchBadge match={compatibility.bodyMatch} />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#8FA58F]">
                <Info className="w-4 h-4" />
                <span>{modeReason}</span>
              </div>

              <div className="space-y-2">
                {/* Editable Mode */}
                <button
                  onClick={() => setSelectedMode('editable')}
                  className={`w-full p-3 text-left border transition-all rounded-lg ${
                    activeMode === 'editable'
                      ? 'border-[#6B8E6B] bg-[#6B8E6B]/10'
                      : 'border-[#D4E5D4] hover:border-[#C0D6C0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-[#8FA58F]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E2E1E]">Editable</span>
                        {recommendedMode === 'editable' && (
                          <span className="px-1.5 py-0.5 bg-[#6B8E6B]/15 text-[#6B8E6B] text-[8px] font-bold uppercase rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8FA58F]">
                        All text editable in PowerPoint. Fonts substituted.
                      </span>
                    </div>
                    {activeMode === 'editable' && (
                      <Check className="w-5 h-5 text-[#6B8E6B]" />
                    )}
                  </div>
                </button>

                {/* Hybrid Mode */}
                <button
                  onClick={() => setSelectedMode('hybrid')}
                  className={`w-full p-3 text-left border transition-all rounded-lg ${
                    activeMode === 'hybrid'
                      ? 'border-[#6B8E6B] bg-[#6B8E6B]/10'
                      : 'border-[#D4E5D4] hover:border-[#C0D6C0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      <Image className="w-4 h-4 text-[#8FA58F]" />
                      <Type className="w-4 h-4 text-[#8FA58F] -ml-1" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E2E1E]">Hybrid</span>
                        {recommendedMode === 'hybrid' && (
                          <span className="px-1.5 py-0.5 bg-[#6B8E6B]/15 text-[#6B8E6B] text-[8px] font-bold uppercase rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8FA58F]">
                        Headers as images, body text editable.
                      </span>
                    </div>
                    {activeMode === 'hybrid' && (
                      <Check className="w-5 h-5 text-[#6B8E6B]" />
                    )}
                  </div>
                </button>

                {/* Visual Match Mode */}
                <button
                  onClick={() => setSelectedMode('visual-match')}
                  className={`w-full p-3 text-left border transition-all rounded-lg ${
                    activeMode === 'visual-match'
                      ? 'border-[#6B8E6B] bg-[#6B8E6B]/10'
                      : 'border-[#D4E5D4] hover:border-[#C0D6C0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image className="w-5 h-5 text-[#8FA58F]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1E2E1E]">Visual Match</span>
                        {recommendedMode === 'visual-match' && (
                          <span className="px-1.5 py-0.5 bg-[#6B8E6B]/15 text-[#6B8E6B] text-[8px] font-bold uppercase rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#8FA58F]">
                        Pixel-accurate rendering. Limited editability.
                      </span>
                    </div>
                    {activeMode === 'visual-match' && (
                      <Check className="w-5 h-5 text-[#6B8E6B]" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Speaker Notes Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#1E2E1E]">Include speaker notes</span>
                {activeMode === 'visual-match' && (
                  <span className="text-[10px] text-[#A89050]">(not supported)</span>
                )}
              </div>
              <button
                onClick={() => setIncludeNotes(!includeNotes)}
                disabled={activeMode === 'visual-match'}
                className={`w-10 h-5 rounded-full transition-colors ${
                  includeNotes && activeMode !== 'visual-match'
                    ? 'bg-[#6B8E6B]'
                    : 'bg-[#D4E5D4]'
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
              <div className="p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1E2E1E]">{progress.message}</span>
                  <span className="text-xs text-[#8FA58F]">
                    {progress.currentSlide}/{progress.totalSlides}
                  </span>
                </div>
                <div className="h-1 bg-[#D4E5D4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6B8E6B] transition-all duration-300 rounded-full"
                    style={{
                      width: `${(progress.currentSlide / progress.totalSlides) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#D4E5D4] flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#8FA58F] hover:text-[#4A5D4A] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 bg-[#6B8E6B] text-white text-sm font-bold uppercase tracking-wider rounded-md hover:bg-[#5A7A5A] transition-colors disabled:opacity-50"
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
