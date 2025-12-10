import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CeramicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ceramic = {
        glaze: '#7eb8da',
        clay: '#c9b8a5',
        speckle: '#8b7355',
        white: '#fafafa',
        dark: '#3a3530'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ceramic.clay }}>
            {/* Speckled stoneware texture */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(50)].map((_, i) => {
                    const x = rng?.range(0, 100) ?? Math.random() * 100;
                    const y = rng?.range(0, 100) ?? Math.random() * 100;
                    const size = rng?.range(1, 3) ?? 1 + Math.random() * 2;
                    return (
                        <div key={i} className="absolute rounded-full"
                             style={{
                                 left: `${x}%`,
                                 top: `${y}%`,
                                 width: `${size}px`,
                                 height: `${size}px`,
                                 background: ceramic.speckle
                             }} />
                    );
                })}
            </div>

            {/* Glaze drip effect - top */}
            <div className="absolute top-0 left-0 w-full h-24" style={{
                background: ceramic.glaze,
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 95% 60%, 90% 55%, 85% 70%, 80% 50%, 75% 65%, 70% 55%, 65% 75%, 60% 50%, 55% 60%, 50% 80%, 45% 55%, 40% 70%, 35% 50%, 30% 65%, 25% 55%, 20% 75%, 15% 50%, 10% 60%, 5% 55%, 0% 70%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 pt-28 flex items-center gap-12">
                {/* Rounded pottery-shaped image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: ceramic.glaze,
                        borderRadius: '50% 50% 45% 45% / 40% 40% 60% 60%'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '48% 52% 42% 42% / 38% 38% 62% 62%',
                        border: `3px solid ${ceramic.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Rim highlight */}
                    <div className="absolute -top-1 left-1/4 w-1/2 h-2 rounded-full" style={{
                        background: `linear-gradient(to right, transparent, ${ceramic.white}50, transparent)`
                    }} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-2 rounded-full mb-6" style={{ background: ceramic.glaze }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: ceramic.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5550' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Kiln variation marks */}
                    <div className="flex gap-3 mt-8">
                        {[ceramic.glaze, ceramic.speckle, ceramic.glaze].map((color, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
