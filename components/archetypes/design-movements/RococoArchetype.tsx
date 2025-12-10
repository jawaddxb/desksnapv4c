import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const RococoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const rococo = {
        blush: '#fdf2f4',
        powder: '#e8f4f8',
        gold: '#c9a227',
        cream: '#faf8f0'
    };
    const bgColor = rng?.pick([rococo.blush, rococo.powder, rococo.cream]) ?? rococo.blush;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
            {/* Scrollwork decoration */}
            <svg className="absolute top-0 left-0 w-64 h-64 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="5" fill={rococo.gold} />
            </svg>
            <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-20 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="5" fill={rococo.gold} />
            </svg>

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Ornate header */}
                    <div className="flex items-center gap-2 mb-8">
                        <svg className="w-8 h-8" viewBox="0 0 24 24">
                            <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
                        </svg>
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: rococo.gold }}>Exquisite</span>
                        <svg className="w-8 h-8 rotate-180" viewBox="0 0 24 24">
                            <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
                        </svg>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>

                {/* Gilded frame image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    {/* Outer ornate frame */}
                    <div className="absolute -inset-6 rounded-lg" style={{
                        background: `linear-gradient(135deg, ${rococo.gold} 0%, #e8d48a 50%, ${rococo.gold} 100%)`,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                    }}>
                        <div className="absolute inset-2 rounded" style={{ background: bgColor }} />
                    </div>
                    <div className="relative w-full aspect-[4/5] rounded overflow-hidden" style={{ border: `4px solid ${rococo.gold}` }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
