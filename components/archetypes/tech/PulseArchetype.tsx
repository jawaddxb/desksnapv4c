import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const PulseArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng?.pick(['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']) ?? '#22c55e';
    const pulseValue = rng?.range(60, 180).toFixed(0) ?? '120';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f172a' }}>
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(${accentColor}40 1px, transparent 1px), linear-gradient(90deg, ${accentColor}40 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="absolute left-0 right-0 top-1/3 h-px opacity-40" style={{
                background: `linear-gradient(90deg, transparent 0%, ${accentColor} 20%, ${accentColor} 40%, transparent 50%, ${accentColor} 60%, ${accentColor} 80%, transparent 100%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="mb-8">
                        <span className="text-8xl md:text-9xl font-bold" style={{ color: accentColor }}>{pulseValue}</span>
                        <span className="text-2xl ml-2" style={{ color: '#64748b' }}>bpm</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f1f5f9' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-3xl md:text-4xl lg:text-5xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#94a3b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />

                    <div className="mt-8 flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                        <span className="text-xs uppercase tracking-wider" style={{ color: accentColor }}>Live Data</span>
                    </div>
                </div>

                <div className="w-full md:w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-video rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}40` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    <div className="absolute -inset-2 rounded-xl opacity-20 blur-xl" style={{ background: accentColor }} />
                </div>
            </div>
        </div>
    );
};
