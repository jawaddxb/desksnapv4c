import React from 'react';
import { MoveUpRight } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BrutalistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full p-4 md:p-6" style={{ background: contrast?.accent ?? '#ffffff' }}>
        <div className="w-full h-full border-4 border-black bg-white relative flex flex-col md:flex-row overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,1)]" style={{ borderColor: contrast?.text ?? '#000000', background: contrast?.bg ?? '#ffffff' }}>

             {/* Header Strip */}
             <div className="absolute top-0 left-0 w-full h-12 border-b-4 border-black flex items-center justify-between px-4 bg-white" style={{ zIndex: LayoutLayer.UI, borderColor: contrast?.text ?? '#000000' }}>
                <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-red-500" />
                    <div className="w-4 h-4 rounded-full border-2 border-black bg-yellow-400" />
                </div>
                <div className="font-mono text-xs font-bold uppercase">Fig. {(rng?.range(1, 10) ?? 1).toFixed(0)}</div>
             </div>

             <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 border-b-4 md:border-b-0 md:border-r-4 border-black relative" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast?.text ?? '#000000' }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
                <div className="absolute inset-0 bg-red-500 mix-blend-lighten opacity-30 pointer-events-none" />
             </div>

             <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 p-8 flex flex-col justify-between bg-white" style={{ zIndex: LayoutLayer.CONTENT_BASE, background: contrast?.bg ?? '#ffffff'}}>
                <div>
                    <EditableTitle slide={slide} theme={theme} contrast={contrast ?? { text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl font-black uppercase mb-4" style={{ lineHeight: '1' }} />
                    <div className="w-full h-2 bg-black mb-6" />
                </div>
                <EditableContent slide={slide} theme={theme} contrast={contrast ?? { text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm md:text-base" />
                <div className="mt-4 flex justify-end">
                    <MoveUpRight className="w-12 h-12" style={{ color: contrast?.text ?? '#000000' }} />
                </div>
             </div>
        </div>
    </div>
);
