import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GlitchArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const glitch = {
        black: '#0a0a0a',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        white: '#ffffff',
        gray: '#333333'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: glitch.black }}>
            {/* Scan lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, ${glitch.white} 2px, ${glitch.white} 3px)`,
                backgroundSize: '100% 4px'
            }} />

            {/* RGB split effect hints */}
            <div className="absolute top-1/4 left-0 w-full h-2 opacity-30 pointer-events-none" style={{
                background: glitch.cyan,
                transform: 'translateX(5px)',
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute top-1/4 left-0 w-full h-2 opacity-30 pointer-events-none" style={{
                background: glitch.magenta,
                transform: 'translateX(-5px)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Data corruption patterns */}
            <div className="absolute bottom-1/3 right-0 w-32 h-4 opacity-50 pointer-events-none" style={{
                background: `linear-gradient(to right, ${glitch.cyan}, ${glitch.magenta})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Pixel displacement image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-1" style={{
                        background: glitch.cyan,
                        transform: 'translate(4px, -2px)',
                        opacity: 0.5
                    }} />
                    <div className="absolute -inset-1" style={{
                        background: glitch.magenta,
                        transform: 'translate(-4px, 2px)',
                        opacity: 0.5
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-1 mb-6">
                        <div className="w-16 h-1" style={{ background: glitch.cyan }} />
                        <div className="w-8 h-1" style={{ background: glitch.magenta }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: glitch.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '1.0', textShadow: `2px 0 ${glitch.cyan}, -2px 0 ${glitch.magenta}` }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a0a0a0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-mono" style={{ lineHeight: '1.8' }} />

                    {/* Digital decay */}
                    <div className="flex gap-2 mt-8">
                        {[glitch.cyan, glitch.magenta, glitch.white, glitch.cyan].map((color, i) => (
                            <div key={i} className="w-2 h-6" style={{ background: color, opacity: 0.5 + i * 0.15 }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
