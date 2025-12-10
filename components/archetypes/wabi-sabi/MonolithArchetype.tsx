import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MonolithArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = (rng?.next() ?? 0.5) > 0.5;
    const bgColor = isDark ? '#0d0d0d' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0d0d0d';
    const accentColor = rng?.pick(['#ef4444', '#3b82f6', '#000000']) ?? '#ef4444';

    return (
        <div className="w-full h-full relative overflow-hidden flex" style={{ background: bgColor }}>
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="w-1/2 h-full relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                <ImageContainer slide={slide} theme={theme} className={isDark ? 'brightness-90' : ''} />
                <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: accentColor }} />
            </div>

            <div className="w-1/2 h-full flex flex-col justify-center px-16 md:px-24" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <div className="w-8 h-8 mb-12" style={{ background: accentColor }} />

                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-6xl md:text-8xl lg:text-9xl uppercase mb-12 tracking-tighter"
                    style={{ fontWeight: 400, lineHeight: '0.9' }}
                />

                <div className="w-full h-px mb-8" style={{ background: textColor, opacity: 0.2 }} />

                <EditableContent slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm uppercase tracking-widest opacity-60" bullet={false} />
            </div>
        </div>
    );
};
