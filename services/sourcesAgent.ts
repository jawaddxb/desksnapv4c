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

import { GoogleGenAI } from '@google/genai';
import { scrapeUrl, parseMarkdownToSections, isFirecrawlAvailable, extractComprehensiveContent, ComprehensiveContent } from './firecrawlService';
import {
  IdeationSession,
  Source,
  IdeaNote,
  ProofLink,
  TranscriptSegment,
  Chapter,
  DeckRecipe,
  ContentType,
  createSource,
  createKnowledgeNote,
  COLUMNS,
  RECIPE_COLUMNS,
  getRecipeColumns,
} from '../types/ideation';
import { SOURCES_TOOLS, SourcesToolName } from '../lib/sourcesTools';
import {
  runAgentLoop,
  AgentResponse,
  ToolExecutor,
  ProcessedToolCall,
} from './copilotAgent';

// ============================================
// SYSTEM PROMPTS
// ============================================

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

// ============================================
// TOOL HANDLERS
// ============================================

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

// ============================================
// TOOL HANDLER IMPLEMENTATIONS
// ============================================

async function handleAddSource(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const session = getSession();
  const url = args.url as string;
  const type = args.type as 'video' | 'web';

  const source = createSource(url, type);
  const sources = [...(session.sources || []), source];

  updateSession({ sources });

  return {
    success: true,
    sourceId: source.id,
    message: `Added ${type} source: ${url}`,
  };
}

async function handleRemoveSource(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const session = getSession();
  const sourceId = args.sourceId as string;
  const sources = (session.sources || []).filter(s => s.id !== sourceId);

  updateSession({ sources });

  return {
    success: true,
    message: `Removed source: ${sourceId}`,
  };
}

async function handleExtractTranscript(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  // Get fresh session to find the source
  const session = getSession();
  const sourceId = args.sourceId as string;
  const source = session.sources?.find(s => s.id === sourceId);

  if (!source) {
    return { success: false, error: 'Source not found' };
  }

  if (source.type !== 'video') {
    return { success: false, error: 'Source is not a video' };
  }

  try {
    // Update source status - get fresh session
    const currentSession = getSession();
    const sources = currentSession.sources?.map(s =>
      s.id === sourceId ? { ...s, status: 'ingesting' as const } : s
    );
    updateSession({ sources });

    // Extract transcript from YouTube URL
    const transcript = await extractYouTubeTranscript(source.url);

    // Update source with transcript - get fresh session again
    const latestSession = getSession();
    const updatedSources = latestSession.sources?.map(s =>
      s.id === sourceId
        ? { ...s, status: 'ingested' as const, transcript }
        : s
    );
    updateSession({ sources: updatedSources });

    // Build full transcript text with timestamps for AI analysis
    const fullTranscript = transcript.map(t =>
      `[${formatTime(t.startTime)}] ${t.text}`
    ).join('\n');

    return {
      success: true,
      sourceId,
      segmentCount: transcript.length,
      totalDuration: transcript.length > 0 ? transcript[transcript.length - 1].endTime : 0,
      // Include FULL transcript for AI to analyze - this is the key change
      fullTranscript,
      message: `Extracted complete transcript: ${transcript.length} segments, ${formatTime(transcript[transcript.length - 1]?.endTime || 0)} total duration. The full transcript is now available for analysis. Process ALL content systematically.`,
    };
  } catch (error) {
    // Update source with error - get fresh session
    const errorSession = getSession();
    const sources = errorSession.sources?.map(s =>
      s.id === sourceId
        ? { ...s, status: 'error' as const, errorMessage: String(error) }
        : s
    );
    updateSession({ sources });

    return { success: false, error: String(error) };
  }
}

async function handleExtractWebContent(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void,
  addNote: (note: IdeaNote) => void,
  recipe?: DeckRecipe
): Promise<unknown> {
  const session = getSession();
  const sourceId = args.sourceId as string;
  const source = session.sources?.find(s => s.id === sourceId);

  if (!source) {
    return { success: false, error: 'Source not found' };
  }

  if (source.type !== 'web') {
    return { success: false, error: 'Source is not a web page' };
  }

  try {
    // Update source status to ingesting
    const currentSession = getSession();
    const sources = currentSession.sources?.map(s =>
      s.id === sourceId ? { ...s, status: 'ingesting' as const } : s
    );
    updateSession({ sources });

    // Step 1: Extract EVERYTHING from the URL using comprehensive extraction
    console.log('[handleExtractWebContent] Step 1: Extracting comprehensive content...');
    const comprehensiveContent = await extractComprehensiveContent(source.url);
    console.log(`[handleExtractWebContent] Extracted ${comprehensiveContent.wordCount} words from ${comprehensiveContent.title}`);

    // Step 2: Use AI to categorize ALL content into structured notes
    console.log('[handleExtractWebContent] Step 2: Categorizing content with AI...');
    const categorizedNotes = await categorizeContentWithAI(comprehensiveContent, recipe);
    console.log(`[handleExtractWebContent] Categorized into ${categorizedNotes.length} notes`);

    // Step 3: Create notes for EVERY piece of content
    console.log('[handleExtractWebContent] Step 3: Creating notes...');
    const columns = getRecipeColumns(recipe);
    for (const catNote of categorizedNotes) {
      const columnIndex = columns.findIndex(c =>
        c.toLowerCase() === catNote.column.toLowerCase()
      );
      const note = createKnowledgeNote(
        catNote.content,
        columnIndex >= 0 ? columnIndex : 2, // Default to middle column
        'concept', // Default knowledge type
        [{
          sourceId,
          excerpt: catNote.excerpt,
          confidence: 0.9,
        }],
        {
          theme: catNote.theme,
          contentType: catNote.type,
        }
      );
      addNote(note);
    }

    // Step 4: Extract unique themes and types for pills UI
    const detectedThemes = extractUniqueThemes(categorizedNotes);
    const detectedTypes = extractUniqueTypes(categorizedNotes);

    // Step 5: Update source with comprehensive data
    const latestSession = getSession();
    const updatedSources = latestSession.sources?.map(s =>
      s.id === sourceId
        ? {
            ...s,
            status: 'ingested' as const,
            title: comprehensiveContent.title,
            fullMarkdown: comprehensiveContent.fullMarkdown,
            detectedThemes,
            detectedTypes,
            transcript: comprehensiveContent.sections.map((section, i) => ({
              text: `## ${section.heading}\n${section.content}`,
              startTime: i,
              endTime: i + 1,
            })),
            metadata: {
              ...s.metadata,
              author: comprehensiveContent.author,
              title: comprehensiveContent.title,
              description: comprehensiveContent.description,
            },
          }
        : s
    );
    updateSession({ sources: updatedSources });

    // Return result with data for pills UI
    const result: ComprehensiveExtractionResult = {
      success: true,
      noteCount: categorizedNotes.length,
      themes: detectedThemes,
      types: detectedTypes,
      readyForPills: true,
      title: comprehensiveContent.title,
      wordCount: comprehensiveContent.wordCount,
    };

    console.log('[handleExtractWebContent] Comprehensive extraction complete:', result);
    return result;

  } catch (error) {
    console.error('[handleExtractWebContent] Error:', error);
    const errorSession = getSession();
    const sources = errorSession.sources?.map(s =>
      s.id === sourceId
        ? { ...s, status: 'error' as const, errorMessage: String(error) }
        : s
    );
    updateSession({ sources });

    return { success: false, error: String(error) };
  }
}

async function handleIdentifyChapters(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const session = getSession();
  const sourceId = args.sourceId as string;
  const chapters = args.chapters as Array<{
    title: string;
    startTime: number;
    endTime: number;
    summary?: string;
  }>;

  const source = session.sources?.find(s => s.id === sourceId);
  if (!source) {
    return { success: false, error: 'Source not found' };
  }

  // Convert to Chapter format
  const formattedChapters: Chapter[] = chapters.map((ch, i) => ({
    id: `chapter-${Date.now()}-${i}`,
    title: ch.title,
    startTime: ch.startTime,
    endTime: ch.endTime,
    summary: ch.summary,
  }));

  // Update source with chapters - get fresh session
  const currentSession = getSession();
  const sources = currentSession.sources?.map(s =>
    s.id === sourceId ? { ...s, chapters: formattedChapters } : s
  );
  updateSession({ sources });

  return {
    success: true,
    sourceId,
    chapterCount: formattedChapters.length,
    chapters: formattedChapters.map(ch => ch.title),
  };
}

/**
 * Get column index for a given column name, supporting all recipe types.
 * Falls back to middle column (index 2) if column not found.
 */
function getColumnIndex(column: string, recipe?: DeckRecipe): number {
  const columns = getRecipeColumns(recipe);

  // First try exact match (case-insensitive)
  const normalizedColumn = column.toLowerCase();
  const exactIndex = columns.findIndex(c => c.toLowerCase() === normalizedColumn);
  if (exactIndex >= 0) return exactIndex;

  // Legacy mapping for pitch columns (backward compatibility)
  const legacyMap: Record<string, number> = {
    hook: 0,
    problem: 1,
    solution: 2,
    proof: 3,
    cta: 4,
  };

  // Cross-recipe semantic mapping
  const semanticMap: Record<string, string[]> = {
    // Training columns (Objective, Concept, Example, Practice, Review)
    objective: ['hook', 'context', 'what'],
    concept: ['problem', 'key points', 'why'],
    example: ['solution', 'analysis', 'how', 'examples'],
    practice: ['proof', 'implications'],
    review: ['cta', 'actions', 'summary'],

    // Explainer columns (What, Why, How, Examples, Summary)
    what: ['objective', 'hook', 'context'],
    why: ['concept', 'problem', 'key points'],
    how: ['example', 'solution', 'analysis'],
    examples: ['practice', 'proof', 'implications'],
    summary: ['review', 'cta', 'actions'],

    // Brief columns (Context, Key Points, Analysis, Implications, Actions)
    context: ['objective', 'hook', 'what'],
    'key points': ['concept', 'problem', 'why'],
    analysis: ['example', 'solution', 'how'],
    implications: ['practice', 'proof', 'examples'],
    actions: ['review', 'cta', 'summary'],
  };

  // Try semantic mapping
  for (const [targetCol, equivalents] of Object.entries(semanticMap)) {
    if (equivalents.includes(normalizedColumn)) {
      const mappedIndex = columns.findIndex(c => c.toLowerCase() === targetCol);
      if (mappedIndex >= 0) return mappedIndex;
    }
  }

  // Final fallback: use legacy map or default to middle
  return legacyMap[normalizedColumn] ?? 2;
}

async function handleExtractConcept(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void,
  recipe?: DeckRecipe
): Promise<unknown> {
  const proofLink: ProofLink = {
    sourceId: args.sourceId as string,
    startTime: args.startTime as number | undefined,
    endTime: args.endTime as number | undefined,
    excerpt: args.excerpt as string | undefined,
    confidence: 0.9,
  };

  const note = createKnowledgeNote(
    `**${args.name}**: ${args.definition}`,
    getColumnIndex(args.column as string, recipe),
    'concept',
    [proofLink]
  );

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'concept',
    message: `Extracted concept: ${args.name}`,
  };
}

async function handleExtractFramework(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void,
  recipe?: DeckRecipe
): Promise<unknown> {
  const components = args.components as string[];
  const content = `**${args.name}**\n${components.map((c, i) => `${i + 1}. ${c}`).join('\n')}${args.description ? `\n\n${args.description}` : ''}`;

  const proofLink: ProofLink = {
    sourceId: args.sourceId as string,
    startTime: args.startTime as number | undefined,
    endTime: args.endTime as number | undefined,
    confidence: 0.9,
  };

  const note = createKnowledgeNote(
    content,
    getColumnIndex(args.column as string, recipe),
    'framework',
    [proofLink]
  );

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'framework',
    message: `Extracted framework: ${args.name} with ${components.length} components`,
  };
}

async function handleExtractClaim(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void,
  recipe?: DeckRecipe
): Promise<unknown> {
  const content = args.evidence
    ? `${args.statement}\n\n_Evidence: ${args.evidence}_`
    : args.statement as string;

  const proofLink: ProofLink = {
    sourceId: args.sourceId as string,
    startTime: args.startTime as number | undefined,
    endTime: args.endTime as number | undefined,
    excerpt: args.excerpt as string | undefined,
    confidence: 0.85,
  };

  const note = createKnowledgeNote(
    content,
    getColumnIndex(args.column as string, recipe),
    'claim',
    [proofLink]
  );

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'claim',
  };
}

async function handleExtractExample(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void,
  recipe?: DeckRecipe
): Promise<unknown> {
  const content = `**Example: ${args.title}**\n${args.description}`;

  const proofLink: ProofLink = {
    sourceId: args.sourceId as string,
    startTime: args.startTime as number | undefined,
    endTime: args.endTime as number | undefined,
    confidence: 0.9,
  };

  const note = createKnowledgeNote(
    content,
    getColumnIndex(args.column as string, recipe),
    'example',
    [proofLink]
  );

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'example',
    message: `Extracted example: ${args.title}`,
  };
}

async function handleSynthesis(
  getSession: () => IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const session = getSession();
  const action = args.action as string;
  const noteIds = args.noteIds as string[];

  switch (action) {
    case 'merge': {
      // Find notes to merge
      const notesToMerge = session.notes.filter(n => noteIds.includes(n.id));
      if (notesToMerge.length < 2) {
        return { success: false, error: 'Need at least 2 notes to merge' };
      }

      // Create merged note with combined proof links
      const mergedContent = args.newContent as string ||
        notesToMerge.map(n => n.content).join('\n\n');
      const mergedProofLinks = notesToMerge.flatMap(n => n.proofLinks || []);

      const mergedNote = createKnowledgeNote(
        mergedContent,
        notesToMerge[0].column,
        notesToMerge[0].knowledgeType || 'concept',
        mergedProofLinks
      );

      // Remove old notes, add merged - get fresh session
      const currentSession = getSession();
      const newNotes = currentSession.notes.filter(n => !noteIds.includes(n.id));
      newNotes.push(mergedNote);
      updateSession({ notes: newNotes });

      return {
        success: true,
        action: 'merge',
        mergedNoteId: mergedNote.id,
        removedCount: notesToMerge.length,
      };
    }

    case 'resolve_conflict': {
      const resolution = args.resolution as string;
      return {
        success: true,
        action: 'resolve_conflict',
        resolution,
        message: 'Conflict noted - use extract tools to create resolved note',
      };
    }

    case 'identify_gaps': {
      const columns = getRecipeColumns(session.recipe);
      return {
        success: true,
        action: 'identify_gaps',
        noteCount: session.notes.length,
        columnDistribution: columns.map((col, i) => ({
          column: col,
          count: session.notes.filter(n => n.column === i).length,
        })),
      };
    }

    case 'reorder': {
      // Reorder notes based on noteIds order - get fresh session
      const currentSession = getSession();
      const reorderedNotes = noteIds
        .map(id => currentSession.notes.find(n => n.id === id))
        .filter((n): n is IdeaNote => n !== undefined);

      // Add any notes not in the reorder list
      const remainingNotes = currentSession.notes.filter(n => !noteIds.includes(n.id));

      updateSession({ notes: [...reorderedNotes, ...remainingNotes] });

      return {
        success: true,
        action: 'reorder',
        newOrder: reorderedNotes.map(n => n.id),
      };
    }

    default:
      return { success: false, error: `Unknown synthesis action: ${action}` };
  }
}

async function handleAddLearningObjective(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void
): Promise<unknown> {
  const objective = args.objective as string;
  const bloomLevel = args.bloomLevel as string;

  const content = `**Learning Objective** (${bloomLevel})\n${objective}`;

  const note = createKnowledgeNote(content, 0, 'idea', []); // Hook column
  note.color = 'purple'; // Mark learning objectives distinctly

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'learning_objective',
    bloomLevel,
  };
}

async function handleAddExercise(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void
): Promise<unknown> {
  const exerciseType = args.exerciseType as string;
  const prompt = args.prompt as string;
  const expectedOutcome = args.expectedOutcome as string | undefined;

  let content = `**${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} Exercise**\n${prompt}`;
  if (expectedOutcome) {
    content += `\n\n_Expected outcome: ${expectedOutcome}_`;
  }

  const note = createKnowledgeNote(content, 4, 'exercise', []); // CTA column
  note.color = 'pink';

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'exercise',
    exerciseType,
  };
}

async function handleAddQuizQuestion(
  args: Record<string, unknown>,
  addNote: (note: IdeaNote) => void
): Promise<unknown> {
  const question = args.question as string;
  const options = args.options as string[];
  const correctIndex = args.correctIndex as number;
  const explanation = args.explanation as string | undefined;

  let content = `**Quiz**\n${question}\n\n`;
  content += options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n');
  content += `\n\n_Correct: ${String.fromCharCode(65 + correctIndex)}_`;
  if (explanation) {
    content += `\n_${explanation}_`;
  }

  const note = createKnowledgeNote(content, 4, 'quiz', []); // CTA column
  note.color = 'pink';

  addNote(note);

  return {
    success: true,
    noteId: note.id,
    type: 'quiz',
    correctAnswer: String.fromCharCode(65 + correctIndex),
  };
}

async function handleSuggestStructure(
  session: IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const structure = args.structure as string[];
  const rationale = args.rationale as string;

  // Update stage to indicate structure is proposed
  updateSession({ stage: 'structure' });

  return {
    success: true,
    structure,
    rationale,
    noteCount: session.notes.length,
  };
}

async function handleMarkReady(
  session: IdeationSession,
  args: Record<string, unknown>,
  updateSession: (updates: Partial<IdeationSession>) => void
): Promise<unknown> {
  const summary = args.summary as string;
  const slideCount = args.slideCount as number | undefined;

  updateSession({ stage: 'ready' });

  return {
    success: true,
    summary,
    estimatedSlides: slideCount,
    noteCount: session.notes.length,
    sourceCount: session.sources?.length || 0,
    message: 'Ready to build deck!',
  };
}

// ============================================
// EXTERNAL EXTRACTION HELPERS
// ============================================

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extract transcript from YouTube video using Gemini's native video understanding.
 * Gemini fetches and processes the video server-side (no CORS issues).
 */
async function extractYouTubeTranscript(url: string): Promise<TranscriptSegment[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log(`[extractYouTubeTranscript] Processing video with Gemini: ${url}`);

    const prompt = `Extract a COMPLETE, EXHAUSTIVE transcript from this YouTube video.

CRITICAL REQUIREMENTS:
1. Extract EVERY piece of spoken content - miss nothing
2. Use small segments (5-15 seconds each) for granular timestamps
3. Include ALL content: main points, examples, anecdotes, statistics, quotes, transitions
4. Cover the ENTIRE video from start to finish

Return a JSON array of transcript segments:
[
  {
    "text": "Complete content of this segment",
    "startTime": 0,
    "endTime": 12,
    "confidence": 0.95
  }
]

VERIFY: Before returning, confirm you have captured the ENTIRE video.
Return ONLY valid JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                fileUri: url,
                mimeType: 'video/*',
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) return [];

    const segments = JSON.parse(text) as TranscriptSegment[];
    console.log(`[extractYouTubeTranscript] Extracted ${segments.length} segments`);
    return segments;
  } catch (error) {
    console.error('[extractYouTubeTranscript] Error:', error);
    throw new Error(`Failed to extract transcript: ${error}`);
  }
}

/**
 * Extract content from a web page
 * Uses Firecrawl as primary method (handles JS-heavy/protected sites)
 * Falls back to Gemini urlContext for simple pages or if Firecrawl unavailable
 */
async function extractWebPageContent(url: string): Promise<{
  title: string;
  author?: string;
  sections: Array<{ heading: string; content: string }>;
}> {
  // Try Firecrawl first (handles enterprise sites like McKinsey)
  if (isFirecrawlAvailable()) {
    try {
      console.log('[extractWebPageContent] Trying Firecrawl...');
      const { title, markdown, metadata } = await scrapeUrl(url);

      if (markdown && markdown.trim().length > 100) {
        const sections = parseMarkdownToSections(markdown);
        console.log('[extractWebPageContent] Firecrawl success:', title, `(${sections.length} sections)`);
        return {
          title,
          author: metadata.author,
          sections,
        };
      }
      console.log('[extractWebPageContent] Firecrawl returned insufficient content, trying Gemini...');
    } catch (firecrawlError) {
      console.warn('[extractWebPageContent] Firecrawl failed:', firecrawlError);
      // Continue to Gemini fallback
    }
  }

  // Fallback to Gemini urlContext
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    console.log('[extractWebPageContent] Trying Gemini urlContext...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this web page and extract its content structure.

URL: ${url}

Return JSON:
{
  "title": "Page title",
  "author": "Author if available",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content (summarized if very long)"
    }
  ]
}

Extract all meaningful sections. Summarize long content to ~200 words per section.
Return ONLY valid JSON.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        tools: [{ urlContext: {} }],
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response from AI');

    // Check if the response looks like an error message rather than JSON
    if (!text.startsWith('{') && !text.startsWith('[')) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('unable') || lowerText.includes('cannot access') || lowerText.includes('error')) {
        throw new Error('Unable to access this URL. It may require authentication or be private.');
      }
      throw new Error('Could not extract content from this URL.');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('[extractWebPageContent] Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('SyntaxError') || errorMsg.includes('JSON')) {
      throw new Error('Unable to access this URL. It may require authentication or be private.');
    }
    throw new Error(`Failed to extract web content: ${errorMsg}`);
  }
}

// ============================================
// COMPREHENSIVE CONTENT CATEGORIZATION
// ============================================

/**
 * Categorized note from AI analysis
 */
interface CategorizedNote {
  content: string;
  theme: string;
  type: ContentType;
  column: string;
  excerpt: string;
}

/**
 * Result of comprehensive content extraction and categorization
 */
export interface ComprehensiveExtractionResult {
  success: boolean;
  noteCount: number;
  themes: string[];
  types: ContentType[];
  readyForPills: boolean;
  title: string;
  wordCount: number;
}

/**
 * Use AI to categorize ALL content from a web page into structured notes
 * This extracts EVERYTHING - statistics, quotes, frameworks, examples, etc.
 */
async function categorizeContentWithAI(
  content: ComprehensiveContent,
  recipe?: DeckRecipe
): Promise<CategorizedNote[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const columns = getRecipeColumns(recipe);

  const prompt = `Analyze this content and categorize EVERY piece of information into structured notes.

CONTENT FROM: ${content.title}
URL: ${content.url}
---
${content.fullMarkdown}
---

CRITICAL: Extract EVERYTHING. Do not skip any information. Each distinct fact, insight, or piece of data should become a separate note.

For EACH piece of information, categorize:

1. content: The information itself (be complete but concise, max 200 words)
2. theme: What topic does this belong to? Be specific. Examples:
   - "AI Adoption Trends"
   - "Market Statistics"
   - "Technology Capabilities"
   - "Business Impact"
   - "Implementation Challenges"
   - "Case Studies"
   - "Expert Opinions"
   - "Future Predictions"
3. type: The content type (MUST be one of these exact values):
   - "statistic" - numbers, percentages, data points, market sizes
   - "quote" - expert quotes, testimonials, attributed statements
   - "framework" - processes, methodologies, models, step-by-step approaches
   - "example" - case studies, real-world applications, company stories
   - "definition" - key term definitions, concept explanations
   - "insight" - conclusions, key takeaways, analysis points
   - "trend" - industry trends, predictions, forecasts
   - "comparison" - comparisons between things, before/after, alternatives
4. column: Best-fit column from this list: ${columns.join(', ')}
5. excerpt: An exact quote from the source (max 50 words) that supports this note

Return JSON array with ALL extracted content:
[
  {
    "content": "...",
    "theme": "...",
    "type": "statistic|quote|framework|example|definition|insight|trend|comparison",
    "column": "...",
    "excerpt": "..."
  }
]

IMPORTANT:
- Extract 15-50 notes depending on content richness
- Every statistic should be its own note
- Every expert quote should be its own note
- Frameworks should include their components
- Case studies should capture key learnings
- Don't combine unrelated information

Return ONLY valid JSON array.`;

  try {
    console.log('[categorizeContentWithAI] Analyzing content with AI...');

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response from AI');

    const categorized = JSON.parse(text) as CategorizedNote[];
    console.log(`[categorizeContentWithAI] Extracted ${categorized.length} categorized notes`);

    return categorized;
  } catch (error) {
    console.error('[categorizeContentWithAI] Error:', error);
    throw new Error(`Failed to categorize content: ${error}`);
  }
}

/**
 * Get unique themes from categorized notes
 */
function extractUniqueThemes(notes: CategorizedNote[]): string[] {
  const themes = new Set<string>();
  for (const note of notes) {
    if (note.theme) themes.add(note.theme);
  }
  return Array.from(themes).sort();
}

/**
 * Get unique content types from categorized notes
 */
function extractUniqueTypes(notes: CategorizedNote[]): ContentType[] {
  const types = new Set<ContentType>();
  for (const note of notes) {
    if (note.type) types.add(note.type);
  }
  return Array.from(types);
}

// ============================================
// MAIN EXPORT
// ============================================

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
