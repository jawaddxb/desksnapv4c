/**
 * Contemporary Art Archetype Configurations
 *
 * Factory configs for contemporary-art style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Glitch Archetype ============

export const glitchConfig: ArchetypeConfig = {
  id: 'glitch',
  name: 'Glitch',
  category: 'contemporary-art',
  container: { background: '#0a0a0a' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#a0a0a0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const glitch = {
        black: '#0a0a0a',
        cyan: '#00ffff',
        magenta: '#ff00ff',
        white: '#ffffff',
        gray: '#333333'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: glitch.black }}>
            {/* Scan lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, ${glitch.white} 2px, ${glitch.white} 3px)`,
                backgroundSize: '100% 4px'
            }} />

            {/* RGB split effect hints */}
            <div className="absolute top-1/4 left-0 w-full h-2 opacity-30 pointer-events-none" style={{
                background: glitch.cyan,
                transform: 'translateX(5px)',
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute top-1/4 left-0 w-full h-2 opacity-30 pointer-events-none" style={{
                background: glitch.magenta,
                transform: 'translateX(-5px)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Data corruption patterns */}
            <div className="absolute bottom-1/3 right-0 w-32 h-4 opacity-50 pointer-events-none" style={{
                background: `linear-gradient(to right, ${glitch.cyan}, ${glitch.magenta})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Pixel displacement image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-1" style={{
                        background: glitch.cyan,
                        transform: 'translate(4px, -2px)',
                        opacity: 0.5
                    }} />
                    <div className="absolute -inset-1" style={{
                        background: glitch.magenta,
                        transform: 'translate(-4px, 2px)',
                        opacity: 0.5
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden">
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="flex gap-1 mb-6">
                        <div className="w-16 h-1" style={{ background: glitch.cyan }} />
                        <div className="w-8 h-1" style={{ background: glitch.magenta }} />
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: glitch.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
                        style={{ fontWeight: 900, lineHeight: '1.0', textShadow: `2px 0 ${glitch.cyan}, -2px 0 ${glitch.magenta}` }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#a0a0a0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-mono" style={{ lineHeight: '1.8' }} />

                    {/* Digital decay */}
                    <div className="flex gap-2 mt-8">
                        {[glitch.cyan, glitch.magenta, glitch.white, glitch.cyan].map((color, i) => (
                            <div key={i} className="w-2 h-6" style={{ background: color, opacity: 0.5 + i * 0.15 }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  },
};

// ============ Ink Archetype ============

export const inkConfig: ArchetypeConfig = {
  id: 'ink',
  name: 'Ink',
  category: 'contemporary-art',
  container: { background: '#faf8f5' },
  title: { contrast: { text: '#0a0a0a' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ink = {
        black: '#0a0a0a',
        paper: '#faf8f5',
        gray: '#6b6b6b',
        red: '#c41e3a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: ink.paper }}>
            {/* Brush stroke accent SVG */}
            <svg className="absolute top-1/4 left-8 w-32 h-64 opacity-15 pointer-events-none" viewBox="0 0 100 200" style={{ zIndex: LayoutLayer.DECORATION }}>
                <path d="M50 0 Q30 50, 50 100 Q70 150, 40 200" fill="none" stroke={ink.black} strokeWidth="8" strokeLinecap="round" />
            </svg>

            {/* Ink splatter decoration */}
            <svg className="absolute bottom-12 right-12 w-24 h-24 opacity-10 pointer-events-none" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
                <circle cx="50" cy="50" r="30" fill={ink.black} />
                <circle cx="75" cy="35" r="8" fill={ink.black} />
                <circle cx="30" cy="70" r="5" fill={ink.black} />
            </svg>

            <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
                {/* Content - Zen spontaneity */}
                <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    {/* Red seal/chop mark */}
                    <div className="w-10 h-10 mb-8 flex items-center justify-center" style={{
                        background: ink.red,
                        transform: 'rotate(-5deg)'
                    }}>
                        <span className="text-white text-xs font-bold">印</span>
                    </div>

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: ink.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-5xl md:text-6xl lg:text-7xl mb-8"
                        style={{ fontWeight: 400, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: ink.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />
                </div>

                {/* Rice paper framed image */}
                <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-4 border" style={{ borderColor: ink.gray, opacity: 0.3 }} />
                    <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
                        border: `1px solid ${ink.black}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>
            </div>
        </div>
    );
  },
};

// ============ Installation Archetype ============

export const installationConfig: ArchetypeConfig = {
  id: 'installation',
  name: 'Installation',
  category: 'contemporary-art',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#6a6a6a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const installation = {
        white: '#ffffff',
        gray: '#e0e0e0',
        accent: rng?.pick(['#ff0000', '#0000ff', '#000000', '#ffff00']) ?? '#ff0000',
        text: '#1a1a1a'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: installation.white }}>
            {/* Generous negative space - minimal intervention */}
            <div className="absolute top-0 left-0 w-full h-px" style={{ background: installation.gray, zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: installation.gray, zIndex: LayoutLayer.DECORATION }} />

            <div className="w-full h-full p-20 md:p-32 flex items-center gap-20">
                {/* Minimal framed artwork */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                    {/* Gallery label */}
                    <div className="absolute -bottom-12 left-0 text-xs" style={{ color: installation.text }}>
                        <span className="italic">Untitled</span>, 2024
                    </div>
                </div>

                {/* Conceptual presentation content */}
                <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
                    <div className="w-8 h-8 mb-12" style={{ background: installation.accent }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: installation.text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-12"
                        style={{ fontWeight: 300, lineHeight: '1.3' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#6a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />
                </div>
            </div>
        </div>
    );
  },
};

// ============ Mixed Media Archetype ============

export const mixedMediaConfig: ArchetypeConfig = {
  id: 'mixedmedia',
  name: 'Mixed Media',
  category: 'contemporary-art',
  container: { background: '#f5f0e6' },
  title: { contrast: { text: '#2a2a2a' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mixedmedia = {
        paper: '#f5f0e6',
        kraft: '#c9a86c',
        newsprint: '#e8e4d8',
        ink: '#2a2a2a',
        tape: '#f5e6b8'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{ background: mixedmedia.paper }}>
            {/* Paper texture variety - found materials */}
            <div className="absolute top-8 right-8 w-48 h-32 opacity-30 pointer-events-none" style={{
                background: mixedmedia.newsprint,
                transform: 'rotate(3deg)',
                zIndex: LayoutLayer.DECORATION
            }} />
            <div className="absolute bottom-12 left-12 w-32 h-24 opacity-40 pointer-events-none" style={{
                background: mixedmedia.kraft,
                transform: 'rotate(-5deg)',
                zIndex: LayoutLayer.DECORATION
            }} />

            {/* Overlapping transparency effect */}
            <div className="absolute top-1/4 left-1/4 w-40 h-40 opacity-10 pointer-events-none" style={{
                background: mixedmedia.ink,
                borderRadius: '50%',
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Layered collage image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    {/* Tape piece */}
                    <div className="absolute -top-4 left-1/4 w-24 h-6 opacity-70" style={{
                        background: mixedmedia.tape,
                        transform: 'rotate(5deg)',
                        zIndex: LayoutLayer.OVERLAY
                    }} />
                    <div className="absolute -inset-2" style={{
                        background: mixedmedia.kraft,
                        transform: 'rotate(-2deg)'
                    }} />
                    <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
                        border: `2px solid ${mixedmedia.ink}`,
                        transform: 'rotate(1deg)'
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on torn paper */}
                <div className="flex-1 p-8 relative" style={{
                    background: mixedmedia.newsprint,
                    transform: 'rotate(-1deg)',
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    <div className="w-12 h-1 mb-6" style={{ background: mixedmedia.ink }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: mixedmedia.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.2' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />
                </div>
            </div>
        </div>
    );
  },
};

// ============ Oxidize Archetype ============

export const oxidizeConfig: ArchetypeConfig = {
  id: 'oxidize',
  name: 'Oxidize',
  category: 'contemporary-art',
  container: { background: 'linear-gradient(135deg, #696969 0%, #8b4513 50%, #b7410e 100%)' },
  title: { contrast: { text: '#8b4513' } },
  content: { contrast: { text: '#696969' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const oxidize = {
        rust: '#b7410e',
        brown: '#8b4513',
        gray: '#696969',
        orange: '#cd853f',
        cream: '#f5f0e6'
    };

    return (
        <div className="w-full h-full relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${oxidize.gray} 0%, ${oxidize.brown} 50%, ${oxidize.rust} 100%)`
        }}>
            {/* Rust pattern texture overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                zIndex: LayoutLayer.DECORATION,
                background: `radial-gradient(ellipse at 30% 20%, ${oxidize.orange} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${oxidize.rust} 0%, transparent 40%)`
            }} />

            {/* Metal corrosion edges */}
            <div className="absolute top-0 left-0 w-full h-2 opacity-50 pointer-events-none" style={{
                background: `linear-gradient(to right, ${oxidize.rust}, ${oxidize.orange}, ${oxidize.rust})`,
                zIndex: LayoutLayer.DECORATION
            }} />

            <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
                {/* Corroded frame image */}
                <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
                    <div className="absolute -inset-3" style={{
                        background: `linear-gradient(135deg, ${oxidize.rust} 0%, ${oxidize.brown} 50%, ${oxidize.orange} 100%)`,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                    }} />
                    <div className="relative w-full aspect-square overflow-hidden" style={{
                        border: `3px solid ${oxidize.brown}`
                    }}>
                        <ImageContainer slide={slide} theme={theme} />
                    </div>
                </div>

                {/* Content on aged panel */}
                <div className="flex-1 p-8" style={{
                    background: oxidize.cream,
                    border: `2px solid ${oxidize.brown}`,
                    zIndex: LayoutLayer.CONTENT_HERO
                }}>
                    <div className="w-20 h-1 mb-6" style={{ background: oxidize.rust }} />

                    <EditableTitle
                        slide={slide} theme={theme} contrast={{ text: oxidize.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                        className="text-4xl md:text-5xl lg:text-6xl mb-6"
                        style={{ fontWeight: 600, lineHeight: '1.15' }}
                    />

                    <EditableContent slide={slide} theme={theme} contrast={{ text: oxidize.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

                    {/* Industrial wabi-sabi dots */}
                    <div className="flex gap-2 mt-6">
                        {[oxidize.rust, oxidize.orange, oxidize.brown].map((color, i) => (
                            <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  },
};
