import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GlassArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gradientAngle = rng?.range(120, 200) ?? 150;

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)` }}>
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: '#ffffff', zIndex: LayoutLayer.BACKGROUND }} />
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#ffecd2', zIndex: LayoutLayer.BACKGROUND }} />

            <div className="w-full h-full p-8 md:p-16 flex items-center gap-8">
                <div className="w-1/2 h-4/5 relative rounded-3xl overflow-hidden" style={{ zIndex: LayoutLayer.MEDIA, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
                    <div className="absolute inset-3 rounded-2xl overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-1/2 h-4/5 p-8 md:p-12 rounded-3xl flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
                    <div className="w-12 h-1 mb-8 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.85)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>
            </div>
        </div>
    );
};
