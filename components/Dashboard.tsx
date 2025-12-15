
import React, { useRef, useState, useMemo } from 'react';
import { Presentation } from '@/types';
import { IdeationSession, DeckRecipe } from '@/types/ideation';
import { RoughDraft } from '@/types/roughDraft';
import { THEMES } from '@/config/themes';
import { WabiSabiStage } from './WabiSabiStage';
import {
  Trash2, Clock, Play, BarChart2, Copy, Filter,
  FileText, Sparkles, FileEdit, ChevronRight, Loader2
} from 'lucide-react';
import { AnalyticsModal } from './AnalyticsModal';
import { RecipeSelector } from './sources/RecipeSelector';
import { FeatureCards } from './dashboard/FeatureCards';
import { GettingStarted } from './onboarding/GettingStarted';
import { useOnboarding, OnboardingStep } from '@/hooks/useOnboarding';
import { UnifiedCreateModal } from './create-flow';

type WorkItemType = 'deck' | 'draft' | 'ideation';
type FilterType = 'all' | WorkItemType;

/** Unified work item for the combined feed */
interface WorkItem {
  id: string;
  type: WorkItemType;
  title: string;
  lastModified: number;
  slideCount?: number;
  noteCount?: number;
  data: Presentation | RoughDraft | IdeationSession;
}

interface DashboardProps {
  savedDecks: Presentation[];
  savedIdeations?: IdeationSession[];
  isLoadingIdeations?: boolean;
  savedRoughDrafts?: RoughDraft[];
  isLoadingRoughDrafts?: boolean;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClone?: (id: string) => void;
  onCreateNew: () => void;
  onCreateDeckWithTopic?: (topic: string) => Promise<void>;
  isGeneratingDeck?: boolean;
  onImport: (file: File) => void;
  onIdeate?: () => void;
  onOpenSources?: (preset: 'video' | 'web' | 'mixed', recipe: DeckRecipe) => void;
  onBeautify?: () => void;
  onLoadIdeation?: (id: string) => void;
  onDeleteIdeation?: (id: string) => void;
  onGenerateDeckFromIdeation?: (id: string) => void;
  onViewJournal?: (id: string) => void;
  onLoadRoughDraft?: (id: string) => void;
  onDeleteRoughDraft?: (id: string) => void;
  onApproveRoughDraft?: (id: string) => void;
  onOpenThemePicker?: () => void;
}

/** Type badge component */
const TypeBadge: React.FC<{ type: WorkItemType }> = ({ type }) => {
  const config = {
    deck: { label: 'Deck', icon: FileText, color: 'bg-[#EDF5F0] text-[#4A5D4A]' },
    draft: { label: 'Draft', icon: FileEdit, color: 'bg-[#6B8E6B]/20 text-[#6B8E6B]' },
    ideation: { label: 'Idea', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  };
  const { label, icon: Icon, color } = config[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

/** Work item card component */
const WorkItemCard: React.FC<{
  item: WorkItem;
  onOpen: () => void;
  onDelete: () => void;
  onClone?: () => void;
  onAction?: () => void;
  actionLabel?: string;
}> = ({ item, onOpen, onDelete, onClone, onAction, actionLabel }) => {
  const theme = item.type === 'deck'
    ? THEMES[(item.data as Presentation).themeId] || THEMES.neoBrutalist
    : THEMES.neoBrutalist;

  const coverSlide = item.type === 'deck' || item.type === 'draft'
    ? (item.data as Presentation | RoughDraft).slides?.[0]
    : null;

  return (
    <div className="group bg-white border border-[#D4E5D4] hover:border-[#6B8E6B]/50 rounded-lg transition-all duration-300 flex flex-col overflow-hidden relative hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(107,142,107,0.1)]">
      {/* Thumbnail */}
      <div
        className="aspect-video w-full bg-[#F5FAF7] relative overflow-hidden cursor-pointer"
        onClick={onOpen}
      >
        {coverSlide ? (
          <div className="w-[800%] h-[800%] origin-top-left transform scale-[0.125] pointer-events-none select-none">
            <WabiSabiStage
              slide={coverSlide}
              theme={theme}
              layoutStyle={(item.data as Presentation).wabiSabiLayout}
              printMode={true}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100/50 to-[#6B8E6B]/10">
            <Sparkles className="w-8 h-8 text-[#8FA58F]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#1E2E1E]/0 group-hover:bg-[#1E2E1E]/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-[#6B8E6B] text-white px-4 py-2 rounded-md font-medium text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="w-3 h-3" fill="currentColor" />
            {item.type === 'ideation' ? 'Continue' : 'Open'}
          </div>
        </div>

        {/* Type badge - top left */}
        <div className="absolute top-2 left-2">
          <TypeBadge type={item.type} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-medium text-sm text-[#1E2E1E] line-clamp-1 group-hover:text-[#6B8E6B] transition-colors duration-200 cursor-pointer mb-2"
          onClick={onOpen}
        >
          {item.title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-[#8FA58F]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(item.lastModified)}
            </span>
            {item.slideCount !== undefined && (
              <span className="px-1.5 py-0.5 bg-[#EDF5F0] rounded text-[#4A5D4A]">
                {item.slideCount} slides
              </span>
            )}
            {item.noteCount !== undefined && (
              <span className="px-1.5 py-0.5 bg-[#EDF5F0] rounded text-[#4A5D4A]">
                {item.noteCount} notes
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons - appear on hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {onAction && actionLabel && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction(); }}
            className="p-1.5 bg-[#6B8E6B] text-white rounded-md hover:bg-[#5A7A5A] transition-colors duration-150"
            title={actionLabel}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onClone && (
          <button
            onClick={(e) => { e.stopPropagation(); onClone(); }}
            className="p-1.5 bg-white/90 text-[#4A5D4A] rounded-md hover:bg-white hover:text-[#6B8E6B] transition-colors duration-150 shadow-sm"
            title="Clone"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 bg-white/90 text-[#4A5D4A] rounded-md hover:bg-red-50 hover:text-red-500 transition-colors duration-150 shadow-sm"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/** Format time ago helper */
function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export const Dashboard: React.FC<DashboardProps> = ({
  savedDecks,
  savedIdeations = [],
  isLoadingIdeations = false,
  savedRoughDrafts = [],
  isLoadingRoughDrafts = false,
  onLoad,
  onDelete,
  onClone,
  onCreateNew,
  onCreateDeckWithTopic,
  isGeneratingDeck = false,
  onImport,
  onIdeate,
  onOpenSources,
  onBeautify,
  onLoadIdeation,
  onDeleteIdeation,
  onGenerateDeckFromIdeation,
  onViewJournal,
  onLoadRoughDraft,
  onDeleteRoughDraft,
  onApproveRoughDraft,
  onOpenThemePicker,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyticsDeck, setAnalyticsDeck] = useState<Presentation | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('deck');
  const [recipeSelectorOpen, setRecipeSelectorOpen] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<'video' | 'web' | 'mixed'>('video');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Onboarding
  const {
    isLoaded: onboardingLoaded,
    completedSteps,
    shouldShowChecklist,
    markStepComplete,
    dismissChecklist,
  } = useOnboarding();

  const showChecklist = shouldShowChecklist && savedDecks.length < 3;

  // Combine all work items into unified feed
  const workItems = useMemo<WorkItem[]>(() => {
    const items: WorkItem[] = [];

    // Add decks
    savedDecks.forEach(deck => {
      items.push({
        id: deck.id,
        type: 'deck',
        title: deck.topic,
        lastModified: deck.lastModified,
        slideCount: deck.slides.length,
        data: deck,
      });
    });

    // Add rough drafts
    savedRoughDrafts.forEach(draft => {
      items.push({
        id: draft.id,
        type: 'draft',
        title: draft.topic,
        lastModified: draft.createdAt,
        slideCount: draft.slides.length,
        data: draft,
      });
    });

    // Add ideations
    savedIdeations.forEach(ideation => {
      items.push({
        id: ideation.id,
        type: 'ideation',
        title: ideation.topic,
        lastModified: ideation.lastModified,
        noteCount: ideation.notes?.length || 0,
        data: ideation,
      });
    });

    // Sort by last modified (newest first)
    return items.sort((a, b) => b.lastModified - a.lastModified);
  }, [savedDecks, savedRoughDrafts, savedIdeations]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return workItems;
    return workItems.filter(item => item.type === activeFilter);
  }, [workItems, activeFilter]);

  // Count items by type
  const counts = useMemo(() => ({
    all: workItems.length,
    deck: savedDecks.length,
    draft: savedRoughDrafts.length,
    ideation: savedIdeations.length,
  }), [workItems.length, savedDecks.length, savedRoughDrafts.length, savedIdeations.length]);

  // Handlers
  const handleOpenRecipeSelector = (preset: 'video' | 'web' | 'mixed') => {
    setPendingPreset(preset);
    setRecipeSelectorOpen(true);
  };

  const handleRecipeSelect = (recipe: DeckRecipe) => {
    setRecipeSelectorOpen(false);
    onOpenSources?.(pendingPreset, recipe);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  const handleStepClick = (step: OnboardingStep) => {
    switch (step) {
      case 'create_deck':
        onCreateNew();
        break;
      case 'try_ideation':
        onIdeate?.();
        break;
      case 'explore_themes':
        onOpenThemePicker?.();
        break;
    }
  };

  const handleCreateNew = () => {
    markStepComplete('create_deck');
    setIsCreateModalOpen(true);
  };

  const handleCreateDeck = async (topic: string) => {
    if (onCreateDeckWithTopic) {
      // Use new topic-aware callback, keep modal open during generation
      await onCreateDeckWithTopic(topic);
      setIsCreateModalOpen(false);
    } else {
      // Fallback to legacy behavior
      setIsCreateModalOpen(false);
      onCreateNew();
    }
  };

  const handleIdeate = () => {
    markStepComplete('try_ideation');
    onIdeate?.();
  };

  const handleItemAction = (item: WorkItem) => {
    switch (item.type) {
      case 'deck':
        onLoad(item.id);
        break;
      case 'draft':
        onLoadRoughDraft?.(item.id);
        break;
      case 'ideation':
        onLoadIdeation?.(item.id);
        break;
    }
  };

  const handleItemDelete = (item: WorkItem) => {
    switch (item.type) {
      case 'deck':
        onDelete(item.id);
        break;
      case 'draft':
        onDeleteRoughDraft?.(item.id);
        break;
      case 'ideation':
        onDeleteIdeation?.(item.id);
        break;
    }
  };

  const isLoading = isLoadingIdeations || isLoadingRoughDrafts;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F5FAF7] p-8 md:p-12">
      {analyticsDeck && (
        <AnalyticsModal presentation={analyticsDeck} onClose={() => setAnalyticsDeck(null)} />
      )}

      <RecipeSelector
        isOpen={recipeSelectorOpen}
        onSelect={handleRecipeSelect}
        onClose={() => setRecipeSelectorOpen(false)}
        preset={pendingPreset}
      />

      {/* Unified Create Modal */}
      <UnifiedCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => !isGeneratingDeck && setIsCreateModalOpen(false)}
        onCreateDeck={handleCreateDeck}
        onIdeate={handleIdeate}
        onOpenSources={() => handleOpenRecipeSelector('web')}
        isGenerating={isGeneratingDeck}
      />

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

      <div className="max-w-7xl mx-auto">
        {/* Feature Cards - Simplified CTAs */}
        <FeatureCards
          onCreateNew={handleCreateNew}
          onIdeate={onIdeate ? handleIdeate : undefined}
          onOpenSources={onOpenSources}
          onOpenRecipeSelector={handleOpenRecipeSelector}
          onBeautify={onBeautify}
          onImport={handleImportClick}
        />

        {/* Getting Started Checklist */}
        {onboardingLoaded && showChecklist && (
          <GettingStarted
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
            onDismiss={dismissChecklist}
          />
        )}

        {/* Unified Work Feed */}
        <div className="mt-8">
          {/* Header with filter */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[#8FA58F]">
              Your recent work
            </h2>

            {/* Filter dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8FA58F]" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                className="bg-white border border-[#D4E5D4] rounded-md px-3 py-1.5 text-sm text-[#4A5D4A] focus:border-[#6B8E6B]/50 focus:outline-none cursor-pointer"
              >
                <option value="all">All ({counts.all})</option>
                <option value="deck">Decks ({counts.deck})</option>
                <option value="draft">Drafts ({counts.draft})</option>
                <option value="ideation">Ideas ({counts.ideation})</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#6B8E6B] animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredItems.length === 0 && (
            <div className="border border-dashed border-[#D4E5D4] rounded-lg p-16 text-center bg-white">
              <div className="w-16 h-16 bg-[#EDF5F0] rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#8FA58F]" />
              </div>
              <h3 className="text-lg font-medium text-[#1E2E1E] mb-2">
                {activeFilter === 'all' ? 'Ready to create?' : `No ${activeFilter}s yet`}
              </h3>
              <p className="text-[#4A5D4A] mb-6 max-w-md mx-auto text-sm">
                {activeFilter === 'all'
                  ? 'Start by creating a new presentation or exploring your ideas with ideation.'
                  : `Create your first ${activeFilter} to see it here.`}
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors duration-200"
              >
                Create Your First Deck
              </button>
            </div>
          )}

          {/* Work items grid */}
          {!isLoading && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <WorkItemCard
                  key={`${item.type}-${item.id}`}
                  item={item}
                  onOpen={() => handleItemAction(item)}
                  onDelete={() => handleItemDelete(item)}
                  onClone={item.type === 'deck' && onClone ? () => onClone(item.id) : undefined}
                  onAction={
                    item.type === 'ideation' && onGenerateDeckFromIdeation
                      ? () => onGenerateDeckFromIdeation(item.id)
                      : item.type === 'draft' && onApproveRoughDraft
                        ? () => onApproveRoughDraft(item.id)
                        : item.type === 'deck'
                          ? () => setAnalyticsDeck(item.data as Presentation)
                          : undefined
                  }
                  actionLabel={
                    item.type === 'ideation' ? 'Build Deck' :
                      item.type === 'draft' ? 'Approve' :
                        item.type === 'deck' ? 'Analytics' : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
