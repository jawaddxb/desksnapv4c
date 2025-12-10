import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TalaveraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const talavera = {
        cobalt: '#0047ab',
        terracotta: '#e2725b',
        yellow: '#ffd700',
        cream: '#faf6e9',
        green: '#228b22'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: talavera.cream }}>
            {/* Tile pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="talavera-tile" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill={talavera.cream} />
                        <circle cx="25" cy="25" r="20" fill="none" stroke={talavera.cobalt} strokeWidth="2" />
                        <path d="M25 5 L25 15 M25 35 L25 45 M5 25 L15 25 M35 25 L45 25" stroke={talavera.terracotta} strokeWidth="2" />
                        <circle cx="25" cy="25" r="8" fill={talavera.cobalt} />
                        <circle cx="25" cy="25" r="4" fill={talavera.yellow} />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
                <rect x="0" y="calc(100% - 40px)" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
            </svg>

            {/* Hand-painted style border */}
            <div className="absolute inset-8 border-4 pointer-events-none" style={{
                borderColor: talavera.cobalt,
                borderStyle: 'double',
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Corner florals */}
                {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 rounded-full`} style={{ background: talavera.terracotta, border: `2px solid ${talavera.cobalt}` }} />
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header line */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
                        <div className="h-1 flex-1" style={{ background: talavera.cobalt }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: talavera.cobalt }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative footer */}
                    <div className="flex items-center gap-2 mt-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.yellow }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.cobalt }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: talavera.terracotta }} />
                    </div>
                </div>

                {/* Scalloped frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{
                        background: talavera.cobalt,
                        clipPath: 'polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 5%)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
                        border: `3px solid ${talavera.terracotta}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
