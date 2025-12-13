/**
 * Cultural Archetype Configurations
 *
 * Factory configs for cultural-style archetypes.
 * Each archetype is city/region-inspired with unique cultural aesthetics.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Brooklyn Archetype ============

export const brooklynConfig: ArchetypeConfig = {
  id: 'brooklyn',
  name: 'Brooklyn',
  category: 'cultural',
  container: { background: '#e5e5e5' },
  title: { contrast: { text: '#1f2937' } },
  content: { contrast: { text: '#4b5563' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const brooklyn = {
      concrete: '#9ca3af',
      brick: '#8b4513',
      steel: '#374151',
      copper: '#b87333'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#e5e5e5' }}>
        {/* Concrete texture simulation */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(${brooklyn.steel} 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        {/* Exposed brick accent */}
        <div className="absolute left-0 top-0 bottom-0 w-8 opacity-30" style={{
          background: `repeating-linear-gradient(0deg, ${brooklyn.brick} 0px, ${brooklyn.brick} 20px, #d4a574 20px, #d4a574 24px)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Industrial frame image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{
              background: brooklyn.steel,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 90%, 4px 90%, 4px 10%, 0 10%)'
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              border: `4px solid ${brooklyn.steel}`
            }}>
              <ImageContainer slide={slide} theme={theme} className="grayscale-[30%]" />
            </div>
            {/* Copper pipe accent */}
            <div className="absolute -right-4 top-1/4 w-2 h-1/2 rounded-full" style={{ background: brooklyn.copper }} />
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <span className="text-xs uppercase tracking-[0.3em] mb-6" style={{ color: brooklyn.steel }}>Est. Brooklyn</span>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 800, lineHeight: '1.0' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Havana Archetype ============

export const havanaConfig: ArchetypeConfig = {
  id: 'havana',
  name: 'Havana',
  category: 'cultural',
  container: { background: '#ffb6c1' },
  title: { contrast: { text: '#3d3d3d' } },
  content: { contrast: { text: '#5d5d5d' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const havana = {
      pink: '#ffb6c1',
      yellow: '#fffacd',
      turquoise: '#40e0d0',
      coral: '#ff7f50'
    };
    const bgColor = rng?.pick([havana.pink, havana.yellow, havana.turquoise]) ?? havana.pink;
    const fadedBg = bgColor + '80';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${bgColor} 0%, ${fadedBg} 100%)` }}>
        {/* Sun-faded texture */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)',
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Art deco typography hint */}
        <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="w-8 h-1" style={{ background: '#3d3d3d' }} />
          <div className="w-12 h-1" style={{ background: '#3d3d3d' }} />
          <div className="w-6 h-1" style={{ background: '#3d3d3d' }} />
        </div>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Vintage-treated image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[4/5] rounded-lg overflow-hidden" style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <ImageContainer slide={slide} theme={theme} className="sepia-[.3] contrast-90 saturate-90" />
            </div>
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-8">
              <div className="w-4 h-4 rounded-full" style={{ background: havana.coral }} />
              <div className="w-4 h-4 rounded-full" style={{ background: havana.turquoise }} />
              <div className="w-4 h-4 rounded-full" style={{ background: havana.yellow }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 700, lineHeight: '1.05' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Kyoto Archetype ============

export const kyotoConfig: ArchetypeConfig = {
  id: 'kyoto',
  name: 'Kyoto',
  category: 'cultural',
  container: { background: '#f5f2e8' },
  title: { contrast: { text: '#2a2a2a' } },
  content: { contrast: { text: '#9a9a8a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const kyoto = {
      cream: '#f5f2e8',
      sage: '#8a9a7a',
      stone: '#9a9a8a',
      ink: '#2a2a2a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: kyoto.cream }}>
        {/* Subtle wave pattern (Seigaiha) */}
        <svg className="absolute bottom-0 left-0 w-full h-1/4 opacity-5" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={50 + i * 50} cy="100" r="40" fill="none" stroke={kyoto.ink} strokeWidth="1" />
          ))}
        </svg>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-20">
          {/* Maximum Ma (empty space) - Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-1 h-16 mb-12" style={{ background: kyoto.sage }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: kyoto.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl mb-12"
              style={{ fontWeight: 300, lineHeight: '1.3' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: kyoto.stone }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
          </div>

          {/* Image with subtle natural frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[4/5] overflow-hidden" style={{
              borderLeft: `1px solid ${kyoto.sage}40`,
              paddingLeft: '20px'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Marrakech Archetype ============

export const marrakechConfig: ArchetypeConfig = {
  id: 'marrakech',
  name: 'Marrakech',
  category: 'cultural',
  container: { background: '#faf5e8' },
  title: { contrast: { text: '#1e3a5f' } },
  content: { contrast: { text: '#6b5c4a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const marrakech = {
      terracotta: '#c17767',
      blue: '#1e3a5f',
      gold: '#c9a227',
      cream: '#faf5e8'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: marrakech.cream }}>
        {/* Zellige tile pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          <defs>
            <pattern id="zellige" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect width="60" height="60" fill="none" stroke={marrakech.blue} strokeWidth="1" />
              <path d="M0,30 L30,0 L60,30 L30,60 Z" fill="none" stroke={marrakech.blue} strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="none" stroke={marrakech.terracotta} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zellige)" />
        </svg>

        {/* Gold brass accent */}
        <div className="absolute top-8 right-8 w-16 h-16 rounded-full opacity-40" style={{ background: marrakech.gold, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-8">
              <div className="w-2 h-8" style={{ background: marrakech.blue }} />
              <div className="w-2 h-8" style={{ background: marrakech.terracotta }} />
              <div className="w-2 h-8" style={{ background: marrakech.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: marrakech.blue }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Tile border image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-lg" style={{
              background: `linear-gradient(45deg, ${marrakech.blue}, ${marrakech.terracotta})`,
              opacity: 0.2
            }} />
            <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
              border: `6px solid ${marrakech.gold}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Milano Archetype ============

export const milanoConfig: ArchetypeConfig = {
  id: 'milano',
  name: 'Milano',
  category: 'cultural',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#4b5563' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const milano = {
      white: '#ffffff',
      black: '#000000',
      red: '#dc2626'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: milano.white }}>
        {/* Bold diagonal accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full" style={{
          background: milano.black,
          clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center">
          {/* Hero image - Full prominence */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] overflow-hidden">
              <ImageContainer slide={slide} theme={theme} className="contrast-110" />
            </div>
            {/* Red accent bar */}
            <div className="absolute -bottom-4 left-0 w-full h-2" style={{ background: milano.red }} />
          </div>

          {/* Content */}
          <div className="w-1/2 pl-16 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: milano.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl lg:text-8xl mb-8"
              style={{ fontWeight: 900, lineHeight: '0.9', textTransform: 'uppercase' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

            <div className="mt-8 flex gap-4">
              <div className="w-3 h-3" style={{ background: milano.red }} />
              <div className="w-3 h-3" style={{ background: milano.black }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Nordic Archetype ============

export const nordicConfig: ArchetypeConfig = {
  id: 'nordic',
  name: 'Nordic',
  category: 'cultural',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#1f2937' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const nordic = {
      white: '#ffffff',
      gray: '#f5f5f5',
      wood: '#d4b896',
      blue: '#e0e8f0'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: nordic.white }}>
        {/* Wood accent element */}
        <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: nordic.wood, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Content - Maximum negative space */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1f2937' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-12"
              style={{ fontWeight: 300, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />
          </div>

          {/* Image - Minimal treatment */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Paris Archetype ============

export const parisConfig: ArchetypeConfig = {
  id: 'paris',
  name: 'Paris',
  category: 'cultural',
  container: { background: '#faf8f5' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const paris = {
      cream: '#faf8f5',
      blush: '#f5e6e8',
      black: '#1a1a1a',
      gold: '#c9a227'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: paris.cream }}>
        {/* Art Nouveau curve */}
        <svg className="absolute bottom-0 left-0 w-full h-1/3 opacity-10" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M0,100 Q100,50 200,80 T400,60 L400,100 Z" fill={paris.black} />
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px" style={{ background: paris.gold }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: paris.gold }}>Paris</span>
              <div className="w-12 h-px" style={{ background: paris.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: paris.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.15', fontStyle: 'italic' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Elegant thin frame image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] overflow-hidden" style={{
              border: `1px solid ${paris.black}`,
              padding: '8px'
            }}>
              <div className="w-full h-full overflow-hidden">
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>
            {/* Gold accent corner */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: paris.gold }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Seoul Archetype ============

export const seoulConfig: ArchetypeConfig = {
  id: 'seoul',
  name: 'Seoul',
  category: 'cultural',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#2d2d2d' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seoul = {
      white: '#ffffff',
      blush: '#fff0f5',
      lavender: '#e6e6fa',
      mint: '#e0fff0'
    };
    const bgColor = rng?.pick([seoul.white, seoul.blush, seoul.lavender, seoul.mint]) ?? seoul.white;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 opacity-50" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 100%)',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
          {/* Image with soft glow */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square rounded-3xl overflow-hidden" style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Soft glow behind */}
            <div className="absolute -inset-8 -z-10 rounded-full opacity-40 blur-3xl" style={{ background: '#f0c0d0' }} />
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-8 h-8 rounded-full mb-8" style={{
              background: 'linear-gradient(135deg, #f0c0d0 0%, #c0e0f0 100%)'
            }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Tokyo Archetype ============

export const tokyoConfig: ArchetypeConfig = {
  id: 'tokyo',
  name: 'Tokyo',
  category: 'cultural',
  container: { background: '#0a0a12' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#a8a8b8' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tokyo = {
      dark: '#0a0a12',
      pink: '#ff1493',
      cyan: '#00ffff',
      yellow: '#ffff00'
    };
    const accentColor = rng?.pick([tokyo.pink, tokyo.cyan, tokyo.yellow]) ?? tokyo.pink;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${tokyo.dark} 0%, #1a1a2e 100%)` }}>
        {/* Neon glow backdrop */}
        <div className="absolute inset-0 opacity-30" style={{
          background: `radial-gradient(ellipse at 20% 80%, ${tokyo.pink}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${tokyo.cyan}40 0%, transparent 50%)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        {/* Vertical text element */}
        <div className="absolute right-8 top-8 bottom-8 w-8 flex flex-col items-center justify-center opacity-30" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="writing-vertical text-xs tracking-[0.5em] rotate-180" style={{ color: accentColor, writingMode: 'vertical-rl' }}>TOKYO DESIGN</div>
        </div>

        <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="mb-6">
              <span className="px-3 py-1 text-[10px] uppercase tracking-[0.3em] border" style={{
                color: accentColor,
                borderColor: accentColor,
                boxShadow: `0 0 10px ${accentColor}40`
              }}>Featured</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-8xl mb-6"
              style={{
                fontWeight: 900,
                lineHeight: '0.95',
                textShadow: `0 0 30px ${accentColor}60`
              }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
          </div>

          {/* Neon billboard image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2 rounded-lg" style={{
              boxShadow: `0 0 30px ${accentColor}40, 0 0 60px ${accentColor}20`,
              border: `2px solid ${accentColor}`
            }} />
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Vienna Archetype ============

export const viennaConfig: ArchetypeConfig = {
  id: 'vienna',
  name: 'Vienna',
  category: 'cultural',
  container: { background: '#faf8f0' },
  title: { contrast: { text: '#2a2a2a' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const vienna = {
      cream: '#faf8f0',
      gold: '#c9a227',
      burgundy: '#722f37',
      forest: '#2f4f4f'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: vienna.cream }}>
        {/* Klimt-inspired pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="w-full h-full" style={{
            background: `repeating-linear-gradient(45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, ${vienna.gold} 0, ${vienna.gold} 10px, transparent 10px, transparent 20px)`
          }} />
        </div>

        {/* Ornate border */}
        <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: vienna.gold, zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4" style={{ background: vienna.cream }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t-2 border-r-2" style={{ borderColor: vienna.gold }} />
        </div>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
          {/* Gilded frame image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4" style={{
              background: `linear-gradient(135deg, ${vienna.gold} 0%, #e8d48a 50%, ${vienna.gold} 100%)`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <div className="absolute inset-2" style={{ background: vienna.cream }} />
            </div>
            <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
              border: `4px solid ${vienna.gold}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center pl-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Decorative header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
              <div className="flex-1 h-px" style={{ background: vienna.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Decorative footer */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px" style={{ background: vienna.gold }} />
              <div className="w-4 h-4 rotate-45" style={{ background: vienna.gold }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const culturalConfigs = {
  brooklyn: brooklynConfig,
  havana: havanaConfig,
  kyoto: kyotoConfig,
  marrakech: marrakechConfig,
  milano: milanoConfig,
  nordic: nordicConfig,
  paris: parisConfig,
  seoul: seoulConfig,
  tokyo: tokyoConfig,
  vienna: viennaConfig,
} as const;

export type CulturalArchetypeId = keyof typeof culturalConfigs;
