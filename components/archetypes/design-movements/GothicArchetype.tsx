import React from 'react';
import { ArchetypeProps, EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { LayoutLayer } from '../../../lib/themes';

export const GothicArchetype: React.FC<ArchetypeProps> = ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gothic = {
        black: '#0a0a0a',
        burgundy: '#4a1c2a',
        gold: '#c9a227',
        purple: '#2a1a3a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${gothic.black} 0%, ${gothic.burgundy} 100%)` }}>
            {/* Vintage texture overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                zIndex: LayoutLayer.BACKGROUND
            }} />

            {/* Ornate corner flourishes */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Ornate framed image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border-2 opacity-40" style={{ borderColor: gothic.gold }} />
                    <div className="absolute -inset-2 border opacity-60" style={{ borderColor: gothic.gold }} />
                    <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gothic.gold}` }}>
                        <ImageContainer slide={slide} theme={theme} className="sepia-[.2] contrast-110" />
                    </div>
                </div>

                {/* Content */}
                <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: '#f5f0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.15', letterSpacing: '0.02em' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

                    {/* Decorative divider */}
                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                        <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
                        <div className="flex-1 h-px" style={{ background: gothic.gold }} />
                    </div>
                </div>
            </div>
        </div>
    );
};
