
import React from 'react';
import { Message, Presentation, MessageRole, GenerationMode } from '../types';
import { Bot, Minus, RefreshCw, ImageIcon, ArrowRight, StopCircle, AlignLeft, Layers, FileText, Quote, Eye } from 'lucide-react';
import { IMAGE_STYLES } from '../config/imageStyles';

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
  /** Whether to show draft preview before building (optional) */
  enableDraftPreview?: boolean;
  setEnableDraftPreview?: (v: boolean) => void;
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
    scrollRef,
    enableDraftPreview,
    setEnableDraftPreview,
}) => {
    return (
        <>
        {mode === 'modal' && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black cursor-move">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#c5a47e]" strokeWidth={2.5} />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Design Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-white/10 transition-colors duration-150 text-white/40 hover:text-white"><Minus className="w-5 h-5" strokeWidth={2.5} /></button>
                </div>
            </div>
        )}
        <div className={`overflow-y-auto p-6 space-y-6 scroll-smooth ${mode === 'modal' ? 'bg-[#111111] grow' : 'bg-black flex-1'}`} ref={scrollRef}>
            {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 text-sm font-medium leading-relaxed ${msg.role === MessageRole.USER ? 'bg-[#c5a47e] text-black' : msg.role === MessageRole.SYSTEM ? 'bg-transparent text-white/40 text-xs uppercase tracking-widest font-bold text-center w-full' : 'bg-white/5 text-white border border-white/10'}`}>{msg.text}</div>
                </div>
            ))}
            {isGenerating && (
                <div className="flex justify-start"><div className="bg-black border border-white/20 px-5 py-4 flex items-center gap-3"><RefreshCw className="w-4 h-4 text-[#c5a47e] animate-spin" strokeWidth={2.5} /><span className="text-xs text-white/60 font-bold uppercase tracking-widest">Processing</span></div></div>
            )}
        </div>
        <div className={`flex-none p-6 border-t border-white/10 bg-black z-20`}>
            {!currentPresentation && !isGenerating && (
                <div className="mb-4 space-y-4">
                     {/* Generation Mode Selector */}
                     <div>
                        <div className="flex items-center gap-2 mb-2"><Layers className="w-3 h-3 text-white/40" /><span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Content Density</span></div>
                        <div className="grid grid-cols-4 gap-2">
                            {MODE_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setGenerationMode(opt.id)}
                                    className={`flex flex-col items-center justify-center py-2 px-1 border transition-all duration-150 ${generationMode === opt.id ? 'bg-[#c5a47e] text-black border-[#c5a47e]' : 'bg-black text-white/60 border-white/20 hover:border-[#c5a47e] hover:text-white'}`}
                                >
                                    <opt.icon className="w-4 h-4 mb-1" />
                                    <span className="text-[10px] font-bold">{opt.label}</span>
                                    <span className={`text-[9px] opacity-70 ${generationMode === opt.id ? 'text-black/60' : 'text-white/40'}`}>{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                     </div>

                     {/* Visual Style Selector */}
                     <div>
                        <div className="flex items-center gap-2 mb-2"><ImageIcon className="w-3 h-3 text-white/40" /><span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Visual Aesthetic</span></div>
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x">
                            {IMAGE_STYLES.map(style => (
                                <button key={style.id} onClick={() => setSelectedImageStyle(style)} className={`flex-none px-3 py-1.5 text-[11px] font-bold border transition-all duration-150 whitespace-nowrap snap-start ${selectedImageStyle.id === style.id ? 'bg-[#c5a47e] text-black border-[#c5a47e]' : 'bg-black text-white/60 border-white/20 hover:border-[#c5a47e] hover:text-white'}`}>{style.label}</button>
                            ))}
                        </div>
                     </div>

                     {/* Draft Preview Toggle (optional) */}
                     {setEnableDraftPreview && (
                        <div className="flex items-center justify-between py-2 px-3 border border-white/10 bg-white/5">
                            <div className="flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-white/40" />
                                <span className="text-[11px] font-bold text-white/60">Preview slides before building</span>
                            </div>
                            <button
                                onClick={() => setEnableDraftPreview(!enableDraftPreview)}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${enableDraftPreview ? 'bg-[#c5a47e]' : 'bg-white/20'}`}
                            >
                                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enableDraftPreview ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </div>
                     )}
                </div>
            )}
            <div className="relative group">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())} placeholder={currentPresentation ? "Ask for changes..." : "Describe your presentation..."} disabled={isGenerating} className="w-full bg-black border border-white/20 py-4 pl-5 pr-14 text-sm font-bold focus:outline-none focus:border-[#c5a47e] transition-all duration-150 placeholder-white/30 text-white" autoFocus={mode === 'modal' && isChatOpen} />
                <button onClick={handleSendMessage} disabled={!inputValue.trim() || isGenerating} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#c5a47e] hover:bg-white disabled:opacity-50 disabled:bg-white/20 transition-all duration-150">{isGenerating ? <StopCircle className="w-5 h-5 text-black" strokeWidth={2.5} /> : <ArrowRight className="w-5 h-5 text-black" strokeWidth={2.5} />}</button>
            </div>
        </div>
    </>
    );
};
