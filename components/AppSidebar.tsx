
import React, { useState } from 'react';
import { Presentation, Message, GenerationMode } from '../types';
import { IdeationSession } from '../types/ideation';
import { RoughDraft } from '../types/roughDraft';
import { Zap, MessageSquare, ChevronDown, ChevronRight, Sparkles, Clock, ArrowRight, FileText, Lightbulb, FileEdit, LayoutDashboard } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { SlideList } from './SlideList';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { RelatedContentPanel } from './RelatedContentPanel';
import { IMAGE_STYLES } from '../config/imageStyles';
import { useVersions } from '../hooks/queries/useVersionQueries';
import { useCreateVersion, useRestoreVersion, useDeleteVersion } from '../hooks/mutations/useVersionMutations';

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
    const [ideationsExpanded, setIdeationsExpanded] = useState(true);
    const [workspaceExpanded, setWorkspaceExpanded] = useState(true);

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
        <div className="w-[360px] md:w-[400px] flex flex-col border-r border-white/10 bg-black relative z-20 h-full flex-shrink-0">
            <div className="h-20 flex-none px-6 border-b border-white/10 flex items-center justify-between bg-black z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-black flex items-center justify-center"><Zap className="w-6 h-6" strokeWidth={2.5} /></div>
                    <div><h1 className="font-bold text-2xl tracking-tight text-white leading-none">DeckSnap</h1><span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a47e]">GenAI Studio</span></div>
                </div>
                {currentPresentation && (
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-2 transition-all duration-150 ${isChatOpen ? 'bg-[#c5a47e] text-black' : 'bg-black text-white/60 border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e]'}`}><MessageSquare className="w-5 h-5" strokeWidth={2.5} /></button>
                )}
            </div>
            {!currentPresentation ? (
                <div className="flex flex-col grow h-full overflow-hidden">
                    <ChatInterface
                        mode="sidebar" messages={messages} isGenerating={isGenerating} currentPresentation={currentPresentation}
                        isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} inputValue={inputValue} setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage} selectedImageStyle={selectedImageStyle} setSelectedImageStyle={setSelectedImageStyle}
                        generationMode={generationMode} setGenerationMode={setGenerationMode}
                        scrollRef={scrollRef}
                    />

                    {/* Recent Ideations Section */}
                    {recentIdeations.length > 0 && onLoadIdeation && (
                        <div className="border-t border-white/10 bg-black/50">
                            <button
                                onClick={() => setIdeationsExpanded(!ideationsExpanded)}
                                className="w-full px-4 py-3 flex items-center justify-between text-white/60 hover:text-white transition-colors duration-150"
                            >
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-[#c5a47e]" />
                                    Recent Ideations
                                </span>
                                {ideationsExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>

                            {ideationsExpanded && (
                                <div className="px-4 pb-4 space-y-2">
                                    {recentIdeations.slice(0, 5).map((ideation) => (
                                        <button
                                            key={ideation.id}
                                            onClick={() => onLoadIdeation(ideation.id)}
                                            className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c5a47e]/50 transition-all duration-150 text-left group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white font-medium line-clamp-1 group-hover:text-[#c5a47e] transition-colors duration-150">
                                                        {ideation.topic || 'Untitled Ideation'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(ideation.lastModified).toLocaleDateString()}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 bg-white/5 rounded-sm">
                                                            {ideation.notes.length} notes
                                                        </span>
                                                        {ideation.generatedPresentationIds && ideation.generatedPresentationIds.length > 0 && (
                                                            <span className="flex items-center gap-1 text-[#c5a47e]">
                                                                <FileText className="w-3 h-3" />
                                                                {ideation.generatedPresentationIds.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#c5a47e] transition-colors duration-150 flex-shrink-0" />
                                            </div>
                                        </button>
                                    ))}

                                    {onViewAllIdeations && (
                                        <button
                                            onClick={onViewAllIdeations}
                                            className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a47e] hover:text-white transition-colors duration-150"
                                        >
                                            View All Ideations &rarr;
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col flex-1 overflow-hidden">
                    <SlideList
                        presentation={currentPresentation}
                        activeSlideIndex={activeSlideIndex}
                        setActiveSlideIndex={setActiveSlideIndex}
                        onMoveSlide={onMoveSlide}
                        viewMode={viewMode}
                        activeWabiSabiLayout={activeWabiSabiLayout}
                    />
                    {/* Related Content Panel - shows source ideation/rough draft */}
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
                    <VersionHistoryPanel
                        versions={versions}
                        isLoading={isLoadingVersions}
                        onCreateVersion={handleCreateVersion}
                        onRestoreVersion={handleRestoreVersion}
                        onDeleteVersion={handleDeleteVersion}
                        isCreating={createVersionMutation.isPending}
                        isRestoring={restoreVersionMutation.isPending}
                    />

                    {/* Workspace Navigation Panel */}
                    <div className="border-t border-white/10 bg-black/50">
                        <button
                            onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
                            className="w-full px-4 py-3 flex items-center justify-between text-white/60 hover:text-white transition-colors duration-150"
                        >
                            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-[#c5a47e]" />
                                Workspace
                            </span>
                            {workspaceExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>

                        {workspaceExpanded && (
                            <div className="px-4 pb-4 space-y-2">
                                {/* New Ideation Button */}
                                {onIdeate && (
                                    <button
                                        onClick={onIdeate}
                                        className="w-full p-3 bg-[#c5a47e]/10 hover:bg-[#c5a47e]/20 border border-[#c5a47e]/30 hover:border-[#c5a47e]/50 transition-all duration-150 text-left group flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-[#c5a47e]/20 flex items-center justify-center flex-shrink-0">
                                            <Lightbulb className="w-4 h-4 text-[#c5a47e]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[#c5a47e] font-medium">New Ideation</p>
                                            <p className="text-[10px] text-white/40">Brainstorm your next deck</p>
                                        </div>
                                    </button>
                                )}

                                {/* Go to Dashboard Button */}
                                {onGoToDashboard && (
                                    <button
                                        onClick={onGoToDashboard}
                                        className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150 text-left group flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <LayoutDashboard className="w-4 h-4 text-white/60" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium group-hover:text-[#c5a47e] transition-colors duration-150">Dashboard</p>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                {ideationsCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <Lightbulb className="w-3 h-3" />
                                                        {ideationsCount} ideations
                                                    </span>
                                                )}
                                                {roughDraftsCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <FileEdit className="w-3 h-3" />
                                                        {roughDraftsCount} drafts
                                                    </span>
                                                )}
                                                {ideationsCount === 0 && roughDraftsCount === 0 && (
                                                    <span>View all your work</span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#c5a47e] transition-colors duration-150 flex-shrink-0" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
