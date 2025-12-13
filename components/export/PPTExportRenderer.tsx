/**
 * PPT Export Renderer Component
 *
 * Renders slides offscreen at 1920x1080 for dom-to-pptx capture.
 * Listens for render-slide-for-ppt events to update the displayed slide.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Presentation, Slide, Theme } from '../../types';
import { MainStage } from '../MainStage';
import { WabiSabiStage } from '../WabiSabiStage';
import { THEMES } from '../../config/themes';

interface PPTExportRendererProps {
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

export const PPTExportRenderer: React.FC<PPTExportRendererProps> = ({
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

    window.addEventListener('render-slide-for-ppt', handleRenderSlide as EventListener);
    window.addEventListener('ppt-export-complete', handleExportComplete);

    return () => {
      window.removeEventListener('render-slide-for-ppt', handleRenderSlide as EventListener);
      window.removeEventListener('ppt-export-complete', handleExportComplete);
    };
  }, []);

  if (!isActive || !currentSlide) {
    return null;
  }

  return (
    <div
      id="ppt-export-renderer"
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        zIndex: -1,
        pointerEvents: 'none',
        // Ensure colors are captured correctly
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      <div
        id="ppt-slide-content"
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
    </div>
  );
};

export default PPTExportRenderer;
