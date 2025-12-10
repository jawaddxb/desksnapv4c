import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const PatinaArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const patina = {
        brass: '#b5a642',
        tarnish: '#6b5b3a',
        verdigris: '#4a7c6c',
        dark: '#2a2520',
        cream: '#f0ebe0'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(145deg, ${patina.brass} 0%, ${patina.tarnish} 50%, ${patina.brass} 100%)`
        }}>
            {/* Oxidation pattern overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `radial-gradient(ellipse at 20% 30%, ${patina.verdigris} 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, ${patina.verdigris} 0%, transparent 35%)`
            }} />

            {/* Vintage wear aesthetic edges */}
            <div className="absolute inset-4 border-2 pointer-events-none" style={{
                borderColor: patina.dark,
                opacity: 0.3,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Aged frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4" style={{
                        background: `linear-gradient(135deg, ${patina.brass} 0%, ${patina.tarnish} 40%, ${patina.verdigris} 70%, ${patina.brass} 100%)`,
                        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)'
                    }} />
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `4px solid ${patina.dark}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on aged panel */}
                <div className="flex-1 p-8 relative" style={{
                    background: patina.cream,
                    border: `2px solid ${patina.tarnish}`,
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    {/* Worn corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: patina.brass }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: patina.brass }} />

                    <div className="w-16 h-1 mb-6" style={{ background: patina.verdigris }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: patina.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 500, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: patina.tarnish }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                    <div className="flex gap-2 mt-6">
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.brass }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.verdigris }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: patina.tarnish }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
