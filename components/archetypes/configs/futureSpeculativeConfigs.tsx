/**
 * Future Speculative Archetype Configurations
 *
 * Factory configs for future-speculative style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Biotech Archetype ============

export const biotechConfig: ArchetypeConfig = {
  id: 'biotech',
  name: 'Biotech',
  category: 'future-speculative',
  container: { background: '#0a1a1a' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#a0c0c0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const biotech = {
      teal: '#008b8b',
      chartreuse: '#7fff00',
      white: '#ffffff',
      gray: '#2a3a3a',
      dark: '#0a1a1a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: biotech.dark }}>
        {/* Cell structure patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="cells" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="40" fill="none" stroke={biotech.teal} strokeWidth="1" />
              <circle cx="50" cy="50" r="20" fill="none" stroke={biotech.chartreuse} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="5" fill={biotech.chartreuse} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cells)" />
        </svg>

        {/* DNA helix accents */}
        <svg className="absolute right-8 top-1/4 w-16 h-64 opacity-30 pointer-events-none" viewBox="0 0 50 200" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <ellipse cx="25" cy={i * 20 + 10} rx="20" ry="5" fill="none" stroke={biotech.teal} strokeWidth="1" />
            </g>
          ))}
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-1 mb-6" style={{ background: biotech.chartreuse }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: biotech.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#a0c0c0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Living technology dots */}
            <div className="flex gap-2 mt-8">
              {[biotech.teal, biotech.chartreuse, biotech.teal, biotech.chartreuse].map((color, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>

          {/* Organic tech frame */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: biotech.teal,
              borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%',
              opacity: 0.5
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              borderRadius: '55% 45% 48% 52% / 48% 55% 45% 52%',
              border: `2px solid ${biotech.chartreuse}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Quantum Archetype ============

export const quantumConfig: ArchetypeConfig = {
  id: 'quantum',
  name: 'Quantum',
  category: 'future-speculative',
  container: { background: '#2d1b4e' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#b0b0e0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const quantum = {
      purple: '#2d1b4e',
      blue: '#4169e1',
      white: '#ffffff',
      glow: '#00bfff'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: quantum.purple }}>
        {/* Particle trail animations */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={quantum.glow} stopOpacity="1" />
              <stop offset="100%" stopColor={quantum.glow} stopOpacity="0" />
            </radialGradient>
          </defs>
          {[...Array(15)].map((_, i) => {
            const x = rng?.range(10, 90) ?? (10 + (i * 5.3));
            const y = rng?.range(10, 90) ?? (10 + (i * 5.7));
            return (
              <g key={i}>
                <circle cx={`${x}%`} cy={`${y}%`} r="2" fill={quantum.white} />
                <circle cx={`${x}%`} cy={`${y}%`} r="8" fill="url(#particle-glow)" opacity="0.3" />
              </g>
            );
          })}
          {/* Wave function patterns */}
          <path d="M0 300 Q100 250, 200 300 T400 300 T600 300 T800 300" fill="none" stroke={quantum.blue} strokeWidth="1" opacity="0.4" />
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Scientific sublime image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-full opacity-30" style={{
              background: `radial-gradient(circle, ${quantum.glow} 0%, transparent 70%)`
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `2px solid ${quantum.blue}`,
              boxShadow: `0 0 30px ${quantum.glow}30`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full" style={{ background: quantum.glow }} />
              ))}
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: quantum.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#b0b0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Particle dots */}
            <div className="flex gap-3 mt-8">
              {[quantum.glow, quantum.blue, quantum.white, quantum.glow].map((color, i) => (
                <div key={i} className="w-2 h-2 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Solarpunk Archetype ============

export const solarpunkConfig: ArchetypeConfig = {
  id: 'solarpunk',
  name: 'Solarpunk',
  category: 'future-speculative',
  container: { background: 'linear-gradient(to bottom, #87ceeb 0%, #ffffff 100%)' },
  title: { contrast: { text: '#1a3a1a' } },
  content: { contrast: { text: '#3a5a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const solarpunk = {
      green: '#32cd32',
      gold: '#ffd700',
      sky: '#87ceeb',
      white: '#ffffff',
      dark: '#1a3a1a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: `linear-gradient(to bottom, ${solarpunk.sky} 0%, ${solarpunk.white} 100%)`
      }}>
        {/* Plant/tech fusion motifs */}
        <svg className="absolute bottom-0 left-0 w-full h-48 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(8)].map((_, i) => {
            const x = i * 100 + 50;
            return (
              <path key={i} d={`M${x} 200 Q${x + 20} 150, ${x} 100 Q${x - 20} 50, ${x + 10} 0`}
                    fill="none" stroke={solarpunk.green} strokeWidth="3" strokeLinecap="round" />
            );
          })}
        </svg>

        {/* Optimistic futurism sun */}
        <div className="absolute top-8 right-12 w-24 h-24 opacity-50 pointer-events-none" style={{
          background: `radial-gradient(circle, ${solarpunk.gold} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Sustainable hope accents */}
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: solarpunk.green, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Nature-framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3 rounded-full" style={{
              background: solarpunk.green,
              opacity: 0.3
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `4px solid ${solarpunk.gold}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-6" style={{ background: solarpunk.green }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: solarpunk.dark }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a5a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Hopeful dots */}
            <div className="flex gap-2 mt-8">
              {[solarpunk.green, solarpunk.gold, solarpunk.sky].map((color, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Void Archetype ============

export const voidConfig: ArchetypeConfig = {
  id: 'void',
  name: 'Void',
  category: 'future-speculative',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#6a6a6a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const voidColors = {
      black: '#000000',
      white: '#ffffff',
      gray: '#1a1a1a',
      glow: '#4a4a6a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: voidColors.black }}>
        {/* Subtle star field */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(30)].map((_, i) => {
            const x = rng?.range(0, 100) ?? (i * 3.3);
            const y = rng?.range(0, 100) ?? (i * 3.7);
            const size = rng?.range(1, 2) ?? (1 + (i % 2));
            return (
              <div key={i} className="absolute rounded-full"
                   style={{
                     left: `${x}%`,
                     top: `${y}%`,
                     width: `${size}px`,
                     height: `${size}px`,
                     background: voidColors.white
                   }} />
            );
          })}
        </div>

        {/* Event horizon gradient */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 pointer-events-none" style={{
          background: `radial-gradient(ellipse at bottom, ${voidColors.glow} 0%, transparent 70%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Single light source */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full" style={{
          background: voidColors.white,
          boxShadow: `0 0 20px ${voidColors.white}`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Cosmic emptiness image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-1 rounded-full opacity-30" style={{
              background: `radial-gradient(circle, ${voidColors.glow} 0%, transparent 70%)`
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `1px solid ${voidColors.glow}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-1 h-1 rounded-full mb-8" style={{ background: voidColors.white }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: voidColors.white }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-widest"
              style={{ fontWeight: 200, lineHeight: '1.3' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2.2' }} />

            {/* Minimal void dots */}
            <div className="flex gap-4 mt-8">
              <div className="w-1 h-1 rounded-full" style={{ background: voidColors.white }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
