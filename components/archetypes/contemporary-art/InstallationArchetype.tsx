import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const InstallationArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const installation = {
        white: '#ffffff',
        gray: '#e0e0e0',
        accent: rng?.pick(['#ff0000', '#0000ff', '#000000', '#ffff00']) ?? '#ff0000',
        text: '#1a1a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: installation.white }}>
            {/* Generous negative space - minimal intervention */}
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: installation.gray, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: installation.gray, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-20 md:p-32 flex items-center gap-20">
                {/* Minimal framed artwork */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Gallery label */}
                    <div className="absolute -bottom-12 left-0 text-xs" style={{ color: installation.text }}>
                        <span className="italic">Untitled</span>, 2024
                    </div>
                </div>

                {/* Conceptual presentation content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-8 mb-12" style={{ background: installation.accent }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: installation.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />
                </div>
            </div>
        </div>
    );
};
