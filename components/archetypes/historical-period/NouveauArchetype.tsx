import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NouveauArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const nouveau = {
        sage: '#9dc183',
        mauve: '#e0b0ff',
        gold: '#d4af37',
        cream: '#faf8f0',
        brown: '#5d4037'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: nouveau.cream }}>
            {/* Flowing organic line borders */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <linearGradient id="nouveau-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={nouveau.sage} />
                        <stop offset="100%" stopColor={nouveau.mauve} />
                    </linearGradient>
                </defs>
                {/* Top whiplash curve */}
                <path d="M0 40 Q100 10, 200 50 T400 30 T600 60 T800 20 T1000 50 T1200 30"
                      fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
                {/* Bottom whiplash curve */}
                <path d="M0 calc(100% - 40) Q100 calc(100% - 70), 200 calc(100% - 30) T400 calc(100% - 50) T600 calc(100% - 20)"
                      fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
                {/* Vertical side flourish */}
                <path d="M30 100 Q10 200, 30 300 Q50 400, 30 500" fill="none" stroke={nouveau.gold} strokeWidth="2" opacity="0.3" />
            </svg>

            {/* Decorative corner flourishes */}
            <svg className="absolute top-4 left-4 w-24 h-24 opacity-50" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.sage} strokeWidth="3" />
                <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
            </svg>
            <svg className="absolute bottom-4 right-4 w-24 h-24 opacity-50 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.mauve} strokeWidth="3" />
                <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Mucha-style framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]" viewBox="0 0 120 150">
                        {/* Organic frame */}
                        <path d="M10 20 Q0 75, 10 130 Q60 145, 110 130 Q120 75, 110 20 Q60 5, 10 20"
                              fill="none" stroke={nouveau.gold} strokeWidth="3" />
                        <path d="M15 25 Q5 75, 15 125 Q60 138, 105 125 Q115 75, 105 25 Q60 12, 15 25"
                              fill="none" stroke={nouveau.sage} strokeWidth="2" />
                    </svg>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        borderRadius: '20% 20% 30% 30% / 5% 5% 10% 10%',
                        border: `2px solid ${nouveau.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Flowing header decoration */}
                    <svg className="w-32 h-8 mb-6" viewBox="0 0 120 30">
                        <path d="M0 15 Q30 5, 60 15 Q90 25, 120 15" fill="none" stroke={nouveau.gold} strokeWidth="2" />
                        <circle cx="60" cy="15" r="4" fill={nouveau.mauve} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: nouveau.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Flowing footer */}
                    <svg className="w-48 h-12 mt-8" viewBox="0 0 180 40">
                        <path d="M0 20 Q45 5, 90 20 Q135 35, 180 20" fill="none" stroke={nouveau.sage} strokeWidth="2" />
                        <path d="M30 20 Q90 10, 150 20" fill="none" stroke={nouveau.mauve} strokeWidth="1.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
