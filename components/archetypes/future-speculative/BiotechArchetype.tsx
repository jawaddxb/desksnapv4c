import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BiotechArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const biotech = {
        teal: '#008b8b',
        chartreuse: '#7fff00',
        white: '#ffffff',
        gray: '#2a3a3a',
        dark: '#0a1a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: biotech.dark }}>
            {/* Cell structure patterns */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="cells" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="50" cy="50" r="40" fill="none" stroke={biotech.teal} strokeWidth="1" />
                        <circle cx="50" cy="50" r="20" fill="none" stroke={biotech.chartreuse} strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="5" fill={biotech.chartreuse} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cells)" />
            </svg>

            {/* DNA helix accents */}
            <svg className="absolute right-8 top-1/4 w-16 h-64 opacity-30 pointer-events-none" viewBox="0 0 50 200" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(10)].map((_, i) => (
                    <g key={i}>
                        <ellipse cx="25" cy={i * 20 + 10} rx="20" ry="5" fill="none" stroke={biotech.teal} strokeWidth="1" />
                    </g>
                ))}
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: biotech.chartreuse }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: biotech.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a0c0c0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Living technology dots */}
                    <div className="flex gap-2 mt-8">
                        {[biotech.teal, biotech.chartreuse, biotech.teal, biotech.chartreuse].map((color, i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>

                {/* Organic tech frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: biotech.teal,
                        borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
                        opacity: 0.5
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '55% 45% 48% 52% / 48% 55% 45% 52%',
                        border: `2px solid ${biotech.chartreuse}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
