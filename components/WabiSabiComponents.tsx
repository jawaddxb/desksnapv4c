
import React from 'react';
import { Slide, Theme, ContentType } from '@/types';
import { SmartText } from './SmartText';
import { LayoutLayer } from '@/config/zIndex';
import { PRNG } from '@/lib/utils';
import { TextRole, getTextConfigWithOverrides } from '@/lib/wabiSabiText';
import { applyFontScale } from '@/lib/textPresets';
import { useTextSelection } from '@/contexts/TextSelectionContext';
import { BulletRenderer } from './content';

export interface ArchetypeProps {
    slide: Slide;
    theme: Theme;
    contrast: {
        bg: string;
        text: string;
        accent: string;
        secondary: string;
        border: string;
        mode: string;
    };
    rng?: PRNG; // Optional - only ~15 of 118 archetypes use RNG
    onUpdateSlide?: (updates: Partial<Slide>) => void;
    readOnly?: boolean;
}

export const DecorativeLabel = ({ text, className = "", style = {} }: { text: string, className?: string, style?: any }) => (
    <div className={`text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 flex items-center gap-2 ${className}`} style={{ zIndex: LayoutLayer.DECORATION, ...style }}>
        {text}
    </div>
);

/**
 * EditableTitle - Content-First Title Component
 *
 * Renders title at a preferred font size. Container expands to fit.
 * Supports style overrides from slide.textStyles.title
 */
export const EditableTitle = ({
    slide, theme, contrast, onUpdateSlide,
    className = "", style = {}, readOnly,
    role = 'headline' as TextRole,
    overrides,
}: any) => {
    const config = getTextConfigWithOverrides(role, overrides);
    const titleStyle = slide.textStyles?.title;

    // Selection integration for per-item styling
    const { selection, setSelection } = useTextSelection();
    const isSelected = selection?.type === 'title';

    return (
        <SmartText
            value={slide.title}
            onChange={(val) => onUpdateSlide?.({ title: val })}
            readOnly={readOnly}
            fontSize={applyFontScale(slide.titleFontSize ?? config.preferredFontSize, slide.fontScale)}
            lineHeight={config.lineHeight}
            fontWeight={titleStyle?.fontWeight}
            fontStyle={titleStyle?.fontStyle}
            textAlign={titleStyle?.textAlign}
            isSelected={isSelected}
            onSelect={() => setSelection({ type: 'title' })}
            className={`font-bold relative ${className}`}
            style={{
                fontFamily: theme.fonts.heading,
                color: contrast.text,
                zIndex: style.zIndex || LayoutLayer.CONTENT_HERO,
                ...style
            }}
        />
    );
};

/**
 * EditableContent - Content-First Body Text Component
 *
 * Renders content items at preferred font size. Container expands to fit.
 * Supports style overrides from slide.textStyles.content and per-item styles
 */
export const EditableContent = ({
    slide, theme, contrast, onUpdateSlide,
    className = "", style = {}, bullet = true, readOnly,
    role = 'body' as TextRole,
}: any) => {
    const config = getTextConfigWithOverrides(role);
    const contentStyle = slide.textStyles?.content;

    // Selection integration for per-item styling
    const { selection, setSelection } = useTextSelection();

    // Helper to get per-item or fallback styles
    const getItemStyle = (index: number) => {
        const itemStyle = slide.contentItemStyles?.[index];
        const baseSize = itemStyle?.fontSize ?? slide.contentFontSize ?? config.preferredFontSize;
        return {
            fontSize: applyFontScale(baseSize, slide.fontScale, 12, 48),
            fontWeight: itemStyle?.fontWeight ?? contentStyle?.fontWeight,
            fontStyle: itemStyle?.fontStyle ?? contentStyle?.fontStyle,
        };
    };

    return (
        <div
            className={`space-y-2 relative flex flex-col ${className}`}
            style={{
                zIndex: style.zIndex || LayoutLayer.CONTENT_BASE,
                ...style
            }}
        >
            {slide.content.map((item: string, i: number) => {
                const isSelected = selection?.type === 'content' && selection.index === i;
                const itemStyles = getItemStyle(i);
                const contentType: ContentType = slide.contentType || 'bullets';

                return (
                    <div
                        key={i}
                        className="flex gap-3 group relative items-start"
                    >
                        {bullet && contentType !== 'plain' && (
                            <BulletRenderer
                                theme={theme}
                                contentType={contentType}
                                index={i}
                                size={6}
                            />
                        )}
                        <div className="flex-1 relative">
                            <SmartText
                                value={item}
                                onChange={(val) => {
                                    const newC = [...slide.content];
                                    newC[i] = val;
                                    onUpdateSlide?.({ content: newC });
                                }}
                                readOnly={readOnly}
                                fontSize={itemStyles.fontSize}
                                lineHeight={config.lineHeight}
                                fontWeight={itemStyles.fontWeight}
                                fontStyle={itemStyles.fontStyle}
                                textAlign={contentStyle?.textAlign}
                                isSelected={isSelected}
                                onSelect={() => setSelection({ type: 'content', index: i })}
                                className="w-full bg-transparent outline-none"
                                style={{
                                    fontFamily: theme.fonts.body,
                                    color: contrast.text,
                                    opacity: 0.9,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * MagazineLayout - Editorial-style layout with overlapping elements
 */
export const MagazineLayout = ({
    titleNode,
    contentNode,
    footerNode,
    alignRight = false,
    className = ""
}: {
    titleNode: React.ReactNode,
    contentNode: React.ReactNode,
    footerNode?: React.ReactNode,
    alignRight?: boolean,
    className?: string
}) => {
    return (
        <div className={`flex flex-col h-full ${alignRight ? 'items-end text-right' : 'items-start text-left'} ${className}`}>
            <div className="relative pointer-events-auto w-full flex-1 mb-[-2rem] md:mb-[-4rem]" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {titleNode}
            </div>

            <div
                className={`
                    relative flex flex-col md:flex-row gap-8 md:items-end max-w-4xl
                    backdrop-blur-xl bg-white/10 p-6 rounded-lg border border-white/10
                    shadow-2xl pointer-events-auto shrink-0
                    ${alignRight ? 'mr-4 md:mr-12 md:flex-row-reverse' : 'ml-4 md:ml-12'}
                `}
                style={{ zIndex: LayoutLayer.CONTENT_HERO }}
            >
                {contentNode}
                {footerNode && (
                    <>
                        <div className="hidden md:block w-px h-24 bg-white/20 shrink-0" />
                        <div className="flex-1 opacity-80 text-xs leading-relaxed max-w-xs">
                            {footerNode}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
