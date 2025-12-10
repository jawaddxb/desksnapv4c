import React from 'react';
import { Sparkles } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const Y2KArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center p-8">
             <div className="absolute inset-0 opacity-20" style={{
                 background: `radial-gradient(circle at 50% 50%, #e0e7ff 0%, #fae8ff 50%, #dbeafe 100%)`,
                 zIndex: LayoutLayer.BACKGROUND
             }} />
             <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)`, zIndex: LayoutLayer.BACKGROUND }} />

             <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-cyan-300" style={{ zIndex: LayoutLayer.DECORATION }} />
             <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-pink-300" style={{ zIndex: LayoutLayer.DECORATION, animationDelay: '1s' }} />

             <div className="w-full max-w-5xl relative z-20 flex flex-col md:flex-row gap-8 items-center">
                 <div className="w-full md:w-1/2 p-8 backdrop-blur-xl bg-white/40 rounded-[3rem] border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.1)] relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

                     <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-cyan-700/60">
                            <Sparkles className="w-3 h-3" />
                            <span>Future_Vision.exe</span>
                        </div>
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{text: '#1e293b'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-sm"
                            style={{ lineHeight: '0.9' }}
                        />
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#334155'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium" />
                     </div>
                 </div>

                 <div className="w-full md:w-1/2 aspect-square relative group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-[2rem] transform rotate-3 scale-105 opacity-50 blur-lg group-hover:rotate-6 transition-all duration-500" />
                     <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
                         <ImageContainer slide={slide} theme={theme} />
                     </div>
                 </div>
             </div>
        </div>
    );
};
