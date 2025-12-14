/**
 * IdeationResumePrompt Component
 *
 * A simple modal that prompts the user to continue their last ideation session,
 * start fresh, or choose from saved sessions.
 */

import React from 'react';
import { ArrowRight, Plus, FolderOpen, X } from 'lucide-react';

interface IdeationResumePromptProps {
  isOpen: boolean;
  onResume: () => void;
  onStartFresh: () => void;
  onChooseSaved: () => void;
  onClose: () => void;
}

export const IdeationResumePrompt: React.FC<IdeationResumePromptProps> = ({
  isOpen,
  onResume,
  onStartFresh,
  onChooseSaved,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1E2E1E]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#D4E5D4] rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_8px_32px_rgba(107,142,107,0.15)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1E2E1E] mb-2">
            Continue where you left off?
          </h2>
          <p className="text-[#4A5D4A] text-sm">
            You have an ideation session in progress. What would you like to do?
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {/* Resume last session */}
          <button
            onClick={onResume}
            className="flex items-center gap-4 p-4 bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white rounded-lg transition-colors text-left group"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Continue Session
              </span>
              <span className="text-xs opacity-80">
                Resume your last ideation
              </span>
            </div>
          </button>

          {/* Start fresh */}
          <button
            onClick={onStartFresh}
            className="flex items-center gap-4 p-4 bg-[#F5FAF7] hover:bg-[#EDF5F0] text-[#1E2E1E] transition-colors text-left group border border-[#D4E5D4] rounded-lg"
          >
            <div className="w-10 h-10 bg-[#6B8E6B]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-[#6B8E6B]" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Start Fresh
              </span>
              <span className="text-xs text-[#8FA58F]">
                Begin a new ideation session
              </span>
            </div>
          </button>

          {/* Choose from saved */}
          <button
            onClick={onChooseSaved}
            className="flex items-center gap-4 p-4 bg-[#F5FAF7] hover:bg-[#EDF5F0] text-[#1E2E1E] transition-colors text-left group border border-[#D4E5D4] rounded-lg"
          >
            <div className="w-10 h-10 bg-[#8FA58F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 text-[#8FA58F]" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Choose from Saved
              </span>
              <span className="text-xs text-[#8FA58F]">
                Browse your ideation sessions
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdeationResumePrompt;
