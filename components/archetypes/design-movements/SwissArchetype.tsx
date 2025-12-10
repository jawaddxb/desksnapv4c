import React from 'react';
import { ArchetypeProps, DecorativeLabel, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SwissArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const figNum = rng?.range(1, 99).toFixed(0) ?? '42';
    const gridNum = rng?.range(10, 20).toFixed(0) ?? '12';

    return (
        <div className="w-full h-full grid grid-cols-12 grid-rows-6 bg-zinc-50" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-20 border-r border-black" style={{ zIndex: LayoutLayer.BACKGROUND, borderColor: contrast.border }}>
                 {[...Array(12)].map((_, i) => <div key={i} className="border-l border-black h-full" style={{ borderColor: contrast.border }} />)}
            </div>

            <div className="col-span-12 row-span-4 md:col-span-8 md:row-span-6 relative border-b md:border-b-0 md:border-r border-black" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.border }}>
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute top-6 left-6 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-black shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.border, color: contrast.text, background: contrast.bg }}>
                    Figure {figNum}
                </div>
            </div>

            <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-6 p-8 flex flex-col justify-between h-full relative" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div>
                    <div className="w-full h-px bg-current mb-2 opacity-50" style={{ color: contrast.text }} />
                    <DecorativeLabel text={`Grid Sys. ${gridNum}`} className="mb-8" style={{ color: contrast.text }} />
                    <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8" style={{ textTransform: 'lowercase' }} />
                </div>
                <div className="space-y-4">
                    <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-sm md:text-base" bullet={false} />
                </div>
            </div>
        </div>
    );
};
