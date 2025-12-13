/**
 * Ideation Copilot Types
 *
 * Flat, simple data structures for the agentic ideation flow.
 * Notes connect via parentId references, positioned in swimlane columns.
 */

import { Message } from '../types';

// Swimlane column names (presentation narrative flow) - default for pitch/persuasion
export const COLUMNS = ['Hook', 'Problem', 'Solution', 'Proof', 'CTA'] as const;
export type ColumnName = typeof COLUMNS[number];

// Note colors for visual categorization (Studio Noir palette with subtle gradients)
export const NOTE_COLORS = {
  yellow: 'bg-gradient-to-br from-[#1f1f1f] to-[#1a1a1a] border-[#c5a47e] text-white',      // User ideas (gold accent)
  blue: 'bg-gradient-to-br from-[#141414] to-[#111111] border-white/25 text-white',          // AI suggestions
  green: 'bg-gradient-to-br from-[#1a1a18] to-[#1a1a1a] border-[#c5a47e]/50 text-white',     // Research findings
  pink: 'bg-gradient-to-br from-[#151515] to-[#111111] border-white/35 text-white',          // Questions/unknowns
  purple: 'bg-gradient-to-br from-[#0f0f0f] to-[#0a0a0a] border-[#c5a47e] text-white',       // Key insights (gold accent)
} as const;

export type NoteColor = keyof typeof NOTE_COLORS;

// Source of the note
export type NoteType = 'user' | 'ai' | 'research';

// Knowledge note types (for sources mode)
export type KnowledgeNoteType = 'idea' | 'concept' | 'framework' | 'claim' | 'example' | 'exercise' | 'quiz';

// Note categories for knowledge categorization (used by topic pills in sources mode)
// Renamed from ContentType to avoid collision with types.ts ContentType (display format)
export type NoteCategory =
  | 'statistic'    // Numbers, percentages, data points
  | 'quote'        // Expert quotes, testimonials
  | 'framework'    // Models, processes, methodologies
  | 'example'      // Case studies, real-world examples
  | 'definition'   // Key term definitions
  | 'insight'      // Conclusions, takeaways
  | 'trend'        // Industry trends, predictions
  | 'comparison';  // Comparisons, contrasts

// ============================================================================
// SOURCES MODE TYPES (VideoDeck / Research & Present)
// ============================================================================

/**
 * Source type for different input types
 */
export type SourceType = 'video' | 'web' | 'doc';

/**
 * Recipe type for different deck outputs
 */
export type DeckRecipe = 'training' | 'explainer' | 'brief' | 'pitch';

/**
 * Recipe-specific column configurations
 * Each recipe type has columns optimized for its narrative structure
 */
export const RECIPE_COLUMNS: Record<DeckRecipe, readonly string[]> = {
  training: ['Objective', 'Concept', 'Example', 'Practice', 'Review'],
  explainer: ['What', 'Why', 'How', 'Examples', 'Summary'],
  brief: ['Context', 'Key Points', 'Analysis', 'Implications', 'Actions'],
  pitch: ['Hook', 'Problem', 'Solution', 'Proof', 'CTA'],
} as const;

/**
 * Get columns for a specific recipe (with fallback to default COLUMNS)
 */
export function getRecipeColumns(recipe?: DeckRecipe): readonly string[] {
  return recipe ? RECIPE_COLUMNS[recipe] : COLUMNS;
}

/**
 * A source (video, web page, or document) for content extraction
 */
export interface Source {
  id: string;
  type: SourceType;
  url: string;
  title?: string;
  status: 'pending' | 'ingesting' | 'ingested' | 'error';
  errorMessage?: string;
  metadata?: SourceMetadata;
  transcript?: TranscriptSegment[];  // For videos
  chapters?: Chapter[];              // Identified chapters
  createdAt: number;
  // Comprehensive extraction fields (for topic pills)
  detectedThemes?: string[];         // e.g., "AI Trends", "Market Data"
  detectedTypes?: NoteCategory[];     // e.g., "statistic", "quote", "framework"
  fullMarkdown?: string;             // Complete extracted content
}

/**
 * Source metadata (channel, duration, etc.)
 */
export interface SourceMetadata {
  duration?: number;        // Video duration in seconds
  author?: string;          // Channel/author name
  publishDate?: string;     // When published
  thumbnailUrl?: string;    // Video thumbnail
  description?: string;     // Video/page description
}

/**
 * Transcript segment with timing
 */
export interface TranscriptSegment {
  text: string;
  startTime: number;        // Seconds
  endTime: number;          // Seconds
  confidence?: number;      // 0-1
}

/**
 * Chapter/section identified in content
 */
export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  summary?: string;
  topics?: string[];
}

/**
 * Proof link connecting a note to its source(s)
 */
export interface ProofLink {
  sourceId: string;         // Which source this came from
  startTime?: number;       // Video timestamp start (seconds)
  endTime?: number;         // Video timestamp end (seconds)
  sectionAnchor?: string;   // Web page section/heading
  excerpt?: string;         // Short quote from source
  confidence: number;       // 0-1 confidence score
}

/**
 * A single sticky note on the ideation canvas.
 * Flat structure - connections via parentId, position via column/row.
 */
export interface IdeaNote {
  id: string;
  content: string;
  type: NoteType;
  sourceUrl?: string;           // URL source for research notes
  sourceTitle?: string;         // Title of research source
  sourceReliability?: 1 | 2 | 3 | 4 | 5; // Source reliability (1-5 stars)
  sourceName?: string;          // Source name (e.g., "Statista", "Forbes")
  findingType?: string;         // Type of finding (market, trend, competitor, etc.)
  parentId?: string;            // ID of parent note (for connectors)
  column: number;               // 0-4 index into COLUMNS
  row: number;                  // Vertical position within column
  color: NoteColor;
  approved: boolean;            // User has confirmed this note
  createdAt: number;

  // Sources mode fields (VideoDeck / Research & Present)
  knowledgeType?: KnowledgeNoteType;  // Type of extracted knowledge
  proofLinks?: ProofLink[];           // Links to source evidence
  // Topic categorization (for filtering with pills)
  theme?: string;                     // e.g., "AI Trends", "Market Data"
  noteCategory?: NoteCategory;        // e.g., "statistic", "quote"
}

/**
 * Connection between two notes (for explicit multi-parent relationships)
 */
export interface NoteConnection {
  id: string;
  fromId: string;
  toId: string;
}

/**
 * An ideation session - the full state of a brainstorming canvas.
 */
export interface IdeationSession {
  id: string;
  topic: string;
  notes: IdeaNote[];
  connections: NoteConnection[];  // Additional connections beyond parentId
  messages: Message[];            // Conversation history with copilot
  stage: IdeationStage;
  createdAt: number;
  lastModified: number;
  // One-to-Many: decks generated from this ideation
  generatedPresentationIds?: string[];
  // Original pasted content (if user pasted content directly)
  sourceContent?: string;
  // AI thinking narrative
  creativeJournal?: CreativeJournal;
  // API sync state
  syncStatus?: 'synced' | 'pending' | 'error';

  // Sources mode fields (VideoDeck / Research & Present)
  sourceMode?: 'prompt' | 'video' | 'web' | 'mixed';  // What type of input
  sources?: Source[];                                   // Video/web sources
  recipe?: DeckRecipe;                                  // Output deck type
}

/**
 * Stages of the ideation process (for copilot guidance)
 */
export type IdeationStage = 'discover' | 'expand' | 'structure' | 'ready' | 'review' | 'style-preview';

/**
 * Response from the agentic copilot
 */
export interface CopilotResponse {
  text: string;                   // Text response to display
  toolCalls?: ToolCall[];         // Tools the LLM called
}

/**
 * A tool call from the LLM
 */
export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

/**
 * Result from web search query
 */
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: string;              // Why this is relevant
}

/**
 * @deprecated Use WebSearchResult instead
 */
export type ResearchResult = WebSearchResult;

/**
 * Deck plan preview before building
 */
export interface DeckPlan {
  sections: DeckPlanSection[];
  estimatedSlides: number;
  suggestedTheme?: string;
}

export interface DeckPlanSection {
  name: string;
  noteIds: string[];
  slideCount: number;
  layoutSuggestion: string;
}

/**
 * Theme suggestion from AI analysis of ideation content
 */
export interface ThemeSuggestion {
  themeId: string;           // e.g., 'executive', 'startup'
  reasoning: string;         // Why this theme fits the content
  visualStyleHint: string;   // Brief description of the visual direction
  alternativeIds?: string[]; // 2-3 other fitting themes from different categories
}

// ============================================================================
// CREATIVE DIRECTOR'S JOURNAL
// ============================================================================

/**
 * Stage of the AI's creative process
 */
export type JournalStage = 'analyzing' | 'exploring' | 'deciding' | 'creating' | 'refining';

/**
 * A single entry in the Creative Director's Journal.
 * Captures AI thinking at a specific decision point.
 */
export interface JournalEntry {
  id: string;
  timestamp: number;
  stage: JournalStage;
  title: string;              // e.g., "Selecting Your Visual Theme"
  narrative: string;          // Prose explanation of what AI did and why
  decision?: string;          // The actual choice made
  alternatives?: string[];    // What else was considered
  confidence?: number;        // 0-100
  relatedNoteIds?: string[];  // Notes this decision relates to
  relatedSlideIds?: string[]; // Slides this decision relates to
  toolsCalled?: string[];     // Tools invoked for this decision
}

/**
 * The full Creative Director's Journal for an ideation session.
 */
export interface CreativeJournal {
  entries: JournalEntry[];
  summary?: string;           // AI-generated summary of the creative process
}

// ============================================================================
// BACKEND API TYPES (snake_case for API communication)
// ============================================================================
//
// Transformation functions for these types are in:
// - services/api/ideationService.ts (backendToFrontend, frontendToBackend*)
//
// Nested types (BackendSource, BackendProofLink) are transformed inline
// within their parent type transformers (backendNoteToFrontend, etc.)
// ============================================================================

/**
 * Backend representation of Source
 * @see ideationService.ts - transformed inline within parent transformers
 */
export interface BackendSource {
  id: string;
  session_id: string;
  type: SourceType;
  url: string;
  title?: string | null;
  status: 'pending' | 'ingesting' | 'ingested' | 'error';
  error_message?: string | null;
  metadata?: SourceMetadata | null;
  transcript?: TranscriptSegment[] | null;
  chapters?: Chapter[] | null;
  created_at: string;
}

/**
 * Backend representation of ProofLink
 */
export interface BackendProofLink {
  source_id: string;
  start_time?: number | null;
  end_time?: number | null;
  section_anchor?: string | null;
  excerpt?: string | null;
  confidence: number;
}

/**
 * Backend representation of IdeaNote
 */
export interface BackendIdeaNote {
  id: string;
  session_id: string;
  content: string;
  type: NoteType;
  source_url?: string | null;
  source_title?: string | null;
  parent_id?: string | null;
  column: number;
  row: number;
  color: NoteColor;
  approved: boolean;
  created_at: string;
  updated_at: string;
  // Sources mode fields
  knowledge_type?: KnowledgeNoteType | null;
  proof_links?: BackendProofLink[] | null;
}

/**
 * Backend representation of NoteConnection
 */
export interface BackendNoteConnection {
  id: string;
  session_id: string;
  from_note_id: string;
  to_note_id: string;
}

/**
 * Backend representation of Message
 */
export interface BackendMessage {
  id: string;
  session_id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  created_at: string;
}

/**
 * Backend representation of JournalEntry
 */
export interface BackendJournalEntry {
  id: string;
  timestamp: number;
  stage: JournalStage;
  title: string;
  narrative: string;
  decision?: string | null;
  alternatives?: string[] | null;
  confidence?: number | null;
  related_note_ids?: string[] | null;
  related_slide_ids?: string[] | null;
  tools_called?: string[] | null;
}

/**
 * Backend representation of CreativeJournal
 */
export interface BackendCreativeJournal {
  entries: BackendJournalEntry[];
  summary?: string | null;
}

/**
 * Backend representation of IdeationSession
 */
export interface BackendIdeationSession {
  id: string;
  owner_id: string;
  topic: string;
  stage: IdeationStage;
  source_content?: string | null;
  generated_presentation_ids: string[];
  creative_journal?: BackendCreativeJournal | null;
  created_at: string;
  updated_at: string;
  notes?: BackendIdeaNote[];
  connections?: BackendNoteConnection[];
  messages?: BackendMessage[];
  // Sources mode fields
  source_mode?: 'prompt' | 'video' | 'web' | 'mixed' | null;
  sources?: BackendSource[] | null;
  recipe?: DeckRecipe | null;
}

/**
 * Paginated response from backend
 */
export interface PaginatedIdeationResponse {
  items: BackendIdeationSession[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

/**
 * Request to create a new ideation session
 */
export interface CreateIdeationRequest {
  topic: string;
  stage?: IdeationStage;
  source_content?: string | null;
  notes?: Omit<BackendIdeaNote, 'id' | 'session_id' | 'created_at' | 'updated_at'>[];
  creative_journal?: BackendCreativeJournal | null;
}

/**
 * Request to update an ideation session
 */
export interface UpdateIdeationRequest {
  topic?: string;
  stage?: IdeationStage;
  source_content?: string | null;
  creative_journal?: BackendCreativeJournal | null;
  notes?: CreateNoteRequest[];
  connections?: { from_note_id: string; to_note_id: string }[];
}

/**
 * Request to create a note
 */
export interface CreateNoteRequest {
  content: string;
  type: NoteType;
  source_url?: string | null;
  source_title?: string | null;
  parent_id?: string | null;
  column: number;
  row: number;
  color: NoteColor;
  approved?: boolean;
}

/**
 * Request to update a note
 */
export interface UpdateNoteRequest {
  content?: string;
  type?: NoteType;
  source_url?: string | null;
  source_title?: string | null;
  parent_id?: string | null;
  column?: number;
  row?: number;
  color?: NoteColor;
  approved?: boolean;
}

// Helper functions

export function createNote(
  content: string,
  column: number,
  type: NoteType = 'user',
  color: NoteColor = 'yellow',
  parentId?: string
): IdeaNote {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    content,
    type,
    column,
    row: 0, // Will be computed based on existing notes in column
    color,
    parentId,
    approved: type === 'user', // User notes are auto-approved
    createdAt: Date.now(),
  };
}

export function createSession(topic: string): IdeationSession {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic,
    notes: [],
    connections: [],
    messages: [],
    stage: 'discover',
    createdAt: Date.now(),
    lastModified: Date.now(),
  };
}

export function getColumnIndex(column: ColumnName | number): number {
  if (typeof column === 'number') return column;
  return COLUMNS.indexOf(column);
}

export function getColumnName(index: number): ColumnName {
  return COLUMNS[index] ?? 'Hook';
}

// Sources mode helper functions

export function createSource(
  url: string,
  type: SourceType
): Source {
  return {
    id: `source-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    url,
    status: 'pending',
    createdAt: Date.now(),
  };
}

export function createSourcesSession(
  topic: string,
  sourceMode: 'video' | 'web' | 'mixed',
  recipe: DeckRecipe
): IdeationSession {
  return {
    id: `sources-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    topic,
    notes: [],
    connections: [],
    messages: [],
    stage: 'discover',
    createdAt: Date.now(),
    lastModified: Date.now(),
    sourceMode,
    sources: [],
    recipe,
  };
}

export function createKnowledgeNote(
  content: string,
  column: number,
  knowledgeType: KnowledgeNoteType,
  proofLinks: ProofLink[] = [],
  tags?: { theme?: string; noteCategory?: NoteCategory }
): IdeaNote {
  return {
    id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    content,
    type: 'ai',
    column,
    row: 0,
    color: knowledgeType === 'concept' ? 'green' : knowledgeType === 'framework' ? 'purple' : 'blue',
    approved: false,
    createdAt: Date.now(),
    knowledgeType,
    proofLinks,
    theme: tags?.theme,
    noteCategory: tags?.noteCategory,
  };
}

// ============================================================================
// COLUMN STATUS UTILITIES (for autonomous completion model)
// ============================================================================

/**
 * Status of a single column in the ideation canvas
 */
export interface ColumnStatus {
  index: number;
  name: string;
  count: number;
}

/**
 * Get the fill status of all columns in the canvas
 */
export function getColumnFillStatus(notes: IdeaNote[]): ColumnStatus[] {
  return COLUMNS.map((name, index) => ({
    index,
    name,
    count: notes.filter(n => n.column === index).length,
  }));
}

/**
 * Check if ideation is complete (4+ columns filled with 10+ total notes)
 */
export function isIdeationComplete(notes: IdeaNote[]): boolean {
  const status = getColumnFillStatus(notes);
  const filledColumns = status.filter(c => c.count >= 1).length;
  return filledColumns >= 4 && notes.length >= 10;
}
