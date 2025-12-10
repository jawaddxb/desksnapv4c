/**
 * App Component
 *
 * Main application shell that orchestrates the presentation editor.
 * Uses focused hooks for analytics, keyboard navigation, and chat.
 */

import React, { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GenerationMode } from './types';
import { IMAGE_STYLES } from './lib/themes';
import { MainStage } from './components/MainStage';
import { ChatInterface } from './components/ChatInterface';
import { AppHeader } from './components/AppHeader';
import { AppSidebar } from './components/AppSidebar';
import { PrintView } from './components/PrintView';
import { useDeck } from './hooks/useDeck';
import { useAnalytics } from './hooks/useAnalytics';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useChat } from './hooks/useChat';
import { IdeationCopilot } from './components/ideation/IdeationCopilot';
import { AuthProvider } from './contexts/AuthContext';
import { AuthModal } from './components/auth';

function AppContent() {
  // UI State
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('balanced');
  const [isPresenting, setIsPresenting] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'wabi-sabi'>('standard');
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [isIdeating, setIsIdeating] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    saveStatus,
    actions,
  } = useDeck();

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
        className="flex h-screen w-full bg-zinc-50 overflow-hidden text-zinc-900 font-sans selection:bg-zinc-200 relative"
      >
        {/* FLOATING CHAT MODAL */}
        {(currentPresentation || showCreateChat) && (
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg h-[650px] bg-white rounded-xl shadow-2xl border-2 border-zinc-900 z-[1000] flex flex-col overflow-hidden transition-all duration-300 origin-center ${
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
          className="flex-1 bg-zinc-100 flex flex-col relative overflow-hidden min-w-0"
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
              onSetWabiSabiLayout={actions.setWabiSabiLayout}
              onCycleWabiSabiLayout={actions.cycleWabiSabiLayout}
              onRegenerateAllImages={actions.regenerateAllImages}
              onRemixDeck={actions.remixDeck}
              setIsPresenting={setIsPresenting}
              onSave={actions.saveDeck}
              onClose={actions.closeDeck}
              onShuffleLayout={actions.shuffleLayoutVariants}
              onExportDeck={actions.exportDeck}
              saveStatus={saveStatus}
              onLoginClick={() => setShowAuthModal(true)}
            />
          )}

          {/* PRESENTATION OVERLAYS */}
          {isPresenting && currentPresentation && (
            <>
              {/* Close Button */}
              <button
                onClick={() => setIsPresenting(false)}
                className="absolute top-6 right-6 z-[1000] p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Slide */}
              {activeSlideIndex > 0 && (
                <button
                  onClick={goToPreviousSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/10 hover:bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
                </button>
              )}

              {/* Next Slide */}
              {activeSlideIndex < currentPresentation.slides.length - 1 && (
                <button
                  onClick={goToNextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/10 hover:bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
                </button>
              )}

              {/* Slide Counter */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white/80 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
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
            onCreateDeck={handleCreateNew}
            onImport={actions.importDeck}
            onIdeate={handleIdeate}
          />
        </div>
      </div>

      <PrintView
        presentation={currentPresentation}
        theme={activeTheme}
        activeWabiSabiLayout={activeWabiSabiLayout}
        viewMode={viewMode}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

// Main App wrapped with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
