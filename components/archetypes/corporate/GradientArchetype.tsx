import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GradientArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gradients = [
        'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
    ];
    const gradient = rng?.pick(gradients) ?? gradients[0];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: gradient }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.85)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden rounded-3xl" style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '16px'
                    }}>
                        <div className="w-full h-full rounded-2xl overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
