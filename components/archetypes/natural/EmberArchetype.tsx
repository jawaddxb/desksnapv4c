import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const EmberArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ember = {
        charcoal: '#1a1410',
        amber: '#f59e0b',
        orange: '#ea580c',
        red: '#dc2626'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ember.charcoal }}>
            {/* Warm glow effects */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 opacity-30" style={{
                background: `radial-gradient(ellipse at 50% 100%, ${ember.amber}60 0%, ${ember.orange}30 30%, transparent 70%)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Image with warm vignette */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Warm vignette overlay */}
                    <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                        background: `radial-gradient(circle, transparent 40%, ${ember.charcoal}90 100%)`
                    }} />
                    {/* Ember glow */}
                    <div className="absolute -inset-4 -z-10 rounded-xl opacity-40 blur-xl" style={{
                        background: `linear-gradient(180deg, ${ember.amber}40, ${ember.orange}20)`
                    }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-1 mb-8">
                        <div className="w-2 h-6 rounded-full" style={{ background: ember.amber }} />
                        <div className="w-2 h-4 rounded-full" style={{ background: ember.orange }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: ember.red }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#fef3c7' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 500, lineHeight: '1.1' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#d4a574' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};
