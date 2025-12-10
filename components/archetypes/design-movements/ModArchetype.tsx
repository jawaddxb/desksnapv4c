import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ModArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mod = {
        cream: '#f5f0e6',
        mustard: '#d4a03c',
        teal: '#2d8c8c',
        olive: '#6b7c4c',
        orange: '#d96c3c'
    };
    const accentColor = rng?.pick([mod.mustard, mod.teal, mod.olive, mod.orange]) ?? mod.mustard;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mod.cream }}>
            {/* Organic blob shape */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[60%] aspect-square opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <path d="M45,65 Q65,30 115,45 T165,95 Q180,140 135,165 T55,155 Q25,130 35,95 T45,65" fill={accentColor} />
                </svg>
            </div>

            {/* Hairpin leg accent */}
            <div className="absolute bottom-0 left-20 w-1 h-40" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-24 w-1 h-32" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.mustard }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.teal }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: mod.orange }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Image in organic blob mask */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square">
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            <defs>
                                <clipPath id="blob-clip">
                                    <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" />
                                </clipPath>
                            </defs>
                            <foreignObject width="200" height="200" clipPath="url(#blob-clip)">
                                <div className="w-full h-full">
                                    <ImageContainer slide={slide} theme={theme} />
                                </div>
                            </foreignObject>
                            <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" fill="none" stroke={accentColor} strokeWidth="3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
