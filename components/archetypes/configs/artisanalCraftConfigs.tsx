/**
 * Artisanal Craft Archetype Configurations
 *
 * Factory configs for artisanal craft-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig, ArchetypeContext } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Ceramic Archetype ============

export const ceramicConfig: ArchetypeConfig = {
  id: 'ceramic',
  name: 'Ceramic',
  category: 'artisanal-craft',
  container: { background: '#c9b8a5' },
  title: { contrast: { text: '#3a3530' } },
  content: { contrast: { text: '#5a5550' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ceramic = {
      glaze: '#7eb8da',
      clay: '#c9b8a5',
      speckle: '#8b7355',
      white: '#fafafa',
      dark: '#3a3530'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: ceramic.clay }}>
        {/* Speckled stoneware texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(50)].map((_, i) => {
            const x = rng?.range(0, 100) ?? Math.random() * 100;
            const y = rng?.range(0, 100) ?? Math.random() * 100;
            const size = rng?.range(1, 3) ?? 1 + Math.random() * 2;
            return (
              <div key={i} className="absolute rounded-full"
                   style={{
                     left: `${x}%`,
                     top: `${y}%`,
                     width: `${size}px`,
                     height: `${size}px`,
                     background: ceramic.speckle
                   }} />
            );
          })}
        </div>

        {/* Glaze drip effect - top */}
        <div className="absolute top-0 left-0 w-full h-24" style={{
          background: ceramic.glaze,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 95% 60%, 90% 55%, 85% 70%, 80% 50%, 75% 65%, 70% 55%, 65% 75%, 60% 50%, 55% 60%, 50% 80%, 45% 55%, 40% 70%, 35% 50%, 30% 65%, 25% 55%, 20% 75%, 15% 50%, 10% 60%, 5% 55%, 0% 70%)',
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 pt-28 flex items-center gap-12">
          {/* Rounded pottery-shaped image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: ceramic.glaze,
              borderRadius: '50% 50% 45% 45% / 40% 40% 60% 60%'
            }} />
            <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
              borderRadius: '48% 52% 42% 42% / 38% 38% 62% 62%',
              border: `3px solid ${ceramic.white}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Rim highlight */}
            <div className="absolute -top-1 left-1/4 w-1/2 h-2 rounded-full" style={{
              background: `linear-gradient(to right, transparent, ${ceramic.white}50, transparent)`
            }} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-2 rounded-full mb-6" style={{ background: ceramic.glaze }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: ceramic.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5550' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Kiln variation marks */}
            <div className="flex gap-3 mt-8">
              {[ceramic.glaze, ceramic.speckle, ceramic.glaze].map((color, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Copper Archetype ============

export const copperConfig: ArchetypeConfig = {
  id: 'copper',
  name: 'Copper',
  category: 'artisanal-craft',
  container: { background: '#b87333' },
  title: { contrast: { text: '#2d1810' } },
  content: { contrast: { text: '#3a2a20' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const copper = {
      base: '#b87333',
      verdigris: '#4a9c8c',
      patina: '#6b8e7d',
      dark: '#2d1810',
      light: '#d4a574'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `linear-gradient(135deg, ${copper.base} 0%, ${copper.light} 50%, ${copper.base} 100%)`
      }}>
        {/* Metal texture grain overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23000' stroke-width='0.5' opacity='0.2'/%3E%3Cline x1='20' y1='0' x2='120' y2='100' stroke='%23000' stroke-width='0.3' opacity='0.15'/%3E%3Cline x1='40' y1='0' x2='140' y2='100' stroke='%23000' stroke-width='0.4' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />

        {/* Oxidation gradient effects */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-40 pointer-events-none" style={{
          background: `radial-gradient(ellipse at top right, ${copper.verdigris} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 opacity-30 pointer-events-none" style={{
          background: `radial-gradient(ellipse at bottom left, ${copper.patina} 0%, transparent 60%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: copper.verdigris }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: copper.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a2a20' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Hammered surface hints */}
            <div className="flex gap-3 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{
                  background: `radial-gradient(circle at 30% 30%, ${copper.light}, ${copper.base})`
                }} />
              ))}
            </div>
          </div>

          {/* Circular hammered frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-full" style={{
              background: `conic-gradient(from 0deg, ${copper.base}, ${copper.light}, ${copper.base}, ${copper.verdigris}, ${copper.base})`,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `4px solid ${copper.dark}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Indigo Archetype ============

export const indigoConfig: ArchetypeConfig = {
  id: 'indigo',
  name: 'Indigo',
  category: 'artisanal-craft',
  container: { background: '#f5f5f0' },
  title: { contrast: { text: '#1a237e' } },
  content: { contrast: { text: '#3949ab' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const indigo = {
      deep: '#1a237e',
      medium: '#3949ab',
      light: '#7986cb',
      white: '#fafafa',
      cream: '#f5f5f0'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: indigo.cream }}>
        {/* Tie-dye pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="shibori" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="35" fill="none" stroke={indigo.deep} strokeWidth="2" strokeDasharray="5 3" />
              <circle cx="40" cy="40" r="25" fill="none" stroke={indigo.medium} strokeWidth="1.5" strokeDasharray="3 5" />
              <circle cx="40" cy="40" r="15" fill={indigo.light} opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shibori)" />
        </svg>

        {/* Organic dye bleed edges */}
        <div className="absolute top-0 left-0 w-full h-4" style={{
          background: `linear-gradient(to bottom, ${indigo.deep}, transparent)`,
          opacity: 0.3,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute bottom-0 left-0 w-full h-4" style={{
          background: `linear-gradient(to top, ${indigo.deep}, transparent)`,
          opacity: 0.3,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Fabric-like image container */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: indigo.deep,
              borderRadius: '45% 55% 50% 50% / 55% 45% 55% 45%'
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              borderRadius: '40% 60% 50% 50% / 50% 50% 50% 50%',
              border: `3px solid ${indigo.white}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-6" style={{ background: indigo.deep }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: indigo.deep }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: indigo.medium }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Dye gradient dots */}
            <div className="flex gap-2 mt-8">
              {[indigo.deep, indigo.medium, indigo.light, indigo.medium, indigo.deep].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Patina Archetype ============

export const patinaConfig: ArchetypeConfig = {
  id: 'patina',
  name: 'Patina',
  category: 'artisanal-craft',
  container: { background: '#b5a642' },
  title: { contrast: { text: '#2a2520' } },
  content: { contrast: { text: '#6b5b3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
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
  },
};

// ============ Raku Archetype ============

export const rakuConfig: ArchetypeConfig = {
  id: 'raku',
  name: 'Raku',
  category: 'artisanal-craft',
  container: { background: '#f5f0e1' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const raku = {
      copper: '#8b4513',
      black: '#1a1a1a',
      cream: '#f5f0e1',
      gold: '#c9a227',
      gray: '#6b6b6b'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: raku.cream }}>
        {/* Crackle glaze pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="crackle" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20 0 L25 30 L50 35 L45 60 L70 65 L60 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
              <path d="M0 50 L30 55 L35 80 L60 75 L65 100" fill="none" stroke={raku.black} strokeWidth="0.5" />
              <path d="M80 0 L75 25 L100 30" fill="none" stroke={raku.black} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crackle)" />
        </svg>

        {/* Kiln fire marks */}
        <div className="absolute bottom-0 left-1/4 w-1/2 h-32 opacity-10 pointer-events-none" style={{
          background: `radial-gradient(ellipse at bottom, ${raku.copper} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Organic form image container */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{
              background: raku.black,
              borderRadius: '40% 60% 55% 45% / 60% 40% 60% 40%'
            }} />
            <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
              borderRadius: '35% 65% 50% 50% / 55% 45% 55% 45%',
              border: `3px solid ${raku.gold}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-6">
              <div className="w-8 h-1" style={{ background: raku.copper }} />
              <div className="w-4 h-1" style={{ background: raku.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: raku.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: raku.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Glaze drip accent */}
            <svg className="w-8 h-16 mt-8" viewBox="0 0 30 60">
              <path d="M15 0 Q20 20 15 40 Q10 50 15 60" fill="none" stroke={raku.copper} strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Weave Archetype ============

export const weaveConfig: ArchetypeConfig = {
  id: 'weave',
  name: 'Weave',
  category: 'artisanal-craft',
  container: { background: '#f5f0e6' },
  title: { contrast: { text: '#4a3c2a' } },
  content: { contrast: { text: '#8b7355' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const weave = {
      natural: '#d4c4a8',
      brown: '#8b7355',
      cream: '#f5f0e6',
      dark: '#4a3c2a',
      accent: '#a0522d'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: weave.cream }}>
        {/* Woven grid texture overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="woven" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="10" height="10" fill={weave.natural} />
              <rect x="10" y="10" width="10" height="10" fill={weave.natural} />
              <rect x="0" y="10" width="10" height="10" fill={weave.brown} opacity="0.5" />
              <rect x="10" y="0" width="10" height="10" fill={weave.brown} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#woven)" />
        </svg>

        {/* Warp/weft line accents */}
        <div className="absolute left-0 top-0 w-1 h-full" style={{
          background: `repeating-linear-gradient(to bottom, ${weave.brown} 0px, ${weave.brown} 10px, transparent 10px, transparent 20px)`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute right-0 top-0 w-1 h-full" style={{
          background: `repeating-linear-gradient(to bottom, ${weave.accent} 0px, ${weave.accent} 10px, transparent 10px, transparent 20px)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Woven header decoration */}
            <div className="flex gap-1 mb-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-6" style={{
                  background: i % 2 === 0 ? weave.brown : weave.accent
                }} />
              ))}
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: weave.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: weave.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Fringe decoration */}
            <div className="flex gap-2 mt-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-8" style={{
                  background: weave.brown,
                  opacity: 0.5 + (i % 2) * 0.3
                }} />
              ))}
            </div>
          </div>

          {/* Fabric-framed image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 border-8" style={{
              borderColor: weave.natural,
              background: weave.brown
            }}>
              <div className="absolute inset-2 border-4" style={{ borderColor: weave.accent }} />
            </div>
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const artisanalCraftConfigs = {
  ceramic: ceramicConfig,
  copper: copperConfig,
  indigo: indigoConfig,
  patina: patinaConfig,
  raku: rakuConfig,
  weave: weaveConfig,
} as const;

export type ArtisanalCraftArchetypeId = keyof typeof artisanalCraftConfigs;
