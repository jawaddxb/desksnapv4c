import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const RisographArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#FFFAF0] p-12 flex flex-col justify-center">
             <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`, zIndex: LayoutLayer.OVERLAY, mixBlendMode: 'multiply' }} />

             <div className="flex gap-12 items-center relative z-10">
                 <div className="w-1/2 relative aspect-[3/4]">
                     <div className="absolute inset-0 bg-blue-500/20 translate-x-2 translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />
                     <div className="absolute inset-0 bg-pink-500/20 -translate-x-2 -translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />

                     <div className="relative w-full h-full grayscale contrast-150 brightness-110 mix-blend-multiply" style={{ zIndex: LayoutLayer.MEDIA }}>
                         <ImageContainer slide={slide} theme={theme} style={{ filter: 'grayscale(100%) contrast(1.2)' }} />
                     </div>

                     <div className="absolute inset-0 bg-blue-900 mix-blend-lighten pointer-events-none opacity-50" style={{ zIndex: LayoutLayer.MEDIA }} />
                 </div>

                 <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                     <div className="w-12 h-12 rounded-full border-4 mb-6 border-blue-600/80 mix-blend-multiply" />
                     <EditableTitle
                         slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                         className="text-6xl md:text-8xl font-black uppercase mb-6 tracking-tighter opacity-90"
                         style={{ color: '#111', lineHeight: '0.9' }}
                     />
                     <div className="p-6 border-l-4 border-pink-500/60 bg-white/50 backdrop-blur-sm">
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#222'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
                     </div>
                 </div>
             </div>
        </div>
    );
};
