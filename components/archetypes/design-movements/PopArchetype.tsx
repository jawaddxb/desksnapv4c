import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const PopArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const primaryColor = rng?.pick(['#ef4444', '#3b82f6', '#fbbf24']) ?? '#ef4444';
    const secondaryColor = primaryColor === '#ef4444' ? '#fbbf24' : primaryColor === '#3b82f6' ? '#ef4444' : '#3b82f6';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            {/* Ben-Day dots */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(${primaryColor} 2px, transparent 2px)`,
                backgroundSize: '12px 12px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Explosion burst behind content */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <polygon
                        points="100,10 115,75 180,75 125,110 145,175 100,140 55,175 75,110 20,75 85,75"
                        fill={secondaryColor}
                        stroke="#000"
                        strokeWidth="3"
                    />
                </svg>
            </div>

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10 relative">
                {/* Image with halftone */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square border-4 border-black overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} className="contrast-110 saturate-150" />
                    </div>
                    {/* Halftone overlay */}
                    <div className="absolute inset-0 mix-blend-multiply opacity-30" style={{
                        backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                    }} />
                </div>

                {/* Speech bubble content */}
                <div className="w-3/5 relative p-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="absolute inset-0 bg-white border-4 border-black rounded-3xl" />
                    {/* Bubble tail */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                        <div className="w-0 h-0" style={{
                            borderTop: '20px solid transparent',
                            borderBottom: '20px solid transparent',
                            borderRight: '30px solid #000'
                        }} />
                        <div className="absolute left-1 w-0 h-0" style={{
                            borderTop: '16px solid transparent',
                            borderBottom: '16px solid transparent',
                            borderRight: '26px solid #fff',
                            top: '-16px'
                        }} />
                    </div>

                    <div className="relative">
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-6xl lg:text-7xl mb-4"
                            style={{ fontWeight: 900, lineHeight: '0.95' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl" style={{ lineHeight: '1.5' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
