import React, { useState } from 'react';
import { Sparkles, Lightbulb, ChevronDown, Globe, Video, Wand2, Upload, ArrowRight } from 'lucide-react';
import { DeckRecipe } from '@/types/ideation';

interface FeatureCardsProps {
  onCreateNew: () => void;
  onIdeate?: () => void;
  onOpenSources?: (preset: 'video' | 'web' | 'mixed', recipe: DeckRecipe) => void;
  onBeautify?: () => void;
  onImport: () => void;
  onOpenRecipeSelector: (preset: 'video' | 'web' | 'mixed') => void;
}

/**
 * Primary CTA Card - Large, prominent entry points
 */
interface PrimaryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

const PrimaryCard: React.FC<PrimaryCardProps> = ({
  icon,
  title,
  subtitle,
  description,
  onClick,
  variant,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col p-8 text-left
        rounded-lg border transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        focus-visible:ring-2 focus-visible:ring-[#6B8E6B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5FAF7]
        ${isPrimary
          ? 'bg-gradient-to-br from-[#6B8E6B]/15 to-[#6B8E6B]/5 border-[#6B8E6B]/30 hover:border-[#6B8E6B]/60 hover:from-[#6B8E6B]/20 hover:to-[#6B8E6B]/10'
          : 'bg-white border-[#D4E5D4] hover:border-[#6B8E6B]/40 hover:bg-[#F5FAF7]'
        }
      `}
    >
      {/* Icon */}
      <div className={`
        w-14 h-14 rounded-lg flex items-center justify-center mb-6
        transition-all duration-300
        ${isPrimary
          ? 'bg-[#6B8E6B]/20 group-hover:bg-[#6B8E6B]/30'
          : 'bg-[#6B8E6B]/10 group-hover:bg-[#6B8E6B]/15'
        }
      `}>
        <span className={`
          transition-colors duration-300
          ${isPrimary ? 'text-[#6B8E6B]' : 'text-[#8FA58F] group-hover:text-[#6B8E6B]'}
        `}>
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-[#1E2E1E] mb-1 tracking-tight">
          {title}
        </h3>
        <p className={`text-sm mb-3 ${isPrimary ? 'text-[#6B8E6B]' : 'text-[#8FA58F]'}`}>
          {subtitle}
        </p>
        <p className="text-sm text-[#8FA58F] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className={`
        mt-6 flex items-center gap-2 text-sm font-medium
        transition-all duration-300
        ${isPrimary
          ? 'text-[#6B8E6B] group-hover:text-[#5A7A5A]'
          : 'text-[#8FA58F] group-hover:text-[#6B8E6B]'
        }
      `}>
        <span>Get started</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </button>
  );
};

/**
 * Secondary option item - Compact, in collapsible section
 */
interface SecondaryOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SecondaryOption: React.FC<SecondaryOptionProps> = ({
  icon,
  title,
  description,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="
      group flex items-center gap-4 p-4 w-full text-left
      bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg
      hover:bg-[#EDF5F0] hover:border-[#6B8E6B]/30
      transition-all duration-200 ease-out
      focus-visible:ring-2 focus-visible:ring-[#6B8E6B]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5FAF7]
    "
  >
    <div className="w-10 h-10 rounded-lg bg-[#6B8E6B]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6B8E6B]/15 transition-colors duration-200">
      <span className="text-[#8FA58F] group-hover:text-[#6B8E6B] transition-colors duration-200">
        {icon}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-[#1E2E1E] group-hover:text-[#6B8E6B] transition-colors duration-200">
        {title}
      </h4>
      <p className="text-xs text-[#8FA58F] truncate">
        {description}
      </p>
    </div>
    <ArrowRight className="w-4 h-4 text-[#8FA58F] group-hover:text-[#6B8E6B] transform group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
  </button>
);

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onCreateNew,
  onIdeate,
  onOpenRecipeSelector,
  onBeautify,
  onImport,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="mb-10">
      {/* Section header */}
      <h2 className="text-sm font-medium text-[#8FA58F] mb-6">
        What would you like to create?
      </h2>

      {/* Primary CTAs - 2 large cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PrimaryCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Quick Start"
          subtitle="I know what I want"
          description="Enter your topic and AI will generate a polished presentation with smart defaults for theme, layout, and styling."
          onClick={onCreateNew}
          variant="primary"
        />

        {onIdeate && (
          <PrimaryCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Guided Journey"
            subtitle="Help me explore ideas"
            description="Brainstorm and structure your thoughts before building. Perfect for when you need to develop your concept first."
            onClick={onIdeate}
            variant="secondary"
          />
        )}
      </div>

      {/* More options - Collapsible */}
      <div className="border border-[#D4E5D4] rounded-lg overflow-hidden bg-[#F5FAF7]">
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="
            w-full flex items-center justify-between px-5 py-4
            text-sm font-medium text-[#8FA58F] hover:text-[#4A5D4A]
            hover:bg-[#EDF5F0] transition-all duration-200
          "
        >
          <span>More ways to create</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMoreOpen && (
          <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <SecondaryOption
              icon={<Globe className="w-5 h-5" />}
              title="From Research"
              description="Generate from web research"
              onClick={() => onOpenRecipeSelector('web')}
            />
            <SecondaryOption
              icon={<Video className="w-5 h-5" />}
              title="From Video"
              description="Transform YouTube videos"
              onClick={() => onOpenRecipeSelector('video')}
            />
            {onBeautify && (
              <SecondaryOption
                icon={<Wand2 className="w-5 h-5" />}
                title="Beautify"
                description="Redesign existing PPTX"
                onClick={onBeautify}
              />
            )}
            <SecondaryOption
              icon={<Upload className="w-5 h-5" />}
              title="Import"
              description="Load DeckSnap file"
              onClick={onImport}
            />
          </div>
        )}
      </div>
    </div>
  );
};
