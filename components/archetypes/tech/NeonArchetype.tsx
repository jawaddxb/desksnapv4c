import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NeonArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const neonColors = [
        { primary: '#ff00ff', secondary: '#00ffff' },
        { primary: '#00ffff', secondary: '#ff00ff' },
        { primary: '#ff0080', secondary: '#80ff00' },
        { primary: '#00ff80', secondary: '#8000ff' }
    ];
    const colors = rng?.pick(neonColors) ?? neonColors[0];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#000000' }}>
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                zIndex: LayoutLayer.OVERLAY
            }} />

            <div className="absolute inset-0 opacity-20" style={{
                background: `radial-gradient(ellipse at 20% 80%, ${colors.primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colors.secondary}40 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-8 md:p-16 flex items-center">
                <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="mb-8">
                        <span className="px-4 py-1 text-xs uppercase tracking-[0.3em] border" style={{
                            color: colors.primary,
                            borderColor: colors.primary,
                            boxShadow: `0 0 10px ${colors.primary}60, inset 0 0 10px ${colors.primary}30`
                        }}>System Online</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-6"
                        style={{
                            fontWeight: 900,
                            lineHeight: '0.95',
                            textShadow: `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}40, 0 0 60px ${colors.primary}20`
                        }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: colors.secondary }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
                </div>

                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-2/5 aspect-[4/5] hidden md:block" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute inset-0 rounded-lg" style={{
                        boxShadow: `0 0 30px ${colors.primary}60, 0 0 60px ${colors.primary}30, inset 0 0 30px ${colors.secondary}20`,
                        border: `2px solid ${colors.primary}`
                    }} />
                    <div className="absolute inset-2 rounded-md overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
