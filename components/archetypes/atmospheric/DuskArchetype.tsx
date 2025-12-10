import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const DuskArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const dusk = {
        amber: '#ff8c00',
        purple: '#4b0082',
        blue: '#191970',
        gold: '#ffd700',
        cream: '#fff8e7'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${dusk.amber} 0%, ${dusk.purple} 50%, ${dusk.blue} 100%)`
        }}>
            {/* Sun ray light beams */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <radialGradient id="sun-glow" cx="50%" cy="30%" r="50%">
                        <stop offset="0%" stopColor={dusk.gold} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={dusk.gold} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <ellipse cx="50%" cy="30%" rx="30%" ry="20%" fill="url(#sun-glow)" />
                {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI;
                    return (
                        <line key={i} x1="50%" y1="30%" x2={`${50 + 50 * Math.cos(angle)}%`} y2={`${30 + 40 * Math.sin(angle)}%`}
                              stroke={dusk.gold} strokeWidth="2" opacity="0.3" />
                    );
                })}
            </svg>

            {/* Silhouette horizon */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none" style={{
                background: dusk.blue,
                clipPath: 'polygon(0% 60%, 10% 50%, 20% 65%, 30% 45%, 40% 55%, 50% 40%, 60% 55%, 70% 45%, 80% 60%, 90% 50%, 100% 55%, 100% 100%, 0% 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Warm glowing image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full opacity-50" style={{
                        background: `radial-gradient(circle, ${dusk.gold} 0%, transparent 70%)`
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${dusk.gold}40`,
                        boxShadow: `0 0 40px ${dusk.gold}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: dusk.gold }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: dusk.cream }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e0d0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Warm-to-cool transition dots */}
                    <div className="flex gap-2 mt-8">
                        {[dusk.gold, dusk.amber, dusk.purple, dusk.blue].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
