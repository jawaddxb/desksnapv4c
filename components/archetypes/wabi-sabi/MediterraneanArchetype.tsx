import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MediterraneanArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    const azure = '#2563eb';
    const terracotta = '#c2714f';
    const olive = '#6b7c5c';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefefe' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stucco'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stucco)' opacity='0.4'/%3E%3C/svg%3E")`
            }} />

            <div className="absolute bottom-0 left-0 w-full h-4 opacity-40" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `repeating-linear-gradient(90deg, ${azure} 0px, ${azure} 16px, #fff 16px, #fff 32px)`
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-[3/4] overflow-hidden shadow-xl" style={{
                        borderRadius: '50% 50% 4px 4px / 30% 30% 0% 0%',
                        border: `4px solid ${terracotta}20`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="saturate-90 brightness-105" style={{ filter: 'sepia(10%)' }} />
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[50%] opacity-10" style={{ background: '#000', filter: 'blur(8px)' }} />
                </div>

                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-1" style={{ background: azure }} />
                        <span className="text-xs uppercase tracking-[0.25em]" style={{ color: olive }}>Mediterraneo</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

                    <div className="mt-10 flex gap-4">
                        <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: azure }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: terracotta }} />
                        <div className="w-8 h-8 rounded-full" style={{ background: olive }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
