
import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';
import { LayoutLayer } from '../lib/themes';
import { PRNG } from '../lib/utils';
import { TextRole, TextRoleConfig, getTextConfigWithOverrides } from '../lib/wabiSabiText';

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

// Unified EditableTitle using role-based config from WabiSabi text engine
export const EditableTitle = ({
    slide, theme, contrast, onUpdateSlide,
    className = "", style = {}, readOnly,
    role = 'headline' as TextRole,  // Semantic role
    overrides,  // Per-archetype customization
}: any) => {
    const config = getTextConfigWithOverrides(role, overrides);

    return (
        <SmartText
            value={slide.title}
            onChange={(val) => onUpdateSlide?.({ title: val })}
            readOnly={readOnly}
            autoFit={true}
            maxFontSize={config.maxFontSize}
            minFontSize={config.minFontSize}
            minContainerHeight={config.minContainerHeight}
            minContainerWidth={config.minContainerWidth}
            overflowBehavior={config.overflow}
            className={`font-bold relative ${className}`}
            style={{
                fontFamily: theme.fonts.heading,
                color: contrast.text,
                zIndex: style.zIndex || LayoutLayer.CONTENT_HERO,
                lineHeight: config.lineHeight,
                ...style
            }}
        />
    );
};

// Unified EditableContent with guaranteed visibility from WabiSabi text engine
export const EditableContent = ({
    slide, theme, contrast, onUpdateSlide,
    className = "", style = {}, bullet = true, readOnly,
    role = 'body' as TextRole,
}: any) => {
    const config = getTextConfigWithOverrides(role);

    return (
        <div
            className={`space-y-2 relative flex flex-col ${className}`}
            style={{
                zIndex: style.zIndex || LayoutLayer.CONTENT_BASE,
                minHeight: `${slide.content.length * (config.minContainerHeight + 8)}px`, // Guarantee space
                ...style
            }}
        >
            {slide.content.map((item: string, i: number) => (
                <div
                    key={i}
                    className="flex gap-3 group relative items-start"
                    style={{ minHeight: `${config.minContainerHeight}px` }}  // Per-item minimum
                >
                    {bullet && (
                        <span
                            className="mt-2.5 w-1 h-1 shrink-0 rounded-full opacity-60"
                            style={{ backgroundColor: contrast.text }}
                        />
                    )}
                    <div className="flex-1 relative" style={{ minHeight: `${config.minContainerHeight}px` }}>
                        <SmartText
                            value={item}
                            onChange={(val) => {
                                const newC = [...slide.content];
                                newC[i] = val;
                                onUpdateSlide?.({ content: newC });
                            }}
                            readOnly={readOnly}
                            autoFit={true}
                            maxFontSize={config.maxFontSize}
                            minFontSize={config.minFontSize}
                            minContainerHeight={config.minContainerHeight}
                            overflowBehavior={config.overflow}
                            className="w-full bg-transparent outline-none"
                            style={{
                                fontFamily: theme.fonts.body,
                                color: contrast.text,
                                opacity: 0.9,
                                lineHeight: config.lineHeight
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// A reusable engine for the "Magazine" overlap look
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
            <div className="relative pointer-events-auto w-full flex-1 min-h-0 mb-[-2rem] md:mb-[-4rem]" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {titleNode}
            </div>
            
            <div 
                className={`
                    relative flex flex-col md:flex-row gap-8 md:items-end max-w-4xl 
                    backdrop-blur-xl bg-white/10 p-6 rounded-lg border border-white/10 
                    shadow-2xl pointer-events-auto shrink-0 max-h-[50%] overflow-hidden
                    ${alignRight ? 'mr-4 md:mr-12 md:flex-row-reverse' : 'ml-4 md:ml-12'}
                `}
                style={{ zIndex: LayoutLayer.CONTENT_HERO }} 
            >
                {contentNode}
                {footerNode && (
                    <>
                        <div className="hidden md:block w-px h-24 bg-white/20 shrink-0" />
                        <div className="flex-1 opacity-80 text-xs leading-relaxed max-w-xs overflow-y-auto">
                            {footerNode}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
