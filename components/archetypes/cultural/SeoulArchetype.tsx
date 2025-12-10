import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const SeoulArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seoul = {
        white: '#ffffff',
        blush: '#fff0f5',
        lavender: '#e6e6fa',
        mint: '#e0fff0'
    };
    const bgColor = rng?.pick([seoul.white, seoul.blush, seoul.lavender, seoul.mint]) ?? seoul.white;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 opacity-50" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
                {/* Image with soft glow */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-3xl overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Soft glow behind */}
                    <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: '#f0c0d0' }} />
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-8 rounded-full mb-8" style={{
                        background: 'linear-gradient(135deg, #f0c0d0 0%, #c0e0f0 100%)'
                    }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 300, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
                </div>
            </div>
        </div>
    );
};
