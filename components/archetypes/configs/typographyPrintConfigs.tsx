/**
 * Typography-Print Archetype Configurations
 *
 * Factory configs for typography and print-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Blackletter Archetype ============

export const blackletterConfig: ArchetypeConfig = {
  id: 'blackletter',
  name: 'Blackletter',
  category: 'typography-print',
  container: { background: '#f5f0dc' },
  title: { contrast: { text: '#0a0a0a' } },
  content: { contrast: { text: '#3a3a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const blackletter = {
      black: '#0a0a0a',
      cream: '#f5f0dc',
      red: '#8b0000',
      gold: '#c9a227'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: blackletter.cream }}>
        {/* Illuminated margin hints */}
        <div className="absolute left-0 top-0 w-16 h-full opacity-10 pointer-events-none" style={{
          background: `repeating-linear-gradient(to bottom, ${blackletter.gold} 0px, ${blackletter.gold} 2px, transparent 2px, transparent 20px)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        {/* Medieval border frame */}
        <div className="absolute inset-8 border-4 pointer-events-none" style={{
          borderColor: blackletter.black,
          zIndex: LayoutLayer.DECORATION
        }}>
          <div className="absolute inset-1 border" style={{ borderColor: blackletter.red }} />
        </div>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
          {/* Drop cap styled image */}
          <div className="w-1/3 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2 border-4" style={{
              borderColor: blackletter.black,
              background: blackletter.gold
            }}>
              <div className="absolute inset-1 border-2" style={{ borderColor: blackletter.red }} />
            </div>
            <div className="relative w-full aspect-square overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Decorative initial mark */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 flex items-center justify-center" style={{
                background: blackletter.red,
                color: blackletter.gold
              }}>
                <span className="text-xl font-black">✦</span>
              </div>
              <div className="flex-1 h-px" style={{ background: blackletter.black }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: blackletter.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
              style={{ fontWeight: 900, lineHeight: '1.0', letterSpacing: '0.05em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Medieval gravitas footer */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px" style={{ background: blackletter.black }} />
              <div className="w-4 h-4" style={{ background: blackletter.red }} />
              <div className="flex-1 h-px" style={{ background: blackletter.black }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Letterpress Archetype ============

export const letterpressConfig: ArchetypeConfig = {
  id: 'letterpress',
  name: 'Letterpress',
  category: 'typography-print',
  container: { background: '#faf8f5' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const letterpress = {
      ink: '#1a1a1a',
      paper: '#faf8f5',
      deboss: '#e8e4dc',
      accent: '#c9a227'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: letterpress.paper }}>
        {/* Ink impression texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='5' y='5' width='2' height='2' fill='%23000'/%3E%3Crect x='45' y='25' width='1' height='1' fill='%23000'/%3E%3Crect x='85' y='65' width='2' height='1' fill='%23000'/%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px'
        }} />

        {/* Registration offset hints */}
        <div className="absolute top-4 left-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute top-4 right-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-4 left-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-4 right-4 w-4 h-4 border border-black opacity-20" style={{ zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-24 h-1 mb-8" style={{ background: letterpress.ink }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: letterpress.ink }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wide"
              style={{ fontWeight: 700, lineHeight: '1.1', textShadow: `1px 1px 0 ${letterpress.deboss}` }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Craft printing beauty marks */}
            <div className="flex gap-4 mt-8">
              <div className="w-8 h-1" style={{ background: letterpress.ink }} />
              <div className="w-4 h-1" style={{ background: letterpress.accent }} />
            </div>
          </div>

          {/* Debossed frame image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: letterpress.deboss,
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)'
            }} />
            <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
              border: `2px solid ${letterpress.ink}`,
              boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Newsprint Archetype ============

export const newsprintConfig: ArchetypeConfig = {
  id: 'newsprint',
  name: 'Newsprint',
  category: 'typography-print',
  container: { background: '#f5f5e8' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const newsprint = {
      black: '#1a1a1a',
      gray: '#6b6b6b',
      paper: '#f5f5e8',
      aged: '#e8e4d0'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: newsprint.paper }}>
        {/* Column grid overlay */}
        <div className="absolute inset-8 flex gap-4 opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-1 border-x" style={{ borderColor: newsprint.black }} />
          ))}
        </div>

        {/* Halftone dot pattern hint */}
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="halftone" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="1.5" fill={newsprint.black} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#halftone)" />
        </svg>

        {/* Masthead line */}
        <div className="absolute top-6 left-8 right-8 h-px" style={{ background: newsprint.black, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute top-8 left-8 right-8 h-2" style={{ background: newsprint.black, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-16 pt-20 flex items-center gap-8">
          {/* Headline hierarchy content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <span className="text-xs uppercase tracking-widest mb-2" style={{ color: newsprint.gray }}>BREAKING NEWS</span>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: newsprint.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-6 uppercase"
              style={{ fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.02em' }}
            />

            <div className="w-full h-px mb-4" style={{ background: newsprint.black }} />

            <EditableContent slide={slide} theme={theme} contrast={{ text: newsprint.gray }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base columns-2 gap-6" style={{ lineHeight: '1.6' }} />
          </div>

          {/* Newspaper photo */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="relative w-full aspect-[4/3] overflow-hidden" style={{
              border: `1px solid ${newsprint.black}`,
              filter: 'grayscale(100%) contrast(1.1)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="text-xs italic mt-2 text-center" style={{ color: newsprint.gray }}>
              Photo caption placeholder
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Stencil Archetype ============

export const stencilConfig: ArchetypeConfig = {
  id: 'stencil',
  name: 'Stencil',
  category: 'typography-print',
  container: { background: '#a0a0a0' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#4a4a4a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const stencil = {
      black: '#1a1a1a',
      orange: '#ff6600',
      yellow: '#ffd700',
      concrete: '#a0a0a0',
      white: '#f5f5f5'
    };
    const accent = rng?.pick([stencil.orange, stencil.yellow]) ?? stencil.orange;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: stencil.concrete }}>
        {/* Spray overspray texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `radial-gradient(circle at ${rng?.range(20, 80) ?? 50}% ${rng?.range(20, 80) ?? 50}%, ${stencil.black} 0%, transparent 50%)`
        }} />

        {/* Warning stripe accents */}
        <div className="absolute top-0 left-0 w-full h-4" style={{
          background: `repeating-linear-gradient(45deg, ${accent} 0px, ${accent} 20px, ${stencil.black} 20px, ${stencil.black} 40px)`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute bottom-0 left-0 w-full h-4" style={{
          background: `repeating-linear-gradient(-45deg, ${accent} 0px, ${accent} 20px, ${stencil.black} 20px, ${stencil.black} 40px)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4" style={{ background: accent }} />
              <span className="text-xs uppercase tracking-widest font-bold" style={{ color: stencil.black }}>NOTICE</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: stencil.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-8xl mb-8 uppercase"
              style={{ fontWeight: 900, lineHeight: '0.9', letterSpacing: '0.1em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg uppercase tracking-wide" style={{ lineHeight: '1.8' }} />

            {/* Industrial marks */}
            <div className="flex gap-2 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-4 h-4" style={{ background: i % 2 === 0 ? accent : stencil.black }} />
              ))}
            </div>
          </div>

          {/* Stencil-cut frame */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-2" style={{ background: stencil.black }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              border: `4px solid ${accent}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Woodtype Archetype ============

export const woodtypeConfig: ArchetypeConfig = {
  id: 'woodtype',
  name: 'Woodtype',
  category: 'typography-print',
  container: { background: '#f5e6c8' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#8b4513' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const woodtype = {
      wood: '#8b4513',
      black: '#1a1a1a',
      red: '#b22222',
      cream: '#f5e6c8',
      tan: '#d2b48c'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: woodtype.cream }}>
        {/* Wood grain texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 8, 50 10 T100 10' stroke='%238b4513' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 15 Q30 12, 60 15 T100 14' stroke='%238b4513' fill='none' stroke-width='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 20px'
        }} />

        {/* Circus/carnival style border */}
        <div className="absolute inset-6 border-8 pointer-events-none" style={{
          borderColor: woodtype.red,
          zIndex: LayoutLayer.DECORATION
        }}>
          <div className="absolute inset-2 border-4" style={{ borderColor: woodtype.black }} />
        </div>

        <div className="w-full h-full p-16 md:p-24 flex flex-col items-center justify-center text-center">
          {/* Worn letterform header */}
          <div className="flex gap-2 mb-6" style={{ zIndex: LayoutLayer.DECORATION }}>
            {['★', '★', '★'].map((s, i) => (
              <span key={i} className="text-2xl" style={{ color: woodtype.red }}>{s}</span>
            ))}
          </div>

          <div className="flex items-center gap-8 mb-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Image */}
            <div className="w-48 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
              <div className="absolute -inset-2 border-4" style={{ borderColor: woodtype.wood }} />
              <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
                border: `3px solid ${woodtype.black}`
              }}>
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>

            {/* Title */}
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: woodtype.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-6xl md:text-7xl lg:text-8xl uppercase"
              style={{ fontWeight: 900, lineHeight: '0.9', letterSpacing: '0.05em', textShadow: `3px 3px 0 ${woodtype.red}` }}
            />
          </div>

          <div className="w-full max-w-3xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableContent slide={slide} theme={theme} contrast={{ text: woodtype.wood }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl text-center" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Decorative footer */}
          <div className="flex items-center gap-4 mt-8" style={{ zIndex: LayoutLayer.DECORATION }}>
            <div className="w-16 h-1" style={{ background: woodtype.black }} />
            <span className="text-2xl" style={{ color: woodtype.red }}>★</span>
            <div className="w-16 h-1" style={{ background: woodtype.black }} />
          </div>
        </div>
      </div>
    );
  },
};
