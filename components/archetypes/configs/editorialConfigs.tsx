/**
 * Editorial Archetype Configurations
 *
 * Factory configs for editorial-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { Receipt as ReceiptIcon, Quote } from 'lucide-react';
import { ArchetypeConfig } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent, MagazineLayout } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { SmartText } from '../../SmartText';

// ============ Collage Archetype ============

export const collageConfig: ArchetypeConfig = {
  id: 'collage',
  name: 'Collage',
  category: 'editorial',
  container: { background: '#f3f4f6' },
  title: { contrast: { text: '#111' } },
  content: { contrast: { text: '#333' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const rot1 = rng?.range(-5, 5) ?? -2;
    const rot2 = rng?.range(-3, 3) ?? 1;
    const tapeColor = rng?.pick(['#ef4444', '#f59e0b', '#84cc16']) ?? '#f59e0b';

    return (
      <div className="w-full h-full relative overflow-hidden bg-[#f3f4f6] flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.5'/%3E%3C/svg%3E")` }} />

        <div className="relative w-full max-w-5xl h-[80%] flex items-center justify-center">
          <div className="absolute top-0 right-0 w-[60%] h-full bg-white shadow-xl p-12 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, transform: `rotate(${rot2}deg)`, clipPath: 'polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%)' }}>
            <EditableTitle slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-7xl font-serif italic mb-6" style={{ color: '#111', lineHeight: '1' }} />
            <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-mono text-sm" />
          </div>

          <div className="absolute top-10 left-0 w-[45%] aspect-[3/4] bg-white p-2 shadow-2xl transition-transform hover:scale-105 duration-300" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${rot1}deg)` }}>
            <div className="w-full h-full relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 opacity-80" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: tapeColor, transform: 'rotate(-2deg)' }} />
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Editorial Archetype ============

export const editorialConfig: ArchetypeConfig = {
  id: 'editorial',
  name: 'Editorial',
  category: 'editorial',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#ffffff' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isVerticalInverted = rng?.next() ?? 0 > 0.5;
    const isHorizontalInverted = rng?.next() ?? 0 > 0.5;
    const vol = rng?.range(1, 12).toFixed(0) ?? '1';

    return (
      <div className="w-full h-full relative overflow-hidden bg-black group">
        <div className="absolute inset-0 opacity-80 transition-transform duration-[2s] group-hover:scale-105" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          <ImageContainer slide={slide} theme={theme} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" style={{ zIndex: LayoutLayer.DECORATION }} />

        <div className={`absolute w-full h-full p-8 md:p-16 flex flex-col ${isVerticalInverted ? 'justify-start' : 'justify-end'} ${isHorizontalInverted ? 'items-end' : 'items-start'}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className={`flex items-center gap-4 mb-2 border-b border-white/30 pb-4 max-w-xs ${isHorizontalInverted ? 'flex-row-reverse' : ''}`} style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
            <span className="text-white text-xs font-bold uppercase tracking-widest">{theme.name}</span>
            <span className="text-white/50 text-xs">/</span>
            <span className="text-white text-xs font-serif italic">Vol. {vol}</span>
          </div>

          <MagazineLayout
            alignRight={isHorizontalInverted}
            titleNode={
              <EditableTitle
                slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter opacity-90"
                style={{ lineHeight: '0.9', zIndex: LayoutLayer.CONTENT_BASE }}
              />
            }
            contentNode={
              <EditableContent slide={slide} theme={theme} contrast={{text: '#ffffff'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="flex-1 text-shadow-sm font-medium" bullet={false} />
            }
          />
        </div>
      </div>
    );
  },
};

// ============ Receipt Archetype ============

export const receiptConfig: ArchetypeConfig = {
  id: 'receipt',
  name: 'Receipt',
  category: 'editorial',
  container: { background: '#3f3f46' },
  title: { contrast: { text: '#000' } },
  content: { contrast: { text: '#000' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full flex items-center justify-center p-4 bg-zinc-800 relative">
      <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]" style={{ zIndex: LayoutLayer.BACKGROUND }} />

      <div className="w-full max-w-md bg-white shadow-2xl relative flex flex-col p-8 filter drop-shadow-xl"
        style={{
          zIndex: LayoutLayer.CONTENT_BASE,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 98%, 98% 100%, 96% 98%, 94% 100%, 92% 98%, 90% 100%, 88% 98%, 86% 100%, 84% 98%, 82% 100%, 80% 98%, 78% 100%, 76% 98%, 74% 100%, 72% 98%, 70% 100%, 68% 98%, 66% 100%, 64% 98%, 62% 100%, 60% 98%, 58% 100%, 56% 98%, 54% 100%, 52% 98%, 50% 100%, 48% 98%, 46% 100%, 44% 98%, 42% 100%, 40% 98%, 38% 100%, 36% 98%, 34% 100%, 32% 98%, 30% 100%, 28% 98%, 26% 100%, 24% 98%, 22% 100%, 20% 98%, 18% 100%, 16% 98%, 14% 100%, 12% 98%, 10% 100%, 8% 98%, 6% 100%, 4% 98%, 2% 100%, 0% 98%)'
        }}>
        <div className="text-center border-b-2 border-dashed border-zinc-300 pb-6 mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-zinc-900 rounded-full flex items-center justify-center text-white">
            <ReceiptIcon className="w-6 h-6" />
          </div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500">Official Record</h3>
          <div className="font-mono text-[10px] text-zinc-400 mt-1">{new Date().toLocaleDateString()} // {new Date().toLocaleTimeString()}</div>
        </div>

        <EditableTitle slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl font-mono text-center mb-8 uppercase" style={{ fontFamily: '"Space Mono", monospace', lineHeight: '1.1' }} />

        <div className="space-y-4 mb-8 font-mono text-sm">
          {slide.content.map((item: string, i: number) => (
            <div key={i} className="flex justify-between items-start border-b border-zinc-100 pb-2">
              <SmartText
                value={item}
                onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }}
                readOnly={readOnly}
                fontSize={14}
                lineHeight={1.3}
                className="w-3/4 bg-transparent outline-none resize-none"
              />
              <span className="w-1/4 text-right font-bold text-zinc-400">{((rng?.next() ?? Math.random()) * 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// ============ Risograph Archetype ============

export const risographConfig: ArchetypeConfig = {
  id: 'risograph',
  name: 'Risograph',
  category: 'editorial',
  container: { background: '#FFFAF0' },
  title: { contrast: { text: '#111' } },
  content: { contrast: { text: '#222' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#FFFAF0] p-12 flex flex-col justify-center">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`, zIndex: LayoutLayer.OVERLAY, mixBlendMode: 'multiply' }} />

        <div className="flex gap-12 items-center relative z-10">
          <div className="w-1/2 relative aspect-[3/4]">
            <div className="absolute inset-0 bg-blue-500/20 translate-x-2 translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />
            <div className="absolute inset-0 bg-pink-500/20 -translate-x-2 -translate-y-2 mix-blend-multiply" style={{ zIndex: LayoutLayer.DECORATION }} />

            <div className="relative w-full h-full grayscale contrast-150 brightness-110 mix-blend-multiply" style={{ zIndex: LayoutLayer.MEDIA }}>
              <ImageContainer slide={slide} theme={theme} style={{ filter: 'grayscale(100%) contrast(1.2)' }} />
            </div>

            <div className="absolute inset-0 bg-blue-900 mix-blend-lighten pointer-events-none opacity-50" style={{ zIndex: LayoutLayer.MEDIA }} />
          </div>

          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-12 h-12 rounded-full border-4 mb-6 border-blue-600/80 mix-blend-multiply" />
            <EditableTitle
              slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-6xl md:text-8xl font-black uppercase mb-6 tracking-tighter opacity-90"
              style={{ color: '#111', lineHeight: '0.9' }}
            />
            <div className="p-6 border-l-4 border-pink-500/60 bg-white/50 backdrop-blur-sm">
              <EditableContent slide={slide} theme={theme} contrast={{text: '#222'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Typographic Archetype ============

export const typographicConfig: ArchetypeConfig = {
  id: 'typographic',
  name: 'Typographic',
  category: 'editorial',
  container: { background: (ctx) => ctx.contrast.bg },
  title: { contrast: (ctx) => ({ text: ctx.contrast.text }) },
  content: { contrast: (ctx) => ({ text: ctx.contrast.text }) },
  customRender: ({ slide, theme, contrast, onUpdateSlide, readOnly }) => {
    const bgWord = slide.title.split(' ')[0] || "SLIDE";
    const words = Array(6).fill(bgWord);

    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-8" style={{ background: contrast.bg }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none overflow-hidden leading-[0.8] flex flex-col justify-center" style={{ zIndex: LayoutLayer.BACKGROUND, color: contrast.text, fontFamily: theme.fonts.heading, fontSize: '20vh', fontWeight: 900, whiteSpace: 'nowrap' }}>
          {words.map((w, i) => (
            <div key={i} style={{ marginLeft: `${i * -5}%` }}>{w} {w} {w}</div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl items-center pointer-events-none" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="order-2 md:order-1 pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-24 h-2 bg-current mb-8" style={{ color: contrast.accent }} />
            <EditableTitle
              slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight"
              style={{ lineHeight: '0.9' }}
            />
            <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl md:text-2xl font-light" />
          </div>

          <div className="order-1 md:order-2 relative aspect-square pointer-events-auto" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute inset-0 border-2 rounded-full opacity-20 scale-110" style={{ borderColor: contrast.text, borderStyle: 'dashed' }} />
            <div className="w-full h-full rounded-full overflow-hidden border-4 relative shadow-2xl" style={{ borderColor: contrast.bg }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-xl border border-black" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
              <Quote className="w-8 h-8 opacity-50" style={{ color: contrast.text }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Zine Archetype ============

export const zineConfig: ArchetypeConfig = {
  id: 'zine',
  name: 'Zine',
  category: 'editorial',
  container: { background: (ctx) => ctx.contrast.bg },
  title: { contrast: { text: '#000' } },
  content: { contrast: { text: '#333' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const tapeColor = rng?.pick(['#ef4444', '#facc15', '#3b82f6']) ?? '#facc15';
    const rotation = rng?.range(-2, 2) ?? 1;
    const tapeRotation = rng?.range(-2, 2) ?? 0;

    return (
      <div className="w-full h-full relative p-8 flex flex-col md:flex-row gap-8 items-center justify-center overflow-hidden" style={{ background: contrast.bg }}>
        <div className="absolute inset-0 opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: theme.colors.backgroundPattern || `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

        <div className="relative w-full md:w-1/2 aspect-[4/5] shrink-0 transition-transform hover:scale-105 duration-500" style={{ zIndex: LayoutLayer.MEDIA, transform: `rotate(${rotation}deg)` }}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, background: tapeColor, transform: `rotate(${tapeRotation}deg)`, opacity: 0.9, clipPath: `polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)` }} />
          <div className="w-full h-full shadow-2xl border-4 border-white"><ImageContainer slide={slide} theme={theme} /></div>
        </div>

        <div className="relative w-full md:w-1/2 p-10 bg-white shadow-[12px_12px_0_rgba(0,0,0,0.15)] border-2 border-zinc-100/50 backdrop-blur-sm" style={{ zIndex: LayoutLayer.CONTENT_BASE, transform: `rotate(${-rotation}deg)` }}>
          <EditableTitle slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-7xl mb-6 uppercase tracking-tighter font-black" style={{ lineHeight: '0.95', color: '#111' }} />
          <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" />
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const editorialConfigs = {
  collage: collageConfig,
  editorial: editorialConfig,
  receipt: receiptConfig,
  risograph: risographConfig,
  typographic: typographicConfig,
  zine: zineConfig,
} as const;

export type EditorialArchetypeId = keyof typeof editorialConfigs;
