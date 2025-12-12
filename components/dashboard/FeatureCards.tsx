import React from 'react';
import { Plus, Lightbulb, Globe, Video, Wand2, Upload, ArrowRight } from 'lucide-react';
import { DeckRecipe } from '../../types/ideation';

interface FeatureCardsProps {
  onCreateNew: () => void;
  onIdeate?: () => void;
  onOpenSources?: (preset: 'video' | 'web' | 'mixed', recipe: DeckRecipe) => void;
  onBeautify?: () => void;
  onImport: () => void;
  onOpenRecipeSelector: (preset: 'video' | 'web' | 'mixed') => void;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  variant?: 'primary' | 'accent' | 'red' | 'blue' | 'purple' | 'muted';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onClick,
  variant = 'muted',
}) => {
  const variantStyles = {
    primary: {
      border: 'border-white/20 hover:border-white',
      bg: 'hover:bg-white/5',
      iconBg: 'bg-white/10 group-hover:bg-white',
      iconColor: 'text-white group-hover:text-black',
      arrowColor: 'text-white/40 group-hover:text-[#c5a47e]',
    },
    accent: {
      border: 'border-[#c5a47e]/30 hover:border-[#c5a47e]',
      bg: 'hover:bg-[#c5a47e]/5',
      iconBg: 'bg-[#c5a47e]/20 group-hover:bg-[#c5a47e]',
      iconColor: 'text-[#c5a47e] group-hover:text-black',
      arrowColor: 'text-[#c5a47e]/70 group-hover:text-[#c5a47e]',
    },
    red: {
      border: 'border-red-500/30 hover:border-red-400',
      bg: 'hover:bg-red-500/5',
      iconBg: 'bg-red-500/20 group-hover:bg-red-400',
      iconColor: 'text-red-400 group-hover:text-black',
      arrowColor: 'text-red-400/70 group-hover:text-red-400',
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-400',
      bg: 'hover:bg-blue-500/5',
      iconBg: 'bg-blue-500/20 group-hover:bg-blue-400',
      iconColor: 'text-blue-400 group-hover:text-black',
      arrowColor: 'text-blue-400/70 group-hover:text-blue-400',
    },
    purple: {
      border: 'border-purple-500/30 hover:border-purple-400',
      bg: 'hover:bg-purple-500/5',
      iconBg: 'bg-purple-500/20 group-hover:bg-purple-400',
      iconColor: 'text-purple-400 group-hover:text-black',
      arrowColor: 'text-purple-400/70 group-hover:text-purple-400',
    },
    muted: {
      border: 'border-white/10 hover:border-white/30',
      bg: 'hover:bg-white/5',
      iconBg: 'bg-white/5 group-hover:bg-white/10',
      iconColor: 'text-white/60 group-hover:text-white',
      arrowColor: 'text-white/30 group-hover:text-white/60',
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={`group p-5 bg-[#0a0a0a] border ${styles.border} ${styles.bg} text-left transition-all duration-200 flex flex-col h-full`}
    >
      <div className={`w-10 h-10 ${styles.iconBg} flex items-center justify-center mb-3 transition-all duration-200`}>
        <span className={`${styles.iconColor} transition-colors duration-200`}>
          {icon}
        </span>
      </div>
      <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-white/50 text-xs flex-1 mb-3 leading-relaxed">
        {description}
      </p>
      <span className={`flex items-center gap-1 ${styles.arrowColor} text-xs font-medium transition-colors duration-200`}>
        <ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
};

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onCreateNew,
  onIdeate,
  onOpenRecipeSelector,
  onBeautify,
  onImport,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
        Create Something New
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Primary: New Deck */}
        <FeatureCard
          icon={<Plus className="w-5 h-5" />}
          title="New Deck"
          description="Create a presentation from scratch with AI assistance"
          onClick={onCreateNew}
          variant="primary"
        />

        {/* Accent: Ideate */}
        {onIdeate && (
          <FeatureCard
            icon={<Lightbulb className="w-5 h-5" />}
            title="Ideate"
            description="Brainstorm and structure ideas before building slides"
            onClick={onIdeate}
            variant="accent"
          />
        )}

        {/* Blue: Research */}
        <FeatureCard
          icon={<Globe className="w-5 h-5" />}
          title="Research"
          description="Generate a deck from web research on any topic"
          onClick={() => onOpenRecipeSelector('web')}
          variant="blue"
        />

        {/* Red: VideoDeck */}
        <FeatureCard
          icon={<Video className="w-5 h-5" />}
          title="VideoDeck"
          description="Transform YouTube videos into slide presentations"
          onClick={() => onOpenRecipeSelector('video')}
          variant="red"
        />

        {/* Purple: Beautify */}
        {onBeautify && (
          <FeatureCard
            icon={<Wand2 className="w-5 h-5" />}
            title="Beautify"
            description="Upload a PPTX and let AI redesign it beautifully"
            onClick={onBeautify}
            variant="purple"
          />
        )}

        {/* Muted: Import */}
        <FeatureCard
          icon={<Upload className="w-5 h-5" />}
          title="Import"
          description="Load a previously exported DeckSnap presentation"
          onClick={onImport}
          variant="muted"
        />
      </div>
    </div>
  );
};
