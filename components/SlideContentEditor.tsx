
import React from 'react';
import { Slide, Theme, ContentType } from '@/types';
import { SmartText } from './SmartText';
import { applyFontScale } from '@/lib/textPresets';
import { ContentItem } from './content';
import { DEFAULT_CONTENT_STYLE } from '@/config/contentStyles';

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

    // Style overrides from slide data
    const titleStyle = slide.textStyles?.title;
    const contentStyle = slide.textStyles?.content;

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
                        fontSize={applyFontScale(slide.titleFontSize ?? 72, slide.fontScale)}
                        lineHeight={0.95}
                        fontWeight={titleStyle?.fontWeight}
                        fontStyle={titleStyle?.fontStyle}
                        textAlign={titleStyle?.textAlign}
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
                                fontSize={applyFontScale(slide.contentFontSize ?? 24, slide.fontScale, 12, 48)}
                                lineHeight={1.2}
                                fontWeight={contentStyle?.fontWeight}
                                fontStyle={contentStyle?.fontStyle}
                                textAlign={contentStyle?.textAlign}
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
    // Calculate default font sizes based on layout
    const defaultTitleSize = isStatement ? 80 : 64;
    const defaultContentSize = isStatement ? 24 : 20;

    return (
        <div className={`w-full h-full flex flex-col ${isStatement || (isFullBleed && isCenter) ? 'items-center' : ''}`}>

            {/* Title Region */}
            <div className={`w-full shrink-0 mb-4 ${isStatement ? 'text-center' : ''}`}>
                <SmartText
                    value={slide.title}
                    onChange={updateTitle}
                    readOnly={printMode}
                    fontSize={applyFontScale(slide.titleFontSize ?? defaultTitleSize, slide.fontScale)}
                    lineHeight={0.9}
                    fontWeight={titleStyle?.fontWeight ?? (parseInt(theme.layout.headingWeight) || undefined)}
                    fontStyle={titleStyle?.fontStyle}
                    textAlign={titleStyle?.textAlign}
                    className={`p-0 ${isFullBleed ? 'drop-shadow-lg' : ''} ${isStatement || (isFullBleed && isCenter) ? 'text-center' : ''} ${(isFullBleed && isRight) ? 'text-right' : ''}`}
                    style={{
                        fontFamily: theme.fonts.heading,
                        color: theme.colors.text,
                        textTransform: theme.layout.headingTransform as any,
                        textShadow: isFullBleed && theme.id !== 'neoBrutalist' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                    }}
                />
            </div>

            {!isStatement && (
                <div className="w-24 h-3 rounded-full mb-8 shrink-0" style={{ backgroundColor: theme.colors.accent }} />
            )}

            {/* Content Region */}
            <div
                className={`w-full flex flex-col ${isStatement ? 'items-center justify-center' : ''}`}
                style={{ gap: theme.contentStyle?.itemSpacing ?? DEFAULT_CONTENT_STYLE.itemSpacing ?? 12 }}
            >
                {slide.content.map((point, idx) => {
                    const contentType: ContentType = slide.contentType || 'bullets';

                    return (
                        <ContentItem
                            key={idx}
                            theme={theme}
                            contentType={contentType}
                            index={idx}
                            isStatement={isStatement}
                        >
                            <SmartText
                                value={point}
                                onChange={(val) => updateContent(idx, val)}
                                readOnly={printMode}
                                fontSize={applyFontScale(slide.contentFontSize ?? defaultContentSize, slide.fontScale, 12, 48)}
                                lineHeight={1.15}
                                fontWeight={contentStyle?.fontWeight}
                                fontStyle={contentStyle?.fontStyle}
                                textAlign={contentStyle?.textAlign ?? (isStatement ? 'center' : undefined)}
                                className={`bg-transparent outline-none w-full p-0 ${isStatement ? 'text-center' : ''}`}
                                style={{
                                    fontFamily: theme.fonts.body,
                                    color: isStatement ? theme.colors.text : theme.colors.secondary,
                                }}
                            />
                        </ContentItem>
                    );
                })}
            </div>
        </div>
    );
};
