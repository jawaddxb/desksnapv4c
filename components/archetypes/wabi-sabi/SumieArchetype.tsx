import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SumieArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isLeftAligned = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefdfb' }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='washi'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23washi)' opacity='0.4'/%3E%3C/svg%3E")`
            }} />

            <div className="absolute top-10 right-10 w-32 h-32 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 100" fill="#000">
                    <circle cx="50" cy="50" r="30" />
                    <ellipse cx="75" cy="40" rx="15" ry="8" />
                    <ellipse cx="30" cy="70" rx="10" ry="20" />
                </svg>
            </div>

            <div className="absolute bottom-16 right-16 w-16 h-16 flex items-center justify-center opacity-80" style={{ zIndex: LayoutLayer.OVERLAY }}>
                <div className="w-full h-full border-2 border-red-600 flex items-center justify-center" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
                    <span className="text-red-600 text-lg font-bold">墨</span>
                </div>
            </div>

            <div className={`w-full h-full p-16 md:p-24 flex ${isLeftAligned ? 'justify-start' : 'justify-end'}`}>
                <div className="w-2/3 md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-12 opacity-60" style={{ background: 'linear-gradient(90deg, #000 0%, transparent 100%)' }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-8xl mb-12"
                        style={{ fontWeight: 700, lineHeight: '1.0' }}
                    />

                    <div className="max-w-md">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} bullet={false} />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-24 left-16 w-48 h-64 shadow-xl" style={{ zIndex: LayoutLayer.MEDIA }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" style={{ filter: 'grayscale(100%) contrast(1.2) brightness(1.1)' }} />
            </div>
        </div>
    );
};
