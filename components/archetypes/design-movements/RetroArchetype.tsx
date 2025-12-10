import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const RetroArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const retro = { cream: '#faf8f0', turquoise: '#40e0d0', coral: '#ff7f50', mustard: '#e4a010' };
    const accentColor = rng?.pick([retro.turquoise, retro.coral, retro.mustard]) ?? retro.coral;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: retro.cream }}>
            <div className="absolute top-20 right-20 w-40 h-40" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom -translate-x-1/2" style={{
                        background: accentColor,
                        transform: `rotate(${i * 45}deg) translateY(-50%)`
                    }} />
                ))}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: accentColor }} />
            </div>

            <svg className="absolute bottom-20 left-20 w-32 h-32 opacity-60" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,30 50,30 T90,50" stroke={retro.coral} strokeWidth="8" fill="none" strokeLinecap="round" />
            </svg>

            <div className="w-full h-full p-12 md:p-16 flex items-center gap-12">
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] rounded-[30%] overflow-hidden border-8" style={{ borderColor: '#3d3d3d', background: '#2d2d2d' }}>
                        <div className="w-full h-full rounded-[28%] overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/4 right-1/4 h-2 rounded-b-lg" style={{ background: '#3d3d3d' }} />
                </div>

                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: retro.mustard }} />
                    </div>
                    <EditableTitle slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8" style={{ fontWeight: 700, lineHeight: '1.05' }} />
                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};
