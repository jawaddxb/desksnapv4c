import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SlideArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng?.pick(['#2563eb', '#dc2626', '#059669', '#7c3aed']) ?? '#2563eb';
    const isImageRight = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            <div className={`w-full h-full p-12 md:p-16 flex ${isImageRight ? 'flex-row' : 'flex-row-reverse'} gap-12 items-center`}>
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <div className="space-y-3">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="px-4 py-2 rounded-full text-sm" style={{ background: `${accentColor}15`, color: accentColor }}>
                            Key Insight
                        </div>
                    </div>
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
