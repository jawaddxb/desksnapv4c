/**
 * Cultural Heritage Archetype Configurations
 *
 * Factory configs for cultural heritage archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Aboriginal Archetype ============

export const aboriginalConfig: ArchetypeConfig = {
  id: 'aboriginal',
  name: 'Aboriginal',
  category: 'cultural-heritage',
  container: { background: '#8b4513' },
  title: { contrast: { text: '#f5f5dc' } },
  content: { contrast: { text: '#e8e8e8' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aboriginal = {
      ochre: '#cc7722',
      terracotta: '#8b4513',
      white: '#f5f5dc',
      black: '#1a1a1a',
      red: '#8b0000'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: aboriginal.terracotta }}>
        {/* Dot pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="dot-paint" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" fill={aboriginal.white} />
              <circle cx="15" cy="5" r="2" fill={aboriginal.ochre} />
              <circle cx="25" cy="5" r="2" fill={aboriginal.white} />
              <circle cx="10" cy="15" r="2" fill={aboriginal.ochre} />
              <circle cx="20" cy="15" r="2" fill={aboriginal.white} />
              <circle cx="5" cy="25" r="2" fill={aboriginal.white} />
              <circle cx="15" cy="25" r="2" fill={aboriginal.ochre} />
              <circle cx="25" cy="25" r="2" fill={aboriginal.white} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-paint)" />
        </svg>

        {/* Concentric circle motifs */}
        <svg className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[40, 32, 24, 16, 8].map((r, i) => (
            <circle key={i} cx="64" cy="64" r={r} fill="none"
                    stroke={i % 2 === 0 ? aboriginal.white : aboriginal.ochre} strokeWidth="3" />
          ))}
        </svg>

        <svg className="absolute bottom-12 right-12 w-24 h-24 opacity-25 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[30, 22, 14, 6].map((r, i) => (
            <circle key={i} cx="48" cy="48" r={r} fill="none"
                    stroke={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} strokeWidth="2" />
          ))}
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Circular image with dot border */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]">
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * 2 * Math.PI;
                const x = 50 + 48 * Math.cos(angle);
                const y = 50 + 48 * Math.sin(angle);
                return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4"
                              fill={i % 2 === 0 ? aboriginal.ochre : aboriginal.white} />;
              })}
            </svg>
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `6px solid ${aboriginal.black}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Dot line header */}
            <div className="flex gap-2 mb-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full"
                     style={{ background: i % 2 === 0 ? aboriginal.white : aboriginal.ochre }} />
              ))}
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: aboriginal.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 700, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#e8e8e8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Dot line footer */}
            <div className="flex gap-2 mt-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                     style={{ background: i % 3 === 0 ? aboriginal.red : aboriginal.ochre }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Ankara Archetype ============

export const ankaraConfig: ArchetypeConfig = {
  id: 'ankara',
  name: 'Ankara',
  category: 'cultural-heritage',
  container: { background: '#1a1a1a' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#e0e0e0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const ankara = {
      orange: '#ff6b35',
      yellow: '#f7c531',
      blue: '#004e89',
      green: '#2e7d32',
      red: '#c62828',
      black: '#1a1a1a'
    };
    const primary = rng?.pick([ankara.orange, ankara.blue, ankara.green]) ?? ankara.orange;
    const secondary = rng?.pick([ankara.yellow, ankara.red]) ?? ankara.yellow;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: ankara.black }}>
        {/* Bold geometric pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="ankara-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="40" cy="40" r="35" fill="none" stroke={primary} strokeWidth="4" />
              <circle cx="40" cy="40" r="25" fill="none" stroke={secondary} strokeWidth="3" />
              <circle cx="40" cy="40" r="15" fill={primary} />
              <rect x="0" y="38" width="80" height="4" fill={secondary} />
              <rect x="38" y="0" width="4" height="80" fill={secondary} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ankara-pattern)" />
        </svg>

        {/* Vibrant accent bars */}
        <div className="absolute left-0 top-0 w-3 h-full" style={{ background: primary, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute right-0 top-0 w-3 h-full" style={{ background: secondary, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-10 md:p-16 flex flex-col justify-center">
          {/* Top color band */}
          <div className="flex gap-2 mb-8" style={{ zIndex: LayoutLayer.DECORATION }}>
            <div className="h-2 flex-1" style={{ background: primary }} />
            <div className="h-2 w-16" style={{ background: secondary }} />
            <div className="h-2 flex-1" style={{ background: primary }} />
          </div>

          <div className="flex items-center gap-10">
            {/* Circular image with patterned border */}
            <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
              <div className="absolute -inset-3 rounded-full" style={{
                background: `conic-gradient(from 0deg, ${primary}, ${secondary}, ${primary}, ${secondary}, ${primary})`,
                opacity: 0.8
              }} />
              <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                border: `6px solid ${ankara.black}`
              }}>
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-5xl md:text-6xl lg:text-7xl mb-6 uppercase tracking-wide"
                style={{ fontWeight: 900, lineHeight: '1.0', textShadow: `3px 3px 0 ${primary}` }}
              />

              <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
            </div>
          </div>

          {/* Bottom color band */}
          <div className="flex gap-2 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
            <div className="h-2 w-24" style={{ background: secondary }} />
            <div className="h-2 flex-1" style={{ background: primary }} />
            <div className="h-2 w-24" style={{ background: secondary }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Aztec Archetype ============

export const aztecConfig: ArchetypeConfig = {
  id: 'aztec',
  name: 'Aztec',
  category: 'cultural-heritage',
  container: { background: '#a0896c' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#3a3a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const aztec = {
      turquoise: '#00ced1',
      gold: '#d4af37',
      terracotta: '#cd5c5c',
      black: '#1a1a1a',
      stone: '#a0896c'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: aztec.stone }}>
        {/* Step-fret pattern border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="step-fret" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L10 20 L10 10 L20 10 L20 0 L30 0 L30 10 L40 10 L40 20 L30 20 L30 30 L20 30 L20 40 L10 40 L10 30 L0 30 Z"
                    fill="none" stroke={aztec.black} strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
          <rect x="0" y="calc(100% - 50px)" width="100%" height="50" fill="url(#step-fret)" opacity="0.2" />
        </svg>

        {/* Bold geometric accents */}
        <div className="absolute top-0 left-0 w-full h-2" style={{ background: aztec.turquoise, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: aztec.gold, zIndex: LayoutLayer.DECORATION }} />

        {/* Sun stone inspired circle decoration */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke={aztec.gold} strokeWidth="4" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={aztec.turquoise} strokeWidth="3" />
            <circle cx="50" cy="50" r="25" fill="none" stroke={aztec.terracotta} strokeWidth="2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line key={i} x1="50" y1="5" x2="50" y2="20" stroke={aztec.gold} strokeWidth="3"
                    transform={`rotate(${angle} 50 50)`} />
            ))}
          </svg>
        </div>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Angular header decoration */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-6 h-6" style={{
                background: aztec.turquoise,
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
              }} />
              <div className="w-6 h-6" style={{
                background: aztec.gold,
                clipPath: 'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)'
              }} />
              <div className="flex-1 h-2" style={{
                background: `linear-gradient(to right, ${aztec.turquoise}, ${aztec.gold})`
              }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: aztec.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
              style={{ fontWeight: 900, lineHeight: '1.0' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Step pattern footer */}
            <div className="flex gap-1 mt-8">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                <div key={i} className="w-4" style={{
                  height: `${h * 8}px`,
                  background: i % 2 === 0 ? aztec.turquoise : aztec.gold
                }} />
              ))}
            </div>
          </div>

          {/* Stepped frame image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{
              background: aztec.black,
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Corner accents */}
            <div className="absolute -top-4 -left-4 w-8 h-8" style={{ background: aztec.turquoise }} />
            <div className="absolute -bottom-4 -right-4 w-8 h-8" style={{ background: aztec.gold }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Batik Archetype ============

export const batikConfig: ArchetypeConfig = {
  id: 'batik',
  name: 'Batik',
  category: 'cultural-heritage',
  container: { background: '#faf8f0' },
  title: { contrast: { text: '#1a237e' } },
  content: { contrast: { text: '#5d4037' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const batik = {
      indigo: '#1a237e',
      brown: '#5d4037',
      cream: '#faf8f0',
      tan: '#d7ccc8'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: batik.cream }}>
        {/* Crackle texture overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 48 50 52 T100 48 T150 55 T200 50' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 100 Q30 95 60 105 T120 98 T180 102 T200 100' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 150 Q20 148 40 152 T80 147 T120 153 T160 149 T200 151' stroke='%231a237e' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />

        {/* Organic flowing pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="batik-flow" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <path d="M60 10 Q90 30 60 60 Q30 90 60 110" fill="none" stroke={batik.indigo} strokeWidth="2" />
              <path d="M10 60 Q30 30 60 60 Q90 90 110 60" fill="none" stroke={batik.brown} strokeWidth="2" />
              <circle cx="60" cy="60" r="8" fill="none" stroke={batik.indigo} strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#batik-flow)" />
        </svg>

        {/* Wax drip edge effect - left side */}
        <div className="absolute left-0 top-0 w-4 h-full" style={{
          zIndex: LayoutLayer.DECORATION,
          background: batik.indigo,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 3%, 80% 5%, 100% 8%, 70% 12%, 100% 15%, 90% 20%, 100% 25%, 60% 30%, 100% 35%, 80% 40%, 100% 45%, 70% 50%, 100% 55%, 90% 60%, 100% 65%, 60% 70%, 100% 75%, 80% 80%, 100% 85%, 70% 90%, 100% 95%, 80% 100%, 0% 100%)'
        }} />

        <div className="w-full h-full p-12 md:p-20 pl-16 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: batik.indigo }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: batik.indigo }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: batik.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            <div className="flex gap-2 mt-8">
              <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
              <div className="w-2 h-2 rounded-full" style={{ background: batik.brown }} />
              <div className="w-2 h-2 rounded-full" style={{ background: batik.indigo }} />
            </div>
          </div>

          {/* Organic shape image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
              borderRadius: '60% 40% 50% 50% / 50% 50% 50% 50%',
              border: `4px solid ${batik.indigo}`,
              boxShadow: `8px 8px 0 ${batik.tan}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Celtic Archetype ============

export const celticConfig: ArchetypeConfig = {
  id: 'celtic',
  name: 'Celtic',
  category: 'cultural-heritage',
  container: { background: '#f5f0dc' },
  title: { contrast: { text: '#006400' } },
  content: { contrast: { text: '#654321' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const celtic = {
      green: '#006400',
      gold: '#d4af37',
      cream: '#f5f0dc',
      brown: '#654321'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: celtic.cream }}>
        {/* Interlaced knot border pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="celtic-knot" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 Q45 15 30 30 Q15 45 30 60" fill="none" stroke={celtic.green} strokeWidth="3" />
              <path d="M0 30 Q15 15 30 30 Q45 45 60 30" fill="none" stroke={celtic.green} strokeWidth="3" />
              <circle cx="30" cy="30" r="5" fill={celtic.gold} />
            </pattern>
          </defs>
          {/* Top and bottom borders */}
          <rect x="0" y="0" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
          <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#celtic-knot)" opacity="0.3" />
        </svg>

        {/* Manuscript page border */}
        <div className="absolute inset-6 border-4 pointer-events-none" style={{
          borderColor: celtic.green,
          borderStyle: 'double',
          zIndex: LayoutLayer.DECORATION
        }}>
          {/* Corner knots */}
          {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 rounded-full border-4`} style={{
              borderColor: celtic.gold,
              background: celtic.green
            }} />
          ))}
        </div>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Illuminated initial / Image */}
          <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 border-4" style={{
              borderColor: celtic.gold,
              background: `linear-gradient(135deg, ${celtic.gold}22, transparent)`
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              border: `3px solid ${celtic.green}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Decorative corner spirals */}
            <svg className="absolute -bottom-6 -right-6 w-12 h-12" viewBox="0 0 50 50" style={{ zIndex: LayoutLayer.OVERLAY }}>
              <path d="M25 25 Q35 25 35 35 Q35 45 25 45 Q15 45 15 35 Q15 25 25 25" fill="none" stroke={celtic.gold} strokeWidth="3" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Uncial-style decorative header */}
            <div className="flex items-center gap-4 mb-8">
              <svg className="w-8 h-8" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15" fill="none" stroke={celtic.green} strokeWidth="2" />
                <circle cx="20" cy="20" r="8" fill={celtic.gold} />
              </svg>
              <div className="flex-1 h-1" style={{ background: celtic.green }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: celtic.green }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: celtic.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Footer ornament */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-1" style={{ background: celtic.green }} />
              <div className="w-4 h-4 rotate-45" style={{ background: celtic.gold }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mughal Archetype ============

export const mughalConfig: ArchetypeConfig = {
  id: 'mughal',
  name: 'Mughal',
  category: 'cultural-heritage',
  container: { background: '#fffff0' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#3a3a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mughal = {
      emerald: '#046307',
      ruby: '#9b1b30',
      gold: '#d4af37',
      ivory: '#fffff0',
      sapphire: '#0f52ba'
    };
    const accentColor = rng?.pick([mughal.emerald, mughal.ruby, mughal.sapphire]) ?? mughal.emerald;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: mughal.ivory }}>
        {/* Jali (lattice) pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="jali" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke={mughal.gold} strokeWidth="1" />
              <circle cx="30" cy="30" r="8" fill="none" stroke={mughal.gold} strokeWidth="1" />
              <circle cx="30" cy="30" r="4" fill={mughal.gold} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#jali)" />
        </svg>

        {/* Gold filigree border */}
        <div className="absolute inset-6 border-2 pointer-events-none" style={{ borderColor: mughal.gold, zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: accentColor }} />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: accentColor }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: accentColor }} />
        </div>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Arch-framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
              borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
              border: `4px solid ${mughal.gold}`,
              boxShadow: `0 0 0 2px ${accentColor}, 0 8px 32px rgba(0,0,0,0.2)`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Paisley decoration */}
            <svg className="absolute -bottom-4 -right-4 w-16 h-16" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.OVERLAY }}>
              <path d="M50 10 C80 10, 90 50, 50 90 C10 50, 20 10, 50 10" fill={mughal.gold} opacity="0.8" />
              <circle cx="50" cy="50" r="15" fill={accentColor} />
            </svg>
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
              <div className="w-3 h-3 rotate-45" style={{ background: accentColor }} />
              <div className="w-3 h-3 rotate-45" style={{ background: mughal.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            <div className="flex items-center gap-3 mt-8">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${mughal.gold}, transparent)` }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Persian Archetype ============

export const persianConfig: ArchetypeConfig = {
  id: 'persian',
  name: 'Persian',
  category: 'cultural-heritage',
  container: { background: '#722f37' },
  title: { contrast: { text: '#722f37' } },
  content: { contrast: { text: '#1a2744' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const persian = {
      burgundy: '#722f37',
      gold: '#d4af37',
      turquoise: '#30d5c8',
      cream: '#f5f0e1',
      navy: '#1a2744'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: persian.burgundy }}>
        {/* Arabesque pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="arabesque" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 Q75 25 50 50 Q25 75 50 100 M50 0 Q25 25 50 50 Q75 75 50 100" fill="none" stroke={persian.gold} strokeWidth="1" />
              <circle cx="50" cy="50" r="10" fill="none" stroke={persian.gold} strokeWidth="1" />
              <path d="M0 50 Q25 25 50 50 Q25 75 0 50 M100 50 Q75 25 50 50 Q75 75 100 50" fill="none" stroke={persian.gold} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#arabesque)" />
        </svg>

        {/* Multi-layer border frame */}
        <div className="absolute inset-4 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute inset-8 border-2 pointer-events-none" style={{ borderColor: persian.turquoise, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: persian.gold, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center">
          {/* Medallion center composition */}
          <div className="relative w-full max-w-4xl flex items-center gap-12">
            {/* Central medallion image */}
            <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
              <div className="absolute -inset-6" style={{
                background: `radial-gradient(ellipse at center, ${persian.gold} 0%, transparent 70%)`,
                opacity: 0.3
              }} />
              <div className="relative w-full aspect-square overflow-hidden" style={{
                borderRadius: '50%',
                border: `6px solid ${persian.gold}`,
                boxShadow: `0 0 0 3px ${persian.turquoise}, 0 0 0 6px ${persian.gold}`
              }}>
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>

            {/* Content panel */}
            <div className="flex-1 p-8 relative" style={{
              background: persian.cream,
              borderRadius: '4px',
              border: `2px solid ${persian.gold}`,
              zIndex: LayoutLayer.CONTENT_HERO
            }}>
              <div className="absolute top-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />

              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: persian.burgundy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
                style={{ fontWeight: 600, lineHeight: '1.15' }}
              />

              <EditableContent slide={slide} theme={theme} contrast={{ text: persian.navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.9' }} />

              <div className="absolute bottom-2 left-2 right-2 h-px" style={{ background: persian.turquoise }} />
            </div>
          </div>

          {/* Bottom ornament */}
          <div className="flex items-center gap-4 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
            <div className="w-16 h-px" style={{ background: persian.gold }} />
            <div className="w-4 h-4 rotate-45" style={{ background: persian.turquoise }} />
            <div className="w-16 h-px" style={{ background: persian.gold }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Talavera Archetype ============

export const talaveraConfig: ArchetypeConfig = {
  id: 'talavera',
  name: 'Talavera',
  category: 'cultural-heritage',
  container: { background: '#faf6e9' },
  title: { contrast: { text: '#0047ab' } },
  content: { contrast: { text: '#4a4a4a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const talavera = {
      cobalt: '#0047ab',
      terracotta: '#e2725b',
      yellow: '#ffd700',
      cream: '#faf6e9',
      green: '#228b22'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: talavera.cream }}>
        {/* Tile pattern border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="talavera-tile" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <rect width="50" height="50" fill={talavera.cream} />
              <circle cx="25" cy="25" r="20" fill="none" stroke={talavera.cobalt} strokeWidth="2" />
              <path d="M25 5 L25 15 M25 35 L25 45 M5 25 L15 25 M35 25 L45 25" stroke={talavera.terracotta} strokeWidth="2" />
              <circle cx="25" cy="25" r="8" fill={talavera.cobalt} />
              <circle cx="25" cy="25" r="4" fill={talavera.yellow} />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
          <rect x="0" y="calc(100% - 40px)" width="100%" height="40" fill="url(#talavera-tile)" opacity="0.4" />
        </svg>

        {/* Hand-painted style border */}
        <div className="absolute inset-8 border-4 pointer-events-none" style={{
          borderColor: talavera.cobalt,
          borderStyle: 'double',
          zIndex: LayoutLayer.DECORATION
        }}>
          {/* Corner florals */}
          {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6 rounded-full`} style={{ background: talavera.terracotta, border: `2px solid ${talavera.cobalt}` }} />
          ))}
        </div>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Decorative header line */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
              <div className="h-1 flex-1" style={{ background: talavera.cobalt }} />
              <div className="w-4 h-4 rotate-45" style={{ background: talavera.terracotta }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: talavera.cobalt }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 700, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Decorative footer */}
            <div className="flex items-center gap-2 mt-8">
              <div className="w-3 h-3 rounded-full" style={{ background: talavera.yellow }} />
              <div className="w-3 h-3 rounded-full" style={{ background: talavera.cobalt }} />
              <div className="w-3 h-3 rounded-full" style={{ background: talavera.terracotta }} />
            </div>
          </div>

          {/* Scalloped frame image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-lg" style={{
              background: talavera.cobalt,
              clipPath: 'polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 5%)'
            }} />
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg" style={{
              border: `3px solid ${talavera.terracotta}`
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

export const culturalHeritageConfigs = {
  aboriginal: aboriginalConfig,
  ankara: ankaraConfig,
  aztec: aztecConfig,
  batik: batikConfig,
  celtic: celticConfig,
  mughal: mughalConfig,
  persian: persianConfig,
  talavera: talaveraConfig,
} as const;

export type CulturalHeritageArchetypeId = keyof typeof culturalHeritageConfigs;
