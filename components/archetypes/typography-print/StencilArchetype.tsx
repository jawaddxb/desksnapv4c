import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const StencilArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const stencil = {
        black: '#1a1a1a',
        orange: '#ff6600',
        yellow: '#ffd700',
        concrete: '#a0a0a0',
        white: '#f5f5f5'
    };
    const accent = rng?.pick([stencil.orange, stencil.yellow]) ?? stencil.orange;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: stencil.concrete }}>
            {/* Spray overspray texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `radial-gradient(circle at ${rng?.range(20, 80) ?? 50}% ${rng?.range(20, 80) ?? 50}%, ${stencil.black} 0%, transparent 50%)`
            }} />

            {/* Warning stripe accents */}
            <div className="absolute top-0 left-0 w-full h-4" style={{
                background: `repeating-linear-gradient(45deg, ${accent} 0px, ${accent} 20px, ${stencil.black} 20px, ${stencil.black} 40px)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-full h-4" style={{
                background: `repeating-linear-gradient(-45deg, ${accent} 0px, ${accent} 20px, ${stencil.black} 20px, ${stencil.black} 40px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-4 h-4" style={{ background: accent }} />
                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: stencil.black }}>NOTICE</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: stencil.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-8xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '0.9', letterSpacing: '0.1em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg uppercase tracking-wide" style={{ lineHeight: '1.8' }} />

                    {/* Industrial marks */}
                    <div className="flex gap-2 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-4 h-4" style={{ background: i % 2 === 0 ? accent : stencil.black }} />
                        ))}
                    </div>
                </div>

                {/* Stencil-cut frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{ background: stencil.black }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `4px solid ${accent}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
