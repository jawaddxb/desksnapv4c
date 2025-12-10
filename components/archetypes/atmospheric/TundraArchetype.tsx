import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TundraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tundra = {
        ice: '#e0f7fa',
        blue: '#b3e5fc',
        white: '#ffffff',
        gray: '#b0bec5',
        dark: '#37474f'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: tundra.ice }}>
            {/* Crystalline frost patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="frost" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 L30 60 M0 30 L60 30 M10 10 L50 50 M50 10 L10 50" fill="none" stroke={tundra.blue} strokeWidth="1" />
                        <circle cx="30" cy="30" r="3" fill={tundra.blue} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#frost)" />
            </svg>

            {/* Aurora subtle hints */}
            <div className="absolute top-0 left-0 w-full h-1/3 opacity-10 pointer-events-none" style={{
                background: `linear-gradient(to bottom, #7fffd4 0%, #00ced1 30%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Cold minimal stark lines */}
            <div className="absolute top-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Ice crystal framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: tundra.white,
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: tundra.dark }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: tundra.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 300, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: tundra.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Crystal dots */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rotate-45" style={{ background: tundra.blue }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
