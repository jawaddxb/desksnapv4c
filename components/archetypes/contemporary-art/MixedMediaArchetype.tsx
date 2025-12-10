import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MixedMediaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mixedmedia = {
        paper: '#f5f0e6',
        kraft: '#c9a86c',
        newsprint: '#e8e4d8',
        ink: '#2a2a2a',
        tape: '#f5e6b8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mixedmedia.paper }}>
            {/* Paper texture variety - found materials */}
            <div className="absolute top-8 right-8 w-48 h-32 opacity-30 pointer-events-none" style={{
                background: mixedmedia.newsprint,
                transform: 'rotate(3deg)',
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-12 left-12 w-32 h-24 opacity-40 pointer-events-none" style={{
                background: mixedmedia.kraft,
                transform: 'rotate(-5deg)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Overlapping transparency effect */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 opacity-10 pointer-events-none" style={{
                background: mixedmedia.ink,
                borderRadius: '50%',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Layered collage image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    {/* Tape piece */}
                    <div className="absolute -top-4 left-1/4 w-24 h-6 opacity-70" style={{
                        background: mixedmedia.tape,
                        transform: 'rotate(5deg)',
                        zIndex: LayoutLayer.OVERLAY
                    }} />
                    <div className="absolute -inset-2" style={{
                        background: mixedmedia.kraft,
                        transform: 'rotate(-2deg)'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        border: `2px solid ${mixedmedia.ink}`,
                        transform: 'rotate(1deg)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on torn paper */}
                <div className="flex-1 p-8 relative" style={{
                    background: mixedmedia.newsprint,
                    transform: 'rotate(-1deg)',
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    <div className="w-12 h-1 mb-6" style={{ background: mixedmedia.ink }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: mixedmedia.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />
                </div>
            </div>
        </div>
    );
};
