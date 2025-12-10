import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ForestArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const forest = {
        deep: '#1a2e1a',
        moss: '#4a6741',
        fern: '#6b8e23',
        bark: '#5d4e37'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: forest.deep }}>
            {/* Organic shapes representing foliage */}
            <div className="absolute top-0 right-0 w-2/3 h-1/2 opacity-20" style={{
                background: `radial-gradient(ellipse at 100% 0%, ${forest.moss} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/3 opacity-15" style={{
                background: `radial-gradient(ellipse at 0% 100%, ${forest.fern} 0%, transparent 60%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with natural edge */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden rounded-tr-[100px] rounded-bl-[100px]">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Moss accent */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-60" style={{ background: forest.moss }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-16 h-1 mb-8 rounded-full" style={{ background: forest.fern }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#e8f0e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8c0a8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};
