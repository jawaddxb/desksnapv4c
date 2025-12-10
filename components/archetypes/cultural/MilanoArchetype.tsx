import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MilanoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const milano = {
        white: '#ffffff',
        black: '#000000',
        red: '#dc2626'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: milano.white }}>
            {/* Bold diagonal accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full" style={{
                background: milano.black,
                clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center">
                {/* Hero image - Full prominence */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} className="contrast-110" />
                    </div>
                    {/* Red accent bar */}
                    <div className="absolute -bottom-4 left-0 w-full h-2" style={{ background: milano.red }} />
                </div>

                {/* Content */}
                <div className="w-1/2 pl-16 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: milano.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-8"
                        style={{ fontWeight: 900, lineHeight: '0.9', textTransform: 'uppercase' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    <div className="mt-8 flex gap-4">
                        <div className="w-3 h-3" style={{ background: milano.red }} />
                        <div className="w-3 h-3" style={{ background: milano.black }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
