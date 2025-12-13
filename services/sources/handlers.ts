/**
 * Sources Agent Handlers
 *
 * Tool handler implementations for the sources agent.
 */

import {
  IdeationSession,
  IdeaNote,
  ProofLink,
  Chapter,
  DeckRecipe,
  createSource,
  createKnowledgeNote,
  getRecipeColumns,
} from '../../types/ideation';
import { extractComprehensiveContent } from '../firecrawlService';
import { extractYouTubeTranscript } from './extraction';
import { categorizeContentWithAI, extractUniqueThemes, extractUniqueTypes } from './categorization';
import { formatTime, getColumnIndex } from './utils';
import { ComprehensiveExtractionResult } from './types';

// ============================================
// SOURCE MANAGEMENT HANDLERS
// ============================================

export async function handleAddSource(
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

export async function handleRemoveSource(
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

// ============================================
// CONTENT EXTRACTION HANDLERS
// ============================================

export async function handleExtractTranscript(
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

export async function handleExtractWebContent(
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
          noteCategory: catNote.type,
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

export async function handleIdentifyChapters(
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

// ============================================
// KNOWLEDGE EXTRACTION HANDLERS
// ============================================

export async function handleExtractConcept(
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

export async function handleExtractFramework(
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

export async function handleExtractClaim(
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

export async function handleExtractExample(
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

// ============================================
// SYNTHESIS HANDLERS
// ============================================

export async function handleSynthesis(
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

// ============================================
// PEDAGOGY HANDLERS
// ============================================

export async function handleAddLearningObjective(
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

export async function handleAddExercise(
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

export async function handleAddQuizQuestion(
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

// ============================================
// STRUCTURE HANDLERS
// ============================================

export async function handleSuggestStructure(
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

export async function handleMarkReady(
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
