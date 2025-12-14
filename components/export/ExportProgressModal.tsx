/**
 * Export Progress Modal
 *
 * Shows export progress with animated progress bar.
 * Displays current operation and slide count.
 */

import React from 'react';
import { FileText, Download, Presentation, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import type { ExportProgress, ExportType } from '@/types/export';

// Re-export for backwards compatibility
export type { ExportProgress, ExportType } from '@/types/export';

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
        className="absolute inset-0 bg-[#1E2E1E]/40 backdrop-blur-sm"
        onClick={isComplete || isError ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#D4E5D4] w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200 rounded-lg">
        {/* Header */}
        <div className="p-6 border-b border-[#D4E5D4]">
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
              <h3 className="text-lg font-bold text-[#1E2E1E]">
                {isComplete ? 'Export Complete' : isError ? 'Export Failed' : `Exporting to ${config.title}`}
              </h3>
              <p className="text-sm text-[#8FA58F]">
                {progress.message || 'Processing your presentation...'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar (only show when processing) */}
        {isProcessing && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between text-sm text-[#8FA58F] mb-2">
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
            <div className="h-2 bg-[#D4E5D4] overflow-hidden rounded-full">
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
            <Loader2 className="w-8 h-8 text-[#8FA58F] animate-spin" />
          </div>
        )}

        {/* Success state with link for Google Slides */}
        {isComplete && exportType === 'google-slides' && resultUrl && (
          <div className="px-6 py-4">
            <a
              href={resultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#6B8E6B] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5A7A5A] transition-colors rounded"
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
              className="w-full py-3 bg-[#6B8E6B] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#5A7A5A] transition-colors rounded"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Footer with close button */}
        {(isComplete || isError) && (
          <div className="px-6 py-4 border-t border-[#D4E5D4]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#EDF5F0] text-[#8FA58F] font-bold uppercase tracking-widest text-xs hover:bg-[#D4E5D4] hover:text-[#6B8E6B] transition-colors rounded"
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
