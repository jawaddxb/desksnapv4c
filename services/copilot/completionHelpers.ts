/**
 * Copilot Completion Helpers
 *
 * Functions for detecting completion and generating summaries.
 */

import { IdeationSession, getColumnFillStatus } from '../../types/ideation';
import { ProcessedToolCall, CompletionQuestion } from './types';

/**
 * Generate a smart completion question when ideation is complete
 */
export function generateCompletionQuestion(
  session: IdeationSession,
  toolCalls: ProcessedToolCall[],
): CompletionQuestion {
  const columnStatus = getColumnFillStatus(session.notes);
  const totalNotes = session.notes.length;
  const researchCalls = toolCalls.filter(tc => tc.name === 'research').length;

  const sortedColumns = [...columnStatus].sort((a, b) => a.count - b.count);
  const weakestColumn = sortedColumns[0];

  const summary = `I've created ${totalNotes} notes across all sections based on ${researchCalls} research pass${researchCalls === 1 ? '' : 'es'}.`;

  const primaryActions = ["Build the deck", "Go to rough draft"];
  const secondaryOptions: string[] = [];

  if (weakestColumn && weakestColumn.count <= 1) {
    secondaryOptions.push(`Add more to ${weakestColumn.name}`);
  }

  secondaryOptions.push("Research a specific angle");
  secondaryOptions.push("Do extended research");

  return { question: summary, primaryActions, secondaryOptions };
}

/**
 * Generate a tool call summary for display
 */
export function summarizeToolCalls(toolCalls: ProcessedToolCall[]): string {
  const summaries = toolCalls
    .filter(tc => tc.name !== 'ask_user')
    .map(tc => {
      switch (tc.name) {
        case 'set_topic':
          return `Set topic to: "${tc.args.topic}"`;
        case 'create_note':
          return `Created note: "${(tc.args.content as string).slice(0, 40)}..."`;
        case 'research':
          return `Researched: ${tc.args.query}`;
        case 'update_note':
          return `Updated note`;
        case 'delete_note':
          return `Deleted note`;
        case 'connect_notes':
          return `Connected notes`;
        case 'move_note':
          return `Moved note`;
        case 'suggest_structure':
          return `Suggested structure`;
        case 'mark_ready':
          return `Marked deck as ready`;
        default:
          return `Performed ${tc.name}`;
      }
    });

  return summaries.length > 0 ? `Here's what I did:\n\n${summaries.join('\n')}` : '';
}

/**
 * Check if the canvas is complete and should show completion UI
 */
export function checkCanvasCompletion(
  session: IdeationSession,
  toolCalls: ProcessedToolCall[]
): { isComplete: boolean; shouldShowCompletion: boolean } {
  const markedReady = toolCalls.some(tc => tc.name === 'mark_ready');
  const extractionTools = [
    'extract_transcript', 'extract_web_content',
    'extract_concept', 'extract_claim', 'extract_example', 'extract_framework',
    'identify_chapters', 'add_learning_objective', 'add_exercise', 'add_quiz_question'
  ];
  const extractionHappened = toolCalls.some(tc => extractionTools.includes(tc.name));

  const notesCreated = toolCalls.filter(tc => tc.name === 'create_note').length;
  const totalNotes = session.notes.length + notesCreated;
  const columnStatus = getColumnFillStatus(session.notes);
  const filledColumns = columnStatus.filter(c => c.count >= 1).length;
  const allColumnsFilled = filledColumns === 5;
  const minimumFilled = filledColumns >= 4;

  const isAutonomouslyComplete = markedReady || allColumnsFilled || (minimumFilled && totalNotes >= 10);
  const shouldShowCompletion = !extractionHappened && isAutonomouslyComplete;

  return { isComplete: isAutonomouslyComplete, shouldShowCompletion };
}
