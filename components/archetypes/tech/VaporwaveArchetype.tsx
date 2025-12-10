import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const VaporwaveArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#ff9cd6] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-[#240046] via-[#7b2cbf] to-[#ff9cd6] h-[60%]" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="absolute bottom-0 w-full h-[40%] bg-[#240046]" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(transparent 95%, cyan 95%), linear-gradient(90deg, transparent 95%, cyan 95%)`,
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)'
            }} />

            <div className="absolute top-[20%] w-64 h-64 rounded-full bg-gradient-to-t from-yellow-300 to-pink-500 blur-md" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="relative z-20 flex items-center justify-center w-full max-w-6xl gap-12">
                <div className="w-1/2 bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                    <div className="bg-blue-800 px-2 py-1 flex justify-between items-center text-white mb-1">
                        <span className="text-[10px] font-bold">visual_explorer.exe</span>
                        <div className="flex gap-1">
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
                            <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
                        </div>
                    </div>
                    <div className="w-full aspect-video bg-black relative">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-1/2 text-left">
                     <div className="text-cyan-300 text-xs font-bold uppercase tracking-[0.5em] mb-4 drop-shadow-md">AESTHETIC // VIBE</div>
                     <EditableTitle
                        slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[2px_2px_0_#ff00ff]"
                        style={{ fontFamily: '"Arial", sans-serif', fontStyle: 'italic' }}
                     />
                     <div className="bg-black/40 p-6 border border-white/20 backdrop-blur-md">
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#fff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-shadow-sm" />
                     </div>
                </div>
            </div>

            <div className="absolute top-10 right-10 text-white/30 text-6xl font-black writing-vertical-rl pointer-events-none select-none">
                データウェーブ
            </div>
        </div>
    );
};
