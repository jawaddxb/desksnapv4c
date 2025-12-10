import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const TerrazzoArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    const chips = [
        { color: '#a3b18a', x: 15, y: 20, size: 18, rotate: 45 },
        { color: '#c17767', x: 80, y: 15, size: 24, rotate: -30 },
        { color: '#e8b4bc', x: 25, y: 75, size: 16, rotate: 60 },
        { color: '#d4c5b9', x: 70, y: 80, size: 20, rotate: -45 },
        { color: '#a3b18a', x: 90, y: 50, size: 14, rotate: 15 },
        { color: '#c17767', x: 5, y: 45, size: 22, rotate: -60 },
        { color: '#e8b4bc', x: 55, y: 5, size: 12, rotate: 30 },
        { color: '#d4c5b9', x: 45, y: 90, size: 16, rotate: -15 },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfbf7' }}>
            {chips.map((chip, i) => (
                <div
                    key={i}
                    className="absolute rounded-full opacity-70"
                    style={{
                        zIndex: LayoutLayer.DECORATION,
                        background: chip.color,
                        width: chip.size,
                        height: chip.size * 0.6,
                        left: `${chip.x}%`,
                        top: `${chip.y}%`,
                        transform: `rotate(${chip.rotate}deg)`,
                        borderRadius: '50%'
                    }}
                />
            ))}

            <div className="w-full h-full p-12 md:p-20 flex flex-col md:flex-row gap-12 items-center" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="w-full md:w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full h-full overflow-hidden shadow-lg" style={{
                        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                        border: '4px solid #fff'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-2 mb-6">
                        <div className="w-4 h-4 rounded-full" style={{ background: '#a3b18a' }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: '#c17767' }} />
                        <div className="w-4 h-4 rounded-full" style={{ background: '#e8b4bc' }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-7xl mb-8 tracking-tight"
                        style={{ fontWeight: 700, lineHeight: '1.05' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

                    <div className="mt-8 text-xs uppercase tracking-widest opacity-40" style={{ color: '#8a8a8a' }}>
                        Terrazzo • Milano
                    </div>
                </div>
            </div>
        </div>
    );
};
