/**
 * Version History Panel
 *
 * Collapsible sidebar panel for managing version checkpoints.
 * Allows users to save, restore, and delete versions.
 */

import React, { useState } from 'react';
import {
  History,
  Clock,
  RotateCcw,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react';
import { Version } from '@/services/api/versionService';

interface VersionHistoryPanelProps {
  versions: Version[];
  isLoading: boolean;
  onCreateVersion: (label?: string) => void;
  onRestoreVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  isCreating: boolean;
  isRestoring: boolean;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  versions,
  isLoading,
  onCreateVersion,
  onRestoreVersion,
  onDeleteVersion,
  isCreating,
  isRestoring,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [label, setLabel] = useState('');
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);

  const handleCreate = () => {
    onCreateVersion(label || undefined);
    setLabel('');
    setShowLabelInput(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <div className="border-t border-[#D4E5D4] bg-[#F5FAF7]">
      {/* Header Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-[#8FA58F] hover:text-[#1E2E1E] transition-colors duration-150"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <History className="w-4 h-4 text-[#6B8E6B]" />
          Version History
          <span className="px-1.5 py-0.5 bg-[#EDF5F0] text-[10px]">
            {versions.length}
          </span>
        </span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Save Version Button */}
          {!showLabelInput ? (
            <button
              onClick={() => setShowLabelInput(true)}
              disabled={isCreating}
              className="w-full py-2 flex items-center justify-center gap-2 bg-[#6B8E6B] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#5A7A5A] transition-colors duration-150 disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Save as Version
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Version label (optional)"
                className="w-full px-3 py-2 bg-white border border-[#D4E5D4] text-[#1E2E1E] text-sm focus:border-[#6B8E6B] outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') {
                    setShowLabelInput(false);
                    setLabel('');
                  }
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 py-2 bg-[#6B8E6B] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#5A7A5A] disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowLabelInput(false);
                    setLabel('');
                  }}
                  className="px-3 py-2 bg-[#EDF5F0] text-[#8FA58F] hover:text-[#1E2E1E]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Version List */}
          {isLoading ? (
            <div className="text-center py-4 text-[#8FA58F] text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-4 text-[#8FA58F] text-sm">
              No versions saved yet
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-3 bg-white border border-[#D4E5D4] hover:border-[#6B8E6B] transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[#6B8E6B] font-bold text-sm">
                          v{version.versionNumber}
                        </span>
                        {version.label && (
                          <span className="text-[#1E2E1E] text-sm truncate">
                            {version.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-[#8FA58F]">
                        <Clock className="w-3 h-3" />
                        {formatDate(version.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {confirmRestore === version.id ? (
                        <>
                          <button
                            onClick={() => {
                              onRestoreVersion(version.id);
                              setConfirmRestore(null);
                            }}
                            disabled={isRestoring}
                            className="px-2 py-1 bg-[#6B8E6B] text-white text-[10px] font-bold uppercase disabled:opacity-50"
                          >
                            {isRestoring ? '...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setConfirmRestore(null)}
                            className="px-2 py-1 bg-[#EDF5F0] text-[#8FA58F] text-[10px]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setConfirmRestore(version.id)}
                            className="p-1.5 text-[#8FA58F] hover:text-[#6B8E6B] hover:bg-[#EDF5F0] transition-colors duration-150"
                            title="Restore this version"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteVersion(version.id)}
                            className="p-1.5 text-[#8FA58F] hover:text-red-400 hover:bg-[#EDF5F0] transition-colors duration-150"
                            title="Delete version"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;
