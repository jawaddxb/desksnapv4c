/**
 * Chat Context
 *
 * Manages chat-related state for the AI copilot interface.
 * Single responsibility: Chat messages, input state, and generation settings.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { GenerationMode, Message } from '../types';
import { IMAGE_STYLES } from '../lib/themes';
import { useChat } from '../hooks/useChat';

export type ImageStyle = typeof IMAGE_STYLES[number];

export interface ChatContextValue {
  // Input state
  inputValue: string;
  setInputValue: (value: string) => void;

  // Style and mode settings
  selectedImageStyle: ImageStyle;
  setSelectedImageStyle: (style: ImageStyle) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;

  // Draft preview toggle
  enableDraftPreview: boolean;
  setEnableDraftPreview: (enabled: boolean) => void;

  // Messages from useChat
  messages: Message[];
  addMessage: (message: Message) => void;
  resetMessages: () => void;
  createSystemMessage: (text: string) => Message;
  createModelMessage: (text: string) => Message;
  createUserMessage: (text: string) => Message;

  // Scroll refs
  sidebarScrollRef: React.RefObject<HTMLDivElement | null>;
  modalScrollRef: React.RefObject<HTMLDivElement | null>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export interface ChatProviderProps {
  children: ReactNode;
  /** Whether chat modal is open (for scroll behavior) */
  isChatOpen?: boolean;
}

/**
 * Provider for chat-related state.
 */
export function ChatProvider({ children, isChatOpen = false }: ChatProviderProps) {
  // Input state
  const [inputValue, setInputValue] = useState('');

  // Style and mode settings
  const [selectedImageStyle, setSelectedImageStyle] = useState<ImageStyle>(IMAGE_STYLES[0]);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('balanced');

  // Draft preview toggle
  const [enableDraftPreview, setEnableDraftPreview] = useState(false);

  // Chat messages hook
  const {
    messages,
    addMessage,
    resetMessages,
    createSystemMessage,
    createModelMessage,
    createUserMessage,
    sidebarScrollRef,
    modalScrollRef,
  } = useChat({ isChatOpen });

  const value = useMemo<ChatContextValue>(() => ({
    // Input state
    inputValue,
    setInputValue,

    // Style and mode settings
    selectedImageStyle,
    setSelectedImageStyle,
    generationMode,
    setGenerationMode,

    // Draft preview toggle
    enableDraftPreview,
    setEnableDraftPreview,

    // Messages
    messages,
    addMessage,
    resetMessages,
    createSystemMessage,
    createModelMessage,
    createUserMessage,

    // Scroll refs
    sidebarScrollRef,
    modalScrollRef,
  }), [
    inputValue,
    selectedImageStyle,
    generationMode,
    enableDraftPreview,
    messages,
    addMessage,
    resetMessages,
    createSystemMessage,
    createModelMessage,
    createUserMessage,
    sidebarScrollRef,
    modalScrollRef,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Hook to access chat context.
 * Throws if used outside of ChatProvider.
 */
export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

/**
 * Safe hook that returns null if outside provider.
 */
export function useChatContextSafe(): ChatContextValue | null {
  return useContext(ChatContext);
}
