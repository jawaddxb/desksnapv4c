import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MarrakechArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const marrakech = {
        terracotta: '#c17767',
        blue: '#1e3a5f',
        gold: '#c9a227',
        cream: '#faf5e8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: marrakech.cream }}>
            {/* Zellige tile pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <defs>
                    <pattern id="zellige" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                        <rect width="60" height="60" fill="none" stroke={marrakech.blue} strokeWidth="1" />
                        <path d="M0,30 L30,0 L60,30 L30,60 Z" fill="none" stroke={marrakech.blue} strokeWidth="1" />
                        <circle cx="30" cy="30" r="10" fill="none" stroke={marrakech.terracotta} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#zellige)" />
            </svg>

            {/* Gold brass accent */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full opacity-40" style={{ background: marrakech.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-2 h-8" style={{ background: marrakech.blue }} />
                        <div className="w-2 h-8" style={{ background: marrakech.terracotta }} />
                        <div className="w-2 h-8" style={{ background: marrakech.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: marrakech.blue }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Tile border image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{
                        background: `linear-gradient(45deg, ${marrakech.blue}, ${marrakech.terracotta})`,
                        opacity: 0.2
                    }} />
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
                        border: `6px solid ${marrakech.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
