/**
 * ChatUIContext
 *
 * Manages chat-related UI state: input, modal visibility, generation settings.
 * Extracted from App.tsx to reduce complexity.
 *
 * SRP: Chat interface state management.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GenerationMode } from '@/types';
import { IMAGE_STYLES } from '@/config/imageStyles';

interface ChatUIState {
  // Chat input
  inputValue: string;
  setInputValue: (value: string) => void;

  // Modal visibility
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  showCreateChat: boolean;
  setShowCreateChat: (value: boolean) => void;

  // Generation settings
  selectedImageStyle: typeof IMAGE_STYLES[0];
  setSelectedImageStyle: (style: typeof IMAGE_STYLES[0]) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;

  // Draft preview mode
  enableDraftPreview: boolean;
  setEnableDraftPreview: (value: boolean) => void;

  // Actions
  resetForNewChat: () => void;
}

const ChatUIContext = createContext<ChatUIState | null>(null);

interface ChatUIProviderProps {
  children: ReactNode;
}

export function ChatUIProvider({ children }: ChatUIProviderProps) {
  // Chat input
  const [inputValue, setInputValue] = useState('');

  // Modal visibility
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false);

  // Generation settings
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('balanced');

  // Draft preview mode
  const [enableDraftPreview, setEnableDraftPreview] = useState(false);

  // Reset state for starting a new chat
  const resetForNewChat = () => {
    setShowCreateChat(true);
    setGenerationMode('balanced');
  };

  return (
    <ChatUIContext.Provider
      value={{
        inputValue,
        setInputValue,
        isChatOpen,
        setIsChatOpen,
        showCreateChat,
        setShowCreateChat,
        selectedImageStyle,
        setSelectedImageStyle,
        generationMode,
        setGenerationMode,
        enableDraftPreview,
        setEnableDraftPreview,
        resetForNewChat,
      }}
    >
      {children}
    </ChatUIContext.Provider>
  );
}

export function useChatUI(): ChatUIState {
  const context = useContext(ChatUIContext);
  if (!context) {
    throw new Error('useChatUI must be used within a ChatUIProvider');
  }
  return context;
}
