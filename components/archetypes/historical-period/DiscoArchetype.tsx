import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const DiscoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const disco = {
        gold: '#ffd700',
        silver: '#c0c0c0',
        purple: '#8b008b',
        pink: '#ff1493',
        black: '#0a0a0a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: disco.black }}>
            {/* Mirror ball reflection pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(20)].map((_, i) => {
                    const x = rng?.range(0, 100) ?? Math.random() * 100;
                    const y = rng?.range(0, 100) ?? Math.random() * 100;
                    const size = rng?.range(2, 8) ?? 2 + Math.random() * 6;
                    const color = rng?.pick([disco.gold, disco.silver, disco.pink]) ?? disco.gold;
                    const delay = rng?.range(0, 2) ?? Math.random() * 2;
                    return (
                        <div key={i} className="absolute rounded-full animate-pulse"
                             style={{
                                 left: `${x}%`,
                                 top: `${y}%`,
                                 width: `${size}px`,
                                 height: `${size}px`,
                                 background: color,
                                 animationDelay: `${delay}s`
                             }} />
                    );
                })}
            </div>

            {/* Starburst light rays */}
            <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <radialGradient id="disco-ray" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={disco.gold} stopOpacity="1" />
                        <stop offset="100%" stopColor={disco.gold} stopOpacity="0" />
                    </radialGradient>
                </defs>
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <line key={i} x1="50%" y1="50%" x2={`${50 + 50 * Math.cos(angle * Math.PI / 180)}%`} y2={`${50 + 50 * Math.sin(angle * Math.PI / 180)}%`}
                          stroke="url(#disco-ray)" strokeWidth="3" />
                ))}
            </svg>

            {/* Metallic gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-2" style={{
                background: `linear-gradient(to right, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-full h-2" style={{
                background: `linear-gradient(to right, ${disco.purple}, ${disco.pink}, ${disco.silver}, ${disco.gold}, ${disco.purple})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Disco ball image frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full" style={{
                        background: `conic-gradient(from 0deg, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
                        opacity: 0.8
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${disco.silver}`,
                        boxShadow: `0 0 30px ${disco.gold}40, 0 0 60px ${disco.pink}20`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: disco.gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-8xl mb-8 uppercase tracking-widest"
                        style={{
                            fontWeight: 900,
                            lineHeight: '1.0',
                            background: `linear-gradient(135deg, ${disco.gold}, ${disco.silver}, ${disco.pink})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Sparkle decoration */}
                    <div className="flex gap-4 mt-8">
                        {[disco.gold, disco.silver, disco.pink, disco.purple].map((color, i) => (
                            <div key={i} className="w-3 h-3 rotate-45" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
