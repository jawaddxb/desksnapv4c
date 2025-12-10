import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const OxidizeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const oxidize = {
        rust: '#b7410e',
        brown: '#8b4513',
        gray: '#696969',
        orange: '#cd853f',
        cream: '#f5f0e6'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${oxidize.gray} 0%, ${oxidize.brown} 50%, ${oxidize.rust} 100%)`
        }}>
            {/* Rust pattern texture overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `radial-gradient(ellipse at 30% 20%, ${oxidize.orange} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${oxidize.rust} 0%, transparent 40%)`
            }} />

            {/* Metal corrosion edges */}
            <div className="absolute top-0 left-0 w-full h-2 opacity-50 pointer-events-none" style={{
                background: `linear-gradient(to right, ${oxidize.rust}, ${oxidize.orange}, ${oxidize.rust})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Corroded frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: `linear-gradient(135deg, ${oxidize.rust} 0%, ${oxidize.brown} 50%, ${oxidize.orange} 100%)`,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${oxidize.brown}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on aged panel */}
                <div className="flex-1 p-8" style={{
                    background: oxidize.cream,
                    border: `2px solid ${oxidize.brown}`,
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    <div className="w-20 h-1 mb-6" style={{ background: oxidize.rust }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: oxidize.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: oxidize.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                    {/* Industrial wabi-sabi dots */}
                    <div className="flex gap-2 mt-6">
                        {[oxidize.rust, oxidize.orange, oxidize.brown].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
