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
    <div className="flex items-center bg-[#EDF5F0] p-1 border border-[#D4E5D4] rounded-md">
      <button
        onClick={() => setViewMode('standard')}
        className={`
          px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded
          flex items-center gap-2 transition-all duration-150
          ${viewMode === 'standard'
            ? 'bg-white text-[#1E2E1E] shadow-sm'
            : 'text-[#8FA58F] hover:text-[#4A5D4A]'}
        `}
        title="Grid-based layouts with predictable structure"
      >
        <Component className="w-3.5 h-3.5" />
        Structured
      </button>
      <button
        onClick={() => setViewMode('wabi-sabi')}
        className={`
          px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded
          flex items-center gap-2 transition-all duration-150
          ${viewMode === 'wabi-sabi'
            ? 'bg-[#6B8E6B] text-white shadow-sm'
            : 'text-[#8FA58F] hover:text-[#4A5D4A]'}
        `}
        title="70+ artistic archetypes with organic, generative layouts"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Organic
      </button>
    </div>
  );
};
