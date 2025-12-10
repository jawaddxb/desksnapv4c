import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NeueArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#fef08a', '#fecaca', '#bbf7d0', '#bfdbfe'];
    const bgColor = rng?.pick(bgColors) ?? bgColors[0];
    const shadowOffset = 8;

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
            <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
                {/* Image with brutal frame */}
                <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-2xl border-4 border-black overflow-hidden" style={{
                        boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content card */}
                <div className="w-full md:w-3/5 p-8 rounded-2xl border-4 border-black" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: '#ffffff',
                    boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
                }}>
                    <div className="inline-block px-4 py-1 rounded-full border-2 border-black mb-6 text-sm font-bold uppercase">
                        Featured
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 900, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />

                    <div className="mt-8 flex gap-3">
                        <div className="px-6 py-3 rounded-xl border-3 border-black text-sm font-bold" style={{
                            background: bgColor,
                            boxShadow: '4px 4px 0px #000000'
                        }}>
                            Learn More
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
