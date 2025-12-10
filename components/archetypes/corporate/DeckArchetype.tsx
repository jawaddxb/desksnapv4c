import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const DeckArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const navy = '#1e3a5f';
    const slideNumber = rng?.range(1, 24).toFixed(0) ?? '1';

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ background: '#ffffff' }}>
            <div className="w-full px-12 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb', zIndex: LayoutLayer.OVERLAY }}>
                <span className="text-xs uppercase tracking-[0.15em]" style={{ color: '#9ca3af' }}>Confidential</span>
                <span className="text-xs" style={{ color: '#9ca3af' }}>Page {slideNumber}</span>
            </div>

            <div className="flex-1 p-12 md:p-16 flex gap-12">
                <div className="w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-3xl md:text-4xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.25' }}
                    />

                    <div className="flex-1">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                    </div>

                    <div className="mt-auto pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
                        <span className="text-xs uppercase tracking-[0.1em]" style={{ color: '#9ca3af' }}>Source: Internal Analysis</span>
                    </div>
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden rounded-lg" style={{ border: '1px solid #e5e7eb' }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>

            <div className="w-full h-1" style={{ background: navy }} />
        </div>
    );
};
