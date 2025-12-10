import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const KeynoteArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center" style={{ background: '#000000' }}>
            <div className="absolute inset-0 pointer-events-none" style={{
                zIndex: LayoutLayer.BACKGROUND,
                background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)'
            }} />

            <div className="w-full max-w-5xl px-12 flex flex-col items-center text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl mb-8"
                    style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
                />

                <EditableContent slide={slide} theme={theme} contrast={{ text: '#a1a1aa' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl md:text-2xl max-w-2xl mb-16" style={{ lineHeight: '1.5' }} bullet={false} />
            </div>

            <div className="w-full max-w-3xl px-12 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                <div className="w-full aspect-[16/9] overflow-hidden rounded-xl" style={{
                    boxShadow: '0 0 80px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)'
                }}>
                    <ImageContainer slide={slide} theme={theme} />
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full opacity-40" style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }} />
        </div>
    );
};
