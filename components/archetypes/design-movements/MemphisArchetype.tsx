import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const MemphisArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#ffb3d9', '#b3ffb3', '#b3d9ff', '#ffffb3'];
    const bgColor = rng?.pick(bgColors) ?? '#ffb3d9';
    const shapeRotation = rng?.range(-20, 20) ?? 10;

    return (
        <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
            <div className="absolute top-10 right-10 w-32 h-32 border-4 border-black" style={{ transform: `rotate(${shapeRotation}deg)`, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full border-4 border-black" style={{ background: '#ff6b6b', zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute top-1/3 left-10 w-0 h-0" style={{
                borderLeft: '30px solid transparent',
                borderRight: '30px solid transparent',
                borderBottom: '52px solid #3b82f6',
                zIndex: LayoutLayer.DECORATION
            }} />

            <svg className="absolute bottom-10 right-1/4 w-48 h-12 opacity-80" viewBox="0 0 100 20" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" stroke="#000" strokeWidth="3" fill="none" />
            </svg>

            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                backgroundSize: '20px 20px',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-4 border-black" style={{ transform: 'rotate(3deg)' }} />
                    <div className="w-full aspect-[4/5] border-4 border-black overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-6"
                        style={{ fontWeight: 900, lineHeight: '1.0' }}
                    />
                    <div className="border-l-4 border-black pl-6">
                        <EditableContent slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
