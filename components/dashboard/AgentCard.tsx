/**
 * AgentCard Component
 *
 * Displays a single agent with avatar, role, tagline, examples, and train button.
 * Used in the AgentSquadSection on the Dashboard.
 *
 * SOLID: Single responsibility - display agent info
 * DRY: Reuses AgentConfig from types/agents.ts
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AgentConfig } from '@/types/agents';

interface AgentCardProps {
  config: AgentConfig;
  role: string;
  examples: string[];
  onTrain: () => void;
  animationDelay: number;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  config,
  role,
  examples,
  onTrain,
  animationDelay,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className="
        group relative flex flex-col p-5 bg-white rounded-xl
        border-2 border-[#D4E5D4] hover:border-opacity-0
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1
        animate-fade-in-up opacity-0
      "
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Colored border on hover */}
      <div
        className="
          absolute inset-0 rounded-xl border-2 opacity-0
          group-hover:opacity-100 transition-opacity duration-300
        "
        style={{ borderColor: config.color }}
      />

      {/* Avatar with float animation */}
      <div className="relative flex justify-center mb-4">
        <div
          className="
            w-16 h-16 rounded-xl overflow-hidden
            bg-gradient-to-br from-[#F5FAF7] to-[#EDF5F0]
            group-hover:animate-float transition-transform duration-300
          "
        >
          {!imageError ? (
            <img
              src={config.avatar}
              alt={config.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: config.color }}
            >
              {config.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Name and Role */}
      <div className="text-center mb-3">
        <h3
          className="text-base font-semibold text-[#1E2E1E] mb-0.5"
          style={{ color: config.color }}
        >
          {config.name}
        </h3>
        <p className="text-xs font-medium text-[#4A5D4A] uppercase tracking-wide">
          {role}
        </p>
      </div>

      {/* Tagline */}
      <p className="text-sm text-[#8FA58F] italic text-center mb-4">
        "{config.tagline}"
      </p>

      {/* Divider */}
      <div className="h-px bg-[#D4E5D4] mb-4" />

      {/* Examples */}
      <ul className="flex-1 space-y-1.5 mb-4">
        {examples.map((example, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-[#4A5D4A]">
            <span
              className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: config.color }}
            />
            {example}
          </li>
        ))}
      </ul>

      {/* Train Button */}
      <button
        onClick={onTrain}
        className="
          flex items-center justify-center gap-2
          px-4 py-2 rounded-lg text-sm font-medium
          bg-[#F5FAF7] text-[#4A5D4A]
          hover:bg-[#EDF5F0] hover:text-[#1E2E1E]
          group-hover:ring-1 group-hover:ring-[#6B8E6B]/30
          transition-all duration-200
        "
      >
        Train
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default AgentCard;
