import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const QuantumArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const quantum = {
        purple: '#2d1b4e',
        blue: '#4169e1',
        white: '#ffffff',
        glow: '#00bfff'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: quantum.purple }}>
            {/* Particle trail animations */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={quantum.glow} stopOpacity="1" />
                        <stop offset="100%" stopColor={quantum.glow} stopOpacity="0" />
                    </radialGradient>
                </defs>
                {[...Array(15)].map((_, i) => {
                    const x = rng?.range(10, 90) ?? (10 + (i * 5.3));
                    const y = rng?.range(10, 90) ?? (10 + (i * 5.7));
                    return (
                        <g key={i}>
                            <circle cx={`${x}%`} cy={`${y}%`} r="2" fill={quantum.white} />
                            <circle cx={`${x}%`} cy={`${y}%`} r="8" fill="url(#particle-glow)" opacity="0.3" />
                        </g>
                    );
                })}
                {/* Wave function patterns */}
                <path d="M0 300 Q100 250, 200 300 T400 300 T600 300 T800 300" fill="none" stroke={quantum.blue} strokeWidth="1" opacity="0.4" />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Scientific sublime image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full opacity-30" style={{
                        background: `radial-gradient(circle, ${quantum.glow} 0%, transparent 70%)`
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `2px solid ${quantum.blue}`,
                        boxShadow: `0 0 30px ${quantum.glow}30`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full" style={{ background: quantum.glow }} />
                        ))}
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: quantum.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#b0b0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Particle dots */}
                    <div className="flex gap-3 mt-8">
                        {[quantum.glow, quantum.blue, quantum.white, quantum.glow].map((color, i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
