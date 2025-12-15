/**
 * AgentTeamPanel Component
 *
 * Displays the team of AI agents during presentation generation.
 * Shows real-time status updates for each agent.
 *
 * Follows existing patterns from AgentActivityPanel.
 */

import React from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useAgentTeam } from '@/contexts/AgentActivityContext';
import { AGENT_TEAM, AgentId, getAgentConfig } from '@/types/agents';
import { AgentAvatar } from './AgentAvatar';

interface AgentTeamPanelProps {
  /** Compact mode shows only avatars */
  compact?: boolean;
  /** Optional class name */
  className?: string;
}

export const AgentTeamPanel: React.FC<AgentTeamPanelProps> = ({
  compact = false,
  className = '',
}) => {
  const { team, activeAgentId, isTeamActive } = useAgentTeam();
  const [isExpanded, setIsExpanded] = React.useState(!compact);

  // Don't render if team is not active
  if (!isTeamActive) return null;

  // Calculate completion stats
  const agents = Array.from(team.values());
  const completedCount = agents.filter(a => a.status === 'done').length;
  const totalCount = agents.length;
  const activeAgent = activeAgentId ? team.get(activeAgentId) : null;
  const activeConfig = activeAgentId ? getAgentConfig(activeAgentId) : null;

  // Overall progress (rough estimate based on agent sequence)
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={`
        bg-white border border-[#D4E5D4] rounded-lg shadow-sm
        overflow-hidden transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#F5FAF7]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#6B8E6B]/10 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-[#6B8E6B]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#1E2E1E]">Your Team is Working</h3>
            <p className="text-[10px] text-[#8FA58F]">
              {completedCount === totalCount
                ? 'All agents complete!'
                : `${completedCount} of ${totalCount} agents done`}
            </p>
          </div>
        </div>

        {!compact && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-[#EDF5F0] rounded-md transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#8FA58F]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8FA58F]" />
            )}
          </button>
        )}
      </div>

      {/* Agent Avatars Row */}
      <div className="px-4 py-3 flex items-center justify-center gap-3">
        {AGENT_TEAM.map(config => {
          const member = team.get(config.id);
          return (
            <AgentAvatar
              key={config.id}
              config={config}
              status={member?.status ?? 'idle'}
              size="md"
              showLabel={isExpanded}
            />
          );
        })}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Current Activity */}
          {activeAgent && activeConfig && (
            <div className="px-4 py-3 border-t border-[#D4E5D4] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: activeConfig.color }}
                />
                <span className="text-xs font-medium text-[#4A5D4A]">
                  {activeConfig.name} is working...
                </span>
              </div>
              {activeAgent.message && (
                <p className="text-xs text-[#6B8E6B] pl-4">
                  "{activeAgent.message}"
                </p>
              )}
            </div>
          )}

          {/* Progress Bar */}
          <div className="px-4 py-3 border-t border-[#D4E5D4]">
            <div className="h-1.5 bg-[#D4E5D4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6B8E6B] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-[#8FA58F] mt-1.5 text-center">
              {progress}% complete
            </p>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Compact version for inline display (e.g., in chat)
 */
export const AgentTeamPanelCompact: React.FC<{ className?: string }> = ({ className }) => {
  return <AgentTeamPanel compact className={className} />;
};

export default AgentTeamPanel;
