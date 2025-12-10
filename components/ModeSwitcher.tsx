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
    <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200">
      <button
        onClick={() => setViewMode('standard')}
        className={`
          px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest
          flex items-center gap-2 transition-all
          ${viewMode === 'standard'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-900'}
        `}
        title="Grid-based layouts with predictable structure"
      >
        <Component className="w-3.5 h-3.5" />
        Structured
      </button>
      <button
        onClick={() => setViewMode('wabi-sabi')}
        className={`
          px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest
          flex items-center gap-2 transition-all
          ${viewMode === 'wabi-sabi'
            ? 'bg-zinc-900 text-white shadow-sm'
            : 'text-zinc-500 hover:text-zinc-900'}
        `}
        title="70+ artistic archetypes with organic, generative layouts"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Organic
      </button>
    </div>
  );
};
