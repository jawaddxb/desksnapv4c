
import React, { useRef, useState } from 'react';
import { Presentation } from '../types';
import { IdeationSession, DeckRecipe } from '../types/ideation';
import { RoughDraft } from '../types/roughDraft';
import { THEMES } from '../lib/themes';
import { WabiSabiStage } from './WabiSabiStage';
import { Trash2, Clock, Play, BarChart2, FileText, Sparkles, Copy, FileEdit, Layers } from 'lucide-react';
import { AnalyticsModal } from './AnalyticsModal';
import { IdeationHistoryPanel } from './ideation/IdeationHistoryPanel';
import { RoughDraftHistoryPanel } from './rough-draft/RoughDraftHistoryPanel';
import { RecipeSelector } from './sources/RecipeSelector';
import { FeatureCards } from './dashboard/FeatureCards';
import { GettingStarted } from './onboarding/GettingStarted';
import { TabTip } from './onboarding/FeatureTooltip';
import { useOnboarding, OnboardingStep } from '../hooks/useOnboarding';

type DashboardTab = 'decks' | 'rough-drafts' | 'ideations';

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
    const [activeTab, setActiveTab] = useState<DashboardTab>('decks');
    // Recipe selector state
    const [recipeSelectorOpen, setRecipeSelectorOpen] = useState(false);
    const [pendingPreset, setPendingPreset] = useState<'video' | 'web' | 'mixed'>('video');

    // Onboarding state
    const {
        isLoaded: onboardingLoaded,
        completedSteps,
        shouldShowChecklist,
        markStepComplete,
        dismissChecklist,
        isTipDismissed,
        dismissTip,
    } = useOnboarding();

    // Show checklist only when user has fewer than 3 decks
    const showChecklist = shouldShowChecklist && savedDecks.length < 3;

    // Tooltip visibility
    const showIdeationTip = !isTipDismissed('ideation_tab') && savedIdeations.length === 0;
    const showRoughDraftTip = !isTipDismissed('rough_draft_tab') && savedRoughDrafts.length === 0;

    // Handle opening recipe selector before sources
    const handleOpenRecipeSelector = (preset: 'video' | 'web' | 'mixed') => {
        setPendingPreset(preset);
        setRecipeSelectorOpen(true);
    };

    // Handle recipe selection
    const handleRecipeSelect = (recipe: DeckRecipe) => {
        setRecipeSelectorOpen(false);
        onOpenSources?.(pendingPreset, recipe);
    };

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImport(file);
            // Reset input
            e.target.value = '';
        }
    };

    // Handle checklist step clicks
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
            case 'export_deck':
                // This will be marked when user actually exports
                break;
        }
    };

    // Handler wrappers that mark onboarding steps complete
    const handleCreateNew = () => {
        markStepComplete('create_deck');
        onCreateNew();
    };

    const handleIdeate = () => {
        markStepComplete('try_ideation');
        onIdeate?.();
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#111111] p-8 md:p-12">
            {analyticsDeck && (
                <AnalyticsModal presentation={analyticsDeck} onClose={() => setAnalyticsDeck(null)} />
            )}

            {/* Recipe selector modal */}
            <RecipeSelector
                isOpen={recipeSelectorOpen}
                onSelect={handleRecipeSelect}
                onClose={() => setRecipeSelectorOpen(false)}
                preset={pendingPreset}
            />

            {/* Hidden file input for import */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json" />

            <div className="max-w-7xl mx-auto">
                {/* Feature Cards Section */}
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

                {/* Recent Work Section */}
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
                        Your Recent Work
                    </h2>

                    {/* Tab navigation */}
                    <div className="flex gap-1 mb-6">
                        <button
                            onClick={() => setActiveTab('decks')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-150 ${
                                activeTab === 'decks'
                                    ? 'bg-white text-black'
                                    : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            My Decks
                            <span className={`px-2 py-0.5 text-[10px] rounded-sm ${
                                activeTab === 'decks' ? 'bg-black/20' : 'bg-white/10'
                            }`}>
                                {savedDecks.length}
                            </span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab('rough-drafts');
                                    if (showRoughDraftTip) dismissTip('rough_draft_tab');
                                }}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-150 ${
                                    activeTab === 'rough-drafts'
                                        ? 'bg-[#c5a47e] text-black'
                                        : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <FileEdit className="w-4 h-4" />
                                Rough Drafts
                                <span className={`px-2 py-0.5 text-[10px] rounded-sm ${
                                    activeTab === 'rough-drafts' ? 'bg-black/20' : 'bg-white/10'
                                }`}>
                                    {savedRoughDrafts.length}
                                </span>
                            </button>
                            <TabTip
                                text="Review AI-generated slides before finalizing"
                                isVisible={showRoughDraftTip && activeTab === 'decks'}
                                onDismiss={() => dismissTip('rough_draft_tab')}
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab('ideations');
                                    if (showIdeationTip) dismissTip('ideation_tab');
                                }}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-150 ${
                                    activeTab === 'ideations'
                                        ? 'bg-[#c5a47e] text-black'
                                        : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Sparkles className="w-4 h-4" />
                                Ideations
                                <span className={`px-2 py-0.5 text-[10px] rounded-sm ${
                                    activeTab === 'ideations' ? 'bg-black/20' : 'bg-white/10'
                                }`}>
                                    {savedIdeations.length}
                                </span>
                            </button>
                            <TabTip
                                text="Start here to brainstorm before building"
                                isVisible={showIdeationTip && activeTab === 'decks'}
                                onDismiss={() => dismissTip('ideation_tab')}
                            />
                        </div>
                    </div>

                    {/* Tab description */}
                    <p className="text-white/50 text-sm mb-6">
                        {activeTab === 'decks'
                            ? 'Your finished presentations, ready to present or export'
                            : activeTab === 'rough-drafts'
                            ? 'Review and refine AI-generated slides before creating your final deck'
                            : 'Your brainstorming sessions — develop ideas before building slides'}
                    </p>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'decks' ? (
                    // Decks grid - now 4 per row
                    savedDecks.length === 0 ? (
                        <div className="border border-dashed border-white/20 p-16 text-center flex flex-col items-center justify-center bg-black/50">
                            <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6">
                                <Layers className="w-8 h-8 text-white/40" />
                            </div>
                            <h3 className="text-xl font-light text-white mb-2">Ready to create something amazing?</h3>
                            <p className="text-white/50 mb-8 max-w-md mx-auto">
                                DeckSnap uses AI to help you build beautiful presentations in minutes.
                                Choose a creation method above to get started.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <button
                                    onClick={handleCreateNew}
                                    className="bg-white hover:bg-[#c5a47e] text-black px-6 py-3 font-bold uppercase tracking-wide text-xs transition-all duration-150"
                                >
                                    Create Your First Deck
                                </button>
                                {onIdeate && (
                                    <button
                                        onClick={handleIdeate}
                                        className="text-[#c5a47e] hover:text-white transition-colors duration-150 text-sm"
                                    >
                                        Or start by brainstorming ideas →
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {savedDecks.map(deck => {
                                const theme = THEMES[deck.themeId] || THEMES.neoBrutalist;
                                const coverSlide = deck.slides?.[0];

                                return (
                                    <div key={deck.id} className="group bg-[#1a1a1a] border border-white/10 hover:border-[#c5a47e]/50 transition-all duration-150 flex flex-col overflow-hidden relative">
                                        <div className="aspect-video w-full bg-black relative overflow-hidden cursor-pointer" onClick={() => onLoad(deck.id)}>
                                            {/* Using WabiSabi renderer for high fidelity thumbnail */}
                                            {coverSlide ? (
                                                <div className="w-[800%] h-[800%] origin-top-left transform scale-[0.125] pointer-events-none select-none">
                                                    <WabiSabiStage
                                                        slide={coverSlide}
                                                        theme={theme}
                                                        layoutStyle={deck.wabiSabiLayout}
                                                        printMode={true}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                                    <span className="text-xs uppercase tracking-widest">No slides</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-150 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-[#c5a47e] text-black px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-150">
                                                    <Play className="w-2.5 h-2.5" fill="currentColor" /> Edit
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#c5a47e] transition-colors duration-150 cursor-pointer mb-2" onClick={() => onLoad(deck.id)}>
                                                {deck.topic}
                                            </h3>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2 text-[9px] text-white/40 font-bold uppercase tracking-widest">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {new Date(deck.lastModified).toLocaleDateString()}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 bg-white/5 text-white/50">
                                                        {deck.slides.length}
                                                    </span>
                                                </div>

                                                {/* Analytics Button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setAnalyticsDeck(deck); }}
                                                    className="p-1.5 text-white/30 hover:text-[#c5a47e] hover:bg-white/5 transition-colors duration-150"
                                                    title="View Analytics"
                                                >
                                                    <BarChart2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action buttons - top right */}
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
                                            {onClone && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onClone(deck.id); }}
                                                    className="p-1.5 bg-black/80 text-[#c5a47e] hover:bg-[#c5a47e]/20 hover:text-[#c5a47e] transition-all duration-150"
                                                    title="Clone Deck"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete(deck.id); }}
                                                className="p-1.5 bg-black/80 text-red-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-150"
                                                title="Delete Deck"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : activeTab === 'rough-drafts' ? (
                    // Rough drafts history panel
                    <RoughDraftHistoryPanel
                        drafts={savedRoughDrafts}
                        isLoading={isLoadingRoughDrafts}
                        onSelectDraft={onLoadRoughDraft || (() => {})}
                        onDeleteDraft={onDeleteRoughDraft || (() => {})}
                        onApproveDraft={onApproveRoughDraft || (() => {})}
                    />
                ) : (
                    // Ideations history panel
                    <IdeationHistoryPanel
                        ideations={savedIdeations}
                        isLoading={isLoadingIdeations}
                        onSelectIdeation={onLoadIdeation || (() => {})}
                        onDeleteIdeation={onDeleteIdeation || (() => {})}
                        onGenerateDeck={onGenerateDeckFromIdeation || (() => {})}
                        onViewJournal={onViewJournal}
                    />
                )}
            </div>
        </div>
    );
};
