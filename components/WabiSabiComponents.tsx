
import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';
import { LayoutLayer } from '../lib/themes';
import { PRNG } from '../lib/utils';
import { TextRole, getTextConfigWithOverrides } from '../lib/wabiSabiText';

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
    rng: PRNG;
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

    return (
        <SmartText
            value={slide.title}
            onChange={(val) => onUpdateSlide?.({ title: val })}
            readOnly={readOnly}
            fontSize={slide.titleFontSize ?? config.preferredFontSize}
            lineHeight={config.lineHeight}
            fontWeight={titleStyle?.fontWeight}
            fontStyle={titleStyle?.fontStyle}
            textAlign={titleStyle?.textAlign}
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
 * Supports style overrides from slide.textStyles.content
 */
export const EditableContent = ({
    slide, theme, contrast, onUpdateSlide,
    className = "", style = {}, bullet = true, readOnly,
    role = 'body' as TextRole,
}: any) => {
    const config = getTextConfigWithOverrides(role);
    const contentStyle = slide.textStyles?.content;

    return (
        <div
            className={`space-y-2 relative flex flex-col ${className}`}
            style={{
                zIndex: style.zIndex || LayoutLayer.CONTENT_BASE,
                ...style
            }}
        >
            {slide.content.map((item: string, i: number) => (
                <div
                    key={i}
                    className="flex gap-3 group relative items-start"
                >
                    {bullet && (
                        <span
                            className="mt-2.5 w-1 h-1 shrink-0 rounded-full opacity-60"
                            style={{ backgroundColor: contrast.text }}
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
                            fontSize={slide.contentFontSize ?? config.preferredFontSize}
                            lineHeight={config.lineHeight}
                            fontWeight={contentStyle?.fontWeight}
                            fontStyle={contentStyle?.fontStyle}
                            textAlign={contentStyle?.textAlign}
                            className="w-full bg-transparent outline-none"
                            style={{
                                fontFamily: theme.fonts.body,
                                color: contrast.text,
                                opacity: 0.9,
                            }}
                        />
                    </div>
                </div>
            ))}
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
