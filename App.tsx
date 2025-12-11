/**
 * App Component
 *
 * Main application shell with routing.
 * Handles authentication modal state and routes to landing/app.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GenerationMode } from './types';
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
import {
  FeaturesPage,
  PricingPage,
  AboutPage,
  ThemesGalleryPage,
  SolutionsPage,
} from './components/pages';
import { PrototypeRouter } from './homepage-prototypes';
import { useRealtimeSync } from './hooks/useRealtimeSync';

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
  // Archetype change dialog state
  const [archetypeChangeDialog, setArchetypeChangeDialog] = useState<{
    isOpen: boolean;
    previousArchetype: string;
    newArchetype: string;
  }>({ isOpen: false, previousArchetype: '', newArchetype: '' });

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

    addMessage(createUserMessage(inputValue));
    setInputValue('');

    try {
      addMessage(createSystemMessage('Constructing Layout & Selecting Theme...'));

      const newSlides = await actions.createDeck(inputValue, selectedImageStyle, generationMode);

      addMessage(createModelMessage(`Blueprint ready: ${newSlides.length} slides. Rendering visuals...`));
      setIsChatOpen(false);
      setShowCreateChat(false);
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
    setIsIdeating(true);
  };

  const handleCloseIdeation = () => {
    setIsIdeating(false);
  };

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

  // Ideation Mode - Full screen copilot
  if (isIdeating) {
    return (
      <IdeationCopilot
        onClose={handleCloseIdeation}
        onBuildDeck={handleBuildDeckFromIdeation}
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
