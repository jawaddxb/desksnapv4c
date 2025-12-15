/**
 * CreateTopicInput
 *
 * Topic input for creating presentations.
 * Reuses patterns from ChatInterface input area.
 *
 * KISS: Focused input component < 70 lines
 * SOLID-S: Only handles topic input and submission
 * SOLID-D: Uses ChatUIContext for generation settings
 * DRY: Uses shared useSmartDefaults hook
 */

import React from 'react';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { useChatUI } from '@/contexts/ChatUIContext';
import { useSmartDefaults } from '@/hooks/useSmartDefaults';
import { getThemeDisplayName } from '@/lib/smartDefaults';

interface CreateTopicInputProps {
  onSubmit: (topic: string) => void;
  isGenerating: boolean;
  placeholder?: string;
}

export const CreateTopicInput: React.FC<CreateTopicInputProps> = ({
  onSubmit,
  isGenerating,
  placeholder = "What's your presentation about?",
}) => {
  const { inputValue, setInputValue, setGenerationMode } = useChatUI();

  // DRY: Use shared smart defaults hook
  const { smartDefaults, hasConfidentDefaults } = useSmartDefaults(inputValue, {
    onModeChange: setGenerationMode,
  });

  const handleSubmit = () => {
    if (inputValue.trim() && !isGenerating) {
      onSubmit(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart defaults indicator */}
      {hasConfidentDefaults && smartDefaults && (
        <div className="p-3 bg-[#6B8E6B]/5 border border-[#6B8E6B]/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6B8E6B]" />
            <span className="text-xs text-[#4A5D4A]">
              AI suggests: {getThemeDisplayName(smartDefaults.themeId)} theme, {smartDefaults.density} content
            </span>
          </div>
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isGenerating}
          autoFocus
          className="w-full bg-white border border-[#D4E5D4] rounded-lg py-4 pl-4 pr-14 text-base focus:outline-none focus:border-[#6B8E6B] focus:ring-2 focus:ring-[#6B8E6B]/20 transition-all duration-200 placeholder-[#8FA58F] text-[#1E2E1E]"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isGenerating}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#6B8E6B] rounded-lg hover:bg-[#5A7A5A] disabled:opacity-30 disabled:bg-[#D4E5D4] transition-all duration-200"
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 text-white animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-[#8FA58F] text-center">
        Press Enter to generate. AI will select the best theme and layout automatically.
      </p>
    </div>
  );
};
