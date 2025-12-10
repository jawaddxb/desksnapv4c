import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const AtelierArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    const ochre = '#cc9933';
    const burntSienna = '#a0522d';
    const rawUmber = '#734222';
    const canvas = '#f8f6f1';

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: canvas }}>
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23d4c5b9' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
            }} />

            <div className="absolute top-12 right-12 flex gap-2" style={{ zIndex: LayoutLayer.DECORATION }}>
                <div className="w-6 h-12 rounded-sm shadow-sm" style={{ background: ochre }} />
                <div className="w-6 h-10 rounded-sm shadow-sm" style={{ background: burntSienna }} />
                <div className="w-6 h-14 rounded-sm shadow-sm" style={{ background: rawUmber }} />
            </div>

            <div className="absolute top-0 left-1/4 w-3 h-24 opacity-20" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `linear-gradient(180deg, ${ochre} 0%, transparent 100%)`,
                borderRadius: '0 0 50% 50%'
            }} />

            <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4 border-amber-900/20 -rotate-1" />

                    <div className="w-full aspect-[3/4] relative shadow-xl bg-white p-2 rotate-1">
                        <div className="absolute -top-3 left-8 w-20 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(-3deg)' }} />
                        <div className="absolute -top-3 right-8 w-16 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(2deg)' }} />

                        <ImageContainer slide={slide} theme={theme} />
                    </div>

                    <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: canvas, border: `2px solid ${burntSienna}` }}>
                        <div className="w-3 h-3 rounded-full" style={{ background: ochre }} />
                    </div>
                </div>

                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-2 rounded-full" style={{ background: burntSienna }} />
                        <span className="text-xs uppercase tracking-[0.2em]" style={{ color: rawUmber, fontFamily: '"Caveat", cursive' }}>Studio Notes</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <div className="w-48 h-1 mb-8 opacity-60" style={{
                        background: ochre,
                        borderRadius: '50%',
                        transform: 'rotate(-1deg)'
                    }} />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ fontSize: '20px' }} />
                </div>
            </div>
        </div>
    );
};
