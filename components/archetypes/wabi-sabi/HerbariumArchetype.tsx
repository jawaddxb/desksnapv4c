import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const HerbariumArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const specimenNumber = rng?.range(1000, 9999).toFixed(0) ?? '1234';
    const dateStr = rng
        ? `${rng.range(1, 28).toFixed(0)}.${rng.range(1, 12).toFixed(0)}.${rng.range(1920, 2024).toFixed(0)}`
        : '12.6.1985';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#f5f0e6' }}>
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`
            }} />

            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12">
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full bg-white p-4 shadow-md border border-gray-200 relative">
                        <div className="absolute -top-2 left-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(-2deg)' }} />
                        <div className="absolute -top-2 right-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(3deg)' }} />

                        <div className="w-full h-full border border-gray-300 overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} className="sepia-[20%]" />
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 bg-white/90 border border-gray-300 p-3">
                            <div className="text-[10px] font-mono text-gray-500">Specimen No. {specimenNumber}</div>
                            <div className="text-xs font-mono mt-1" style={{ fontFamily: '"Caveat", cursive' }}>{slide.title}</div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: '#6b7c5c' }}>Herbarium Collection</span>
                        <div className="flex-1 h-px" style={{ background: '#c9c4bc' }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl mb-6"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm font-mono" />

                    <div className="mt-8 flex items-center gap-4 text-xs font-mono" style={{ color: '#8a8a8a' }}>
                        <span>Date: {dateStr}</span>
                        <span>•</span>
                        <span>Loc: Field Collection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
