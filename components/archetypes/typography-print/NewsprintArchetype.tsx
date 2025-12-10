import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const NewsprintArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const newsprint = {
        black: '#1a1a1a',
        gray: '#6b6b6b',
        paper: '#f5f5e8',
        aged: '#e8e4d0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: newsprint.paper }}>
            {/* Column grid overlay */}
            <div className="absolute inset-8 flex gap-4 opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 border-x" style={{ borderColor: newsprint.black }} />
                ))}
            </div>

            {/* Halftone dot pattern hint */}
            <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                        <circle cx="4" cy="4" r="1.5" fill={newsprint.black} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#halftone)" />
            </svg>

            {/* Masthead line */}
            <div className="absolute top-6 left-8 right-8 h-px" style={{ background: newsprint.black, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute top-8 left-8 right-8 h-2" style={{ background: newsprint.black, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-16 pt-20 flex items-center gap-8">
                {/* Headline hierarchy content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-xs uppercase tracking-widest mb-2" style={{ color: newsprint.gray }}>BREAKING NEWS</span>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: newsprint.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-6 uppercase"
                        style={{ fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.02em' }}
                    />

                    <div className="w-full h-px mb-4" style={{ background: newsprint.black }} />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: newsprint.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base columns-2 gap-6" style={{ lineHeight: '1.6' }} />
                </div>

                {/* Newspaper photo */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
                        border: `1px solid ${newsprint.black}`,
                        filter: 'grayscale(100%) contrast(1.1)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="text-xs italic mt-2 text-center" style={{ color: newsprint.gray }}>
                        Photo caption placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};
