/**
 * Wabi-Sabi Archetype Configurations
 *
 * Factory configs for wabi-sabi style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Atelier Archetype ============

export const atelierConfig: ArchetypeConfig = {
  id: 'atelier',
  name: 'Atelier',
  category: 'wabi-sabi',
  container: { background: '#f8f6f1' },
  title: { contrast: { text: '#2d2d2d' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const ochre = '#cc9933';
    const burntSienna = '#a0522d';
    const rawUmber = '#734222';
    const canvas = '#f8f6f1';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: canvas }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23d4c5b9' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />

        <div className="absolute top-12 right-12 flex gap-2" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="w-6 h-12 rounded-sm shadow-sm" style={{ background: ochre }} />
          <div className="w-6 h-10 rounded-sm shadow-sm" style={{ background: burntSienna }} />
          <div className="w-6 h-14 rounded-sm shadow-sm" style={{ background: rawUmber }} />
        </div>

        <div className="absolute top-0 left-1/4 w-3 h-24 opacity-20" style={{
          zIndex: LayoutLayer.DECORATION,
          background: `linear-gradient(180deg, ${ochre} 0%, transparent 100%)`,
          borderRadius: '0 0 50% 50%'
        }} />

        <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 border-4 border-amber-900/20 -rotate-1" />

            <div className="w-full aspect-[3/4] relative shadow-xl bg-white p-2 rotate-1">
              <div className="absolute -top-3 left-8 w-20 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(-3deg)' }} />
              <div className="absolute -top-3 right-8 w-16 h-6 bg-amber-100 opacity-80" style={{ transform: 'rotate(2deg)' }} />

              <ImageContainer slide={slide} theme={theme} />
            </div>

            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: canvas, border: `2px solid ${burntSienna}` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: ochre }} />
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-2 rounded-full" style={{ background: burntSienna }} />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: rawUmber, fontFamily: '"Caveat", cursive' }}>Studio Notes</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.2' }}
            />

            <div className="w-48 h-1 mb-8 opacity-60" style={{
              background: ochre,
              borderRadius: '50%',
              transform: 'rotate(-1deg)'
            }} />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ fontSize: '20px' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Coastal Archetype ============

export const coastalConfig: ArchetypeConfig = {
  id: 'coastal',
  name: 'Coastal',
  category: 'wabi-sabi',
  container: { background: '#faf8f5' },
  title: { contrast: { text: '#2d3a3a' } },
  content: { contrast: { text: '#5a6a6a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const seaGlass = '#87a5a5';
    const driftwood = '#b8a99a';
    const saltWhite = '#faf8f5';
    const isDark = (rng?.next() ?? 0.5) > 0.5;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{
        background: isDark
          ? 'linear-gradient(180deg, #1e3a4c 0%, #2d4a5e 100%)'
          : `linear-gradient(180deg, ${saltWhite} 0%, #f0ebe3 100%)`
      }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(139,119,101,0.3) 40px, rgba(139,119,101,0.3) 42px)`
        }} />

        <div className="absolute bottom-0 left-0 w-full h-24 opacity-20 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 10 Q 25 0, 50 10 T 100 10 V 20 H 0 Z" fill={seaGlass} />
          </svg>
        </div>

        <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-1" style={{ background: seaGlass }} />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: isDark ? driftwood : '#7a7a7a' }}>Coastal</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: isDark ? saltWhite : '#2d3a3a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8 tracking-wide"
              style={{ fontWeight: 300, lineHeight: '1.15', letterSpacing: '0.02em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: isDark ? '#a8b5b5' : '#5a6a6a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ letterSpacing: '0.01em' }} />
          </div>

          <div className="w-1/2 aspect-[4/5] relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full h-full overflow-hidden rounded-lg shadow-xl" style={{ border: `4px solid ${driftwood}40` }}>
              <ImageContainer slide={slide} theme={theme} />
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.15)' }} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full opacity-40" style={{ background: driftwood }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Herbarium Archetype ============

export const herbariumConfig: ArchetypeConfig = {
  id: 'herbarium',
  name: 'Herbarium',
  category: 'wabi-sabi',
  container: { background: '#f5f0e6' },
  title: { contrast: { text: '#3d3d3d' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const specimenNumber = rng?.range(1000, 9999).toFixed(0) ?? '1234';
    const dateStr = rng
      ? `${rng.range(1, 28).toFixed(0)}.${rng.range(1, 12).toFixed(0)}.${rng.range(1920, 2024).toFixed(0)}`
      : '12.6.1985';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#f5f0e6' }}>
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.DECORATION,
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full h-full p-12 md:p-16 flex gap-12">
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full h-full bg-white p-4 shadow-md border border-gray-200 relative">
              <div className="absolute -top-2 left-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(-2deg)' }} />
              <div className="absolute -top-2 right-8 w-16 h-6 bg-amber-100/80 opacity-70" style={{ transform: 'rotate(3deg)' }} />

              <div className="w-full h-full border border-gray-300 overflow-hidden">
                <ImageContainer slide={slide} theme={theme} className="sepia-[20%]" />
              </div>

              <div className="absolute bottom-8 left-8 right-8 bg-white/90 border border-gray-300 p-3">
                <div className="text-[10px] font-mono text-gray-500">Specimen No. {specimenNumber}</div>
                <div className="text-xs font-mono mt-1" style={{ fontFamily: '"Caveat", cursive' }}>{slide.title}</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[9px] uppercase tracking-widest font-mono" style={{ color: '#6b7c5c' }}>Herbarium Collection</span>
              <div className="flex-1 h-px" style={{ background: '#c9c4bc' }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl mb-6"
              style={{ fontWeight: 400, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm font-mono" />

            <div className="mt-8 flex items-center gap-4 text-xs font-mono" style={{ color: '#8a8a8a' }}>
              <span>Date: {dateStr}</span>
              <span>•</span>
              <span>Loc: Field Collection</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Hygge Archetype ============

export const hyggeConfig: ArchetypeConfig = {
  id: 'hygge',
  name: 'Hygge',
  category: 'wabi-sabi',
  container: { background: '#faf9f7' },
  title: { contrast: { text: '#4a4a4a' } },
  content: { contrast: { text: '#6b6b6b' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const warmAmber = '#e8c87a';
    const creamColor = '#f5f0e8';
    const isFlipped = (rng?.next() ?? 0.5) > 0.5;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#faf9f7' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='linen'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23linen)' opacity='0.3'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: warmAmber }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, background: '#ffecd2' }} />

        <div className={`w-full h-full p-12 md:p-20 flex ${isFlipped ? 'flex-row-reverse' : 'flex-row'} gap-16 items-center`}>
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-3 mb-6 opacity-50">
              <div className="w-3 h-3 rounded-full" style={{ background: warmAmber, boxShadow: `0 0 12px ${warmAmber}` }} />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#8b8178' }}>Hygge</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.15' }}
            />

            <div className="p-6 rounded-2xl" style={{ background: creamColor, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b6b6b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" />
            </div>
          </div>

          <div className="w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]" style={{ border: `8px solid ${creamColor}` }}>
              <ImageContainer slide={slide} theme={theme} className="saturate-90" />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full opacity-60" style={{
              background: `repeating-linear-gradient(90deg, ${warmAmber} 0px, ${warmAmber} 4px, transparent 4px, transparent 8px)`
            }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Kinfolk Archetype ============

export const kinfolkConfig: ArchetypeConfig = {
  id: 'kinfolk',
  name: 'Kinfolk',
  category: 'wabi-sabi',
  container: { background: '#fdfaf6' },
  title: { contrast: { text: '#3d3d3d' } },
  content: { contrast: { text: '#7a7a7a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isImageRight = (rng?.next() ?? 0.5) > 0.5;
    const dustyRose = '#c9b8b5';
    const issueNum = rng?.range(1, 50).toFixed(0) ?? '12';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfaf6' }}>
        <div className="w-full h-full p-16 md:p-24 lg:p-32">
          <div className={`w-full h-full flex ${isImageRight ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="w-2/5 flex flex-col justify-end pb-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
              <div className="w-full h-px mb-6" style={{ background: '#e0dcd8' }} />
              <span className="text-[9px] uppercase tracking-[0.4em] mb-4" style={{ color: '#a89e94' }}>
                Issue {issueNum}
              </span>

              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#3d3d3d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-4xl md:text-5xl lg:text-6xl mb-8"
                style={{ fontWeight: 400, lineHeight: '1.15' }}
              />

              <EditableContent slide={slide} theme={theme} contrast={{ text: '#7a7a7a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm max-w-xs" style={{ lineHeight: '1.7' }} bullet={false} />
            </div>

            <div className="w-1/5" />

            <div className="w-2/5 flex flex-col justify-start" style={{ zIndex: LayoutLayer.MEDIA }}>
              <div className="w-full aspect-[3/4] relative">
                <ImageContainer slide={slide} theme={theme} className="grayscale-[20%]" />
              </div>
              <div className="w-full h-px mt-4" style={{ background: dustyRose }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Kintsugi Archetype ============

export const kintsugiConfig: ArchetypeConfig = {
  id: 'kintsugi',
  name: 'Kintsugi',
  category: 'wabi-sabi',
  container: { background: '#1a1a2e' },
  title: { contrast: { text: '#e8e0d5' } },
  content: { contrast: { text: '#a8a0a0' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const goldColor = '#d4af37';
    const isInverted = (rng?.next() ?? 0.5) > 0.5;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#1a1a2e' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="kintsugiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b8860b" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#d4af37" />
              </linearGradient>
              <filter id="kintsugiGlow">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d={`M ${isInverted ? 100 : 0} 30 Q 50 50 ${isInverted ? 0 : 100} 70`} stroke="url(#kintsugiGold)" strokeWidth="0.4" fill="none" filter="url(#kintsugiGlow)" />
            <path d={`M ${isInverted ? 85 : 15} 0 Q 50 35 ${isInverted ? 20 : 80} 100`} stroke="url(#kintsugiGold)" strokeWidth="0.25" fill="none" filter="url(#kintsugiGlow)" opacity="0.7" />
          </svg>
        </div>

        <div className="absolute top-12 right-20 w-4 h-4 rotate-12 opacity-60" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #ffd700 0%, #b8860b 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute bottom-24 left-16 w-3 h-3 -rotate-6 opacity-40" style={{ zIndex: LayoutLayer.DECORATION, background: `linear-gradient(135deg, #d4af37 0%, #8b7500 100%)`, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />

        <div className={`w-full h-full p-12 md:p-20 flex ${isInverted ? 'flex-row-reverse' : 'flex-row'} gap-12 items-center`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="w-1/2 flex flex-col justify-center relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-16 h-px mb-8" style={{ background: `linear-gradient(90deg, ${goldColor}, transparent)` }} />
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#e8e0d5' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8 tracking-tight"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />
            <div className="border-l-2 pl-6" style={{ borderColor: goldColor }}>
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#a8a0a0' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-light" />
            </div>
            <div className="mt-8 text-xs uppercase tracking-[0.3em] opacity-40" style={{ color: goldColor }}>
              金継ぎ • Kintsugi
            </div>
          </div>

          <div className="w-1/2 relative aspect-[4/5]" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute inset-0 overflow-hidden" style={{
              borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
              border: `2px solid ${goldColor}`,
              boxShadow: `0 0 30px ${goldColor}40, inset 0 0 20px rgba(0,0,0,0.5)`
            }}>
              <ImageContainer slide={slide} theme={theme} className="saturate-75" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8" style={{ background: `linear-gradient(135deg, ${goldColor}, transparent)`, opacity: 0.6 }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mediterranean Archetype ============

export const mediterraneanConfig: ArchetypeConfig = {
  id: 'mediterranean',
  name: 'Mediterranean',
  category: 'wabi-sabi',
  container: { background: '#fefefe' },
  title: { contrast: { text: '#2a2a2a' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const azure = '#2563eb';
    const terracotta = '#c2714f';
    const olive = '#6b7c5c';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefefe' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='stucco'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stucco)' opacity='0.4'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute bottom-0 left-0 w-full h-4 opacity-40" style={{
          zIndex: LayoutLayer.DECORATION,
          background: `repeating-linear-gradient(90deg, ${azure} 0px, ${azure} 16px, #fff 16px, #fff 32px)`
        }} />

        <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[3/4] overflow-hidden shadow-xl" style={{
              borderRadius: '50% 50% 4px 4px / 30% 30% 0% 0%',
              border: `4px solid ${terracotta}20`
            }}>
              <ImageContainer slide={slide} theme={theme} className="saturate-90 brightness-105" style={{ filter: 'sepia(10%)' }} />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-[50%] opacity-10" style={{ background: '#000', filter: 'blur(8px)' }} />
          </div>

          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-1" style={{ background: azure }} />
              <span className="text-xs uppercase tracking-[0.25em]" style={{ color: olive }}>Mediterraneo</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2a2a2a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

            <div className="mt-10 flex gap-4">
              <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: azure }} />
              <div className="w-8 h-8 rounded-full" style={{ background: terracotta }} />
              <div className="w-8 h-8 rounded-full" style={{ background: olive }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Monolith Archetype ============

export const monolithConfig: ArchetypeConfig = {
  id: 'monolith',
  name: 'Monolith',
  category: 'wabi-sabi',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#0d0d0d' } },
  content: { contrast: { text: '#0d0d0d' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = (rng?.next() ?? 0.5) > 0.5;
    const bgColor = isDark ? '#0d0d0d' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#0d0d0d';
    const accentColor = rng?.pick(['#ef4444', '#3b82f6', '#000000']) ?? '#ef4444';

    return (
      <div className="w-full h-full relative overflow-hidden flex" style={{ background: bgColor }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="w-1/2 h-full relative" style={{ zIndex: LayoutLayer.MEDIA }}>
          <ImageContainer slide={slide} theme={theme} className={isDark ? 'brightness-90' : ''} />
          <div className="absolute bottom-0 left-0 w-full h-2" style={{ background: accentColor }} />
        </div>

        <div className="w-1/2 h-full flex flex-col justify-center px-16 md:px-24" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
          <div className="w-8 h-8 mb-12" style={{ background: accentColor }} />

          <EditableTitle
            slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
            className="text-6xl md:text-8xl lg:text-9xl uppercase mb-12 tracking-tighter"
            style={{ fontWeight: 400, lineHeight: '0.9' }}
          />

          <div className="w-full h-px mb-8" style={{ background: textColor, opacity: 0.2 }} />

          <EditableContent slide={slide} theme={theme} contrast={{ text: textColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm uppercase tracking-widest opacity-60" bullet={false} />
        </div>
      </div>
    );
  },
};

// ============ Sumie Archetype ============

export const sumieConfig: ArchetypeConfig = {
  id: 'sumie',
  name: 'Sumie',
  category: 'wabi-sabi',
  container: { background: '#fefdfb' },
  title: { contrast: { text: '#1a1a1a' } },
  content: { contrast: { text: '#4a4a4a' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isLeftAligned = (rng?.next() ?? 0.5) > 0.5;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fefdfb' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='washi'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23washi)' opacity='0.4'/%3E%3C/svg%3E")`
        }} />

        <div className="absolute top-10 right-10 w-32 h-32 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg viewBox="0 0 100 100" fill="#000">
            <circle cx="50" cy="50" r="30" />
            <ellipse cx="75" cy="40" rx="15" ry="8" />
            <ellipse cx="30" cy="70" rx="10" ry="20" />
          </svg>
        </div>

        <div className="absolute bottom-16 right-16 w-16 h-16 flex items-center justify-center opacity-80" style={{ zIndex: LayoutLayer.OVERLAY }}>
          <div className="w-full h-full border-2 border-red-600 flex items-center justify-center" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
            <span className="text-red-600 text-lg font-bold">墨</span>
          </div>
        </div>

        <div className={`w-full h-full p-16 md:p-24 flex ${isLeftAligned ? 'justify-start' : 'justify-end'}`}>
          <div className="w-2/3 md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-24 h-1 mb-12 opacity-60" style={{ background: 'linear-gradient(90deg, #000 0%, transparent 100%)' }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1a1a1a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-6xl md:text-8xl mb-12"
              style={{ fontWeight: 700, lineHeight: '1.0' }}
            />

            <div className="max-w-md">
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a4a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} bullet={false} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-16 w-48 h-64 shadow-xl" style={{ zIndex: LayoutLayer.MEDIA }}>
          <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" style={{ filter: 'grayscale(100%) contrast(1.2) brightness(1.1)' }} />
        </div>
      </div>
    );
  },
};

// ============ Terrazzo Archetype ============

export const terrazzoConfig: ArchetypeConfig = {
  id: 'terrazzo',
  name: 'Terrazzo',
  category: 'wabi-sabi',
  container: { background: '#fdfbf7' },
  title: { contrast: { text: '#2d2d2d' } },
  content: { contrast: { text: '#5a5a5a' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const chips = [
      { color: '#a3b18a', x: 15, y: 20, size: 18, rotate: 45 },
      { color: '#c17767', x: 80, y: 15, size: 24, rotate: -30 },
      { color: '#e8b4bc', x: 25, y: 75, size: 16, rotate: 60 },
      { color: '#d4c5b9', x: 70, y: 80, size: 20, rotate: -45 },
      { color: '#a3b18a', x: 90, y: 50, size: 14, rotate: 15 },
      { color: '#c17767', x: 5, y: 45, size: 22, rotate: -60 },
      { color: '#e8b4bc', x: 55, y: 5, size: 12, rotate: 30 },
      { color: '#d4c5b9', x: 45, y: 90, size: 16, rotate: -15 },
    ];

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fdfbf7' }}>
        {chips.map((chip, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              zIndex: LayoutLayer.DECORATION,
              background: chip.color,
              width: chip.size,
              height: chip.size * 0.6,
              left: `${chip.x}%`,
              top: `${chip.y}%`,
              transform: `rotate(${chip.rotate}deg)`,
              borderRadius: '50%'
            }}
          />
        ))}

        <div className="w-full h-full p-12 md:p-20 flex flex-col md:flex-row gap-12 items-center" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="w-full md:w-1/2 aspect-square relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full h-full overflow-hidden shadow-lg" style={{
              borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
              border: '4px solid #fff'
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-6">
              <div className="w-4 h-4 rounded-full" style={{ background: '#a3b18a' }} />
              <div className="w-4 h-4 rounded-full" style={{ background: '#c17767' }} />
              <div className="w-4 h-4 rounded-full" style={{ background: '#e8b4bc' }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl mb-8 tracking-tight"
              style={{ fontWeight: 700, lineHeight: '1.05' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5a5a5a' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" />

            <div className="mt-8 text-xs uppercase tracking-widest opacity-40" style={{ color: '#8a8a8a' }}>
              Terrazzo • Milano
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const wabiSabiConfigs = {
  atelier: atelierConfig,
  coastal: coastalConfig,
  herbarium: herbariumConfig,
  hygge: hyggeConfig,
  kinfolk: kinfolkConfig,
  kintsugi: kintsugiConfig,
  mediterranean: mediterraneanConfig,
  monolith: monolithConfig,
  sumie: sumieConfig,
  terrazzo: terrazzoConfig,
} as const;

export type WabiSabiArchetypeId = keyof typeof wabiSabiConfigs;
