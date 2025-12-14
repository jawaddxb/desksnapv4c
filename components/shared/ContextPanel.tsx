import React, { useState, useRef } from 'react';
import { Slide, Message, GenerationMode } from '@/types';
import { IMAGE_STYLES } from '@/config/imageStyles';
import {
  MessageSquare, FileText, Sparkles, Send, Loader2,
  ChevronDown, Wand2
} from 'lucide-react';

type TabType = 'chat' | 'notes' | 'ai';

interface ContextPanelProps {
  /** Current slide for context */
  currentSlide: Slide | null;
  /** Chat messages */
  messages: Message[];
  /** Whether AI is generating */
  isGenerating: boolean;
  /** Chat input value */
  inputValue: string;
  setInputValue: (v: string) => void;
  /** Send message handler */
  onSendMessage: () => void;
  /** Update speaker notes */
  onUpdateNotes?: (notes: string) => void;
  /** AI suggestions (optional) */
  suggestions?: string[];
  /** Apply AI suggestion */
  onApplySuggestion?: (suggestion: string) => void;
  /** Generation settings */
  selectedImageStyle: typeof IMAGE_STYLES[0];
  setSelectedImageStyle: (s: typeof IMAGE_STYLES[0]) => void;
  generationMode: GenerationMode;
  setGenerationMode: (m: GenerationMode) => void;
  /** Scroll ref for messages */
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * ContextPanel - A tabbed panel that provides contextual tools:
 * - Chat: Slide-specific conversation with AI
 * - Notes: Speaker notes editor
 * - AI: Quick suggestions and enhancements
 */
export const ContextPanel: React.FC<ContextPanelProps> = ({
  currentSlide,
  messages,
  isGenerating,
  inputValue,
  setInputValue,
  onSendMessage,
  onUpdateNotes,
  suggestions = [],
  onApplySuggestion,
  selectedImageStyle,
  setSelectedImageStyle,
  generationMode,
  setGenerationMode,
  scrollRef,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [notesValue, setNotesValue] = useState(currentSlide?.speakerNotes || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync notes when slide changes
  React.useEffect(() => {
    setNotesValue(currentSlide?.speakerNotes || '');
  }, [currentSlide?.id]);

  const handleNotesChange = (value: string) => {
    setNotesValue(value);
    onUpdateNotes?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'ai', label: 'Enhance', icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-t border-[#D4E5D4]">
      {/* Tabs */}
      <div className="flex border-b border-[#D4E5D4] px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-xs font-medium
                transition-all duration-150
                ${activeTab === tab.id
                  ? 'text-[#6B8E6B] border-b-2 border-[#6B8E6B]'
                  : 'text-[#8FA58F] hover:text-[#4A5D4A]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-[#8FA58F] mx-auto mb-3" />
                  <p className="text-sm text-[#8FA58F]">
                    Ask about this slide or request changes
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`
                      p-3 rounded-lg text-sm
                      ${msg.role === 'user'
                        ? 'bg-[#6B8E6B]/15 text-[#1E2E1E] ml-8'
                        : 'bg-[#F5FAF7] text-[#4A5D4A] mr-8'
                      }
                    `}
                  >
                    {msg.content}
                  </div>
                ))
              )}

              {isGenerating && (
                <div className="flex items-center gap-2 p-3 bg-[#F5FAF7] rounded-lg mr-8">
                  <Loader2 className="w-4 h-4 animate-spin text-[#6B8E6B]" />
                  <span className="text-sm text-[#8FA58F]">Thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#D4E5D4]">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={currentSlide ? `Ask about "${currentSlide.title}"...` : 'Enter a topic to create a deck...'}
                  rows={2}
                  disabled={isGenerating}
                  className="w-full p-3 pr-12 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg text-sm text-[#1E2E1E] placeholder:text-[#8FA58F] focus:border-[#6B8E6B] focus:outline-none resize-none disabled:opacity-50"
                />
                <button
                  onClick={onSendMessage}
                  disabled={!inputValue.trim() || isGenerating}
                  className="absolute right-2 bottom-2 p-2 bg-[#6B8E6B] text-white rounded disabled:opacity-30 hover:bg-[#5A7A5A] transition-colors"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Quick settings */}
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={generationMode}
                  onChange={(e) => setGenerationMode(e.target.value as GenerationMode)}
                  className="text-[10px] bg-[#F5FAF7] border border-[#D4E5D4] rounded px-2 py-1 text-[#8FA58F] focus:outline-none"
                >
                  <option value="concise">Concise</option>
                  <option value="balanced">Balanced</option>
                  <option value="detailed">Detailed</option>
                  <option value="verbatim">Verbatim</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="flex-1 p-4 flex flex-col">
            <p className="text-xs text-[#8FA58F] mb-3">
              Speaker notes for this slide
            </p>
            <textarea
              value={notesValue}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add speaker notes..."
              className="flex-1 w-full p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg text-sm text-[#1E2E1E] placeholder:text-[#8FA58F] focus:border-[#6B8E6B] focus:outline-none resize-none"
            />
            <p className="text-[10px] text-[#8FA58F] mt-2">
              Notes are auto-saved and visible in presenter view
            </p>
          </div>
        )}

        {/* AI Enhance Tab */}
        {activeTab === 'ai' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <p className="text-xs text-[#8FA58F] mb-4">
              Quick enhancements for this slide
            </p>

            {/* Enhancement options */}
            <div className="space-y-2">
              {[
                { label: 'Make more impactful', action: 'Enhance the headline to be more compelling and memorable' },
                { label: 'Simplify content', action: 'Reduce text and make points more concise' },
                { label: 'Add statistics', action: 'Suggest relevant statistics or data points to support this slide' },
                { label: 'Improve flow', action: 'Suggest transition text to connect with the previous slide' },
                { label: 'Regenerate image', action: 'Create a new image that better matches the content' },
              ].map((option, i) => (
                <button
                  key={i}
                  onClick={() => onApplySuggestion?.(option.action)}
                  disabled={isGenerating}
                  className="w-full p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg text-left hover:bg-[#EDF5F0] hover:border-[#6B8E6B]/30 transition-all duration-150 group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#6B8E6B]/10 rounded flex items-center justify-center group-hover:bg-[#6B8E6B]/20 transition-colors">
                      <Wand2 className="w-4 h-4 text-[#8FA58F] group-hover:text-[#6B8E6B] transition-colors" />
                    </div>
                    <span className="text-sm text-[#4A5D4A] group-hover:text-[#1E2E1E] transition-colors">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom suggestions from AI */}
            {suggestions.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-[#8FA58F] mb-3">
                  AI Suggestions
                </p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => onApplySuggestion?.(suggestion)}
                      className="w-full p-3 bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 rounded-lg text-left hover:bg-[#6B8E6B]/15 transition-colors text-sm text-[#4A5D4A]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
