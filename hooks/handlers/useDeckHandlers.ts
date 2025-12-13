/**
 * Deck Handlers Hook
 *
 * Handles deck CRUD operations and transformations.
 * Extracted from AppContent.tsx for better organization.
 */

import { useCallback } from 'react';
import { Slide, Message } from '../../types';
import { RoughDraftResult } from '../../services/agents';

// Type for deck plan from ideation
export interface DeckPlan {
  topic: string;
  slides: Array<{
    title: string;
    bulletPoints: string[];
    speakerNotes: string;
    imageVisualDescription: string;
    layoutType: string;
    alignment: string;
  }>;
  themeId: string;
  visualStyle: string;
}

export interface UseDeckHandlersOptions {
  // Presentation state
  currentPresentation: { id: string } | null;

  // Chat messages
  addMessage: (msg: Message) => void;
  createSystemMessage: (text: string) => Message;
  createModelMessage: (text: string) => Message;

  // Deck actions
  loadDeck: (id: string) => Promise<void>;
  createDeckFromPlan: (plan: DeckPlan) => Promise<Slide[]>;
  createPresentationFromSlides: (slides: Slide[], themeId: string) => Promise<unknown>;

  // Clone mutation
  duplicateMutation: {
    mutate: (
      id: string,
      options: { onSuccess: (clonedDeck: { id: string }) => void }
    ) => void;
  };

  // Workspace navigation
  goToDashboard: () => void;
  getRoughDraftState: () => { input?: { topic: string } } | null;
}

export interface UseDeckHandlersReturn {
  handleCloneDeck: (id: string) => void;
  handleCloneCurrentDeck: () => void;
  handleBuildDeckFromIdeation: (deckPlan: DeckPlan) => Promise<void>;
  handleApproveRoughDraft: (result: RoughDraftResult) => Promise<void>;
  handleBeautifyComplete: (slides: Slide[], themeId: string) => Promise<void>;
}

export function useDeckHandlers(options: UseDeckHandlersOptions): UseDeckHandlersReturn {
  const {
    currentPresentation,
    addMessage,
    createSystemMessage,
    createModelMessage,
    loadDeck,
    createDeckFromPlan,
    createPresentationFromSlides,
    duplicateMutation,
    goToDashboard,
    getRoughDraftState,
  } = options;

  const handleCloneDeck = useCallback(
    (id: string) => {
      duplicateMutation.mutate(id, {
        onSuccess: (clonedDeck) => {
          loadDeck(clonedDeck.id);
        },
      });
    },
    [duplicateMutation, loadDeck]
  );

  const handleCloneCurrentDeck = useCallback(() => {
    if (currentPresentation) {
      handleCloneDeck(currentPresentation.id);
    }
  }, [currentPresentation, handleCloneDeck]);

  const handleBuildDeckFromIdeation = useCallback(
    async (deckPlan: DeckPlan) => {
      goToDashboard();
      addMessage(createSystemMessage(`Building deck from ideation: "${deckPlan.topic}"...`));
      try {
        await createDeckFromPlan(deckPlan);
        addMessage(
          createModelMessage(
            `Deck created from ideation: ${deckPlan.slides.length} slides. Rendering visuals...`
          )
        );
      } catch (error) {
        console.error('Error building deck from ideation:', error);
        addMessage(createSystemMessage('Error building deck from ideation plan.'));
      }
    },
    [goToDashboard, addMessage, createSystemMessage, createModelMessage, createDeckFromPlan]
  );

  const handleApproveRoughDraft = useCallback(
    async (result: RoughDraftResult) => {
      const roughDraftState = getRoughDraftState();
      if (!roughDraftState) return;

      const deckPlan = {
        topic: result.topic,
        themeId: result.themeId,
        visualStyle: result.visualStyle,
        slides: result.slides.map((s) => ({
          title: s.title,
          bulletPoints: s.content,
          speakerNotes: s.speakerNotes,
          imageVisualDescription: s.imagePrompt,
          layoutType: s.layoutType,
          alignment: s.alignment,
          existingImageUrl: s.imageUrl,
        })),
      };

      try {
        await createDeckFromPlan(deckPlan);
        addMessage(
          createModelMessage(`Deck created from rough draft: ${result.slides.length} slides.`)
        );
      } catch (error) {
        console.error('Error creating deck from rough draft:', error);
        addMessage(createSystemMessage('Error creating deck from rough draft.'));
      }

      goToDashboard();
    },
    [getRoughDraftState, createDeckFromPlan, addMessage, createModelMessage, createSystemMessage, goToDashboard]
  );

  const handleBeautifyComplete = useCallback(
    async (slides: Slide[], themeId: string) => {
      try {
        await createPresentationFromSlides(slides, themeId);
        goToDashboard();
      } catch (error) {
        console.error('Failed to create presentation from beautified slides:', error);
      }
    },
    [createPresentationFromSlides, goToDashboard]
  );

  return {
    handleCloneDeck,
    handleCloneCurrentDeck,
    handleBuildDeckFromIdeation,
    handleApproveRoughDraft,
    handleBeautifyComplete,
  };
}
