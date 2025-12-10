import React from 'react';
import { Grid } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

export const SwissGridArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const num = rng?.range(0, 9).toFixed(0) ?? '4';

    return (
        <div className="w-full h-full bg-white relative p-12 flex flex-col">
            <div className="absolute inset-0 px-12 py-12 grid grid-cols-4 gap-4 pointer-events-none">
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full" />
                <div className="border-r border-red-500/20 h-full hidden" />
            </div>

            <div className="w-full h-4 bg-black mb-12 flex items-center justify-between px-2">
                <span className="text-white text-[9px] font-bold uppercase tracking-widest">Grid System 04</span>
                <Grid className="w-3 h-3 text-white" />
            </div>

            <div className="grid grid-cols-4 gap-8 h-full relative z-10">
                <div className="col-span-1 flex flex-col justify-between">
                     <div className="text-9xl font-black tracking-tighter leading-none" style={{ color: '#000' }}>
                         {num}<span className="text-red-600">.</span>
                     </div>
                     <div className="text-xs font-bold uppercase tracking-widest rotate-180 origin-top-left translate-y-full text-zinc-400">
                         International Style
                     </div>
                </div>

                <div className="col-span-2 pt-24">
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
                        style={{ fontFamily: '"Helvetica Neue", "Arial", sans-serif' }}
                    />
                    <div className="w-12 h-2 bg-red-600 mb-8" />
                    <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-lg" bullet={false} />
                </div>

                <div className="col-span-1 h-full relative">
                    <div className="absolute inset-0 bg-zinc-100 grayscale contrast-125">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-red-600 text-white p-2 text-xs font-bold">Fig A.</div>
                </div>
            </div>
        </div>
    );
};
