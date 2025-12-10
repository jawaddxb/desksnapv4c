import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CollageArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const rot1 = rng?.range(-5, 5) ?? -2;
    const rot2 = rng?.range(-3, 3) ?? 1;
    const tapeColor = rng?.pick(['#ef4444', '#f59e0b', '#84cc16']) ?? '#f59e0b';

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#f3f4f6] flex items-center justify-center p-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.5'/%3E%3C/svg%3E")` }} />

            <div className="relative w-full max-w-5xl h-[80%] flex items-center justify-center">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-white shadow-xl p-12 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, transform: `rotate(${rot2}deg)`, clipPath: 'polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)' }}>
                     <EditableTitle slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-7xl font-serif italic mb-6" style={{ color: '#111', lineHeight: '1' }} />
                     <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm" />
                </div>

                <div className="absolute top-10 left-0 w-[45%] aspect-[3/4] bg-white p-2 shadow-2xl transition-transform hover:scale-105 duration-300" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${rot1}deg)` }}>
                    <div className="w-full h-full relative">
                         <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 opacity-80" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: tapeColor, transform: 'rotate(-2deg)' }} />
                         <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
