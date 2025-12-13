/**
 * Export Progress Modal
 *
 * Shows export progress with animated progress bar.
 * Displays current operation and slide count.
 */

import React from 'react';
import { FileText, Download, Presentation, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import type { ExportProgress, ExportType } from '../../types/export';

// Re-export for backwards compatibility
export type { ExportProgress, ExportType } from '../../types/export';

interface ExportProgressModalProps {
  isOpen: boolean;
  exportType: ExportType;
  progress: ExportProgress;
  resultUrl?: string; // For Google Slides link
  onClose: () => void;
  onRetry?: () => void;
}

const EXPORT_CONFIG: Record<ExportType, { icon: React.ElementType; title: string; color: string }> = {
  pdf: { icon: FileText, title: 'PDF', color: '#ef4444' },
  pptx: { icon: Download, title: 'PowerPoint', color: '#2563eb' },
  'google-slides': { icon: Presentation, title: 'Google Slides', color: '#f59e0b' },
};

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  exportType,
  progress,
  resultUrl,
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  const config = EXPORT_CONFIG[exportType];
  const Icon = config.icon;
  const percentage = progress.totalSlides > 0
    ? Math.round((progress.currentSlide / progress.totalSlides) * 100)
    : 0;

  const isComplete = progress.phase === 'complete';
  const isError = progress.phase === 'error';
  const isProcessing = !isComplete && !isError;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={isComplete || isError ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-[#111111] border border-white/20 w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ backgroundColor: config.color }}
            >
              {isComplete ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : isError ? (
                <XCircle className="w-6 h-6 text-white" />
              ) : (
                <Icon className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isComplete ? 'Export Complete' : isError ? 'Export Failed' : `Exporting to ${config.title}`}
              </h3>
              <p className="text-sm text-white/60">
                {progress.message || 'Processing your presentation...'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar (only show when processing) */}
        {isProcessing && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>
                {progress.phase === 'preparing' ? 'Preparing...' :
                 progress.phase === 'rendering' ? `Slide ${progress.currentSlide} of ${progress.totalSlides}` :
                 progress.phase === 'compiling' ? 'Compiling...' :
                 progress.phase === 'converting' ? 'Converting...' :
                 progress.phase === 'adding-notes' ? 'Adding notes...' :
                 progress.phase === 'uploading' ? 'Uploading...' : 'Processing...'}
              </span>
              <span>{percentage}%</span>
            </div>
            <div className="h-2 bg-white/10 overflow-hidden">
              <div
                className="h-full transition-all duration-300 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: config.color,
                }}
              />
            </div>
          </div>
        )}

        {/* Spinner for preparing phase */}
        {progress.phase === 'preparing' && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        )}

        {/* Success state with link for Google Slides */}
        {isComplete && exportType === 'google-slides' && resultUrl && (
          <div className="px-6 py-4">
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#c5a47e] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Slides
            </a>
          </div>
        )}

        {/* Error state with retry */}
        {isError && onRetry && (
          <div className="px-6 py-4">
            <button
              onClick={onRetry}
              className="w-full py-3 bg-[#c5a47e] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Footer with close button */}
        {(isComplete || isError) && (
          <div className="px-6 py-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/5 text-white/60 font-bold uppercase tracking-widest text-xs hover:bg-white/10 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportProgressModal;
