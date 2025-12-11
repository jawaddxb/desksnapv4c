
import React from 'react';
import { Presentation, Message, GenerationMode } from '../types';
import { Zap, MessageSquare } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { SlideList } from './SlideList';
import { IMAGE_STYLES } from '../lib/themes';

interface AppSidebarProps {
    currentPresentation: Presentation | null;
    messages: Message[];
    isGenerating: boolean;
    isChatOpen: boolean;
    setIsChatOpen: (v: boolean) => void;
    inputValue: string;
    setInputValue: (v: string) => void;
    handleSendMessage: () => void;
    selectedImageStyle: typeof IMAGE_STYLES[0];
    setSelectedImageStyle: (s: typeof IMAGE_STYLES[0]) => void;
    generationMode: GenerationMode;
    setGenerationMode: (m: GenerationMode) => void;
    activeSlideIndex: number;
    setActiveSlideIndex: (i: number) => void;
    onMoveSlide: (index: number, direction: 'up' | 'down') => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    viewMode?: 'standard' | 'wabi-sabi';
    activeWabiSabiLayout?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
    currentPresentation,
    messages,
    isGenerating,
    isChatOpen,
    setIsChatOpen,
    inputValue,
    setInputValue,
    handleSendMessage,
    selectedImageStyle,
    setSelectedImageStyle,
    generationMode,
    setGenerationMode,
    activeSlideIndex,
    setActiveSlideIndex,
    onMoveSlide,
    scrollRef,
    viewMode,
    activeWabiSabiLayout
}) => {
    return (
        <div className="w-[360px] md:w-[400px] flex flex-col border-r border-white/10 bg-black relative z-20 h-full flex-shrink-0">
            <div className="h-20 flex-none px-6 border-b border-white/10 flex items-center justify-between bg-black z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-black flex items-center justify-center"><Zap className="w-6 h-6" strokeWidth={2.5} /></div>
                    <div><h1 className="font-bold text-2xl tracking-tight text-white leading-none">DeckSnap</h1><span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a47e]">GenAI Studio</span></div>
                </div>
                {currentPresentation && (
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 transition-all duration-150 ${isChatOpen ? 'bg-[#c5a47e] text-black' : 'bg-black text-white/60 border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e]'}`}><MessageSquare className="w-5 h-5" strokeWidth={2.5} /></button>
                )}
            </div>
            {!currentPresentation ? (
                <div className="flex flex-col grow h-full overflow-hidden">
                    <ChatInterface
                        mode="sidebar" messages={messages} isGenerating={isGenerating} currentPresentation={currentPresentation}
                        isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} inputValue={inputValue} setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage} selectedImageStyle={selectedImageStyle} setSelectedImageStyle={setSelectedImageStyle}
                        generationMode={generationMode} setGenerationMode={setGenerationMode}
                        scrollRef={scrollRef}
                    />
                </div>
            ) : (
                <SlideList
                    presentation={currentPresentation}
                    activeSlideIndex={activeSlideIndex}
                    setActiveSlideIndex={setActiveSlideIndex}
                    onMoveSlide={onMoveSlide}
                    viewMode={viewMode}
                    activeWabiSabiLayout={activeWabiSabiLayout}
                />
            )}
        </div>
    );
};
