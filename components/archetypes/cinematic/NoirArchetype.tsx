import React from 'react';
import { VenetianMask } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NoirArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    // Cinematic Shadow & Light
    return (
        <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
            {/* Venetian Blind Shadow Effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
                zIndex: LayoutLayer.OVERLAY,
                background: `linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)`,
                backgroundSize: '100% 40px'
            }} />

            <div className="absolute inset-0 opacity-50 grayscale contrast-150" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="relative z-20 w-full max-w-6xl px-12 grid grid-cols-2">
                <div className="col-span-1 pr-12 border-r border-white/20">
                     <div className="flex items-center gap-3 mb-8 text-white/40">
                         <VenetianMask className="w-6 h-6" />
                         <span className="text-xs font-bold uppercase tracking-[0.3em]">Shadow Play</span>
                     </div>

                     {/* Text boosted to CONTENT_TOP (60) to float ABOVE the blinds overlay (50) */}
                     <div style={{ position: 'relative', zIndex: LayoutLayer.CONTENT_TOP }}>
                         <EditableTitle
                            slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-2xl"
                            style={{ lineHeight: '1.1' }}
                         />
                         <div className="w-24 h-1 bg-white mb-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                         <EditableContent slide={slide} theme={theme} contrast={{text: '#ccc'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-serif text-xl italic opacity-80" />
                     </div>
                </div>
            </div>
        </div>
    );
};
