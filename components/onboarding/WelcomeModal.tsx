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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4 bg-[#111111] border border-white/10 overflow-hidden">
        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 transition-all duration-150 z-10"
          aria-label="Skip welcome"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#c5a47e]" />
            <span className="text-2xl font-bold text-white tracking-tight">DeckSnap</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-3">
            Welcome to DeckSnap
          </h1>
          <p className="text-white/60 max-w-md mx-auto">
            Create stunning AI-powered presentations in minutes. Choose how you'd like to get started.
          </p>
        </div>

        {/* Path selection */}
        <div className="p-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 text-center">
            What would you like to do?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New Deck Path */}
            <button
              onClick={() => onSelectPath('new-deck')}
              className="group p-6 bg-black border-2 border-white/10 hover:border-white hover:bg-white/5 text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-white/10 group-hover:bg-white flex items-center justify-center mb-4 transition-all duration-200">
                <Plus className="w-6 h-6 text-white group-hover:text-black transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white">
                Quick Presentation
              </h3>
              <p className="text-white/50 text-sm flex-1 mb-4">
                Jump right in and create a presentation from scratch with AI assistance.
              </p>
              <span className="flex items-center gap-1 text-white/40 group-hover:text-[#c5a47e] text-sm font-medium transition-colors duration-200">
                Get Started <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Ideate Path */}
            <button
              onClick={() => onSelectPath('ideate')}
              className="group p-6 bg-black border-2 border-[#c5a47e]/30 hover:border-[#c5a47e] hover:bg-[#c5a47e]/5 text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-[#c5a47e]/20 group-hover:bg-[#c5a47e] flex items-center justify-center mb-4 transition-all duration-200">
                <Lightbulb className="w-6 h-6 text-[#c5a47e] group-hover:text-black transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Brainstorm First
              </h3>
              <p className="text-white/50 text-sm flex-1 mb-4">
                Start with AI-powered ideation to structure your thoughts before building slides.
              </p>
              <span className="flex items-center gap-1 text-[#c5a47e]/70 group-hover:text-[#c5a47e] text-sm font-medium transition-colors duration-200">
                Start Ideating <ArrowRight className="w-4 h-4" />
              </span>
            </button>

            {/* Beautify Path */}
            <button
              onClick={() => onSelectPath('beautify')}
              className="group p-6 bg-black border-2 border-white/10 hover:border-purple-400 hover:bg-purple-400/5 text-left transition-all duration-200 flex flex-col"
            >
              <div className="w-12 h-12 bg-purple-500/20 group-hover:bg-purple-400 flex items-center justify-center mb-4 transition-all duration-200">
                <Wand2 className="w-6 h-6 text-purple-400 group-hover:text-black transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Transform Slides
              </h3>
              <p className="text-white/50 text-sm flex-1 mb-4">
                Have an existing PPTX? Upload it and let AI redesign it beautifully.
              </p>
              <span className="flex items-center gap-1 text-purple-400/70 group-hover:text-purple-400 text-sm font-medium transition-colors duration-200">
                Upload PPTX <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-black/50 border-t border-white/5 text-center">
          <button
            onClick={onSkip}
            className="text-white/40 hover:text-white text-sm transition-colors duration-150"
          >
            Skip this and explore on my own
          </button>
        </div>
      </div>
    </div>
  );
};
