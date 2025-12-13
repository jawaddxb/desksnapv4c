/**
 * Export Renderer Component
 *
 * Renders slides offscreen at exact dimensions for PDF/image capture.
 * Listens for render-slide-for-pdf events to update the displayed slide.
 */

import React, { useState, useEffect } from 'react';
import { Presentation, Slide, Theme } from '../../types';
import { MainStage } from '../MainStage';
import { WabiSabiStage } from '../WabiSabiStage';
import { THEMES } from '../../config/themes';

interface ExportRendererProps {
  width?: number;
  height?: number;
}

interface RenderSlideEvent {
  slideIndex: number;
  presentation: Presentation;
  theme: Theme;
  viewMode: 'standard' | 'wabi-sabi';
  wabiSabiLayout?: string;
}

export const ExportRenderer: React.FC<ExportRendererProps> = ({
  width = 1920,
  height = 1080,
}) => {
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES['swiss-design']);
  const [viewMode, setViewMode] = useState<'standard' | 'wabi-sabi'>('standard');
  const [wabiSabiLayout, setWabiSabiLayout] = useState<string | undefined>();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleRenderSlide = (event: CustomEvent<RenderSlideEvent>) => {
      const { slideIndex, presentation, theme, viewMode: mode, wabiSabiLayout: layout } = event.detail;

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

    window.addEventListener('render-slide-for-pdf', handleRenderSlide as EventListener);
    window.addEventListener('pdf-export-complete', handleExportComplete);

    return () => {
      window.removeEventListener('render-slide-for-pdf', handleRenderSlide as EventListener);
      window.removeEventListener('pdf-export-complete', handleExportComplete);
    };
  }, []);

  // Always render the container div so it's available for PDF capture
  // Only conditionally render the slide content inside
  return (
    <div
      id="pdf-export-renderer"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        zIndex: -1,
        pointerEvents: 'none',
        // Hide visually but maintain layout calculation for text wrapping
        // Using clip-path instead of left: -9999px because off-screen positioning
        // breaks browser layout calculations for text wrapping
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)',
        // Ensure colors are captured correctly
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {isActive && currentSlide && (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            background: currentTheme.colors.background,
          }}
        >
          {viewMode === 'wabi-sabi' ? (
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
          )}
        </div>
      )}
    </div>
  );
};

export default ExportRenderer;
