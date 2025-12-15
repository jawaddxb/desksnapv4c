

import React, { useState, useCallback } from 'react';
import { WabiSabiStage } from './WabiSabiStage';
import { getLayout } from '@/lib/layoutRegistry';
import { SlideContentEditor } from './SlideContentEditor';
import { LayoutToolbar } from './LayoutToolbar';
import { Dashboard } from './Dashboard';
import { SpeakerNotesPanel } from './SpeakerNotesPanel';
import { generateHolisticImageSuggestions } from '@/services/presentationPlanService';
import type { MainStageProps } from '@/types/mainStage';

// Re-export domain interfaces for consumers that need specific subsets
export type {
  SlideDisplayProps,
  SlideEditingProps,
  AIRefinementProps,
  PresentationContextProps,
  DeckOperationsProps,
  IdeationOperationsProps,
  RoughDraftOperationsProps,
  WorkspaceModeProps,
  DashboardProps,
  MainStageProps,
} from '@/types/mainStage';

export const MainStage: React.FC<MainStageProps> = ({
    slide,
    theme,
    activeWabiSabiLayout,
    onRegenerateSlide,
    onRegenerateAll,
    onUpdateSlide,
    printMode = false,
    viewMode = 'standard',
    onRefineContent,
    onEnhanceImage,
    isRefining = false,
    savedDecks = [],
    onLoadDeck,
    onDeleteDeck,
    onCloneDeck,
    onCreateDeck,
    onCreateDeckWithTopic,
    isGeneratingDeck = false,
    onImport,
    onIdeate,
    // Ideation props
    savedIdeations = [],
    isLoadingIdeations = false,
    onLoadIdeation,
    onDeleteIdeation,
    onGenerateDeckFromIdeation,
    onViewJournal,
    // Rough draft props
    savedRoughDrafts = [],
    isLoadingRoughDrafts = false,
    onLoadRoughDraft,
    onDeleteRoughDraft,
    onApproveRoughDraft,
    // Sources mode props
    onOpenSources,
    // Beautify mode props
    onBeautify,
    presentation,
    activeSlideIndex = 0
}) => {
  // Speaker Notes Panel state
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const toggleNotesPanel = () => setShowNotesPanel(prev => !prev);

  // Generate suggestions callback for the image prompt toolbar
  const handleGenerateSuggestions = useCallback(async (): Promise<string[]> => {
    if (!presentation) return [];
    return generateHolisticImageSuggestions(presentation, activeSlideIndex);
  }, [presentation, activeSlideIndex]);

  // Regenerate image handler
  const handleRegenerateImage = useCallback(() => {
    onRegenerateSlide?.('same');
  }, [onRegenerateSlide]);

  // 1. Dashboard (Empty State Replaced)
  if (!slide) {
    return (
        <Dashboard
            savedDecks={savedDecks}
            savedIdeations={savedIdeations}
            isLoadingIdeations={isLoadingIdeations}
            savedRoughDrafts={savedRoughDrafts}
            isLoadingRoughDrafts={isLoadingRoughDrafts}
            onLoad={onLoadDeck || (() => {})}
            onDelete={onDeleteDeck || (() => {})}
            onClone={onCloneDeck}
            onCreateNew={onCreateDeck || (() => {})}
            onCreateDeckWithTopic={onCreateDeckWithTopic}
            isGeneratingDeck={isGeneratingDeck}
            onImport={onImport || (() => {})}
            onIdeate={onIdeate}
            onOpenSources={onOpenSources}
            onBeautify={onBeautify}
            onLoadIdeation={onLoadIdeation}
            onDeleteIdeation={onDeleteIdeation}
            onGenerateDeckFromIdeation={onGenerateDeckFromIdeation}
            onViewJournal={onViewJournal}
            onLoadRoughDraft={onLoadRoughDraft}
            onDeleteRoughDraft={onDeleteRoughDraft}
            onApproveRoughDraft={onApproveRoughDraft}
        />
    );
  }

  // 2. Wabi-Sabi Mode (Generative Design System)
  if (viewMode === 'wabi-sabi') {
      return (
        <>
            <WabiSabiStage
                slide={slide}
                theme={theme}
                layoutStyle={activeWabiSabiLayout}
                onUpdateSlide={onUpdateSlide}
                printMode={printMode}
                onToggleNotes={toggleNotesPanel}
                presentation={presentation}
                onRegenerateImage={handleRegenerateImage}
                onGenerateSuggestions={handleGenerateSuggestions}
            />
            {/* Speaker Notes Panel - works in both modes */}
            {showNotesPanel && !printMode && onUpdateSlide && (
                <SpeakerNotesPanel
                    slide={slide}
                    onUpdateSlide={onUpdateSlide}
                    onClose={() => setShowNotesPanel(false)}
                />
            )}
        </>
      );
  }

  // 3. Standard Layout Selection - uses layout registry for OCP compliance
  const renderLayout = () => {
    const LayoutComponent = getLayout(slide.layoutType);

    return (
        <LayoutComponent slide={slide} theme={theme} printMode={printMode}>
            <SlideContentEditor slide={slide} theme={theme} onUpdateSlide={onUpdateSlide} printMode={printMode} />
        </LayoutComponent>
    );
  };

  // 4. Main Render
  return (
    <div className={`w-full h-full relative group/stage ${printMode ? '' : 'transition-colors duration-500'}`} style={{ background: theme.colors.background }}>
        
        {/* Render the selected layout structure */}
        {renderLayout()}

        {/* Floating Toolbar (Only visible in Standard edit mode) */}
        {!printMode && onUpdateSlide && viewMode === 'standard' && (
            <LayoutToolbar
                slide={slide}
                onUpdateSlide={onUpdateSlide}
                onRefineContent={onRefineContent}
                onEnhanceImage={onEnhanceImage}
                isRefining={isRefining}
                onToggleNotes={toggleNotesPanel}
                presentation={presentation}
                onRegenerateImage={handleRegenerateImage}
                onGenerateSuggestions={handleGenerateSuggestions}
            />
        )}

        {/* Speaker Notes Panel - works in both modes */}
        {showNotesPanel && !printMode && onUpdateSlide && (
            <SpeakerNotesPanel
                slide={slide}
                onUpdateSlide={onUpdateSlide}
                onClose={() => setShowNotesPanel(false)}
            />
        )}

    </div>
  );
};