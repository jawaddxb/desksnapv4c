import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const PostModernArchetype: React.FC<ArchetypeProps> = ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const useRadial = (rng?.next() ?? 0.5) > 0.5;
    const bgPattern = useRadial
        ? `radial-gradient(${contrast.accent} 2px, transparent 2px)`
        : `repeating-linear-gradient(45deg, ${contrast.accent}20 0, ${contrast.accent}20 2px, transparent 0, transparent 50%)`;

    const shapeColor = rng?.pick(['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']) ?? '#4ECDC4';

    return (
        <div className="w-full h-full relative overflow-hidden bg-white p-8" style={{ background: contrast.bg }}>
            <div className="absolute inset-0 opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: bgPattern, backgroundSize: '20px 20px' }} />

            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 transform rotate-12 border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />

            <div className="relative h-full flex flex-col md:flex-row items-center gap-12" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
                <div className="w-full md:w-1/2">
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] transform -rotate-1 relative" style={{ borderColor: contrast.text }}>
                        <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: '"Righteous", cursive', lineHeight: '1' }} />
                        <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold" />
                    </div>
                </div>
                <div className="w-full md:w-1/2 aspect-square relative">
                    <div className="absolute inset-0 bg-black translate-x-4 translate-y-4" style={{ backgroundColor: shapeColor }} />
                    <div className="relative w-full h-full border-4 border-black bg-white overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
};
