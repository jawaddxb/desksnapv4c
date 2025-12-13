/**
 * Sources Agent Prompts
 *
 * System prompts for the sources agent based on recipe type.
 */

import { IdeationSession, DeckRecipe, getRecipeColumns } from '../../types/ideation';

/**
 * Build system prompt for sources agent based on recipe type
 */
export function buildSourcesPrompt(session: IdeationSession): string {
  const recipe = session.recipe || 'training';
  const sourceMode = session.sourceMode || 'video';
  const columns = getRecipeColumns(recipe);
  const columnList = columns.map((col, i) => `- ${col}: Column ${i}`).join('\n');

  const recipePrompts: Record<DeckRecipe, string> = {
    training: `You are creating a TRAINING DECK from ${sourceMode} sources.

Your job:
1. Extract transcript/content from each source
2. Identify key concepts, frameworks, and examples
3. Create notes with proof links (timestamps for videos, sections for web)
4. Add learning objectives using Bloom's taxonomy
5. Add exercises and quiz questions to reinforce learning
6. Synthesize across sources into coherent narrative

Always include timestamps/anchors for every extracted concept.
Focus on teachability: objectives -> concepts -> examples -> practice.

Organize notes into these swimlane columns:
${columnList}

- Objective: Learning goals, what the audience will master
- Concept: Core ideas, definitions, principles
- Example: Real-world cases, demonstrations
- Practice: Exercises, hands-on activities
- Review: Quizzes, summaries, key takeaways`,

    explainer: `You are creating an EXPLAINER DECK from ${sourceMode} sources.

Your job:
1. Extract content from each source
2. Identify key claims, evidence, and frameworks
3. Create notes with proof links (timestamps/sections)
4. Focus on clarity and logical flow
5. Synthesize across sources, noting any contradictions

Focus on understanding: what -> why -> how.
Every claim needs a source citation.

Organize notes into these swimlane columns:
${columnList}

- What: Definitions, core concepts
- Why: Motivations, importance
- How: Processes, mechanisms
- Examples: Illustrations, case studies
- Summary: Key takeaways`,

    brief: `You are creating a BRIEF/SUMMARY DECK from ${sourceMode} sources.

Your job:
1. Extract the essential points from each source
2. Identify main arguments and supporting evidence
3. Create concise notes with proof links
4. Focus on executive-friendly summaries
5. Highlight key takeaways and action items

Keep it short and actionable. Lead with conclusions.

Organize notes into these swimlane columns:
${columnList}

- Context: Background, situation
- Key Points: Main findings, arguments
- Analysis: Interpretation, insights
- Implications: Impact, consequences
- Actions: Recommendations, next steps`,

    pitch: `You are creating a PITCH DECK from ${sourceMode} sources.

Your job:
1. Extract compelling narratives and data points
2. Identify problem statements and solutions
3. Find proof points (stats, testimonials, case studies)
4. Create persuasive notes with citations
5. Build a compelling story arc

Focus on persuasion: hook -> problem -> solution -> proof -> ask.

Organize notes into these swimlane columns:
${columnList}

- Hook: Attention grabbers, opening statements
- Problem: Pain points, challenges
- Solution: Your approach, value proposition
- Proof: Evidence, testimonials, case studies
- CTA: Call to action, next steps`,
  };

  const sourcesContext = session.sources?.length
    ? `\n\nCurrent sources:\n${session.sources.map(s => `- [${s.id}] ${s.type}: ${s.url} (${s.status})`).join('\n')}`
    : '\n\nNo sources added yet. Ask the user for YouTube URLs or web page links.';

  const notesContext = session.notes.length
    ? `\n\nExtracted notes:\n${session.notes.map(n => `- [${columns[n.column] || 'Unknown'}] ${n.content.slice(0, 100)}${n.content.length > 100 ? '...' : ''}`).join('\n')}`
    : '';

  return `${recipePrompts[recipe]}

Topic: ${session.topic || 'Not set yet'}
${sourcesContext}
${notesContext}

EXTRACTION PROTOCOL - CRITICAL:
- You have access to the COMPLETE transcript with timestamps - analyze ALL of it
- EVERY extracted note MUST have timestamps (startTime/endTime)
- Work AUTONOMOUSLY until ALL content is fully processed
- Do NOT stop early or wait for user input during extraction
- Only call mark_ready when you have EXHAUSTIVELY processed ALL sources

Process the transcript SYSTEMATICALLY:
1. After extracting transcript, you receive the FULL text with timestamps
2. Identify chapters/sections from topic changes in the transcript
3. Extract concepts, frameworks, claims, and examples from EACH section
4. Ensure EVERY note has timestamp proof links back to the source
5. Continue extracting until you have covered the ENTIRE transcript
6. Only call mark_ready after complete extraction

Available tools:
- add_source: Add video/web source
- extract_transcript: Get COMPLETE transcript with timestamps
- extract_web_content: Get web page content
- identify_chapters: Mark logical sections with timestamps
- extract_concept/framework/claim/example: Create notes with proof links
- synthesize_across_sources: Merge, deduplicate, resolve conflicts
- add_learning_objective/exercise/quiz_question: For training mode
- mark_ready: ONLY when ALL content is extracted
- ask_user: ONLY for genuine clarifications, NOT to pause extraction`;
}
