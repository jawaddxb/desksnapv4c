import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CanvasArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng?.pick(['#f97316', '#ec4899', '#8b5cf6', '#06b6d4']) ?? '#f97316';
    const rotation = rng?.range(-2, 2) ?? 0;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#f5f5f4' }}>
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12 items-center">
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-2xl" style={{ background: accentColor, opacity: 0.1, transform: `rotate(${rotation}deg)` }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-2xl" style={{ transform: `rotate(${rotation}deg)` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-xl" style={{ background: accentColor, opacity: 0.8, zIndex: LayoutLayer.DECORATION }} />
                </div>

                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-2 mb-8 rounded-full" style={{ background: accentColor }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

                    <div className="mt-8 flex gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.25 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
