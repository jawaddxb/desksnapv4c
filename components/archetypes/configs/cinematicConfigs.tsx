/**
 * Cinematic Archetype Configurations
 *
 * Factory configs for cinematic-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { MoveUpRight, VenetianMask, Ruler } from 'lucide-react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Cinematic Archetype ============

export const cinematicConfig: ArchetypeConfig = {
  id: 'cinematic',
  name: 'Cinematic',
  category: 'cinematic',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#ddd' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
      <div className="w-full h-full relative bg-black flex flex-col justify-center overflow-hidden">
        {/* Letterbox Bars - Set to OVERLAY (50) */}
        <div className="absolute top-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />
        <div className="absolute bottom-0 left-0 w-full h-[12%] bg-black pointer-events-none" style={{ zIndex: LayoutLayer.OVERLAY }} />

        <div className="w-full h-full relative animate-in fade-in duration-1000" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          <ImageContainer slide={slide} theme={theme} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Text Boosted to CONTENT_TOP (60) to sit ABOVE letterbox bars */}
        <div className="absolute bottom-[15%] w-full text-center px-20" style={{ zIndex: LayoutLayer.CONTENT_TOP }}>
          <EditableTitle
            slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
            className="text-5xl md:text-7xl font-bold text-white mb-4 text-shadow-xl drop-shadow-lg tracking-wide opacity-90"
            style={{ lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
          />
          <div className="inline-block bg-black/50 backdrop-blur-sm px-6 py-2 rounded-sm border-y border-white/10">
            <EditableContent
              slide={slide} theme={theme} contrast={{ text: '#ddd' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-lg md:text-xl text-zinc-200 italic font-serif"
              bullet={false}
            />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Noir Archetype ============

export const noirConfig: ArchetypeConfig = {
  id: 'noir',
  name: 'Noir',
  category: 'cinematic',
  container: { background: '#0a0a0a' },
  title: { contrast: { text: '#fff' } },
  content: { contrast: { text: '#ccc' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    return (
      <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
        {/* Venetian Blind Shadow Effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: LayoutLayer.OVERLAY,
          background: `linear-gradient(transparent 50%, rgba(0,0,0,0.8) 50%)`,
          backgroundSize: '100% 40px'
        }} />

        <div className="absolute inset-0 opacity-50 grayscale contrast-150" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          <ImageContainer slide={slide} theme={theme} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" style={{ zIndex: LayoutLayer.BACKGROUND }} />

        <div className="relative z-20 w-full max-w-6xl px-12 grid grid-cols-2">
          <div className="col-span-1 pr-12 border-r border-white/20">
            <div className="flex items-center gap-3 mb-8 text-white/40">
              <VenetianMask className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Shadow Play</span>
            </div>

            {/* Text boosted to CONTENT_TOP (60) to float ABOVE the blinds overlay (50) */}
            <div style={{ position: 'relative', zIndex: LayoutLayer.CONTENT_TOP }}>
              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#fff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-2xl"
                style={{ lineHeight: '1.1' }}
              />
              <div className="w-24 h-1 bg-white mb-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#ccc' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-serif text-xl italic opacity-80" />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Schematic Archetype ============

export const schematicConfig: ArchetypeConfig = {
  id: 'schematic',
  name: 'Schematic',
  category: 'cinematic',
  container: { background: '#f0f9ff' },
  title: { contrast: { text: '#0033cc' } },
  content: { contrast: { text: '#0033cc' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const gridColor = contrast?.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,100,0.1)';
    const inkColor = contrast?.mode === 'dark' ? '#fff' : '#0033cc';

    return (
      <div className="w-full h-full relative overflow-hidden bg-[#0a192f] p-12 font-mono" style={{ background: contrast?.mode === 'dark' ? '#0f172a' : '#f0f9ff' }}>
        {/* Blueprint Grid */}
        <div className="absolute inset-0" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 border-[20px] border-double pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION, borderColor: inkColor, opacity: 0.3 }} />

        <div className="relative h-full flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="flex justify-between items-end border-b-2 pb-4 mb-8" style={{ borderColor: inkColor }}>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: inkColor }}>Project No. {(rng?.range(100, 999) ?? 100).toFixed(0)}</span>
              <EditableTitle slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold uppercase" style={{ fontFamily: '"Space Mono", monospace', lineHeight: '1' }} />
            </div>
            <div className="border border-current px-2 py-1 text-xs" style={{ color: inkColor }}>REV A.02</div>
          </div>

          <div className="flex-1 flex gap-8">
            <div className="w-1/2 relative border" style={{ borderColor: inkColor }}>
              <div className="absolute top-0 left-0 border-b border-r px-2 py-1 text-[9px] uppercase" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: inkColor, color: inkColor, background: contrast?.bg ?? '#f0f9ff' }}>Fig 1.0</div>

              <div className="w-full h-full p-6">
                <div className="w-full h-full relative overflow-hidden grayscale contrast-125 opacity-80 mix-blend-multiply dark:mix-blend-normal">
                  <ImageContainer slide={slide} theme={theme} />
                </div>
              </div>
            </div>
            <div className="w-1/2 pt-4">
              <div className="flex items-center gap-2 mb-4 opacity-50" style={{ color: inkColor }}>
                <Ruler className="w-4 h-4" />
                <span className="text-[10px] uppercase">Specifications</span>
              </div>
              <EditableContent slide={slide} theme={theme} contrast={{ text: inkColor }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm space-y-4" style={{ fontFamily: '"Space Mono", monospace' }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Brutalist Archetype ============

export const brutalistConfig: ArchetypeConfig = {
  id: 'brutalist',
  name: 'Brutalist',
  category: 'cinematic',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#000000' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full p-4 md:p-6" style={{ background: contrast?.accent ?? '#ffffff' }}>
      <div className="w-full h-full border-4 border-black bg-white relative flex flex-col md:flex-row overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,1)]" style={{ borderColor: contrast?.text ?? '#000000', background: contrast?.bg ?? '#ffffff' }}>

        {/* Header Strip */}
        <div className="absolute top-0 left-0 w-full h-12 border-b-4 border-black flex items-center justify-between px-4 bg-white" style={{ zIndex: LayoutLayer.UI, borderColor: contrast?.text ?? '#000000' }}>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-black bg-red-500" />
            <div className="w-4 h-4 rounded-full border-2 border-black bg-yellow-400" />
          </div>
          <div className="font-mono text-xs font-bold uppercase">Fig. {(rng?.range(1, 10) ?? 1).toFixed(0)}</div>
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 border-b-4 md:border-b-0 md:border-r-4 border-black relative" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast?.text ?? '#000000' }}>
          <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
          <div className="absolute inset-0 bg-red-500 mix-blend-lighten opacity-30 pointer-events-none" />
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full pt-12 p-8 flex flex-col justify-between bg-white" style={{ zIndex: LayoutLayer.CONTENT_BASE, background: contrast?.bg ?? '#ffffff' }}>
          <div>
            <EditableTitle slide={slide} theme={theme} contrast={contrast ?? { text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl font-black uppercase mb-4" style={{ lineHeight: '1' }} />
            <div className="w-full h-2 bg-black mb-6" />
          </div>
          <EditableContent slide={slide} theme={theme} contrast={contrast ?? { text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm md:text-base" />
          <div className="mt-4 flex justify-end">
            <MoveUpRight className="w-12 h-12" style={{ color: contrast?.text ?? '#000000' }} />
          </div>
        </div>
      </div>
    </div>
  ),
};

// ============ Clay Archetype ============

export const clayConfig: ArchetypeConfig = {
  id: 'clay',
  name: 'Clay',
  category: 'cinematic',
  container: { background: '#f0f4ff' },
  title: { contrast: { text: '#374151' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const clayColors = [
      { bg: '#f0f4ff', card: '#e8edff' },
      { bg: '#fff0f4', card: '#ffe8ed' },
      { bg: '#f0fff4', card: '#e8ffe8' },
      { bg: '#fffff0', card: '#ffffe8' }
    ];
    const colors = rng?.pick(clayColors) ?? clayColors[0];

    return (
      <div className="w-full h-full relative overflow-hidden p-10 md:p-16" style={{ background: colors.bg }}>
        {/* Soft background shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-50" style={{
          background: colors.card,
          boxShadow: 'inset 8px 8px 16px rgba(0,0,0,0.05), inset -8px -8px 16px rgba(255,255,255,0.8)',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full flex items-center gap-12">
          {/* Clay card - Content */}
          <div className="w-1/2 p-10 rounded-[32px]" style={{
            zIndex: LayoutLayer.CONTENT_HERO,
            background: colors.card,
            boxShadow: `
              20px 20px 60px rgba(0,0,0,0.08),
              -20px -20px 60px rgba(255,255,255,0.9),
              inset 2px 2px 4px rgba(255,255,255,0.8),
              inset -2px -2px 4px rgba(0,0,0,0.04)
            `
          }}>
            <div className="w-16 h-4 rounded-full mb-8" style={{
              background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
              boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.3)'
            }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>

          {/* Clay image container */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square rounded-[40px] overflow-hidden" style={{
              boxShadow: `
                20px 20px 60px rgba(0,0,0,0.1),
                -20px -20px 60px rgba(255,255,255,0.9),
                inset 4px 4px 8px rgba(255,255,255,0.6),
                inset -4px -4px 8px rgba(0,0,0,0.05)
              `
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
