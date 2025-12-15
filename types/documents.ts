/**
 * Document Types
 *
 * Types for document management and AI context injection.
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export type DocumentFileType = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'txt' | 'md';
export type DocumentStatus = 'processing' | 'ready' | 'error';

export interface Document {
  id: string;
  ownerId: string;
  fileName: string;
  fileType: DocumentFileType;
  fileSize: number;
  title: string | null;
  tags: string[];
  status: DocumentStatus;
  tokenCount: number;
  errorMessage: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentWithText extends Document {
  extractedText: string | null;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface DocumentListResponse {
  items: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DocumentUploadResponse {
  id: string;
  status: DocumentStatus;
}

export interface DocumentUpdateRequest {
  title?: string;
  tags?: string[];
}

// =============================================================================
// CONTEXT TYPES (for AI injection)
// =============================================================================

export interface DocumentContext {
  documents: DocumentContextItem[];
  totalTokens: number;
}

export interface DocumentContextItem {
  id: string;
  title: string;
  fileName: string;
  content: string;
  tokenCount: number;
}

// =============================================================================
// UI TYPES
// =============================================================================

export interface DocumentUploadState {
  file: File | null;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'ready' | 'error';
  error: string | null;
  documentId: string | null;
}

// =============================================================================
// FILE TYPE HELPERS
// =============================================================================

export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'xlsx', 'csv', 'txt', 'md'] as const;
export const SUPPORTED_FILE_TYPES = SUPPORTED_EXTENSIONS; // Alias for component use
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

export const FILE_TYPE_LABELS: Record<DocumentFileType, string> = {
  pdf: 'PDF Document',
  docx: 'Word Document',
  xlsx: 'Excel Spreadsheet',
  csv: 'CSV File',
  txt: 'Text File',
  md: 'Markdown File',
};

export const FILE_TYPE_ICONS: Record<DocumentFileType, string> = {
  pdf: '📄',
  docx: '📝',
  xlsx: '📊',
  csv: '📋',
  txt: '📃',
  md: '📑',
};

export function getFileTypeFromName(fileName: string): DocumentFileType | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext && SUPPORTED_EXTENSIONS.includes(ext as DocumentFileType)) {
    return ext as DocumentFileType;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) return `${tokens} tokens`;
  return `${(tokens / 1000).toFixed(1)}K tokens`;
}
