import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BatikArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const batik = {
        indigo: '#1a237e',
        brown: '#5d4037',
        cream: '#faf8f0',
        tan: '#d7ccc8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: batik.cream }}>
            {/* Crackle texture overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 48 50 52 T100 48 T150 55 T200 50' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 100 Q30 95 60 105 T120 98 T180 102 T200 100' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 150 Q20 148 40 152 T80 147 T120 153 T160 149 T200 151' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
            }} />

            {/* Organic flowing pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="batik-flow" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M60 10 Q90 30 60 60 Q30 90 60 110" fill="none" stroke={batik.indigo} strokeWidth="2" />
                        <path d="M10 60 Q30 30 60 60 Q90 90 110 60" fill="none" stroke={batik.brown} strokeWidth="2" />
                        <circle cx="60" cy="60" r="8" fill="none" stroke={batik.indigo} strokeWidth="1.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#batik-flow)" />
            </svg>

            {/* Wax drip edge effect - left side */}
            <div className="absolute left-0 top-0 w-4 h-full" style={{
                zIndex: LayoutLayer.DECORATION,
                background: batik.indigo,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 3%, 80% 5%, 100% 8%, 70% 12%, 100% 15%, 90% 20%, 100% 25%, 60% 30%, 100% 35%, 80% 40%, 100% 45%, 70% 50%, 100% 55%, 90% 60%, 100% 65%, 60% 70%, 100% 75%, 80% 80%, 100% 85%, 70% 90%, 100% 95%, 80% 100%, 0% 100%)'
            }} />

            <div className="w-full h-full p-12 md:p-20 pl-16 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: batik.indigo }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: batik.indigo }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: batik.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    <div className="flex gap-2 mt-8">
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.brown }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
                    </div>
                </div>

                {/* Organic shape image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '60% 40% 50% 50% / 50% 50% 50% 50%',
                        border: `4px solid ${batik.indigo}`,
                        boxShadow: `8px 8px 0 ${batik.tan}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
