import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SolarpunkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const solarpunk = {
        green: '#32cd32',
        gold: '#ffd700',
        sky: '#87ceeb',
        white: '#ffffff',
        dark: '#1a3a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(to bottom, ${solarpunk.sky} 0%, ${solarpunk.white} 100%)`
        }}>
            {/* Plant/tech fusion motifs */}
            <svg className="absolute bottom-0 left-0 w-full h-48 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(8)].map((_, i) => {
                    const x = i * 100 + 50;
                    return (
                        <path key={i} d={`M${x} 200 Q${x + 20} 150, ${x} 100 Q${x - 20} 50, ${x + 10} 0`}
                              fill="none" stroke={solarpunk.green} strokeWidth="3" strokeLinecap="round" />
                    );
                })}
            </svg>

            {/* Optimistic futurism sun */}
            <div className="absolute top-8 right-12 w-24 h-24 opacity-50 pointer-events-none" style={{
                background: `radial-gradient(circle, ${solarpunk.gold} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Sustainable hope accents */}
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: solarpunk.green, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Nature-framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3 rounded-full" style={{
                        background: solarpunk.green,
                        opacity: 0.3
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${solarpunk.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: solarpunk.green }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: solarpunk.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a5a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Hopeful dots */}
                    <div className="flex gap-2 mt-8">
                        {[solarpunk.green, solarpunk.gold, solarpunk.sky].map((color, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
