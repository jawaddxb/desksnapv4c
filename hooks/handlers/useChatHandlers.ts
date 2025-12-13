/**
 * Chat Handlers Hook
 *
 * Handles message sending and chat-related operations.
 * Extracted from AppContent.tsx for better organization.
 */

import { useCallback } from 'react';
import { Slide, GenerationMode } from '@/types';
import { IMAGE_STYLES } from '@/config/imageStyles';

export interface UseChatHandlersOptions {
  // Chat UI state
  inputValue: string;
  setInputValue: (value: string) => void;
  setIsChatOpen: (open: boolean) => void;
  setShowCreateChat: (show: boolean) => void;
  selectedImageStyle: (typeof IMAGE_STYLES)[number];
  generationMode: GenerationMode;
  enableDraftPreview: boolean;
  resetForNewChat: () => void;

  // Chat messages
  addMessage: (msg: { id: string; role: string; text: string; timestamp: number }) => void;
  createUserMessage: (text: string) => { id: string; role: string; text: string; timestamp: number };
  createSystemMessage: (text: string) => { id: string; role: string; text: string; timestamp: number };
  createModelMessage: (text: string) => { id: string; role: string; text: string; timestamp: number };
  resetMessages: () => void;

  // Deck state
  isGenerating: boolean;

  // Deck actions
  createDeck: (
    topic: string,
    imageStyle: (typeof IMAGE_STYLES)[number],
    mode: GenerationMode
  ) => Promise<Slide[]>;

  // Workspace navigation
  goToRoughDraft: (
    source: string,
    options?: { input?: { topic: string; themeId: string; visualStyle: string } }
  ) => void;
}

export interface UseChatHandlersReturn {
  handleSendMessage: () => Promise<void>;
  handleCreateNew: () => void;
}

export function useChatHandlers(options: UseChatHandlersOptions): UseChatHandlersReturn {
  const {
    inputValue,
    setInputValue,
    setIsChatOpen,
    setShowCreateChat,
    selectedImageStyle,
    generationMode,
    enableDraftPreview,
    resetForNewChat,
    addMessage,
    createUserMessage,
    createSystemMessage,
    createModelMessage,
    resetMessages,
    isGenerating,
    createDeck,
    goToRoughDraft,
  } = options;

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isGenerating) return;

    const topic = inputValue.trim();
    addMessage(createUserMessage(topic));
    setInputValue('');

    try {
      if (enableDraftPreview) {
        addMessage(createSystemMessage('Preparing rough draft preview...'));
        goToRoughDraft('copilot', {
          input: {
            topic,
            themeId: 'executive',
            visualStyle: selectedImageStyle.prompt,
          },
        });
        setIsChatOpen(false);
        setShowCreateChat(false);
      } else {
        addMessage(createSystemMessage('Constructing Layout & Selecting Theme...'));
        const newSlides = await createDeck(topic, selectedImageStyle, generationMode);
        addMessage(createModelMessage(`Blueprint ready: ${newSlides.length} slides. Rendering visuals...`));
        setIsChatOpen(false);
        setShowCreateChat(false);
      }
    } catch (error) {
      console.error(error);
      addMessage(createSystemMessage('System Error. Check credentials.'));
    }
  }, [
    inputValue,
    isGenerating,
    enableDraftPreview,
    selectedImageStyle,
    generationMode,
    addMessage,
    createUserMessage,
    createSystemMessage,
    createModelMessage,
    setInputValue,
    setIsChatOpen,
    setShowCreateChat,
    goToRoughDraft,
    createDeck,
  ]);

  const handleCreateNew = useCallback(() => {
    resetForNewChat();
    resetMessages();
  }, [resetForNewChat, resetMessages]);

  return {
    handleSendMessage,
    handleCreateNew,
  };
}
