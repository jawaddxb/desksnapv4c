import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GrainArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grain = {
        light: '#f5ebe0',
        honey: '#ddb892',
        brown: '#b08968',
        dark: '#7f5539'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: grain.light }}>
            {/* Wood grain pattern simulation */}
            <div className="absolute inset-0 opacity-10" style={{
                background: `repeating-linear-gradient(90deg, ${grain.honey} 0px, ${grain.honey} 2px, transparent 2px, transparent 20px)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-8" style={{ background: grain.brown }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: grain.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: grain.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Image with natural frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-lg" style={{ background: grain.honey, opacity: 0.3 }} />
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
                        border: `4px solid ${grain.brown}`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
