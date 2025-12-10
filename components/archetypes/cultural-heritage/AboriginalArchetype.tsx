import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AboriginalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aboriginal = {
        ochre: '#cc7722',
        terracotta: '#8b4513',
        white: '#f5f5dc',
        black: '#1a1a1a',
        red: '#8b0000'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: aboriginal.terracotta }}>
            {/* Dot pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="dot-paint" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <circle cx="5" cy="5" r="2" fill={aboriginal.white} />
                        <circle cx="15" cy="5" r="2" fill={aboriginal.ochre} />
                        <circle cx="25" cy="5" r="2" fill={aboriginal.white} />
                        <circle cx="10" cy="15" r="2" fill={aboriginal.ochre} />
                        <circle cx="20" cy="15" r="2" fill={aboriginal.white} />
                        <circle cx="5" cy="25" r="2" fill={aboriginal.white} />
                        <circle cx="15" cy="25" r="2" fill={aboriginal.ochre} />
                        <circle cx="25" cy="25" r="2" fill={aboriginal.white} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-paint)" />
            </svg>

            {/* Concentric circle motifs */}
            <svg className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[40, 32, 24, 16, 8].map((r, i) => (
                    <circle key={i} cx="64" cy="64" r={r} fill="none"
                            stroke={i % 2 === 0 ? aboriginal.white : aboriginal.ochre} strokeWidth="3" />
                ))}
            </svg>

            <svg className="absolute bottom-12 right-12 w-24 h-24 opacity-25 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[30, 22, 14, 6].map((r, i) => (
                    <circle key={i} cx="48" cy="48" r={r} fill="none"
                            stroke={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} strokeWidth="2" />
                ))}
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Circular image with dot border */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]">
                        {[...Array(24)].map((_, i) => {
                            const angle = (i / 24) * 2 * Math.PI;
                            const x = 50 + 48 * Math.cos(angle);
                            const y = 50 + 48 * Math.sin(angle);
                            return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4"
                                          fill={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} />;
                        })}
                    </svg>
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `6px solid ${aboriginal.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Dot line header */}
                    <div className="flex gap-2 mb-8">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full"
                                 style={{ background: i % 2 === 0 ? aboriginal.white : aboriginal.ochre }} />
                        ))}
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: aboriginal.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e8e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Dot line footer */}
                    <div className="flex gap-2 mt-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full"
                                 style={{ background: i % 3 === 0 ? aboriginal.red : aboriginal.ochre }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
