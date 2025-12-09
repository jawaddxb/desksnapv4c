
import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';

interface SlideContentEditorProps {
    slide: Slide;
    theme: Theme;
    onUpdateSlide?: (updates: Partial<Slide>) => void;
    printMode?: boolean;
}

/**
 * SlideContentEditor - Content-First Standard Layout Editor
 *
 * Renders slides using explicit font sizes. Container expands to fit.
 */
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

    // Gallery Render
    if (isGallery) {
        return (
            <div className="flex flex-col h-full gap-6">
                <div className="shrink-0">
                    <SmartText
                        value={slide.title}
                        onChange={updateTitle}
                        readOnly={printMode}
                        fontSize={72}
                        lineHeight={0.95}
                        className="font-bold bg-transparent outline-none p-0"
                        style={{
                            fontFamily: theme.fonts.heading,
                            color: theme.colors.text,
                            textTransform: theme.layout.headingTransform as any,
                        }}
                    />
                </div>
                <div className="flex-1 border-l-2 pl-6 flex flex-col gap-4" style={{ borderColor: theme.colors.accent }}>
                    {slide.content.map((point, idx) => (
                        <div key={idx} className="shrink-0">
                            <SmartText
                                value={point}
                                onChange={(val) => updateContent(idx, val)}
                                readOnly={printMode}
                                fontSize={24}
                                lineHeight={1.2}
                                className="font-medium opacity-90 bg-transparent outline-none p-0"
                                style={{ fontFamily: theme.fonts.body, color: theme.colors.secondary }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Standard Render (Split, Full-Bleed, Statement)
    return (
        <div className={`w-full h-full flex flex-col ${isStatement || (isFullBleed && isCenter) ? 'items-center' : ''}`}>

            {/* Title Region */}
            <div className={`w-full shrink-0 mb-4 ${isStatement ? 'text-center' : ''}`}>
                <SmartText
                    value={slide.title}
                    onChange={updateTitle}
                    readOnly={printMode}
                    fontSize={isStatement ? 80 : 64}
                    lineHeight={0.9}
                    className={`p-0 ${isFullBleed ? 'drop-shadow-lg' : ''} ${isStatement || (isFullBleed && isCenter) ? 'text-center' : ''} ${(isFullBleed && isRight) ? 'text-right' : ''}`}
                    style={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.text,
                        textTransform: theme.layout.headingTransform as any,
                        fontWeight: theme.layout.headingWeight,
                        textShadow: isFullBleed && theme.id !== 'neoBrutalist' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    }}
                />
            </div>

            {!isStatement && (
                <div className="w-24 h-3 rounded-full mb-8 shrink-0" style={{ backgroundColor: theme.colors.accent }} />
            )}

            {/* Content Region */}
            <div className={`w-full flex flex-col ${isStatement ? 'items-center justify-center gap-2' : 'gap-4'}`}>
                {slide.content.map((point, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-4 group w-full shrink-0`}
                    >
                        {!isStatement && <span className="w-2.5 h-2.5 mt-4 shrink-0 rounded-full opacity-80" style={{ backgroundColor: theme.colors.accent }} />}

                        <div className={`flex-1 ${isStatement ? 'bg-black/5 px-8 py-3 rounded-full' : ''}`} style={{ backgroundColor: isStatement ? `${theme.colors.accent}15` : 'transparent' }}>
                            <SmartText
                                value={point}
                                onChange={(val) => updateContent(idx, val)}
                                readOnly={printMode}
                                fontSize={isStatement ? 24 : 20}
                                lineHeight={1.15}
                                className={`bg-transparent outline-none w-full p-0 ${isStatement ? 'text-center' : ''}`}
                                style={{
                                    fontFamily: theme.fonts.body,
                                    color: isStatement ? theme.colors.text : theme.colors.secondary,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
