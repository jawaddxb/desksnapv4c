import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ZineArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const tapeColor = rng?.pick(['#ef4444', '#facc15', '#3b82f6']) ?? '#facc15';
    const rotation = rng?.range(-2, 2) ?? 1;
    const tapeRotation = rng?.range(-2, 2) ?? 0;

    return (
        <div className="w-full h-full relative p-8 flex flex-col md:flex-row gap-8 items-center justify-center overflow-hidden" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: theme.colors.backgroundPattern || `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

            <div className="relative w-full md:w-1/2 aspect-[4/5] shrink-0 transition-transform hover:scale-105 duration-500" style={{ zIndex: LayoutLayer.MEDIA, transform: `rotate(${rotation}deg)` }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, background: tapeColor, transform: `rotate(${tapeRotation}deg)`, opacity: 0.9, clipPath: `polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)` }} />
                <div className="w-full h-full shadow-2xl border-4 border-white"><ImageContainer slide={slide} theme={theme} /></div>
            </div>

            <div className="relative w-full md:w-1/2 p-10 bg-white shadow-[12px_12px_0_rgba(0,0,0,0.15)] border-2 border-zinc-100/50 backdrop-blur-sm" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${-rotation}deg)` }}>
                <EditableTitle slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl mb-6 uppercase tracking-tighter font-black" style={{ lineHeight: '0.95', color: '#111' }} />
                <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
            </div>
        </div>
    );
};
