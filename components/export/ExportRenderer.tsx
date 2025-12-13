/**
 * Export Renderer Component
 *
 * Unified renderer for PDF and PPT export operations.
 * Renders slides offscreen at exact dimensions for capture.
 *
 * Usage:
 *   <ExportRenderer type="pdf" />  // For PDF export
 *   <ExportRenderer type="ppt" />  // For PPT export
 *
 * The component listens for render events and displays slides for capture:
 * - PDF: Uses clip-path for correct text wrapping calculations
 * - PPT: Uses left offset positioning for dom-to-pptx compatibility
 */

import React, { useState, useEffect } from 'react';
import { Slide, Theme } from '@/types';
import { MainStage } from '../MainStage';
import { WabiSabiStage } from '../WabiSabiStage';
import { THEMES } from '@/config/themes';
import {
  SLIDE_DIMENSIONS,
  EXPORT_EVENTS,
  EXPORT_ELEMENT_IDS,
} from '@/config/exportConstants';
import type { RenderSlideEventDetail, ExportViewMode } from '@/types/export';

// =============================================================================
// TYPES
// =============================================================================

export type ExportRendererType = 'pdf' | 'ppt';

interface ExportRendererProps {
  /** Export type determines event listeners and positioning strategy */
  type: ExportRendererType;
  /** Override default slide width */
  width?: number;
  /** Override default slide height */
  height?: number;
}

// =============================================================================
// CONFIG
// =============================================================================

/**
 * Configuration for each export type
 */
const RENDERER_CONFIG: Record<ExportRendererType, {
  renderEvent: string;
  completeEvent: string;
  elementId: string;
  /** PDF uses clip-path for text wrapping; PPT uses offset for dom-to-pptx */
  useClipPath: boolean;
}> = {
  pdf: {
    renderEvent: EXPORT_EVENTS.PDF_RENDER,
    completeEvent: EXPORT_EVENTS.PDF_COMPLETE,
    elementId: EXPORT_ELEMENT_IDS.PDF_RENDERER,
    useClipPath: true,
  },
  ppt: {
    renderEvent: EXPORT_EVENTS.PPT_RENDER,
    completeEvent: EXPORT_EVENTS.PPT_COMPLETE,
    elementId: EXPORT_ELEMENT_IDS.PPT_RENDERER,
    useClipPath: false,
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const ExportRenderer: React.FC<ExportRendererProps> = ({
  type,
  width = SLIDE_DIMENSIONS.width,
  height = SLIDE_DIMENSIONS.height,
}) => {
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES['swiss-design']);
  const [viewMode, setViewMode] = useState<ExportViewMode>('standard');
  const [wabiSabiLayout, setWabiSabiLayout] = useState<string | undefined>();
  const [isActive, setIsActive] = useState(false);

  const config = RENDERER_CONFIG[type];

  useEffect(() => {
    const handleRenderSlide = (event: CustomEvent<RenderSlideEventDetail>) => {
      const {
        slideIndex,
        presentation,
        theme,
        viewMode: mode,
        wabiSabiLayout: layout,
      } = event.detail;

      setCurrentSlide(presentation.slides[slideIndex]);
      setCurrentTheme(theme);
      setViewMode(mode);
      setWabiSabiLayout(layout);
      setIsActive(true);
    };

    const handleExportComplete = () => {
      setIsActive(false);
      setCurrentSlide(null);
    };

    window.addEventListener(config.renderEvent, handleRenderSlide as EventListener);
    window.addEventListener(config.completeEvent, handleExportComplete);

    return () => {
      window.removeEventListener(config.renderEvent, handleRenderSlide as EventListener);
      window.removeEventListener(config.completeEvent, handleExportComplete);
    };
  }, [config.renderEvent, config.completeEvent]);

  // For PPT, return null when not active (dom-to-pptx behavior)
  // For PDF, always render container (html2canvas behavior)
  if (type === 'ppt' && (!isActive || !currentSlide)) {
    return null;
  }

  /**
   * Positioning strategy:
   * - PDF: Uses clip-path to hide visually while maintaining layout calculations
   *   for accurate text wrapping. off-screen positioning breaks browser layout.
   * - PPT: Uses left offset positioning as required by dom-to-pptx library.
   */
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    zIndex: -1,
    pointerEvents: 'none',
    // Ensure colors are captured correctly
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
    ...(config.useClipPath
      ? {
          // PDF: clip-path maintains layout calculations for text wrapping
          left: 0,
          clip: 'rect(0, 0, 0, 0)',
          clipPath: 'inset(50%)',
        }
      : {
          // PPT: left offset for dom-to-pptx compatibility
          left: '-9999px',
        }),
  };

  const slideContainerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    background: currentTheme.colors.background,
  };

  /**
   * Render the slide content
   */
  const renderSlideContent = () => {
    if (!currentSlide) return null;

    return viewMode === 'wabi-sabi' ? (
      <WabiSabiStage
        slide={currentSlide}
        theme={currentTheme}
        layoutStyle={wabiSabiLayout}
        printMode={true}
      />
    ) : (
      <MainStage
        slide={currentSlide}
        theme={currentTheme}
        printMode={true}
        viewMode="standard"
      />
    );
  };

  return (
    <div id={config.elementId} style={containerStyle}>
      {/* For PPT, wrap in additional content div for dom-to-pptx to clone */}
      {type === 'ppt' ? (
        <div id={EXPORT_ELEMENT_IDS.PPT_SLIDE_CONTENT} style={slideContainerStyle}>
          {renderSlideContent()}
        </div>
      ) : (
        // For PDF, only render when active
        isActive && currentSlide && (
          <div style={slideContainerStyle}>
            {renderSlideContent()}
          </div>
        )
      )}
    </div>
  );
};

export default ExportRenderer;
