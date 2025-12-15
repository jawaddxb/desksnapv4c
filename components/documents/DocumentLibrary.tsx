/**
 * DocumentLibrary Component
 *
 * Main component for managing uploaded documents.
 * Grid view with upload functionality and document management.
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  X,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { EmptyCard } from '@/components/ui/Card';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentCard } from './DocumentCard';
import { DocumentUploader } from './DocumentUploader';
import type { Document } from '@/types/documents';

// =============================================================================
// TYPES
// =============================================================================

interface DocumentLibraryProps {
  /** Optional callback when a document is selected */
  onSelect?: (document: Document) => void;
  /** Enable multi-select mode */
  multiSelect?: boolean;
  /** Currently selected document IDs (controlled) */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (ids: string[]) => void;
  /** Compact mode for embedding in other components */
  compact?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  onSelect,
  multiSelect = false,
  selectedIds = [],
  onSelectionChange,
  compact = false,
}) => {
  const { documents, isLoading, isUploading, upload, update, remove, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'processing' | 'error'>('all');

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    // Search filter
    const searchTarget = `${doc.title || ''} ${doc.fileName} ${doc.tags.join(' ')}`.toLowerCase();
    if (searchQuery && !searchTarget.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && doc.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const readyDocuments = documents.filter((d) => d.status === 'ready');
  const processingDocuments = documents.filter((d) => d.status === 'processing');

  // Handle document selection
  const handleDocumentClick = (doc: Document) => {
    if (doc.status !== 'ready') return;

    if (multiSelect && onSelectionChange) {
      const isSelected = selectedIds.includes(doc.id);
      if (isSelected) {
        onSelectionChange(selectedIds.filter((id) => id !== doc.id));
      } else {
        onSelectionChange([...selectedIds, doc.id]);
      }
    } else if (onSelect) {
      onSelect(doc);
    }
  };

  // Handle upload
  const handleUpload = async (file: File) => {
    const result = await upload(file);
    // Poll for status updates
    const pollInterval = setInterval(async () => {
      await refetch();
      // Check if this document is no longer processing
      const doc = documents.find((d) => d.id === result.id);
      if (doc && doc.status !== 'processing') {
        clearInterval(pollInterval);
      }
    }, 2000);

    // Clean up after 60 seconds max
    setTimeout(() => clearInterval(pollInterval), 60000);

    return result;
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  if (compact) {
    // Compact mode: just the grid without header/uploader
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#6B8E6B] animate-spin" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <p className="text-center text-[#8FA58F] py-8">No documents found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={`
                  cursor-pointer transition-all rounded-lg
                  ${selectedIds.includes(doc.id) ? 'ring-2 ring-[#6B8E6B]' : ''}
                  ${doc.status !== 'ready' ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <DocumentCard
                  document={doc}
                  onDelete={remove}
                  onUpdate={(id, updates) => update(id, updates)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1E2E1E]">Document Library</h2>
          <p className="text-[#8FA58F] text-sm">
            {readyDocuments.length} document{readyDocuments.length !== 1 ? 's' : ''} ready
            {processingDocuments.length > 0 && ` • ${processingDocuments.length} processing`}
          </p>
        </div>

        <DocumentUploader onUpload={handleUpload} isUploading={isUploading} compact />
      </div>

      {/* Search and filters */}
      {documents.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA58F]" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#D4E5D4] rounded-lg text-sm text-[#1E2E1E] placeholder-[#8FA58F] focus:outline-none focus:border-[#6B8E6B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8FA58F] hover:text-[#1E2E1E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-white border border-[#D4E5D4] rounded-lg p-1">
            {(['all', 'ready', 'processing', 'error'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`
                  px-3 py-1 text-xs font-medium rounded transition-all capitalize
                  ${statusFilter === status
                    ? 'bg-[#6B8E6B] text-white'
                    : 'text-[#8FA58F] hover:text-[#1E2E1E]'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#6B8E6B] animate-spin" />
          </div>
        ) : documents.length === 0 ? (
          <EmptyCard
            icon={<FolderOpen className="w-8 h-8 text-[#6B8E6B]" />}
            title="No documents yet"
            description="Upload documents to use as AI reference material when creating presentations."
            action={
              <DocumentUploader onUpload={handleUpload} isUploading={isUploading} />
            }
          />
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-[#D4E5D4] mx-auto mb-4" />
            <p className="text-[#8FA58F]">No documents match your search</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-2 text-[#6B8E6B] text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className={`
                  transition-all rounded-lg
                  ${multiSelect && selectedIds.includes(doc.id) ? 'ring-2 ring-[#6B8E6B]' : ''}
                  ${doc.status !== 'ready' && onSelect ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <DocumentCard
                  document={doc}
                  onDelete={remove}
                  onUpdate={(id, updates) => update(id, updates)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selection summary for multi-select mode */}
      {multiSelect && selectedIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#D4E5D4] flex items-center justify-between">
          <p className="text-sm text-[#1E2E1E]">
            <span className="font-medium">{selectedIds.length}</span> document
            {selectedIds.length !== 1 ? 's' : ''} selected
          </p>
          <button
            onClick={() => onSelectionChange?.([])}
            className="text-sm text-[#8FA58F] hover:text-[#1E2E1E]"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentLibrary;
