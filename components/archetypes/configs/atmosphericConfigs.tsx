/**
 * Atmospheric Archetype Configurations
 *
 * Factory configs for atmospheric nature-inspired archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Dusk Archetype ============

export const duskConfig: ArchetypeConfig = {
  id: 'dusk',
  name: 'Dusk',
  category: 'atmospheric',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#ffffff' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const dusk = {
      amber: '#ff8c00',
      purple: '#4b0082',
      blue: '#191970',
      gold: '#ffd700',
      cream: '#fff8e7'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `linear-gradient(to bottom, ${dusk.amber} 0%, ${dusk.purple} 50%, ${dusk.blue} 100%)`
      }}>
        {/* Sun ray light beams */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor={dusk.gold} stopOpacity="0.8" />
              <stop offset="100%" stopColor={dusk.gold} stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50%" cy="30%" rx="30%" ry="20%" fill="url(#sun-glow)" />
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI;
            return (
              <line key={i} x1="50%" y1="30%" x2={`${50 + 50 * Math.cos(angle)}%`} y2={`${30 + 40 * Math.sin(angle)}%`}
                    stroke={dusk.gold} strokeWidth="2" opacity="0.3" />
            );
          })}
        </svg>

        {/* Silhouette horizon */}
        <div className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none" style={{
          background: dusk.blue,
          clipPath: 'polygon(0% 60%, 10% 50%, 20% 65%, 30% 45%, 40% 55%, 50% 40%, 60% 55%, 70% 45%, 80% 60%, 90% 50%, 100% 55%, 100% 100%, 0% 100%)',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Warm glowing image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-full opacity-50" style={{
              background: `radial-gradient(circle, ${dusk.gold} 0%, transparent 70%)`
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `4px solid ${dusk.gold}40`,
              boxShadow: `0 0 40px ${dusk.gold}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: dusk.gold }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: dusk.cream }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e0d0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Warm-to-cool transition dots */}
            <div className="flex gap-2 mt-8">
              {[dusk.gold, dusk.amber, dusk.purple, dusk.blue].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Monsoon Archetype ============

export const monsoonConfig: ArchetypeConfig = {
  id: 'monsoon',
  name: 'Monsoon',
  category: 'atmospheric',
  container: { background: '#2f4f4f' },
  title: { contrast: { text: '#f8f8f8' } },
  content: { contrast: { text: '#c0c0c0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const monsoon = {
      teal: '#006666',
      gray: '#708090',
      silver: '#c0c0c0',
      dark: '#2f4f4f',
      white: '#f8f8f8'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: monsoon.dark }}>
        {/* Rain streak overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="rain" x="0" y="0" width="20" height="100" patternUnits="userSpaceOnUse">
              <line x1="10" y1="0" x2="10" y2="30" stroke={monsoon.silver} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rain)" />
        </svg>

        {/* Mist/fog layer effects */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-30 pointer-events-none" style={{
          background: `linear-gradient(to top, ${monsoon.gray} 0%, transparent 100%)`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute top-1/4 left-0 w-full h-32 opacity-10 pointer-events-none" style={{
          background: monsoon.silver,
          filter: 'blur(30px)',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-6" style={{ background: monsoon.teal }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: monsoon.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: monsoon.silver }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Rain drop accents */}
            <div className="flex gap-3 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2 h-4 rounded-full" style={{
                  background: monsoon.silver,
                  opacity: 0.3 + i * 0.2
                }} />
              ))}
            </div>
          </div>

          {/* Misty framed image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute inset-0 opacity-20" style={{
              background: monsoon.gray,
              filter: 'blur(20px)'
            }} />
            <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
              border: `2px solid ${monsoon.silver}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Reef Archetype ============

export const reefConfig: ArchetypeConfig = {
  id: 'reef',
  name: 'Reef',
  category: 'atmospheric',
  container: { background: '#1a3a4a' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#b0e0e6' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const reef = {
      coral: '#ff6b6b',
      turquoise: '#20b2aa',
      purple: '#9370db',
      gold: '#ffd700',
      deep: '#1a3a4a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `linear-gradient(to bottom, ${reef.turquoise} 0%, ${reef.deep} 100%)`
      }}>
        {/* Organic coral shapes */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M50 400 Q80 350, 70 300 Q60 250, 90 200 Q100 150, 80 100" fill="none" stroke={reef.coral} strokeWidth="8" strokeLinecap="round" />
          <path d="M700 400 Q680 350, 720 300 Q740 250, 710 200" fill="none" stroke={reef.purple} strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="300" r="20" fill={reef.coral} opacity="0.3" />
          <circle cx="150" cy="280" r="15" fill={reef.coral} opacity="0.4" />
        </svg>

        {/* Light caustic patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="caustic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <ellipse cx="30" cy="30" rx="25" ry="15" fill="none" stroke={reef.gold} strokeWidth="1" />
              <ellipse cx="70" cy="70" rx="20" ry="12" fill="none" stroke={reef.gold} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#caustic)" />
        </svg>

        {/* Bioluminescent hints */}
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 rounded-full opacity-50" style={{
          background: reef.gold,
          boxShadow: `0 0 20px ${reef.gold}`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-6" style={{ background: reef.coral }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#b0e0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Coral color dots */}
            <div className="flex gap-2 mt-8">
              {[reef.coral, reef.turquoise, reef.purple, reef.gold].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>

          {/* Organic coral-shaped frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: reef.coral,
              borderRadius: '60% 40% 55% 45% / 55% 60% 40% 45%',
              opacity: 0.8
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
              border: `3px solid ${reef.gold}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Savanna Archetype ============

export const savannaConfig: ArchetypeConfig = {
  id: 'savanna',
  name: 'Savanna',
  category: 'atmospheric',
  container: { background: '#f5e6c8' },
  title: { contrast: { text: '#2d1b0e' } },
  content: { contrast: { text: '#5d4037' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const savanna = {
      gold: '#d4a03a',
      sienna: '#a0522d',
      brown: '#5d4037',
      cream: '#f5e6c8',
      dark: '#2d1b0e'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `linear-gradient(to bottom, ${savanna.cream} 0%, ${savanna.gold} 100%)`
      }}>
        {/* Tall grass silhouette overlay */}
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-30 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION
        }}>
          <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none">
            {[...Array(40)].map((_, i) => {
              const x = i * 20 + (rng?.range(-5, 5) ?? (i % 2 === 0 ? -3 : 3));
              const height = rng?.range(60, 95) ?? (60 + (i % 3) * 15);
              const curve = rng?.range(-10, 10) ?? ((i % 5) - 2) * 4;
              return (
                <path key={i} d={`M${x} 100 Q${x + curve} ${100 - height/2} ${x + curve/2} ${100 - height}`}
                      fill="none" stroke={savanna.brown} strokeWidth="2" />
              );
            })}
          </svg>
        </div>

        {/* Warm sun glow */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none" style={{
          background: `radial-gradient(circle, ${savanna.gold} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Horizon line */}
        <div className="absolute top-2/3 left-0 w-full h-px" style={{ background: savanna.sienna, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: savanna.sienna }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: savanna.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: savanna.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Earth tone dots */}
            <div className="flex gap-2 mt-8">
              {[savanna.gold, savanna.sienna, savanna.brown].map((color, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>

          {/* Sunset-framed image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3 rounded-lg" style={{
              background: `linear-gradient(135deg, ${savanna.gold} 0%, ${savanna.sienna} 100%)`
            }} />
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
              border: `3px solid ${savanna.cream}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Tundra Archetype ============

export const tundraConfig: ArchetypeConfig = {
  id: 'tundra',
  name: 'Tundra',
  category: 'atmospheric',
  container: { background: '#e0f7fa' },
  title: { contrast: { text: '#37474f' } },
  content: { contrast: { text: '#b0bec5' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tundra = {
      ice: '#e0f7fa',
      blue: '#b3e5fc',
      white: '#ffffff',
      gray: '#b0bec5',
      dark: '#37474f'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: tundra.ice }}>
        {/* Crystalline frost patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="frost" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L30 60 M0 30 L60 30 M10 10 L50 50 M50 10 L10 50" fill="none" stroke={tundra.blue} strokeWidth="1" />
              <circle cx="30" cy="30" r="3" fill={tundra.blue} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#frost)" />
        </svg>

        {/* Aurora subtle hints */}
        <div className="absolute top-0 left-0 w-full h-1/3 opacity-10 pointer-events-none" style={{
          background: `linear-gradient(to bottom, #7fffd4 0%, #00ced1 30%, transparent 100%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Cold minimal stark lines */}
        <div className="absolute top-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-8 left-8 right-8 h-px" style={{ background: tundra.gray, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Ice crystal framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{
              background: tundra.white,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              clipPath: 'polygon(50% 2%, 98% 26%, 98% 74%, 50% 98%, 2% 74%, 2% 26%)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-px mb-8" style={{ background: tundra.dark }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: tundra.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
              style={{ fontWeight: 300, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: tundra.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Crystal dots */}
            <div className="flex gap-3 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rotate-45" style={{ background: tundra.blue }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Volcano Archetype ============

export const volcanoConfig: ArchetypeConfig = {
  id: 'volcano',
  name: 'Volcano',
  category: 'atmospheric',
  container: { background: '#0a0a0a' },
  title: { contrast: { text: '#ff8c00' } },
  content: { contrast: { text: '#c0c0c0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const volcano = {
      black: '#0a0a0a',
      red: '#8b0000',
      orange: '#ff4500',
      amber: '#ff8c00',
      dark: '#1a1a1a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: volcano.black }}>
        {/* Lava crack pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <linearGradient id="lava-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={volcano.red} />
              <stop offset="50%" stopColor={volcano.orange} />
              <stop offset="100%" stopColor={volcano.amber} />
            </linearGradient>
          </defs>
          <path d="M0 200 Q50 180, 100 200 T200 180 T300 200 L300 250 L0 250 Z" fill="url(#lava-glow)" opacity="0.5" />
          <path d="M400 100 Q450 80, 500 100 T600 80 L600 150 L400 150 Z" fill="url(#lava-glow)" opacity="0.4" />
        </svg>

        {/* Ember glow effects */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-40 pointer-events-none" style={{
          background: `linear-gradient(to top, ${volcano.red} 0%, transparent 100%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Primal energy lines */}
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: volcano.red, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ background: volcano.orange, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Molten framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{
              background: `linear-gradient(135deg, ${volcano.red} 0%, ${volcano.orange} 50%, ${volcano.amber} 100%)`,
              boxShadow: `0 0 30px ${volcano.red}`
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              border: `3px solid ${volcano.black}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: volcano.orange }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: volcano.amber }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
              style={{ fontWeight: 900, lineHeight: '1.0' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#c0c0c0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Heat gradient dots */}
            <div className="flex gap-2 mt-8">
              {[volcano.amber, volcano.orange, volcano.red, volcano.red].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const atmosphericConfigs = {
  dusk: duskConfig,
  monsoon: monsoonConfig,
  reef: reefConfig,
  savanna: savannaConfig,
  tundra: tundraConfig,
  volcano: volcanoConfig,
} as const;

export type AtmosphericArchetypeId = keyof typeof atmosphericConfigs;
