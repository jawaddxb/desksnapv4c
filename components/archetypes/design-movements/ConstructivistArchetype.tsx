import React from 'react';
import { Barcode } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const ConstructivistArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const angle = rng?.range(-15, 15) ?? 5;
    const primaryColor = rng?.pick([theme.colors.accent, '#ef4444', '#f59e0b', '#3b82f6']) ?? theme.colors.accent;
    const refNum = rng?.range(1000, 9999).toFixed(0) ?? '1234';

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-16 flex items-center" style={{ background: contrast.bg }}>
            <div className="absolute top-0 right-0 w-[60%] h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, background: primaryColor, clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
            <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full opacity-5 mix-blend-multiply" style={{ zIndex: LayoutLayer.BACKGROUND, background: contrast.text }} />

            <div className="absolute right-[5%] top-[10%] w-[45%] h-[70%] border-4 border-black transition-all duration-500 hover:rotate-0"
                 style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.text, transform: `rotate(${angle}deg)`, boxShadow: `20px 20px 0px ${primaryColor}` }}>
                <ImageContainer slide={slide} theme={theme} className="grayscale" />
            </div>

            <div className="w-full md:w-3/5 flex flex-col justify-center h-full pointer-events-none relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <div className="w-24 h-24 mb-6 rounded-full mix-blend-multiply opacity-90 animate-pulse pointer-events-auto" style={{ backgroundColor: primaryColor }} />

                <div className="pointer-events-auto bg-transparent">
                    <EditableTitle
                        slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-6xl md:text-8xl font-black uppercase mb-8"
                        style={{ lineHeight: '0.9' }}
                    />
                    <div className="border-l-4 pl-6 backdrop-blur-sm bg-white/30 p-4 rounded-r-lg" style={{ borderColor: contrast.text }}>
                        <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-bold" bullet={false} />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 right-12 bg-white border-2 border-black p-4 rotate-3" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
                <Barcode className="w-12 h-6 mb-1" style={{ color: contrast.text }} />
                <div className="text-[9px] font-mono text-center">REF-{refNum}</div>
            </div>
        </div>
    );
};
