import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BentoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const imagePosition = rng?.pick(['top-left', 'top-right', 'bottom-left', 'bottom-right']) ?? 'top-left';
    const accentNum = rng?.range(1, 9).toFixed(0) ?? '4';

    return (
        <div className="w-full h-full relative overflow-hidden p-6 md:p-10" style={{ background: '#fafafa' }}>
            <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-span-2' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} relative overflow-hidden rounded-2xl shadow-sm`} style={{ zIndex: LayoutLayer.MEDIA, background: '#f0f0f0' }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>

                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} p-6 flex flex-col justify-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#9ca3af' }}>Overview</span>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-xl md:text-2xl lg:text-3xl"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />
                </div>

                <div className={`${imagePosition === 'top-left' ? 'col-span-2 col-start-1' : imagePosition === 'top-right' ? 'col-span-2 col-start-2' : imagePosition === 'bottom-left' ? 'col-span-2 col-start-1' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} p-6 flex items-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_BASE }}>
                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm md:text-base" style={{ lineHeight: '1.65' }} />
                </div>

                <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} rounded-2xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', zIndex: LayoutLayer.DECORATION }}>
                    <div className="text-white text-4xl md:text-5xl font-bold opacity-90">{accentNum}</div>
                </div>
            </div>
        </div>
    );
};
