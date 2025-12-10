import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SignalArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const emerald = '#10b981';
    const amber = '#f59e0b';
    const isGrowth = (rng?.next() ?? 0.5) > 0.5;
    const accentColor = isGrowth ? emerald : amber;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f172a' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-16 flex gap-12">
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>Signal</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f8fafc' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <div className="border-l-2 pl-6" style={{ borderColor: accentColor }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#94a3b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                    </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[4/3] relative overflow-hidden rounded-lg" style={{ border: '1px solid #1e293b' }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-75" />
                        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(transparent, rgba(15,23,42,0.9))' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-2 rounded-full" style={{ background: accentColor }} />
                                <span className="text-xs" style={{ color: '#64748b' }}>Live Data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
