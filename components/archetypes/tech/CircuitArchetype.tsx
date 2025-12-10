import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CircuitArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const boardColor = rng?.pick(['#0a3d0a', '#0a2540', '#1a1a2e']) ?? '#0a3d0a';
    const traceColor = boardColor === '#0a3d0a' ? '#c9a227' : boardColor === '#0a2540' ? '#60a5fa' : '#a855f7';
    const icNumber = rng?.range(1000, 9999).toFixed(0) ?? '1234';

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: boardColor }}>
            <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <defs>
                    <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 10 50 L 40 50 L 50 40 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <path d="M 50 10 L 50 30 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <path d="M 60 40 L 90 40" fill="none" stroke={traceColor} strokeWidth="2" />
                        <circle cx="10" cy="50" r="4" fill={traceColor} />
                        <circle cx="90" cy="40" r="4" fill={traceColor} />
                        <circle cx="50" cy="10" r="4" fill={traceColor} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>

            <div className="w-full h-full flex items-center gap-10">
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square p-4 rounded-lg" style={{ background: '#1a1a1a', border: `2px solid ${traceColor}` }}>
                        <div className="absolute -left-3 top-1/4 flex flex-col gap-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
                        </div>
                        <div className="absolute -right-3 top-1/4 flex flex-col gap-2">
                            {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
                        </div>
                        <div className="w-full h-full rounded overflow-hidden">
                            <ImageContainer slide={slide} theme={theme} />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-4 text-[10px] uppercase tracking-wider" style={{ color: traceColor }}>
                        IC-{icNumber}
                    </div>
                </div>

                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full" style={{ background: traceColor, boxShadow: `0 0 10px ${traceColor}` }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: traceColor }}>Active Module</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 700, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};
