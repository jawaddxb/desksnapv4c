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
      return <span className="text-white/60">{this.props.fallback}</span>;
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
      <div className="text-xs text-white/30 text-center py-1 italic">
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
            ? 'bg-white/10'
            : 'bg-gradient-to-br from-[#c5a47e] to-[#a08060]'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white/60" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-black" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 min-w-0 ${isUser ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`inline-block text-left max-w-[95%] px-3.5 py-2.5 rounded-xl ${
            isUser
              ? 'bg-white/10 text-white/90'
              : 'bg-[#1a1816] border border-[#c5a47e]/20'
          }`}
        >
          <MarkdownErrorBoundary fallback={messageText}>
          <div className="text-sm leading-relaxed">
          <ReactMarkdown
            components={{
              // Headings
              h1: ({ children }) => (
                <h1 className="text-base font-bold text-white mb-2 mt-1 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold text-white/95 mb-1.5 mt-2 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-medium text-[#c5a47e] mb-1 mt-2 first:mt-0">
                  {children}
                </h3>
              ),

              // Paragraphs
              p: ({ children }) => (
                <p className="text-white/80 mb-2 last:mb-0">{children}</p>
              ),

              // Bold / Strong
              strong: ({ children }) => (
                <strong className="font-semibold text-[#c5a47e]">{children}</strong>
              ),

              // Italic / Emphasis
              em: ({ children }) => (
                <em className="italic text-white/70">{children}</em>
              ),

              // Unordered Lists
              ul: ({ children }) => (
                <ul className="my-2 space-y-1 pl-1">{children}</ul>
              ),

              // Ordered Lists
              ol: ({ children }) => (
                <ol className="my-2 space-y-1 pl-1 list-decimal list-inside marker:text-[#c5a47e]">
                  {children}
                </ol>
              ),

              // List Items
              li: ({ children }) => (
                <li className="text-white/80 flex items-start gap-2">
                  <span className="text-[#c5a47e] mt-1.5 w-1 h-1 rounded-full bg-[#c5a47e] flex-shrink-0" />
                  <span className="flex-1">{children}</span>
                </li>
              ),

              // Inline Code
              code: ({ children, className }) => {
                // Check if it's a code block (has language class)
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <code className="text-[#c5a47e] text-xs">{children}</code>
                  );
                }
                return (
                  <code className="px-1.5 py-0.5 bg-black/40 rounded text-[#c5a47e] text-xs font-mono">
                    {children}
                  </code>
                );
              },

              // Code Blocks
              pre: ({ children }) => (
                <pre className="my-2 p-3 bg-black/50 rounded-lg overflow-x-auto border border-white/5">
                  {children}
                </pre>
              ),

              // Blockquotes
              blockquote: ({ children }) => (
                <blockquote className="my-2 pl-3 border-l-2 border-[#c5a47e]/50 text-white/60 italic">
                  {children}
                </blockquote>
              ),

              // Horizontal Rule
              hr: () => <hr className="my-3 border-white/10" />,

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c5a47e] hover:text-[#d4b58f] underline underline-offset-2"
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
          className={`text-[10px] text-white/30 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
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
