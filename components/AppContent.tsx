/**
 * AppContent Component
 *
 * Main application content orchestrator.
 * Delegates to specialized coordinators based on workspace mode.
 *
 * REFACTORED: Handlers extracted to hooks/handlers/ for better organization.
 */

import React, { useState, useEffect } from 'react';
import { WorkspaceRenderer } from './WorkspaceRenderer';
import { PrintView } from './PrintView';
import { IdeationResumePrompt } from './ideation/IdeationResumePrompt';
import { WelcomeModal } from './onboarding';
import {
  ChatCoordinator,
  DeckViewCoordinator,
  PresentationModeCoordinator,
} from '@/coordinators';
import { useWorkspaceMode } from '@/contexts/WorkspaceModeContext';
import { useChatUI } from '@/contexts/ChatUIContext';
import { useDeck } from '@/hooks/useDeck';
import { useDuplicatePresentation } from '@/hooks/mutations/usePresentationMutations';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { useChat } from '@/hooks/useChat';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useSavedIdeations, useIdeationSession } from '@/hooks/queries/useIdeationQueries';
import { useSavedRoughDrafts, useDeleteRoughDraft, useApproveRoughDraft, useRoughDraft } from '@/hooks/queries/useRoughDraftQueries';
import { preloadCommonFonts } from '@/lib/fonts';
import { migrateIdeationSessions, isMigrationComplete } from '@/services/migration/ideationMigration';

// Handler hooks
import { useChatHandlers, useDeckHandlers, useWorkspaceHandlers } from '@/hooks/handlers';

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
  const chatUI = useChatUI();
  const { isChatOpen, showCreateChat } = chatUI;

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
  const chat = useChat({ isChatOpen: isChatOpen || showCreateChat });

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

  // ============ Handler Hooks ============

  const { handleSendMessage, handleCreateNew } = useChatHandlers({
    inputValue: chatUI.inputValue,
    setInputValue: chatUI.setInputValue,
    setIsChatOpen: chatUI.setIsChatOpen,
    setShowCreateChat: chatUI.setShowCreateChat,
    selectedImageStyle: chatUI.selectedImageStyle,
    generationMode: chatUI.generationMode,
    enableDraftPreview: chatUI.enableDraftPreview,
    resetForNewChat: chatUI.resetForNewChat,
    addMessage: chat.addMessage,
    createUserMessage: chat.createUserMessage,
    createSystemMessage: chat.createSystemMessage,
    createModelMessage: chat.createModelMessage,
    resetMessages: chat.resetMessages,
    isGenerating,
    createDeck: actions.createDeck,
    goToRoughDraft,
  });

  const {
    handleCloneDeck,
    handleCloneCurrentDeck,
    handleBuildDeckFromIdeation,
    handleApproveRoughDraft,
    handleBeautifyComplete,
  } = useDeckHandlers({
    currentPresentation,
    addMessage: chat.addMessage,
    createSystemMessage: chat.createSystemMessage,
    createModelMessage: chat.createModelMessage,
    loadDeck: actions.loadDeck,
    createDeckFromPlan: actions.createDeckFromPlan,
    createPresentationFromSlides: actions.createPresentationFromSlides,
    duplicateMutation,
    goToDashboard,
    getRoughDraftState,
  });

  const workspaceHandlers = useWorkspaceHandlers({
    lastIdeationSessionId,
    setLastIdeationSessionId,
    setShowIdeationResumePrompt,
    goToIdeation,
    goToRoughDraft,
    goToSources,
    goToBeautify,
    refetchIdeations,
    deleteRoughDraftMutation,
    approveRoughDraftMutation,
    loadDeck: actions.loadDeck,
    markWelcomeSeen,
    handleCreateNew,
  });

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
          messages={chat.messages}
          isGenerating={isGenerating}
          onSendMessage={handleSendMessage}
          modalScrollRef={chat.modalScrollRef}
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
            messages={chat.messages}
            sidebarScrollRef={chat.sidebarScrollRef}
            savedIdeations={savedIdeations}
            isLoadingIdeations={isLoadingIdeations}
            savedRoughDrafts={savedRoughDrafts}
            isLoadingRoughDrafts={isLoadingRoughDrafts}
            sourceIdeation={sourceIdeation}
            sourceRoughDraft={sourceRoughDraft}
            onSendMessage={handleSendMessage}
            onCreateDeck={handleCreateNew}
            onIdeate={workspaceHandlers.handleIdeate}
            onLoadIdeation={workspaceHandlers.handleLoadIdeation}
            onDeleteIdeation={workspaceHandlers.handleDeleteIdeation}
            onLoadRoughDraft={workspaceHandlers.handleLoadRoughDraft}
            onDeleteRoughDraft={workspaceHandlers.handleDeleteRoughDraft}
            onApproveRoughDraft={workspaceHandlers.handleApproveRoughDraftFromDashboard}
            onCloneDeck={handleCloneDeck}
            onCloneCurrentDeck={handleCloneCurrentDeck}
            onOpenSources={workspaceHandlers.handleOpenSources}
            onOpenBeautify={workspaceHandlers.handleOpenBeautify}
            onViewSourceIdeation={workspaceHandlers.handleViewSourceIdeation}
            onViewSourceRoughDraft={workspaceHandlers.handleViewSourceRoughDraft}
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
          onSelectPath={workspaceHandlers.handleWelcomePathSelect}
          onSkip={workspaceHandlers.handleWelcomeSkip}
        />
      )}

      {/* Ideation Resume Prompt */}
      <IdeationResumePrompt
        isOpen={showIdeationResumePrompt}
        onResume={workspaceHandlers.handleResumeLastSession}
        onStartFresh={workspaceHandlers.handleStartFreshSession}
        onChooseSaved={workspaceHandlers.handleChooseFromSaved}
        onClose={workspaceHandlers.handleCloseResumePrompt}
      />
    </>
  );
}
