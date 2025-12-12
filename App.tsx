/**
 * App Component
 *
 * Main application shell with routing.
 * Handles authentication modal state and routes to landing/app.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GenerationMode, PresentationPlanResponse } from './types';
import { IdeationSession } from './types/ideation';
import { RoughDraftInput, RoughDraftResult } from './services/agents';
import { RoughDraftCanvas } from './components/rough-draft';
import { IMAGE_STYLES } from './lib/themes';
import { MainStage } from './components/MainStage';
import { ChatInterface } from './components/ChatInterface';
import { AppHeader } from './components/AppHeader';
import { AppSidebar } from './components/AppSidebar';
import { PrintView } from './components/PrintView';
import { useDeck } from './hooks/useDeck';
import { useDuplicatePresentation } from './hooks/mutations/usePresentationMutations';
import { useAnalytics } from './hooks/useAnalytics';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useChat } from './hooks/useChat';
import { IdeationCopilot } from './components/ideation/IdeationCopilot';
import { IdeationResumePrompt } from './components/ideation/IdeationResumePrompt';
import { SourcesWizard } from './components/sources';
import { BeautifyWizard } from './components/beautify/BeautifyWizard';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { ArchetypeChangeDialog } from './components/ArchetypeChangeDialog';
import { getArchetypeVisualStyle } from './lib/archetypeVisualStyles';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { DebugProvider } from './contexts/DebugContext';
import { DebugRoute, ThumbnailGenerator, ComponentShowcase, ImageAgentRoute } from './components/debug';
import { AuthModal } from './components/auth';
import { preloadCommonFonts } from './lib/fonts';
import { ProtectedRoute, OfflineGate } from './components/routing';
import { LandingPage } from './components/landing';
import { migrateIdeationSessions, isMigrationComplete } from './services/migration/ideationMigration';
import { useAuth } from './contexts/AuthContext';
import { WelcomeModal } from './components/onboarding';
import { useOnboarding } from './hooks/useOnboarding';
import {
  FeaturesPage,
  PricingPage,
  AboutPage,
  ThemesGalleryPage,
  SolutionsPage,
} from './components/pages';
import { PrototypeRouter } from './homepage-prototypes';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { useSavedIdeations, useIdeationSession } from './hooks/queries/useIdeationQueries';
import { useSavedRoughDrafts, useDeleteRoughDraft, useApproveRoughDraft, useRoughDraft } from './hooks/queries/useRoughDraftQueries';
import { deleteIdeationSession } from './services/api/ideationService';

// ============ Protected App Content ============

function AppContent() {
  // UI State
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('balanced');
  const [isPresenting, setIsPresenting] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [isIdeating, setIsIdeating] = useState(false);
  const [ideationSessionIdToLoad, setIdeationSessionIdToLoad] = useState<string | null>(null);
  const [enableDraftPreview, setEnableDraftPreview] = useState(false);
  // Session resumption state
  const [lastIdeationSessionId, setLastIdeationSessionId] = useState<string | null>(null);
  const [showIdeationResumePrompt, setShowIdeationResumePrompt] = useState(false);

  // Onboarding state
  const {
    isLoaded: onboardingLoaded,
    isFirstTimeUser,
    markWelcomeSeen,
  } = useOnboarding();
  // Sources mode state (VideoDeck / Research & Present)
  const [sourcesMode, setSourcesMode] = useState<{
    isOpen: boolean;
    preset: 'video' | 'web' | 'mixed';
    recipe: 'training' | 'explainer' | 'brief' | 'pitch';
  } | null>(null);
  // Beautify mode state (Make My Ugly Deck Beautiful)
  const [isBeautifying, setIsBeautifying] = useState(false);
  // Archetype change dialog state
  const [archetypeChangeDialog, setArchetypeChangeDialog] = useState<{
    isOpen: boolean;
    previousArchetype: string;
    newArchetype: string;
  }>({ isOpen: false, previousArchetype: '', newArchetype: '' });

  // Rough draft state - holds data for the rough draft view
  const [roughDraftState, setRoughDraftState] = useState<{
    isOpen: boolean;
    source: 'ideation' | 'copilot' | 'existing' | 'sources';
    input?: RoughDraftInput;
    ideationSessionId?: string;
    existingDraftId?: string;
    sourcesSessionId?: string;
    // Preserve sources wizard state for navigation back
    sourcesPreset?: 'video' | 'web' | 'mixed';
    sourcesRecipe?: 'training' | 'explainer' | 'brief' | 'pitch';
  } | null>(null);

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

  // Source content hooks - fetch related ideation and rough draft for current presentation
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
    onExitPresentation: useCallback(() => setIsPresenting(false), []),
  });

  // Preload common fonts in the background after initial render
  useEffect(() => {
    preloadCommonFonts();
  }, []);

  // Run ideation migration from IndexedDB to backend API (one-time)
  useEffect(() => {
    if (!isMigrationComplete()) {
      migrateIdeationSessions()
        .then((result) => {
          if (result.migrated > 0 || result.failed > 0) {
            console.log(`[App] Ideation migration complete: ${result.migrated} migrated, ${result.failed} failed`);
          }
        })
        .catch((error) => {
          console.error('[App] Ideation migration error:', error);
        });
    }
  }, []);

  // ============ Handlers ============

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const topic = inputValue.trim();
    addMessage(createUserMessage(topic));
    setInputValue('');

    try {
      if (enableDraftPreview) {
        // Draft preview mode - go to rough draft canvas first
        addMessage(createSystemMessage('Preparing rough draft preview...'));

        // Enter rough draft mode with the topic
        setRoughDraftState({
          isOpen: true,
          source: 'copilot',
          input: {
            topic,
            themeId: 'executive', // Default theme, agent will pick appropriate one
            visualStyle: selectedImageStyle.prompt,
          },
        });
        setIsChatOpen(false);
        setShowCreateChat(false);
      } else {
        // Direct build mode
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
  };

  const handleCreateNew = () => {
    setShowCreateChat(true);
    resetMessages();
    setGenerationMode('balanced');
  };

  const handleIdeate = () => {
    // If there's a recent session, show the resume prompt
    if (lastIdeationSessionId) {
      setShowIdeationResumePrompt(true);
    } else {
      setIsIdeating(true);
    }
  };

  // Sources mode handlers (VideoDeck / Research & Present)
  const handleOpenSources = useCallback((preset: 'video' | 'web' | 'mixed', recipe: 'training' | 'explainer' | 'brief' | 'pitch' = 'training') => {
    setSourcesMode({ isOpen: true, preset, recipe });
  }, []);

  const handleCloseSources = useCallback(() => {
    setSourcesMode(null);
  }, []);

  const handleBuildDeckFromSources = useCallback(async (session: IdeationSession) => {
    // Derive topic from session or sources
    const topic = session.topic || session.sources?.[0]?.title || 'Untitled';

    // Route to Rough Draft preview with extracted notes
    // Preserve sources wizard state for "Back" navigation
    setRoughDraftState({
      isOpen: true,
      source: 'sources',
      input: {
        topic,
        themeId: 'executive', // Default theme, agent can suggest better
        visualStyle: 'professional photography with clean backgrounds',
        ideationNotes: session.notes, // Include all notes - no filter
        source: 'sources', // Pass source type to agent for content preservation
      },
      sourcesSessionId: session.id,
      sourcesPreset: sourcesMode?.preset,
      sourcesRecipe: sourcesMode?.recipe,
    });

    // Close sources wizard
    setSourcesMode(null);
  }, [sourcesMode]);

  // Beautify mode handlers
  const handleOpenBeautify = useCallback(() => {
    setIsBeautifying(true);
  }, []);

  const handleCloseBeautify = useCallback(() => {
    setIsBeautifying(false);
  }, []);

  const handleBeautifyComplete = useCallback(async (slides: any[], themeId: string) => {
    // Create a new presentation from the beautified slides
    try {
      await actions.createPresentationFromSlides(slides, themeId);
      setIsBeautifying(false);
    } catch (error) {
      console.error('Failed to create presentation from beautified slides:', error);
      // Keep the wizard open so user can try again or export manually
    }
  }, [actions]);

  // Ideation handlers
  const handleLoadIdeation = useCallback((id: string) => {
    setIdeationSessionIdToLoad(id);
    setIsIdeating(true);
  }, []);

  const handleDeleteIdeation = useCallback(async (id: string) => {
    try {
      await deleteIdeationSession(id);
      refetchIdeations();
    } catch (error) {
      console.error('Failed to delete ideation:', error);
    }
  }, [refetchIdeations]);

  const handleGenerateDeckFromIdeation = useCallback((id: string) => {
    // TODO: Load ideation and trigger rough draft generation
    console.log('Generate deck from ideation:', id);
  }, []);

  const handleViewJournal = useCallback((id: string) => {
    // TODO: Show journal modal for the ideation
    console.log('View journal for ideation:', id);
  }, []);

  // Rough draft handlers
  const handleLoadRoughDraft = useCallback((id: string) => {
    setRoughDraftState({
      isOpen: true,
      source: 'existing',
      existingDraftId: id,
    });
  }, []);

  const handleDeleteRoughDraft = useCallback((id: string) => {
    deleteRoughDraftMutation.mutate(id);
  }, [deleteRoughDraftMutation]);

  const handleApproveRoughDraftFromDashboard = useCallback((id: string) => {
    approveRoughDraftMutation.mutate(
      { id },
      {
        onSuccess: (presentation) => {
          // Load the newly created presentation
          actions.loadDeck(presentation.id);
        },
      }
    );
  }, [approveRoughDraftMutation, actions]);

  // Handlers for viewing source content from sidebar
  const handleViewSourceIdeation = useCallback((id: string) => {
    setIdeationSessionIdToLoad(id);
    setIsIdeating(true);
  }, []);

  const handleViewSourceRoughDraft = useCallback((id: string) => {
    setRoughDraftState({
      isOpen: true,
      source: 'existing',
      existingDraftId: id,
    });
  }, []);

  const handleCloseIdeation = useCallback((sessionId?: string) => {
    // Preserve the session ID so user can resume later
    if (sessionId) {
      setLastIdeationSessionId(sessionId);
    }
    setIsIdeating(false);
    setIdeationSessionIdToLoad(null);
  }, []);

  const handleCloneDeck = useCallback((id: string) => {
    duplicateMutation.mutate(id, {
      onSuccess: (clonedDeck) => {
        // Optionally load the cloned deck
        actions.loadDeck(clonedDeck.id);
      },
    });
  }, [duplicateMutation, actions]);

  const handleCloneCurrentDeck = useCallback(() => {
    if (currentPresentation) {
      handleCloneDeck(currentPresentation.id);
    }
  }, [currentPresentation, handleCloneDeck]);

  const handleBuildDeckFromIdeation = async (deckPlan: {
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
    setIsIdeating(false);
    const topic = deckPlan.topic;
    addMessage(createSystemMessage(`Building deck from ideation: "${topic}"...`));

    try {
      await actions.createDeckFromPlan(deckPlan);
      addMessage(createModelMessage(`Deck created from ideation: ${deckPlan.slides.length} slides. Rendering visuals...`));
    } catch (error) {
      console.error('Error building deck from ideation:', error);
      addMessage(createSystemMessage('Error building deck from ideation plan.'));
    }
  };

  // ============ Rough Draft Handlers ============

  /**
   * Enter rough draft mode from ideation (with notes and theme)
   */
  const handleRoughDraftFromIdeation = useCallback((
    deckPlan: PresentationPlanResponse,
    sessionId: string,
    notes?: Array<{ content: string; column: number }>
  ) => {
    setRoughDraftState({
      isOpen: true,
      source: 'ideation',
      input: {
        ideationNotes: notes?.map((n, i) => ({
          id: `note-${i}`,
          content: n.content,
          type: 'user' as const,
          column: n.column,
          row: 0,
          color: 'yellow' as const,
          approved: true,
          createdAt: Date.now(),
        })),
        topic: deckPlan.topic,
        themeId: deckPlan.themeId,
        visualStyle: deckPlan.visualStyle,
      },
      ideationSessionId: sessionId,
    });
    // Keep ideation open in the background so user can go back
  }, []);

  /**
   * Approve the rough draft and create the final deck
   */
  const handleApproveRoughDraft = useCallback(async (result: RoughDraftResult) => {
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
        // Pass through generated images
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

    // Close rough draft view
    setRoughDraftState(null);
    setIsIdeating(false);
  }, [roughDraftState, actions, addMessage, createModelMessage, createSystemMessage]);

  /**
   * Go back from rough draft to previous view
   */
  const handleBackFromRoughDraft = useCallback(() => {
    if (roughDraftState?.source === 'ideation') {
      // Return to ideation - keep session open
      setRoughDraftState(null);
      // Ideation is still open since we didn't close it
    } else if (roughDraftState?.source === 'sources') {
      // Return to sources wizard - reopen with preserved state
      const preset = roughDraftState.sourcesPreset || 'video';
      const recipe = roughDraftState.sourcesRecipe || 'training';
      setRoughDraftState(null);
      setSourcesMode({ isOpen: true, preset, recipe });
    } else {
      // From copilot or existing - close and return to dashboard
      setRoughDraftState(null);
    }
  }, [roughDraftState]);

  /**
   * Discard rough draft and return to dashboard
   */
  const handleDiscardRoughDraft = useCallback(() => {
    setRoughDraftState(null);
    setIsIdeating(false);
  }, []);

  // ============ Welcome Modal Handlers ============

  const handleWelcomePathSelect = useCallback((path: 'new-deck' | 'ideate' | 'beautify') => {
    markWelcomeSeen();
    switch (path) {
      case 'new-deck':
        handleCreateNew();
        break;
      case 'ideate':
        setIsIdeating(true);
        break;
      case 'beautify':
        setIsBeautifying(true);
        break;
    }
  }, [markWelcomeSeen]);

  const handleWelcomeSkip = useCallback(() => {
    markWelcomeSeen();
  }, [markWelcomeSeen]);

  // ============ Ideation Resume Prompt Handlers ============

  const handleResumeLastSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    if (lastIdeationSessionId) {
      setIdeationSessionIdToLoad(lastIdeationSessionId);
    }
    setIsIdeating(true);
  }, [lastIdeationSessionId]);

  const handleStartFreshSession = useCallback(() => {
    setShowIdeationResumePrompt(false);
    setLastIdeationSessionId(null);
    setIsIdeating(true);
  }, []);

  const handleChooseFromSaved = useCallback(() => {
    setShowIdeationResumePrompt(false);
    // User can select from the ideations tab in dashboard
    // Just close the prompt - they're already on dashboard
  }, []);

  const handleCloseResumePrompt = useCallback(() => {
    setShowIdeationResumePrompt(false);
  }, []);

  // ============ Archetype Change Handlers ============

  // Handle archetype selection - show dialog if presentation exists and has images
  const handleSetWabiSabiLayout = useCallback((layoutName: string) => {
    // If no presentation or same archetype, just set it
    if (!currentPresentation || layoutName === activeWabiSabiLayout) {
      actions.setWabiSabiLayout(layoutName);
      return;
    }

    // Check if any slides have images (meaning regeneration would have an effect)
    const hasImages = currentPresentation.slides.some(slide => slide.imageUrl);

    if (hasImages) {
      // Show dialog to ask about image regeneration
      setArchetypeChangeDialog({
        isOpen: true,
        previousArchetype: activeWabiSabiLayout,
        newArchetype: layoutName,
      });
    } else {
      // No images yet, just change archetype
      actions.setWabiSabiLayout(layoutName);
    }
  }, [currentPresentation, activeWabiSabiLayout, actions]);

  // Handle dialog confirmation
  const handleArchetypeChangeConfirm = useCallback((regenerateImages: boolean) => {
    const { newArchetype } = archetypeChangeDialog;

    // Always set the new archetype
    actions.setWabiSabiLayout(newArchetype);

    // If user wants to regenerate, update visual style and regenerate
    if (regenerateImages) {
      const newVisualStyle = getArchetypeVisualStyle(newArchetype);
      actions.updateVisualStyleAndRegenerateImages(newVisualStyle, true);
    }
  }, [archetypeChangeDialog, actions]);

  // ============ Render ============

  // Rough Draft Mode - Full screen canvas for reviewing/editing draft
  if (roughDraftState?.isOpen) {
    return (
      <RoughDraftCanvas
        input={roughDraftState.input}
        existingDraftId={roughDraftState.existingDraftId}
        source={roughDraftState.source}
        ideationSessionId={roughDraftState.ideationSessionId}
        onApprove={handleApproveRoughDraft}
        onBack={handleBackFromRoughDraft}
        onDiscard={handleDiscardRoughDraft}
      />
    );
  }

  // Beautify Mode - Full screen wizard (Make My Ugly Deck Beautiful)
  if (isBeautifying) {
    return (
      <BeautifyWizard
        onClose={handleCloseBeautify}
        onComplete={handleBeautifyComplete}
      />
    );
  }

  // Sources Mode - Full screen wizard (VideoDeck / Research & Present)
  if (sourcesMode?.isOpen) {
    return (
      <SourcesWizard
        preset={sourcesMode.preset}
        recipe={sourcesMode.recipe}
        onClose={handleCloseSources}
        onBuildDeck={handleBuildDeckFromSources}
      />
    );
  }

  // Ideation Mode - Full screen copilot
  if (isIdeating) {
    return (
      <IdeationCopilot
        sessionId={ideationSessionIdToLoad || undefined}
        onClose={handleCloseIdeation}
        onBuildDeck={handleBuildDeckFromIdeation}
        onRoughDraft={handleRoughDraftFromIdeation}
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
              handleSendMessage={handleSendMessage}
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
            handleSendMessage={handleSendMessage}
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
            // Related content props
            sourceIdeation={sourceIdeation}
            sourceRoughDraft={sourceRoughDraft}
            onViewSourceIdeation={handleViewSourceIdeation}
            onViewSourceRoughDraft={handleViewSourceRoughDraft}
            // Workspace navigation
            onIdeate={handleIdeate}
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
              onSetWabiSabiLayout={handleSetWabiSabiLayout}
              onCycleWabiSabiLayout={actions.cycleWabiSabiLayout}
              onRegenerateAllImages={actions.regenerateAllImages}
              onRemixDeck={actions.remixDeck}
              setIsPresenting={setIsPresenting}
              onSave={actions.saveDeck}
              onClose={actions.closeDeck}
              onClone={handleCloneCurrentDeck}
              onShuffleLayout={actions.shuffleLayoutVariants}
              onExportDeck={actions.exportDeck}
              saveStatus={saveStatus}
            />
          )}

          {/* PRESENTATION OVERLAYS */}
          {isPresenting && currentPresentation && (
            <>
              {/* Close Button */}
              <button
                onClick={() => setIsPresenting(false)}
                className="absolute top-6 right-6 z-[1000] p-3 bg-black/70 hover:bg-[#c5a47e] text-white hover:text-black backdrop-blur-md transition-all duration-150 cursor-pointer shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Slide */}
              {activeSlideIndex > 0 && (
                <button
                  onClick={goToPreviousSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/30 hover:bg-black/70 text-white/50 hover:text-white backdrop-blur-sm transition-all duration-150 cursor-pointer"
                >
                  <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
                </button>
              )}

              {/* Next Slide */}
              {activeSlideIndex < currentPresentation.slides.length - 1 && (
                <button
                  onClick={goToNextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/30 hover:bg-black/70 text-white/50 hover:text-white backdrop-blur-sm transition-all duration-150 cursor-pointer"
                >
                  <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
                </button>
              )}

              {/* Slide Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-4 py-1.5 bg-black/70 backdrop-blur-md text-white/80 text-[10px] font-bold uppercase tracking-widest pointer-events-none border border-white/10">
                {activeSlideIndex + 1} / {currentPresentation.slides.length}
              </div>
            </>
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
            onCloneDeck={handleCloneDeck}
            onCreateDeck={handleCreateNew}
            onImport={actions.importDeck}
            onIdeate={handleIdeate}
            onOpenSources={handleOpenSources}
            onBeautify={handleOpenBeautify}
            // Ideation props
            savedIdeations={savedIdeations}
            isLoadingIdeations={isLoadingIdeations}
            onLoadIdeation={handleLoadIdeation}
            onDeleteIdeation={handleDeleteIdeation}
            onGenerateDeckFromIdeation={handleGenerateDeckFromIdeation}
            onViewJournal={handleViewJournal}
            // Rough draft props
            savedRoughDrafts={savedRoughDrafts}
            isLoadingRoughDrafts={isLoadingRoughDrafts}
            onLoadRoughDraft={handleLoadRoughDraft}
            onDeleteRoughDraft={handleDeleteRoughDraft}
            onApproveRoughDraft={handleApproveRoughDraftFromDashboard}
            presentation={currentPresentation}
            activeSlideIndex={activeSlideIndex}
          />
        </div>
      </div>

      <PrintView
        presentation={currentPresentation}
        theme={activeTheme}
        activeWabiSabiLayout={activeWabiSabiLayout}
        viewMode={viewMode}
      />

      {/* Archetype Change Confirmation Dialog */}
      <ArchetypeChangeDialog
        isOpen={archetypeChangeDialog.isOpen}
        onClose={() => setArchetypeChangeDialog(prev => ({ ...prev, isOpen: false }))}
        previousArchetype={archetypeChangeDialog.previousArchetype}
        newArchetype={archetypeChangeDialog.newArchetype}
        onConfirm={handleArchetypeChangeConfirm}
      />

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

// ============ Realtime Sync Initializer ============

function RealtimeSyncInitializer({ children }: { children: React.ReactNode }) {
  // Initialize WebSocket connection when authenticated
  useRealtimeSync();
  return <>{children}</>;
}

// ============ Main App with Routing ============

function AppRoutes() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Redirect to app after successful auth
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';
    navigate(from, { replace: true });
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onAuth={handleOpenAuth} />} />
        <Route path="/features" element={<FeaturesPage onAuth={handleOpenAuth} />} />
        <Route path="/pricing" element={<PricingPage onAuth={handleOpenAuth} />} />
        <Route path="/about" element={<AboutPage onAuth={handleOpenAuth} />} />
        <Route path="/themes" element={<ThemesGalleryPage onAuth={handleOpenAuth} />} />
        <Route path="/solutions/:solutionId" element={<SolutionsPage onAuth={handleOpenAuth} />} />

        {/* Homepage Prototypes - Isolated design variations */}
        <Route path="/prototypes/*" element={<PrototypeRouter />} />

        {/* Debug Routes (dev only) */}
        <Route path="/debug" element={<DebugRoute />} />
        <Route path="/debug/thumbnails" element={<ThumbnailGenerator />} />
        <Route path="/debug/components" element={<ComponentShowcase />} />
        <Route path="/debug/image-agent" element={<ImageAgentRoute />} />

        {/* Auth Routes (trigger modal) */}
        <Route
          path="/login"
          element={
            <AuthModalTrigger mode="login" onAuth={handleOpenAuth}>
              <LandingPage onAuth={handleOpenAuth} />
            </AuthModalTrigger>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthModalTrigger mode="register" onAuth={handleOpenAuth}>
              <LandingPage onAuth={handleOpenAuth} />
            </AuthModalTrigger>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          }
        />

        {/* Fallback - redirect to home */}
        <Route path="*" element={<LandingPage onAuth={handleOpenAuth} />} />
      </Routes>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

// ============ Root App Component ============

export default function App() {
  return (
    <QueryProvider>
      <NetworkProvider>
        <OfflineGate>
          <DebugProvider>
            <AuthProvider>
              <RealtimeSyncInitializer>
                <AppRoutes />
              </RealtimeSyncInitializer>
            </AuthProvider>
          </DebugProvider>
        </OfflineGate>
      </NetworkProvider>
    </QueryProvider>
  );
}

// ============ Helper Components ============

interface AuthModalTriggerProps {
  mode: 'login' | 'register';
  onAuth: (mode: 'login' | 'register') => void;
  children: React.ReactNode;
}

function AuthModalTrigger({ mode, onAuth, children }: AuthModalTriggerProps) {
  React.useEffect(() => {
    onAuth(mode);
  }, [mode, onAuth]);

  return <>{children}</>;
}
