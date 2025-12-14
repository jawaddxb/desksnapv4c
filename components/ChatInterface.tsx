
import React, { useState, useEffect } from 'react';
import { Message, Presentation, MessageRole, GenerationMode } from '@/types';
import {
  Bot, Minus, RefreshCw, ImageIcon, ArrowRight, StopCircle,
  AlignLeft, Layers, FileText, Quote, Eye, ChevronDown,
  Sparkles, Settings2
} from 'lucide-react';
import { IMAGE_STYLES } from '@/config/imageStyles';
import { analyzeTopicForDefaults, getThemeDisplayName } from '@/lib/smartDefaults';

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
  // Smart defaults state
  const [showCustomize, setShowCustomize] = useState(false);
  const [smartDefaults, setSmartDefaults] = useState<ReturnType<typeof analyzeTopicForDefaults> | null>(null);

  // Analyze input for smart defaults (debounced)
  useEffect(() => {
    if (!currentPresentation && inputValue.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        const defaults = analyzeTopicForDefaults(inputValue);
        setSmartDefaults(defaults);
        // Auto-apply smart defaults if not customizing
        if (!showCustomize) {
          setGenerationMode(defaults.density);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (inputValue.trim().length <= 10) {
      setSmartDefaults(null);
    }
  }, [inputValue, currentPresentation, showCustomize]);

  return (
    <>
      {/* Modal header */}
      {mode === 'modal' && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#0d0d0d] cursor-move">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#c5a47e]" />
            <span className="text-xs font-medium text-white/60">Design Assistant</span>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1 hover:bg-white/5 rounded transition-colors text-white/40 hover:text-white"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Messages area */}
      <div
        className={`overflow-y-auto p-5 space-y-4 scroll-smooth ${mode === 'modal' ? 'bg-[#171717] grow' : 'bg-[#0d0d0d] flex-1'
          }`}
        ref={scrollRef}
      >
        {messages.length === 0 && !currentPresentation && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#c5a47e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-[#c5a47e]" />
            </div>
            <h3 className="text-sm font-medium text-white mb-2">
              What will you create today?
            </h3>
            <p className="text-xs text-white/40 max-w-[250px] mx-auto">
              Describe your presentation topic and AI will handle the rest with smart defaults.
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 text-sm leading-relaxed rounded-lg ${msg.role === MessageRole.USER
                  ? 'bg-[#c5a47e]/20 text-white'
                  : msg.role === MessageRole.SYSTEM
                    ? 'bg-transparent text-white/40 text-xs text-center w-full'
                    : 'bg-white/5 text-white/80 border border-white/5'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-[#171717] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-[#c5a47e] animate-spin" />
              <span className="text-xs text-white/60">Creating your presentation...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-none p-4 border-t border-white/8 bg-[#0d0d0d]">
        {/* Smart defaults indicator - only show when we have defaults */}
        {!currentPresentation && !isGenerating && smartDefaults && smartDefaults.confidence > 0.3 && (
          <div className="mb-3 p-3 bg-[#c5a47e]/5 border border-[#c5a47e]/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a47e]" />
                <span className="text-xs text-white/70">
                  AI suggests: {getThemeDisplayName(smartDefaults.themeId)} theme, {smartDefaults.density} content
                </span>
              </div>
              <button
                onClick={() => setShowCustomize(!showCustomize)}
                className="text-[10px] text-[#c5a47e] hover:text-[#d4b68e] transition-colors"
              >
                {showCustomize ? 'Hide' : 'Customize'}
              </button>
            </div>
          </div>
        )}

        {/* Customization panel - hidden by default */}
        {!currentPresentation && !isGenerating && showCustomize && (
          <div className="mb-4 space-y-4 p-4 bg-[#141414] border border-white/5 rounded-lg">
            {/* Content Density */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-3 h-3 text-white/40" />
                <span className="text-[10px] font-medium text-white/40">Content Density</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {MODE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setGenerationMode(opt.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded border transition-all duration-200 ${generationMode === opt.id
                        ? 'bg-[#c5a47e] text-black border-[#c5a47e]'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-[#c5a47e]/30 hover:text-white'
                      }`}
                  >
                    <opt.icon className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-3 h-3 text-white/40" />
                <span className="text-[10px] font-medium text-white/40">Visual Aesthetic</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {IMAGE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedImageStyle(style)}
                    className={`flex-none px-3 py-1.5 text-[11px] font-medium rounded border transition-all duration-200 whitespace-nowrap ${selectedImageStyle.id === style.id
                        ? 'bg-[#c5a47e] text-black border-[#c5a47e]'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-[#c5a47e]/30 hover:text-white'
                      }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Draft Preview Toggle */}
            {setEnableDraftPreview && (
              <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[11px] text-white/60">Preview slides before building</span>
                </div>
                <button
                  onClick={() => setEnableDraftPreview(!enableDraftPreview)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${enableDraftPreview ? 'bg-[#c5a47e]' : 'bg-white/20'
                    }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enableDraftPreview ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                  />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Customize toggle for when no smart defaults */}
        {!currentPresentation && !isGenerating && !smartDefaults && (
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="flex items-center gap-2 mb-3 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Customize options</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustomize ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Input field */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            placeholder={currentPresentation ? "Ask for changes..." : "What's your presentation about?"}
            disabled={isGenerating}
            className="w-full bg-[#171717] border border-white/10 rounded-lg py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[#c5a47e]/50 transition-all duration-200 placeholder-white/30 text-white"
            autoFocus={mode === 'modal' && isChatOpen}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#c5a47e] rounded hover:bg-[#d4b68e] disabled:opacity-30 disabled:bg-white/10 transition-all duration-200"
          >
            {isGenerating ? (
              <StopCircle className="w-4 h-4 text-black" />
            ) : (
              <ArrowRight className="w-4 h-4 text-black" />
            )}
          </button>
        </div>

        {/* Helper text */}
        {!currentPresentation && !isGenerating && (
          <p className="mt-2 text-[10px] text-white/30 text-center">
            Press Enter to generate. AI will select the best theme and layout automatically.
          </p>
        )}
      </div>
    </>
  );
};
