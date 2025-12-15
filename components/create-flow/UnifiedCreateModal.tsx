/**
 * UnifiedCreateModal
 *
 * Consolidated entry point for creating presentations.
 * Replaces WelcomeModal + FeatureCards + ChatInterface initial state.
 *
 * KISS: < 100 lines, delegates to child components
 * SOLID-S: Shell component - only handles modal UI and tab state
 * SOLID-D: Uses ChatUIContext for state, not internal state
 */

import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, Globe } from 'lucide-react';
import { CreateTopicInput } from './CreateTopicInput';
import { CreateTabNav, CreateTab } from './CreateTabNav';
import { DraftPreviewCards, PreviewSlide } from './DraftPreviewCards';

interface UnifiedCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeck: (topic: string) => void;
  onIdeate?: () => void;
  onOpenSources?: () => void;
  isGenerating?: boolean;
  previewSlides?: PreviewSlide[];
}

const TABS: CreateTab[] = [
  { id: 'quick', label: 'Quick Start', icon: Sparkles, description: 'Enter topic, get slides' },
  { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb, description: 'Structure ideas first' },
  { id: 'sources', label: 'From Content', icon: Globe, description: 'Transform existing content' },
];

export const UnifiedCreateModal: React.FC<UnifiedCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateDeck,
  onIdeate,
  onOpenSources,
  isGenerating = false,
  previewSlides = [],
}) => {
  const [activeTab, setActiveTab] = useState<string>('quick');

  if (!isOpen) return null;

  const handleTabAction = (tabId: string) => {
    if (tabId === 'brainstorm' && onIdeate) {
      onIdeate();
      onClose();
    } else if (tabId === 'sources' && onOpenSources) {
      onOpenSources();
      onClose();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2E1E]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-white border border-[#D4E5D4] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded-md transition-all duration-150 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-[#D4E5D4]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#6B8E6B]" />
            <span className="text-lg font-bold text-[#1E2E1E]">Create Presentation</span>
          </div>
          <p className="text-sm text-[#8FA58F]">
            Describe your topic and AI will create your slides
          </p>
        </div>

        {/* Tab navigation */}
        <CreateTabNav
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabAction}
        />

        {/* Content area */}
        <div className="p-6">
          {activeTab === 'quick' && (
            <div className="space-y-6">
              <CreateTopicInput
                onSubmit={onCreateDeck}
                isGenerating={isGenerating}
                placeholder="What's your presentation about?"
              />

              {/* Inline preview during/after generation */}
              <DraftPreviewCards
                slides={previewSlides}
                isGenerating={isGenerating}
                maxDisplay={3}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
