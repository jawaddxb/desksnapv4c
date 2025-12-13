/**
 * DeckViewCoordinator
 *
 * Handles the main deck editing workspace including:
 * - AppHeader (theme/typography/layout controls)
 * - AppSidebar (slide navigation)
 * - MainStage (slide display or dashboard)
 * - ArchetypeChangeDialog
 */

import React, { useState, useCallback } from 'react';
import { MainStage } from '@/components/MainStage';
import { AppHeader } from '@/components/AppHeader';
import { AppSidebar } from '@/components/AppSidebar';
import { AgentActivityPanel } from '@/components/AgentActivityPanel';
import { ArchetypeChangeDialog } from '@/components/ArchetypeChangeDialog';
import { getArchetypeVisualStyle } from '@/lib/archetypeVisualStyles';
import { useChatUI } from '@/contexts/ChatUIContext';
import type { DeckViewCoordinatorProps } from '@/types/deckViewCoordinator';

// Re-export domain interfaces for consumers that need specific subsets
export type {
  PresentationState,
  ThemeLayoutState,
  ThemeActions,
  SlideActions,
  ImageActions,
  DeckLifecycleActions,
  DeckActions,
  ChatState,
  IdeationData,
  RoughDraftData,
  SourceContentData,
  DeckHandlers,
  IdeationHandlers,
  RoughDraftHandlers,
  ModeNavigationHandlers,
  DeckViewCoordinatorProps,
} from '@/types/deckViewCoordinator';

export function DeckViewCoordinator({
  currentPresentation,
  savedDecks,
  activeSlideIndex,
  setActiveSlideIndex,
  isGenerating,
  isRefining,
  activeTheme,
  activeWabiSabiLayout,
  viewMode,
  setViewMode,
  saveStatus,
  actions,
  messages,
  sidebarScrollRef,
  savedIdeations,
  isLoadingIdeations,
  savedRoughDrafts,
  isLoadingRoughDrafts,
  sourceIdeation,
  sourceRoughDraft,
  onSendMessage,
  onCreateDeck,
  onIdeate,
  onLoadIdeation,
  onDeleteIdeation,
  onLoadRoughDraft,
  onDeleteRoughDraft,
  onApproveRoughDraft,
  onCloneDeck,
  onCloneCurrentDeck,
  onOpenSources,
  onOpenBeautify,
  onViewSourceIdeation,
  onViewSourceRoughDraft,
  onStartPresenting,
}: DeckViewCoordinatorProps) {
  const {
    inputValue,
    setInputValue,
    isChatOpen,
    setIsChatOpen,
    selectedImageStyle,
    setSelectedImageStyle,
    generationMode,
    setGenerationMode,
  } = useChatUI();

  // Archetype change dialog state
  const [archetypeChangeDialog, setArchetypeChangeDialog] = useState<{
    isOpen: boolean;
    previousArchetype: string;
    newArchetype: string;
  }>({ isOpen: false, previousArchetype: '', newArchetype: '' });

  // Handle archetype selection - show dialog if presentation exists and has images
  const handleSetWabiSabiLayout = useCallback((layoutName: string) => {
    if (!currentPresentation || layoutName === activeWabiSabiLayout) {
      actions.setWabiSabiLayout(layoutName);
      return;
    }

    const hasImages = currentPresentation.slides.some(slide => slide.imageUrl);

    if (hasImages) {
      setArchetypeChangeDialog({
        isOpen: true,
        previousArchetype: activeWabiSabiLayout,
        newArchetype: layoutName,
      });
    } else {
      actions.setWabiSabiLayout(layoutName);
    }
  }, [currentPresentation, activeWabiSabiLayout, actions]);

  // Handle dialog confirmation
  const handleArchetypeChangeConfirm = useCallback((regenerateImages: boolean) => {
    const { newArchetype } = archetypeChangeDialog;

    actions.setWabiSabiLayout(newArchetype);

    if (regenerateImages) {
      const newVisualStyle = getArchetypeVisualStyle(newArchetype);
      actions.updateVisualStyleAndRegenerateImages(newVisualStyle, true);
    }
  }, [archetypeChangeDialog, actions]);

  return (
    <>
      {/* AGENT ACTIVITY PANEL - shows during image generation */}
      {currentPresentation && <AgentActivityPanel />}

      {/* LEFT SIDEBAR */}
      {currentPresentation && (
        <AppSidebar
          currentPresentation={currentPresentation}
          messages={messages}
          isGenerating={isGenerating}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={onSendMessage}
          selectedImageStyle={selectedImageStyle}
          setSelectedImageStyle={setSelectedImageStyle}
          generationMode={generationMode}
          setGenerationMode={setGenerationMode}
          activeSlideIndex={activeSlideIndex}
          setActiveSlideIndex={setActiveSlideIndex}
          onMoveSlide={actions.moveSlide}
          scrollRef={sidebarScrollRef}
          viewMode={viewMode}
          activeWabiSabiLayout={activeWabiSabiLayout}
          sourceIdeation={sourceIdeation}
          sourceRoughDraft={sourceRoughDraft}
          onViewSourceIdeation={onViewSourceIdeation}
          onViewSourceRoughDraft={onViewSourceRoughDraft}
          onIdeate={onIdeate}
          onGoToDashboard={actions.closeDeck}
          ideationsCount={savedIdeations.length}
          roughDraftsCount={savedRoughDrafts.length}
        />
      )}

      {/* MAIN STAGE AREA */}
      <div
        className="flex-1 bg-[#111111] flex flex-col relative overflow-hidden min-w-0"
        style={{ backgroundColor: currentPresentation ? activeTheme.colors.background : '#fafafa' }}
      >
        {/* HEADER */}
        <AppHeader
          currentPresentation={currentPresentation}
          activeTheme={activeTheme}
          activeWabiSabiLayout={activeWabiSabiLayout}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onApplyTheme={actions.applyTheme}
          onApplyTypography={actions.applyTypography}
          onSetWabiSabiLayout={handleSetWabiSabiLayout}
          onCycleWabiSabiLayout={actions.cycleWabiSabiLayout}
          onRegenerateAllImages={actions.regenerateAllImages}
          onRemixDeck={actions.remixDeck}
          setIsPresenting={onStartPresenting}
          onSave={actions.saveDeck}
          onClose={actions.closeDeck}
          onClone={onCloneCurrentDeck}
          onShuffleLayout={actions.shuffleLayoutVariants}
          onExportDeck={actions.exportDeck}
          saveStatus={saveStatus}
        />

        {/* MAIN STAGE / DASHBOARD */}
        <MainStage
          slide={currentPresentation ? currentPresentation.slides[activeSlideIndex] : null}
          theme={activeTheme}
          activeWabiSabiLayout={activeWabiSabiLayout}
          onRegenerateSlide={actions.regenerateSlideImage}
          onRegenerateAll={actions.regenerateAllImages}
          onUpdateSlide={actions.updateSlide}
          viewMode={viewMode}
          printMode={false}
          onRefineContent={actions.refineSlideContent}
          onEnhanceImage={actions.enhanceSlideImage}
          isRefining={isRefining}
          savedDecks={savedDecks}
          onLoadDeck={actions.loadDeck}
          onDeleteDeck={actions.deleteDeck}
          onCloneDeck={onCloneDeck}
          onCreateDeck={onCreateDeck}
          onImport={actions.importDeck}
          onIdeate={onIdeate}
          onOpenSources={onOpenSources}
          onBeautify={onOpenBeautify}
          savedIdeations={savedIdeations}
          isLoadingIdeations={isLoadingIdeations}
          onLoadIdeation={onLoadIdeation}
          onDeleteIdeation={onDeleteIdeation}
          savedRoughDrafts={savedRoughDrafts}
          isLoadingRoughDrafts={isLoadingRoughDrafts}
          onLoadRoughDraft={onLoadRoughDraft}
          onDeleteRoughDraft={onDeleteRoughDraft}
          onApproveRoughDraft={onApproveRoughDraft}
          presentation={currentPresentation}
          activeSlideIndex={activeSlideIndex}
        />
      </div>

      {/* Archetype Change Confirmation Dialog */}
      <ArchetypeChangeDialog
        isOpen={archetypeChangeDialog.isOpen}
        onClose={() => setArchetypeChangeDialog(prev => ({ ...prev, isOpen: false }))}
        previousArchetype={archetypeChangeDialog.previousArchetype}
        newArchetype={archetypeChangeDialog.newArchetype}
        onConfirm={handleArchetypeChangeConfirm}
      />
    </>
  );
}
