
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
    deck: { label: 'Deck', icon: FileText, color: 'bg-white/10 text-white/70' },
    draft: { label: 'Draft', icon: FileEdit, color: 'bg-[#c5a47e]/20 text-[#c5a47e]' },
    ideation: { label: 'Idea', icon: Sparkles, color: 'bg-purple-500/20 text-purple-400' },
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
    <div className="group bg-[#171717] border border-white/5 hover:border-[#c5a47e]/30 rounded-lg transition-all duration-300 flex flex-col overflow-hidden relative hover:-translate-y-0.5 hover:shadow-lg">
      {/* Thumbnail */}
      <div
        className="aspect-video w-full bg-[#0d0d0d] relative overflow-hidden cursor-pointer"
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-[#c5a47e]/10">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-[#c5a47e] text-black px-4 py-2 rounded font-medium text-xs flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
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
          className="font-semibold text-sm text-white line-clamp-1 group-hover:text-[#c5a47e] transition-colors duration-200 cursor-pointer mb-2"
          onClick={onOpen}
        >
          {item.title}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(item.lastModified)}
            </span>
            {item.slideCount !== undefined && (
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/50">
                {item.slideCount} slides
              </span>
            )}
            {item.noteCount !== undefined && (
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/50">
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
            className="p-1.5 bg-[#c5a47e] text-black rounded hover:bg-[#d4b68e] transition-colors duration-150"
            title={actionLabel}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onClone && (
          <button
            onClick={(e) => { e.stopPropagation(); onClone(); }}
            className="p-1.5 bg-black/80 text-white/70 rounded hover:bg-black hover:text-[#c5a47e] transition-colors duration-150"
            title="Clone"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 bg-black/80 text-white/70 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors duration-150"
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
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [recipeSelectorOpen, setRecipeSelectorOpen] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<'video' | 'web' | 'mixed'>('video');

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
        lastModified: ideation.updatedAt,
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
    onCreateNew();
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
    <div className="flex-1 h-full overflow-y-auto bg-[#0d0d0d] p-8 md:p-12">
      {analyticsDeck && (
        <AnalyticsModal presentation={analyticsDeck} onClose={() => setAnalyticsDeck(null)} />
      )}

      <RecipeSelector
        isOpen={recipeSelectorOpen}
        onSelect={handleRecipeSelect}
        onClose={() => setRecipeSelectorOpen(false)}
        preset={pendingPreset}
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
            <h2 className="text-sm font-medium text-white/40">
              Your recent work
            </h2>

            {/* Filter dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/30" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                className="bg-transparent border border-white/10 rounded px-3 py-1.5 text-sm text-white/70 focus:border-[#c5a47e]/50 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#171717]">All ({counts.all})</option>
                <option value="deck" className="bg-[#171717]">Decks ({counts.deck})</option>
                <option value="draft" className="bg-[#171717]">Drafts ({counts.draft})</option>
                <option value="ideation" className="bg-[#171717]">Ideas ({counts.ideation})</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#c5a47e] animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredItems.length === 0 && (
            <div className="border border-dashed border-white/10 rounded-lg p-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {activeFilter === 'all' ? 'Ready to create?' : `No ${activeFilter}s yet`}
              </h3>
              <p className="text-white/50 mb-6 max-w-md mx-auto text-sm">
                {activeFilter === 'all'
                  ? 'Start by creating a new presentation or exploring your ideas with ideation.'
                  : `Create your first ${activeFilter} to see it here.`}
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-[#c5a47e] hover:bg-[#d4b68e] text-black px-6 py-2.5 rounded font-medium text-sm transition-colors duration-200"
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
