import React from 'react';
import { Slide, Theme } from '../types';
import { SmartText } from './SmartText';
import { LayoutLayer } from '../lib/themes';
import { PRNG } from '../lib/utils';

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

// Wrapper that passes props to SmartText directly, ensuring robust text handling and Z-Index
export const EditableTitle = ({ slide, theme, contrast, onUpdateSlide, className = "", style = {}, readOnly }: any) => (
    <SmartText 
        value={slide.title} 
        onChange={(val) => onUpdateSlide?.({ title: val })} 
        readOnly={readOnly}
        className={`font-bold break-words whitespace-pre-wrap relative ${className}`} 
        style={{ 
            fontFamily: theme.fonts.heading, 
            color: contrast.text, 
            zIndex: LayoutLayer.CONTENT_HERO, 
            ...style 
        }} 
    />
);

export const EditableContent = ({ slide, theme, contrast, onUpdateSlide, className = "", style = {}, bullet = true, readOnly }: any) => (
    <ul className={`space-y-3 relative ${className}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
        {slide.content.map((item: string, i: number) => (
            <li key={i} className="flex gap-3 group relative items-start">
                {bullet && <span className="mt-2.5 w-1 h-1 shrink-0 rounded-full opacity-60" style={{ backgroundColor: contrast.text }} />}
                <SmartText 
                    value={item} 
                    onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }} 
                    readOnly={readOnly}
                    className="w-full break-words whitespace-pre-wrap text-sm md:text-base lg:text-lg bg-transparent outline-none" 
                    style={{ 
                        fontFamily: theme.fonts.body, 
                        color: contrast.text, 
                        opacity: 0.85, 
                        ...style 
                    }} 
                />
            </li>
        ))}
    </ul>
);

// A reusable engine for the "Magazine" overlap look
// Handles the Z-Index stacking and negative margins genericallly
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
        <div className={`flex flex-col ${alignRight ? 'items-end text-right' : 'items-start text-left'} ${className}`}>
            {/* 
               LAYER INVERSION: 
               Title is CONTENT_BASE (30) so it sits 'behind' the content box.
               This allows the massive title to act as texture/background.
            */}
            <div className="relative pointer-events-auto max-w-[95%]" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                {titleNode}
            </div>
            
            {/* 
               Content Box is CONTENT_HERO (40) so it floats ON TOP of the title.
               We use negative margins to pull it up into the title area.
            */}
            <div 
                className={`
                    relative flex flex-col md:flex-row gap-8 md:items-end max-w-4xl 
                    backdrop-blur-xl bg-white/10 p-6 rounded-lg border border-white/10 
                    shadow-2xl -mt-8 md:-mt-16 pointer-events-auto
                    ${alignRight ? 'mr-4 md:mr-12 md:flex-row-reverse' : 'ml-4 md:ml-12'}
                `}
                style={{ zIndex: LayoutLayer.CONTENT_HERO }} 
            >
                {contentNode}
                {footerNode && (
                    <>
                        <div className="hidden md:block w-px h-24 bg-white/20" />
                        <div className="flex-1 opacity-80 text-xs leading-relaxed max-w-xs">
                            {footerNode}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};