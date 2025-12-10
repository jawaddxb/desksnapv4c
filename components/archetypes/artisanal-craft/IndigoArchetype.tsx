import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const IndigoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const indigo = {
        deep: '#1a237e',
        medium: '#3949ab',
        light: '#7986cb',
        white: '#fafafa',
        cream: '#f5f5f0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: indigo.cream }}>
            {/* Tie-dye pattern overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="shibori" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <circle cx="40" cy="40" r="35" fill="none" stroke={indigo.deep} strokeWidth="2" strokeDasharray="5 3" />
                        <circle cx="40" cy="40" r="25" fill="none" stroke={indigo.medium} strokeWidth="1.5" strokeDasharray="3 5" />
                        <circle cx="40" cy="40" r="15" fill={indigo.light} opacity="0.3" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#shibori)" />
            </svg>

            {/* Organic dye bleed edges */}
            <div className="absolute top-0 left-0 w-full h-4" style={{
                background: `linear-gradient(to bottom, ${indigo.deep}, transparent)`,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-full h-4" style={{
                background: `linear-gradient(to top, ${indigo.deep}, transparent)`,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Fabric-like image container */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: indigo.deep,
                        borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '40% 60% 50% 50% / 50% 50% 50% 50%',
                        border: `3px solid ${indigo.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: indigo.deep }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: indigo.deep }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: indigo.medium }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Dye gradient dots */}
                    <div className="flex gap-2 mt-8">
                        {[indigo.deep, indigo.medium, indigo.light, indigo.medium, indigo.deep].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
