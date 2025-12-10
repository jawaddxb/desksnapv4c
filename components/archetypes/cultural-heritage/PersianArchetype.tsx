import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const PersianArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const persian = {
        burgundy: '#722f37',
        gold: '#d4af37',
        turquoise: '#30d5c8',
        cream: '#f5f0e1',
        navy: '#1a2744'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: persian.burgundy }}>
            {/* Arabesque pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M50 0 Q75 25 50 50 Q25 75 50 100 M50 0 Q25 25 50 50 Q75 75 50 100" fill="none" stroke={persian.gold} strokeWidth="1" />
                        <circle cx="50" cy="50" r="10" fill="none" stroke={persian.gold} strokeWidth="1" />
                        <path d="M0 50 Q25 25 50 50 Q25 75 0 50 M100 50 Q75 25 50 50 Q75 75 100 50" fill="none" stroke={persian.gold} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#arabesque)" />
            </svg>

            {/* Multi-layer border frame */}
            <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: persian.turquoise, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center">
                {/* Medallion center composition */}
                <div className="relative w-full max-w-4xl flex items-center gap-12">
                    {/* Central medallion image */}
                    <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="absolute -inset-6" style={{
                            background: `radial-gradient(ellipse at center, ${persian.gold} 0%, transparent 70%)`,
                            opacity: 0.3
                        }} />
                        <div className="relative w-full aspect-square overflow-hidden" style={{
                            borderRadius: '50%',
                            border: `6px solid ${persian.gold}`,
                            boxShadow: `0 0 0 3px ${persian.turquoise}, 0 0 0 6px ${persian.gold}`
                        }}>
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 p-8 relative" style={{
                        background: persian.cream,
                        borderRadius: '4px',
                        border: `2px solid ${persian.gold}`,
                        zIndex: LayoutLayer.CONTENT_HERO
                    }}>
                        <div className="absolute top-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />

                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: persian.burgundy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-6"
                            style={{ fontWeight: 600, lineHeight: '1.15' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: persian.navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                        <div className="absolute bottom-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />
                    </div>
                </div>

                {/* Bottom ornament */}
                <div className="flex items-center gap-4 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="w-16 h-px" style={{ background: persian.gold }} />
                    <div className="w-4 h-4 rotate-45" style={{ background: persian.turquoise }} />
                    <div className="w-16 h-px" style={{ background: persian.gold }} />
                </div>
            </div>
        </div>
    );
};
