/**
 * ContentTypeSelector Component
 *
 * A dropdown selector for choosing content display type (bullets, numbered, checkmarks, etc.)
 *
 * DRY: Uses useClickOutside hook for click-outside detection
 */

import React, { useState, useRef, useCallback } from 'react';
import { List, ListOrdered, CheckSquare, Quote, Type, ChevronDown } from 'lucide-react';
import type { ContentType } from '@/types';
import { useClickOutside } from '@/hooks/useClickOutside';

interface ContentTypeSelectorProps {
  /** Current content type */
  currentType: ContentType;
  /** Callback when type changes */
  onChange: (type: ContentType) => void;
  /** Callback when mouse enters (for toolbar label) */
  onHoverStart?: (label: string) => void;
  /** Callback when mouse leaves */
  onHoverEnd?: () => void;
}

const CONTENT_TYPE_OPTIONS: {
  value: ContentType;
  icon: typeof List;
  label: string;
  description: string;
}[] = [
  { value: 'bullets', icon: List, label: 'Bullets', description: 'Standard bullet points' },
  { value: 'numbered', icon: ListOrdered, label: 'Numbered', description: 'Auto-numbered list' },
  { value: 'checkmarks', icon: CheckSquare, label: 'Checkmarks', description: 'Checklist style' },
  { value: 'quotes', icon: Quote, label: 'Quotes', description: 'Quote/callout style' },
  { value: 'plain', icon: Type, label: 'Plain', description: 'No bullet markers' },
];

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  currentType,
  onChange,
  onHoverStart,
  onHoverEnd,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current option
  const currentOption = CONTENT_TYPE_OPTIONS.find(opt => opt.value === currentType) || CONTENT_TYPE_OPTIONS[0];
  const CurrentIcon = currentOption.icon;

  // DRY: Use shared hook for click-outside detection
  const handleClose = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, handleClose, isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => onHoverStart?.('Content Type')}
        onMouseLeave={onHoverEnd}
        className={`
          relative group flex items-center gap-1 px-2 h-9 rounded-lg transition-all duration-200
          ${isOpen
            ? 'bg-[#6B8E6B] text-white shadow-md'
            : 'hover:bg-[#EDF5F0] text-[#8FA58F] hover:text-[#1E2E1E]'
          }
        `}
      >
        <CurrentIcon className="w-4 h-4" strokeWidth={2} />
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl border border-[#D4E5D4] py-1 min-w-[180px] z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[#8FA58F] uppercase tracking-wider">
            Content Type
          </div>
          {CONTENT_TYPE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = currentType === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full px-3 py-2 text-left transition-colors
                  ${isActive
                    ? 'bg-[#EDF5F0] text-[#1E2E1E]'
                    : 'text-[#4A5D4A] hover:bg-[#F5FAF7] hover:text-[#1E2E1E]'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#6B8E6B]' : ''}`} strokeWidth={2} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-[10px] text-[#8FA58F] truncate">{option.description}</div>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E6B]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector;
