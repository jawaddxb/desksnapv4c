import React from 'react';
import { Triangle } from 'lucide-react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BauhausArchetype: React.FC<ArchetypeProps> = ({ slide, theme, onUpdateSlide, readOnly }) => {
    const c1 = '#E4002B'; // Red
    const c2 = '#0057B7'; // Blue
    const c3 = '#FFD700'; // Yellow

    return (
        <div className="w-full h-full relative bg-[#f0f0f0] p-8 md:p-12 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white" style={{ zIndex: LayoutLayer.BACKGROUND }} />

            <div className="absolute top-12 right-12 w-32 h-32 rounded-full mix-blend-multiply opacity-90" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c1 }} />
            <div className="absolute top-32 right-32 w-32 h-32 bg-transparent border-[20px] rounded-full opacity-80" style={{ zIndex: LayoutLayer.DECORATION, borderColor: c2 }} />
            <div className="absolute bottom-12 left-12 w-64 h-12" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c3 }} />

            <div className="flex gap-8 h-[60%] pointer-events-none" style={{ zIndex: LayoutLayer.MEDIA }}>
                 <div className="w-1/2 h-full relative overflow-hidden rounded-tr-[100px] pointer-events-auto">
                    <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
                 </div>
                 <div className="w-1/2 pt-12">
                    <div className="pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                        <EditableTitle
                            slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                            className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                            style={{ lineHeight: '0.9' }}
                        />
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t-4 border-black pt-6 mt-8" style={{ zIndex: LayoutLayer.CONTENT_BASE, borderColor: '#111' }}>
                <div className="col-span-2 pointer-events-auto">
                    <EditableContent slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" bullet={false} />
                </div>
                <div className="flex justify-end items-end">
                    <Triangle className="w-12 h-12 text-black fill-current" />
                </div>
            </div>
        </div>
    );
};
