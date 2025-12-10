/**
 * useChat Hook
 *
 * Manages chat message state and scroll behavior.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, MessageRole } from '../types';

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: MessageRole.MODEL,
  text: "Ready to snap some slides together. What's the topic?",
  timestamp: Date.now(),
};

export interface UseChatOptions {
  /** Whether chat modal is open */
  isChatOpen: boolean;
}

export interface UseChatReturn {
  /** Chat messages */
  messages: Message[];
  /** Add a message to chat */
  addMessage: (message: Message) => void;
  /** Add multiple messages at once */
  addMessages: (...messages: Message[]) => void;
  /** Reset messages to initial state */
  resetMessages: () => void;
  /** Create a system message */
  createSystemMessage: (text: string) => Message;
  /** Create a model message */
  createModelMessage: (text: string) => Message;
  /** Create a user message */
  createUserMessage: (text: string) => Message;
  /** Ref for sidebar scroll container */
  sidebarScrollRef: React.RefObject<HTMLDivElement>;
  /** Ref for modal scroll container */
  modalScrollRef: React.RefObject<HTMLDivElement>;
}

export function useChat({ isChatOpen }: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);

  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or chat open
  useEffect(() => {
    if (sidebarScrollRef.current) {
      sidebarScrollRef.current.scrollTop = sidebarScrollRef.current.scrollHeight;
    }
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = modalScrollRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((...newMessages: Message[]) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
  }, []);

  const createSystemMessage = useCallback((text: string): Message => ({
    id: 'sys-' + Date.now(),
    role: MessageRole.SYSTEM,
    text,
    timestamp: Date.now(),
  }), []);

  const createModelMessage = useCallback((text: string): Message => ({
    id: 'gen-' + Date.now(),
    role: MessageRole.MODEL,
    text,
    timestamp: Date.now(),
  }), []);

  const createUserMessage = useCallback((text: string): Message => ({
    id: Date.now().toString(),
    role: MessageRole.USER,
    text,
    timestamp: Date.now(),
  }), []);

  return {
    messages,
    addMessage,
    addMessages,
    resetMessages,
    createSystemMessage,
    createModelMessage,
    createUserMessage,
    sidebarScrollRef,
    modalScrollRef,
  };
}

export default useChat;
