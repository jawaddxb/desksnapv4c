
import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';

interface SlideContentEditorProps {
    slide: Slide;
    theme: Theme;
    onUpdateSlide?: (updates: Partial<Slide>) => void;
    printMode?: boolean;
}

// --- FONT SCALING UTILS ---

const getDynamicFontSize = (text: string, layout: Slide['layoutType'], type: 'heading' | 'body', fontScale: Slide['fontScale'] = 'auto') => {
    const len = text.length;
    
    // Manual overrides
    if (fontScale === 'hero') return type === 'heading' ? 'text-7xl md:text-9xl' : 'text-2xl md:text-3xl';
    if (fontScale === 'compact') return type === 'heading' ? 'text-2xl md:text-3xl' : 'text-sm md:text-base';
    if (fontScale === 'classic') return type === 'heading' ? 'text-4xl md:text-5xl' : 'text-lg md:text-xl';
    if (fontScale === 'modern') return type === 'heading' ? 'text-5xl md:text-6xl' : 'text-xl md:text-2xl';

    // Auto sizing logic
    if (type === 'heading') {
        if (layout === 'statement') {
            return len < 20 ? 'text-6xl md:text-8xl' : len < 50 ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl';
        }
        if (layout === 'full-bleed') {
            return len < 30 ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl';
        }
        return len < 30 ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl';
    }
    
    // Body text sizing
    if (layout === 'statement') return 'text-xl md:text-2xl';
    if (layout === 'gallery') return 'text-sm md:text-base';
    return 'text-lg md:text-xl';
};

export const SlideContentEditor: React.FC<SlideContentEditorProps> = ({ slide, theme, onUpdateSlide, printMode }) => {
    const headingSize = getDynamicFontSize(slide.title, slide.layoutType, 'heading', slide.fontScale);
    const bodySize = getDynamicFontSize(slide.content.join(' '), slide.layoutType, 'body', slide.fontScale);
    const isStatement = slide.layoutType === 'statement';
    const isGallery = slide.layoutType === 'gallery';
    const isFullBleed = slide.layoutType === 'full-bleed';

    const updateTitle = (newTitle: string) => onUpdateSlide?.({ title: newTitle });
    const updateContent = (index: number, newText: string) => {
        if (!onUpdateSlide) return;
        const newContent = [...slide.content];
        newContent[index] = newText;
        onUpdateSlide({ content: newContent });
    };

    // Gallery has a unique DOM structure
    if (isGallery) {
        return (
            <>
                <div className="flex-1">
                    <SmartText
                        value={slide.title} onChange={updateTitle} readOnly={printMode}
                        className="text-2xl md:text-4xl font-bold leading-snug bg-transparent outline-none"
                        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text, textTransform: theme.layout.headingTransform as any }}
                    />
                </div>
                <div className="flex-1 border-l-2 pl-6" style={{ borderColor: theme.colors.accent }}>
                    <ul className="space-y-2">
                        {slide.content.map((point, idx) => (
                            <li key={idx} className="flex">
                                <SmartText
                                    value={point} onChange={(val) => updateContent(idx, val)} readOnly={printMode}
                                    className="text-sm font-medium opacity-80 bg-transparent outline-none"
                                    style={{ fontFamily: theme.fonts.body, color: theme.colors.secondary }}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        );
    }

    // Standard Render (Split, Full-Bleed, Statement)
    return (
        <div className={`w-full space-y-6 ${isStatement || (isFullBleed && slide.alignment === 'center') ? 'items-center' : ''}`}>
             <SmartText 
                value={slide.title} onChange={updateTitle} readOnly={printMode}
                className={`mb-6 tracking-tight leading-snug ${headingSize} ${isFullBleed ? 'drop-shadow-lg' : ''} ${isStatement || (isFullBleed && slide.alignment === 'center') ? 'text-center' : ''} ${(isFullBleed && slide.alignment === 'right') ? 'text-right' : ''}`}
                style={{ 
                    fontFamily: theme.fonts.heading, color: theme.colors.text,
                    textTransform: theme.layout.headingTransform as any, fontWeight: theme.layout.headingWeight,
                    textShadow: isFullBleed && theme.id !== 'neoBrutalist' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
            />

            {!isStatement && (
                <div className="w-16 h-1.5 rounded-full mb-8" style={{ backgroundColor: theme.colors.accent }} />
            )}

            <ul className={`w-full ${isStatement ? 'flex flex-wrap justify-center gap-4' : 'space-y-4'}`}>
                {slide.content.map((point, idx) => (
                    <li key={idx} 
                        className={`flex items-start gap-3 font-medium leading-relaxed group relative ${bodySize} ${isStatement ? 'bg-black/5 px-6 py-3 rounded-full' : ''}`}
                        style={{ fontFamily: theme.fonts.body, color: isStatement ? theme.colors.text : theme.colors.secondary, backgroundColor: isStatement ? `${theme.colors.accent}15` : 'transparent' }}
                    >
                        {!isStatement && <span className="w-1.5 h-1.5 mt-2.5 shrink-0 rounded-full opacity-60" style={{ backgroundColor: theme.colors.accent }} />}
                        <SmartText 
                            value={point} onChange={(val) => updateContent(idx, val)} readOnly={printMode}
                            className={`bg-transparent outline-none w-full ${isStatement ? 'text-center' : ''}`}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
