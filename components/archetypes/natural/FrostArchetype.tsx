import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const FrostArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const frost = {
        ice: '#f0f7ff',
        blue: '#a8d8ff',
        silver: '#c8d8e8',
        white: '#ffffff'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: frost.ice }}>
            {/* Crystalline patterns */}
            <svg className="absolute top-0 right-0 w-96 h-96 opacity-20" viewBox="0 0 200 200" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M100,10 L100,190 M10,100 L190,100 M30,30 L170,170 M170,30 L30,170" stroke={frost.blue} strokeWidth="1" />
                <path d="M100,40 L80,60 M100,40 L120,60 M100,160 L80,140 M100,160 L120,140" stroke={frost.blue} strokeWidth="1" />
            </svg>

            {/* Frost overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                background: `radial-gradient(circle at 70% 30%, ${frost.white} 0%, transparent 50%)`,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-px mb-8" style={{ background: frost.blue }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a4a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a7a9a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Frosted image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden" style={{
                        boxShadow: `0 0 60px ${frost.blue}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Frost border effect */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                        border: `2px solid ${frost.white}80`,
                        boxShadow: `inset 0 0 30px ${frost.white}40`
                    }} />
                </div>
            </div>
        </div>
    );
};
