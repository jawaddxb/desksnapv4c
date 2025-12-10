import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const KinfolkArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isImageRight = (rng?.next() ?? 0.5) > 0.5;
    const dustyRose = '#c9b8b5';
    const issueNum = rng?.range(1, 50).toFixed(0) ?? '12';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfaf6' }}>
            <div className="w-full h-full p-16 md:p-24 lg:p-32">
                <div className={`w-full h-full flex ${isImageRight ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-2/5 flex flex-col justify-end pb-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <div className="w-full h-px mb-6" style={{ background: '#e0dcd8' }} />
                        <span className="text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: '#a89e94' }}>
                            Issue {issueNum}
                        </span>

                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-4xl md:text-5xl lg:text-6xl mb-8"
                            style={{ fontWeight: 400, lineHeight: '1.15' }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm max-w-xs" style={{ lineHeight: '1.7' }} bullet={false} />
                    </div>

                    <div className="w-1/5" />

                    <div className="w-2/5 flex flex-col justify-start" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="w-full aspect-[3/4] relative">
                            <ImageContainer slide={slide} theme={theme} className="grayscale-[20%]" />
                        </div>
                        <div className="w-full h-px mt-4" style={{ background: dustyRose }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
