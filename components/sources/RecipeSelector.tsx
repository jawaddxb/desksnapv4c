/**
 * RecipeSelector Component
 *
 * A modal that lets users choose a deck recipe type before entering VideoDeck or Research mode.
 * Each recipe has different column categories optimized for its narrative structure.
 */

import React from 'react';
import { DeckRecipe } from '@/types/ideation';
import { X, Target, MessageCircle, FileText, Presentation } from 'lucide-react';

interface RecipeSelectorProps {
  isOpen: boolean;
  onSelect: (recipe: DeckRecipe) => void;
  onClose: () => void;
  preset: 'video' | 'web' | 'mixed';
}

const RECIPE_OPTIONS: Array<{
  id: DeckRecipe;
  title: string;
  description: string;
  columns: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    id: 'training',
    title: 'Training Deck',
    description: 'Teach concepts with clear learning objectives, examples, and practice exercises',
    columns: 'Objective → Concept → Example → Practice → Review',
    icon: <Target className="w-5 h-5" />,
    color: 'border-green-500/50 hover:border-green-500',
  },
  {
    id: 'explainer',
    title: 'Explainer Deck',
    description: 'Break down complex topics into What, Why, and How with clear examples',
    columns: 'What → Why → How → Examples → Summary',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'border-blue-500/50 hover:border-blue-500',
  },
  {
    id: 'brief',
    title: 'Executive Brief',
    description: 'Summarize key points with analysis and actionable implications',
    columns: 'Context → Key Points → Analysis → Implications → Actions',
    icon: <FileText className="w-5 h-5" />,
    color: 'border-purple-500/50 hover:border-purple-500',
  },
  {
    id: 'pitch',
    title: 'Pitch Deck',
    description: 'Persuade with a compelling narrative from hook to call-to-action',
    columns: 'Hook → Problem → Solution → Proof → CTA',
    icon: <Presentation className="w-5 h-5" />,
    color: 'border-[#6B8E6B]/50 hover:border-[#6B8E6B]',
  },
];

export const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  isOpen,
  onSelect,
  onClose,
  preset,
}) => {
  if (!isOpen) return null;

  const presetLabel = preset === 'video' ? 'VideoDeck' : preset === 'web' ? 'Research' : 'Sources';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white border border-[#D4E5D4] w-full max-w-2xl mx-4 shadow-2xl rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4E5D4]">
          <div>
            <h2 className="text-xl font-bold text-[#1E2E1E] uppercase tracking-wide">
              Choose Deck Type
            </h2>
            <p className="text-sm text-[#8FA58F] mt-1">
              Select how you want your {presetLabel} content organized
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recipe options */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECIPE_OPTIONS.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => onSelect(recipe.id)}
              className={`
                text-left p-5 bg-[#F5FAF7] border transition-all duration-150
                hover:bg-[#EDF5F0] group rounded-lg
                ${recipe.color}
              `}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white text-[#8FA58F] group-hover:text-[#6B8E6B] transition-colors rounded-lg">
                  {recipe.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1E2E1E] group-hover:text-[#6B8E6B] transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-[#4A5D4A] mt-1 mb-3">
                    {recipe.description}
                  </p>
                  <div className="text-[10px] text-[#8FA58F] uppercase tracking-wider font-mono">
                    {recipe.columns}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-6">
          <p className="text-xs text-[#8FA58F] text-center">
            You can always manually reorganize notes after extraction
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeSelector;
