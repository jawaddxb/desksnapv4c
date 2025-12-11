/**
 * IdeationCopilot Component
 *
 * Main container for the ideation experience.
 * Combines the FlowCanvas and CopilotPanel with state management.
 */

import React, { useState, useCallback } from 'react';
import { MessageRole } from '../../types';
import { COLUMNS, ThemeSuggestion } from '../../types/ideation';
import { useIdeation } from '../../hooks/useIdeation';
import { runAgentLoop, convertSessionToDeckPlan, suggestThemeForSession, convertSessionToDeckPlanWithTheme, AgentResponse } from '../../services/copilotAgent';
import { FlowCanvas } from './FlowCanvas';
import { CopilotPanel } from './CopilotPanel';

interface IdeationCopilotProps {
  initialTopic?: string;
  sessionId?: string;
  onClose?: () => void;
  onBuildDeck?: (deckPlan: any) => void;
}

export const IdeationCopilot: React.FC<IdeationCopilotProps> = ({
  initialTopic,
  sessionId,
  onClose,
  onBuildDeck,
}) => {
  const ideation = useIdeation();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [askUserQuestion, setAskUserQuestion] = useState<AgentResponse['askUserQuestion'] | null>(null);
  // Theme selection state for style-preview stage
  const [themeSuggestion, setThemeSuggestion] = useState<ThemeSuggestion | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('executive');

  // Initialize session on mount
  React.useEffect(() => {
    if (sessionId) {
      ideation.loadSession(sessionId);
    } else if (initialTopic) {
      ideation.startSession(initialTopic);
    } else {
      // Start fresh session when opening ideation mode without props
      ideation.startSession('New Presentation');
    }
  }, [sessionId, initialTopic]);

  // Handle sending a message to the copilot
  const handleSendMessage = useCallback(async (message: string) => {
    if (!ideation.session) return;

    // Add user message
    ideation.addMessage(MessageRole.USER, message);
    setIsThinking(true);
    setAskUserQuestion(null);

    try {
      // Run the agentic loop
      const response = await runAgentLoop(
        message,
        ideation.session,
        ideation.executeToolCall
      );

      // Add the copilot's response
      if (response.text) {
        ideation.addMessage(MessageRole.MODEL, response.text);
      }

      // Handle ask_user question
      if (response.askUserQuestion) {
        setAskUserQuestion(response.askUserQuestion);
      }

      // Auto-advance stage based on progress
      autoAdvanceStage();
    } catch (error) {
      console.error('Copilot error:', error);
      ideation.addMessage(
        MessageRole.MODEL,
        "I ran into an issue. Could you try rephrasing that?"
      );
    } finally {
      setIsThinking(false);
    }
  }, [ideation]);

  // Auto-advance stage based on note count and content
  const autoAdvanceStage = useCallback(() => {
    if (!ideation.session) return;

    const { notes, stage } = ideation.session;
    const columnsWithNotes = new Set(notes.map(n => n.column)).size;

    // Advance from discover to expand after 2+ notes
    if (stage === 'discover' && notes.length >= 2) {
      ideation.setStage('expand');
    }
    // Advance from expand to structure after 5+ notes in 3+ columns
    else if (stage === 'expand' && notes.length >= 5 && columnsWithNotes >= 3) {
      ideation.setStage('structure');
    }
  }, [ideation]);

  // Handle request to build deck - shows review stage first
  const handleBuildDeck = useCallback(() => {
    if (!ideation.session) return;

    // Prevent duplicate review messages (can happen with React Strict Mode or re-renders)
    const messages = ideation.session.messages;
    const reviewPrefix = `Here's your presentation plan`;
    const alreadyHasReviewMessage = messages.some(m =>
      m.role === MessageRole.MODEL && m.text.startsWith(reviewPrefix)
    );

    if (alreadyHasReviewMessage) {
      // Just ensure we're in review stage, don't add duplicate message
      if (ideation.stage !== 'review') {
        ideation.setStage('review');
      }
      return;
    }

    // Go to review stage
    ideation.setStage('review');

    // Show summary message
    const noteCount = ideation.session.notes.length;
    const columnNames = [...new Set(ideation.session.notes.map(n => COLUMNS[n.column]))];

    ideation.addMessage(
      MessageRole.MODEL,
      `Here's your presentation plan for "${ideation.session.topic}":\n\n` +
      `${noteCount} ideas across: ${columnNames.join(', ')}\n\n` +
      `Review the canvas on the left, make any edits you'd like, then click "Confirm & Build" when you're ready!`
    );
  }, [ideation]);

  // Handle confirming the build - now triggers theme suggestion first
  const handleConfirmBuild = useCallback(async () => {
    if (!ideation.session) return;

    setIsThinking(true);
    try {
      // STEP 1: Get AI theme suggestion
      const suggestion = await suggestThemeForSession(ideation.session);
      setThemeSuggestion(suggestion);
      setSelectedThemeId(suggestion.themeId);

      // Move to style-preview stage
      ideation.setStage('style-preview');

      ideation.addMessage(
        MessageRole.MODEL,
        `I recommend the "${suggestion.themeId}" theme: ${suggestion.reasoning}`
      );
    } catch (error) {
      console.error('Theme suggestion error:', error);
      ideation.addMessage(
        MessageRole.MODEL,
        "I couldn't analyze the best theme. Please select one manually."
      );
      // Fallback: still go to style-preview with default
      setThemeSuggestion({
        themeId: 'executive',
        reasoning: 'A professional, versatile theme.',
        visualStyleHint: 'Clean corporate photography',
        alternativeIds: ['startup', 'minimalist'],
      });
      setSelectedThemeId('executive');
      ideation.setStage('style-preview');
    } finally {
      setIsThinking(false);
    }
  }, [ideation]);

  // Handle final build after theme confirmation
  const handleConfirmThemeAndBuild = useCallback(async () => {
    if (!ideation.session || !onBuildDeck || !selectedThemeId) return;

    setIsThinking(true);
    try {
      // STEP 2: Convert to deck plan with confirmed theme
      const deckPlan = await convertSessionToDeckPlanWithTheme(
        ideation.session,
        selectedThemeId
      );
      onBuildDeck(deckPlan);
    } catch (error) {
      console.error('Deck conversion error:', error);
      ideation.addMessage(
        MessageRole.MODEL,
        "I had trouble creating the deck. Please try again."
      );
    } finally {
      setIsThinking(false);
    }
  }, [ideation, onBuildDeck, selectedThemeId]);

  // Handle going back from style-preview to review
  const handleBackFromStylePreview = useCallback(() => {
    ideation.setStage('review');
    setThemeSuggestion(null);
  }, [ideation]);

  // Handle theme selection change
  const handleSelectTheme = useCallback((themeId: string) => {
    setSelectedThemeId(themeId);
  }, []);

  // Handle note operations
  const handleAddNote = useCallback((column: number) => {
    const noteId = ideation.addNote('New idea...', column, { type: 'user' });
    setSelectedNoteId(noteId);
  }, [ideation]);

  const handleUpdateNote = useCallback((noteId: string, updates: any) => {
    ideation.updateNote(noteId, updates);
  }, [ideation]);

  const handleDeleteNote = useCallback((noteId: string) => {
    ideation.deleteNote(noteId);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  }, [ideation, selectedNoteId]);

  const handleMoveNote = useCallback((noteId: string, column: number, row: number) => {
    ideation.moveNote(noteId, column, row);
  }, [ideation]);

  // If no session, show loading or start screen
  if (!ideation.session) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border border-[#c5a47e] flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <p className="text-white/60 uppercase tracking-widest text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

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
              <svg className="w-5 h-5 text-white/60 hover:text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          )}
          <div>
            <h1 className="font-bold text-white uppercase tracking-wide">{ideation.session.topic}</h1>
            <p className="text-xs text-white/40 uppercase tracking-widest">
              {ideation.notes.length} notes • {ideation.saveStatus === 'saving' ? 'Saving...' : ideation.saveStatus === 'saved' ? 'Saved' : 'Draft'}
            </p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 pt-14">
        {/* Canvas (left side - 60%) */}
        <div className="flex-[3] h-full overflow-hidden">
          <FlowCanvas
            notes={ideation.notes}
            connections={ideation.session.connections}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onMoveNote={handleMoveNote}
            onAddNote={handleAddNote}
          />
        </div>

        {/* Chat panel (right side - 40%) */}
        <div className="flex-[2] h-full min-w-[360px] max-w-[480px]">
          <CopilotPanel
            messages={ideation.messages}
            stage={ideation.stage}
            isThinking={isThinking}
            askUserQuestion={askUserQuestion}
            themeSuggestion={themeSuggestion}
            selectedThemeId={selectedThemeId}
            onSelectTheme={handleSelectTheme}
            onSendMessage={handleSendMessage}
            onBuildDeck={handleBuildDeck}
            onConfirmBuild={handleConfirmBuild}
            onConfirmThemeAndBuild={handleConfirmThemeAndBuild}
            onBackFromStylePreview={handleBackFromStylePreview}
          />
        </div>
      </div>
    </div>
  );
};

export default IdeationCopilot;
