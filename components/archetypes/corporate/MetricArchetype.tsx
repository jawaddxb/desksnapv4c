import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MetricArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const metricValue = rng?.pick(['$2.4M', '147%', '10K+', '99.9%', '3.2x']) ?? '$2.4M';
    const metricLabel = rng?.pick(['Revenue', 'Growth', 'Users', 'Uptime', 'ROI']) ?? 'Revenue';
    const accentColor = '#22c55e';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#6b7280' }}>{metricLabel}</span>
                    <div className="text-8xl md:text-9xl lg:text-[160px] mb-8" style={{ color: '#111827', fontWeight: 800, lineHeight: '0.9', letterSpacing: '-0.03em' }}>
                        {metricValue}
                    </div>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
                        <span className="text-sm" style={{ color: accentColor }}>+24% this quarter</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-2xl md:text-3xl mb-4"
                        style={{ fontWeight: 500, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base max-w-md" style={{ lineHeight: '1.6' }} />
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-xl">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
