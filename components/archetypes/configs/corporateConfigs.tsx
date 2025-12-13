/**
 * Corporate Archetype Configurations
 *
 * Factory configs for corporate-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { ArchetypeConfig, ArchetypeContext } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Beacon Archetype ============

const BEACON_SCHEMES = [
  { bg: '#2563eb', text: '#ffffff' },
  { bg: '#000000', text: '#ffffff' },
  { bg: '#ffffff', text: '#000000' },
  { bg: '#7c3aed', text: '#ffffff' },
  { bg: '#dc2626', text: '#ffffff' },
];

export const beaconConfig: ArchetypeConfig = {
  id: 'beacon',
  name: 'Beacon',
  category: 'corporate',
  container: {
    background: (ctx) => ctx.rng.pick(BEACON_SCHEMES).bg,
    className: 'flex items-center justify-center',
  },
  layout: {
    direction: 'column',
    align: 'center',
    justify: 'center',
    padding: '3rem',
  },
  title: {
    contrast: (ctx) => ({ text: ctx.rng.pick(BEACON_SCHEMES).text }),
    className: 'text-5xl md:text-7xl lg:text-8xl text-center',
    style: { fontWeight: 700, lineHeight: '1.1' },
  },
  content: {
    contrast: (ctx) => ({ text: ctx.rng.pick(BEACON_SCHEMES).text }),
    className: 'text-xl text-center mt-12 opacity-60',
    style: { lineHeight: '1.5' },
    bullet: false,
  },
  image: undefined,
  decorations: (ctx) => {
    const scheme = ctx.rng.pick(BEACON_SCHEMES);
    return (
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-40"
        style={{ background: scheme.text, zIndex: LayoutLayer.DECORATION }}
      />
    );
  },
};

// ============ Keynote Archetype ============

export const keynoteConfig: ArchetypeConfig = {
  id: 'keynote',
  name: 'Keynote',
  category: 'corporate',
  container: {
    background: '#000000',
    className: 'flex flex-col items-center justify-center',
  },
  layout: {
    direction: 'column',
    align: 'center',
    justify: 'center',
    padding: '3rem',
  },
  title: {
    contrast: { text: '#ffffff' },
    className: 'text-5xl md:text-7xl lg:text-8xl mb-8 text-center',
    style: { fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' },
  },
  content: {
    contrast: { text: '#a1a1aa' },
    className: 'text-xl md:text-2xl max-w-2xl mb-16 text-center',
    style: { lineHeight: '1.5' },
    bullet: false,
  },
  image: {
    position: 'bottom',
    className: 'w-full max-w-3xl',
    containerStyle: {
      aspectRatio: '16/9',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 0 80px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
    },
  },
  decorations: () => (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: LayoutLayer.BACKGROUND,
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }}
      />
    </>
  ),
};

// ============ Slide Archetype ============

export const slideConfig: ArchetypeConfig = {
  id: 'slide',
  name: 'Slide',
  category: 'corporate',
  container: { background: '#ffffff' },
  layout: {
    direction: (ctx) => (ctx.rng.next() > 0.5 ? 'row' : 'row-reverse'),
    gap: '3rem',
    align: 'center',
    padding: '3rem 4rem',
  },
  title: {
    contrast: { text: '#374151' },
    className: 'text-4xl md:text-5xl lg:text-6xl mb-8',
    style: { fontWeight: 600, lineHeight: '1.15' },
  },
  content: {
    contrast: { text: '#6b7280' },
    className: 'text-lg',
    style: { lineHeight: '1.7' },
  },
  image: {
    position: 'right',
    className: 'w-1/2',
    containerStyle: {
      aspectRatio: '4/3',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  footer: {
    render: (ctx) => {
      const accentColor = ctx.rng.pick(['#2563eb', '#dc2626', '#059669', '#7c3aed']);
      return (
        <div className="flex items-center gap-3 mt-8">
          <div
            className="px-4 py-2 rounded-full text-sm"
            style={{ background: `${accentColor}15`, color: accentColor }}
          >
            Key Insight
          </div>
        </div>
      );
    },
    className: 'absolute bottom-12 left-16',
    style: { zIndex: LayoutLayer.OVERLAY },
  },
};

// ============ Venture Archetype ============

export const ventureConfig: ArchetypeConfig = {
  id: 'venture',
  name: 'Venture',
  category: 'corporate',
  container: { background: '#ffffff' },
  layout: {
    direction: (ctx) => (ctx.rng.next() > 0.5 ? 'row' : 'row-reverse'),
    gap: '5rem',
    align: 'center',
    padding: '4rem 6rem',
  },
  title: {
    contrast: { text: '#111827' },
    className: 'text-5xl md:text-7xl lg:text-8xl mb-10',
    style: { fontWeight: 700, lineHeight: '1.0', letterSpacing: '-0.02em' },
  },
  content: {
    contrast: { text: '#4b5563' },
    className: 'text-xl max-w-xl',
    style: { lineHeight: '1.6' },
  },
  image: {
    position: 'left',
    className: 'w-2/5',
    containerStyle: {
      aspectRatio: '4/3',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
  },
  decorations: (ctx) => {
    const accentColor = ctx.rng.pick(['#1e40af', '#059669', '#7c3aed']);
    return (
      <>
        <div
          className="absolute top-12 right-12 w-3 h-3 rounded-full"
          style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }}
        />
        <div
          className="absolute w-12 h-1 top-[45%] left-16"
          style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }}
        />
      </>
    );
  },
};

// ============ Gradient Archetype ============

const GRADIENT_OPTIONS = [
  'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
];

export const gradientConfig: ArchetypeConfig = {
  id: 'gradient',
  name: 'Gradient',
  category: 'corporate',
  container: {
    background: (ctx) => ctx.rng.pick(GRADIENT_OPTIONS),
  },
  layout: {
    direction: 'row',
    gap: '4rem',
    align: 'center',
    padding: '3rem 5rem',
  },
  title: {
    contrast: { text: '#ffffff' },
    className: 'text-5xl md:text-7xl mb-8',
    style: { fontWeight: 700, lineHeight: '1.05' },
  },
  content: {
    contrast: { text: 'rgba(255,255,255,0.85)' },
    className: 'text-lg',
    style: { lineHeight: '1.7' },
  },
  image: {
    position: 'right',
    className: 'w-1/2',
    containerStyle: {
      aspectRatio: '1/1',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      padding: '16px',
    },
  },
  decorations: () => (
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        zIndex: LayoutLayer.BACKGROUND,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
      }}
    />
  ),
};

// ============ Signal Archetype ============

export const signalConfig: ArchetypeConfig = {
  id: 'signal',
  name: 'Signal',
  category: 'corporate',
  container: { background: '#0f172a' },
  layout: {
    direction: 'row',
    gap: '3rem',
    align: 'center',
    padding: '3rem 4rem',
  },
  title: {
    contrast: { text: '#f8fafc' },
    className: 'text-5xl md:text-6xl mb-8',
    style: { fontWeight: 600, lineHeight: '1.1' },
  },
  content: {
    contrast: { text: '#94a3b8' },
    className: 'text-base',
    style: { lineHeight: '1.7' },
  },
  image: {
    position: 'right',
    className: 'w-1/2',
    containerStyle: {
      aspectRatio: '4/3',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      border: '1px solid #1e293b',
    },
  },
  header: {
    render: (ctx) => {
      const isGrowth = ctx.rng.next() > 0.5;
      const accentColor = isGrowth ? '#10b981' : '#f59e0b';
      return (
        <>
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: accentColor }} />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#64748b' }}>Signal</span>
          </div>
        </>
      );
    },
  },
  decorations: () => (
    <div
      className="absolute inset-0 opacity-10 pointer-events-none"
      style={{
        zIndex: LayoutLayer.BACKGROUND,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
  ),
};

// ============ Narrative Archetype ============

export const narrativeConfig: ArchetypeConfig = {
  id: 'narrative',
  name: 'Narrative',
  category: 'corporate',
  container: { background: '#fdfbf8' },
  layout: {
    direction: (ctx) => (ctx.rng.next() > 0.5 ? 'row' : 'row-reverse'),
    gap: '0',
    align: 'stretch',
  },
  title: {
    contrast: { text: '#1f2937' },
    className: 'text-4xl md:text-5xl lg:text-6xl mb-8',
    style: { fontWeight: 400, lineHeight: '1.15' },
  },
  content: {
    contrast: { text: '#6b7280' },
    className: 'text-base max-w-sm',
    style: { lineHeight: '1.8' },
  },
  image: {
    position: 'left',
    className: 'w-1/2 h-full',
  },
  header: {
    render: () => (
      <>
        <div className="w-full h-px mb-8" style={{ background: '#e5e1d8' }} />
        <span className="text-[10px] uppercase tracking-[0.3em] mb-6" style={{ color: '#9ca3af' }}>Feature Story</span>
      </>
    ),
  },
  footer: {
    render: () => <div className="w-full h-px mt-12" style={{ background: '#e5e1d8' }} />,
  },
};

// ============ Canvas Archetype ============

export const canvasConfig: ArchetypeConfig = {
  id: 'canvas',
  name: 'Canvas',
  category: 'corporate',
  container: { background: '#f5f5f4' },
  layout: {
    direction: 'row',
    gap: '3rem',
    align: 'center',
    padding: '3rem 4rem',
  },
  title: {
    contrast: { text: '#1f2937' },
    className: 'text-5xl md:text-6xl mb-8',
    style: { fontWeight: 700, lineHeight: '1.1' },
  },
  content: {
    contrast: { text: '#6b7280' },
    className: 'text-lg',
    style: { lineHeight: '1.7' },
  },
  image: {
    position: 'left',
    className: 'w-1/2',
    containerStyle: (ctx) => {
      const rotation = ctx.rng.range(-2, 2);
      return {
        aspectRatio: '4/5',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        transform: `rotate(${rotation}deg)`,
      };
    },
  },
  decorations: (ctx) => {
    const accentColor = ctx.rng.pick(['#f97316', '#ec4899', '#8b5cf6', '#06b6d4']);
    return (
      <>
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: accentColor, zIndex: LayoutLayer.DECORATION }}
        />
        <div
          className="absolute w-8 h-2 mb-8 rounded-full"
          style={{ background: accentColor, top: '40%', right: '45%', zIndex: LayoutLayer.DECORATION }}
        />
        <div className="absolute bottom-20 right-20 flex gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
          <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.5 }} />
          <div className="w-3 h-3 rounded-full" style={{ background: accentColor, opacity: 0.25 }} />
        </div>
      </>
    );
  },
};

// ============ Deck Archetype (Complex - uses customRender) ============

export const deckConfig: ArchetypeConfig = {
  id: 'deck',
  name: 'Deck',
  category: 'corporate',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#1e3a5f' } },
  content: { contrast: { text: '#4b5563' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const navy = '#1e3a5f';
    const slideNumber = rng?.range(1, 24).toFixed(0) ?? '1';

    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col" style={{ background: '#ffffff' }}>
        <div className="w-full px-12 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb', zIndex: LayoutLayer.OVERLAY }}>
          <span className="text-xs uppercase tracking-[0.15em]" style={{ color: '#9ca3af' }}>Confidential</span>
          <span className="text-xs" style={{ color: '#9ca3af' }}>Page {slideNumber}</span>
        </div>
        <div className="flex-1 p-12 md:p-16 flex gap-12">
          <div className="w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: navy }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-3xl md:text-4xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.25' }}
            />
            <div className="flex-1">
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#4b5563' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
            </div>
            <div className="mt-auto pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
              <span className="text-xs uppercase tracking-[0.1em]" style={{ color: '#9ca3af' }}>Source: Internal Analysis</span>
            </div>
          </div>
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full h-full overflow-hidden rounded-lg" style={{ border: '1px solid #e5e7eb' }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
        <div className="w-full h-1" style={{ background: navy }} />
      </div>
    );
  },
};

// ============ Metric Archetype (Complex - uses customRender) ============

export const metricConfig: ArchetypeConfig = {
  id: 'metric',
  name: 'Metric',
  category: 'corporate',
  container: { background: '#fafafa' },
  title: { contrast: { text: '#374151' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const metricValue = rng?.pick(['$2.4M', '147%', '10K+', '99.9%', '3.2x']) ?? '$2.4M';
    const metricLabel = rng?.pick(['Revenue', 'Growth', 'Users', 'Uptime', 'ROI']) ?? 'Revenue';
    const accentColor = '#22c55e';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        <div className="w-full h-full p-12 md:p-20 flex gap-16 items-center">
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <span className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: '#6b7280' }}>{metricLabel}</span>
            <div className="text-8xl md:text-9xl lg:text-[160px] mb-8" style={{ color: '#111827', fontWeight: 800, lineHeight: '0.9', letterSpacing: '-0.03em' }}>
              {metricValue}
            </div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-3 h-3 rounded-full" style={{ background: accentColor }} />
              <span className="text-sm" style={{ color: accentColor }}>+24% this quarter</span>
            </div>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-2xl md:text-3xl mb-4"
              style={{ fontWeight: 500, lineHeight: '1.3' }}
            />
            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base max-w-md" style={{ lineHeight: '1.6' }} />
          </div>
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-xl">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const corporateConfigs = {
  beacon: beaconConfig,
  keynote: keynoteConfig,
  slide: slideConfig,
  venture: ventureConfig,
  gradient: gradientConfig,
  signal: signalConfig,
  narrative: narrativeConfig,
  canvas: canvasConfig,
  deck: deckConfig,
  metric: metricConfig,
} as const;

export type CorporateArchetypeId = keyof typeof corporateConfigs;
