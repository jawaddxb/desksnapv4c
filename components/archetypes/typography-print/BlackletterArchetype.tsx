import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const BlackletterArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const blackletter = {
        black: '#0a0a0a',
        cream: '#f5f0dc',
        red: '#8b0000',
        gold: '#c9a227'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: blackletter.cream }}>
            {/* Illuminated margin hints */}
            <div className="absolute left-0 top-0 w-16 h-full opacity-10 pointer-events-none" style={{
                background: `repeating-linear-gradient(to bottom, ${blackletter.gold} 0px, ${blackletter.gold} 2px, transparent 2px, transparent 20px)`,
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Medieval border frame */}
            <div className="absolute inset-8 border-4 pointer-events-none" style={{
                borderColor: blackletter.black,
                zIndex: LayoutLayer.DECORATION
            }}>
                <div className="absolute inset-1 border" style={{ borderColor: blackletter.red }} />
            </div>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
                {/* Drop cap styled image */}
                <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-2 border-4" style={{
                        borderColor: blackletter.black,
                        background: blackletter.gold
                    }}>
                        <div className="absolute inset-1 border-2" style={{ borderColor: blackletter.red }} />
                    </div>
                    <div className="relative w-full aspect-square overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative initial mark */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-8 h-8 flex items-center justify-center" style={{
                            background: blackletter.red,
                            color: blackletter.gold
                        }}>
                            <span className="text-xl font-black">✦</span>
                        </div>
                        <div className="flex-1 h-px" style={{ background: blackletter.black }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: blackletter.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '1.0', letterSpacing: '0.05em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

                    {/* Medieval gravitas footer */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px" style={{ background: blackletter.black }} />
                        <div className="w-4 h-4" style={{ background: blackletter.red }} />
                        <div className="flex-1 h-px" style={{ background: blackletter.black }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
