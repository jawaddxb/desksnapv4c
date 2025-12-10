import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent, MagazineLayout } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const EditorialArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const isVerticalInverted = rng?.next() ?? 0 > 0.5;
    const isHorizontalInverted = rng?.next() ?? 0 > 0.5;
    const vol = rng?.range(1, 12).toFixed(0) ?? '1';

    return (
        <div className="w-full h-full relative overflow-hidden bg-black group">
            <div className="absolute inset-0 opacity-80 transition-transform duration-[2s] group-hover:scale-105" style={{ zIndex: LayoutLayer.BACKGROUND }}>
                <ImageContainer slide={slide} theme={theme} />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" style={{ zIndex: LayoutLayer.DECORATION }} />

            <div className={`absolute w-full h-full p-8 md:p-16 flex flex-col ${isVerticalInverted ? 'justify-start' : 'justify-end'} ${isHorizontalInverted ? 'items-end' : 'items-start'}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                 <div className={`flex items-center gap-4 mb-2 border-b border-white/30 pb-4 max-w-xs ${isHorizontalInverted ? 'flex-row-reverse' : ''}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                    <span className="text-white text-xs font-bold uppercase tracking-widest">{theme.name}</span>
                    <span className="text-white/50 text-xs">/</span>
                    <span className="text-white text-xs font-serif italic">Vol. {vol}</span>
                </div>

                <MagazineLayout
                    alignRight={isHorizontalInverted}
                    titleNode={
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter opacity-90"
                            style={{ lineHeight: '0.9', zIndex: LayoutLayer.CONTENT_BASE }}
                        />
                    }
                    contentNode={
                        <EditableContent slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="flex-1 text-shadow-sm font-medium" bullet={false} />
                    }
                />
            </div>
        </div>
    );
};
