import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { LayoutLayer } from '../../../lib/themes';

export const BeaconArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const schemes = [
        { bg: '#2563eb', text: '#ffffff' },
        { bg: '#000000', text: '#ffffff' },
        { bg: '#ffffff', text: '#000000' },
        { bg: '#7c3aed', text: '#ffffff' },
        { bg: '#dc2626', text: '#ffffff' }
    ];
    const scheme = rng?.pick(schemes) ?? schemes[0];

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center" style={{ background: scheme.bg }}>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-40" style={{ background: scheme.text, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full max-w-5xl px-12 md:px-20 text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                <EditableTitle
                    slide={slide} theme={theme} contrast={{ text: scheme.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                    className="text-5xl md:text-7xl lg:text-8xl"
                    style={{ fontWeight: 700, lineHeight: '1.1' }}
                />

                <div className="mt-12 opacity-60">
                    <EditableContent slide={slide} theme={theme} contrast={{ text: scheme.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl" style={{ lineHeight: '1.5' }} bullet={false} />
                </div>
            </div>
        </div>
    );
};
