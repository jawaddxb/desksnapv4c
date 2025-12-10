import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const WoodtypeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const woodtype = {
        wood: '#8b4513',
        black: '#1a1a1a',
        red: '#b22222',
        cream: '#f5e6c8',
        tan: '#d2b48c'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: woodtype.cream }}>
            {/* Wood grain texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 8, 50 10 T100 10' stroke='%238b4513' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 15 Q30 12, 60 15 T100 14' stroke='%238b4513' fill='none' stroke-width='0.3'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 20px'
            }} />

            {/* Circus/carnival style border */}
            <div className="absolute inset-6 border-8 pointer-events-none" style={{
                borderColor: woodtype.red,
                zIndex: LayoutLayer.DECORATION
            }}>
                <div className="absolute inset-2 border-4" style={{ borderColor: woodtype.black }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center text-center">
                {/* Worn letterform header */}
                <div className="flex gap-2 mb-6" style={{ zIndex: LayoutLayer.DECORATION }}>
                    {['★', '★', '★'].map((s, i) => (
                        <span key={i} className="text-2xl" style={{ color: woodtype.red }}>{s}</span>
                    ))}
                </div>

                <div className="flex items-center gap-8 mb-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Image */}
                    <div className="w-48 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="absolute -inset-2 border-4" style={{ borderColor: woodtype.wood }} />
                        <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                            border: `3px solid ${woodtype.black}`
                        }}>
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>

                    {/* Title */}
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: woodtype.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-7xl lg:text-8xl uppercase"
                        style={{ fontWeight: 900, lineHeight: '0.9', letterSpacing: '0.05em', textShadow: `3px 3px 0 ${woodtype.red}` }}
                    />
                </div>

                <div className="w-full max-w-3xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableContent slide={slide} theme={theme} contrast={{ text: woodtype.wood }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl text-center" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Decorative footer */}
                <div className="flex items-center gap-4 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="w-16 h-1" style={{ background: woodtype.black }} />
                    <span className="text-2xl" style={{ color: woodtype.red }}>★</span>
                    <div className="w-16 h-1" style={{ background: woodtype.black }} />
                </div>
            </div>
        </div>
    );
};
