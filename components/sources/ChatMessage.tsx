/**
 * ChatMessage Component
 *
 * Renders chat messages with proper markdown formatting.
 * Supports headings, bold, lists, code blocks, and more.
 */

import React, { Component, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, MessageRole } from '@/types';
import { Bot, User } from 'lucide-react';

// Error boundary to catch ReactMarkdown crashes
class MarkdownErrorBoundary extends Component<
  { children: ReactNode; fallback: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Markdown rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <span className="text-[#8FA58F]">{this.props.fallback}</span>;
    }
    return this.props.children;
  }
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isSystem = message.role === MessageRole.SYSTEM;

  // Safety check - ensure text is a valid string
  const messageText = message.text ?? '';

  // System messages (usually hidden or styled differently)
  if (isSystem) {
    return (
      <div className="text-xs text-[#8FA58F] text-center py-1 italic">
        {messageText}
      </div>
    );
  }

  // Skip rendering if no text content
  if (!messageText.trim()) {
    return null;
  }

  return (
    <div
      className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-[#EDF5F0]'
            : 'bg-gradient-to-br from-[#6B8E6B] to-[#4A5D4A]'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-[#8FA58F]" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`inline-block text-left max-w-[95%] px-3.5 py-2.5 rounded-xl ${
            isUser
              ? 'bg-[#EDF5F0] text-[#1E2E1E]'
              : 'bg-white border border-[#D4E5D4]'
          }`}
        >
          <MarkdownErrorBoundary fallback={messageText}>
          <div className="text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-base font-bold text-[#1E2E1E] mb-2 mt-1 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-[#1E2E1E] mb-1.5 mt-2 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-medium text-[#6B8E6B] mb-1 mt-2 first:mt-0">
                  {children}
                </h3>
              ),

              // Paragraphs
              p: ({ children }) => (
                <p className="text-[#4A5D4A] mb-2 last:mb-0">{children}</p>
              ),

              // Bold / Strong
              strong: ({ children }) => (
                <strong className="font-semibold text-[#6B8E6B]">{children}</strong>
              ),

              // Italic / Emphasis
              em: ({ children }) => (
                <em className="italic text-[#8FA58F]">{children}</em>
              ),

              // Unordered Lists
              ul: ({ children }) => (
                <ul className="my-2 space-y-1 pl-1">{children}</ul>
              ),

              // Ordered Lists
              ol: ({ children }) => (
                <ol className="my-2 space-y-1 pl-1 list-decimal list-inside marker:text-[#6B8E6B]">
                  {children}
                </ol>
              ),

              // List Items
              li: ({ children }) => (
                <li className="text-[#4A5D4A] flex items-start gap-2">
                  <span className="text-[#6B8E6B] mt-1.5 w-1 h-1 rounded-full bg-[#6B8E6B] flex-shrink-0" />
                  <span className="flex-1">{children}</span>
                </li>
              ),

              // Inline Code
              code: ({ children, className }) => {
                // Check if it's a code block (has language class)
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <code className="text-[#6B8E6B] text-xs">{children}</code>
                  );
                }
                return (
                  <code className="px-1.5 py-0.5 bg-[#F5FAF7] rounded text-[#6B8E6B] text-xs font-mono">
                    {children}
                  </code>
                );
              },

              // Code Blocks
              pre: ({ children }) => (
                <pre className="my-2 p-3 bg-[#F5FAF7] rounded-lg overflow-x-auto border border-[#D4E5D4]">
                  {children}
                </pre>
              ),

              // Blockquotes
              blockquote: ({ children }) => (
                <blockquote className="my-2 pl-3 border-l-2 border-[#6B8E6B]/50 text-[#8FA58F] italic">
                  {children}
                </blockquote>
              ),

              // Horizontal Rule
              hr: () => <hr className="my-3 border-[#D4E5D4]" />,

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B8E6B] hover:text-[#4A5D4A] underline underline-offset-2"
                >
                  {children}
                </a>
              ),
            }}
          >
            {messageText}
          </ReactMarkdown>
          </div>
          </MarkdownErrorBoundary>
        </div>

        {/* Timestamp */}
        <div
          className={`text-[10px] text-[#8FA58F] mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? 'pr-1' : 'pl-1'
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

/**
 * Format timestamp for display
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default ChatMessage;
