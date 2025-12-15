/**
 * ToolbarDropdown
 *
 * Shared dropdown component for toolbar with preview support.
 *
 * KISS: Reusable dropdown < 100 lines
 * SOLID-S: Only handles dropdown UI
 * DRY: Used by Layout and Alignment dropdowns
 */

import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: LucideIcon;
  preview?: React.ReactNode;
}

interface ToolbarDropdownProps {
  label: string;
  icon: LucideIcon;
  options: DropdownOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onHover?: (id: string | null) => void;
  showPreviews?: boolean;
  className?: string;
}

export const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  label,
  icon: Icon,
  options,
  selectedId,
  onSelect,
  onHover,
  showPreviews = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click - using extracted hook (KISS)
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onHover?.(null);
  }, [onHover]);

  useClickOutside(dropdownRef, handleClose, isOpen);

  const selectedOption = options.find(o => o.id === selectedId);
  const hoveredOption = options.find(o => o.id === hoveredId);

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    onHover?.(id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    onHover?.(null);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 border border-[#D4E5D4] rounded-md text-xs text-[#4A5D4A] hover:border-[#6B8E6B]/50 hover:bg-white transition-all duration-150"
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="font-medium">{selectedOption?.label || label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 flex gap-2 z-50">
          {/* Options list */}
          <div className="min-w-[160px] bg-white border border-[#D4E5D4] rounded-lg shadow-lg py-1">
            {options.map(option => {
              const OptionIcon = option.icon;
              const isSelected = option.id === selectedId;
              const isHovered = option.id === hoveredId;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => handleMouseEnter(option.id)}
                  onMouseLeave={handleMouseLeave}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#6B8E6B]/10 text-[#6B8E6B] font-medium'
                      : isHovered
                        ? 'bg-[#F5FAF7] text-[#4A5D4A]'
                        : 'text-[#4A5D4A] hover:bg-[#F5FAF7]'
                  }`}
                >
                  {OptionIcon && <OptionIcon className="w-4 h-4" />}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Preview panel */}
          {showPreviews && hoveredOption?.preview && (
            <div className="w-40 h-28 bg-white border border-[#D4E5D4] rounded-lg shadow-lg p-2 overflow-hidden transition-all duration-150 animate-in fade-in slide-in-from-left-2">
              <div className="w-full h-full flex items-center justify-center">
                {hoveredOption.preview}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
