/**
 * CopilotPanel Component
 *
 * Chat interface for the ideation copilot.
 * Displays messages and handles user input.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, MessageRole } from '../../types';
import { IdeationStage } from '../../types/ideation';

interface CopilotPanelProps {
  messages: Message[];
  stage: IdeationStage;
  isThinking: boolean;
  askUserQuestion?: {
    question: string;
    options?: string[];
  } | null;
  onSendMessage: (message: string) => void;
  onBuildDeck?: () => void;
}

// Stage descriptions
const STAGE_INFO: Record<IdeationStage, { label: string; color: string }> = {
  discover: { label: 'Discovering', color: 'bg-amber-100 text-amber-700' },
  expand: { label: 'Expanding', color: 'bg-blue-100 text-blue-700' },
  structure: { label: 'Structuring', color: 'bg-green-100 text-green-700' },
  ready: { label: 'Ready to Build', color: 'bg-purple-100 text-purple-700' },
};

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages,
  stage,
  isThinking,
  askUserQuestion,
  onSendMessage,
  onBuildDeck,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle send
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    onSendMessage(trimmed);
    setInput('');
  }, [input, isThinking, onSendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Handle option click
  const handleOptionClick = useCallback((option: string) => {
    onSendMessage(option);
  }, [onSendMessage]);

  const stageInfo = STAGE_INFO[stage];

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ideation Copilot</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${stageInfo.color}`}>
              {stageInfo.label}
            </span>
          </div>
        </div>

        {/* Build Deck button (when ready) */}
        {stage === 'ready' && onBuildDeck && (
          <button
            onClick={onBuildDeck}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white
                       rounded-lg font-medium text-sm hover:opacity-90 transition-opacity
                       flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Build Deck
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            <p className="font-medium text-gray-700">Start your ideation session</p>
            <p className="text-sm mt-1">Tell me about the presentation you want to create</p>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                msg.role === MessageRole.USER
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : msg.role === MessageRole.SYSTEM
                  ? 'bg-gray-100 text-gray-600 text-sm italic'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Question with options */}
        {askUserQuestion && !isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 mb-2">
                <p className="text-gray-800">{askUserQuestion.question}</p>
              </div>
              {askUserQuestion.options && askUserQuestion.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {askUserQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-sm
                                 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                stage === 'discover'
                  ? "What's your presentation about?"
                  : "Share your thoughts or ask a question..."
              }
              disabled={isThinking}
              rows={1}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl
                         resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default CopilotPanel;
