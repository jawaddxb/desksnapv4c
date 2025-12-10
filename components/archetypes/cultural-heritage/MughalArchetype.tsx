import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MughalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mughal = {
        emerald: '#046307',
        ruby: '#9b1b30',
        gold: '#d4af37',
        ivory: '#fffff0',
        sapphire: '#0f52ba'
    };
    const accentColor = rng?.pick([mughal.emerald, mughal.ruby, mughal.sapphire]) ?? mughal.emerald;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mughal.ivory }}>
            {/* Jali (lattice) pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="jali" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={mughal.gold} strokeWidth="1" />
                        <circle cx="30" cy="30" r="8" fill="none" stroke={mughal.gold} strokeWidth="1" />
                        <circle cx="30" cy="30" r="4" fill={mughal.gold} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#jali)" />
            </svg>

            {/* Gold filigree border */}
            <div className="absolute inset-6 border-2 pointer-events-none" style={{ borderColor: mughal.gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: accentColor }} />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: accentColor }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: accentColor }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Arch-framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
                        border: `4px solid ${mughal.gold}`,
                        boxShadow: `0 0 0 2px ${accentColor}, 0 8px 32px rgba(0,0,0,0.2)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Paisley decoration */}
                    <svg className="absolute -bottom-4 -right-4 w-16 h-16" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <path d="M50 10 C80 10, 90 50, 50 90 C10 50, 20 10, 50 10" fill={mughal.gold} opacity="0.8" />
                        <circle cx="50" cy="50" r="15" fill={accentColor} />
                    </svg>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
                        <div className="w-3 h-3 rotate-45" style={{ background: accentColor }} />
                        <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${mughal.gold}, transparent)` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
