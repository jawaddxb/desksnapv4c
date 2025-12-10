import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AztecArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aztec = {
        turquoise: '#00ced1',
        gold: '#d4af37',
        terracotta: '#cd5c5c',
        black: '#1a1a1a',
        stone: '#a0896c'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: aztec.stone }}>
            {/* Step-fret pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="step-fret" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20 L10 20 L10 10 L20 10 L20 0 L30 0 L30 10 L40 10 L40 20 L30 20 L30 30 L20 30 L20 40 L10 40 L10 30 L0 30 Z"
                              fill="none" stroke={aztec.black} strokeWidth="2" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
                <rect x="0" y="calc(100% - 50px)" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
            </svg>

            {/* Bold geometric accents */}
            <div className="absolute top-0 left-0 w-full h-2" style={{ background: aztec.turquoise, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: aztec.gold, zIndex: LayoutLayer.DECORATION }} />

            {/* Sun stone inspired circle decoration */}
            <div className="absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="45" fill="none" stroke={aztec.gold} strokeWidth="4" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke={aztec.turquoise} strokeWidth="3" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke={aztec.terracotta} strokeWidth="2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <line key={i} x1="50" y1="5" x2="50" y2="20" stroke={aztec.gold} strokeWidth="3"
                              transform={`rotate(${angle} 50 50)`} />
                    ))}
                </svg>
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Angular header decoration */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-6 h-6" style={{
                            background: aztec.turquoise,
                            clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
                        }} />
                        <div className="w-6 h-6" style={{
                            background: aztec.gold,
                            clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
                        }} />
                        <div className="flex-1 h-2" style={{
                            background: `linear-gradient(to right, ${aztec.turquoise}, ${aztec.gold})`
                        }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: aztec.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Step pattern footer */}
                    <div className="flex gap-1 mt-8">
                        {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                            <div key={i} className="w-4" style={{
                                height: `${h * 8}px`,
                                background: i % 2 === 0 ? aztec.turquoise : aztec.gold
                            }} />
                        ))}
                    </div>
                </div>

                {/* Stepped frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: aztec.black,
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Corner accents */}
                    <div className="absolute -top-4 -left-4 w-8 h-8" style={{ background: aztec.turquoise }} />
                    <div className="absolute -bottom-4 -right-4 w-8 h-8" style={{ background: aztec.gold }} />
                </div>
            </div>
        </div>
    );
};
