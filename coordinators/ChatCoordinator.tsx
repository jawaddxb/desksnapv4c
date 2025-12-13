/**
 * ChatCoordinator
 *
 * Handles the floating chat modal for creating and editing presentations.
 * Uses ChatUIContext for state management.
 */

import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useChatUI } from '@/contexts/ChatUIContext';
import { Presentation } from '@/types';
import { Message } from '@/hooks/useChat';

interface ChatCoordinatorProps {
  currentPresentation: Presentation | null;
  messages: Message[];
  isGenerating: boolean;
  onSendMessage: () => void;
  modalScrollRef: React.RefObject<HTMLDivElement>;
}

export function ChatCoordinator({
  currentPresentation,
  messages,
  isGenerating,
  onSendMessage,
  modalScrollRef,
}: ChatCoordinatorProps) {
  const {
    inputValue,
    setInputValue,
    isChatOpen,
    setIsChatOpen,
    selectedImageStyle,
    setSelectedImageStyle,
    generationMode,
    setGenerationMode,
    showCreateChat,
    setShowCreateChat,
    enableDraftPreview,
    setEnableDraftPreview,
  } = useChatUI();

  // Only show modal if there's a presentation or showCreateChat is true
  if (!currentPresentation && !showCreateChat) {
    return null;
  }

  const isVisible = isChatOpen || showCreateChat;

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg h-[650px] bg-[#111111] shadow-2xl border border-white/20 z-[1000] flex flex-col overflow-hidden transition-all duration-150 origin-center ${
        isVisible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <ChatInterface
        mode="modal"
        messages={messages}
        isGenerating={isGenerating}
        currentPresentation={currentPresentation}
        isChatOpen={isVisible}
        setIsChatOpen={(v) => {
          setIsChatOpen(v);
          if (!v) setShowCreateChat(false);
        }}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={onSendMessage}
        selectedImageStyle={selectedImageStyle}
        setSelectedImageStyle={setSelectedImageStyle}
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        scrollRef={modalScrollRef}
        enableDraftPreview={enableDraftPreview}
        setEnableDraftPreview={setEnableDraftPreview}
      />
    </div>
  );
}
