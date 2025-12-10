import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const HavanaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const havana = {
        pink: '#ffb6c1',
        yellow: '#fffacd',
        turquoise: '#40e0d0',
        coral: '#ff7f50'
    };
    const bgColor = rng?.pick([havana.pink, havana.yellow, havana.turquoise]) ?? havana.pink;
    const fadedBg = bgColor + '80';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${bgColor} 0%, ${fadedBg} 100%)` }}>
            {/* Sun-faded texture */}
            <div className="absolute inset-0 opacity-20" style={{
                background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Art deco typography hint */}
            <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-8 h-1" style={{ background: '#3d3d3d' }} />
                <div className="w-12 h-1" style={{ background: '#3d3d3d' }} />
                <div className="w-6 h-1" style={{ background: '#3d3d3d' }} />
            </div>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Vintage-treated image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] rounded-lg overflow-hidden" style={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.3] contrast-90 saturate-90" />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.coral }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.turquoise }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: havana.yellow }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};
