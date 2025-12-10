import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GrungeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grunge = {
        mustard: '#c9a227',
        brown: '#5d4037',
        gray: '#757575',
        black: '#1a1a1a',
        cream: '#e8e4d9'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: grunge.cream }}>
            {/* Distressed texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='5' height='3' fill='%23000' opacity='0.3'/%3E%3Crect x='50' y='30' width='8' height='2' fill='%23000' opacity='0.2'/%3E%3Crect x='70' y='60' width='4' height='4' fill='%23000' opacity='0.25'/%3E%3Crect x='20' y='80' width='6' height='2' fill='%23000' opacity='0.15'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px'
            }} />

            {/* Torn paper edge effect - top */}
            <div className="absolute top-0 left-0 w-full h-8" style={{
                zIndex: LayoutLayer.DECORATION,
                background: grunge.brown,
                clipPath: 'polygon(0% 0%, 3% 100%, 8% 50%, 12% 100%, 18% 60%, 22% 100%, 28% 40%, 33% 100%, 38% 70%, 45% 100%, 50% 50%, 55% 100%, 62% 60%, 68% 100%, 75% 40%, 80% 100%, 85% 70%, 92% 100%, 95% 50%, 100% 100%, 100% 0%)'
            }} />

            <div className="w-full h-full p-12 md:p-20 pt-16 flex items-center gap-12">
                {/* Photocopied-style image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-1 bg-black opacity-80" style={{ transform: 'rotate(-2deg)' }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        border: `3px solid ${grunge.black}`,
                        filter: 'contrast(1.2) grayscale(30%)',
                        transform: 'rotate(1deg)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Tape pieces */}
                    <div className="absolute -top-3 left-1/4 w-16 h-6 rotate-12" style={{ background: `${grunge.mustard}90` }} />
                    <div className="absolute -bottom-2 right-1/4 w-12 h-5 -rotate-6" style={{ background: `${grunge.cream}90` }} />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-6" style={{ background: grunge.mustard }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: grunge.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: grunge.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    {/* X marks */}
                    <div className="flex gap-4 mt-8">
                        {[...Array(3)].map((_, i) => (
                            <span key={i} className="text-3xl font-black" style={{ color: grunge.mustard }}>×</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
