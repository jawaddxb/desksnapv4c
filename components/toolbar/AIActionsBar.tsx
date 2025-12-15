/**
 * AIActionsBar
 *
 * Persistent bar with visible AI quick actions.
 * Shows [Expand] [Simplify] [Regenerate Image] actions prominently.
 *
 * KISS: Just buttons + loading states, < 60 lines
 * SOLID-S: Only handles AI action triggers
 * DRY: Delegates to callbacks, no duplicate logic
 */

import React from 'react';
import { Maximize2, Minimize2, RefreshCw, Loader2 } from 'lucide-react';

interface AIActionsBarProps {
  onExpand: () => void;
  onSimplify: () => void;
  onRegenerateImage: () => void;
  isRefining?: boolean;
  isGeneratingImage?: boolean;
}

export const AIActionsBar: React.FC<AIActionsBarProps> = ({
  onExpand,
  onSimplify,
  onRegenerateImage,
  isRefining = false,
  isGeneratingImage = false,
}) => {
  const isLoading = isRefining || isGeneratingImage;

  const ActionButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    loading?: boolean;
  }> = ({ onClick, icon, label, loading }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
        isLoading
          ? 'bg-[#D4E5D4] text-[#8FA58F] cursor-not-allowed'
          : 'bg-white/90 border border-[#D4E5D4] text-[#4A5D4A] hover:border-[#6B8E6B]/50 hover:text-[#6B8E6B] hover:bg-white'
      }`}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#F5FAF7]/80 backdrop-blur-sm border-t border-[#D4E5D4]">
      <span className="text-[10px] font-medium text-[#8FA58F] uppercase tracking-wider mr-1">
        AI
      </span>
      <ActionButton
        onClick={onExpand}
        icon={<Maximize2 className="w-3.5 h-3.5" />}
        label="Expand"
        loading={isRefining}
      />
      <ActionButton
        onClick={onSimplify}
        icon={<Minimize2 className="w-3.5 h-3.5" />}
        label="Simplify"
        loading={isRefining}
      />
      <ActionButton
        onClick={onRegenerateImage}
        icon={<RefreshCw className="w-3.5 h-3.5" />}
        label="Regen Image"
        loading={isGeneratingImage}
      />
    </div>
  );
};
