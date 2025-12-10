import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const KintsugiArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const goldColor = '#d4af37';
    const isInverted = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#1a1a2e' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }} />

            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="kintsugiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#b8860b" />
                            <stop offset="50%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#d4af37" />
                        </linearGradient>
                        <filter id="kintsugiGlow">
                            <feGaussianBlur stdDeviation="0.5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path d={`M ${isInverted ? 100 : 0} 30 Q 50 50 ${isInverted ? 0 : 100} 70`} stroke="url(#kintsugiGold)" strokeWidth="0.4" fill="none" filter="url(#kintsugiGlow)" />
                    <path d={`M ${isInverted ? 85 : 15} 0 Q 50 35 ${isInverted ? 20 : 80} 100`} stroke="url(#kintsugiGold)" strokeWidth="0.25" fill="none" filter="url(#kintsugiGlow)" opacity="0.7" />
                </svg>
            </div>

            <div className="absolute top-12 right-20 w-4 h-4 rotate-12 opacity-60" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #ffd700 0%, #b8860b 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <div className="absolute bottom-24 left-16 w-3 h-3 -rotate-6 opacity-40" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #d4af37 0%, #8b7500 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />

            <div className={`w-full h-full p-12 md:p-20 flex ${isInverted ? 'flex-row-reverse' : 'flex-row'} gap-12 items-center`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="w-1/2 flex flex-col justify-center relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: `linear-gradient(90deg, ${goldColor}, transparent)` }} />
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#e8e0d5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-tight"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />
                    <div className="border-l-2 pl-6" style={{ borderColor: goldColor }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a0a0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-light" />
                    </div>
                    <div className="mt-8 text-xs uppercase tracking-[0.3em] opacity-40" style={{ color: goldColor }}>
                        金継ぎ • Kintsugi
                    </div>
                </div>

                <div className="w-1/2 relative aspect-[4/5]" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 overflow-hidden" style={{
                        borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
                        border: `2px solid ${goldColor}`,
                        boxShadow: `0 0 30px ${goldColor}40, inset 0 0 20px rgba(0,0,0,0.5)`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-75" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: `linear-gradient(135deg, ${goldColor}, transparent)`, opacity: 0.6 }} />
                </div>
            </div>
        </div>
    );
};
