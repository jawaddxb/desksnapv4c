import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mist = {
        light: '#f5f5f5',
        gray: '#d4d4d4',
        dark: '#a8a8a8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${mist.light} 0%, ${mist.gray} 100%)` }}>
            {/* Mist layers */}
            <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute w-full h-1/3 bottom-0 opacity-60" style={{
                    background: `linear-gradient(180deg, transparent 0%, ${mist.light}80 100%)`,
                    filter: 'blur(20px)'
                }} />
                <div className="absolute w-full h-1/2 top-1/4 opacity-40" style={{
                    background: `linear-gradient(90deg, transparent 0%, ${mist.light}60 50%, transparent 100%)`,
                    filter: 'blur(40px)'
                }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center text-center">
                <div className="max-w-3xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
                </div>

                {/* Fading image */}
                <div className="absolute bottom-8 left-8 w-48 h-32 rounded-lg overflow-hidden opacity-50" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                    <div className="absolute inset-0" style={{
                        background: `linear-gradient(90deg, transparent 0%, ${mist.light} 100%)`
                    }} />
                </div>
            </div>
        </div>
    );
};
