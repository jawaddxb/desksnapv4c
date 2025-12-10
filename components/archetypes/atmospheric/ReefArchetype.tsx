import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ReefArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const reef = {
        coral: '#ff6b6b',
        turquoise: '#20b2aa',
        purple: '#9370db',
        gold: '#ffd700',
        deep: '#1a3a4a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${reef.turquoise} 0%, ${reef.deep} 100%)`
        }}>
            {/* Organic coral shapes */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M50 400 Q80 350, 70 300 Q60 250, 90 200 Q100 150, 80 100" fill="none" stroke={reef.coral} strokeWidth="8" strokeLinecap="round" />
                <path d="M700 400 Q680 350, 720 300 Q740 250, 710 200" fill="none" stroke={reef.purple} strokeWidth="6" strokeLinecap="round" />
                <circle cx="100" cy="300" r="20" fill={reef.coral} opacity="0.3" />
                <circle cx="150" cy="280" r="15" fill={reef.coral} opacity="0.4" />
            </svg>

            {/* Light caustic patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="caustic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <ellipse cx="30" cy="30" rx="25" ry="15" fill="none" stroke={reef.gold} strokeWidth="1" />
                        <ellipse cx="70" cy="70" rx="20" ry="12" fill="none" stroke={reef.gold} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#caustic)" />
            </svg>

            {/* Bioluminescent hints */}
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full opacity-50" style={{
                background: reef.gold,
                boxShadow: `0 0 20px ${reef.gold}`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: reef.coral }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#b0e0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Coral color dots */}
                    <div className="flex gap-2 mt-8">
                        {[reef.coral, reef.turquoise, reef.purple, reef.gold].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>

                {/* Organic coral-shaped frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: reef.coral,
                        borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
                        opacity: 0.8
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
                        border: `3px solid ${reef.gold}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
