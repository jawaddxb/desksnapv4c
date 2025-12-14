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
        focus-visible:ring-2 focus-visible:ring-[#c5a47e]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]
        ${isPrimary
          ? 'bg-gradient-to-br from-[#c5a47e]/20 to-[#c5a47e]/5 border-[#c5a47e]/30 hover:border-[#c5a47e]/60 hover:from-[#c5a47e]/25 hover:to-[#c5a47e]/10'
          : 'bg-[#171717] border-white/8 hover:border-[#c5a47e]/30 hover:bg-[#1f1f1f]'
        }
      `}
    >
      {/* Icon */}
      <div className={`
        w-14 h-14 rounded-lg flex items-center justify-center mb-6
        transition-all duration-300
        ${isPrimary
          ? 'bg-[#c5a47e]/20 group-hover:bg-[#c5a47e]/30'
          : 'bg-white/5 group-hover:bg-white/10'
        }
      `}>
        <span className={`
          transition-colors duration-300
          ${isPrimary ? 'text-[#c5a47e]' : 'text-white/60 group-hover:text-white'}
        `}>
          {icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-1 tracking-tight">
          {title}
        </h3>
        <p className={`text-sm mb-3 ${isPrimary ? 'text-[#c5a47e]/80' : 'text-white/45'}`}>
          {subtitle}
        </p>
        <p className="text-sm text-white/50 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className={`
        mt-6 flex items-center gap-2 text-sm font-medium
        transition-all duration-300
        ${isPrimary
          ? 'text-[#c5a47e] group-hover:text-[#d4b68e]'
          : 'text-white/40 group-hover:text-[#c5a47e]'
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
      bg-[#141414] border border-white/5 rounded-lg
      hover:bg-[#1a1a1a] hover:border-[#c5a47e]/20
      transition-all duration-200 ease-out
      focus-visible:ring-2 focus-visible:ring-[#c5a47e]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]
    "
  >
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white/8 transition-colors duration-200">
      <span className="text-white/50 group-hover:text-white/70 transition-colors duration-200">
        {icon}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-medium text-white group-hover:text-[#c5a47e] transition-colors duration-200">
        {title}
      </h4>
      <p className="text-xs text-white/40 truncate">
        {description}
      </p>
    </div>
    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#c5a47e]/60 transform group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
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
      <h2 className="text-sm font-medium text-white/40 mb-6">
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
      <div className="border border-white/5 rounded-lg overflow-hidden bg-[#0d0d0d]">
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className="
            w-full flex items-center justify-between px-5 py-4
            text-sm font-medium text-white/50 hover:text-white/70
            hover:bg-white/2 transition-all duration-200
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
