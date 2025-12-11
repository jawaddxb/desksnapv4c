

import React, { useState, useCallback } from 'react';
import { Slide, Theme, Presentation, ImageStylePreset } from '../types';
import { RotateCw, Wand2, Layers } from 'lucide-react';
import { WabiSabiStage } from './WabiSabiStage';
import {
    SplitLayout, FullBleedLayout, StatementLayout, GalleryLayout,
    CardLayout, HorizontalLayout, MagazineLayout
} from './StandardLayouts';
import { SlideContentEditor } from './SlideContentEditor';
import { LayoutToolbar } from './LayoutToolbar';
import { Dashboard } from './Dashboard';
import { SpeakerNotesPanel } from './SpeakerNotesPanel';
import { generateHolisticImageSuggestions } from '../services/geminiService';

interface MainStageProps {
  slide: Slide | null;
  theme: Theme;
  activeWabiSabiLayout?: string;
  onRegenerateSlide?: (mode: 'same' | 'varied') => void;
  onRegenerateAll?: (mode: 'same' | 'varied') => void;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  printMode?: boolean;
  viewMode?: 'standard' | 'wabi-sabi';
  // AI Refinement Props
  onRefineContent?: (type: 'tone' | 'content', subType: string) => Promise<void>;
  onEnhanceImage?: (preset: ImageStylePreset) => Promise<void>;
  isRefining?: boolean;
  // Dashboard Props
  savedDecks?: Presentation[];
  onLoadDeck?: (id: string) => void;
  onDeleteDeck?: (id: string) => void;
  onCloneDeck?: (id: string) => void;
  onCreateDeck?: () => void;
  onImport?: (file: File) => void;
  onIdeate?: () => void;
  // Presentation context for image prompt toolbar
  presentation?: Presentation | null;
  activeSlideIndex?: number;
}

export const MainStage: React.FC<MainStageProps> = ({
    slide,
    theme,
    activeWabiSabiLayout,
    onRegenerateSlide,
    onRegenerateAll,
    onUpdateSlide,
    printMode = false,
    viewMode = 'standard',
    onRefineContent,
    onEnhanceImage,
    isRefining = false,
    savedDecks = [],
    onLoadDeck,
    onDeleteDeck,
    onCloneDeck,
    onCreateDeck,
    onImport,
    onIdeate,
    presentation,
    activeSlideIndex = 0
}) => {
  // Speaker Notes Panel state
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const toggleNotesPanel = () => setShowNotesPanel(prev => !prev);

  // Generate suggestions callback for the image prompt toolbar
  const handleGenerateSuggestions = useCallback(async (): Promise<string[]> => {
    if (!presentation) return [];
    return generateHolisticImageSuggestions(presentation, activeSlideIndex);
  }, [presentation, activeSlideIndex]);

  // Regenerate image handler
  const handleRegenerateImage = useCallback(() => {
    onRegenerateSlide?.('same');
  }, [onRegenerateSlide]);

  // 1. Dashboard (Empty State Replaced)
  if (!slide) {
    return (
        <Dashboard
            savedDecks={savedDecks}
            onLoad={onLoadDeck || (() => {})}
            onDelete={onDeleteDeck || (() => {})}
            onClone={onCloneDeck}
            onCreateNew={onCreateDeck || (() => {})}
            onImport={onImport || (() => {})}
            onIdeate={onIdeate}
        />
    );
  }

  // 2. Wabi-Sabi Mode (Generative Design System)
  if (viewMode === 'wabi-sabi') {
      return (
        <>
            <WabiSabiStage
                slide={slide}
                theme={theme}
                layoutStyle={activeWabiSabiLayout}
                onUpdateSlide={onUpdateSlide}
                printMode={printMode}
                onToggleNotes={toggleNotesPanel}
                presentation={presentation}
                onRegenerateImage={handleRegenerateImage}
                onGenerateSuggestions={handleGenerateSuggestions}
            />
            {/* Speaker Notes Panel - works in both modes */}
            {showNotesPanel && !printMode && onUpdateSlide && (
                <SpeakerNotesPanel
                    slide={slide}
                    onUpdateSlide={onUpdateSlide}
                    onClose={() => setShowNotesPanel(false)}
                />
            )}
        </>
      );
  }

  // 3. Standard Layout Selection
  const renderLayout = () => {
    const LayoutComponent = {
        'split': SplitLayout,
        'full-bleed': FullBleedLayout,
        'statement': StatementLayout,
        'gallery': GalleryLayout,
        'card': CardLayout,
        'horizontal': HorizontalLayout,
        'magazine': MagazineLayout
    }[slide.layoutType] || SplitLayout;

    return (
        <LayoutComponent slide={slide} theme={theme} printMode={printMode}>
            <SlideContentEditor slide={slide} theme={theme} onUpdateSlide={onUpdateSlide} printMode={printMode} />
        </LayoutComponent>
    );
  };

  // 4. Main Render
  return (
    <div className={`w-full h-full relative group/stage ${printMode ? '' : 'transition-colors duration-500'}`} style={{ background: theme.colors.background }}>
        
        {/* Render the selected layout structure */}
        {renderLayout()}

        {/* Floating Toolbar (Only visible in Standard edit mode) */}
        {!printMode && onUpdateSlide && viewMode === 'standard' && (
            <LayoutToolbar
                slide={slide}
                onUpdateSlide={onUpdateSlide}
                onRefineContent={onRefineContent}
                onEnhanceImage={onEnhanceImage}
                isRefining={isRefining}
                onToggleNotes={toggleNotesPanel}
                presentation={presentation}
                onRegenerateImage={handleRegenerateImage}
                onGenerateSuggestions={handleGenerateSuggestions}
            />
        )}

        {/* Speaker Notes Panel - works in both modes */}
        {showNotesPanel && !printMode && onUpdateSlide && (
            <SpeakerNotesPanel
                slide={slide}
                onUpdateSlide={onUpdateSlide}
                onClose={() => setShowNotesPanel(false)}
            />
        )}

        {/* Action Buttons (Only visible in edit mode) */}
        {!printMode && onRegenerateSlide && (
            // Z-Index boosted to 200 to ensure visibility over Wabi-Sabi layers (which go up to 100)
            <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover/stage:opacity-100 transition-all duration-150 translate-x-4 group-hover/stage:translate-x-0 z-[200]">
                <button onClick={() => onRegenerateSlide('same')} className="p-2.5 bg-black/80 backdrop-blur-md hover:bg-[#c5a47e] border border-white/20 text-white hover:text-black transition-all duration-150 group/btn relative" title="Regenerate Image">
                    <RotateCw className="w-4 h-4" />
                    <span className="absolute right-full mr-2 top-1.5 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Redraw</span>
                </button>
                <button onClick={() => onRegenerateSlide('varied')} className="p-2.5 bg-black/80 backdrop-blur-md hover:bg-[#c5a47e] border border-white/20 text-white hover:text-black transition-all duration-150 group/btn relative" title="Remix Image">
                    <Wand2 className="w-4 h-4" />
                    <span className="absolute right-full mr-2 top-1.5 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Remix</span>
                </button>
                {onRegenerateAll && (
                     <button onClick={() => onRegenerateAll('same')} className="p-2.5 bg-black/80 backdrop-blur-md hover:bg-[#c5a47e] border border-white/20 text-white hover:text-black transition-all duration-150 group/btn relative mt-2" title="Regenerate All Images">
                        <Layers className="w-4 h-4" />
                        <span className="absolute right-full mr-2 top-1.5 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">Regen All</span>
                    </button>
                )}
            </div>
        )}
    </div>
  );
};