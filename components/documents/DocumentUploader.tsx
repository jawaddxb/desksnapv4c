/**
 * DocumentUploader Component
 *
 * Drag-and-drop file upload zone for documents.
 * Supports PDF, DOCX, XLSX, CSV, TXT, MD files.
 */

import React, { useCallback, useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle, FileUp, X } from 'lucide-react';
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } from '@/types/documents';

// =============================================================================
// TYPES
// =============================================================================

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<{ id: string }>;
  isUploading?: boolean;
  className?: string;
  compact?: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function isValidFileType(filename: string): boolean {
  const ext = getFileExtension(filename);
  return SUPPORTED_FILE_TYPES.includes(ext as any);
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  isUploading = false,
  className = '',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!isValidFileType(file.name)) {
      return `Unsupported file type. Supported: ${SUPPORTED_FILE_TYPES.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size: ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Validate all files
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      // Upload each file
      setPendingFiles(fileArray);

      for (const file of fileArray) {
        try {
          await onUpload(file);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed');
        }
      }

      setPendingFiles([]);
    },
    [onUpload, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles, isUploading]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFiles]
  );

  // Compact mode for inline use
  if (compact) {
    return (
      <div className={className}>
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-2 bg-[#6B8E6B] hover:bg-[#5A7A5A] disabled:bg-[#8FA58F] text-white rounded-lg text-sm font-medium transition-all"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FileUp className="w-4 h-4" />
              Upload Document
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_FILE_TYPES.map((t) => `.${t}`).join(',')}
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }

  // Full drop zone
  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-[#6B8E6B] bg-[#EDF5F0]'
            : 'border-[#D4E5D4] bg-white hover:border-[#6B8E6B] hover:bg-[#F5FAF7]'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#6B8E6B] animate-spin" />
            <p className="text-[#1E2E1E] font-medium">
              Uploading {pendingFiles.length > 0 ? pendingFiles[0].name : 'document'}...
            </p>
            <p className="text-[#8FA58F] text-sm">
              Please wait while we process your file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-[#8FA58F]" />
            <p className="text-[#1E2E1E] font-medium">
              {isDragging ? 'Drop files here' : 'Drop documents here or click to browse'}
            </p>
            <p className="text-[#8FA58F] text-sm">
              Supports PDF, DOCX, XLSX, CSV, TXT, MD (max {formatFileSize(MAX_FILE_SIZE)})
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_FILE_TYPES.map((t) => `.${t}`).join(',')}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-50 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
