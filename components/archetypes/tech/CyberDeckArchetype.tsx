import React from 'react';
import { Globe } from 'lucide-react';
import { ArchetypeProps, EditableTitle } from '../../WabiSabiComponents';
import { SmartText } from '../../SmartText';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CyberDeckArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full bg-[#050505] p-6 md:p-12 font-mono flex flex-col relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-cyan-900/30 rounded-lg pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }} />

        <div className="flex flex-col md:flex-row gap-12 h-full" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-6 text-cyan-500/80">
                    <Globe className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] tracking-widest uppercase">Netrunner Link // Active</span>
                 </div>
                 <EditableTitle slide={slide} theme={theme} contrast={{text: '#22d3ee'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-3xl md:text-6xl font-bold mb-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ fontFamily: '"Rajdhani", sans-serif', lineHeight: '1.1' }} />

                 <div className="border-l-2 border-cyan-800 pl-6 space-y-4 relative">
                    {slide.content.map((item: string, i: number) => (
                        <div key={i} className="text-sm md:text-base text-cyan-100/80 font-mono flex gap-3">
                            <span className="text-cyan-600">0{i+1}</span>
                            <SmartText
                                value={item}
                                onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }}
                                readOnly={readOnly}
                                fontSize={16}
                                lineHeight={1.4}
                                className="bg-transparent outline-none w-full"
                            />
                        </div>
                    ))}
                 </div>
            </div>

            <div className="w-full md:w-1/2 relative border border-cyan-900/50 bg-cyan-950/10 p-1">
                <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125 brightness-110 opacity-70" style={{ filter: 'sepia(100%) hue-rotate(130deg) saturate(200%)' }} />
            </div>
        </div>
    </div>
);
