import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const DesertArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const desert = {
        sand: '#e8dcc8',
        ochre: '#c98b4a',
        terracotta: '#b85c38',
        dusty: '#d4a574'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: desert.sand }}>
            {/* Sun-bleached gradient */}
            <div className="absolute inset-0 opacity-30" style={{
                background: `linear-gradient(180deg, transparent 0%, ${desert.ochre}30 100%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Geometric southwest pattern */}
            <div className="absolute top-8 right-8 w-24 h-24" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-full h-full" style={{
                    background: `repeating-linear-gradient(45deg, ${desert.terracotta} 0, ${desert.terracotta} 4px, transparent 4px, transparent 12px)`
                }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-2 mb-8" style={{ background: desert.terracotta }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d2e1e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Sun-washed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.2] saturate-90" />
                    </div>
                    {/* Ochre accent line */}
                    <div className="absolute -bottom-2 left-0 w-2/3 h-1" style={{ background: desert.ochre }} />
                </div>
            </div>
        </div>
    );
};
