/**
 * DocumentCard Component
 *
 * Displays a single document in the library.
 * Shows status, file info, and actions.
 */

import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  File,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Eye,
  MoreVertical,
  X,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Document } from '@/types/documents';

// =============================================================================
// TYPES
// =============================================================================

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; tags?: string[] }) => void;
  onView?: (id: string) => void;
}

// =============================================================================
// HELPERS
// =============================================================================

const FILE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  csv: FileSpreadsheet,
  txt: File,
  md: File,
};

function getFileIcon(fileType: string) {
  return FILE_ICONS[fileType] || File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTokenCount(count: number): string {
  if (count < 1000) return `${count}`;
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDelete,
  onUpdate,
  onView,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(document.title || document.fileName);
  const [showMenu, setShowMenu] = useState(false);

  const Icon = getFileIcon(document.fileType);
  const displayTitle = document.title || document.fileName;

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== displayTitle) {
      onUpdate(document.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(displayTitle);
      setIsEditing(false);
    }
  };

  return (
    <Card
      variant="interactive"
      className="relative group"
      onClick={() => onView?.(document.id)}
    >
      <div className="p-4">
        {/* Header with icon and status */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor:
                document.status === 'ready'
                  ? '#EDF5F0'
                  : document.status === 'error'
                  ? '#FEF2F2'
                  : '#F5F5F5',
            }}
          >
            {document.status === 'processing' ? (
              <Loader2 className="w-5 h-5 text-[#8FA58F] animate-spin" />
            ) : document.status === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Icon className="w-5 h-5 text-[#6B8E6B]" />
            )}
          </div>

          {/* Actions menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 text-[#8FA58F] hover:text-[#1E2E1E] opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-8 bg-white border border-[#D4E5D4] rounded-lg shadow-lg py-1 z-10 min-w-[140px]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[#1E2E1E] hover:bg-[#F5FAF7] flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Rename
                </button>
                {onView && document.status === 'ready' && (
                  <button
                    onClick={() => {
                      onView(document.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#1E2E1E] hover:bg-[#F5FAF7] flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(document.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveTitle}
                autoFocus
                className="flex-1 text-sm font-medium text-[#1E2E1E] bg-transparent border-b border-[#6B8E6B] outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveTitle();
                }}
                className="p-1 text-[#6B8E6B] hover:bg-[#EDF5F0] rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditTitle(displayTitle);
                  setIsEditing(false);
                }}
                className="p-1 text-[#8FA58F] hover:bg-[#F5FAF7] rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3 className="text-sm font-medium text-[#1E2E1E] truncate" title={displayTitle}>
              {displayTitle}
            </h3>
          )}
        </div>

        {/* Status message for errors */}
        {document.status === 'error' && document.errorMessage && (
          <p className="text-xs text-red-500 mb-2 truncate" title={document.errorMessage}>
            {document.errorMessage}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-3 text-xs text-[#8FA58F]">
          <span className="uppercase">{document.fileType}</span>
          <span>{formatFileSize(document.fileSize)}</span>
          {document.status === 'ready' && document.tokenCount > 0 && (
            <span title="Token count">{formatTokenCount(document.tokenCount)} tokens</span>
          )}
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {document.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-[#EDF5F0] text-[#6B8E6B] text-[10px] rounded"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-[10px] text-[#8FA58F]">+{document.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Status badge */}
        <div className="absolute bottom-2 right-2">
          {document.status === 'ready' && (
            <CheckCircle2 className="w-4 h-4 text-[#6B8E6B]" />
          )}
          {document.status === 'processing' && (
            <span className="text-[10px] text-[#8FA58F] uppercase tracking-wide">
              Processing...
            </span>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </Card>
  );
};

export default DocumentCard;
