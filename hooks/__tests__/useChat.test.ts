import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '../useChat';
import { MessageRole } from '@/types';

describe('useChat', () => {
  describe('initialization', () => {
    it('should initialize with a welcome message', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe(MessageRole.MODEL);
      expect(result.current.messages[0].text).toContain('Ready to snap');
    });

    it('should provide scroll refs', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      expect(result.current.sidebarScrollRef).toBeDefined();
      expect(result.current.modalScrollRef).toBeDefined();
    });
  });

  describe('addMessage', () => {
    it('should add a single message', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      act(() => {
        result.current.addMessage({
          id: 'test-1',
          role: MessageRole.USER,
          text: 'Hello',
          timestamp: Date.now(),
        });
      });

      expect(result.current.messages).toHaveLength(2);
      expect(result.current.messages[1].text).toBe('Hello');
      expect(result.current.messages[1].role).toBe(MessageRole.USER);
    });
  });

  describe('addMessages', () => {
    it('should add multiple messages at once', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      act(() => {
        result.current.addMessages(
          {
            id: 'test-1',
            role: MessageRole.USER,
            text: 'First',
            timestamp: Date.now(),
          },
          {
            id: 'test-2',
            role: MessageRole.MODEL,
            text: 'Second',
            timestamp: Date.now(),
          }
        );
      });

      expect(result.current.messages).toHaveLength(3);
      expect(result.current.messages[1].text).toBe('First');
      expect(result.current.messages[2].text).toBe('Second');
    });
  });

  describe('resetMessages', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      // Add some messages first
      act(() => {
        result.current.addMessage({
          id: 'test-1',
          role: MessageRole.USER,
          text: 'Hello',
          timestamp: Date.now(),
        });
      });

      expect(result.current.messages).toHaveLength(2);

      // Reset
      act(() => {
        result.current.resetMessages();
      });

      expect(result.current.messages).toHaveLength(1);
      expect(result.current.messages[0].role).toBe(MessageRole.MODEL);
    });
  });

  describe('message factory functions', () => {
    it('should create system message with correct role', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      const message = result.current.createSystemMessage('System alert');

      expect(message.role).toBe(MessageRole.SYSTEM);
      expect(message.text).toBe('System alert');
      expect(message.id).toMatch(/^sys-/);
      expect(message.timestamp).toBeDefined();
    });

    it('should create model message with correct role', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      const message = result.current.createModelMessage('AI response');

      expect(message.role).toBe(MessageRole.MODEL);
      expect(message.text).toBe('AI response');
      expect(message.id).toMatch(/^gen-/);
    });

    it('should create user message with correct role', () => {
      const { result } = renderHook(() => useChat({ isChatOpen: false }));

      const message = result.current.createUserMessage('User input');

      expect(message.role).toBe(MessageRole.USER);
      expect(message.text).toBe('User input');
      // User message id is just timestamp
      expect(message.id).toMatch(/^\d+$/);
    });
  });
});
