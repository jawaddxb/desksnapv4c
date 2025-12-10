import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CoastalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seaGlass = '#87a5a5';
    const driftwood = '#b8a99a';
    const saltWhite = '#faf8f5';
    const isDark = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: isDark
                ? 'linear-gradient(180deg, #1e3a4c 0%, #2d4a5e 100%)'
                : `linear-gradient(180deg, ${saltWhite} 0%, #f0ebe3 100%)`
        }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(139,119,101,0.3) 40px, rgba(139,119,101,0.3) 42px)`
            }} />

            <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
                    <path d="M0 10 Q 25 0, 50 10 T 100 10 V 20 H 0 Z" fill={seaGlass} />
                </svg>
            </div>

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-1" style={{ background: seaGlass }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: isDark ? driftwood : '#7a7a7a' }}>Coastal</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: isDark ? saltWhite : '#2d3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-wide"
                        style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: isDark ? '#a8b5b5' : '#5a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ letterSpacing: '0.01em' }} />
                </div>

                <div className="w-1/2 aspect-[4/5] relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden rounded-lg shadow-xl" style={{ border: `4px solid ${driftwood}40` }}>
                        <ImageContainer slide={slide} theme={theme} />
                        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.15)' }} />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full opacity-40" style={{ background: driftwood }} />
                </div>
            </div>
        </div>
    );
};
