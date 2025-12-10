import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ClayArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const clayColors = [
        { bg: '#f0f4ff', card: '#e8edff' },
        { bg: '#fff0f4', card: '#ffe8ed' },
        { bg: '#f0fff4', card: '#e8ffe8' },
        { bg: '#fffff0', card: '#ffffe8' }
    ];
    const colors = rng?.pick(clayColors) ?? clayColors[0];

    return (
        <div className="w-full h-full relative overflow-hidden p-10 md:p-16" style={{ background: colors.bg }}>
            {/* Soft background shapes */}
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-50" style={{
                background: colors.card,
                boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.05), inset -8px -8px 16px rgba(255,255,255,0.8)',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full flex items-center gap-12">
                {/* Clay card - Content */}
                <div className="w-1/2 p-10 rounded-[32px]" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: colors.card,
                    boxShadow: `
                        20px 20px 60px rgba(0,0,0,0.08),
                        -20px -20px 60px rgba(255,255,255,0.9),
                        inset 2px 2px 4px rgba(255,255,255,0.8),
                        inset -2px -2px 4px rgba(0,0,0,0.04)
                    `
                }}>
                    <div className="w-16 h-4 rounded-full mb-8" style={{
                        background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)'
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                {/* Clay image container */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-[40px] overflow-hidden" style={{
                        boxShadow: `
                            20px 20px 60px rgba(0,0,0,0.1),
                            -20px -20px 60px rgba(255,255,255,0.9),
                            inset 4px 4px 8px rgba(255,255,255,0.6),
                            inset -4px -4px 8px rgba(0,0,0,0.05)
                        `
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
