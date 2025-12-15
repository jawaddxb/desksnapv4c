/**
 * Document Service
 *
 * API client for document management.
 * KISS: Simple functions following beautifyService pattern.
 */

import { api } from './apiClient';
import { API_BASE_URL } from '@/config';
import type {
  Document,
  DocumentWithText,
  DocumentListResponse,
  DocumentUploadResponse,
  DocumentUpdateRequest,
} from '@/types/documents';

// =============================================================================
// BACKEND TYPES (snake_case)
// =============================================================================

interface BackendDocument {
  id: string;
  owner_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  title: string | null;
  tags: string[];
  status: string;
  token_count: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

interface BackendDocumentWithText extends BackendDocument {
  extracted_text: string | null;
}

interface BackendDocumentListResponse {
  items: BackendDocument[];
  total: number;
  page: number;
  page_size: number;
}

// =============================================================================
// CONVERSION HELPERS
// =============================================================================

function toDocument(backend: BackendDocument): Document {
  return {
    id: backend.id,
    ownerId: backend.owner_id,
    fileName: backend.file_name,
    fileType: backend.file_type as Document['fileType'],
    fileSize: backend.file_size,
    title: backend.title,
    tags: backend.tags || [],
    status: backend.status as Document['status'],
    tokenCount: backend.token_count,
    errorMessage: backend.error_message,
    createdAt: new Date(backend.created_at).getTime(),
    updatedAt: new Date(backend.updated_at).getTime(),
  };
}

function toDocumentWithText(backend: BackendDocumentWithText): DocumentWithText {
  return {
    ...toDocument(backend),
    extractedText: backend.extracted_text,
  };
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Upload a document for text extraction.
 * Returns document ID for tracking progress.
 */
export async function uploadDocument(file: File): Promise<DocumentUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  // Use fetch directly for FormData (api client JSON-ifies body)
  const response = await fetch(`${API_BASE_URL}/api/v1/documents/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || error.message || 'Upload failed');
  }

  const data = await response.json();
  return {
    id: data.id,
    status: data.status,
  };
}

/**
 * Get list of user's documents with pagination.
 */
export async function getDocuments(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<DocumentListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));
  if (params?.status) queryParams.set('status', params.status);

  const query = queryParams.toString();
  const url = `/api/v1/documents${query ? `?${query}` : ''}`;

  const backend = await api.get<BackendDocumentListResponse>(url);

  return {
    items: backend.items.map(toDocument),
    total: backend.total,
    page: backend.page,
    pageSize: backend.page_size,
  };
}

/**
 * Get a single document with extracted text.
 */
export async function getDocument(documentId: string): Promise<DocumentWithText> {
  const backend = await api.get<BackendDocumentWithText>(
    `/api/v1/documents/${documentId}`
  );
  return toDocumentWithText(backend);
}

/**
 * Update document metadata (title, tags).
 */
export async function updateDocument(
  documentId: string,
  updates: DocumentUpdateRequest
): Promise<Document> {
  const backend = await api.patch<BackendDocument>(
    `/api/v1/documents/${documentId}`,
    updates
  );
  return toDocument(backend);
}

/**
 * Delete a document.
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/api/v1/documents/${documentId}`);
}

/**
 * Get multiple documents by IDs (for context injection).
 * Filters to only ready documents.
 */
export async function getDocumentsForContext(
  documentIds: string[]
): Promise<DocumentWithText[]> {
  // Fetch each document in parallel
  const promises = documentIds.map((id) =>
    getDocument(id).catch(() => null)
  );
  const results = await Promise.all(promises);

  // Filter to ready documents with text
  return results.filter(
    (doc): doc is DocumentWithText =>
      doc !== null && doc.status === 'ready' && doc.extractedText !== null
  );
}

// =============================================================================
// CONVENIENCE EXPORT
// =============================================================================

export const documentService = {
  upload: uploadDocument,
  list: getDocuments,
  get: getDocument,
  update: updateDocument,
  delete: deleteDocument,
  getForContext: getDocumentsForContext,
};
