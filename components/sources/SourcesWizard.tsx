/**
 * SourcesWizard Component
 *
 * Main container for the sources-based deck creation experience.
 * Handles VideoDeck (video sources) and Research & Present (web sources) modes.
 * Uses AI-centric layout: large chat panel, compact sources list.
 */

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageRole } from '../../types';
import {
  IdeationSession,
  IdeaNote,
  Source,
  DeckRecipe,
  ContentType,
  RECIPE_COLUMNS,
  createSourcesSession,
} from '../../types/ideation';
import { runSourcesAgentLoop } from '../../services/sourcesAgent';
import { AgentResponse } from '../../services/copilotAgent';
import { createIdeationSession, updateIdeationSession } from '../../services/api/ideationService';
import { ideationKeys } from '../../hooks/queries/useIdeationQueries';
import { useAutoSave } from '../../hooks/useAutoSave';
import { FlowCanvas } from '../ideation/FlowCanvas';
import { CollapsibleSourcesList } from './CollapsibleSourcesList';
import { ProofSidebar } from './ProofSidebar';
import { ChatMessage } from './ChatMessage';
import { TopicPillsPanel } from './TopicPillsPanel';
import { Plus, ArrowLeft, Video, Globe, Link, Bot } from 'lucide-react';

interface SourcesWizardProps {
  /** Preset mode: 'video' for VideoDeck, 'web' for Research & Present */
  preset: 'video' | 'web' | 'mixed';
  /** Initial topic (optional) */
  initialTopic?: string;
  /** Recipe type for deck output - determines column structure */
  recipe: DeckRecipe;
  /** Called when wizard is closed */
  onClose?: () => void;
  /** Called when ready to build deck */
  onBuildDeck?: (session: IdeationSession) => void;
}

export const SourcesWizard: React.FC<SourcesWizardProps> = ({
  preset,
  initialTopic,
  recipe,
  onClose,
  onBuildDeck,
}) => {
  // Get columns for this recipe
  const columns = RECIPE_COLUMNS[recipe];

  // Query client for cache invalidation
  const queryClient = useQueryClient();

  // Session state
  const [session, setSession] = useState<IdeationSession>(() =>
    createSourcesSession(initialTopic || '', preset, recipe)
  );
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [askUserQuestion, setAskUserQuestion] = useState<AgentResponse['askUserQuestion'] | null>(null);
  const [showProofSidebar, setShowProofSidebar] = useState(false);

  // Persistence state - track if session has been saved to database
  const [isSessionPersisted, setIsSessionPersisted] = useState(false);
  const persistingRef = useRef(false); // Prevent race conditions

  // URL input state
  const [urlInput, setUrlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Topic pills state - shown after comprehensive extraction
  const [showPillsForSource, setShowPillsForSource] = useState<string | null>(null);

  // Check if any source has comprehensive extraction results ready for pills
  const pillsSource = useMemo(() => {
    if (!showPillsForSource) return null;
    return session.sources?.find(s =>
      s.id === showPillsForSource &&
      s.status === 'ingested' &&
      s.detectedThemes?.length &&
      s.detectedTypes?.length
    );
  }, [session.sources, showPillsForSource]);

  // Ref to always access current session (avoids stale closures in agent callbacks)
  const sessionRef = useRef<IdeationSession>(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Auto-save session changes to database (only when persisted)
  const { saveStatus } = useAutoSave({
    data: isSessionPersisted ? session : null,
    onSave: async (sessionData) => {
      if (sessionData?.id) {
        await updateIdeationSession(sessionData.id, sessionData);
      }
    },
    onSaveComplete: () => {
      // Invalidate list cache to keep dashboard in sync
      queryClient.invalidateQueries({ queryKey: ideationKeys.lists() });
    },
    debounceMs: 2000,
    enabled: isSessionPersisted,
  });

  // Update session helper
  const updateSession = useCallback((updates: Partial<IdeationSession>) => {
    setSession(prev => ({
      ...prev,
      ...updates,
      lastModified: Date.now(),
    }));
  }, []);

  // Add note helper
  const addNote = useCallback((note: IdeaNote) => {
    setSession(prev => ({
      ...prev,
      notes: [...prev.notes, note],
      lastModified: Date.now(),
    }));
  }, []);

  // Handle adding a source URL
  const handleAddSource = useCallback(async (url: string, type?: 'video' | 'web') => {
    // Detect type from URL if not provided
    const sourceType = type || (url.includes('youtube.com') || url.includes('youtu.be') ? 'video' : 'web');

    // Create session in database on first source add (prevents race conditions)
    if (!isSessionPersisted && !persistingRef.current) {
      persistingRef.current = true;
      try {
        const savedSession = await createIdeationSession(session);
        // Update local session with server-assigned ID and mark as persisted
        setSession(prev => ({ ...prev, id: savedSession.id }));
        setIsSessionPersisted(true);
        // Invalidate the list query so dashboard shows the new session
        queryClient.invalidateQueries({ queryKey: ideationKeys.lists() });
        console.log('[SourcesWizard] Session created:', savedSession.id);
      } catch (error) {
        console.error('[SourcesWizard] Failed to create session:', error);
        // Continue anyway - don't block the user experience
      } finally {
        persistingRef.current = false;
      }
    }

    // Create the message
    const message = `Add this ${sourceType} source: ${url}`;

    // Send to agent
    await handleSendMessage(message);
  }, [session, isSessionPersisted, queryClient]);

  // Handle URL form submit
  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      handleAddSource(urlInput.trim());
      setUrlInput('');
    }
  }, [urlInput, handleAddSource]);

  // Handle paste in URL input
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText.match(/^https?:\/\//)) {
      e.preventDefault();
      handleAddSource(pastedText.trim());
    }
  }, [handleAddSource]);

  // Handle sending a message to the agent
  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message to history
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: MessageRole.USER,
      text: message,
      timestamp: Date.now(),
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));

    setIsThinking(true);
    setAskUserQuestion(null);

    try {
      // Run the sources agent loop with getter to avoid stale closures
      const response = await runSourcesAgentLoop(
        message,
        () => sessionRef.current,
        updateSession,
        addNote
      );

      // Add the agent's response
      if (response.text) {
        const modelMsg = {
          id: `msg-${Date.now()}`,
          role: MessageRole.MODEL,
          text: response.text,
          timestamp: Date.now(),
        };
        setSession(prev => ({
          ...prev,
          messages: [...prev.messages, modelMsg],
        }));
      }

      // Handle ask_user question
      if (response.askUserQuestion) {
        setAskUserQuestion(response.askUserQuestion);
      }
    } catch (error) {
      console.error('Sources agent error:', error);
      const errorMsg = {
        id: `msg-${Date.now()}`,
        role: MessageRole.MODEL,
        text: "I encountered an issue. Could you try again?",
        timestamp: Date.now(),
      };
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, errorMsg],
      }));
    } finally {
      setIsThinking(false);
    }
  }, [updateSession, addNote]);  // sessionRef.current used instead of session

  // Handle note operations
  const handleUpdateNote = useCallback((noteId: string, updates: Partial<IdeaNote>) => {
    setSession(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === noteId ? { ...n, ...updates } : n),
      lastModified: Date.now(),
    }));
  }, []);

  const handleDeleteNote = useCallback((noteId: string) => {
    setSession(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== noteId),
      lastModified: Date.now(),
    }));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  const handleMoveNote = useCallback((noteId: string, column: number, row: number) => {
    setSession(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === noteId ? { ...n, column, row } : n),
      lastModified: Date.now(),
    }));
  }, []);

  const handleAddNote = useCallback((column: number) => {
    const note: IdeaNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      content: 'New note...',
      type: 'user',
      column,
      row: session.notes.filter(n => n.column === column).length,
      color: 'yellow',
      approved: true,
      createdAt: Date.now(),
    };
    addNote(note);
    setSelectedNoteId(note.id);
  }, [session.notes, addNote]);

  // Handle quick action clicks (from askUserQuestion options)
  const handleQuickAction = useCallback((option: string) => {
    handleSendMessage(option);
  }, [handleSendMessage]);

  // Handle build deck
  const handleBuildDeck = useCallback(() => {
    if (session.stage === 'ready' && onBuildDeck) {
      onBuildDeck(session);
    } else {
      // Ask agent to mark ready
      handleSendMessage("I'm ready to build the deck. Please summarize what we have.");
    }
  }, [session, onBuildDeck, handleSendMessage]);

  // Get selected note for proof sidebar
  const selectedNote = selectedNoteId
    ? session.notes.find(n => n.id === selectedNoteId)
    : null;

  // Show proof sidebar when a note with proof links is selected
  useEffect(() => {
    setShowProofSidebar(!!selectedNote?.proofLinks?.length);
  }, [selectedNote]);

  // Detect when a source finishes comprehensive extraction and show pills
  useEffect(() => {
    const justIngested = session.sources?.find(s =>
      s.status === 'ingested' &&
      s.detectedThemes?.length &&
      s.detectedTypes?.length &&
      !showPillsForSource  // Don't show if already showing for another source
    );
    if (justIngested) {
      setShowPillsForSource(justIngested.id);
    }
  }, [session.sources, showPillsForSource]);

  // Handle accepting all notes from pills (move to structure stage)
  const handlePillsAcceptAll = useCallback(() => {
    setShowPillsForSource(null);
    updateSession({ stage: 'structure' });

    // Send a message to copilot asking for refinement
    const refinementMsg = "I've added all the extracted content to the board. Would you like me to:\n- Organize these into a logical flow?\n- Highlight the key insights?\n- Suggest which content to prioritize?\n- Something else?";
    const modelMsg = {
      id: `msg-${Date.now()}`,
      role: MessageRole.MODEL,
      text: refinementMsg,
      timestamp: Date.now(),
    };
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, modelMsg],
    }));
  }, [updateSession]);

  // Handle filtered accept from pills
  const handlePillsFilteredAccept = useCallback((
    selectedThemes: string[],
    selectedTypes: ContentType[]
  ) => {
    // Filter notes based on selection
    const filteredNotes = session.notes.filter(note => {
      const themeMatch = selectedThemes.length === 0 || (note.theme && selectedThemes.includes(note.theme));
      const typeMatch = selectedTypes.length === 0 || (note.contentType && selectedTypes.includes(note.contentType));
      return themeMatch && typeMatch;
    });

    // Update session with filtered notes
    setSession(prev => ({
      ...prev,
      notes: filteredNotes,
      stage: 'structure',
      lastModified: Date.now(),
    }));

    setShowPillsForSource(null);

    // Send refinement message
    const refinementMsg = `I've filtered to ${filteredNotes.length} notes matching your selection. Would you like me to organize them into a presentation flow?`;
    const modelMsg = {
      id: `msg-${Date.now()}`,
      role: MessageRole.MODEL,
      text: refinementMsg,
      timestamp: Date.now(),
    };
    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, modelMsg],
    }));
  }, [session.notes]);

  // Handle cancelling pills (remove source and notes)
  const handlePillsCancel = useCallback(() => {
    if (pillsSource) {
      // Remove the source and its notes
      setSession(prev => ({
        ...prev,
        sources: prev.sources?.filter(s => s.id !== pillsSource.id),
        notes: prev.notes.filter(n => !n.proofLinks?.some(p => p.sourceId === pillsSource.id)),
        lastModified: Date.now(),
      }));
    }
    setShowPillsForSource(null);
  }, [pillsSource]);

  // Get title and placeholder based on preset
  const wizardTitle = preset === 'video'
    ? 'VideoDeck'
    : preset === 'web'
    ? 'Research & Present'
    : 'Sources';

  const urlPlaceholder = preset === 'video'
    ? 'Paste YouTube URL to analyze...'
    : preset === 'web'
    ? 'Paste article or web page URL...'
    : 'Paste YouTube or web page URL...';

  const UrlIcon = preset === 'video' ? Video : preset === 'web' ? Globe : Link;

  return (
    <div className="flex h-screen w-full bg-black relative">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-black border-b border-white/10 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/60 hover:text-[#c5a47e]" />
            </button>
          )}
          <div>
            <h1 className="font-bold text-white uppercase tracking-wide">
              {wizardTitle}
              {session.topic && `: ${session.topic}`}
            </h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">
              {session.sources?.length || 0} sources
              {' '}&bull;{' '}
              {session.notes.length} notes
              {' '}&bull;{' '}
              {recipe} deck
              {isSessionPersisted && (
                <>
                  {' '}&bull;{' '}
                  <span className={saveStatus === 'saving' ? 'text-yellow-400' : saveStatus === 'saved' ? 'text-green-400' : ''}>
                    {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Draft'}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session.stage === 'ready' && (
            <button
              onClick={handleBuildDeck}
              className="px-4 py-2 bg-[#c5a47e] text-black font-medium uppercase tracking-wider text-sm hover:bg-[#d4b58f] transition-colors"
            >
              Build Deck
            </button>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex w-full pt-14" style={{ height: 'calc(100vh - 0px)' }}>
        {/* AI-Centric Left Panel (400px) */}
        <div className="w-[400px] flex-shrink-0 h-full border-r border-white/10 flex flex-col">

          {/* URL Input - Prominent at Top */}
          <form onSubmit={handleUrlSubmit} className="p-4 border-b border-white/10">
            <div
              className={`relative ${dragOver ? 'ring-2 ring-[#c5a47e]' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const droppedUrl = e.dataTransfer.getData('text');
                if (droppedUrl) handleAddSource(droppedUrl);
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 focus-within:border-[#c5a47e] transition-colors">
                <UrlIcon className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={urlPlaceholder}
                  className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="p-1 text-white/40 hover:text-[#c5a47e] disabled:opacity-30 disabled:hover:text-white/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-white/30">
              {preset === 'video' ? 'Paste YouTube links to extract knowledge' : 'Add URLs to analyze and extract insights'}
            </p>
          </form>

          {/* Collapsible Sources List */}
          <CollapsibleSourcesList
            sources={session.sources || []}
            onRemoveSource={(sourceId) => {
              updateSession({
                sources: session.sources?.filter(s => s.id !== sourceId),
              });
            }}
          />

          {/* Topic Pills Panel - Shown after comprehensive extraction */}
          {pillsSource && (
            <TopicPillsPanel
              themes={pillsSource.detectedThemes || []}
              types={pillsSource.detectedTypes || []}
              noteCount={session.notes.filter(n =>
                n.proofLinks?.some(p => p.sourceId === pillsSource.id)
              ).length || session.notes.length}
              title={pillsSource.title || 'Source'}
              onAcceptAll={handlePillsAcceptAll}
              onFilteredAccept={handlePillsFilteredAccept}
              onCancel={handlePillsCancel}
            />
          )}

          {/* AI Chat - Takes Remaining Space */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {session.messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#c5a47e]/10 rounded-full flex items-center justify-center">
                    <UrlIcon className="w-6 h-6 text-[#c5a47e]" />
                  </div>
                  <p className="text-white/60 text-sm font-medium mb-1">
                    {preset === 'video' ? 'Add a YouTube video' : 'Add a source'}
                  </p>
                  <p className="text-white/30 text-xs max-w-[250px] mx-auto">
                    {preset === 'video'
                      ? "I'll analyze the video and extract key insights for your deck"
                      : "I'll analyze the content and help organize it into a presentation"
                    }
                  </p>
                </div>
              )}
              {session.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isThinking && (
                <div className="flex gap-3">
                  {/* AI Avatar */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#c5a47e] to-[#a08060] flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-black" />
                  </div>
                  {/* Thinking Indicator */}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#1a1816] border border-[#c5a47e]/20 rounded-xl">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[#c5a47e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#c5a47e] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-[#c5a47e] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-white/50 text-sm">Processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions / ask_user options */}
            {askUserQuestion && (
              <div className="p-3 border-t border-white/10 bg-white/5">
                <p className="text-sm text-white/80 mb-2">{askUserQuestion.question}</p>
                <div className="flex flex-wrap gap-2">
                  {askUserQuestion.options?.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(option)}
                      className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input - Fixed at Bottom */}
            <div className="p-3 border-t border-white/10">
              <input
                type="text"
                placeholder="Ask about sources or give instructions..."
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-[#c5a47e] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Canvas (center - takes remaining space) */}
        <div className="flex-1 h-full overflow-hidden">
          <FlowCanvas
            notes={session.notes}
            connections={session.connections}
            columns={columns}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onMoveNote={handleMoveNote}
            onAddNote={handleAddNote}
          />
        </div>

        {/* Proof Sidebar (right side - conditional) */}
        {showProofSidebar && selectedNote && (
          <div className="w-[300px] flex-shrink-0 h-full border-l border-white/10">
            <ProofSidebar
              note={selectedNote}
              sources={session.sources || []}
              onClose={() => setShowProofSidebar(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SourcesWizard;
