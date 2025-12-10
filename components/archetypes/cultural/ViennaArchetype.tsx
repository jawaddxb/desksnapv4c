import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ViennaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const vienna = {
        cream: '#faf8f0',
        gold: '#c9a227',
        burgundy: '#722f37',
        forest: '#2f4f4f'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: vienna.cream }}>
            {/* Klimt-inspired pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-full h-full" style={{
                    background: `repeating-linear-gradient(45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px)`
                }} />
            </div>

            {/* Ornate border */}
            <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: vienna.gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4" style={{ background: vienna.cream }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t-2 border-r-2" style={{ borderColor: vienna.gold }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Gilded frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: `linear-gradient(135deg, ${vienna.gold} 0%, #e8d48a 50%, ${vienna.gold} 100%)`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        <div className="absolute inset-2" style={{ background: vienna.cream }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${vienna.gold}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center pl-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
                        <div className="flex-1 h-px" style={{ background: vienna.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative footer */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px" style={{ background: vienna.gold }} />
                        <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
