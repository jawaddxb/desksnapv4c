import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ParisArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const paris = {
        cream: '#faf8f5',
        blush: '#f5e6e8',
        black: '#1a1a1a',
        gold: '#c9a227'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: paris.cream }}>
            {/* Art Nouveau curve */}
            <svg className="absolute bottom-0 left-0 w-full h-1/3 opacity-10" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q100,50 200,80 T400,60 L400,100 Z" fill={paris.black} />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px" style={{ background: paris.gold }} />
                        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: paris.gold }}>Paris</span>
                        <div className="w-12 h-px" style={{ background: paris.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: paris.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Elegant thin frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{
                        border: `1px solid ${paris.black}`,
                        padding: '8px'
                    }}>
                        <div className="w-full h-full overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    {/* Gold accent corner */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: paris.gold }} />
                </div>
            </div>
        </div>
    );
};
