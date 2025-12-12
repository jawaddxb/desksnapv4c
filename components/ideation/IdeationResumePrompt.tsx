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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] border border-white/10 p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Continue where you left off?
          </h2>
          <p className="text-white/60 text-sm">
            You have an ideation session in progress. What would you like to do?
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {/* Resume last session */}
          <button
            onClick={onResume}
            className="flex items-center gap-4 p-4 bg-[#c5a47e] hover:bg-white text-black transition-colors text-left group"
          >
            <div className="w-10 h-10 bg-black/10 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Continue Session
              </span>
              <span className="text-xs opacity-70">
                Resume your last ideation
              </span>
            </div>
          </button>

          {/* Start fresh */}
          <button
            onClick={onStartFresh}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 text-white transition-colors text-left group border border-white/10"
          >
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center flex-shrink-0">
              <Plus className="w-5 h-5 text-[#c5a47e]" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Start Fresh
              </span>
              <span className="text-xs text-white/50">
                Begin a new ideation session
              </span>
            </div>
          </button>

          {/* Choose from saved */}
          <button
            onClick={onChooseSaved}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 text-white transition-colors text-left group border border-white/10"
          >
            <div className="w-10 h-10 bg-white/5 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <span className="font-bold uppercase tracking-wide text-sm block">
                Choose from Saved
              </span>
              <span className="text-xs text-white/50">
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
