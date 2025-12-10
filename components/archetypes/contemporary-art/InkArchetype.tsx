import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const InkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ink = {
        black: '#0a0a0a',
        paper: '#faf8f5',
        gray: '#6b6b6b',
        red: '#c41e3a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ink.paper }}>
            {/* Brush stroke accent SVG */}
            <svg className="absolute top-1/4 left-8 w-32 h-64 opacity-15 pointer-events-none" viewBox="0 0 100 200" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M50 0 Q30 50, 50 100 Q70 150, 40 200" fill="none" stroke={ink.black} strokeWidth="8" strokeLinecap="round" />
            </svg>

            {/* Ink splatter decoration */}
            <svg className="absolute bottom-12 right-12 w-24 h-24 opacity-10 pointer-events-none" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <circle cx="50" cy="50" r="30" fill={ink.black} />
                <circle cx="75" cy="35" r="8" fill={ink.black} />
                <circle cx="30" cy="70" r="5" fill={ink.black} />
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Content - Zen spontaneity */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Red seal/chop mark */}
                    <div className="w-10 h-10 mb-8 flex items-center justify-center" style={{
                        background: ink.red,
                        transform: 'rotate(-5deg)'
                    }}>
                        <span className="text-white text-xs font-bold">印</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: ink.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: ink.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />
                </div>

                {/* Rice paper framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border" style={{ borderColor: ink.gray, opacity: 0.3 }} />
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `1px solid ${ink.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
