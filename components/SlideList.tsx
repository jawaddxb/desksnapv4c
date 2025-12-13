import React from 'react';
import { Presentation, Slide, Theme } from '@/types';
import { SlideCard } from './SlideCard';
import { Grid3X3 } from 'lucide-react';
import { SYSTEM_THEME } from '@/config/themes';

interface SlideListProps {
    presentation: Presentation;
    activeSlideIndex: number;
    setActiveSlideIndex: (index: number) => void;
    onMoveSlide: (index: number, direction: 'up' | 'down') => void;
    viewMode?: 'standard' | 'wabi-sabi';
    activeWabiSabiLayout?: string;
}

export const SlideList: React.FC<SlideListProps> = ({
    presentation, activeSlideIndex, setActiveSlideIndex, onMoveSlide,
    viewMode, activeWabiSabiLayout
}) => {
    return (
        <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden animate-in fade-in duration-150 bg-black">
            <div className="h-full overflow-y-auto p-4 bg-black">
                <div className="flex items-center justify-between mb-4 px-1 flex-none">
                    <div className="flex items-center gap-2"><Grid3X3 className="w-4 h-4 text-white/40" strokeWidth={2.5} /><h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Deck Overview</h3></div>
                </div>
                {/* Compact grid layout for smaller thumbnails */}
                <div className="flex flex-wrap gap-2 pb-20">
                    {presentation.slides.map((slide, idx) => (
                        <SlideCard
                            key={slide.id}
                            slide={slide}
                            isActive={idx === activeSlideIndex}
                            onClick={() => setActiveSlideIndex(idx)}
                            theme={SYSTEM_THEME}
                            onMoveUp={idx > 0 ? () => onMoveSlide(idx, 'up') : undefined}
                            onMoveDown={idx < presentation.slides.length - 1 ? () => onMoveSlide(idx, 'down') : undefined}
                            viewMode={viewMode}
                            activeWabiSabiLayout={activeWabiSabiLayout}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};