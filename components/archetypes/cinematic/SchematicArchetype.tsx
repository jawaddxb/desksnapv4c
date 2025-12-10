import React from 'react';
import { Ruler } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SchematicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const gridColor = contrast?.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,100,0.1)';
    const inkColor = contrast?.mode === 'dark' ? '#fff' : '#0033cc';

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0a192f] p-12 font-mono" style={{ background: contrast?.mode === 'dark' ? '#0f172a' : '#f0f9ff' }}>
            {/* Blueprint Grid */}
            <div className="absolute inset-0" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />
            <div className="absolute inset-0 border-[20px] border-double pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, borderColor: inkColor, opacity: 0.3 }} />

            <div className="relative h-full flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="flex justify-between items-end border-b-2 pb-4 mb-8" style={{ borderColor: inkColor }}>
                    <div className="flex flex-col">
                         <span className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: inkColor }}>Project No. {(rng?.range(100,999) ?? 100).toFixed(0)}</span>
                         <EditableTitle slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold uppercase" style={{ fontFamily: '"Space Mono", monospace', lineHeight: '1' }} />
                    </div>
                    <div className="border border-current px-2 py-1 text-xs" style={{ color: inkColor }}>REV A.02</div>
                </div>

                <div className="flex-1 flex gap-8">
                    <div className="w-1/2 relative border" style={{ borderColor: inkColor }}>
                         <div className="absolute top-0 left-0 border-b border-r px-2 py-1 text-[9px] uppercase" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: inkColor, color: inkColor, background: contrast?.bg ?? '#f0f9ff' }}>Fig 1.0</div>

                         <div className="w-full h-full p-6">
                            <div className="w-full h-full relative overflow-hidden grayscale contrast-125 opacity-80 mix-blend-multiply dark:mix-blend-normal">
                                <ImageContainer slide={slide} theme={theme} />
                            </div>
                         </div>
                    </div>
                    <div className="w-1/2 pt-4">
                        <div className="flex items-center gap-2 mb-4 opacity-50" style={{ color: inkColor }}>
                            <Ruler className="w-4 h-4" />
                            <span className="text-[10px] uppercase">Specifications</span>
                        </div>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm space-y-4" style={{ fontFamily: '"Space Mono", monospace' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
