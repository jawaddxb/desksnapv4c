import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const VoidArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const voidColors = {
        black: '#000000',
        white: '#ffffff',
        gray: '#1a1a1a',
        glow: '#4a4a6a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: voidColors.black }}>
            {/* Subtle star field */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(30)].map((_, i) => {
                    const x = rng?.range(0, 100) ?? (i * 3.3);
                    const y = rng?.range(0, 100) ?? (i * 3.7);
                    const size = rng?.range(1, 2) ?? (1 + (i % 2));
                    return (
                        <div key={i} className="absolute rounded-full"
                             style={{
                                 left: `${x}%`,
                                 top: `${y}%`,
                                 width: `${size}px`,
                                 height: `${size}px`,
                                 background: voidColors.white
                             }} />
                    );
                })}
            </div>

            {/* Event horizon gradient */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" style={{
                background: `radial-gradient(ellipse at bottom, ${voidColors.glow} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Single light source */}
            <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full" style={{
                background: voidColors.white,
                boxShadow: `0 0 20px ${voidColors.white}`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Cosmic emptiness image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-1 rounded-full opacity-30" style={{
                        background: `radial-gradient(circle, ${voidColors.glow} 0%, transparent 70%)`
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `1px solid ${voidColors.glow}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-1 h-1 rounded-full mb-8" style={{ background: voidColors.white }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: voidColors.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-widest"
                        style={{ fontWeight: 200, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />

                    {/* Minimal void dots */}
                    <div className="flex gap-4 mt-8">
                        <div className="w-1 h-1 rounded-full" style={{ background: voidColors.white }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
