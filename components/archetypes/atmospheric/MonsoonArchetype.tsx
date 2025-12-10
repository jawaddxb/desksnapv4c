import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MonsoonArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const monsoon = {
        teal: '#006666',
        gray: '#708090',
        silver: '#c0c0c0',
        dark: '#2f4f4f',
        white: '#f8f8f8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: monsoon.dark }}>
            {/* Rain streak overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="rain" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
                        <line x1="10" y1="0" x2="10" y2="30" stroke={monsoon.silver} strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#rain)" />
            </svg>

            {/* Mist/fog layer effects */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-30 pointer-events-none" style={{
                background: `linear-gradient(to top, ${monsoon.gray} 0%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute top-1/4 left-0 w-full h-32 opacity-10 pointer-events-none" style={{
                background: monsoon.silver,
                filter: 'blur(30px)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-6" style={{ background: monsoon.teal }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: monsoon.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: monsoon.silver }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Rain drop accents */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-2 h-4 rounded-full" style={{
                                background: monsoon.silver,
                                opacity: 0.3 + i * 0.2
                            }} />
                        ))}
                    </div>
                </div>

                {/* Misty framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 opacity-20" style={{
                        background: monsoon.gray,
                        filter: 'blur(20px)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        border: `2px solid ${monsoon.silver}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
