/**
 * AgentSquadSection Component
 *
 * Featured section on Dashboard showcasing the 5 AI agents.
 * Entry point to Train My Squad functionality.
 *
 * SOLID: Single responsibility - display agent squad
 * DRY: Reuses AGENT_TEAM, AGENT_ROLES, AGENT_EXAMPLES from types/agents.ts
 * KISS: Simple grid layout, no complex state
 */

import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { AgentId, AGENT_TEAM, AGENT_ROLES, AGENT_EXAMPLES } from '@/types/agents';
import { AgentCard } from './AgentCard';

interface AgentSquadSectionProps {
  onOpenTrainSquad: (agentId?: AgentId) => void;
}

export const AgentSquadSection: React.FC<AgentSquadSectionProps> = ({
  onOpenTrainSquad,
}) => {
  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6B8E6B]/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#6B8E6B]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1E2E1E]">My Agent Squad</h2>
            <p className="text-sm text-[#8FA58F]">
              Your AI team, ready to create amazing presentations
            </p>
          </div>
        </div>

        {/* Train My Squad Button */}
        <button
          onClick={() => onOpenTrainSquad()}
          className="
            flex items-center gap-2 px-4 py-2
            bg-[#6B8E6B] text-white rounded-lg
            hover:bg-[#5A7A5A] transition-colors duration-200
            text-sm font-medium
          "
        >
          Train My Squad
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {AGENT_TEAM.map((config, index) => (
          <AgentCard
            key={config.id}
            config={config}
            role={AGENT_ROLES[config.id]}
            examples={AGENT_EXAMPLES[config.id]}
            onTrain={() => onOpenTrainSquad(config.id)}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentSquadSection;
