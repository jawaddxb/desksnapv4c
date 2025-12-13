/**
 * DeckWorkspace Component
 *
 * Main workspace for deck editing and dashboard view.
 * Includes sidebar, header, main stage, and chat modal.
 *
 * SRP: Single responsibility - deck editing workspace UI.
 */

import React from 'react';
import { Presentation, Slide, Theme, ViewMode, GenerationMode, Message } from '../../types';
import { IdeationSession } from '../../types/ideation';
import { RoughDraft } from '../../types/roughDraft';
import { MainStage } from '../MainStage';
import { ChatInterface } from '../ChatInterface';
import { AppHeader } from '../AppHeader';
import { AppSidebar } from '../AppSidebar';
import { AgentActivityPanel } from '../AgentActivityPanel';
import { PresentingOverlay } from './PresentingOverlay';
import { IMAGE_STYLES } from '../../lib/themes';
import { useWorkspaceMode } from '../../contexts/WorkspaceModeContext';

type ImageStyle = typeof IMAGE_STYLES[number];
type SaveStatus = 'idle' | 'saving' | 'saved';

export interface DeckWorkspaceProps {
  // Presentation state
  currentPresentation: Presentation | null;
  savedDecks: Presentation[];
  activeSlideIndex: number;
  setActiveSlideIndex: (index: number) => void;
  isGenerating: boolean;
  isRefining: boolean;
  activeTheme: Theme;
  activeWabiSabiLayout: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  saveStatus: SaveStatus;

  // Chat state
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  showCreateChat: boolean;
  setShowCreateChat: (show: boolean) => void;
  selectedImageStyle: ImageStyle;
  setSelectedImageStyle: (style: ImageStyle) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  enableDraftPreview: boolean;
  setEnableDraftPreview: (enabled: boolean) => void;
  sidebarScrollRef: React.RefObject<HTMLDivElement | null>;
  modalScrollRef: React.RefObject<HTMLDivElement | null>;

  // Ideation data
  savedIdeations: IdeationSession[];
  isLoadingIdeations: boolean;
  sourceIdeation: IdeationSession | null | undefined;

  // Rough draft data
  savedRoughDrafts: RoughDraft[];
  isLoadingRoughDrafts: boolean;
  sourceRoughDraft: RoughDraft | null | undefined;

  // Deck actions
  actions: {
    createDeck: (topic: string, imageStyleOverride: ImageStyle, generationMode?: GenerationMode) => Promise<Slide[]>;
    saveDeck: () => Promise<void>;
    loadDeck: (id: string) => Promise<void>;
    closeDeck: () => Promise<void>;
    deleteDeck: (id: string) => Promise<void>;
    importDeck: (file: File) => Promise<void>;
    exportDeck: () => void;
    updateSlide: (updates: Partial<Slide>) => void;
    moveSlide: (fromIndex: number, toIndex: number) => void;
    shuffleLayoutVariants: () => void;
    regenerateSlideImage: (mode: 'same' | 'varied') => void;
    regenerateAllImages: (slides?: Slide[], visualStyle?: string) => void;
    remixDeck: (newStyle: string) => void;
    refineSlideContent: () => void;
    enhanceSlideImage: () => void;
    applyTheme: (themeId: string) => void;
    applyTypography: (headingFont: string, bodyFont: string) => void;
    setWabiSabiLayout: (layoutName: string) => void;
    cycleWabiSabiLayout: () => void;
    updateVisualStyleAndRegenerateImages: (newVisualStyle: string, regenerate?: boolean) => void;
  };

  // Navigation callbacks
  onSendMessage: () => Promise<void>;
  onCreateNew: () => void;
  onCloneDeck: (id: string) => void;
  onCloneCurrentDeck: () => void;
  onSetWabiSabiLayout: (layoutName: string) => void;

  // Ideation callbacks
  onIdeate: () => void;
  onLoadIdeation: (id: string) => void;
  onDeleteIdeation: (id: string) => void;
  onGenerateDeckFromIdeation: (id: string) => void;
  onViewJournal: (id: string) => void;
  onViewSourceIdeation: (id: string) => void;

  // Rough draft callbacks
  onLoadRoughDraft: (id: string) => void;
  onDeleteRoughDraft: (id: string) => void;
  onApproveRoughDraft: (id: string) => void;
  onViewSourceRoughDraft: (id: string) => void;

  // Other workspace callbacks
  onOpenSources: (preset: 'video' | 'web' | 'mixed', recipe: 'training' | 'explainer' | 'brief' | 'pitch') => void;
  onBeautify: () => void;

  // Keyboard navigation (for presenting)
  goToNextSlide: () => void;
  goToPreviousSlide: () => void;
}

export const DeckWorkspace: React.FC<DeckWorkspaceProps> = ({
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
  messages,
  inputValue,
  setInputValue,
  isChatOpen,
  setIsChatOpen,
  showCreateChat,
  setShowCreateChat,
  selectedImageStyle,
  setSelectedImageStyle,
  generationMode,
  setGenerationMode,
  enableDraftPreview,
  setEnableDraftPreview,
  sidebarScrollRef,
  modalScrollRef,
  savedIdeations,
  isLoadingIdeations,
  sourceIdeation,
  savedRoughDrafts,
  isLoadingRoughDrafts,
  sourceRoughDraft,
  actions,
  onSendMessage,
  onCreateNew,
  onCloneDeck,
  onCloneCurrentDeck,
  onSetWabiSabiLayout,
  onIdeate,
  onLoadIdeation,
  onDeleteIdeation,
  onGenerateDeckFromIdeation,
  onViewJournal,
  onViewSourceIdeation,
  onLoadRoughDraft,
  onDeleteRoughDraft,
  onApproveRoughDraft,
  onViewSourceRoughDraft,
  onOpenSources,
  onBeautify,
  goToNextSlide,
  goToPreviousSlide,
}) => {
  const { isPresenting, startPresenting } = useWorkspaceMode();

  return (
    <>
      <div
        id="app-ui"
        className="flex h-screen w-full bg-black overflow-hidden text-white font-sans selection:bg-white/20 relative"
      >
        {/* FLOATING CHAT MODAL */}
        {(currentPresentation || showCreateChat) && (
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg h-[650px] bg-[#111111] shadow-2xl border border-white/20 z-[1000] flex flex-col overflow-hidden transition-all duration-150 origin-center ${
              isChatOpen || showCreateChat
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <ChatInterface
              mode="modal"
              messages={messages}
              isGenerating={isGenerating}
              currentPresentation={currentPresentation}
              isChatOpen={isChatOpen || showCreateChat}
              setIsChatOpen={(v) => {
                setIsChatOpen(v);
                if (!v) setShowCreateChat(false);
              }}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={onSendMessage}
              selectedImageStyle={selectedImageStyle}
              setSelectedImageStyle={setSelectedImageStyle}
              generationMode={generationMode}
              setGenerationMode={setGenerationMode}
              scrollRef={modalScrollRef}
              enableDraftPreview={enableDraftPreview}
              setEnableDraftPreview={setEnableDraftPreview}
            />
          </div>
        )}

        {/* AGENT ACTIVITY PANEL - shows during image generation */}
        {currentPresentation && !isPresenting && <AgentActivityPanel />}

        {/* LEFT SIDEBAR */}
        {!isPresenting && currentPresentation && (
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
          {!isPresenting && (
            <AppHeader
              currentPresentation={currentPresentation}
              activeTheme={activeTheme}
              activeWabiSabiLayout={activeWabiSabiLayout}
              viewMode={viewMode}
              setViewMode={setViewMode}
              onApplyTheme={actions.applyTheme}
              onApplyTypography={actions.applyTypography}
              onSetWabiSabiLayout={onSetWabiSabiLayout}
              onCycleWabiSabiLayout={actions.cycleWabiSabiLayout}
              onRegenerateAllImages={actions.regenerateAllImages}
              onRemixDeck={actions.remixDeck}
              setIsPresenting={startPresenting}
              onSave={actions.saveDeck}
              onClose={actions.closeDeck}
              onClone={onCloneCurrentDeck}
              onShuffleLayout={actions.shuffleLayoutVariants}
              onExportDeck={actions.exportDeck}
              saveStatus={saveStatus}
            />
          )}

          {/* PRESENTATION OVERLAYS */}
          {isPresenting && currentPresentation && (
            <PresentingOverlay
              activeSlideIndex={activeSlideIndex}
              totalSlides={currentPresentation.slides.length}
              onPreviousSlide={goToPreviousSlide}
              onNextSlide={goToNextSlide}
            />
          )}

          {/* MAIN STAGE / DASHBOARD */}
          <MainStage
            slide={currentPresentation ? currentPresentation.slides[activeSlideIndex] : null}
            theme={activeTheme}
            activeWabiSabiLayout={activeWabiSabiLayout}
            onRegenerateSlide={actions.regenerateSlideImage}
            onRegenerateAll={actions.regenerateAllImages}
            onUpdateSlide={actions.updateSlide}
            viewMode={viewMode}
            printMode={isPresenting}
            onRefineContent={actions.refineSlideContent}
            onEnhanceImage={actions.enhanceSlideImage}
            isRefining={isRefining}
            savedDecks={savedDecks}
            onLoadDeck={actions.loadDeck}
            onDeleteDeck={actions.deleteDeck}
            onCloneDeck={onCloneDeck}
            onCreateDeck={onCreateNew}
            onImport={actions.importDeck}
            onIdeate={onIdeate}
            onOpenSources={onOpenSources}
            onBeautify={onBeautify}
            savedIdeations={savedIdeations}
            isLoadingIdeations={isLoadingIdeations}
            onLoadIdeation={onLoadIdeation}
            onDeleteIdeation={onDeleteIdeation}
            onGenerateDeckFromIdeation={onGenerateDeckFromIdeation}
            onViewJournal={onViewJournal}
            savedRoughDrafts={savedRoughDrafts}
            isLoadingRoughDrafts={isLoadingRoughDrafts}
            onLoadRoughDraft={onLoadRoughDraft}
            onDeleteRoughDraft={onDeleteRoughDraft}
            onApproveRoughDraft={onApproveRoughDraft}
            presentation={currentPresentation}
            activeSlideIndex={activeSlideIndex}
          />
        </div>
      </div>
    </>
  );
};

export default DeckWorkspace;
