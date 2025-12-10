import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const HyggeArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const warmAmber = '#e8c87a';
    const creamColor = '#f5f0e8';
    const isFlipped = (rng?.next() ?? 0.5) > 0.5;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#faf9f7' }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='linen'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23linen)' opacity='0.3'/%3E%3C/svg%3E")`
            }} />

            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: warmAmber }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: '#ffecd2' }} />

            <div className={`w-full h-full p-12 md:p-20 flex ${isFlipped ? 'flex-row-reverse' : 'flex-row'} gap-16 items-center`}>
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6 opacity-50">
                        <div className="w-3 h-3 rounded-full" style={{ background: warmAmber, boxShadow: `0 0 12px ${warmAmber}` }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b8178' }}>Hygge</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <div className="p-6 rounded-2xl" style={{ background: creamColor, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" />
                    </div>
                </div>

                <div className="w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]" style={{ border: `8px solid ${creamColor}` }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-90" />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full opacity-60" style={{
                        background: `repeating-linear-gradient(90deg, ${warmAmber} 0px, ${warmAmber} 4px, transparent 4px, transparent 8px)`
                    }} />
                </div>
            </div>
        </div>
    );
};
