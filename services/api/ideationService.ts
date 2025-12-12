/**
 * Ideation Service
 *
 * API calls for ideation session CRUD operations.
 * Handles conversion between frontend (camelCase) and backend (snake_case) formats.
 */

import { api } from './apiClient';
import { Message } from '../../types';
import {
  IdeationSession,
  IdeaNote,
  NoteConnection,
  CreativeJournal,
  JournalEntry,
  BackendIdeationSession,
  BackendIdeaNote,
  BackendNoteConnection,
  BackendMessage,
  BackendCreativeJournal,
  BackendJournalEntry,
  PaginatedIdeationResponse,
  CreateIdeationRequest,
  UpdateIdeationRequest,
  CreateNoteRequest,
  UpdateNoteRequest,
} from '../../types/ideation';

// ============ Conversion Helpers ============

const backendJournalEntryToFrontend = (entry: BackendJournalEntry): JournalEntry => ({
  id: entry.id,
  timestamp: entry.timestamp,
  stage: entry.stage,
  title: entry.title,
  narrative: entry.narrative,
  decision: entry.decision || undefined,
  alternatives: entry.alternatives || undefined,
  confidence: entry.confidence || undefined,
  relatedNoteIds: entry.related_note_ids || undefined,
  relatedSlideIds: entry.related_slide_ids || undefined,
  toolsCalled: entry.tools_called || undefined,
});

const backendJournalToFrontend = (journal: BackendCreativeJournal | null | undefined): CreativeJournal | undefined => {
  if (!journal) return undefined;
  return {
    entries: journal.entries.map(backendJournalEntryToFrontend),
    summary: journal.summary || undefined,
  };
};

const backendNoteToFrontend = (note: BackendIdeaNote): IdeaNote => ({
  id: note.id,
  content: note.content,
  type: note.type,
  sourceUrl: note.source_url || undefined,
  sourceTitle: note.source_title || undefined,
  parentId: note.parent_id || undefined,
  column: note.column,
  row: note.row,
  color: note.color,
  approved: note.approved,
  createdAt: new Date(note.created_at).getTime(),
});

const backendConnectionToFrontend = (conn: BackendNoteConnection): NoteConnection => ({
  id: conn.id,
  fromId: conn.from_note_id,
  toId: conn.to_note_id,
});

const backendMessageToFrontend = (msg: BackendMessage): Message => ({
  id: msg.id,
  role: msg.role,
  text: msg.text,
  timestamp: new Date(msg.created_at).getTime(),
});

const backendToFrontend = (backend: BackendIdeationSession): IdeationSession => ({
  id: backend.id,
  topic: backend.topic,
  notes: (backend.notes || []).map(backendNoteToFrontend),
  connections: (backend.connections || []).map(backendConnectionToFrontend),
  messages: (backend.messages || []).map(backendMessageToFrontend),
  stage: backend.stage,
  createdAt: new Date(backend.created_at).getTime(),
  lastModified: new Date(backend.updated_at).getTime(),
  generatedPresentationIds: backend.generated_presentation_ids || [],
  sourceContent: backend.source_content || undefined,
  creativeJournal: backendJournalToFrontend(backend.creative_journal),
  syncStatus: 'synced',
});

// Frontend to backend conversions

const frontendJournalEntryToBackend = (entry: JournalEntry): BackendJournalEntry => ({
  id: entry.id,
  timestamp: entry.timestamp,
  stage: entry.stage,
  title: entry.title,
  narrative: entry.narrative,
  decision: entry.decision || null,
  alternatives: entry.alternatives || null,
  confidence: entry.confidence || null,
  related_note_ids: entry.relatedNoteIds || null,
  related_slide_ids: entry.relatedSlideIds || null,
  tools_called: entry.toolsCalled || null,
});

const frontendJournalToBackend = (journal: CreativeJournal | undefined): BackendCreativeJournal | null => {
  if (!journal) return null;
  return {
    entries: journal.entries.map(frontendJournalEntryToBackend),
    summary: journal.summary || null,
  };
};

const frontendNoteToBackendCreate = (note: IdeaNote): CreateNoteRequest => ({
  content: note.content,
  type: note.type,
  source_url: note.sourceUrl || null,
  source_title: note.sourceTitle || null,
  parent_id: note.parentId || null,
  column: note.column,
  row: note.row,
  color: note.color,
  approved: note.approved,
});

const frontendToBackendCreate = (session: IdeationSession): CreateIdeationRequest => ({
  topic: session.topic,
  stage: session.stage,
  source_content: session.sourceContent || null,
  notes: session.notes.map(frontendNoteToBackendCreate),
  creative_journal: frontendJournalToBackend(session.creativeJournal),
});

// ============ API Calls ============

/**
 * List all ideation sessions for the current user
 */
export const listIdeationSessions = async (
  page: number = 1,
  pageSize: number = 50
): Promise<{ sessions: IdeationSession[]; total: number; pages: number }> => {
  const response = await api.get<PaginatedIdeationResponse>(
    `/api/v1/ideations?page=${page}&page_size=${pageSize}`
  );
  return {
    sessions: response.items.map(backendToFrontend),
    total: response.total,
    pages: response.pages,
  };
};

/**
 * Get a single ideation session with all data
 */
export const getIdeationSession = async (id: string): Promise<IdeationSession> => {
  const response = await api.get<BackendIdeationSession>(`/api/v1/ideations/${id}`);
  return backendToFrontend(response);
};

/**
 * Create a new ideation session
 */
export const createIdeationSession = async (session: IdeationSession): Promise<IdeationSession> => {
  const backendData = frontendToBackendCreate(session);
  const response = await api.post<BackendIdeationSession>('/api/v1/ideations', backendData);
  return backendToFrontend(response);
};

/**
 * Update an ideation session
 */
export const updateIdeationSession = async (
  id: string,
  updates: Partial<IdeationSession>
): Promise<IdeationSession> => {
  const backendUpdates: UpdateIdeationRequest = {};

  if (updates.topic !== undefined) backendUpdates.topic = updates.topic;
  if (updates.stage !== undefined) backendUpdates.stage = updates.stage;
  if (updates.sourceContent !== undefined) backendUpdates.source_content = updates.sourceContent || null;
  if (updates.creativeJournal !== undefined) {
    backendUpdates.creative_journal = frontendJournalToBackend(updates.creativeJournal);
  }
  if (updates.notes !== undefined) {
    backendUpdates.notes = updates.notes.map(frontendNoteToBackendCreate);
  }
  if (updates.connections !== undefined) {
    backendUpdates.connections = updates.connections.map(c => ({
      from_note_id: c.fromId,
      to_note_id: c.toId,
    }));
  }

  const response = await api.put<BackendIdeationSession>(`/api/v1/ideations/${id}`, backendUpdates);
  return backendToFrontend(response);
};

/**
 * Delete an ideation session
 */
export const deleteIdeationSession = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/ideations/${id}`);
};

/**
 * Sync a full ideation session (create or update based on existence)
 */
export const syncIdeationSession = async (session: IdeationSession): Promise<IdeationSession> => {
  try {
    await api.get<BackendIdeationSession>(`/api/v1/ideations/${session.id}`);
    return await updateIdeationSession(session.id, session);
  } catch {
    return await createIdeationSession(session);
  }
};

// ============ Note Operations ============

/**
 * Add a note to an ideation session
 */
export const addNote = async (
  sessionId: string,
  note: IdeaNote
): Promise<IdeaNote> => {
  const backendNote = frontendNoteToBackendCreate(note);
  const response = await api.post<BackendIdeaNote>(
    `/api/v1/ideations/${sessionId}/notes`,
    backendNote
  );
  return backendNoteToFrontend(response);
};

/**
 * Update a note
 */
export const updateNote = async (
  sessionId: string,
  noteId: string,
  updates: Partial<IdeaNote>
): Promise<IdeaNote> => {
  const backendUpdates: UpdateNoteRequest = {};

  if (updates.content !== undefined) backendUpdates.content = updates.content;
  if (updates.type !== undefined) backendUpdates.type = updates.type;
  if (updates.sourceUrl !== undefined) backendUpdates.source_url = updates.sourceUrl || null;
  if (updates.sourceTitle !== undefined) backendUpdates.source_title = updates.sourceTitle || null;
  if (updates.parentId !== undefined) backendUpdates.parent_id = updates.parentId || null;
  if (updates.column !== undefined) backendUpdates.column = updates.column;
  if (updates.row !== undefined) backendUpdates.row = updates.row;
  if (updates.color !== undefined) backendUpdates.color = updates.color;
  if (updates.approved !== undefined) backendUpdates.approved = updates.approved;

  const response = await api.put<BackendIdeaNote>(
    `/api/v1/ideations/${sessionId}/notes/${noteId}`,
    backendUpdates
  );
  return backendNoteToFrontend(response);
};

/**
 * Delete a note
 */
export const deleteNote = async (sessionId: string, noteId: string): Promise<void> => {
  await api.delete(`/api/v1/ideations/${sessionId}/notes/${noteId}`);
};

// ============ Connection Operations ============

/**
 * Add a connection between two notes
 */
export const addConnection = async (
  sessionId: string,
  fromId: string,
  toId: string
): Promise<NoteConnection> => {
  const response = await api.post<BackendNoteConnection>(
    `/api/v1/ideations/${sessionId}/connections`,
    { from_note_id: fromId, to_note_id: toId }
  );
  return backendConnectionToFrontend(response);
};

/**
 * Remove a connection
 */
export const removeConnection = async (sessionId: string, connectionId: string): Promise<void> => {
  await api.delete(`/api/v1/ideations/${sessionId}/connections/${connectionId}`);
};

// ============ Presentation Linking ============

/**
 * Link an ideation session to a generated presentation (One-to-Many)
 */
export const linkToPresentation = async (
  sessionId: string,
  presentationId: string
): Promise<void> => {
  await api.post(`/api/v1/ideations/${sessionId}/presentations`, {
    presentation_id: presentationId,
  });
};

/**
 * Unlink a presentation from an ideation session
 */
export const unlinkPresentation = async (
  sessionId: string,
  presentationId: string
): Promise<void> => {
  await api.delete(`/api/v1/ideations/${sessionId}/presentations/${presentationId}`);
};

// ============ Journal Operations ============

/**
 * Add a journal entry to an ideation session
 */
export const addJournalEntry = async (
  sessionId: string,
  entry: JournalEntry
): Promise<IdeationSession> => {
  const backendEntry = frontendJournalEntryToBackend(entry);
  const response = await api.post<BackendIdeationSession>(
    `/api/v1/ideations/${sessionId}/journal`,
    backendEntry
  );
  return backendToFrontend(response);
};

// ============ Export Default ============

export default {
  listIdeationSessions,
  getIdeationSession,
  createIdeationSession,
  updateIdeationSession,
  deleteIdeationSession,
  syncIdeationSession,
  addNote,
  updateNote,
  deleteNote,
  addConnection,
  removeConnection,
  linkToPresentation,
  unlinkPresentation,
  addJournalEntry,
  // Conversion helpers for external use
  backendToFrontend,
  frontendToBackendCreate,
};
