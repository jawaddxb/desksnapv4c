import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NordicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const nordic = {
        white: '#ffffff',
        gray: '#f5f5f5',
        wood: '#d4b896',
        blue: '#e0e8f0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: nordic.white }}>
            {/* Wood accent element */}
            <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: nordic.wood, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Content - Maximum negative space */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
                </div>

                {/* Image - Minimal treatment */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
