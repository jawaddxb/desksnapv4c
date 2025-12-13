/**
 * Design Movements Archetype Configurations
 *
 * Factory configs for design-movements archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { Triangle, Barcode, Grid } from 'lucide-react';
import { ArchetypeConfig, ArchetypeContext } from '../createArchetype';
import { LayoutLayer } from '@/config';
import { EditableTitle, EditableContent, DecorativeLabel } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';

// ============ Bauhaus Archetype ============

export const bauhausConfig: ArchetypeConfig = {
  id: 'bauhaus',
  name: 'Bauhaus',
  category: 'design-movements',
  container: { background: '#f0f0f0' },
  title: { contrast: { text: '#111' } },
  content: { contrast: { text: '#111' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const c1 = '#E4002B'; // Red
    const c2 = '#0057B7'; // Blue
    const c3 = '#FFD700'; // Yellow

    return (
      <div className="w-full h-full relative bg-[#f0f0f0] p-8 md:p-12 flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white" style={{ zIndex: LayoutLayer.BACKGROUND }} />

        <div className="absolute top-12 right-12 w-32 h-32 rounded-full mix-blend-multiply opacity-90" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c1 }} />
        <div className="absolute top-32 right-32 w-32 h-32 bg-transparent border-[20px] rounded-full opacity-80" style={{ zIndex: LayoutLayer.DECORATION, borderColor: c2 }} />
        <div className="absolute bottom-12 left-12 w-64 h-12" style={{ zIndex: LayoutLayer.DECORATION, backgroundColor: c3 }} />

        <div className="flex gap-8 h-[60%] pointer-events-none" style={{ zIndex: LayoutLayer.MEDIA }}>
          <div className="w-1/2 h-full relative overflow-hidden rounded-tr-[100px] pointer-events-auto">
            <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125" />
          </div>
          <div className="w-1/2 pt-12">
            <div className="pointer-events-auto relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
              <EditableTitle
                slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
                style={{ lineHeight: '0.9' }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t-4 border-black pt-6 mt-8" style={{ zIndex: LayoutLayer.CONTENT_BASE, borderColor: '#111' }}>
          <div className="col-span-2 pointer-events-auto">
            <EditableContent slide={slide} theme={theme} contrast={{text: '#111'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold text-lg" bullet={false} />
          </div>
          <div className="flex justify-end items-end">
            <Triangle className="w-12 h-12 text-black fill-current" />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Constructivist Archetype ============

export const constructivistConfig: ArchetypeConfig = {
  id: 'constructivist',
  name: 'Constructivist',
  category: 'design-movements',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#000000' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const angle = rng?.range(-15, 15) ?? 5;
    const primaryColor = rng?.pick([theme.colors.accent, '#ef4444', '#f59e0b', '#3b82f6']) ?? theme.colors.accent;
    const refNum = rng?.range(1000, 9999).toFixed(0) ?? '1234';

    return (
      <div className="w-full h-full relative overflow-hidden p-8 md:p-16 flex items-center" style={{ background: contrast.bg }}>
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND, background: primaryColor, clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full opacity-5 mix-blend-multiply" style={{ zIndex: LayoutLayer.BACKGROUND, background: contrast.text }} />

        <div className="absolute right-[5%] top-[10%] w-[45%] h-[70%] border-4 border-black transition-all duration-500 hover:rotate-0"
             style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.text, transform: `rotate(${angle}deg)`, boxShadow: `20px 20px 0px ${primaryColor}` }}>
          <ImageContainer slide={slide} theme={theme} className="grayscale" />
        </div>

        <div className="w-full md:w-3/5 flex flex-col justify-center h-full pointer-events-none relative" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
          <div className="w-24 h-24 mb-6 rounded-full mix-blend-multiply opacity-90 animate-pulse pointer-events-auto" style={{ backgroundColor: primaryColor }} />

          <div className="pointer-events-auto bg-transparent">
            <EditableTitle
              slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-6xl md:text-8xl font-black uppercase mb-8"
              style={{ lineHeight: '0.9' }}
            />
            <div className="border-l-4 pl-6 backdrop-blur-sm bg-white/30 p-4 rounded-r-lg" style={{ borderColor: contrast.text }}>
              <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg font-bold" bullet={false} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 bg-white border-2 border-black p-4 rotate-3" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.text, background: contrast.bg }}>
          <Barcode className="w-12 h-6 mb-1" style={{ color: contrast.text }} />
          <div className="text-[9px] font-mono text-center">REF-{refNum}</div>
        </div>
      </div>
    );
  },
};

// ============ Deco Archetype ============

export const decoConfig: ArchetypeConfig = {
  id: 'deco',
  name: 'Deco',
  category: 'design-movements',
  container: { background: '#0a0a14' },
  title: { contrast: { text: '#d4af37' } },
  content: { contrast: { text: '#9ca3af' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    const gold = '#d4af37';
    const navy = '#0a0a14';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: navy }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-10" style={{ zIndex: LayoutLayer.BACKGROUND }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-1 h-full origin-center" style={{
              background: gold,
              transform: `rotate(${i * 30}deg)`
            }} />
          ))}
        </div>

        <div className="absolute inset-6 border-2" style={{ borderColor: gold, zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-2" style={{ background: gold }} />
        </div>

        <div className="absolute top-10 left-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
          <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
        </div>
        <div className="absolute top-10 right-10 w-16 h-16" style={{ zIndex: LayoutLayer.DECORATION, transform: 'scaleX(-1)' }}>
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: gold }} />
          <div className="absolute top-0 left-0 w-1 h-full" style={{ background: gold }} />
          <div className="absolute top-4 left-4 w-8 h-8 border-2" style={{ borderColor: gold }} />
        </div>

        <div className="w-full h-full p-16 md:p-20 flex items-center gap-12">
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="w-20 h-1 mb-8" style={{ background: gold }} />
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: gold }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.1', letterSpacing: '0.05em' }}
            />
            <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-3 border" style={{ borderColor: gold }} />
            <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gold}` }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: LayoutLayer.OVERLAY }}>
              <div className="w-0 h-0" style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderTop: `20px solid ${gold}`
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Gothic Archetype ============

export const gothicConfig: ArchetypeConfig = {
  id: 'gothic',
  name: 'Gothic',
  category: 'design-movements',
  container: { background: 'linear-gradient(180deg, #0a0a0a 0%, #4a1c2a 100%)' },
  title: { contrast: { text: '#f5f0e6' } },
  content: { contrast: { text: '#9ca3af' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gothic = {
      black: '#0a0a0a',
      burgundy: '#4a1c2a',
      gold: '#c9a227',
      purple: '#2a1a3a'
    };

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${gothic.black} 0%, ${gothic.burgundy} 100%)` }}>
        {/* Vintage texture overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        {/* Ornate corner flourishes */}
        <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 opacity-50" style={{ borderColor: gothic.gold, zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Ornate framed image */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 border-2 opacity-40" style={{ borderColor: gothic.gold }} />
            <div className="absolute -inset-2 border opacity-60" style={{ borderColor: gothic.gold }} />
            <div className="w-full aspect-[3/4] overflow-hidden" style={{ border: `3px solid ${gothic.gold}` }}>
              <ImageContainer slide={slide} theme={theme} className="sepia-[.2] contrast-110" />
            </div>
          </div>

          {/* Content */}
          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px" style={{ background: gothic.gold }} />
              <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
              <div className="flex-1 h-px" style={{ background: gothic.gold }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#f5f0e6' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.15', letterSpacing: '0.02em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#9ca3af' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex-1 h-px" style={{ background: gothic.gold }} />
              <div className="w-2 h-2 rotate-45" style={{ background: gothic.gold }} />
              <div className="flex-1 h-px" style={{ background: gothic.gold }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Memphis Archetype ============

export const memphisConfig: ArchetypeConfig = {
  id: 'memphis',
  name: 'Memphis',
  category: 'design-movements',
  container: { background: '#ffb3d9' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#000000' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#ffb3d9', '#b3ffb3', '#b3d9ff', '#ffffb3'];
    const bgColor = rng?.pick(bgColors) ?? '#ffb3d9';
    const shapeRotation = rng?.range(-20, 20) ?? 10;

    return (
      <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-black" style={{ transform: `rotate(${shapeRotation}deg)`, zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full border-4 border-black" style={{ background: '#ff6b6b', zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute top-1/3 left-10 w-0 h-0" style={{
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: '52px solid #3b82f6',
          zIndex: LayoutLayer.DECORATION
        }} />

        <svg className="absolute bottom-10 right-1/4 w-48 h-12 opacity-80" viewBox="0 0 100 20" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10" stroke="#000" strokeWidth="3" fill="none" />
        </svg>

        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute -inset-4 border-4 border-black" style={{ transform: 'rotate(3deg)' }} />
            <div className="w-full aspect-[4/5] border-4 border-black overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-6"
              style={{ fontWeight: 900, lineHeight: '1.0' }}
            />
            <div className="border-l-4 border-black pl-6">
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mod Archetype ============

export const modConfig: ArchetypeConfig = {
  id: 'mod',
  name: 'Mod',
  category: 'design-movements',
  container: { background: '#f5f0e6' },
  title: { contrast: { text: '#2d2d2d' } },
  content: { contrast: { text: '#5d5d5d' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const mod = {
      cream: '#f5f0e6',
      mustard: '#d4a03c',
      teal: '#2d8c8c',
      olive: '#6b7c4c',
      orange: '#d96c3c'
    };
    const accentColor = rng?.pick([mod.mustard, mod.teal, mod.olive, mod.orange]) ?? mod.mustard;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: mod.cream }}>
        {/* Organic blob shape */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[60%] aspect-square opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M45,65 Q65,30 115,45 T165,95 Q180,140 135,165 T55,155 Q25,130 35,95 T45,65" fill={accentColor} />
          </svg>
        </div>

        {/* Hairpin leg accent */}
        <div className="absolute bottom-0 left-20 w-1 h-40" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-0 left-24 w-1 h-32" style={{ background: '#2d2d2d', zIndex: LayoutLayer.DECORATION }} />

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-16">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-3 mb-8">
              <div className="w-8 h-8 rounded-full" style={{ background: mod.mustard }} />
              <div className="w-8 h-8 rounded-full" style={{ background: mod.teal }} />
              <div className="w-8 h-8 rounded-full" style={{ background: mod.orange }} />
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 500, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>

          {/* Image in organic blob mask */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <clipPath id="blob-clip">
                    <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" />
                  </clipPath>
                </defs>
                <foreignObject width="200" height="200" clipPath="url(#blob-clip)">
                  <div className="w-full h-full">
                    <ImageContainer slide={slide} theme={theme} />
                  </div>
                </foreignObject>
                <path d="M45,55 Q75,20 125,35 T175,85 Q190,135 145,170 T60,165 Q20,135 30,90 T45,55" fill="none" stroke={accentColor} strokeWidth="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Neue Archetype ============

export const neueConfig: ArchetypeConfig = {
  id: 'neue',
  name: 'Neue',
  category: 'design-movements',
  container: { background: '#fef08a' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#374151' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const bgColors = ['#fef08a', '#fecaca', '#bbf7d0', '#bfdbfe'];
    const bgColor = rng?.pick(bgColors) ?? bgColors[0];
    const shadowOffset = 8;

    return (
      <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: bgColor }}>
        <div className="w-full h-full flex flex-col md:flex-row items-center gap-8">
          {/* Image with brutal frame */}
          <div className="w-full md:w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square rounded-2xl border-4 border-black overflow-hidden" style={{
              boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          {/* Content card */}
          <div className="w-full md:w-3/5 p-8 rounded-2xl border-4 border-black" style={{
            zIndex: LayoutLayer.CONTENT_HERO,
            background: '#ffffff',
            boxShadow: `${shadowOffset}px ${shadowOffset}px 0px #000000`
          }}>
            <div className="inline-block px-4 py-1 rounded-full border-2 border-black mb-6 text-sm font-bold uppercase">
              Featured
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ fontWeight: 900, lineHeight: '1.05' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.6' }} />

            <div className="mt-8 flex gap-3">
              <div className="px-6 py-3 rounded-xl border-3 border-black text-sm font-bold" style={{
                background: bgColor,
                boxShadow: '4px 4px 0px #000000'
              }}>
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Pop Archetype ============

export const popConfig: ArchetypeConfig = {
  id: 'pop',
  name: 'Pop',
  category: 'design-movements',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#374151' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const primaryColor = rng?.pick(['#ef4444', '#3b82f6', '#fbbf24']) ?? '#ef4444';
    const secondaryColor = primaryColor === '#ef4444' ? '#fbbf24' : primaryColor === '#3b82f6' ? '#ef4444' : '#3b82f6';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
        {/* Ben-Day dots */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(${primaryColor} 2px, transparent 2px)`,
          backgroundSize: '12px 12px',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        {/* Explosion burst behind content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square" style={{ zIndex: LayoutLayer.DECORATION }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon
              points="100,10 115,75 180,75 125,110 145,175 100,140 55,175 75,110 20,75 85,75"
              fill={secondaryColor}
              stroke="#000"
              strokeWidth="3"
            />
          </svg>
        </div>

        <div className="w-full h-full p-10 md:p-16 flex items-center gap-10 relative">
          {/* Image with halftone */}
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square border-4 border-black overflow-hidden">
              <ImageContainer slide={slide} theme={theme} className="contrast-110 saturate-150" />
            </div>
            {/* Halftone overlay */}
            <div className="absolute inset-0 mix-blend-multiply opacity-30" style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
              backgroundSize: '4px 4px'
            }} />
          </div>

          {/* Speech bubble content */}
          <div className="w-3/5 relative p-8" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="absolute inset-0 bg-white border-4 border-black rounded-3xl" />
            {/* Bubble tail */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2">
              <div className="w-0 h-0" style={{
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
                borderRight: '30px solid #000'
              }} />
              <div className="absolute left-1 w-0 h-0" style={{
                borderTop: '16px solid transparent',
                borderBottom: '16px solid transparent',
                borderRight: '26px solid #fff',
                top: '-16px'
              }} />
            </div>

            <div className="relative">
              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#000000' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-5xl md:text-6xl lg:text-7xl mb-4"
                style={{ fontWeight: 900, lineHeight: '0.95' }}
              />

              <EditableContent slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl" style={{ lineHeight: '1.5' }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ PostModern Archetype ============

export const postModernConfig: ArchetypeConfig = {
  id: 'postmodern',
  name: 'PostModern',
  category: 'design-movements',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#000000' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const useRadial = (rng?.next() ?? 0.5) > 0.5;
    const bgPattern = useRadial
      ? `radial-gradient(${contrast.accent} 2px, transparent 2px)`
      : `repeating-linear-gradient(45deg, ${contrast.accent}20 0, ${contrast.accent}20 2px, transparent 0, transparent 50%)`;

    const shapeColor = rng?.pick(['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C']) ?? '#4ECDC4';

    return (
      <div className="w-full h-full relative overflow-hidden bg-white p-8" style={{ background: contrast.bg }}>
        <div className="absolute inset-0 opacity-20" style={{ zIndex: LayoutLayer.BACKGROUND, backgroundImage: bgPattern, backgroundSize: '20px 20px' }} />

        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 transform rotate-12 border-4 border-black shadow-[4px_4px_0_#000]" style={{ zIndex: LayoutLayer.DECORATION }} />

        <div className="relative h-full flex flex-col md:flex-row items-center gap-12" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="w-full md:w-1/2">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] transform -rotate-1 relative" style={{ borderColor: contrast.text }}>
              <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: '"Righteous", cursive', lineHeight: '1' }} />
              <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-bold" />
            </div>
          </div>
          <div className="w-full md:w-1/2 aspect-square relative">
            <div className="absolute inset-0 bg-black translate-x-4 translate-y-4" style={{ backgroundColor: shapeColor }} />
            <div className="relative w-full h-full border-4 border-black bg-white overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Retro Archetype ============

export const retroConfig: ArchetypeConfig = {
  id: 'retro',
  name: 'Retro',
  category: 'design-movements',
  container: { background: '#faf8f0' },
  title: { contrast: { text: '#2d2d2d' } },
  content: { contrast: { text: '#5d5d5d' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const retro = { cream: '#faf8f0', turquoise: '#40e0d0', coral: '#ff7f50', mustard: '#e4a010' };
    const accentColor = rng?.pick([retro.turquoise, retro.coral, retro.mustard]) ?? retro.coral;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: retro.cream }}>
        <div className="absolute top-20 right-20 w-40 h-40" style={{ zIndex: LayoutLayer.DECORATION }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-1 h-20 origin-bottom -translate-x-1/2" style={{
              background: accentColor,
              transform: `rotate(${i * 45}deg) translateY(-50%)`
            }} />
          ))}
          <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ background: accentColor }} />
        </div>

        <svg className="absolute bottom-20 left-20 w-32 h-32 opacity-60" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M10,50 Q30,30 50,30 T90,50" stroke={retro.coral} strokeWidth="8" fill="none" strokeLinecap="round" />
        </svg>

        <div className="w-full h-full p-12 md:p-16 flex items-center gap-12">
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-[4/3] rounded-[30%] overflow-hidden border-8" style={{ borderColor: '#3d3d3d', background: '#2d2d2d' }}>
              <div className="w-full h-full rounded-[28%] overflow-hidden">
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/4 right-1/4 h-2 rounded-b-lg" style={{ background: '#3d3d3d' }} />
          </div>

          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex gap-2 mb-6">
              <div className="w-4 h-4 rounded-full" style={{ background: retro.turquoise }} />
              <div className="w-4 h-4 rounded-full" style={{ background: retro.coral }} />
              <div className="w-4 h-4 rounded-full" style={{ background: retro.mustard }} />
            </div>
            <EditableTitle slide={slide} theme={theme} contrast={{ text: '#2d2d2d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8" style={{ fontWeight: 700, lineHeight: '1.05' }} />
            <EditableContent slide={slide} theme={theme} contrast={{ text: '#5d5d5d' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Rococo Archetype ============

export const rococoConfig: ArchetypeConfig = {
  id: 'rococo',
  name: 'Rococo',
  category: 'design-movements',
  container: { background: '#fdf2f4' },
  title: { contrast: { text: '#374151' } },
  content: { contrast: { text: '#6b7280' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const rococo = {
      blush: '#fdf2f4',
      powder: '#e8f4f8',
      gold: '#c9a227',
      cream: '#faf8f0'
    };
    const bgColor = rng?.pick([rococo.blush, rococo.powder, rococo.cream]) ?? rococo.blush;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
        {/* Scrollwork decoration */}
        <svg className="absolute top-0 left-0 w-64 h-64 opacity-20" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="5" fill={rococo.gold} />
        </svg>
        <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-20 rotate-180" viewBox="0 0 100 100" style={{ zIndex: LayoutLayer.DECORATION }}>
          <path d="M10,50 Q30,20 50,50 T90,50 M50,10 Q20,30 50,50 T50,90" stroke={rococo.gold} strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="5" fill={rococo.gold} />
        </svg>

        <div className="w-full h-full p-12 md:p-20 flex items-center gap-12">
          {/* Content */}
          <div className="w-1/2 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            {/* Ornate header */}
            <div className="flex items-center gap-2 mb-8">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
              </svg>
              <span className="text-xs uppercase tracking-[0.3em]" style={{ color: rococo.gold }}>Exquisite</span>
              <svg className="w-8 h-8 rotate-180" viewBox="0 0 24 24">
                <path d="M12,2 Q8,6 12,10 T12,18 M2,12 Q6,8 10,12 T18,12" stroke={rococo.gold} strokeWidth="1" fill="none" />
              </svg>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#374151' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl mb-8"
              style={{ fontWeight: 400, lineHeight: '1.2', fontStyle: 'italic' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6b7280' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.8' }} />
          </div>

          {/* Gilded frame image */}
          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            {/* Outer ornate frame */}
            <div className="absolute -inset-6 rounded-lg" style={{
              background: `linear-gradient(135deg, ${rococo.gold} 0%, #e8d48a 50%, ${rococo.gold} 100%)`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }}>
              <div className="absolute inset-2 rounded" style={{ background: bgColor }} />
            </div>
            <div className="relative w-full aspect-[4/5] rounded overflow-hidden" style={{ border: `4px solid ${rococo.gold}` }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Stark Archetype ============

export const starkConfig: ArchetypeConfig = {
  id: 'stark',
  name: 'Stark',
  category: 'design-movements',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: '#ffffff' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const isDark = (rng?.next() ?? 0.5) > 0.5;
    const bg = isDark ? '#000000' : '#ffffff';
    const text = isDark ? '#ffffff' : '#000000';

    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-16 md:p-24" style={{ background: bg }}>
        {/* Single content element - Maximum breathing room */}
        <div className="max-w-3xl text-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
          <EditableTitle
            slide={slide} theme={theme} contrast={{ text }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
            className="text-5xl md:text-7xl lg:text-8xl"
            style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
          />
        </div>

        {/* Minimal image - Small, positioned */}
        {slide.imageUrl && (
          <div className="absolute bottom-12 right-12 w-24 h-24 rounded-full overflow-hidden opacity-60" style={{ zIndex: LayoutLayer.MEDIA }}>
            <ImageContainer slide={slide} theme={theme} />
          </div>
        )}

        {/* Single dot accent */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: text, opacity: 0.3, zIndex: LayoutLayer.DECORATION }} />
      </div>
    );
  },
};

// ============ Swiss Archetype ============

export const swissConfig: ArchetypeConfig = {
  id: 'swiss',
  name: 'Swiss',
  category: 'design-movements',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000000' } },
  content: { contrast: { text: '#000000' } },
  customRender: ({ slide, theme, contrast, rng, onUpdateSlide, readOnly }) => {
    const figNum = rng?.range(1, 99).toFixed(0) ?? '42';
    const gridNum = rng?.range(10, 20).toFixed(0) ?? '12';

    return (
      <div className="w-full h-full grid grid-cols-12 grid-rows-6 bg-zinc-50" style={{ background: contrast.bg }}>
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-20 border-r border-black" style={{ zIndex: LayoutLayer.BACKGROUND, borderColor: contrast.border }}>
          {[...Array(12)].map((_, i) => <div key={i} className="border-l border-black h-full" style={{ borderColor: contrast.border }} />)}
        </div>

        <div className="col-span-12 row-span-4 md:col-span-8 md:row-span-6 relative border-b md:border-b-0 md:border-r border-black" style={{ zIndex: LayoutLayer.MEDIA, borderColor: contrast.border }}>
          <ImageContainer slide={slide} theme={theme} />
          <div className="absolute top-6 left-6 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest border border-black shadow-sm" style={{ zIndex: LayoutLayer.OVERLAY, borderColor: contrast.border, color: contrast.text, background: contrast.bg }}>
            Figure {figNum}
          </div>
        </div>

        <div className="col-span-12 row-span-2 md:col-span-4 md:row-span-6 p-8 flex flex-col justify-between h-full relative" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div>
            <div className="w-full h-px bg-current mb-2 opacity-50" style={{ color: contrast.text }} />
            <DecorativeLabel text={`Grid Sys. ${gridNum}`} className="mb-8" style={{ color: contrast.text }} />
            <EditableTitle slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8" style={{ textTransform: 'lowercase' }} />
          </div>
          <div className="space-y-4">
            <EditableContent slide={slide} theme={theme} contrast={contrast} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-sm md:text-base" bullet={false} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ SwissGrid Archetype ============

export const swissGridConfig: ArchetypeConfig = {
  id: 'swissgrid',
  name: 'SwissGrid',
  category: 'design-movements',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#000' } },
  content: { contrast: { text: '#333' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const num = rng?.range(0, 9).toFixed(0) ?? '4';

    return (
      <div className="w-full h-full bg-white relative p-12 flex flex-col">
        <div className="absolute inset-0 px-12 py-12 grid grid-cols-4 gap-4 pointer-events-none">
          <div className="border-r border-red-500/20 h-full" />
          <div className="border-r border-red-500/20 h-full" />
          <div className="border-r border-red-500/20 h-full" />
          <div className="border-r border-red-500/20 h-full hidden" />
        </div>

        <div className="w-full h-4 bg-black mb-12 flex items-center justify-between px-2">
          <span className="text-white text-[9px] font-bold uppercase tracking-widest">Grid System 04</span>
          <Grid className="w-3 h-3 text-white" />
        </div>

        <div className="grid grid-cols-4 gap-8 h-full relative z-10">
          <div className="col-span-1 flex flex-col justify-between">
            <div className="text-9xl font-black tracking-tighter leading-none" style={{ color: '#000' }}>
              {num}<span className="text-red-600">.</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest rotate-180 origin-top-left translate-y-full text-zinc-400">
              International Style
            </div>
          </div>

          <div className="col-span-2 pt-24">
            <EditableTitle
              slide={slide} theme={theme} contrast={{text: '#000'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
              style={{ fontFamily: '"Helvetica Neue", "Arial", sans-serif' }}
            />
            <div className="w-12 h-2 bg-red-600 mb-8" />
            <EditableContent slide={slide} theme={theme} contrast={{text: '#333'}} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-lg" bullet={false} />
          </div>

          <div className="col-span-1 h-full relative">
            <div className="absolute inset-0 bg-zinc-100 grayscale contrast-125">
              <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-red-600 text-white p-2 text-xs font-bold">Fig A.</div>
          </div>
        </div>
      </div>
    );
  },
};
