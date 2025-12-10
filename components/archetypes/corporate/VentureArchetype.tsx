import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const VentureArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng?.pick(['#1e40af', '#059669', '#7c3aed']) ?? '#1e40af';
    const isImageLeft = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            <div className="absolute top-12 right-12 w-3 h-3 rounded-full" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className={`w-full h-full p-16 md:p-24 flex ${isImageLeft ? 'flex-row' : 'flex-row-reverse'} gap-20 items-center`}>
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-12 h-1 mb-8" style={{ background: accentColor }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#111827' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl lg:text-8xl mb-10"
                        style={{ fontWeight: 700, lineHeight: '1.0', letterSpacing: '-0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-xl" style={{ lineHeight: '1.6' }} />
                </div>
            </div>
        </div>
    );
};
