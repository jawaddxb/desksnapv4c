/**
 * Natural Archetype Configurations
 *
 * Factory configs for natural-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Bloom Archetype ============

export const bloomConfig: ArchetypeConfig = {
  id: 'bloom',
  name: 'Bloom',
  category: 'natural',
  container: { background: '#faf8f5' },
  title: { contrast: { text: '#3d3d3d' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bloom = {
      cream: '#faf8f5',
      blush: '#f5e6e8',
      green: '#6b8e6b',
      petal: '#e8b4b8'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: bloom.cream }}>
        {/* Botanical corner accents */}
        <svg className="absolute top-0 left-0 w-48 h-48 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
          <circle cx="80" cy="20" r="8" fill={bloom.petal} opacity="0.5" />
          <circle cx="50" cy="80" r="5" fill={bloom.petal} opacity="0.3" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-15 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M0,100 Q30,70 50,80 Q70,90 60,60 Q50,30 80,20 Q90,60 70,80" stroke={bloom.green} strokeWidth="2" fill="none" />
          <circle cx="80" cy="20" r="10" fill={bloom.petal} opacity="0.5" />
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Image with botanical frame */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] rounded-t-full overflow-hidden" style={{
              border: `3px solid ${bloom.green}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-8">
              <div className="w-8 h-2 rounded-full" style={{ background: bloom.petal }} />
              <div className="w-4 h-2 rounded-full" style={{ background: bloom.green }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Desert Archetype ============

export const desertConfig: ArchetypeConfig = {
  id: 'desert',
  name: 'Desert',
  category: 'natural',
  container: { background: '#e8dcc8' },
  title: { contrast: { text: '#3d2e1e' } },
  content: { contrast: { text: '#6b5c4a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const desert = {
      sand: '#e8dcc8',
      ochre: '#c98b4a',
      terracotta: '#b85c38',
      dusty: '#d4a574'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: desert.sand }}>
        {/* Sun-bleached gradient */}
        <div className="absolute inset-0 opacity-30" style={{
          background: `linear-gradient(180deg, transparent 0%, ${desert.ochre}30 100%)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        {/* Geometric southwest pattern */}
        <div className="absolute top-8 right-8 w-24 h-24" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="w-full h-full" style={{
            background: `repeating-linear-gradient(45deg, ${desert.terracotta} 0, ${desert.terracotta} 4px, transparent 4px, transparent 12px)`
          }} />
        </div>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-2 mb-8" style={{ background: desert.terracotta }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#3d2e1e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b5c4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Sun-washed image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square overflow-hidden" style={{
              clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)'
            }}>
              <ImageContainer slide={slide} theme={theme} className="sepia-[.2] saturate-90" />
            </div>
            {/* Ochre accent line */}
            <div className="absolute -bottom-2 left-0 w-2/3 h-1" style={{ background: desert.ochre }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Ember Archetype ============

export const emberConfig: ArchetypeConfig = {
  id: 'ember',
  name: 'Ember',
  category: 'natural',
  container: { background: '#1a1410' },
  title: { contrast: { text: '#fef3c7' } },
  content: { contrast: { text: '#d4a574' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ember = {
      charcoal: '#1a1410',
      amber: '#f59e0b',
      orange: '#ea580c',
      red: '#dc2626'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: ember.charcoal }}>
        {/* Warm glow effects */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 opacity-30" style={{
          background: `radial-gradient(ellipse at 50% 100%, ${ember.amber}60 0%, ${ember.orange}30 30%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Image with warm vignette */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square rounded-lg overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Warm vignette overlay */}
            <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
              background: `radial-gradient(circle, transparent 40%, ${ember.charcoal}90 100%)`
            }} />
            {/* Ember glow */}
            <div className="absolute -inset-4 -z-10 rounded-xl opacity-40 blur-xl" style={{
              background: `linear-gradient(180deg, ${ember.amber}40, ${ember.orange}20)`
            }} />
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-1 mb-8">
              <div className="w-2 h-6 rounded-full" style={{ background: ember.amber }} />
              <div className="w-2 h-4 rounded-full" style={{ background: ember.orange }} />
              <div className="w-2 h-2 rounded-full" style={{ background: ember.red }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#fef3c7' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#d4a574' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Forest Archetype ============

export const forestConfig: ArchetypeConfig = {
  id: 'forest',
  name: 'Forest',
  category: 'natural',
  container: { background: '#1a2e1a' },
  title: { contrast: { text: '#e8f0e8' } },
  content: { contrast: { text: '#a8c0a8' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const forest = {
      deep: '#1a2e1a',
      moss: '#4a6741',
      fern: '#6b8e23',
      bark: '#5d4e37'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: forest.deep }}>
        {/* Organic shapes representing foliage */}
        <div className="absolute top-0 right-0 w-2/3 h-1/2 opacity-20" style={{
          background: `radial-gradient(ellipse at 100% 0%, ${forest.moss} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 opacity-15" style={{
          background: `radial-gradient(ellipse at 0% 100%, ${forest.fern} 0%, transparent 60%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Image with natural edge */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] overflow-hidden rounded-tr-[100px] rounded-bl-[100px]">
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Moss accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-60" style={{ background: forest.moss }} />
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-8 rounded-full" style={{ background: forest.fern }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#e8f0e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8c0a8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Frost Archetype ============

export const frostConfig: ArchetypeConfig = {
  id: 'frost',
  name: 'Frost',
  category: 'natural',
  container: { background: '#f0f7ff' },
  title: { contrast: { text: '#2a4a6a' } },
  content: { contrast: { text: '#5a7a9a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const frost = {
      ice: '#f0f7ff',
      blue: '#a8d8ff',
      silver: '#c8d8e8',
      white: '#ffffff'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: frost.ice }}>
        {/* Crystalline patterns */}
        <svg className="absolute top-0 right-0 w-96 h-96 opacity-20" viewBox="0 0 200 200" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M100,10 L100,190 M10,100 L190,100 M30,30 L170,170 M170,30 L30,170" stroke={frost.blue} strokeWidth="1" />
          <path d="M100,40 L80,60 M100,40 L120,60 M100,160 L80,140 M100,160 L120,140" stroke={frost.blue} strokeWidth="1" />
        </svg>

        {/* Frost overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          background: `radial-gradient(circle at 70% 30%, ${frost.white} 0%, transparent 50%)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-px mb-8" style={{ background: frost.blue }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2a4a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a7a9a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Frosted image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden" style={{
              boxShadow: `0 0 60px ${frost.blue}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Frost border effect */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
              border: `2px solid ${frost.white}80`,
              boxShadow: `inset 0 0 30px ${frost.white}40`
            }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Grain Archetype ============

export const grainConfig: ArchetypeConfig = {
  id: 'grain',
  name: 'Grain',
  category: 'natural',
  container: { background: '#f5ebe0' },
  title: { contrast: (ctx) => ({ text: '#7f5539' }) },
  content: { contrast: (ctx) => ({ text: '#b08968' }) },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grain = {
      light: '#f5ebe0',
      honey: '#ddb892',
      brown: '#b08968',
      dark: '#7f5539'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: grain.light }}>
        {/* Wood grain pattern simulation */}
        <div className="absolute inset-0 opacity-10" style={{
          background: `repeating-linear-gradient(90deg, ${grain.honey} 0px, ${grain.honey} 2px, transparent 2px, transparent 20px)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-24 h-1 mb-8" style={{ background: grain.brown }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: grain.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: grain.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Image with natural frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-lg" style={{ background: grain.honey, opacity: 0.3 }} />
            <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{
              border: `4px solid ${grain.brown}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mineral Archetype ============

const MINERAL_COLOR_SETS = [
  { bg: '#1a1a2e', gem: '#8b5cf6', name: 'amethyst' },
  { bg: '#0a2e2a', gem: '#10b981', name: 'emerald' },
  { bg: '#1e2a4a', gem: '#3b82f6', name: 'sapphire' },
  { bg: '#2e1a1a', gem: '#ef4444', name: 'ruby' }
];

export const mineralConfig: ArchetypeConfig = {
  id: 'mineral',
  name: 'Mineral',
  category: 'natural',
  container: { background: (ctx) => ctx.rng.pick(MINERAL_COLOR_SETS).bg },
  title: { contrast: { text: '#f5f5f5' } },
  content: { contrast: { text: '#a8a8b8' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mineral = rng?.pick(MINERAL_COLOR_SETS) ?? MINERAL_COLOR_SETS[0];

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: mineral.bg }}>
        {/* Crystal facets */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ zIndex: LayoutLayer.DECORATION }}>
          <polygon points="100,10 150,60 130,120 70,120 50,60" fill="none" stroke={mineral.gem} strokeWidth="1" />
          <polygon points="300,50 350,100 330,160 270,160 250,100" fill="none" stroke={mineral.gem} strokeWidth="1" />
          <polygon points="500,80 550,130 530,190 470,190 450,130" fill="none" stroke={mineral.gem} strokeWidth="1" />
        </svg>

        {/* Gem glow */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20 blur-3xl" style={{
          background: mineral.gem,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Crystal frame image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] overflow-hidden" style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: `0 0 60px ${mineral.gem}40`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Sparkle accents */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse" style={{ background: mineral.gem, boxShadow: `0 0 10px ${mineral.gem}` }} />
            <div className="absolute bottom-8 left-8 w-1 h-1 rounded-full" style={{ background: mineral.gem, boxShadow: `0 0 6px ${mineral.gem}` }} />
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-8" style={{ background: mineral.gem }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#f5f5f5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a8b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mist Archetype ============

export const mistConfig: ArchetypeConfig = {
  id: 'mist',
  name: 'Mist',
  category: 'natural',
  container: { background: 'linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 100%)' },
  title: { contrast: { text: '#4a4a4a' } },
  content: { contrast: { text: '#7a7a7a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mist = {
      light: '#f5f5f5',
      gray: '#d4d4d4',
      dark: '#a8a8a8'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${mist.light} 0%, ${mist.gray} 100%)` }}>
        {/* Mist layers */}
        <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute w-full h-1/3 bottom-0 opacity-60" style={{
            background: `linear-gradient(180deg, transparent 0%, ${mist.light}80 100%)`,
            filter: 'blur(20px)'
          }} />
          <div className="absolute w-full h-1/2 top-1/4 opacity-40" style={{
            background: `linear-gradient(90deg, transparent 0%, ${mist.light}60 50%, transparent 100%)`,
            filter: 'blur(40px)'
          }} />
        </div>

        <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
          </div>

          {/* Fading image */}
          <div className="absolute bottom-8 left-8 w-48 h-32 rounded-lg overflow-hidden opacity-50" style={{ zIndex: LayoutLayer.MEDIA }}>
            <ImageContainer slide={slide} theme={theme} />
            <div className="absolute inset-0" style={{
              background: `linear-gradient(90deg, transparent 0%, ${mist.light} 100%)`
            }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Stone Archetype ============

export const stoneConfig: ArchetypeConfig = {
  id: 'stone',
  name: 'Stone',
  category: 'natural',
  container: { background: (ctx) => (ctx.rng.next() > 0.5) ? '#f5f5f0' : '#3d4852' },
  title: { contrast: (ctx) => ({ text: (ctx.rng.next() > 0.5) ? '#2d2d2d' : '#e8e8e8' }) },
  content: { contrast: (ctx) => ({ text: (ctx.rng.next() > 0.5) ? '#6b6b6b' : '#b8c0c8' }) },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isMarble = (rng?.next() ?? 0.5) > 0.5;
    const stone = isMarble ? {
      bg: '#f5f5f0',
      vein: '#c9c5b8',
      accent: '#d4af37'
    } : {
      bg: '#3d4852',
      vein: '#5a6a78',
      accent: '#c9a227'
    };
    const textColor = isMarble ? '#2d2d2d' : '#e8e8e8';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: stone.bg }}>
        {/* Marble/slate veining pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          <path d="M0,50 Q100,30 200,60 T400,50 T600,70" stroke={stone.vein} strokeWidth="2" fill="none" />
          <path d="M0,150 Q150,120 300,160 T600,140" stroke={stone.vein} strokeWidth="1" fill="none" />
          <path d="M0,250 Q80,220 200,260 T500,230" stroke={stone.vein} strokeWidth="1.5" fill="none" />
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-8" style={{ background: stone.accent }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: isMarble ? '#6b6b6b' : '#b8c0c8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Stone slab image frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2 opacity-30" style={{
              background: stone.vein,
              transform: 'rotate(1deg)'
            }} />
            <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Gold vein accent */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1" style={{ background: stone.accent }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Terra Archetype ============

export const terraConfig: ArchetypeConfig = {
  id: 'terra',
  name: 'Terra',
  category: 'natural',
  container: { background: '#faf7f2' },
  title: { contrast: { text: '#3d3d3d' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const terra = {
      cream: '#faf7f2',
      terracotta: '#c17767',
      sage: '#87a68a',
      brown: '#8b6f5c'
    };
    const accentColor = rng?.pick([terra.terracotta, terra.sage]) ?? terra.terracotta;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: terra.cream }}>
        {/* Organic curved shapes */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 opacity-20" style={{
          background: accentColor,
          borderRadius: '100% 0 0 0',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-8">
              <div className="w-3 h-3 rounded-full" style={{ background: terra.terracotta }} />
              <div className="w-3 h-3 rounded-full" style={{ background: terra.sage }} />
              <div className="w-3 h-3 rounded-full" style={{ background: terra.brown }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Image with organic frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[4/5] overflow-hidden" style={{
              borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
              border: `4px solid ${accentColor}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const naturalConfigs = {
  bloom: bloomConfig,
  desert: desertConfig,
  ember: emberConfig,
  forest: forestConfig,
  frost: frostConfig,
  grain: grainConfig,
  mineral: mineralConfig,
  mist: mistConfig,
  stone: stoneConfig,
  terra: terraConfig,
} as const;

export type NaturalArchetypeId = keyof typeof naturalConfigs;
