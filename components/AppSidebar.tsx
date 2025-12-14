
import React from 'react';
import { Presentation, Message, GenerationMode } from '@/types';
import { IdeationSession } from '@/types/ideation';
import { RoughDraft } from '@/types/roughDraft';
import { Sparkles, Clock, ArrowRight, FileText, Lightbulb } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { SlideList } from './SlideList';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { RelatedContentPanel } from './RelatedContentPanel';
import { ExpandableSection } from './shared/ExpandableSection';
import { IMAGE_STYLES } from '@/config/imageStyles';
import { useVersions } from '@/hooks/queries/useVersionQueries';
import { useCreateVersion, useRestoreVersion, useDeleteVersion } from '@/hooks/mutations/useVersionMutations';

interface AppSidebarProps {
    currentPresentation: Presentation | null;
    messages: Message[];
    isGenerating: boolean;
    isChatOpen: boolean;
    setIsChatOpen: (v: boolean) => void;
    inputValue: string;
    setInputValue: (v: string) => void;
    handleSendMessage: () => void;
    selectedImageStyle: typeof IMAGE_STYLES[0];
    setSelectedImageStyle: (s: typeof IMAGE_STYLES[0]) => void;
    generationMode: GenerationMode;
    setGenerationMode: (m: GenerationMode) => void;
    activeSlideIndex: number;
    setActiveSlideIndex: (i: number) => void;
    onMoveSlide: (index: number, direction: 'up' | 'down') => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    viewMode?: 'standard' | 'wabi-sabi';
    activeWabiSabiLayout?: string;
    // Ideation props
    recentIdeations?: IdeationSession[];
    onLoadIdeation?: (id: string) => void;
    onViewAllIdeations?: () => void;
    // Related content props
    sourceIdeation?: IdeationSession | null;
    sourceRoughDraft?: RoughDraft | null;
    onViewSourceIdeation?: (id: string) => void;
    onViewSourceRoughDraft?: (id: string) => void;
    // Workspace navigation props
    onIdeate?: () => void;
    onGoToDashboard?: () => void;
    ideationsCount?: number;
    roughDraftsCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
    currentPresentation,
    messages,
    isGenerating,
    isChatOpen,
    setIsChatOpen,
    inputValue,
    setInputValue,
    handleSendMessage,
    selectedImageStyle,
    setSelectedImageStyle,
    generationMode,
    setGenerationMode,
    activeSlideIndex,
    setActiveSlideIndex,
    onMoveSlide,
    scrollRef,
    viewMode,
    activeWabiSabiLayout,
    recentIdeations = [],
    onLoadIdeation,
    onViewAllIdeations,
    sourceIdeation,
    sourceRoughDraft,
    onViewSourceIdeation,
    onViewSourceRoughDraft,
    onIdeate,
    onGoToDashboard,
    ideationsCount = 0,
    roughDraftsCount = 0,
}) => {
    // Version History hooks
    const { data: versions = [], isLoading: isLoadingVersions } = useVersions(currentPresentation?.id || null);
    const createVersionMutation = useCreateVersion();
    const restoreVersionMutation = useRestoreVersion();
    const deleteVersionMutation = useDeleteVersion();

    const handleCreateVersion = (label?: string) => {
        if (currentPresentation) {
            createVersionMutation.mutate({ presentationId: currentPresentation.id, label });
        }
    };

    const handleRestoreVersion = (versionId: string) => {
        if (currentPresentation) {
            restoreVersionMutation.mutate({ presentationId: currentPresentation.id, versionId });
        }
    };

    const handleDeleteVersion = (versionId: string) => {
        if (currentPresentation) {
            deleteVersionMutation.mutate({ presentationId: currentPresentation.id, versionId });
        }
    };

    return (
        <div className="w-[320px] md:w-[360px] flex flex-col border-r border-[#D4E5D4] bg-[#F5FAF7] relative z-20 h-full flex-shrink-0">
            {/* Header - Clean and minimal */}
            <div className="h-16 flex-none px-5 border-b border-[#D4E5D4] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#6B8E6B] text-white flex items-center justify-center rounded-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg text-[#1E2E1E] leading-none">DeckSnap</h1>
                        <span className="text-[10px] text-[#8FA58F]">AI Presentation Studio</span>
                    </div>
                </div>
            </div>

            {/* Content based on state */}
            {!currentPresentation ? (
                /* No presentation - Show chat and recent work */
                <div className="flex flex-col grow h-full overflow-hidden">
                    {/* Chat Interface */}
                    <ChatInterface
                        mode="sidebar"
                        messages={messages}
                        isGenerating={isGenerating}
                        currentPresentation={currentPresentation}
                        isChatOpen={isChatOpen}
                        setIsChatOpen={setIsChatOpen}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        selectedImageStyle={selectedImageStyle}
                        setSelectedImageStyle={setSelectedImageStyle}
                        generationMode={generationMode}
                        setGenerationMode={setGenerationMode}
                        scrollRef={scrollRef}
                    />

                    {/* Recent Ideations - Compact list */}
                    {recentIdeations.length > 0 && onLoadIdeation && (
                        <div className="border-t border-[#D4E5D4] p-4 bg-white">
                            <h3 className="text-xs font-medium text-[#8FA58F] mb-3">
                                Continue working
                            </h3>
                            <div className="space-y-2">
                                {recentIdeations.slice(0, 3).map((ideation) => (
                                    <button
                                        key={ideation.id}
                                        onClick={() => onLoadIdeation(ideation.id)}
                                        className="w-full p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg hover:border-[#6B8E6B]/30 transition-all duration-200 text-left group"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-[#1E2E1E] font-medium truncate group-hover:text-[#6B8E6B] transition-colors">
                                                    {ideation.topic || 'Untitled'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8FA58F]">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatTimeAgo(ideation.lastModified)}</span>
                                                    <span className="px-1.5 py-0.5 bg-[#EDF5F0] rounded">
                                                        {ideation.notes.length} notes
                                                    </span>
                                                </div>
                                            </div>
                                            <Lightbulb className="w-4 h-4 text-[#6B8E6B]/50 flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {onViewAllIdeations && recentIdeations.length > 3 && (
                                <button
                                    onClick={onViewAllIdeations}
                                    className="w-full mt-2 py-2 text-xs text-[#8FA58F] hover:text-[#6B8E6B] transition-colors"
                                >
                                    View all ideations
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Presentation loaded - Show slides and tools */
                <div className="flex flex-col flex-1 overflow-hidden">
                    {/* Slide List - Primary content */}
                    <div className="flex-1 overflow-hidden">
                        <SlideList
                            presentation={currentPresentation}
                            activeSlideIndex={activeSlideIndex}
                            setActiveSlideIndex={setActiveSlideIndex}
                            onMoveSlide={onMoveSlide}
                            viewMode={viewMode}
                            activeWabiSabiLayout={activeWabiSabiLayout}
                        />
                    </div>

                    {/* Related Content - Only if there's source content */}
                    {(sourceIdeation || sourceRoughDraft) && (
                        <RelatedContentPanel
                            ideation={sourceIdeation ? {
                                id: sourceIdeation.id,
                                topic: sourceIdeation.topic,
                                lastModified: sourceIdeation.lastModified,
                                notesCount: sourceIdeation.notes.length,
                            } : null}
                            roughDraft={sourceRoughDraft ? {
                                id: sourceRoughDraft.id,
                                topic: sourceRoughDraft.topic,
                                lastModified: sourceRoughDraft.updatedAt,
                                slidesCount: sourceRoughDraft.slides.length,
                                status: sourceRoughDraft.status,
                            } : null}
                            onViewIdeation={onViewSourceIdeation}
                            onViewRoughDraft={onViewSourceRoughDraft}
                        />
                    )}

                    {/* Version History - Collapsible */}
                    <ExpandableSection
                        title="History"
                        icon={Clock}
                        defaultExpanded={false}
                    >
                        <VersionHistoryPanel
                            versions={versions}
                            isLoading={isLoadingVersions}
                            onCreateVersion={handleCreateVersion}
                            onRestoreVersion={handleRestoreVersion}
                            onDeleteVersion={handleDeleteVersion}
                            isCreating={createVersionMutation.isPending}
                            isRestoring={restoreVersionMutation.isPending}
                            compact
                        />
                    </ExpandableSection>

                    {/* Quick Actions - Bottom of sidebar */}
                    <div className="border-t border-[#D4E5D4] p-3 bg-white">
                        <div className="flex gap-2">
                            {onIdeate && (
                                <button
                                    onClick={onIdeate}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#6B8E6B]/10 border border-[#6B8E6B]/20 rounded-md text-xs text-[#6B8E6B] hover:bg-[#6B8E6B]/20 transition-colors"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    New Idea
                                </button>
                            )}
                            {onGoToDashboard && (
                                <button
                                    onClick={onGoToDashboard}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#EDF5F0] border border-[#D4E5D4] rounded-md text-xs text-[#4A5D4A] hover:text-[#1E2E1E] hover:border-[#C0D6C0] transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
