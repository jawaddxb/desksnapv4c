import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const RakuArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const raku = {
        copper: '#8b4513',
        black: '#1a1a1a',
        cream: '#f5f0e1',
        gold: '#c9a227',
        gray: '#6b6b6b'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: raku.cream }}>
            {/* Crackle glaze pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="crackle" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L25 30 L50 35 L45 60 L70 65 L60 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
                        <path d="M0 50 L30 55 L35 80 L60 75 L65 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
                        <path d="M80 0 L75 25 L100 30" fill="none" stroke={raku.black} strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#crackle)" />
            </svg>

            {/* Kiln fire marks */}
            <div className="absolute bottom-0 left-1/4 w-1/2 h-32 opacity-10 pointer-events-none" style={{
                background: `radial-gradient(ellipse at bottom, ${raku.copper} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Organic form image container */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: raku.black,
                        borderRadius: '40% 60% 55% 45% / 60% 40% 60% 40%'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '35% 65% 50% 50% / 55% 45% 55% 45%',
                        border: `3px solid ${raku.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-8 h-1" style={{ background: raku.copper }} />
                        <div className="w-4 h-1" style={{ background: raku.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: raku.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: raku.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Glaze drip accent */}
                    <svg className="w-8 h-16 mt-8" viewBox="0 0 30 60">
                        <path d="M15 0 Q20 20 15 40 Q10 50 15 60" fill="none" stroke={raku.copper} strokeWidth="3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
