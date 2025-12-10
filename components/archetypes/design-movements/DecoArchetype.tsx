import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const DecoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    const gold = '#d4af37';
    const navy = '#0a0a14';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: navy }}>
            <div className="absolute inset-0 flex items-center justify-center opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-1 h-full origin-center" style={{
                        background: gold,
                        transform: `rotate(${i * 30}deg)`
                    }} />
                ))}
            </div>

            <div className="absolute inset-6 border-2" style={{ borderColor: gold, zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
            </div>

            <div className="absolute top-10 left-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
                <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
            </div>
            <div className="absolute top-10 right-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION, transform: 'scaleX(-1)' }}>
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
                <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
                <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
            </div>

            <div className="w-full h-full p-16 md:p-20 flex items-center gap-12">
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-8" style={{ background: gold }} />
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.1', letterSpacing: '0.05em' }}
                    />
                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3 border" style={{ borderColor: gold }} />
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gold}` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: LayoutLayer.OVERLAY }}>
                        <div className="w-0 h-0" style={{
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: `20px solid ${gold}`
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
