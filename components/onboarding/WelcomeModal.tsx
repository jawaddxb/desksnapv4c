import React from 'react';
import { Plus, Lightbulb, Wand2, X, Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  onSelectPath: (path: 'new-deck' | 'ideate' | 'beautify') => void;
  onSkip: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  onSelectPath,
  onSkip,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2E1E]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 bg-white border border-[#D4E5D4] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.15)] overflow-hidden">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded-md transition-all duration-150 z-10"
          aria-label="Skip welcome"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-[#D4E5D4]">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#6B8E6B]" />
            <span className="text-2xl font-bold text-[#1E2E1E] tracking-tight">DeckSnap</span>
          </div>
          <h1 className="text-3xl font-light text-[#1E2E1E] mb-3">
            Welcome to DeckSnap
          </h1>
          <p className="text-[#4A5D4A] max-w-md mx-auto">
            Create stunning AI-powered presentations in minutes. Choose how you'd like to get started.
          </p>
        </div>

        {/* Path selection */}
        <div className="p-8 bg-[#F5FAF7]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#8FA58F] mb-6 text-center">
            What would you like to do?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New Deck Path */}
            <button
              onClick={() => onSelectPath('new-deck')}
              className="group p-6 bg-white border-2 border-[#D4E5D4] hover:border-[#6B8E6B] hover:shadow-[0_8px_32px_rgba(107,142,107,0.1)] rounded-lg text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-[#EDF5F0] group-hover:bg-[#6B8E6B] rounded-lg flex items-center justify-center mb-4 transition-all duration-200">
                <Plus className="w-6 h-6 text-[#6B8E6B] group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-[#1E2E1E] mb-2 group-hover:text-[#1E2E1E]">
                Quick Presentation
              </h3>
              <p className="text-[#4A5D4A] text-sm flex-1 mb-4">
                Jump right in and create a presentation from scratch with AI assistance.
              </p>
              <span className="flex items-center gap-1 text-[#8FA58F] group-hover:text-[#6B8E6B] text-sm font-medium transition-colors duration-200">
                Get Started <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Ideate Path */}
            <button
              onClick={() => onSelectPath('ideate')}
              className="group p-6 bg-white border-2 border-[#6B8E6B]/30 hover:border-[#6B8E6B] hover:shadow-[0_8px_32px_rgba(107,142,107,0.1)] rounded-lg text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-[#6B8E6B]/10 group-hover:bg-[#6B8E6B] rounded-lg flex items-center justify-center mb-4 transition-all duration-200">
                <Lightbulb className="w-6 h-6 text-[#6B8E6B] group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-[#1E2E1E] mb-2">
                Brainstorm First
              </h3>
              <p className="text-[#4A5D4A] text-sm flex-1 mb-4">
                Start with AI-powered ideation to structure your thoughts before building slides.
              </p>
              <span className="flex items-center gap-1 text-[#6B8E6B]/70 group-hover:text-[#6B8E6B] text-sm font-medium transition-colors duration-200">
                Start Ideating <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Beautify Path */}
            <button
              onClick={() => onSelectPath('beautify')}
              className="group p-6 bg-white border-2 border-[#D4E5D4] hover:border-[#7B68EE] hover:shadow-[0_8px_32px_rgba(123,104,238,0.1)] rounded-lg text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-[#7B68EE]/10 group-hover:bg-[#7B68EE] rounded-lg flex items-center justify-center mb-4 transition-all duration-200">
                <Wand2 className="w-6 h-6 text-[#7B68EE] group-hover:text-white transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-[#1E2E1E] mb-2">
                Transform Slides
              </h3>
              <p className="text-[#4A5D4A] text-sm flex-1 mb-4">
                Have an existing PPTX? Upload it and let AI redesign it beautifully.
              </p>
              <span className="flex items-center gap-1 text-[#7B68EE]/70 group-hover:text-[#7B68EE] text-sm font-medium transition-colors duration-200">
                Upload PPTX <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white border-t border-[#D4E5D4] text-center">
          <button
            onClick={onSkip}
            className="text-[#8FA58F] hover:text-[#1E2E1E] text-sm transition-colors duration-150"
          >
            Skip this and explore on my own
          </button>
        </div>
      </div>
    </div>
  );
};
