import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const KyotoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const kyoto = {
        cream: '#f5f2e8',
        sage: '#8a9a7a',
        stone: '#9a9a8a',
        ink: '#2a2a2a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: kyoto.cream }}>
            {/* Subtle wave pattern (Seigaiha) */}
            <svg className="absolute bottom-0 left-0 w-full h-1/4 opacity-5" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" style={{ zIndex: LayoutLayer.DECORATION }}>
                {[...Array(8)].map((_, i) => (
                    <circle key={i} cx={50 + i * 50} cy="100" r="40" fill="none" stroke={kyoto.ink} strokeWidth="1" />
                ))}
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-20">
                {/* Maximum Ma (empty space) - Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-1 h-16 mb-12" style={{ background: kyoto.sage }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: kyoto.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: kyoto.stone }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
                </div>

                {/* Image with subtle natural frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/5] overflow-hidden" style={{
                        borderLeft: `1px solid ${kyoto.sage}40`,
                        paddingLeft: '20px'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
