import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CinematicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative bg-black flex flex-col justify-center overflow-hidden">
            {/* Letterbox Bars - Set to OVERLAY (50) */}
            <div className="absolute top-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
            <div className="absolute bottom-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />

            <div className="w-full h-full relative animate-in fade-in duration-1000" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Text Boosted to CONTENT_TOP (60) to sit ABOVE letterbox bars */}
            <div className="absolute bottom-[15%] w-full text-center px-20" style={{ zIndex: LayoutLayer.CONTENT_TOP }}>
                 <EditableTitle
                    slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-xl drop-shadow-lg tracking-wide opacity-90"
                    style={{ lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                 />
                 <div className="inline-block bg-black/50 backdrop-blur-sm px-6 py-2 rounded-sm border-y border-white/10">
                    <EditableContent
                        slide={slide} theme={theme} contrast={{text: '#ddd'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-lg md:text-xl text-zinc-200 italic font-serif"
                        bullet={false}
                    />
                 </div>
            </div>
        </div>
    );
};
