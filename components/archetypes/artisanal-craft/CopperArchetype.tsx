import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const CopperArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const copper = {
        base: '#b87333',
        verdigris: '#4a9c8c',
        patina: '#6b8e7d',
        dark: '#2d1810',
        light: '#d4a574'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${copper.base} 0%, ${copper.light} 50%, ${copper.base} 100%)`
        }}>
            {/* Metal texture grain overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23000' stroke-width='0.5' opacity='0.2'/%3E%3Cline x1='20' y1='0' x2='120' y2='100' stroke='%23000' stroke-width='0.3' opacity='0.15'/%3E%3Cline x1='40' y1='0' x2='140' y2='100' stroke='%23000' stroke-width='0.4' opacity='0.1'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px'
            }} />

            {/* Oxidation gradient effects */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 pointer-events-none" style={{
                background: `radial-gradient(ellipse at top right, ${copper.verdigris} 0%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 opacity-30 pointer-events-none" style={{
                background: `radial-gradient(ellipse at bottom left, ${copper.patina} 0%, transparent 60%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Content */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-20 h-1 mb-6" style={{ background: copper.verdigris }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: copper.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a2a20' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

                    {/* Hammered surface hints */}
                    <div className="flex gap-3 mt-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full" style={{
                                background: `radial-gradient(circle at 30% 30%, ${copper.light}, ${copper.base})`
                            }} />
                        ))}
                    </div>
                </div>

                {/* Circular hammered frame */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 rounded-full" style={{
                        background: `conic-gradient(from 0deg, ${copper.base}, ${copper.light}, ${copper.base}, ${copper.verdigris}, ${copper.base})`,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
                    }} />
                    <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                        border: `4px solid ${copper.dark}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
