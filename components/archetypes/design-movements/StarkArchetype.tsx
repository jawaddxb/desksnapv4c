import React from 'react';
import { ArchetypeProps, EditableTitle } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const StarkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = (rng?.next() ?? 0.5) > 0.5;
    const bg = isDark ? '#000000' : '#ffffff';
    const text = isDark ? '#ffffff' : '#000000';

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-16 md:p-24" style={{ background: bg }}>
            {/* Single content element - Maximum breathing room */}
            <div className="max-w-3xl text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl"
                    style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                />
            </div>

            {/* Minimal image - Small, positioned */}
            {slide.imageUrl && (
                <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full overflow-hidden opacity-60" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            )}

            {/* Single dot accent */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: text, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />
        </div>
    );
};
