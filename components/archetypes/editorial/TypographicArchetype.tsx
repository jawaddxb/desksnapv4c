import React from 'react';
import { Quote } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TypographicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, onUpdateSlide, readOnly }) => {
    const bgWord = slide.title.split(' ')[0] || "SLIDE";
    const words = Array(6).fill(bgWord);

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-8" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden leading-[0.8] flex flex-col justify-center" style={{ zIndex: LayoutLayer.BACKGROUND, color: contrast.text, fontFamily: theme.fonts.heading, fontSize: '20vh', fontWeight: 900, whiteSpace: 'nowrap' }}>
                {words.map((w, i) => (
                    <div key={i} style={{ marginLeft: `${i * -5}%` }}>{w} {w} {w}</div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl items-center pointer-events-none" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="order-2 md:order-1 pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-24 h-2 bg-current mb-8" style={{ color: contrast.accent }} />
                    <EditableTitle
                        slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight"
                        style={{ lineHeight: '0.9' }}
                    />
                    <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl md:text-2xl font-light" />
                </div>

                <div className="order-1 md:order-2 relative aspect-square pointer-events-auto" style={{ zIndex: LayoutLayer.MEDIA }}>
                     <div className="absolute inset-0 border-2 rounded-full opacity-20 scale-110" style={{ borderColor: contrast.text, borderStyle: 'dashed' }} />
                     <div className="w-full h-full rounded-full overflow-hidden border-4 relative shadow-2xl" style={{ borderColor: contrast.bg }}>
                        <ImageContainer slide={slide} theme={theme} />
                     </div>
                     <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-xl border border-black" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
                        <Quote className="w-8 h-8 opacity-50" style={{ color: contrast.text }} />
                     </div>
                </div>
            </div>
        </div>
    );
};
