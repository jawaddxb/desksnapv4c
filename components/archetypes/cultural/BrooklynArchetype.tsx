import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BrooklynArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const brooklyn = {
        concrete: '#9ca3af',
        brick: '#8b4513',
        steel: '#374151',
        copper: '#b87333'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#e5e5e5' }}>
            {/* Concrete texture simulation */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(${brooklyn.steel} 1px, transparent 1px)`,
                backgroundSize: '4px 4px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Exposed brick accent */}
            <div className="absolute left-0 top-0 bottom-0 w-8 opacity-30" style={{
                background: `repeating-linear-gradient(0deg, ${brooklyn.brick} 0px, ${brooklyn.brick} 20px, #d4a574 20px, #d4a574 24px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Industrial frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2" style={{
                        background: brooklyn.steel,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 90%, 4px 90%, 4px 10%, 0 10%)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `4px solid ${brooklyn.steel}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} className="grayscale-[30%]" />
                    </div>
                    {/* Copper pipe accent */}
                    <div className="absolute -right-4 top-1/4 w-2 h-1/2 rounded-full" style={{ background: brooklyn.copper }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <span className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: brooklyn.steel }}>Est. Brooklyn</span>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 800, lineHeight: '1.0' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};
