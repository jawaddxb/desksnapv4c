/**
 * CopilotPanel Component
 *
 * Chat interface for the ideation copilot.
 * Displays messages and handles user input.
 * Includes Enhanced Mode toggle for Research Co-Pilot (Premium feature).
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, MessageRole, ResearchPreferences, ProgressState, Finding } from '@/types';
import { IdeationStage, ThemeSuggestion, IdeaNote } from '@/types/ideation';
import { DraftSetupPanel } from '@/components/shared/DraftSetupPanel';
import { EnhancedModePanel } from './EnhancedModePanel';
import { IdeationProgressBar } from './IdeationProgressBar';
import { CompletionQuestion } from '@/services/copilot';
import { ContentDensity } from '@/lib/contentBlockPrompts';

interface CopilotPanelProps {
  messages: Message[];
  stage: IdeationStage;
  isThinking: boolean;
  askUserQuestion?: {
    question: string;
    options?: string[];
  } | null;
  // Autonomous completion props
  notes?: IdeaNote[];
  completionQuestion?: CompletionQuestion | null;
  onDirectBuild?: () => void;  // Skip rough draft, build immediately
  onGoToRoughDraft?: () => void;  // Continue to rough draft first
  // Theme selection props for style-preview stage
  themeSuggestion?: ThemeSuggestion | null;
  selectedThemeId?: string;
  onSelectTheme?: (themeId: string) => void;
  // Content density props for draft setup
  contentDensity?: ContentDensity;
  onSelectDensity?: (density: ContentDensity) => void;
  // Message and action handlers
  onSendMessage: (message: string) => void;
  onBuildDeck?: () => void;
  onConfirmBuild?: () => void;
  /** Called when user confirms theme and density. mode: 'direct' builds immediately, 'draft' goes to rough draft */
  onConfirmThemeAndBuild?: (mode: 'direct' | 'draft') => void;
  onBackFromStylePreview?: () => void;
  // Enhanced mode (Research Co-Pilot) props
  topic?: string;
  isPremium?: boolean;
  onResearch?: (preferences: ResearchPreferences) => void;
  onCreateNotesFromFindings?: (findings: Finding[]) => void;
  onOpenResearchModal?: () => void;
  researchProgress?: ProgressState | null;
  researchFindings?: Finding[];
  researchSynthesis?: string;
}

// Stage descriptions (Studio Noir)
const STAGE_INFO: Record<IdeationStage, { label: string; color: string }> = {
  discover: { label: 'Discovering', color: 'bg-white/10 text-white/70' },
  expand: { label: 'Expanding', color: 'bg-white/10 text-white/70' },
  structure: { label: 'Structuring', color: 'bg-[#c5a47e]/20 text-[#c5a47e]' },
  ready: { label: 'Ready to Build', color: 'bg-[#c5a47e]/20 text-[#c5a47e]' },
  review: { label: 'Review & Build', color: 'bg-[#c5a47e] text-black' },
  'style-preview': { label: 'Choose Style', color: 'bg-[#c5a47e] text-black' },
};

// TypeScript types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({
  messages,
  stage,
  isThinking,
  askUserQuestion,
  // Autonomous completion props
  notes = [],
  completionQuestion,
  onDirectBuild,
  onGoToRoughDraft,
  // Theme selection props
  themeSuggestion,
  selectedThemeId,
  onSelectTheme,
  // Content density props
  contentDensity = 'detailed',
  onSelectDensity,
  onSendMessage,
  onBuildDeck,
  onConfirmBuild,
  onConfirmThemeAndBuild,
  onBackFromStylePreview,
  // Enhanced mode props
  topic = '',
  isPremium = true,
  onResearch,
  onCreateNotesFromFindings,
  onOpenResearchModal,
  researchProgress,
  researchFindings = [],
  researchSynthesis,
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [enhancedMode, setEnhancedMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    // CRITICAL: Stop voice recognition BEFORE clearing input
    // Otherwise onresult may re-set the input after we clear it
    if (recognitionRef.current) {
      recognitionRef.current.abort(); // Use abort() for immediate halt
      recognitionRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);

    onSendMessage(trimmed);
    setInput(''); // Now this will actually stick
  }, [input, isThinking, onSendMessage]);

  // Handle key press
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Toggle voice recording - MUST be defined before handleOptionClick
  const toggleVoiceRecording = useCallback(() => {
    if (isRecording) {
      // Stop recording
      recognitionRef.current?.stop();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setIsRecording(false);
      setRecordingTime(0);
    } else {
      // Check for browser support
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Start recording
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        // Show interim results in the input field
        setInput(finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecordingTime(0);
        // Focus the input so user can review/edit
        inputRef.current?.focus();
      };

      recognition.onerror = () => {
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        setRecordingTime(0);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1);
      }, 1000);
    }
  }, [isRecording]);

  // Handle option click - uses toggleVoiceRecording, so must come after it
  const handleOptionClick = useCallback((option: string) => {
    const lowerOption = option.toLowerCase();

    // Special handling for voice brainstorm option
    if (option.includes('🎤') || lowerOption.includes('verbally') || lowerOption.includes('explain verbally')) {
      toggleVoiceRecording();
      return;
    }

    // CRITICAL: Intercept build commands and call onBuildDeck directly
    // This bypasses the AI loop entirely - fixes infinite loop bug
    if (
      lowerOption.includes('build the deck') ||
      lowerOption.includes('build my deck') ||
      lowerOption.includes('build with what we have') ||
      lowerOption === 'start building' ||
      lowerOption === 'build it' ||
      lowerOption === 'build now'
    ) {
      if (onBuildDeck) {
        onBuildDeck(); // Directly trigger deck building!
        return;
      }
    }

    // All other options go to AI as before
    onSendMessage(option);
  }, [onSendMessage, onBuildDeck, toggleVoiceRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stageInfo = STAGE_INFO[stage];

  // Render draft setup panel in style-preview stage (includes density + theme selection)
  if (stage === 'style-preview' && selectedThemeId && onSelectTheme && onSelectDensity) {
    return (
      <DraftSetupPanel
        suggestion={themeSuggestion || undefined}
        selectedThemeId={selectedThemeId}
        onSelectTheme={onSelectTheme}
        contentDensity={contentDensity}
        onSelectDensity={onSelectDensity}
        onConfirm={onConfirmThemeAndBuild || (() => {})}
        onBack={onBackFromStylePreview || (() => {})}
        isLoading={isThinking}
      />
    );
  }

  // Render Enhanced Mode panel when active
  if (enhancedMode && onResearch && onCreateNotesFromFindings) {
    return (
      <div className="flex flex-col h-full bg-[#111111] border-l border-white/10">
        <EnhancedModePanel
          isActive={enhancedMode}
          topic={topic}
          isPremium={isPremium}
          onResearch={onResearch}
          onCreateNotes={onCreateNotesFromFindings}
          onClose={() => setEnhancedMode(false)}
          onExpandModal={onOpenResearchModal}
          progress={researchProgress || null}
          findings={researchFindings}
          synthesis={researchSynthesis}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#111111] border-l border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#c5a47e] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wide text-sm">Ideation Copilot</h3>
            <span className={`text-xs px-2 py-0.5 uppercase tracking-widest ${stageInfo.color}`}>
              {stageInfo.label}
            </span>
          </div>
        </div>

        {/* Build Deck button (when ready) */}
        {stage === 'ready' && onBuildDeck && (
          <button
            onClick={onBuildDeck}
            className="px-4 py-2 bg-[#c5a47e] text-black
                       font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors
                       flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Build Deck
          </button>
        )}

        {/* Confirm & Build button (in review stage) */}
        {stage === 'review' && onConfirmBuild && (
          <button
            onClick={onConfirmBuild}
            className="px-4 py-2 bg-[#c5a47e] text-black
                       font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors
                       flex items-center gap-2 animate-pulse"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Confirm & Build
          </button>
        )}
      </div>

      {/* Enhanced Mode Toggle - shows in expand stage */}
      {(stage === 'expand' || stage === 'discover') && onResearch && (
        <div className="flex p-2 border-b border-white/10 bg-black/50">
          <button
            onClick={() => setEnhancedMode(false)}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors ${
              !enhancedMode
                ? 'bg-white/10 text-white'
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setEnhancedMode(true)}
            className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-1.5 ${
              enhancedMode
                ? 'bg-[#c5a47e] text-black'
                : 'bg-transparent text-white/50 hover:text-white/70'
            }`}
          >
            <span>🔬</span>
            Enhanced
            {!isPremium && (
              <span className="text-[10px] px-1 py-0.5 bg-black/20 rounded">Pro</span>
            )}
          </button>
        </div>
      )}

      {/* Autonomous Progress Bar - shows when AI is working or notes exist */}
      {(isThinking || notes.length > 0) && !completionQuestion && (
        <IdeationProgressBar notes={notes} isThinking={isThinking} />
      )}

      {/* Completion UI - shows when autonomous ideation is complete */}
      {completionQuestion && !isThinking && (
        <div className="p-4 bg-gradient-to-b from-black/50 to-transparent border-b border-white/10">
          <p className="text-white mb-4 text-sm">{completionQuestion.question}</p>

          {/* Primary actions - solid gold buttons */}
          <div className="flex gap-2 mb-3">
            {completionQuestion.primaryActions.map((action) => {
              const isDirectBuild = action.toLowerCase().includes('build the deck');
              const isRoughDraft = action.toLowerCase().includes('rough draft');
              return (
                <button
                  key={action}
                  onClick={() => {
                    if (isDirectBuild && onDirectBuild) {
                      onDirectBuild();
                    } else if (isRoughDraft && onGoToRoughDraft) {
                      onGoToRoughDraft();
                    } else if (onBuildDeck) {
                      onBuildDeck();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-[#c5a47e] text-black font-bold
                             text-xs uppercase tracking-wider hover:bg-white transition-colors"
                >
                  {action}
                </button>
              );
            })}
          </div>

          {/* Secondary options - text pills */}
          <div className="flex flex-wrap gap-2">
            {completionQuestion.secondaryOptions.map((option) => (
              <button
                key={option}
                onClick={() => onSendMessage(option)}
                className="px-3 py-1.5 border border-white/20 text-white/70
                           text-xs hover:border-[#c5a47e] hover:text-[#c5a47e] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message with starter pills */}
        {messages.length === 0 && !isThinking && (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 border border-[#c5a47e] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            <p className="font-bold text-white mb-1 uppercase tracking-wide">What would you like to present about?</p>
            <p className="text-sm text-white/50 mb-5">Choose a starting point, type, or talk about your idea</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                "A product or service",
                "A business pitch",
                "An educational topic",
                "A creative project"
              ].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(option)}
                  className="px-4 py-2 bg-transparent border border-white/20 text-sm
                             text-white/70 hover:border-[#c5a47e] hover:text-[#c5a47e]
                             transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
            {/* Voice brainstorm option */}
            <button
              onClick={toggleVoiceRecording}
              className="mt-2 px-5 py-2.5 bg-[#c5a47e] text-black
                         text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors
                         flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
              Talk about my idea
            </button>
            <p className="text-xs text-white/30 mt-3">Speak for 1-2 minutes and I'll extract the key points</p>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 ${
                msg.role === MessageRole.USER
                  ? 'bg-[#c5a47e] text-black'
                  : msg.role === MessageRole.SYSTEM
                  ? 'bg-white/5 text-white/50 text-sm italic'
                  : 'bg-white/10 text-white'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#c5a47e] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#c5a47e] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#c5a47e] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-white/50 uppercase tracking-wider">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Question with options */}
        {askUserQuestion && !isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="bg-white/10 px-4 py-2 mb-2">
                <p className="text-white">{askUserQuestion.question}</p>
              </div>
              {askUserQuestion.options && askUserQuestion.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {askUserQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      className="px-3 py-1.5 bg-transparent border border-white/20 text-sm
                                 text-white/70 hover:border-[#c5a47e] hover:text-[#c5a47e] transition-colors"
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

      {/* Recording indicator */}
      {isRecording && (
        <div className="px-4 py-2 bg-red-900/30 border-t border-red-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400 font-medium uppercase tracking-wider">Recording... {formatTime(recordingTime)}</span>
          </div>
          <button
            onClick={toggleVoiceRecording}
            className="text-sm text-red-400 hover:text-red-300 font-medium uppercase tracking-wider"
          >
            Stop & Review
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-white/10 bg-black">
        <div className="flex items-end gap-2">
          {/* Microphone button */}
          <button
            onClick={toggleVoiceRecording}
            disabled={isThinking}
            className={`p-3 transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-[#c5a47e]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording
                  ? "Speak now... your words will appear here"
                  : stage === 'discover'
                  ? "What's your presentation about?"
                  : "Share your thoughts or ask a question..."
              }
              disabled={isThinking}
              rows={1}
              className={`w-full px-4 py-3 bg-[#111111] border text-white placeholder-white/30
                         resize-none focus:outline-none focus:ring-1 focus:ring-[#c5a47e] focus:border-[#c5a47e]
                         disabled:opacity-50 disabled:cursor-not-allowed ${
                           isRecording ? 'border-red-500/50 bg-red-900/20' : 'border-white/20'
                         }`}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-3 bg-[#c5a47e] text-black hover:bg-white
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
        <p className="text-xs text-white/30 mt-2 text-center">
          {isRecording ? 'Click the mic again to stop, then edit or send' : 'Press Enter to send, Shift+Enter for new line, or use the mic'}
        </p>
      </div>
    </div>
  );
};

export default CopilotPanel;
