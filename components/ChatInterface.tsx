
import React from 'react';
import { Message, Presentation, MessageRole, GenerationMode } from '../types';
import { Bot, Minus, RefreshCw, ImageIcon, ArrowRight, StopCircle, AlignLeft, Layers, FileText, Quote } from 'lucide-react';
import { IMAGE_STYLES } from '../lib/themes';

interface ChatInterfaceProps {
  mode: 'sidebar' | 'modal';
  messages: Message[];
  isGenerating: boolean;
  currentPresentation: Presentation | null;
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  handleSendMessage: () => void;
  selectedImageStyle: typeof IMAGE_STYLES[0];
  setSelectedImageStyle: (s: typeof IMAGE_STYLES[0]) => void;
  generationMode: GenerationMode;
  setGenerationMode: (m: GenerationMode) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const MODE_OPTIONS: { id: GenerationMode; label: string; icon: React.FC<any>; desc: string }[] = [
    { id: 'concise', label: 'Concise', icon: AlignLeft, desc: '5-8 slides' },
    { id: 'balanced', label: 'Balanced', icon: Layers, desc: '~12 slides' },
    { id: 'detailed', label: 'Detailed', icon: FileText, desc: '15+ slides' },
    { id: 'verbatim', label: 'Verbatim', icon: Quote, desc: 'Exact text' },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    mode, messages, isGenerating, currentPresentation, isChatOpen, setIsChatOpen, 
    inputValue, setInputValue, handleSendMessage, selectedImageStyle, setSelectedImageStyle, 
    generationMode, setGenerationMode,
    scrollRef 
}) => {
    return (
        <>
        {mode === 'modal' && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/80 rounded-t-xl cursor-move">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-zinc-900" strokeWidth={2.5} />
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Design Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-zinc-200 rounded-md transition-colors text-zinc-400 hover:text-zinc-900"><Minus className="w-5 h-5" strokeWidth={2.5} /></button>
                </div>
            </div>
        )}
        <div className={`overflow-y-auto p-6 space-y-6 scroll-smooth ${mode === 'modal' ? 'bg-white grow' : 'bg-zinc-50 flex-1'}`} ref={scrollRef}>
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed ${msg.role === MessageRole.USER ? 'bg-zinc-900 text-white shadow-md' : msg.role === MessageRole.SYSTEM ? 'bg-transparent text-zinc-400 text-xs uppercase tracking-widest font-bold text-center w-full' : 'bg-zinc-100 text-zinc-800 border border-zinc-200'}`}>{msg.text}</div>
                </div>
            ))}
            {isGenerating && (
                <div className="flex justify-start"><div className="bg-white border border-zinc-300 px-5 py-4 flex items-center gap-3 shadow-sm"><RefreshCw className="w-4 h-4 text-zinc-900 animate-spin" strokeWidth={2.5} /><span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Processing</span></div></div>
            )}
        </div>
        <div className={`flex-none p-6 border-t border-zinc-200 bg-white z-20 ${mode === 'modal' ? 'rounded-b-xl' : ''}`}>
            {!currentPresentation && !isGenerating && (
                <div className="mb-4 space-y-4">
                     {/* Generation Mode Selector */}
                     <div>
                        <div className="flex items-center gap-2 mb-2"><Layers className="w-3 h-3 text-zinc-400" /><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Content Density</span></div>
                        <div className="grid grid-cols-4 gap-2">
                            {MODE_OPTIONS.map(opt => (
                                <button 
                                    key={opt.id} 
                                    onClick={() => setGenerationMode(opt.id)} 
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${generationMode === opt.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'}`}
                                >
                                    <opt.icon className="w-4 h-4 mb-1" />
                                    <span className="text-[10px] font-bold">{opt.label}</span>
                                    <span className={`text-[9px] opacity-70 ${generationMode === opt.id ? 'text-zinc-300' : 'text-zinc-400'}`}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                     </div>

                     {/* Visual Style Selector */}
                     <div>
                        <div className="flex items-center gap-2 mb-2"><ImageIcon className="w-3 h-3 text-zinc-400" /><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Visual Aesthetic</span></div>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                            {IMAGE_STYLES.map(style => (
                                <button key={style.id} onClick={() => setSelectedImageStyle(style)} className={`flex-none px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all whitespace-nowrap snap-start ${selectedImageStyle.id === style.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-105' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'}`}>{style.label}</button>
                            ))}
                        </div>
                     </div>
                </div>
            )}
            <div className="relative group">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} placeholder={currentPresentation ? "Ask for changes..." : "Describe your presentation..."} disabled={isGenerating} className="w-full bg-zinc-50 border-2 border-zinc-200 py-4 pl-5 pr-14 text-sm font-bold focus:outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder-zinc-400 text-zinc-900 rounded-none" autoFocus={mode === 'modal' && isChatOpen} />
                <button onClick={handleSendMessage} disabled={!inputValue.trim() || isGenerating} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:bg-zinc-300 transition-all rounded-sm">{isGenerating ? <StopCircle className="w-5 h-5 text-white" strokeWidth={2.5} /> : <ArrowRight className="w-5 h-5 text-white" strokeWidth={2.5} />}</button>
            </div>
        </div>
    </>
    );
};
