import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TudorArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tudor = {
        red: '#8b0000',
        navy: '#000080',
        gold: '#d4af37',
        cream: '#f5f0dc',
        black: '#1a1a1a'
    };
    const primary = rng?.pick([tudor.red, tudor.navy]) ?? tudor.red;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: tudor.cream }}>
            {/* Heraldic pattern border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="tudor-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="20" height="20" fill={primary} opacity="0.1" />
                        <rect x="20" y="20" width="20" height="20" fill={primary} opacity="0.1" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="30" fill="url(#tudor-pattern)" />
                <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#tudor-pattern)" />
            </svg>

            {/* Ornate border frame */}
            <div className="absolute inset-6 border-4 pointer-events-none" style={{
                borderColor: tudor.gold,
                zIndex: LayoutLayer.DECORATION
            }}>
                {/* Shield corners */}
                {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
                    <svg key={i} className={`absolute ${pos} w-8 h-10`} viewBox="0 0 30 40">
                        <path d="M15 0 L30 10 L30 25 L15 40 L0 25 L0 10 Z" fill={primary} stroke={tudor.gold} strokeWidth="2" />
                    </svg>
                ))}
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Shield-framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: tudor.gold,
                        clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
                    }}>
                        <div className="absolute inset-2" style={{
                            background: primary,
                            clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
                        }} />
                    </div>
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        clipPath: 'polygon(50% 2%, 98% 16%, 98% 68%, 50% 98%, 2% 68%, 2% 16%)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Crown decoration */}
                    <svg className="w-16 h-12 mb-6" viewBox="0 0 60 40">
                        <path d="M5 35 L10 15 L20 25 L30 10 L40 25 L50 15 L55 35 Z" fill={tudor.gold} />
                        <circle cx="30" cy="10" r="4" fill={primary} />
                    </svg>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: tudor.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '1.0', letterSpacing: '0.05em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Heraldic footer */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-6 h-6" style={{ background: primary }} />
                        <div className="w-6 h-6" style={{ background: tudor.gold }} />
                        <div className="flex-1 h-1" style={{ background: tudor.gold }} />
                        <div className="w-6 h-6" style={{ background: tudor.gold }} />
                        <div className="w-6 h-6" style={{ background: primary }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
