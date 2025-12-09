/**
 * IdeationCopilot Component
 *
 * Main container for the ideation experience.
 * Combines the FlowCanvas and CopilotPanel with state management.
 */

import React, { useState, useCallback } from 'react';
import { MessageRole } from '../../types';
import { useIdeation } from '../../hooks/useIdeation';
import { runAgentLoop, convertSessionToDeckPlan, AgentResponse } from '../../services/copilotAgent';
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
    const approvedNotes = notes.filter(n => n.approved || n.type === 'user');
    const columnsWithNotes = new Set(notes.map(n => n.column)).size;

    // Advance from discover to expand after 2+ notes
    if (stage === 'discover' && approvedNotes.length >= 2) {
      ideation.setStage('expand');
    }
    // Advance from expand to structure after 5+ notes in 3+ columns
    else if (stage === 'expand' && approvedNotes.length >= 5 && columnsWithNotes >= 3) {
      ideation.setStage('structure');
    }
  }, [ideation]);

  // Handle building the deck
  const handleBuildDeck = useCallback(async () => {
    if (!ideation.session || !onBuildDeck) return;

    setIsThinking(true);
    try {
      const deckPlan = await convertSessionToDeckPlan(ideation.session);
      onBuildDeck(deckPlan);
    } catch (error) {
      console.error('Deck conversion error:', error);
      ideation.addMessage(
        MessageRole.MODEL,
        "I had trouble creating the deck plan. Let me try again - could you confirm which notes should be included?"
      );
    } finally {
      setIsThinking(false);
    }
  }, [ideation, onBuildDeck]);

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

  const handleApproveNote = useCallback((noteId: string) => {
    ideation.approveNote(noteId);
  }, [ideation]);

  const handleMoveNote = useCallback((noteId: string, column: number, row: number) => {
    ideation.moveNote(noteId, column, row);
  }, [ideation]);

  // If no session, show loading or start screen
  if (!ideation.session) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <p className="text-gray-600">Loading ideation session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 relative">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          )}
          <div>
            <h1 className="font-semibold text-gray-900">{ideation.session.topic}</h1>
            <p className="text-xs text-gray-500">
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
            onApproveNote={handleApproveNote}
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
            onSendMessage={handleSendMessage}
            onBuildDeck={handleBuildDeck} // Always available - user explicitly asks to build
          />
        </div>
      </div>
    </div>
  );
};

export default IdeationCopilot;
