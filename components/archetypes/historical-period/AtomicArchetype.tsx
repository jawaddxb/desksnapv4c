import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AtomicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const atomic = {
        turquoise: '#40e0d0',
        coral: '#ff7f50',
        chartreuse: '#7fff00',
        white: '#ffffff',
        black: '#1a1a1a'
    };
    const accent = rng?.pick([atomic.turquoise, atomic.coral, atomic.chartreuse]) ?? atomic.turquoise;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: atomic.white }}>
            {/* Atomic starburst shapes */}
            <svg className="absolute top-8 right-8 w-32 h-32 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[0, 45, 90, 135].map((angle, i) => (
                    <ellipse key={i} cx="64" cy="64" rx="60" ry="8" fill={accent}
                             transform={`rotate(${angle} 64 64)`} />
                ))}
                <circle cx="64" cy="64" r="12" fill={atomic.black} />
            </svg>

            {/* Boomerang curves */}
            <svg className="absolute bottom-12 left-8 w-48 h-24 opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0 60 Q60 0 120 30 Q180 60 240 20" fill="none" stroke={atomic.coral} strokeWidth="4" />
                <path d="M0 80 Q60 20 120 50 Q180 80 240 40" fill="none" stroke={atomic.turquoise} strokeWidth="3" />
            </svg>

            {/* Googie-style accent bar */}
            <div className="absolute top-0 left-0 w-full h-3" style={{
                background: `linear-gradient(to right, ${atomic.turquoise}, ${atomic.coral}, ${atomic.chartreuse})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Atomic orbital header */}
                    <svg className="w-16 h-16 mb-6" viewBox="0 0 64 64">
                        {[0, 60, 120].map((angle, i) => (
                            <ellipse key={i} cx="32" cy="32" rx="28" ry="10" fill="none" stroke={accent} strokeWidth="2"
                                     transform={`rotate(${angle} 32 32)`} />
                        ))}
                        <circle cx="32" cy="32" r="6" fill={atomic.black} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: atomic.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
                        style={{ fontWeight: 800, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Color dots */}
                    <div className="flex gap-3 mt-8">
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: atomic.chartreuse }} />
                    </div>
                </div>

                {/* Kidney-shaped image frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: accent,
                        borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
                        border: `4px solid ${atomic.white}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
