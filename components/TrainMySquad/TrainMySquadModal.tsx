/**
 * TrainMySquad Modal
 *
 * Allows users to add custom plain-English instructions per agent.
 * Simple UI - select agent, see defaults, add custom steps.
 *
 * Follows existing modal patterns from the codebase.
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { AgentId, AGENT_TEAM, getAgentConfig } from '@/types/agents';
import { useAgentSteps, AGENT_DEFAULT_STEPS } from '@/hooks/useAgentSteps';
import { AgentAvatar } from '@/components/AgentTeamPanel';

interface TrainMySquadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainMySquadModal: React.FC<TrainMySquadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>('scout');
  const [newStep, setNewStep] = useState('');
  const { getAgentSteps, addStep, removeStep } = useAgentSteps();

  if (!isOpen) return null;

  const agentConfig = getAgentConfig(selectedAgent);
  const { defaultSteps, customSteps } = getAgentSteps(selectedAgent);

  const handleAddStep = () => {
    if (newStep.trim()) {
      addStep(selectedAgent, newStep);
      setNewStep('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddStep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4E5D4]">
          <h2 className="text-lg font-semibold text-[#1E2E1E]">Train My Squad</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#EDF5F0] rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-[#8FA58F]" />
          </button>
        </div>

        {/* Agent Tabs */}
        <div className="px-6 py-4 bg-[#F5FAF7] border-b border-[#D4E5D4]">
          <div className="flex items-center justify-center gap-3">
            {AGENT_TEAM.map(config => (
              <button
                key={config.id}
                onClick={() => setSelectedAgent(config.id)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                  ${selectedAgent === config.id
                    ? 'bg-white shadow-sm ring-2 ring-[#6B8E6B]'
                    : 'hover:bg-white/50'
                  }
                `}
              >
                <AgentAvatar
                  config={config}
                  status={selectedAgent === config.id ? 'working' : 'idle'}
                  size="sm"
                />
                <span className={`text-[10px] font-medium ${
                  selectedAgent === config.id ? 'text-[#1E2E1E]' : 'text-[#8FA58F]'
                }`}>
                  {config.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Agent Content */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {/* Agent Info */}
          {agentConfig && (
            <div className="mb-6">
              <h3 className="text-base font-semibold text-[#1E2E1E]">
                {agentConfig.name}
              </h3>
              <p className="text-sm text-[#8FA58F]">
                "{agentConfig.tagline}"
              </p>
            </div>
          )}

          {/* Default Steps */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-[#8FA58F] mb-2 uppercase tracking-wide">
              Default Steps
            </h4>
            <ul className="space-y-2">
              {defaultSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-[#4A5D4A]"
                >
                  <Check className="w-4 h-4 text-[#6B8E6B] flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Steps */}
          <div>
            <h4 className="text-xs font-medium text-[#8FA58F] mb-2 uppercase tracking-wide">
              Your Custom Steps
            </h4>

            {customSteps.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {customSteps.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-[#4A5D4A] bg-[#F5FAF7] px-3 py-2 rounded-lg"
                  >
                    <span className="flex-1">{step}</span>
                    <button
                      onClick={() => removeStep(selectedAgent, i)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#8FA58F] mb-4 italic">
                No custom steps yet. Add your own below.
              </p>
            )}

            {/* Add Step Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`e.g., "Find competitor analysis"`}
                className="flex-1 px-3 py-2 text-sm border border-[#D4E5D4] rounded-lg
                  focus:outline-none focus:border-[#6B8E6B] focus:ring-2 focus:ring-[#6B8E6B]/20
                  placeholder-[#8FA58F] text-[#1E2E1E]"
              />
              <button
                onClick={handleAddStep}
                disabled={!newStep.trim()}
                className="px-3 py-2 bg-[#6B8E6B] text-white rounded-lg
                  hover:bg-[#5A7A5A] disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5FAF7] border-t border-[#D4E5D4] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#4A5D4A]
              hover:bg-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainMySquadModal;
