import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BloomArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bloom = {
        cream: '#faf8f5',
        blush: '#f5e6e8',
        green: '#6b8e6b',
        petal: '#e8b4b8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bloom.cream }}>
            {/* Botanical corner accents */}
            <svg className="absolute top-0 left-0 w-48 h-48 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
                <circle cx="80" cy="20" r="8" fill={bloom.petal} opacity="0.5" />
                <circle cx="50" cy="80" r="5" fill={bloom.petal} opacity="0.3" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-15 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
                <circle cx="80" cy="20" r="10" fill={bloom.petal} opacity="0.5" />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with botanical frame */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] rounded-t-full overflow-hidden" style={{
                        border: `3px solid ${bloom.green}40`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-8">
                        <div className="w-8 h-2 rounded-full" style={{ background: bloom.petal }} />
                        <div className="w-4 h-2 rounded-full" style={{ background: bloom.green }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};
