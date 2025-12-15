/**
 * ViewModeToggle
 *
 * Segmented control for switching between Structured and Organic layout modes.
 * When Organic is selected, shows archetype picker via popover.
 *
 * KISS: Focused component < 150 lines
 * SOLID-S: Toggle + popover rendering only
 */

import React, { useState, useRef } from 'react';
import { Layout, Sparkles, ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ArchetypeGallery } from '@/components/shared/ArchetypeGallery';

export interface ViewModeToggleProps {
  viewMode: 'standard' | 'wabi-sabi';
  onSetViewMode: (mode: 'standard' | 'wabi-sabi') => void;
  activeArchetype: string;
  onSetArchetype: (archetype: string) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onSetViewMode,
  activeArchetype,
  onSetArchetype,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, () => setIsPopoverOpen(false), isPopoverOpen);

  const isOrganic = viewMode === 'wabi-sabi';

  const handleStructuredClick = () => {
    onSetViewMode('standard');
    setIsPopoverOpen(false);
  };

  const handleOrganicClick = () => {
    onSetViewMode('wabi-sabi');
  };

  const handleArchetypeClick = () => {
    if (isOrganic) {
      setIsPopoverOpen(!isPopoverOpen);
    }
  };

  const handleArchetypeSelect = (archetype: string) => {
    onSetArchetype(archetype);
    setIsPopoverOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Segmented Control */}
      <div className="flex items-center bg-[#EDF5F0] border border-[#D4E5D4] rounded-lg p-0.5">
        {/* Structured Button */}
        <button
          onClick={handleStructuredClick}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium
            transition-all duration-150
            ${!isOrganic
              ? 'bg-white text-[#1E2E1E] shadow-sm'
              : 'text-[#8FA58F] hover:text-[#4A5D4A]'
            }
          `}
        >
          <Layout className="w-4 h-4" />
          <span className="hidden sm:inline">Structured</span>
        </button>

        {/* Organic Button + Archetype Picker */}
        <button
          onClick={isOrganic ? handleArchetypeClick : handleOrganicClick}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium
            transition-all duration-150
            ${isOrganic
              ? 'bg-white text-[#1E2E1E] shadow-sm'
              : 'text-[#8FA58F] hover:text-[#4A5D4A]'
            }
          `}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Organic</span>
          {isOrganic && (
            <>
              <span className="hidden md:inline text-[#8FA58F] mx-0.5">·</span>
              <span className="hidden md:inline text-[#6B8E6B] max-w-[100px] truncate">
                {activeArchetype}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8FA58F] transition-transform ${isPopoverOpen ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>
      </div>

      {/* Archetype Popover */}
      {isPopoverOpen && (
        <div className="absolute top-full left-0 mt-2 w-[360px] sm:w-[420px] bg-white border border-[#D4E5D4] rounded-lg shadow-2xl z-[600] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <ArchetypeGallery
            selectedArchetype={activeArchetype}
            onSelect={handleArchetypeSelect}
            onClose={() => setIsPopoverOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
