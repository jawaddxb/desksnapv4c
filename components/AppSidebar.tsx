
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
        <div className="w-[360px] md:w-[400px] flex flex-col border-r border-zinc-200 bg-white relative z-20 h-full flex-shrink-0">
            <div className="h-20 flex-none px-6 border-b border-zinc-200 flex items-center justify-between bg-white z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-900 text-white flex items-center justify-center border-2 border-zinc-900 shadow-sm"><Zap className="w-6 h-6" strokeWidth={2.5} /></div>
                    <div><h1 className="font-bold text-2xl tracking-tight text-zinc-900 leading-none">DeckSnap</h1><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">GenAI Studio</span></div>
                </div>
                {currentPresentation && (
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 rounded-md transition-all duration-200 border-2 ${isChatOpen ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900'}`}><MessageSquare className="w-5 h-5" strokeWidth={2.5} /></button>
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
