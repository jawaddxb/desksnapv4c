import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SavannaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const savanna = {
        gold: '#d4a03a',
        sienna: '#a0522d',
        brown: '#5d4037',
        cream: '#f5e6c8',
        dark: '#2d1b0e'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${savanna.cream} 0%, ${savanna.gold} 100%)`
        }}>
            {/* Tall grass silhouette overlay */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION
            }}>
                <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
                    {[...Array(40)].map((_, i) => {
                        const x = i * 20 + (rng?.range(-5, 5) ?? (i % 2 === 0 ? -3 : 3));
                        const height = rng?.range(60, 95) ?? (60 + (i % 3) * 15);
                        const curve = rng?.range(-10, 10) ?? ((i % 5) - 2) * 4;
                        return (
                            <path key={i} d={`M${x} 100 Q${x + curve} ${100 - height/2} ${x + curve/2} ${100 - height}`}
                                  fill="none" stroke={savanna.brown} strokeWidth="2" />
                        );
                    })}
                </svg>
            </div>

            {/* Warm sun glow */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none" style={{
                background: `radial-gradient(circle, ${savanna.gold} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Horizon line */}
            <div className="absolute top-2/3 left-0 w-full h-px" style={{ background: savanna.sienna, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: savanna.sienna }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: savanna.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: savanna.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Earth tone dots */}
                    <div className="flex gap-2 mt-8">
                        {[savanna.gold, savanna.sienna, savanna.brown].map((color, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>

                {/* Sunset-framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${savanna.gold} 0%, ${savanna.sienna} 100%)`
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
                        border: `3px solid ${savanna.cream}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
