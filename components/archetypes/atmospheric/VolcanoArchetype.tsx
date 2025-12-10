import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const VolcanoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const volcano = {
        black: '#0a0a0a',
        red: '#8b0000',
        orange: '#ff4500',
        amber: '#ff8c00',
        dark: '#1a1a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: volcano.black }}>
            {/* Lava crack pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <linearGradient id="lava-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={volcano.red} />
                        <stop offset="50%" stopColor={volcano.orange} />
                        <stop offset="100%" stopColor={volcano.amber} />
                    </linearGradient>
                </defs>
                <path d="M0 200 Q50 180, 100 200 T200 180 T300 200 L300 250 L0 250 Z" fill="url(#lava-glow)" opacity="0.5" />
                <path d="M400 100 Q450 80, 500 100 T600 80 L600 150 L400 150 Z" fill="url(#lava-glow)" opacity="0.4" />
            </svg>

            {/* Ember glow effects */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-40 pointer-events-none" style={{
                background: `linear-gradient(to top, ${volcano.red} 0%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Primal energy lines */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: volcano.red, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: volcano.orange, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Molten framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: `linear-gradient(135deg, ${volcano.red} 0%, ${volcano.orange} 50%, ${volcano.amber} 100%)`,
                        boxShadow: `0 0 30px ${volcano.red}`
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${volcano.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: volcano.orange }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: volcano.amber }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#c0c0c0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Heat gradient dots */}
                    <div className="flex gap-2 mt-8">
                        {[volcano.amber, volcano.orange, volcano.red, volcano.red].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
