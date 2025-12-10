import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CelticArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const celtic = {
        green: '#006400',
        gold: '#d4af37',
        cream: '#f5f0dc',
        brown: '#654321'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: celtic.cream }}>
            {/* Interlaced knot border pattern */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="celtic-knot" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 Q45 15 30 30 Q15 45 30 60" fill="none" stroke={celtic.green} strokeWidth="3" />
                        <path d="M0 30 Q15 15 30 30 Q45 45 60 30" fill="none" stroke={celtic.green} strokeWidth="3" />
                        <circle cx="30" cy="30" r="5" fill={celtic.gold} />
                    </pattern>
                </defs>
                {/* Top and bottom borders */}
                <rect x="0" y="0" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
                <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
            </svg>

            {/* Manuscript page border */}
            <div className="absolute inset-6 border-4 pointer-events-none" style={{
                borderColor: celtic.green,
                borderStyle: 'double',
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Corner knots */}
                {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-8 h-8 rounded-full border-4`} style={{
                        borderColor: celtic.gold,
                        background: celtic.green
                    }} />
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Illuminated initial / Image */}
                <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4" style={{
                        borderColor: celtic.gold,
                        background: `linear-gradient(135deg, ${celtic.gold}22, transparent)`
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${celtic.green}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Decorative corner spirals */}
                    <svg className="absolute -bottom-6 -right-6 w-12 h-12" viewBox="0 0 50 50" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <path d="M25 25 Q35 25 35 35 Q35 45 25 45 Q15 45 15 35 Q15 25 25 25" fill="none" stroke={celtic.gold} strokeWidth="3" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Uncial-style decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <svg className="w-8 h-8" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="15" fill="none" stroke={celtic.green} strokeWidth="2" />
                            <circle cx="20" cy="20" r="8" fill={celtic.gold} />
                        </svg>
                        <div className="flex-1 h-1" style={{ background: celtic.green }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: celtic.green }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: celtic.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Footer ornament */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-1" style={{ background: celtic.green }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: celtic.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
