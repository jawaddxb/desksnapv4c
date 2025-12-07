import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Message, MessageRole, GenerationMode } from './types';
import { IMAGE_STYLES } from './lib/themes';
import { MainStage } from './components/MainStage';
import { ChatInterface } from './components/ChatInterface';
import { AppHeader } from './components/AppHeader';
import { AppSidebar } from './components/AppSidebar';
import { PrintView } from './components/PrintView';
import { useDeck } from './hooks/useDeck';

const INITIAL_MESSAGE: Message = { id: 'init', role: MessageRole.MODEL, text: "Ready to snap some slides together. What's the topic?", timestamp: Date.now() };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('balanced');
  const [isPresenting, setIsPresenting] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'wabi-sabi'>('standard');
  const [showCreateChat, setShowCreateChat] = useState(false);
  
  const { currentPresentation, savedDecks, activeSlideIndex, setActiveSlideIndex, isGenerating, activeTheme, activeWabiSabiLayout, saveStatus, actions } = useDeck();
  
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarScrollRef.current) sidebarScrollRef.current.scrollTop = sidebarScrollRef.current.scrollHeight;
    if (modalScrollRef.current) modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
  }, [messages, isChatOpen]);

  // Keyboard Navigation for Presentation Mode
  useEffect(() => {
    if (!isPresenting || !currentPresentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSlideIndex < currentPresentation.slides.length - 1) {
          setActiveSlideIndex(activeSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeSlideIndex > 0) {
          setActiveSlideIndex(activeSlideIndex - 1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsPresenting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, activeSlideIndex, currentPresentation, setActiveSlideIndex]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isGenerating) return;

    const userMsg: Message = { id: Date.now().toString(), role: MessageRole.USER, text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    try {
      setMessages(prev => [...prev, { id: 'sys-' + Date.now(), role: MessageRole.SYSTEM, text: 'Constructing Layout & Selecting Theme...', timestamp: Date.now() }]);
      
      const newSlides = await actions.createDeck(userMsg.text, selectedImageStyle, generationMode);
      
      setMessages(prev => [...prev, { id: 'gen-' + Date.now(), role: MessageRole.MODEL, text: `Blueprint ready: ${newSlides.length} slides. Rendering visuals...`, timestamp: Date.now() }]);
      setIsChatOpen(false);
      setShowCreateChat(false); // Close the creation modal if open

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err-' + Date.now(), role: MessageRole.SYSTEM, text: 'System Error. Check credentials.', timestamp: Date.now() }]);
    }
  };

  const handleCreateNew = () => {
      // Open the creation flow (which is the chat interface in modal mode initially)
      setShowCreateChat(true);
      setMessages([INITIAL_MESSAGE]); // Reset chat for new flow
      setGenerationMode('balanced'); // Reset to default mode
  };

  return (
    <>
    <div id="app-ui" className="flex h-screen w-full bg-zinc-50 overflow-hidden text-zinc-900 font-sans selection:bg-zinc-200 relative">
      
      {/* FLOATING CHAT MODAL (Used for creating new decks from Dashboard OR editing existing) */}
      {(currentPresentation || showCreateChat) && (
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg h-[650px] bg-white rounded-xl shadow-2xl border-2 border-zinc-900 z-[1000] flex flex-col overflow-hidden transition-all duration-300 origin-center ${(isChatOpen || showCreateChat) ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <ChatInterface 
                mode="modal" messages={messages} isGenerating={isGenerating} currentPresentation={currentPresentation}
                isChatOpen={isChatOpen || showCreateChat} setIsChatOpen={(v) => { setIsChatOpen(v); if(!v) setShowCreateChat(false); }} inputValue={inputValue} setInputValue={setInputValue}
                handleSendMessage={handleSendMessage} selectedImageStyle={selectedImageStyle} setSelectedImageStyle={setSelectedImageStyle}
                generationMode={generationMode} setGenerationMode={setGenerationMode}
                scrollRef={modalScrollRef}
            />
          </div>
      )}

      {/* LEFT SIDEBAR (Only visible when editing a deck) */}
      {!isPresenting && currentPresentation && (
        <AppSidebar 
            currentPresentation={currentPresentation} messages={messages} isGenerating={isGenerating} isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen}
            inputValue={inputValue} setInputValue={setInputValue} handleSendMessage={handleSendMessage}
            selectedImageStyle={selectedImageStyle} setSelectedImageStyle={setSelectedImageStyle}
            generationMode={generationMode} setGenerationMode={setGenerationMode}
            activeSlideIndex={activeSlideIndex} setActiveSlideIndex={setActiveSlideIndex} onMoveSlide={actions.moveSlide}
            scrollRef={sidebarScrollRef}
            viewMode={viewMode}
            activeWabiSabiLayout={activeWabiSabiLayout}
        />
      )}

      {/* MAIN STAGE AREA */}
      <div className="flex-1 bg-zinc-100 flex flex-col relative overflow-hidden min-w-0" style={{ backgroundColor: currentPresentation ? activeTheme.colors.background : '#fafafa' }}>
        
        {/* HEADER */}
        {!isPresenting && (
            <AppHeader 
                currentPresentation={currentPresentation} activeTheme={activeTheme} activeWabiSabiLayout={activeWabiSabiLayout}
                viewMode={viewMode} setViewMode={setViewMode}
                onApplyTheme={actions.applyTheme} 
                onApplyTypography={actions.applyTypography}
                onSetWabiSabiLayout={actions.setWabiSabiLayout} onCycleWabiSabiLayout={actions.cycleWabiSabiLayout}
                onRegenerateAllImages={actions.regenerateAllImages} onRemixDeck={actions.remixDeck} setIsPresenting={setIsPresenting}
                onSave={actions.saveDeck} onClose={actions.closeDeck}
                onShuffleLayout={actions.shuffleLayoutVariants}
                saveStatus={saveStatus}
            />
        )}
        
        {/* PRESENTATION OVERLAYS (Navigation & Close) */}
        {isPresenting && currentPresentation && (
            <>
                {/* Close Button */}
                <button onClick={() => setIsPresenting(false)} className="absolute top-6 right-6 z-[1000] p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105"><X className="w-6 h-6" /></button>
                
                {/* Prev Slide */}
                {activeSlideIndex > 0 && (
                    <button 
                        onClick={() => setActiveSlideIndex(activeSlideIndex - 1)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-[1000] p-4 bg-black/10 hover:bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer hover:scale-110"
                    >
                        <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
                    </button>
                )}

                {/* Next Slide */}
                {activeSlideIndex < currentPresentation.slides.length - 1 && (
                    <button 
                        onClick={() => setActiveSlideIndex(activeSlideIndex + 1)}
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
            // Dashboard props
            savedDecks={savedDecks}
            onLoadDeck={actions.loadDeck}
            onDeleteDeck={actions.deleteDeck}
            onCreateDeck={handleCreateNew}
        />
      </div>
    </div>
    
    <PrintView presentation={currentPresentation} theme={activeTheme} activeWabiSabiLayout={activeWabiSabiLayout} viewMode={viewMode} />
    </>
  );
}