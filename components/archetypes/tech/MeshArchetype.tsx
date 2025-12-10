import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MeshArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const meshColors = [
        ['#ffecd2', '#fcb69f', '#ee9ca7', '#ffdde1'],
        ['#a8edea', '#fed6e3', '#c3cfe2', '#d299c2'],
        ['#f5f7fa', '#c3cfe2', '#e0c3fc', '#8ec5fc'],
        ['#fbc2eb', '#a6c1ee', '#f5f7fa', '#ffecd2']
    ];
    const colors = rng?.pick(meshColors) ?? meshColors[0];

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
            <div className="absolute inset-0" style={{
                background: `
                    radial-gradient(ellipse at 0% 0%, ${colors[0]} 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 0%, ${colors[1]} 0%, transparent 50%),
                    radial-gradient(ellipse at 100% 100%, ${colors[2]} 0%, transparent 50%),
                    radial-gradient(ellipse at 0% 100%, ${colors[3]} 0%, transparent 50%)
                `,
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full p-10 md:p-16 flex items-center gap-12">
                <div className="w-1/2 p-10 rounded-3xl" style={{
                    zIndex: LayoutLayer.CONTENT_HERO,
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
                }}>
                    <div className="w-16 h-2 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-8"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
                </div>

                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
