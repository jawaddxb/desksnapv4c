import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const VictorianArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const victorian = {
        burgundy: '#722f37',
        forest: '#228b22',
        gold: '#d4af37',
        cream: '#f5f5dc',
        black: '#1a1a1a'
    };
    const accent = rng?.pick([victorian.burgundy, victorian.forest]) ?? victorian.burgundy;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: victorian.cream }}>
            {/* Ornate frame borders */}
            <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: victorian.gold, zIndex: LayoutLayer.DECORATION }}>
                {/* Ornate corner decorations */}
                {[
                    { pos: 'top-0 left-0', transform: '' },
                    { pos: 'top-0 right-0', transform: 'scale(-1, 1)' },
                    { pos: 'bottom-0 left-0', transform: 'scale(1, -1)' },
                    { pos: 'bottom-0 right-0', transform: 'scale(-1, -1)' }
                ].map((corner, i) => (
                    <svg key={i} className={`absolute ${corner.pos} w-16 h-16`} viewBox="0 0 50 50" style={{ transform: corner.transform }}>
                        <path d="M0 0 L50 0 L50 5 L5 5 L5 50 L0 50 Z" fill={victorian.gold} />
                        <path d="M10 0 Q10 10 0 10" fill="none" stroke={accent} strokeWidth="2" />
                        <circle cx="15" cy="15" r="4" fill={accent} />
                    </svg>
                ))}
            </div>

            {/* Inner decorative border */}
            <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: accent, borderStyle: 'double', zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-20 md:p-28 flex items-center gap-16">
                {/* Engraved-style framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-6 border-8" style={{
                        borderColor: victorian.gold,
                        background: `linear-gradient(135deg, ${victorian.gold} 0%, #e8d48a 30%, ${victorian.gold} 70%, #b8960f 100%)`
                    }}>
                        <div className="absolute inset-2 border" style={{ borderColor: accent }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${victorian.black}`,
                        filter: 'sepia(20%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative header */}
                    <div className="flex items-center gap-4 mb-8">
                        <svg className="w-12 h-6" viewBox="0 0 60 30">
                            <path d="M0 15 Q15 0 30 15 Q45 30 60 15" fill="none" stroke={victorian.gold} strokeWidth="2" />
                            <circle cx="30" cy="15" r="4" fill={accent} />
                        </svg>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: victorian.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Decorative footer flourish */}
                    <svg className="w-32 h-8 mt-8" viewBox="0 0 120 30">
                        <path d="M0 15 Q30 0 60 15 Q90 30 120 15" fill="none" stroke={victorian.gold} strokeWidth="1.5" />
                        <path d="M40 15 Q60 5 80 15" fill="none" stroke={accent} strokeWidth="2" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
