import React from 'react';
import { Component, Sparkles } from 'lucide-react';

interface ModeSwitcherProps {
  viewMode: 'standard' | 'wabi-sabi';
  setViewMode: (mode: 'standard' | 'wabi-sabi') => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center bg-white/5 p-1 border border-white/10">
      <button
        onClick={() => setViewMode('standard')}
        className={`
          px-3 py-1.5 text-xs font-bold uppercase tracking-widest
          flex items-center gap-2 transition-all duration-150
          ${viewMode === 'standard'
            ? 'bg-white text-black'
            : 'text-white/60 hover:text-white'}
        `}
        title="Grid-based layouts with predictable structure"
      >
        <Component className="w-3.5 h-3.5" />
        Structured
      </button>
      <button
        onClick={() => setViewMode('wabi-sabi')}
        className={`
          px-3 py-1.5 text-xs font-bold uppercase tracking-widest
          flex items-center gap-2 transition-all duration-150
          ${viewMode === 'wabi-sabi'
            ? 'bg-[#c5a47e] text-black'
            : 'text-white/60 hover:text-white'}
        `}
        title="70+ artistic archetypes with organic, generative layouts"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Organic
      </button>
    </div>
  );
};
