
import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';
import { TEXT_PRESETS } from '../lib/textPresets';

interface SlideContentEditorProps {
    slide: Slide;
    theme: Theme;
    onUpdateSlide?: (updates: Partial<Slide>) => void;
    printMode?: boolean;
}

export const SlideContentEditor: React.FC<SlideContentEditorProps> = ({ slide, theme, onUpdateSlide, printMode }) => {
    const isStatement = slide.layoutType === 'statement';
    const isGallery = slide.layoutType === 'gallery';
    const isFullBleed = slide.layoutType === 'full-bleed';
    const isCenter = slide.alignment === 'center';
    const isRight = slide.alignment === 'right';

    const updateTitle = (newTitle: string) => onUpdateSlide?.({ title: newTitle });
    const updateContent = (index: number, newText: string) => {
        if (!onUpdateSlide) return;
        const newContent = [...slide.content];
        newContent[index] = newText;
        onUpdateSlide({ content: newContent });
    };

    // Use standardized text presets for consistent sizing
    const MAX_TITLE_SIZE = TEXT_PRESETS.title.maxFontSize;
    const MAX_BODY_SIZE = TEXT_PRESETS.body.maxFontSize;

    // Gallery Render
    if (isGallery) {
        return (
            <div className="flex flex-col h-full gap-6 overflow-hidden">
                <div className="flex-[0.4] min-h-0 relative w-full shrink-0 overflow-hidden">
                    <SmartText
                        value={slide.title} 
                        onChange={updateTitle} 
                        readOnly={printMode}
                        autoFit={true}
                        maxFontSize={140}
                        minFontSize={32} 
                        className="font-bold bg-transparent outline-none p-0"
                        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text, textTransform: theme.layout.headingTransform as any, lineHeight: 0.95 }}
                    />
                </div>
                <div className="flex-1 min-h-0 border-l-2 pl-6 overflow-hidden flex flex-col gap-4 w-full shrink-0" style={{ borderColor: theme.colors.accent }}>
                     {slide.content.map((point, idx) => (
                        <div key={idx} className="flex-1 min-h-0 relative w-full overflow-hidden shrink-0">
                             <SmartText
                                value={point} onChange={(val) => updateContent(idx, val)} readOnly={printMode}
                                autoFit={true}
                                maxFontSize={42}
                                minFontSize={18} 
                                className="font-medium opacity-90 bg-transparent outline-none p-0"
                                style={{ fontFamily: theme.fonts.body, color: theme.colors.secondary, lineHeight: 1.2 }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Standard Render (Split, Full-Bleed, Statement)
    return (
        <div className={`w-full h-full flex flex-col overflow-hidden ${isStatement || (isFullBleed && isCenter) ? 'items-center' : ''}`}>
             
             {/* Title Region - INCREASED ALLOCATION TO 55% */}
             <div className={`w-full ${isStatement ? 'h-[60%]' : 'h-[55%]'} min-h-[30%] relative mb-4 shrink-0 overflow-hidden`}>
                <SmartText 
                    value={slide.title} 
                    onChange={updateTitle} 
                    readOnly={printMode}
                    autoFit={true}
                    maxFontSize={MAX_TITLE_SIZE}
                    minFontSize={56} // Higher floor prevents "tiny" text
                    className={`p-0 ${isFullBleed ? 'drop-shadow-lg' : ''} ${isStatement || (isFullBleed && isCenter) ? 'text-center' : ''} ${(isFullBleed && isRight) ? 'text-right' : ''}`}
                    style={{ 
                        fontFamily: theme.fonts.heading, 
                        color: theme.colors.text,
                        textTransform: theme.layout.headingTransform as any, 
                        fontWeight: theme.layout.headingWeight,
                        textShadow: isFullBleed && theme.id !== 'neoBrutalist' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                        lineHeight: 0.9 // Ultra-tight leading for big impact
                    }}
                />
            </div>

            {!isStatement && (
                <div className="w-24 h-3 rounded-full mb-8 shrink-0" style={{ backgroundColor: theme.colors.accent }} />
            )}

            {/* Content Region */}
            <div className={`w-full flex-1 min-h-0 flex flex-col overflow-hidden shrink-0 ${isStatement ? 'items-center justify-center gap-2' : 'gap-4'}`}>
                {slide.content.map((point, idx) => (
                    <div key={idx} 
                        className={`relative min-h-0 flex items-start gap-4 group w-full overflow-hidden shrink-0 ${isStatement ? 'h-auto max-h-[30%]' : 'flex-1'}`}
                    >
                         {!isStatement && <span className="w-2.5 h-2.5 mt-4 shrink-0 rounded-full opacity-80" style={{ backgroundColor: theme.colors.accent }} />}
                        
                        <div className={`flex-1 h-full relative overflow-hidden ${isStatement ? 'bg-black/5 px-8 py-3 rounded-full' : ''}`} style={{ backgroundColor: isStatement ? `${theme.colors.accent}15` : 'transparent' }}>
                            <SmartText 
                                value={point} 
                                onChange={(val) => updateContent(idx, val)} 
                                readOnly={printMode}
                                autoFit={true}
                                maxFontSize={MAX_BODY_SIZE}
                                minFontSize={28} // Higher floor
                                className={`bg-transparent outline-none w-full p-0 ${isStatement ? 'text-center' : ''}`}
                                style={{ 
                                    fontFamily: theme.fonts.body, 
                                    color: isStatement ? theme.colors.text : theme.colors.secondary,
                                    lineHeight: 1.15
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
