import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MineralArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mineralColors = [
        { bg: '#1a1a2e', gem: '#8b5cf6', name: 'amethyst' },
        { bg: '#0a2e2a', gem: '#10b981', name: 'emerald' },
        { bg: '#1e2a4a', gem: '#3b82f6', name: 'sapphire' },
        { bg: '#2e1a1a', gem: '#ef4444', name: 'ruby' }
    ];
    const mineral = rng?.pick(mineralColors) ?? mineralColors[0];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mineral.bg }}>
            {/* Crystal facets */}
            <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
                <polygon points="100,10 150,60 130,120 70,120 50,60" fill="none" stroke={mineral.gem} strokeWidth="1" />
                <polygon points="300,50 350,100 330,160 270,160 250,100" fill="none" stroke={mineral.gem} strokeWidth="1" />
                <polygon points="500,80 550,130 530,190 470,190 450,130" fill="none" stroke={mineral.gem} strokeWidth="1" />
            </svg>

            {/* Gem glow */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20 blur-3xl" style={{
                background: mineral.gem,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Crystal frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        boxShadow: `0 0 60px ${mineral.gem}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Sparkle accents */}
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" style={{ background: mineral.gem, boxShadow: `0 0 10px ${mineral.gem}` }} />
                    <div className="absolute bottom-8 left-8 w-1 h-1 rounded-full" style={{ background: mineral.gem, boxShadow: `0 0 6px ${mineral.gem}` }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-8" style={{ background: mineral.gem }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f5f5f5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};
