import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AuroraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const waveOffset = rng?.range(0, 100) ?? 50;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0a0a1a' }}>
            <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute w-full h-1/2 top-0 opacity-40" style={{
                    background: `linear-gradient(180deg, transparent 0%, #22c55e30 30%, #06b6d440 50%, #8b5cf650 70%, #ec489940 90%, transparent 100%)`,
                    transform: `translateX(${waveOffset - 50}%)`,
                    filter: 'blur(60px)'
                }} />
                <div className="absolute w-full h-1/2 top-1/4 opacity-30" style={{
                    background: `linear-gradient(180deg, transparent 0%, #06b6d430 40%, #8b5cf640 60%, transparent 100%)`,
                    transform: `translateX(${50 - waveOffset}%)`,
                    filter: 'blur(80px)'
                }} />
            </div>

            <div className="absolute inset-0 opacity-60" style={{
                background: 'radial-gradient(1px 1px at 20% 30%, #ffffff 100%, transparent), radial-gradient(1px 1px at 80% 20%, #ffffff 100%, transparent), radial-gradient(1px 1px at 40% 70%, #ffffff 100%, transparent), radial-gradient(1px 1px at 60% 50%, #ffffff 100%, transparent), radial-gradient(1px 1px at 10% 60%, #ffffff 100%, transparent), radial-gradient(1px 1px at 90% 80%, #ffffff 100%, transparent)',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-10 md:p-20 flex flex-col justify-center items-center text-center">
                <div className="max-w-4xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
                </div>

                <div className="absolute bottom-12 left-12 w-56 h-40 rounded-2xl overflow-hidden opacity-80" style={{
                    zIndex: LayoutLayer.MEDIA,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>
        </div>
    );
};
