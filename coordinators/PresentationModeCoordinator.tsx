/**
 * PresentationModeCoordinator
 *
 * Handles the presentation mode overlay including:
 * - Full-screen presentation view
 * - Keyboard navigation (via useKeyboardNavigation hook)
 * - Slide transitions
 */

import React from 'react';
import { PresentationModeOverlay } from '@/components/PresentationModeOverlay';
import { MainStage } from '@/components/MainStage';
import { PrintView } from '@/components/PrintView';
import { Presentation, Theme, ViewMode } from '@/types';

interface PresentationModeCoordinatorProps {
  presentation: Presentation;
  activeSlideIndex: number;
  activeTheme: Theme;
  activeWabiSabiLayout: string;
  viewMode: ViewMode;
  onPreviousSlide: () => void;
  onNextSlide: () => void;
  onExit: () => void;
}

export function PresentationModeCoordinator({
  presentation,
  activeSlideIndex,
  activeTheme,
  activeWabiSabiLayout,
  viewMode,
  onPreviousSlide,
  onNextSlide,
  onExit,
}: PresentationModeCoordinatorProps) {
  return (
    <>
      {/* MAIN STAGE AREA */}
      <div
        className="flex-1 bg-[#111111] flex flex-col relative overflow-hidden min-w-0"
        style={{ backgroundColor: activeTheme.colors.background }}
      >
        {/* PRESENTATION OVERLAY */}
        <PresentationModeOverlay
          presentation={presentation}
          activeSlideIndex={activeSlideIndex}
          onPreviousSlide={onPreviousSlide}
          onNextSlide={onNextSlide}
          onExit={onExit}
        />

        {/* MAIN STAGE in print mode */}
        <MainStage
          slide={presentation.slides[activeSlideIndex]}
          theme={activeTheme}
          activeWabiSabiLayout={activeWabiSabiLayout}
          viewMode={viewMode}
          printMode={true}
          presentation={presentation}
          activeSlideIndex={activeSlideIndex}
          // Disabled handlers in presentation mode
          onRegenerateSlide={() => {}}
          onRegenerateAll={() => {}}
          onUpdateSlide={() => {}}
          onRefineContent={() => {}}
          onEnhanceImage={() => {}}
          isRefining={false}
          savedDecks={[]}
          onLoadDeck={() => {}}
          onDeleteDeck={() => {}}
          onCloneDeck={() => {}}
          onCreateDeck={() => {}}
          onImport={() => {}}
          onIdeate={() => {}}
          onOpenSources={() => {}}
          onBeautify={() => {}}
          savedIdeations={[]}
          isLoadingIdeations={false}
          onLoadIdeation={() => {}}
          onDeleteIdeation={() => {}}
          savedRoughDrafts={[]}
          isLoadingRoughDrafts={false}
          onLoadRoughDraft={() => {}}
          onDeleteRoughDraft={() => {}}
          onApproveRoughDraft={() => {}}
        />
      </div>

      {/* PrintView for print functionality */}
      <PrintView
        presentation={presentation}
        theme={activeTheme}
        activeWabiSabiLayout={activeWabiSabiLayout}
        viewMode={viewMode}
      />
    </>
  );
}
