/**
 * Sources Agent Tool Executor
 *
 * Creates the tool executor for the sources agent.
 */

import { IdeationSession, IdeaNote } from '../../types/ideation';
import { SourcesToolName } from '../../lib/sourcesTools';
import { ToolExecutor } from '../copilotAgent';
import {
  handleAddSource,
  handleRemoveSource,
  handleExtractTranscript,
  handleExtractWebContent,
  handleIdentifyChapters,
  handleExtractConcept,
  handleExtractFramework,
  handleExtractClaim,
  handleExtractExample,
  handleSynthesis,
  handleAddLearningObjective,
  handleAddExercise,
  handleAddQuizQuestion,
  handleSuggestStructure,
  handleMarkReady,
} from './handlers';

/**
 * Create a tool executor for sources agent
 * Uses a getter function to always access the current session state,
 * avoiding stale closure issues between tool calls.
 */
export function createSourcesToolExecutor(
  getSession: () => IdeationSession,
  updateSession: (updates: Partial<IdeationSession>) => void,
  addNote: (note: IdeaNote) => void
): ToolExecutor {
  return async (toolName: string, args: Record<string, unknown>) => {
    // Get fresh session for each tool call
    const session = getSession();
    console.log(`[SourcesAgent] Executing tool: ${toolName}`, args);

    switch (toolName as SourcesToolName) {
      // === SOURCE MANAGEMENT ===
      case 'add_source':
        return handleAddSource(getSession, args, updateSession);

      case 'remove_source':
        return handleRemoveSource(getSession, args, updateSession);

      // === CONTENT EXTRACTION ===
      case 'extract_transcript':
        return handleExtractTranscript(getSession, args, updateSession);

      case 'extract_web_content':
        return handleExtractWebContent(getSession, args, updateSession, addNote, session.recipe);

      case 'identify_chapters':
        return handleIdentifyChapters(getSession, args, updateSession);

      // === KNOWLEDGE EXTRACTION ===
      case 'extract_concept':
        return handleExtractConcept(args, addNote, session.recipe);

      case 'extract_framework':
        return handleExtractFramework(args, addNote, session.recipe);

      case 'extract_claim':
        return handleExtractClaim(args, addNote, session.recipe);

      case 'extract_example':
        return handleExtractExample(args, addNote, session.recipe);

      // === SYNTHESIS ===
      case 'synthesize_across_sources':
        return handleSynthesis(getSession, args, updateSession);

      // === PEDAGOGY ===
      case 'add_learning_objective':
        return handleAddLearningObjective(args, addNote);

      case 'add_exercise':
        return handleAddExercise(args, addNote);

      case 'add_quiz_question':
        return handleAddQuizQuestion(args, addNote);

      // === STRUCTURE ===
      case 'suggest_structure':
        return handleSuggestStructure(session, args, updateSession);

      case 'mark_ready':
        return handleMarkReady(session, args, updateSession);

      // === USER INTERACTION ===
      case 'ask_user':
        // Handled specially in runAgentLoop
        return { type: 'ask_user', captured: true };

      default:
        console.warn(`[SourcesAgent] Unknown tool: ${toolName}`);
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  };
}
