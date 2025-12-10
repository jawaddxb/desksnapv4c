import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const LiquidArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const hueShift = rng?.range(0, 60) ?? 30;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, hsl(${220 + hueShift}, 30%, 95%) 0%, hsl(${260 + hueShift}, 40%, 92%) 100%)` }}>
            <div className="absolute inset-0 opacity-50" style={{
                background: `radial-gradient(ellipse at 30% 20%, hsla(${280 + hueShift}, 60%, 85%, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(${200 + hueShift}, 70%, 80%, 0.4) 0%, transparent 40%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex flex-col items-center justify-center text-center">
                <div className="relative w-full max-w-4xl p-12 md:p-16 rounded-[40px]" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: `0 20px 80px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`
                }}>
                    <div className="absolute inset-0 rounded-[40px] opacity-30 pointer-events-none" style={{
                        background: `linear-gradient(135deg, hsla(${0 + hueShift}, 80%, 70%, 0.3), hsla(${60 + hueShift}, 80%, 70%, 0.2), hsla(${120 + hueShift}, 80%, 70%, 0.3), hsla(${180 + hueShift}, 80%, 70%, 0.2), hsla(${240 + hueShift}, 80%, 70%, 0.3))`,
                        zIndex: LayoutLayer.DECORATION
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.6' }} bullet={false} />
                </div>

                <div className="absolute bottom-8 right-8 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl" style={{
                    zIndex: LayoutLayer.MEDIA,
                    border: '2px solid rgba(255,255,255,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>
        </div>
    );
};
