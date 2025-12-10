import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TokyoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tokyo = {
        dark: '#0a0a12',
        pink: '#ff1493',
        cyan: '#00ffff',
        yellow: '#ffff00'
    };
    const accentColor = rng?.pick([tokyo.pink, tokyo.cyan, tokyo.yellow]) ?? tokyo.pink;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${tokyo.dark} 0%, #1a1a2e 100%)` }}>
            {/* Neon glow backdrop */}
            <div className="absolute inset-0 opacity-30" style={{
                background: `radial-gradient(ellipse at 20% 80%, ${tokyo.pink}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${tokyo.cyan}40 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Vertical text element */}
            <div className="absolute right-8 top-8 bottom-8 w-8 flex flex-col items-center justify-center opacity-30" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="writing-vertical text-xs tracking-[0.5em] rotate-180" style={{ color: accentColor, writingMode: 'vertical-rl' }}>TOKYO DESIGN</div>
            </div>

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="mb-6">
                        <span className="px-3 py-1 text-[10px] uppercase tracking-[0.3em] border" style={{
                            color: accentColor,
                            borderColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}40`
                        }}>Featured</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-8xl mb-6"
                        style={{
                            fontWeight: 900,
                            lineHeight: '0.95',
                            textShadow: `0 0 30px ${accentColor}60`
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Neon billboard image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2 rounded-lg" style={{
                        boxShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}20`,
                        border: `2px solid ${accentColor}`
                    }} />
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
