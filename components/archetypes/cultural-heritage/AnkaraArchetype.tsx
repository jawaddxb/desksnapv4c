import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AnkaraArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ankara = {
        orange: '#ff6b35',
        yellow: '#f7c531',
        blue: '#004e89',
        green: '#2e7d32',
        red: '#c62828',
        black: '#1a1a1a'
    };
    const primary = rng?.pick([ankara.orange, ankara.blue, ankara.green]) ?? ankara.orange;
    const secondary = rng?.pick([ankara.yellow, ankara.red]) ?? ankara.yellow;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ankara.black }}>
            {/* Bold geometric pattern background */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="ankara-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                        <circle cx="40" cy="40" r="35" fill="none" stroke={primary} strokeWidth="4" />
                        <circle cx="40" cy="40" r="25" fill="none" stroke={secondary} strokeWidth="3" />
                        <circle cx="40" cy="40" r="15" fill={primary} />
                        <rect x="0" y="38" width="80" height="4" fill={secondary} />
                        <rect x="38" y="0" width="4" height="80" fill={secondary} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ankara-pattern)" />
            </svg>

            {/* Vibrant accent bars */}
            <div className="absolute left-0 top-0 w-3 h-full" style={{ background: primary, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute right-0 top-0 w-3 h-full" style={{ background: secondary, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-10 md:p-16 flex flex-col justify-center">
                {/* Top color band */}
                <div className="flex gap-2 mb-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="h-2 flex-1" style={{ background: primary }} />
                    <div className="h-2 w-16" style={{ background: secondary }} />
                    <div className="h-2 flex-1" style={{ background: primary }} />
                </div>

                <div className="flex items-center gap-10">
                    {/* Circular image with patterned border */}
                    <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                        <div className="absolute -inset-3 rounded-full" style={{
                            background: `conic-gradient(from 0deg, ${primary}, ${secondary}, ${primary}, ${secondary}, ${primary})`,
                            opacity: 0.8
                        }} />
                        <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                            border: `6px solid ${ankara.black}`
                        }}>
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-5xl md:text-6xl lg:text-7xl mb-6 uppercase tracking-wide"
                            style={{ fontWeight: 900, lineHeight: '1.0', textShadow: `3px 3px 0 ${primary}` }}
                        />

                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                    </div>
                </div>

                {/* Bottom color band */}
                <div className="flex gap-2 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
                    <div className="h-2 w-24" style={{ background: secondary }} />
                    <div className="h-2 flex-1" style={{ background: primary }} />
                    <div className="h-2 w-24" style={{ background: secondary }} />
                </div>
            </div>
        </div>
    );
};
