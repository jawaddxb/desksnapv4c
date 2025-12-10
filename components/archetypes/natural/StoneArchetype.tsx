import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const StoneArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isMarble = (rng?.next() ?? 0.5) > 0.5;
    const stone = isMarble ? {
        bg: '#f5f5f0',
        vein: '#c9c5b8',
        accent: '#d4af37'
    } : {
        bg: '#3d4852',
        vein: '#5a6a78',
        accent: '#c9a227'
    };
    const textColor = isMarble ? '#2d2d2d' : '#e8e8e8';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: stone.bg }}>
            {/* Marble/slate veining pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <path d="M0,50 Q100,30 200,60 T400,50 T600,70" stroke={stone.vein} strokeWidth="2" fill="none" />
                <path d="M0,150 Q150,120 300,160 T600,140" stroke={stone.vein} strokeWidth="1" fill="none" />
                <path d="M0,250 Q80,220 200,260 T500,230" stroke={stone.vein} strokeWidth="1.5" fill="none" />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-8" style={{ background: stone.accent }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: isMarble ? '#6b6b6b' : '#b8c0c8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Stone slab image frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2 opacity-30" style={{
                        background: stone.vein,
                        transform: 'rotate(1deg)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Gold vein accent */}
                    <div className="absolute bottom-0 right-0 w-1/3 h-1" style={{ background: stone.accent }} />
                </div>
            </div>
        </div>
    );
};
