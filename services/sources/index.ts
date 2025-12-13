/**
 * Sources Agent Service
 *
 * Runs the agentic loop for source extraction and knowledge synthesis.
 * Uses the same runAgentLoop pattern as copilotAgent, but with SOURCES_TOOLS.
 *
 * This agent handles:
 * - Video/web source ingestion
 * - Transcript/content extraction
 * - Knowledge extraction (concepts, frameworks, claims, examples)
 * - Cross-source synthesis
 * - Pedagogy elements (learning objectives, exercises, quizzes)
 */

import { IdeationSession, IdeaNote } from '../../types/ideation';
import { SOURCES_TOOLS } from '../../lib/sourcesTools';
import { runAgentLoop, AgentResponse } from '../copilotAgent';
import { buildSourcesPrompt } from './prompts';
import { createSourcesToolExecutor } from './toolExecutor';

// Re-export types for consumers
export type { ComprehensiveExtractionResult, CategorizedNote } from './types';

// Re-export utilities that may be needed externally
export { buildSourcesPrompt } from './prompts';
export { createSourcesToolExecutor } from './toolExecutor';
export { formatTime, extractVideoId, getColumnIndex } from './utils';
export { extractYouTubeTranscript, extractWebPageContent } from './extraction';
export { categorizeContentWithAI, extractUniqueThemes, extractUniqueTypes } from './categorization';

/**
 * Run the sources agent loop
 *
 * Same pattern as copilot, but with SOURCES_TOOLS and sources-specific prompt
 */
export async function runSourcesAgentLoop(
  userMessage: string,
  getSession: () => IdeationSession,
  updateSession: (updates: Partial<IdeationSession>) => void,
  addNote: (note: IdeaNote) => void
): Promise<AgentResponse> {
  const toolExecutor = createSourcesToolExecutor(getSession, updateSession, addNote);

  // Get current session for initial prompt building
  const session = getSession();

  return runAgentLoop(userMessage, session, toolExecutor, {
    tools: SOURCES_TOOLS,
    systemPromptBuilder: buildSourcesPrompt,
    maxIterations: 25, // Higher limit for exhaustive video/source analysis
  });
}
