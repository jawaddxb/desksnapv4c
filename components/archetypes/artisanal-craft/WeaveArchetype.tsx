import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const WeaveArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const weave = {
        natural: '#d4c4a8',
        brown: '#8b7355',
        cream: '#f5f0e6',
        dark: '#4a3c2a',
        accent: '#a0522d'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: weave.cream }}>
            {/* Woven grid texture overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="woven" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect x="0" y="0" width="10" height="10" fill={weave.natural} />
                        <rect x="10" y="10" width="10" height="10" fill={weave.natural} />
                        <rect x="0" y="10" width="10" height="10" fill={weave.brown} opacity="0.5" />
                        <rect x="10" y="0" width="10" height="10" fill={weave.brown} opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#woven)" />
            </svg>

            {/* Warp/weft line accents */}
            <div className="absolute left-0 top-0 w-1 h-full" style={{
                background: `repeating-linear-gradient(to bottom, ${weave.brown} 0px, ${weave.brown} 10px, transparent 10px, transparent 20px)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute right-0 top-0 w-1 h-full" style={{
                background: `repeating-linear-gradient(to bottom, ${weave.accent} 0px, ${weave.accent} 10px, transparent 10px, transparent 20px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Woven header decoration */}
                    <div className="flex gap-1 mb-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-2 h-6" style={{
                                background: i % 2 === 0 ? weave.brown : weave.accent
                            }} />
                        ))}
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: weave.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: weave.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Fringe decoration */}
                    <div className="flex gap-2 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1 h-8" style={{
                                background: weave.brown,
                                opacity: 0.5 + (i % 2) * 0.3
                            }} />
                        ))}
                    </div>
                </div>

                {/* Fabric-framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-8" style={{
                        borderColor: weave.natural,
                        background: weave.brown
                    }}>
                        <div className="absolute inset-2 border-4" style={{ borderColor: weave.accent }} />
                    </div>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
