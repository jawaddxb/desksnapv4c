/**
 * TextRefinementPopover
 *
 * Selection-based AI text refinement options.
 * Shows when text is focused, providing quick tone/content adjustments.
 *
 * KISS: Simple floating menu, < 100 lines
 * SOLID-S: Only handles text refinement UI
 * DRY: Delegates to useContentRefinement hook
 */

import React from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  MessageSquare,
  Briefcase,
  Coffee,
  Code,
  Target,
  Crown,
  Loader2,
} from 'lucide-react';
import { ToneType, ContentRefinementType } from '@/types';

export interface TextRefinementPopoverProps {
  onRefineContent: (type: 'tone' | 'content', subType: string) => void;
  isRefining?: boolean;
  className?: string;
}

// DRY: Extracted button styling constants
const BUTTON_BASE = 'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors';
const BUTTON_DISABLED = 'text-[#8FA58F] cursor-not-allowed';
const BUTTON_ENABLED = 'text-[#4A5D4A] hover:bg-[#EDF5F0] hover:text-[#6B8E6B]';

const getButtonClass = (isRefining: boolean) =>
  `${BUTTON_BASE} ${isRefining ? BUTTON_DISABLED : BUTTON_ENABLED}`;

const QUICK_ACTIONS: {
  type: 'content';
  subType: ContentRefinementType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: 'content', subType: 'expand', label: 'Expand', icon: <Maximize2 className="w-3.5 h-3.5" /> },
  { type: 'content', subType: 'simplify', label: 'Simplify', icon: <Minimize2 className="w-3.5 h-3.5" /> },
  { type: 'content', subType: 'clarify', label: 'Clarify', icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

const TONE_OPTIONS: {
  tone: ToneType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { tone: 'professional', label: 'Professional', icon: <Briefcase className="w-3 h-3" /> },
  { tone: 'casual', label: 'Casual', icon: <Coffee className="w-3 h-3" /> },
  { tone: 'technical', label: 'Technical', icon: <Code className="w-3 h-3" /> },
  { tone: 'persuasive', label: 'Persuasive', icon: <Target className="w-3 h-3" /> },
  { tone: 'executive', label: 'Executive', icon: <Crown className="w-3 h-3" /> },
];

export const TextRefinementPopover: React.FC<TextRefinementPopoverProps> = ({
  onRefineContent,
  isRefining = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 p-1.5 bg-white rounded-lg border border-[#D4E5D4] shadow-lg ${className}`}>
      {/* AI Label */}
      <div className="flex items-center gap-1 px-2 text-[10px] font-medium text-[#6B8E6B] uppercase tracking-wider">
        <Sparkles className="w-3 h-3" />
        <span>AI</span>
      </div>

      <div className="w-px h-5 bg-[#D4E5D4]" />

      {/* Quick Actions */}
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.subType}
          onClick={() => onRefineContent(action.type, action.subType)}
          disabled={isRefining}
          className={getButtonClass(isRefining)}
          title={action.label}
        >
          {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : action.icon}
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}

      <div className="w-px h-5 bg-[#D4E5D4]" />

      {/* Tone Dropdown */}
      <div className="relative group">
        <button
          disabled={isRefining}
          className={getButtonClass(isRefining)}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tone</span>
        </button>

        {/* Dropdown */}
        <div className="absolute top-full left-0 mt-1 py-1 bg-white rounded-lg border border-[#D4E5D4] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[140px]">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.tone}
              onClick={() => onRefineContent('tone', option.tone)}
              disabled={isRefining}
              className={`w-full gap-2 px-3 py-1.5 ${getButtonClass(isRefining)}`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
