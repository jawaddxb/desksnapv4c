import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const HologramArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const shimmerAngle = rng?.range(30, 60) ?? 45;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
            <div className="absolute inset-0 opacity-30" style={{
                background: `linear-gradient(${shimmerAngle}deg, #ff000020 0%, #ff800020 14%, #ffff0020 28%, #00ff0020 42%, #00ffff20 57%, #0000ff20 71%, #ff00ff20 85%, #ff000020 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
                <div className="w-1/2 relative p-10 rounded-2xl" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }}>
                    <div className="absolute inset-0 rounded-2xl p-[2px] -z-10" style={{
                        background: `linear-gradient(${shimmerAngle}deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)`,
                    }}>
                        <div className="w-full h-full rounded-2xl" style={{ background: '#ffffff' }} />
                    </div>

                    <div className="w-12 h-1 rounded-full mb-8" style={{
                        background: `linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)`
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 rounded-2xl" style={{
                        background: `linear-gradient(${shimmerAngle + 90}deg, #ff008040, #ff8c0040, #40e0d040, #8a2be240)`,
                        transform: 'scale(1.02)'
                    }} />
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{
                        border: '3px solid transparent',
                        backgroundClip: 'padding-box',
                        boxShadow: `0 0 30px rgba(255,0,128,0.2), 0 0 60px rgba(64,224,208,0.1)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full opacity-40 blur-xl" style={{
                        background: `linear-gradient(90deg, #ff0080, #40e0d0, #8a2be2)`
                    }} />
                </div>
            </div>
        </div>
    );
};
