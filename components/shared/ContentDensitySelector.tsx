/**
 * ContentDensitySelector Component
 *
 * Visual card-based selection for content density mode.
 * Shows what each density level produces.
 *
 * Design: Studio Noir style with gold accents.
 */

import React from 'react';
import { FileText, List, BookOpen } from 'lucide-react';
import { ContentDensity, DENSITY_CONFIGS } from '@/lib/contentBlockPrompts';

interface ContentDensitySelectorProps {
  /** Currently selected density */
  value: ContentDensity;
  /** Called when density is changed */
  onChange: (density: ContentDensity) => void;
  /** Optional class name */
  className?: string;
}

interface DensityOption {
  id: ContentDensity;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  details: string[];
}

const DENSITY_OPTIONS: DensityOption[] = [
  {
    id: 'concise',
    label: 'Concise',
    icon: List,
    description: 'Quick overview with key points',
    details: [
      '5-8 slides',
      'Bullets, stats, quotes',
      'Brief speaker notes',
    ],
  },
  {
    id: 'detailed',
    label: 'Detailed',
    icon: FileText,
    description: 'Full presentation with depth',
    details: [
      '10-14 slides',
      '+ Paragraphs, charts',
      'Moderate speaker notes',
    ],
  },
  {
    id: 'very-detailed',
    label: 'Comprehensive',
    icon: BookOpen,
    description: 'In-depth training material',
    details: [
      '16-24 slides',
      '+ Callouts, diagrams',
      'Detailed speaker notes',
    ],
  },
];

export const ContentDensitySelector: React.FC<ContentDensitySelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-3 gap-3">
        {DENSITY_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`relative p-4 text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-[#c5a47e]/10 ring-2 ring-[#c5a47e] border-transparent'
                  : 'bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center mb-3 ${
                  isSelected ? 'bg-[#c5a47e] text-black' : 'bg-white/10 text-white/70'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-[#c5a47e]' : 'text-white'}`}>
                {option.label}
              </h4>

              {/* Description */}
              <p className="text-xs text-white/60 mb-3">{option.description}</p>

              {/* Details */}
              <ul className="space-y-1">
                {option.details.map((detail, i) => (
                  <li key={i} className="text-[10px] text-white/40 flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[#c5a47e]' : 'bg-white/30'}`} />
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#c5a47e] text-black flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Hint text */}
      <p className="text-[10px] text-white/40 text-center">
        {value === 'concise' && 'Best for quick pitches and executive summaries'}
        {value === 'detailed' && 'Recommended for most presentations'}
        {value === 'very-detailed' && 'Best for workshops, training, and documentation'}
      </p>
    </div>
  );
};

export default ContentDensitySelector;
