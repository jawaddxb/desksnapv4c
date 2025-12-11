/**
 * Export Menu Component
 *
 * Dropdown menu for exporting presentations to various formats:
 * - PDF (via html2canvas + jsPDF)
 * - PowerPoint (via pptxgenjs)
 * - Google Slides (via Google Slides API)
 */

import React, { useState } from 'react';
import { ChevronDown, FileText, Download, Presentation, Share2, FileSpreadsheet } from 'lucide-react';
import { Presentation as PresentationType, Theme } from '../../types';
import { generatePDF, PDFExportProgress } from '../../services/pdfService';
import { generatePPT, PPTExportProgress } from '../../services/pptService';
import { exportToGoogleSlides, isGoogleAuthenticated, isGoogleConfigured } from '../../services/googleSlidesService';
import { ExportProgressModal, ExportType, ExportProgress } from './ExportProgressModal';
import { ExportRenderer } from './ExportRenderer';
import { PPTExportRenderer } from './PPTExportRenderer';
import { ExportPreviewDialog } from './ExportPreviewDialog';
import { isPptxSafe } from '../../lib/fontCompatibility';

interface ExportMenuProps {
  presentation: PresentationType | null;
  theme: Theme;
  viewMode: 'standard' | 'wabi-sabi';
  wabiSabiLayout?: string;
  onExportJSON?: () => void;
}

interface MenuOption {
  id: ExportType | 'json';
  label: string;
  icon: React.ElementType;
  description: string;
  handler: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  presentation,
  theme,
  viewMode,
  wabiSabiLayout,
  onExportJSON,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('pdf');
  const [progress, setProgress] = useState<ExportProgress>({
    currentSlide: 0,
    totalSlides: 0,
    phase: 'preparing',
  });
  const [resultUrl, setResultUrl] = useState<string | undefined>();
  const [showRenderer, setShowRenderer] = useState(false);
  const [showPPTRenderer, setShowPPTRenderer] = useState(false);
  const [showPPTPreviewDialog, setShowPPTPreviewDialog] = useState(false);

  const handleExportPDF = async () => {
    if (!presentation) return;

    setIsOpen(false);
    setExportType('pdf');
    setIsExporting(true);
    setShowRenderer(true);
    setResultUrl(undefined);
    setProgress({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
    });

    // Wait for React to render the ExportRenderer component and mount the DOM element
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      await generatePDF(
        presentation,
        theme,
        viewMode,
        wabiSabiLayout,
        (pdfProgress: PDFExportProgress) => {
          setProgress({
            currentSlide: pdfProgress.currentSlide,
            totalSlides: pdfProgress.totalSlides,
            phase: pdfProgress.phase,
            message: pdfProgress.message,
          });
        }
      );
    } catch (error) {
      console.error('PDF export failed:', error);
      setProgress({
        currentSlide: 0,
        totalSlides: presentation.slides.length,
        phase: 'error',
        message: error instanceof Error ? error.message : 'PDF export failed',
      });
    } finally {
      // Signal export complete to renderer
      window.dispatchEvent(new CustomEvent('pdf-export-complete'));
      setShowRenderer(false);
    }
  };

  const handleExportPPT = async () => {
    if (!presentation) return;

    setIsOpen(false);
    setExportType('pptx');
    setIsExporting(true);
    setShowPPTRenderer(true);
    setResultUrl(undefined);
    setProgress({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
      message: 'Preparing slides for export...',
    });

    try {
      await generatePPT(presentation, theme, {
        viewMode,
        wabiSabiLayout,
        onProgress: (pptProgress: PPTExportProgress) => {
          setProgress({
            currentSlide: pptProgress.currentSlide,
            totalSlides: pptProgress.totalSlides,
            phase: pptProgress.phase === 'converting' ? 'compiling' : pptProgress.phase,
            message: pptProgress.message,
          });
        },
      });

      setProgress({
        currentSlide: presentation.slides.length,
        totalSlides: presentation.slides.length,
        phase: 'complete',
        message: 'PowerPoint exported successfully!',
      });
    } catch (error) {
      console.error('PowerPoint export failed:', error);
      setProgress({
        currentSlide: 0,
        totalSlides: presentation.slides.length,
        phase: 'error',
        message: error instanceof Error ? error.message : 'Could not export PowerPoint. Please try again.',
      });
    } finally {
      setShowPPTRenderer(false);
    }
  };

  const handleExportGoogleSlides = async () => {
    if (!presentation) return;

    setIsOpen(false);
    setExportType('google-slides');
    setIsExporting(true);
    setResultUrl(undefined);
    setProgress({
      currentSlide: 0,
      totalSlides: presentation.slides.length,
      phase: 'preparing',
      message: 'Connecting to Google...',
    });

    try {
      const result = await exportToGoogleSlides(
        presentation,
        theme,
        (slideProgress) => {
          setProgress({
            currentSlide: slideProgress.currentSlide,
            totalSlides: slideProgress.totalSlides,
            phase: slideProgress.phase as ExportProgress['phase'],
            message: slideProgress.message,
          });
        }
      );

      setResultUrl(result.url);
      setProgress({
        currentSlide: presentation.slides.length,
        totalSlides: presentation.slides.length,
        phase: 'complete',
        message: 'Google Slides created successfully!',
      });
    } catch (error) {
      console.error('Google Slides export failed:', error);
      setProgress({
        currentSlide: 0,
        totalSlides: presentation.slides.length,
        phase: 'error',
        message: error instanceof Error ? error.message : 'Google Slides export failed',
      });
    }
  };

  const handleRetry = () => {
    if (exportType === 'pdf') {
      handleExportPDF();
    } else if (exportType === 'pptx') {
      handleExportPPT();
    } else if (exportType === 'google-slides') {
      handleExportGoogleSlides();
    }
  };

  const handleCloseModal = () => {
    setIsExporting(false);
    setResultUrl(undefined);
  };

  const pptxSafe = isPptxSafe(theme);

  const menuOptions: MenuOption[] = [
    {
      id: 'pdf',
      label: 'Download as PDF',
      icon: FileText,
      description: 'High-resolution PDF file',
      handler: handleExportPDF,
    },
    {
      id: 'pptx',
      label: 'Download as PowerPoint',
      icon: FileSpreadsheet,
      description: pptxSafe ? 'Fully editable PPTX' : 'Smart export with options',
      handler: () => {
        setIsOpen(false);
        setShowPPTRenderer(true);  // Mount renderer for visual-match mode
        setShowPPTPreviewDialog(true);
      },
    },
    {
      id: 'google-slides',
      label: 'Export to Google Slides',
      icon: Presentation,
      description: !isGoogleConfigured()
        ? 'Google API not configured'
        : isGoogleAuthenticated()
          ? 'Create in your Google Drive'
          : 'Sign in to export',
      handler: handleExportGoogleSlides,
    },
  ];

  // Add JSON export if handler provided
  if (onExportJSON) {
    menuOptions.push({
      id: 'json' as ExportType | 'json',
      label: 'Share as JSON',
      icon: Share2,
      description: 'Portable deck file',
      handler: () => {
        setIsOpen(false);
        onExportJSON();
      },
    });
  }

  if (!presentation) {
    return null;
  }

  return (
    <>
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e] transition-all duration-150"
        >
          <Download className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden md:inline">Export</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#111111] border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              {menuOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.handler}
                    className="w-full flex items-start gap-3 p-3 text-left hover:bg-white/5 transition-colors duration-150 border-b border-white/5 last:border-b-0"
                  >
                    <Icon className="w-5 h-5 text-white/60 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white">{option.label}</div>
                      <div className="text-xs text-white/40">{option.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Export Renderer (hidden, used for PDF capture) */}
      {showRenderer && <ExportRenderer />}

      {/* PPT Export Renderer (hidden, used for PowerPoint capture) */}
      {showPPTRenderer && <PPTExportRenderer />}

      {/* Progress Modal */}
      <ExportProgressModal
        isOpen={isExporting}
        exportType={exportType}
        progress={progress}
        resultUrl={resultUrl}
        onClose={handleCloseModal}
        onRetry={handleRetry}
      />

      {/* PowerPoint Export Preview Dialog */}
      <ExportPreviewDialog
        isOpen={showPPTPreviewDialog}
        onClose={() => {
          setShowPPTPreviewDialog(false);
          setShowPPTRenderer(false);  // Unmount renderer when dialog closes
        }}
        presentation={presentation}
        theme={theme}
        viewMode={viewMode}
        wabiSabiLayout={wabiSabiLayout}
        onExportStart={() => {
          setIsExporting(true);
          setExportType('pptx');
        }}
        onExportComplete={() => {
          setShowPPTRenderer(false);
          setIsExporting(false);
        }}
        onExportError={() => {
          setShowPPTRenderer(false);
          setIsExporting(false);
        }}
      />
    </>
  );
};

export default ExportMenu;
