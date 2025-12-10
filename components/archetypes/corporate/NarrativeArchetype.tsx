import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NarrativeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isImageLeft = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfbf8' }}>
            <div className={`w-full h-full flex ${isImageLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 h-full relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>

                <div className="w-1/2 h-full p-12 md:p-16 lg:p-20 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-full h-px mb-8" style={{ background: '#e5e1d8' }} />

                    <span className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: '#9ca3af' }}>Feature Story</span>

                    <div className="flex">
                        <div className="w-1 mr-6" style={{ background: '#d4d0c8' }} />
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-8"
                            style={{ fontWeight: 400, lineHeight: '1.15' }}
                        />
                    </div>

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base max-w-sm" style={{ lineHeight: '1.8' }} />

                    <div className="w-full h-px mt-12" style={{ background: '#e5e1d8' }} />
                </div>
            </div>
        </div>
    );
};
