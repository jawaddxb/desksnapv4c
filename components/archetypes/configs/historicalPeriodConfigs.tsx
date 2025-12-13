/**
 * Historical Period Archetype Configurations
 *
 * Factory configs for historical-period-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Victorian Archetype ============

export const victorianConfig: ArchetypeConfig = {
  id: 'victorian',
  name: 'Victorian',
  category: 'historical-period',
  container: { background: '#f5f5dc' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#3a3a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const victorian = {
      burgundy: '#722f37',
      forest: '#228b22',
      gold: '#d4af37',
      cream: '#f5f5dc',
      black: '#1a1a1a'
    };
    const accent = rng?.pick([victorian.burgundy, victorian.forest]) ?? victorian.burgundy;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: victorian.cream }}>
        {/* Ornate frame borders */}
        <div className="absolute inset-4 border-2 pointer-events-none" style={{ borderColor: victorian.gold, zIndex: LayoutLayer.DECORATION }}>
          {/* Ornate corner decorations */}
          {[
            { pos: 'top-0 left-0', transform: '' },
            { pos: 'top-0 right-0', transform: 'scale(-1, 1)' },
            { pos: 'bottom-0 left-0', transform: 'scale(1, -1)' },
            { pos: 'bottom-0 right-0', transform: 'scale(-1, -1)' }
          ].map((corner, i) => (
            <svg key={i} className={`absolute ${corner.pos} w-16 h-16`} viewBox="0 0 50 50" style={{ transform: corner.transform }}>
              <path d="M0 0 L50 0 L50 5 L5 5 L5 50 L0 50 Z" fill={victorian.gold} />
              <path d="M10 0 Q10 10 0 10" fill="none" stroke={accent} strokeWidth="2" />
              <circle cx="15" cy="15" r="4" fill={accent} />
            </svg>
          ))}
        </div>

        {/* Inner decorative border */}
        <div className="absolute inset-10 border pointer-events-none" style={{ borderColor: accent, borderStyle: 'double', zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-20 md:p-28 flex items-center gap-16">
          {/* Engraved-style framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-6 border-8" style={{
              borderColor: victorian.gold,
              background: `linear-gradient(135deg, ${victorian.gold} 0%, #e8d48a 30%, ${victorian.gold} 70%, #b8960f 100%)`
            }}>
              <div className="absolute inset-2 border" style={{ borderColor: accent }} />
            </div>
            <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
              border: `4px solid ${victorian.black}`,
              filter: 'sepia(20%)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Decorative header */}
            <div className="flex items-center gap-4 mb-8">
              <svg className="w-12 h-6" viewBox="0 0 60 30">
                <path d="M0 15 Q15 0 30 15 Q45 30 60 15" fill="none" stroke={victorian.gold} strokeWidth="2" />
                <circle cx="30" cy="15" r="4" fill={accent} />
              </svg>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: victorian.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Decorative footer flourish */}
            <svg className="w-32 h-8 mt-8" viewBox="0 0 120 30">
              <path d="M0 15 Q30 0 60 15 Q90 30 120 15" fill="none" stroke={victorian.gold} strokeWidth="1.5" />
              <path d="M40 15 Q60 5 80 15" fill="none" stroke={accent} strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Disco Archetype ============

export const discoConfig: ArchetypeConfig = {
  id: 'disco',
  name: 'Disco',
  category: 'historical-period',
  container: { background: '#0a0a0a' },
  title: { contrast: { text: '#ffd700' } },
  content: { contrast: { text: '#e0e0e0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const disco = {
      gold: '#ffd700',
      silver: '#c0c0c0',
      purple: '#8b008b',
      pink: '#ff1493',
      black: '#0a0a0a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: disco.black }}>
        {/* Mirror ball reflection pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(20)].map((_, i) => {
            const x = rng?.range(0, 100) ?? Math.random() * 100;
            const y = rng?.range(0, 100) ?? Math.random() * 100;
            const size = rng?.range(2, 8) ?? 2 + Math.random() * 6;
            const color = rng?.pick([disco.gold, disco.silver, disco.pink]) ?? disco.gold;
            const delay = rng?.range(0, 2) ?? Math.random() * 2;
            return (
              <div key={i} className="absolute rounded-full animate-pulse"
                   style={{
                     left: `${x}%`,
                     top: `${y}%`,
                     width: `${size}px`,
                     height: `${size}px`,
                     background: color,
                     animationDelay: `${delay}s`
                   }} />
            );
          })}
        </div>

        {/* Starburst light rays */}
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <radialGradient id="disco-ray" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={disco.gold} stopOpacity="1" />
              <stop offset="100%" stopColor={disco.gold} stopOpacity="0" />
            </radialGradient>
          </defs>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <line key={i} x1="50%" y1="50%" x2={`${50 + 50 * Math.cos(angle * Math.PI / 180)}%`} y2={`${50 + 50 * Math.sin(angle * Math.PI / 180)}%`}
                  stroke="url(#disco-ray)" strokeWidth="3" />
          ))}
        </svg>

        {/* Metallic gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-2" style={{
          background: `linear-gradient(to right, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
          zIndex: LayoutLayer.DECORATION
        }} />
        <div className="absolute bottom-0 left-0 w-full h-2" style={{
          background: `linear-gradient(to right, ${disco.purple}, ${disco.pink}, ${disco.silver}, ${disco.gold}, ${disco.purple})`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Disco ball image frame */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 rounded-full" style={{
              background: `conic-gradient(from 0deg, ${disco.gold}, ${disco.silver}, ${disco.pink}, ${disco.purple}, ${disco.gold})`,
              opacity: 0.8
            }} />
            <div className="relative w-full aspect-square rounded-full overflow-hidden" style={{
              border: `4px solid ${disco.silver}`,
              boxShadow: `0 0 30px ${disco.gold}40, 0 0 60px ${disco.pink}20`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: disco.gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-8xl mb-8 uppercase tracking-widest"
              style={{
                fontWeight: 900,
                lineHeight: '1.0',
                background: `linear-gradient(135deg, ${disco.gold}, ${disco.silver}, ${disco.pink})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#e0e0e0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Sparkle decoration */}
            <div className="flex gap-4 mt-8">
              {[disco.gold, disco.silver, disco.pink, disco.purple].map((color, i) => (
                <div key={i} className="w-3 h-3 rotate-45" style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Grunge Archetype ============

export const grungeConfig: ArchetypeConfig = {
  id: 'grunge',
  name: 'Grunge',
  category: 'historical-period',
  container: { background: '#e8e4d9' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#5d4037' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const grunge = {
      mustard: '#c9a227',
      brown: '#5d4037',
      gray: '#757575',
      black: '#1a1a1a',
      cream: '#e8e4d9'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: grunge.cream }}>
        {/* Distressed texture overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='5' height='3' fill='%23000' opacity='0.3'/%3E%3Crect x='50' y='30' width='8' height='2' fill='%23000' opacity='0.2'/%3E%3Crect x='70' y='60' width='4' height='4' fill='%23000' opacity='0.25'/%3E%3Crect x='20' y='80' width='6' height='2' fill='%23000' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />

        {/* Torn paper edge effect - top */}
        <div className="absolute top-0 left-0 w-full h-8" style={{
          zIndex: LayoutLayer.DECORATION,
          background: grunge.brown,
          clipPath: 'polygon(0% 0%, 3% 100%, 8% 50%, 12% 100%, 18% 60%, 22% 100%, 28% 40%, 33% 100%, 38% 70%, 45% 100%, 50% 50%, 55% 100%, 62% 60%, 68% 100%, 75% 40%, 80% 100%, 85% 70%, 92% 100%, 95% 50%, 100% 100%, 100% 0%)'
        }} />

        <div className="w-full h-full p-12 md:p-20 pt-16 flex items-center gap-12">
          {/* Photocopied-style image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-1 bg-black opacity-80" style={{ transform: 'rotate(-2deg)' }} />
            <div className="relative w-full aspect-[4/5] overflow-hidden" style={{
              border: `3px solid ${grunge.black}`,
              filter: 'contrast(1.2) grayscale(30%)',
              transform: 'rotate(1deg)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            {/* Tape pieces */}
            <div className="absolute -top-3 left-1/4 w-16 h-6 rotate-12" style={{ background: `${grunge.mustard}90` }} />
            <div className="absolute -bottom-2 right-1/4 w-12 h-5 -rotate-6" style={{ background: `${grunge.cream}90` }} />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-24 h-1 mb-6" style={{ background: grunge.mustard }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: grunge.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
              style={{ fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.02em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: grunge.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />

            {/* X marks */}
            <div className="flex gap-4 mt-8">
              {[...Array(3)].map((_, i) => (
                <span key={i} className="text-3xl font-black" style={{ color: grunge.mustard }}>×</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Atomic Archetype ============

export const atomicConfig: ArchetypeConfig = {
  id: 'atomic',
  name: 'Atomic',
  category: 'historical-period',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#4a4a4a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const atomic = {
      turquoise: '#40e0d0',
      coral: '#ff7f50',
      chartreuse: '#7fff00',
      white: '#ffffff',
      black: '#1a1a1a'
    };
    const accent = rng?.pick([atomic.turquoise, atomic.coral, atomic.chartreuse]) ?? atomic.turquoise;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: atomic.white }}>
        {/* Atomic starburst shapes */}
        <svg className="absolute top-8 right-8 w-32 h-32 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[0, 45, 90, 135].map((angle, i) => (
            <ellipse key={i} cx="64" cy="64" rx="60" ry="8" fill={accent}
                     transform={`rotate(${angle} 64 64)`} />
          ))}
          <circle cx="64" cy="64" r="12" fill={atomic.black} />
        </svg>

        {/* Boomerang curves */}
        <svg className="absolute bottom-12 left-8 w-48 h-24 opacity-15 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M0 60 Q60 0 120 30 Q180 60 240 20" fill="none" stroke={atomic.coral} strokeWidth="4" />
          <path d="M0 80 Q60 20 120 50 Q180 80 240 40" fill="none" stroke={atomic.turquoise} strokeWidth="3" />
        </svg>

        {/* Googie-style accent bar */}
        <div className="absolute top-0 left-0 w-full h-3" style={{
          background: `linear-gradient(to right, ${atomic.turquoise}, ${atomic.coral}, ${atomic.chartreuse})`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Atomic orbital header */}
            <svg className="w-16 h-16 mb-6" viewBox="0 0 64 64">
              {[0, 60, 120].map((angle, i) => (
                <ellipse key={i} cx="32" cy="32" rx="28" ry="10" fill="none" stroke={accent} strokeWidth="2"
                         transform={`rotate(${angle} 32 32)`} />
              ))}
              <circle cx="32" cy="32" r="6" fill={atomic.black} />
            </svg>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: atomic.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase tracking-wider"
              style={{ fontWeight: 800, lineHeight: '1.0' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Color dots */}
            <div className="flex gap-3 mt-8">
              <div className="w-4 h-4 rounded-full" style={{ background: atomic.turquoise }} />
              <div className="w-4 h-4 rounded-full" style={{ background: atomic.coral }} />
              <div className="w-4 h-4 rounded-full" style={{ background: atomic.chartreuse }} />
            </div>
          </div>

          {/* Kidney-shaped image frame */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3" style={{
              background: accent,
              borderRadius: '60% 40% 50% 50% / 50% 60% 40% 50%'
            }} />
            <div className="relative w-full aspect-square overflow-hidden" style={{
              borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
              border: `4px solid ${atomic.white}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Nouveau Archetype ============

export const nouveauConfig: ArchetypeConfig = {
  id: 'nouveau',
  name: 'Nouveau',
  category: 'historical-period',
  container: { background: '#faf8f0' },
  title: { contrast: { text: '#5d4037' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const nouveau = {
      sage: '#9dc183',
      mauve: '#e0b0ff',
      gold: '#d4af37',
      cream: '#faf8f0',
      brown: '#5d4037'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: nouveau.cream }}>
        {/* Flowing organic line borders */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <linearGradient id="nouveau-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={nouveau.sage} />
              <stop offset="100%" stopColor={nouveau.mauve} />
            </linearGradient>
          </defs>
          {/* Top whiplash curve */}
          <path d="M0 40 Q100 10, 200 50 T400 30 T600 60 T800 20 T1000 50 T1200 30"
                fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
          {/* Bottom whiplash curve */}
          <path d="M0 calc(100% - 40) Q100 calc(100% - 70), 200 calc(100% - 30) T400 calc(100% - 50) T600 calc(100% - 20)"
                fill="none" stroke="url(#nouveau-grad)" strokeWidth="3" opacity="0.4" />
          {/* Vertical side flourish */}
          <path d="M30 100 Q10 200, 30 300 Q50 400, 30 500" fill="none" stroke={nouveau.gold} strokeWidth="2" opacity="0.3" />
        </svg>

        {/* Decorative corner flourishes */}
        <svg className="absolute top-4 left-4 w-24 h-24 opacity-50" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.sage} strokeWidth="3" />
          <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
        </svg>
        <svg className="absolute bottom-4 right-4 w-24 h-24 opacity-50 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M10 90 Q10 50, 30 30 Q50 10, 90 10" fill="none" stroke={nouveau.mauve} strokeWidth="3" />
          <circle cx="90" cy="10" r="5" fill={nouveau.gold} />
        </svg>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-16">
          {/* Mucha-style framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)]" viewBox="0 0 120 150">
              {/* Organic frame */}
              <path d="M10 20 Q0 75, 10 130 Q60 145, 110 130 Q120 75, 110 20 Q60 5, 10 20"
                    fill="none" stroke={nouveau.gold} strokeWidth="3" />
              <path d="M15 25 Q5 75, 15 125 Q60 138, 105 125 Q115 75, 105 25 Q60 12, 15 25"
                    fill="none" stroke={nouveau.sage} strokeWidth="2" />
            </svg>
            <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
              borderRadius: '20% 20% 30% 30% / 5% 5% 10% 10%',
              border: `2px solid ${nouveau.gold}`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Flowing header decoration */}
            <svg className="w-32 h-8 mb-6" viewBox="0 0 120 30">
              <path d="M0 15 Q30 5, 60 15 Q90 25, 120 15" fill="none" stroke={nouveau.gold} strokeWidth="2" />
              <circle cx="60" cy="15" r="4" fill={nouveau.mauve} />
            </svg>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: nouveau.brown }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15', fontStyle: 'italic' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '2' }} />

            {/* Flowing footer */}
            <svg className="w-48 h-12 mt-8" viewBox="0 0 180 40">
              <path d="M0 20 Q45 5, 90 20 Q135 35, 180 20" fill="none" stroke={nouveau.sage} strokeWidth="2" />
              <path d="M30 20 Q90 10, 150 20" fill="none" stroke={nouveau.mauve} strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Tudor Archetype ============

export const tudorConfig: ArchetypeConfig = {
  id: 'tudor',
  name: 'Tudor',
  category: 'historical-period',
  container: { background: '#f5f0dc' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#3a3a3a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const tudor = {
      red: '#8b0000',
      navy: '#000080',
      gold: '#d4af37',
      cream: '#f5f0dc',
      black: '#1a1a1a'
    };
    const primary = rng?.pick([tudor.red, tudor.navy]) ?? tudor.red;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: tudor.cream }}>
        {/* Heraldic pattern border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="tudor-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill={primary} opacity="0.1" />
              <rect x="20" y="20" width="20" height="20" fill={primary} opacity="0.1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="30" fill="url(#tudor-pattern)" />
          <rect x="0" y="calc(100% - 30px)" width="100%" height="30" fill="url(#tudor-pattern)" />
        </svg>

        {/* Ornate border frame */}
        <div className="absolute inset-6 border-4 pointer-events-none" style={{
          borderColor: tudor.gold,
          zIndex: LayoutLayer.DECORATION
        }}>
          {/* Shield corners */}
          {['-top-4 -left-4', '-top-4 -right-4', '-bottom-4 -left-4', '-bottom-4 -right-4'].map((pos, i) => (
            <svg key={i} className={`absolute ${pos} w-8 h-10`} viewBox="0 0 30 40">
              <path d="M15 0 L30 10 L30 25 L15 40 L0 25 L0 10 Z" fill={primary} stroke={tudor.gold} strokeWidth="2" />
            </svg>
          ))}
        </div>

        <div className="w-full h-full p-16 md:p-24 flex items-center gap-12">
          {/* Shield-framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4" style={{
              background: tudor.gold,
              clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
            }}>
              <div className="absolute inset-2" style={{
                background: primary,
                clipPath: 'polygon(50% 0%, 100% 15%, 100% 70%, 50% 100%, 0% 70%, 0% 15%)'
              }} />
            </div>
            <div className="relative w-full aspect-[3/4] overflow-hidden" style={{
              clipPath: 'polygon(50% 2%, 98% 16%, 98% 68%, 50% 98%, 2% 68%, 2% 16%)'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Crown decoration */}
            <svg className="w-16 h-12 mb-6" viewBox="0 0 60 40">
              <path d="M5 35 L10 15 L20 25 L30 10 L40 25 L50 15 L55 35 Z" fill={tudor.gold} />
              <circle cx="30" cy="10" r="4" fill={primary} />
            </svg>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: tudor.black }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 uppercase"
              style={{ fontWeight: 900, lineHeight: '1.0', letterSpacing: '0.05em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#3a3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.9' }} />

            {/* Heraldic footer */}
            <div className="flex items-center gap-4 mt-8">
              <div className="w-6 h-6" style={{ background: primary }} />
              <div className="w-6 h-6" style={{ background: tudor.gold }} />
              <div className="flex-1 h-1" style={{ background: tudor.gold }} />
              <div className="w-6 h-6" style={{ background: tudor.gold }} />
              <div className="w-6 h-6" style={{ background: primary }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const historicalPeriodConfigs = {
  victorian: victorianConfig,
  disco: discoConfig,
  grunge: grungeConfig,
  atomic: atomicConfig,
  nouveau: nouveauConfig,
  tudor: tudorConfig,
} as const;

export type HistoricalPeriodArchetypeId = keyof typeof historicalPeriodConfigs;
