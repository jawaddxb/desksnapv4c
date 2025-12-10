import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const LetterpressArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const letterpress = {
        ink: '#1a1a1a',
        paper: '#faf8f5',
        deboss: '#e8e4dc',
        accent: '#c9a227'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: letterpress.paper }}>
            {/* Ink impression texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='2' height='2' fill='%23000'/%3E%3Crect x='45' y='25' width='1' height='1' fill='%23000'/%3E%3Crect x='85' y='65' width='2' height='1' fill='%23000'/%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px'
            }} />

            {/* Registration offset hints */}
            <div className="absolute top-4 left-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute top-4 right-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-4 left-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-1 mb-8" style={{ background: letterpress.ink }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: letterpress.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wide"
                        style={{ fontWeight: 700, lineHeight: '1.1', textShadow: `1px 1px 0 ${letterpress.deboss}` }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Craft printing beauty marks */}
                    <div className="flex gap-4 mt-8">
                        <div className="w-8 h-1" style={{ background: letterpress.ink }} />
                        <div className="w-4 h-1" style={{ background: letterpress.accent }} />
                    </div>
                </div>

                {/* Debossed frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: letterpress.deboss,
                        boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
                    }} />
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        border: `2px solid ${letterpress.ink}`,
                        boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
