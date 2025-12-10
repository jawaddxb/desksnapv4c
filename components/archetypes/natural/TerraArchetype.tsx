import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TerraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const terra = {
        cream: '#faf7f2',
        terracotta: '#c17767',
        sage: '#87a68a',
        brown: '#8b6f5c'
    };
    const accentColor = rng?.pick([terra.terracotta, terra.sage]) ?? terra.terracotta;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: terra.cream }}>
            {/* Organic curved shapes */}
            <div className="absolute bottom-0 right-0 w-1/2 h-1/3 opacity-20" style={{
                background: accentColor,
                borderRadius: '100% 0 0 0',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.terracotta }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.sage }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: terra.brown }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Image with organic frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] overflow-hidden" style={{
                        borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
                        border: `4px solid ${accentColor}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
