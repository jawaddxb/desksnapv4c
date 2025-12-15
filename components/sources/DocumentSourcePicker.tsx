/**
 * DocumentSourcePicker Component
 *
 * Modal for selecting documents from the library to add as sources.
 * Used in SourcesWizard to add document-based sources.
 */

import React, { useState, useCallback } from 'react';
import {
  X,
  FileText,
  FolderOpen,
  Plus,
  Check,
  Loader2,
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentUploader } from '@/components/documents/DocumentUploader';
import type { Document } from '@/types/documents';

// =============================================================================
// TYPES
// =============================================================================

interface DocumentSourcePickerProps {
  /** Called when documents are selected */
  onSelect: (documents: Document[]) => void;
  /** Called to close the picker */
  onClose: () => void;
  /** Allow multiple selection */
  multiple?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DocumentSourcePicker: React.FC<DocumentSourcePickerProps> = ({
  onSelect,
  onClose,
  multiple = true,
}) => {
  const { documents, isLoading, isUploading, upload, refetch } = useDocuments();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  // Filter to only ready documents
  const readyDocuments = documents.filter((d) => d.status === 'ready');

  const handleToggleDocument = useCallback((doc: Document) => {
    if (doc.status !== 'ready') return;

    if (multiple) {
      setSelectedIds((prev) =>
        prev.includes(doc.id)
          ? prev.filter((id) => id !== doc.id)
          : [...prev, doc.id]
      );
    } else {
      setSelectedIds([doc.id]);
    }
  }, [multiple]);

  const handleConfirm = useCallback(() => {
    const selected = readyDocuments.filter((d) => selectedIds.includes(d.id));
    onSelect(selected);
    onClose();
  }, [readyDocuments, selectedIds, onSelect, onClose]);

  const handleUpload = async (file: File) => {
    await upload(file);
    // Refetch to get new document
    await refetch();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4E5D4]">
          <div>
            <h2 className="text-lg font-bold text-[#1E2E1E]">Add Documents</h2>
            <p className="text-sm text-[#8FA58F]">
              Select documents from your library to use as reference material
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8FA58F] hover:text-[#1E2E1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#6B8E6B] animate-spin" />
            </div>
          ) : readyDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-[#D4E5D4] mx-auto mb-4" />
              <p className="text-[#1E2E1E] font-medium mb-2">No documents yet</p>
              <p className="text-[#8FA58F] text-sm mb-6">
                Upload documents to use them as AI reference material
              </p>
              <DocumentUploader onUpload={handleUpload} isUploading={isUploading} />
            </div>
          ) : (
            <>
              {/* Upload toggle */}
              <div className="mb-4">
                {showUploader ? (
                  <div className="mb-4">
                    <DocumentUploader onUpload={handleUpload} isUploading={isUploading} />
                    <button
                      onClick={() => setShowUploader(false)}
                      className="mt-2 text-sm text-[#8FA58F] hover:text-[#1E2E1E]"
                    >
                      Cancel upload
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUploader(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B8E6B] hover:bg-[#EDF5F0] transition-colors rounded border border-dashed border-[#D4E5D4]"
                  >
                    <Plus className="w-4 h-4" />
                    Upload new document
                  </button>
                )}
              </div>

              {/* Document grid */}
              <div className="grid grid-cols-2 gap-3">
                {readyDocuments.map((doc) => {
                  const isSelected = selectedIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleToggleDocument(doc)}
                      className={`
                        relative p-4 text-left rounded-lg border-2 transition-all
                        ${isSelected
                          ? 'border-[#6B8E6B] bg-[#EDF5F0]'
                          : 'border-[#D4E5D4] bg-white hover:border-[#6B8E6B]/50'
                        }
                      `}
                    >
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#6B8E6B] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-[#EDF5F0] flex items-center justify-center mb-2">
                        <FileText className="w-4 h-4 text-[#6B8E6B]" />
                      </div>

                      {/* Title */}
                      <p className="text-sm font-medium text-[#1E2E1E] truncate">
                        {doc.title || doc.fileName}
                      </p>

                      {/* Meta */}
                      <p className="text-xs text-[#8FA58F] mt-1">
                        {doc.fileType.toUpperCase()} &bull; {formatTokenCount(doc.tokenCount)} tokens
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {readyDocuments.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#D4E5D4]">
            <p className="text-sm text-[#8FA58F]">
              {selectedIds.length} document{selectedIds.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#8FA58F] hover:text-[#1E2E1E] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 text-sm font-medium bg-[#6B8E6B] hover:bg-[#5A7A5A] disabled:bg-[#D4E5D4] text-white rounded transition-colors"
              >
                Add to Sources
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper
function formatTokenCount(count: number): string {
  if (count < 1000) return `${count}`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

export default DocumentSourcePicker;
