/**
 * AppContent Component
 *
 * Main application content orchestrator.
 * Delegates to specialized coordinators based on workspace mode.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { RoughDraftResult } from '../services/agents';
import { WorkspaceRenderer } from './WorkspaceRenderer';
import { PrintView } from './PrintView';
import { IdeationResumePrompt } from './ideation/IdeationResumePrompt';
import { WelcomeModal } from './onboarding';
import {
  ChatCoordinator,
  DeckViewCoordinator,
  PresentationModeCoordinator,
} from '../coordinators';
import { useWorkspaceMode } from '../contexts/WorkspaceModeContext';
import { useChatUI } from '../contexts/ChatUIContext';
import { useDeck } from '../hooks/useDeck';
import { useDuplicatePresentation } from '../hooks/mutations/usePresentationMutations';
import { useAnalytics } from '../hooks/useAnalytics';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { useChat } from '../hooks/useChat';
import { useOnboarding } from '../hooks/useOnboarding';
import { useSavedIdeations, useIdeationSession } from '../hooks/queries/useIdeationQueries';
import { useSavedRoughDrafts, useDeleteRoughDraft, useApproveRoughDraft, useRoughDraft } from '../hooks/queries/useRoughDraftQueries';
import { deleteIdeationSession } from '../services/api/ideationService';
import { preloadCommonFonts } from '../lib/fonts';
import { migrateIdeationSessions, isMigrationComplete } from '../services/migration/ideationMigration';

export function AppContent() {
  // ============ Workspace Mode (from context) ============
  const {
    isPresenting,
    isIdeation,
    isRoughDraft,
    isBeautify,
    isSources,
    goToDashboard,
    goToIdeation,
    goToRoughDraft,
    goToBeautify,
    goToSources,
    startPresenting,
    stopPresenting,
    getRoughDraftState,
  } = useWorkspaceMode();

  // ============ Chat UI State (from context) ============
  const {
    inputValue,
    setInputValue,
    isChatOpen,
    setIsChatOpen,
    selectedImageStyle,
    generationMode,
    showCreateChat,
    setShowCreateChat,
    enableDraftPreview,
    resetForNewChat,
  } = useChatUI();

  // Session resumption state
  const [lastIdeationSessionId, setLastIdeationSessionId] = useState<string | null>(null);
  const [showIdeationResumePrompt, setShowIdeationResumePrompt] = useState(false);

  // Onboarding state
  const {
    isLoaded: onboardingLoaded,
    isFirstTimeUser,
    markWelcomeSeen,
  } = useOnboarding();

  // Main deck hook
  const {
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
  } = useDeck();

  // Clone/duplicate mutation
  const duplicateMutation = useDuplicatePresentation();

  // Ideation sessions hook
  const { savedIdeations, isLoading: isLoadingIdeations, refetch: refetchIdeations } = useSavedIdeations();

  // Rough drafts hook
  const { savedRoughDrafts, isLoading: isLoadingRoughDrafts } = useSavedRoughDrafts();
  const deleteRoughDraftMutation = useDeleteRoughDraft();
  const approveRoughDraftMutation = useApproveRoughDraft();

  // Source content hooks
  const { data: sourceIdeation } = useIdeationSession(currentPresentation?.ideationSessionId || null);
  const { data: sourceRoughDraft } = useRoughDraft(currentPresentation?.sourceRoughDraftId || null);

  // Chat hook
  const {
    messages,
    addMessage,
    resetMessages,
    createSystemMessage,
    createModelMessage,
    createUserMessage,
    sidebarScrollRef,
    modalScrollRef,
  } = useChat({ isChatOpen: isChatOpen || showCreateChat });

  // Analytics hook
  useAnalytics({
    isPresenting,
    presentation: currentPresentation,
    activeSlideIndex,
    onRecordSession: actions.recordSession,
  });

  // Keyboard navigation hook
  const { goToNextSlide, goToPreviousSlide } = useKeyboardNavigation({
    isPresenting,
    presentation: currentPresentation,
    activeSlideIndex,
    setActiveSlideIndex,
    onExitPresentation: stopPresenting,
  });

  // Preload fonts
  useEffect(() => {
    preloadCommonFonts();
  }, []);

  // Run ideation migration
  useEffect(() => {
    if (!isMigrationComplete()) {
      migrateIdeationSessions()
        .then((result) => {
          if (result.migrated > 0 || result.failed > 0) {
            console.log(`[AppContent] Ideation migration: ${result.migrated} migrated, ${result.failed} failed`);
          }
        })
        .catch((error) => {
          console.error('[AppContent] Ideation migration error:', error);
        });
    }
  }, []);

  // ============ Handlers ============

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isGenerating) return;

    const topic = inputValue.trim();
    addMessage(createUserMessage(topic));
    setInputValue('');

    try {
      if (enableDraftPreview) {
        addMessage(createSystemMessage('Preparing rough draft preview...'));
        goToRoughDraft('copilot', {
          input: {
            topic,
            themeId: 'executive',
            visualStyle: selectedImageStyle.prompt,
          },
        });
        setIsChatOpen(false);
        setShowCreateChat(false);
      } else {
        addMessage(createSystemMessage('Constructing Layout & Selecting Theme...'));
        const newSlides = await actions.createDeck(topic, selectedImageStyle, generationMode);
        addMessage(createModelMessage(`Blueprint ready: ${newSlides.length} slides. Rendering visuals...`));
        setIsChatOpen(false);
        setShowCreateChat(false);
      }
    } catch (error) {
      console.error(error);
      addMessage(createSystemMessage('System Error. Check credentials.'));
    }
  }, [inputValue, isGenerating, enableDraftPreview, selectedImageStyle, generationMode, actions, addMessage, createUserMessage, createSystemMessage, createModelMessage, setInputValue, setIsChatOpen, setShowCreateChat, goToRoughDraft]);

  const handleCreateNew = useCallback(() => {
    resetForNewChat();
    resetMessages();
  }, [resetForNewChat, resetMessages]);

  const handleIdeate = useCallback(() => {
    if (lastIdeationSessionId) {
      setShowIdeationResumePrompt(true);
    } else {
      goToIdeation();
    }
  }, [lastIdeationSessionId, goToIdeation]);

  const handleOpenSources = useCallback((preset: 'video' | 'web' | 'mixed', recipe: 'training' | 'explainer' | 'brief' | 'pitch' = 'training') => {
    goToSources(preset, recipe);
  }, [goToSources]);

  const handleOpenBeautify = useCallback(() => {
    goToBeautify();
  }, [goToBeautify]);

  const handleBeautifyComplete = useCallback(async (slides: any[], themeId: string) => {
    try {
      await actions.createPresentationFromSlides(slides, themeId);
      goToDashboard();
    } catch (error) {
      console.error('Failed to create presentation from beautified slides:', error);
    }
  }, [actions, goToDashboard]);

  const handleLoadIdeation = useCallback((id: string) => {
    goToIdeation(id);
  }, [goToIdeation]);

  const handleDeleteIdeation = useCallback(async (id: string) => {
    try {
      await deleteIdeationSession(id);
      refetchIdeations();
    } catch (error) {
      console.error('Failed to delete ideation:', error);
    }
  }, [refetchIdeations]);

  const handleLoadRoughDraft = useCallback((id: string) => {
    goToRoughDraft('existing', { existingDraftId: id });
  }, [goToRoughDraft]);

  const handleDeleteRoughDraft = useCallback((id: string) => {
    deleteRoughDraftMutation.mutate(id);
  }, [deleteRoughDraftMutation]);

  const handleApproveRoughDraftFromDashboard = useCallback((id: string) => {
    approveRoughDraftMutation.mutate(
      { id },
      {
        onSuccess: (presentation) => {
          actions.loadDeck(presentation.id);
        },
      }
    );
  }, [approveRoughDraftMutation, actions]);

  const handleViewSourceIdeation = useCallback((id: string) => {
    goToIdeation(id);
  }, [goToIdeation]);

  const handleViewSourceRoughDraft = useCallback((id: string) => {
    goToRoughDraft('existing', { existingDraftId: id });
  }, [goToRoughDraft]);

  const handleCloneDeck = useCallback((id: string) => {
    duplicateMutation.mutate(id, {
      onSuccess: (clonedDeck) => {
        actions.loadDeck(clonedDeck.id);
      },
    });
  }, [duplicateMutation, actions]);

  const handleCloneCurrentDeck = useCallback(() => {
    if (currentPresentation) {
      handleCloneDeck(currentPresentation.id);
    }
  }, [currentPresentation, handleCloneDeck]);

  const handleBuildDeckFromIdeation = useCallback(async (deckPlan: {
    topic: string;
    slides: Array<{
      title: string;
      bulletPoints: string[];
      speakerNotes: string;
      imageVisualDescription: string;
      layoutType: string;
      alignment: string;
    }>;
    themeId: string;
    visualStyle: string;
  }) => {
    goToDashboard();
    addMessage(createSystemMessage(`Building deck from ideation: "${deckPlan.topic}"...`));
    try {
      await actions.createDeckFromPlan(deckPlan);
      addMessage(createModelMessage(`Deck created from ideation: ${deckPlan.slides.length} slides. Rendering visuals...`));
    } catch (error) {
      console.error('Error building deck from ideation:', error);
      addMessage(createSystemMessage('Error building deck from ideation plan.'));
    }
  }, [goToDashboard, addMessage, createSystemMessage, createModelMessage, actions]);

  const handleApproveRoughDraft = useCallback(async (result: RoughDraftResult) => {
    const roughDraftState = getRoughDraftState();
    if (!roughDraftState) return;

    const deckPlan = {
      topic: result.topic,
      themeId: result.themeId,
      visualStyle: result.visualStyle,
      slides: result.slides.map(s => ({
        title: s.title,
        bulletPoints: s.content,
        speakerNotes: s.speakerNotes,
        imageVisualDescription: s.imagePrompt,
        layoutType: s.layoutType,
        alignment: s.alignment,
        existingImageUrl: s.imageUrl,
      })),
    };

    try {
      await actions.createDeckFromPlan(deckPlan);
      addMessage(createModelMessage(`Deck created from rough draft: ${result.slides.length} slides.`));
    } catch (error) {
      console.error('Error creating deck from rough draft:', error);
      addMessage(createSystemMessage('Error creating deck from rough draft.'));
    }

    goToDashboard();
  }, [getRoughDraftState, actions, addMessage, createModelMessage, createSystemMessage, goToDashboard]);

  // Welcome modal handlers
  const handleWelcomePathSelect = useCallback((path: 'new-deck' | 'ideate' | 'beautify') => {
    markWelcomeSeen();
    switch (path) {
      case 'new-deck':
        handleCreateNew();
        break;
      case 'ideate':
        goToIdeation();
        break;
      case 'beautify':
        goToBeautify();
        break;
    }
  }, [markWelcomeSeen, goToIdeation, goToBeautify, handleCreateNew]);

  const handleWelcomeSkip = useCallback(() => {
    markWelcomeSeen();
  }, [markWelcomeSeen]);

  // Ideation resume handlers
  const handleResumeLastSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    if (lastIdeationSessionId) {
      goToIdeation(lastIdeationSessionId);
    } else {
      goToIdeation();
    }
  }, [lastIdeationSessionId, goToIdeation]);

  const handleStartFreshSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    setLastIdeationSessionId(null);
    goToIdeation();
  }, [goToIdeation]);

  const handleChooseFromSaved = useCallback(() => {
    setShowIdeationResumePrompt(false);
  }, []);

  const handleCloseResumePrompt = useCallback(() => {
    setShowIdeationResumePrompt(false);
  }, []);

  // ============ Render ============

  // Overlay workspaces (ideation, rough draft, beautify, sources)
  if (isIdeation || isRoughDraft || isBeautify || isSources) {
    return (
      <WorkspaceRenderer
        ideationProps={{
          onBuildDeck: handleBuildDeckFromIdeation,
          onSessionClose: (sessionId) => {
            if (sessionId) setLastIdeationSessionId(sessionId);
          },
        }}
        beautifyProps={{
          onComplete: handleBeautifyComplete,
        }}
        onApproveRoughDraft={handleApproveRoughDraft}
      />
    );
  }

  return (
    <>
      <div
        id="app-ui"
        className="flex h-screen w-full bg-black overflow-hidden text-white font-sans selection:bg-white/20 relative"
      >
        {/* FLOATING CHAT MODAL */}
        <ChatCoordinator
          currentPresentation={currentPresentation}
          messages={messages}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
          modalScrollRef={modalScrollRef}
        />

        {/* PRESENTATION MODE */}
        {isPresenting && currentPresentation ? (
          <PresentationModeCoordinator
            presentation={currentPresentation}
            activeSlideIndex={activeSlideIndex}
            activeTheme={activeTheme}
            activeWabiSabiLayout={activeWabiSabiLayout}
            viewMode={viewMode}
            onPreviousSlide={goToPreviousSlide}
            onNextSlide={goToNextSlide}
            onExit={stopPresenting}
          />
        ) : (
          /* DECK VIEW MODE */
          <DeckViewCoordinator
            currentPresentation={currentPresentation}
            savedDecks={savedDecks}
            activeSlideIndex={activeSlideIndex}
            setActiveSlideIndex={setActiveSlideIndex}
            isGenerating={isGenerating}
            isRefining={isRefining}
            activeTheme={activeTheme}
            activeWabiSabiLayout={activeWabiSabiLayout}
            viewMode={viewMode}
            setViewMode={setViewMode}
            saveStatus={saveStatus}
            actions={actions}
            messages={messages}
            sidebarScrollRef={sidebarScrollRef}
            savedIdeations={savedIdeations}
            isLoadingIdeations={isLoadingIdeations}
            savedRoughDrafts={savedRoughDrafts}
            isLoadingRoughDrafts={isLoadingRoughDrafts}
            sourceIdeation={sourceIdeation}
            sourceRoughDraft={sourceRoughDraft}
            onSendMessage={handleSendMessage}
            onCreateDeck={handleCreateNew}
            onIdeate={handleIdeate}
            onLoadIdeation={handleLoadIdeation}
            onDeleteIdeation={handleDeleteIdeation}
            onLoadRoughDraft={handleLoadRoughDraft}
            onDeleteRoughDraft={handleDeleteRoughDraft}
            onApproveRoughDraft={handleApproveRoughDraftFromDashboard}
            onCloneDeck={handleCloneDeck}
            onCloneCurrentDeck={handleCloneCurrentDeck}
            onOpenSources={handleOpenSources}
            onOpenBeautify={handleOpenBeautify}
            onViewSourceIdeation={handleViewSourceIdeation}
            onViewSourceRoughDraft={handleViewSourceRoughDraft}
            onStartPresenting={startPresenting}
          />
        )}
      </div>

      {/* PrintView - only when not presenting (PresentationModeCoordinator has its own) */}
      {!isPresenting && (
        <PrintView
          presentation={currentPresentation}
          theme={activeTheme}
          activeWabiSabiLayout={activeWabiSabiLayout}
          viewMode={viewMode}
        />
      )}

      {/* Welcome Modal for First-Time Users */}
      {onboardingLoaded && isFirstTimeUser && !currentPresentation && (
        <WelcomeModal
          onSelectPath={handleWelcomePathSelect}
          onSkip={handleWelcomeSkip}
        />
      )}

      {/* Ideation Resume Prompt */}
      <IdeationResumePrompt
        isOpen={showIdeationResumePrompt}
        onResume={handleResumeLastSession}
        onStartFresh={handleStartFreshSession}
        onChooseSaved={handleChooseFromSaved}
        onClose={handleCloseResumePrompt}
      />
    </>
  );
}
