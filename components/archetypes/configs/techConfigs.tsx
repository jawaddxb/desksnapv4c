/**
 * Tech Archetype Configurations
 *
 * Factory configs for tech-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 */

import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { ArchetypeConfig, ArchetypeContext } from '../createArchetype';
import { LayoutLayer } from '../../../config';
import { EditableTitle, EditableContent } from '../../WabiSabiComponents';
import { ImageContainer } from '../../StandardLayouts';
import { SmartText } from '../../SmartText';

// ============ Aurora Archetype ============

export const auroraConfig: ArchetypeConfig = {
  id: 'aurora',
  name: 'Aurora',
  category: 'tech',
  container: { background: '#0a0a1a' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: 'rgba(255,255,255,0.7)' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const waveOffset = rng?.range(0, 100) ?? 50;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#0a0a1a' }}>
        <div className="absolute inset-0" style={{ zIndex: LayoutLayer.DECORATION }}>
          <div className="absolute w-full h-1/2 top-0 opacity-40" style={{
            background: `linear-gradient(180deg, transparent 0%, #22c55e30 30%, #06b6d440 50%, #8b5cf650 70%, #ec489940 90%, transparent 100%)`,
            transform: `translateX(${waveOffset - 50}%)`,
            filter: 'blur(60px)'
          }} />
          <div className="absolute w-full h-1/2 top-1/4 opacity-30" style={{
            background: `linear-gradient(180deg, transparent 0%, #06b6d430 40%, #8b5cf640 60%, transparent 100%)`,
            transform: `translateX(${50 - waveOffset}%)`,
            filter: 'blur(80px)'
          }} />
        </div>

        <div className="absolute inset-0 opacity-60" style={{
          background: 'radial-gradient(1px 1px at 20% 30%, #ffffff 100%, transparent), radial-gradient(1px 1px at 80% 20%, #ffffff 100%, transparent), radial-gradient(1px 1px at 40% 70%, #ffffff 100%, transparent), radial-gradient(1px 1px at 60% 50%, #ffffff 100%, transparent), radial-gradient(1px 1px at 10% 60%, #ffffff 100%, transparent), radial-gradient(1px 1px at 90% 80%, #ffffff 100%, transparent)',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-10 md:p-20 flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl lg:text-8xl mb-8"
              style={{ fontWeight: 300, lineHeight: '1.1', letterSpacing: '-0.02em' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.7' }} bullet={false} />
          </div>

          <div className="absolute bottom-12 left-12 w-56 h-40 rounded-2xl overflow-hidden opacity-80" style={{
            zIndex: LayoutLayer.MEDIA,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <ImageContainer slide={slide} theme={theme} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Bento Archetype ============

export const bentoConfig: ArchetypeConfig = {
  id: 'bento',
  name: 'Bento',
  category: 'tech',
  container: { background: '#fafafa' },
  title: { contrast: { text: '#1d1d1f' } },
  content: { contrast: { text: '#6e6e73' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const imagePosition = rng?.pick(['top-left', 'top-right', 'bottom-left', 'bottom-right']) ?? 'top-left';
    const accentNum = rng?.range(1, 9).toFixed(0) ?? '4';

    return (
      <div className="w-full h-full relative overflow-hidden p-6 md:p-10" style={{ background: '#fafafa' }}>
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-span-2' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} relative overflow-hidden rounded-2xl shadow-sm`} style={{ zIndex: LayoutLayer.MEDIA, background: '#f0f0f0' }}>
            <ImageContainer slide={slide} theme={theme} />
          </div>

          <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-1' : 'row-start-2'} p-6 flex flex-col justify-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_HERO }}>
            <span className="text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: '#9ca3af' }}>Overview</span>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-xl md:text-2xl lg:text-3xl"
              style={{ fontWeight: 600, lineHeight: '1.2' }}
            />
          </div>

          <div className={`${imagePosition === 'top-left' ? 'col-span-2 col-start-1' : imagePosition === 'top-right' ? 'col-span-2 col-start-2' : imagePosition === 'bottom-left' ? 'col-span-2 col-start-1' : 'col-span-2 col-start-2'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} p-6 flex items-center rounded-2xl`} style={{ background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: LayoutLayer.CONTENT_BASE }}>
            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm md:text-base" style={{ lineHeight: '1.65' }} />
          </div>

          <div className={`${imagePosition === 'top-left' || imagePosition === 'bottom-left' ? 'col-start-3' : 'col-start-1'} ${imagePosition.includes('top') ? 'row-start-2' : 'row-start-1'} rounded-2xl flex items-center justify-center`} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', zIndex: LayoutLayer.DECORATION }}>
            <div className="text-white text-4xl md:text-5xl font-bold opacity-90">{accentNum}</div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Circuit Archetype ============

export const circuitConfig: ArchetypeConfig = {
  id: 'circuit',
  name: 'Circuit',
  category: 'tech',
  container: { background: (ctx) => ctx.rng.pick(['#0a3d0a', '#0a2540', '#1a1a2e']) },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: 'rgba(255,255,255,0.7)' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const boardColor = rng?.pick(['#0a3d0a', '#0a2540', '#1a1a2e']) ?? '#0a3d0a';
    const traceColor = boardColor === '#0a3d0a' ? '#c9a227' : boardColor === '#0a2540' ? '#60a5fa' : '#a855f7';
    const icNumber = rng?.range(1000, 9999).toFixed(0) ?? '1234';

    return (
      <div className="w-full h-full relative overflow-hidden p-8 md:p-12" style={{ background: boardColor }}>
        <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: LayoutLayer.DECORATION }}>
          <defs>
            <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 10 50 L 40 50 L 50 40 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
              <path d="M 50 10 L 50 30 L 60 40" fill="none" stroke={traceColor} strokeWidth="2" />
              <path d="M 60 40 L 90 40" fill="none" stroke={traceColor} strokeWidth="2" />
              <circle cx="10" cy="50" r="4" fill={traceColor} />
              <circle cx="90" cy="40" r="4" fill={traceColor} />
              <circle cx="50" cy="10" r="4" fill={traceColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>

        <div className="w-full h-full flex items-center gap-10">
          <div className="w-2/5 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square p-4 rounded-lg" style={{ background: '#1a1a1a', border: `2px solid ${traceColor}` }}>
              <div className="absolute -left-3 top-1/4 flex flex-col gap-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
              </div>
              <div className="absolute -right-3 top-1/4 flex flex-col gap-2">
                {[...Array(4)].map((_, i) => <div key={i} className="w-3 h-1" style={{ background: traceColor }} />)}
              </div>
              <div className="w-full h-full rounded overflow-hidden">
                <ImageContainer slide={slide} theme={theme} />
              </div>
            </div>
            <div className="absolute -bottom-2 left-4 text-[10px] uppercase tracking-wider" style={{ color: traceColor }}>
              IC-{icNumber}
            </div>
          </div>

          <div className="w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full" style={{ background: traceColor, boxShadow: `0 0 10px ${traceColor}` }} />
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: traceColor }}>Active Module</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ fontWeight: 700, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.7)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ CyberDeck Archetype ============

export const cyberDeckConfig: ArchetypeConfig = {
  id: 'cyberdeck',
  name: 'CyberDeck',
  category: 'tech',
  container: { background: '#050505' },
  title: { contrast: { text: '#22d3ee' } },
  content: { contrast: { text: '#ffffff' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => (
    <div className="w-full h-full bg-[#050505] p-6 md:p-12 font-mono flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-cyan-900/30 rounded-lg pointer-events-none" style={{ zIndex: LayoutLayer.DECORATION }} />

      <div className="flex flex-col md:flex-row gap-12 h-full" style={{ zIndex: LayoutLayer.CONTENT_BASE }}>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6 text-cyan-500/80">
            <Globe className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase">Netrunner Link // Active</span>
          </div>
          <EditableTitle slide={slide} theme={theme} contrast={{ text: '#22d3ee' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-3xl md:text-6xl font-bold mb-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ fontFamily: '"Rajdhani", sans-serif', lineHeight: '1.1' }} />

          <div className="border-l-2 border-cyan-800 pl-6 space-y-4 relative">
            {slide.content.map((item: string, i: number) => (
              <div key={i} className="text-sm md:text-base text-cyan-100/80 font-mono flex gap-3">
                <span className="text-cyan-600">0{i + 1}</span>
                <SmartText
                  value={item}
                  onChange={(val) => { const newC = [...slide.content]; newC[i] = val; onUpdateSlide?.({ content: newC }); }}
                  readOnly={readOnly}
                  fontSize={16}
                  lineHeight={1.4}
                  className="bg-transparent outline-none w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 relative border border-cyan-900/50 bg-cyan-950/10 p-1">
          <ImageContainer slide={slide} theme={theme} className="grayscale contrast-125 brightness-110 opacity-70" style={{ filter: 'sepia(100%) hue-rotate(130deg) saturate(200%)' }} />
        </div>
      </div>
    </div>
  ),
};

// ============ Glass Archetype ============

export const glassConfig: ArchetypeConfig = {
  id: 'glass',
  name: 'Glass',
  category: 'tech',
  container: { background: (ctx) => `linear-gradient(${ctx.rng.range(120, 200)}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)` },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: { text: 'rgba(255,255,255,0.85)' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const gradientAngle = rng?.range(120, 200) ?? 150;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(${gradientAngle}deg, #667eea 0%, #764ba2 50%, #f093fb 100%)` }}>
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: '#ffffff', zIndex: LayoutLayer.BACKGROUND }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#ffecd2', zIndex: LayoutLayer.BACKGROUND }} />

        <div className="w-full h-full p-8 md:p-16 flex items-center gap-8">
          <div className="w-1/2 h-4/5 relative rounded-3xl overflow-hidden" style={{ zIndex: LayoutLayer.MEDIA, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
            <div className="absolute inset-3 rounded-2xl overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          <div className="w-1/2 h-4/5 p-8 md:p-12 rounded-3xl flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 8px 32px rgba(31,38,135,0.15)' }}>
            <div className="w-12 h-1 mb-8 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl lg:text-6xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: 'rgba(255,255,255,0.85)' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Hologram Archetype ============

export const hologramConfig: ArchetypeConfig = {
  id: 'hologram',
  name: 'Hologram',
  category: 'tech',
  container: { background: '#fafafa' },
  title: { contrast: { text: '#1a1a2e' } },
  content: { contrast: { text: '#4a4a68' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const shimmerAngle = rng?.range(30, 60) ?? 45;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#fafafa' }}>
        <div className="absolute inset-0 opacity-30" style={{
          background: `linear-gradient(${shimmerAngle}deg, #ff000020 0%, #ff800020 14%, #ffff0020 28%, #00ff0020 42%, #00ffff20 57%, #0000ff20 71%, #ff00ff20 85%, #ff000020 100%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-10 md:p-16 flex items-center gap-10">
          <div className="w-1/2 relative p-10 rounded-2xl" style={{
            zIndex: LayoutLayer.CONTENT_HERO,
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            <div className="absolute inset-0 rounded-2xl p-[2px] -z-10" style={{
              background: `linear-gradient(${shimmerAngle}deg, #ff0080, #ff8c00, #40e0d0, #8a2be2, #ff0080)`,
            }}>
              <div className="w-full h-full rounded-2xl" style={{ background: '#ffffff' }} />
            </div>

            <div className="w-12 h-1 rounded-full mb-8" style={{
              background: `linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)`
            }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl lg:text-6xl mb-6"
              style={{ fontWeight: 700, lineHeight: '1.1' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>

          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute inset-0 rounded-2xl" style={{
              background: `linear-gradient(${shimmerAngle + 90}deg, #ff008040, #ff8c0040, #40e0d040, #8a2be240)`,
              transform: 'scale(1.02)'
            }} />
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{
              border: '3px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: `0 0 30px rgba(255,0,128,0.2), 0 0 60px rgba(64,224,208,0.1)`
            }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full opacity-40 blur-xl" style={{
              background: `linear-gradient(90deg, #ff0080, #40e0d0, #8a2be2)`
            }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Liquid Archetype ============

export const liquidConfig: ArchetypeConfig = {
  id: 'liquid',
  name: 'Liquid',
  category: 'tech',
  container: { background: (ctx) => `linear-gradient(180deg, hsl(${220 + ctx.rng.range(0, 60)}, 30%, 95%) 0%, hsl(${260 + ctx.rng.range(0, 60)}, 40%, 92%) 100%)` },
  title: { contrast: { text: '#1d1d1f' } },
  content: { contrast: { text: '#6e6e73' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const hueShift = rng?.range(0, 60) ?? 30;

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: `linear-gradient(180deg, hsl(${220 + hueShift}, 30%, 95%) 0%, hsl(${260 + hueShift}, 40%, 92%) 100%)` }}>
        <div className="absolute inset-0 opacity-50" style={{
          background: `radial-gradient(ellipse at 30% 20%, hsla(${280 + hueShift}, 60%, 85%, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(${200 + hueShift}, 70%, 80%, 0.4) 0%, transparent 40%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-12 md:p-20 flex flex-col items-center justify-center text-center">
          <div className="relative w-full max-w-4xl p-12 md:p-16 rounded-[40px]" style={{
            zIndex: LayoutLayer.CONTENT_HERO,
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: `0 20px 80px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`
          }}>
            <div className="absolute inset-0 rounded-[40px] opacity-30 pointer-events-none" style={{
              background: `linear-gradient(135deg, hsla(${0 + hueShift}, 80%, 70%, 0.3), hsla(${60 + hueShift}, 80%, 70%, 0.2), hsla(${120 + hueShift}, 80%, 70%, 0.3), hsla(${180 + hueShift}, 80%, 70%, 0.2), hsla(${240 + hueShift}, 80%, 70%, 0.3))`,
              zIndex: LayoutLayer.DECORATION
            }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1d1d1f' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-6xl lg:text-7xl mb-8"
              style={{ fontWeight: 700, lineHeight: '1.05' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#6e6e73' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-xl max-w-2xl mx-auto" style={{ lineHeight: '1.6' }} bullet={false} />
          </div>

          <div className="absolute bottom-8 right-8 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl" style={{
            zIndex: LayoutLayer.MEDIA,
            border: '2px solid rgba(255,255,255,0.5)'
          }}>
            <ImageContainer slide={slide} theme={theme} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Mesh Archetype ============

const MESH_COLOR_SETS = [
  ['#ffecd2', '#fcb69f', '#ee9ca7', '#ffdde1'],
  ['#a8edea', '#fed6e3', '#c3cfe2', '#d299c2'],
  ['#f5f7fa', '#c3cfe2', '#e0c3fc', '#8ec5fc'],
  ['#fbc2eb', '#a6c1ee', '#f5f7fa', '#ffecd2']
];

export const meshConfig: ArchetypeConfig = {
  id: 'mesh',
  name: 'Mesh',
  category: 'tech',
  container: { background: '#ffffff' },
  title: { contrast: { text: '#1a1a2e' } },
  content: { contrast: { text: '#4a4a68' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const colors = rng?.pick(MESH_COLOR_SETS) ?? MESH_COLOR_SETS[0];

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse at 0% 0%, ${colors[0]} 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, ${colors[1]} 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, ${colors[2]} 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, ${colors[3]} 0%, transparent 50%)
          `,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-10 md:p-16 flex items-center gap-12">
          <div className="w-1/2 p-10 rounded-3xl" style={{
            zIndex: LayoutLayer.CONTENT_HERO,
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)'
          }}>
            <div className="w-16 h-2 rounded-full mb-8" style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }} />

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#1a1a2e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-4xl md:text-5xl lg:text-6xl mb-8"
              style={{ fontWeight: 600, lineHeight: '1.15' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#4a4a68' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg" style={{ lineHeight: '1.7' }} />
          </div>

          <div className="w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Neon Archetype ============

const NEON_COLOR_SETS = [
  { primary: '#ff00ff', secondary: '#00ffff' },
  { primary: '#00ffff', secondary: '#ff00ff' },
  { primary: '#ff0080', secondary: '#80ff00' },
  { primary: '#00ff80', secondary: '#8000ff' }
];

export const neonConfig: ArchetypeConfig = {
  id: 'neon',
  name: 'Neon',
  category: 'tech',
  container: { background: '#000000' },
  title: { contrast: { text: '#ffffff' } },
  content: { contrast: (ctx) => ({ text: ctx.rng.pick(NEON_COLOR_SETS).secondary }) },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const colors = rng?.pick(NEON_COLOR_SETS) ?? NEON_COLOR_SETS[0];

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#000000' }}>
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          zIndex: LayoutLayer.OVERLAY
        }} />

        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(ellipse at 20% 80%, ${colors.primary}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${colors.secondary}40 0%, transparent 50%)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="w-full h-full p-8 md:p-16 flex items-center">
          <div className="w-full md:w-3/5 flex flex-col justify-center" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="mb-8">
              <span className="px-4 py-1 text-xs uppercase tracking-[0.3em] border" style={{
                color: colors.primary,
                borderColor: colors.primary,
                boxShadow: `0 0 10px ${colors.primary}60, inset 0 0 10px ${colors.primary}30`
              }}>System Online</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#ffffff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl lg:text-8xl mb-6"
              style={{
                fontWeight: 900,
                lineHeight: '0.95',
                textShadow: `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}40, 0 0 60px ${colors.primary}20`
              }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: colors.secondary }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-lg max-w-lg" style={{ lineHeight: '1.7' }} />
          </div>

          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-2/5 aspect-[4/5] hidden md:block" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="absolute inset-0 rounded-lg" style={{
              boxShadow: `0 0 30px ${colors.primary}60, 0 0 60px ${colors.primary}30, inset 0 0 30px ${colors.secondary}20`,
              border: `2px solid ${colors.primary}`
            }} />
            <div className="absolute inset-2 rounded-md overflow-hidden">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Pulse Archetype ============

export const pulseConfig: ArchetypeConfig = {
  id: 'pulse',
  name: 'Pulse',
  category: 'tech',
  container: { background: '#0f172a' },
  title: { contrast: { text: '#f1f5f9' } },
  content: { contrast: { text: '#94a3b8' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const accentColor = rng?.pick(['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']) ?? '#22c55e';
    const pulseValue = rng?.range(60, 180).toFixed(0) ?? '120';

    return (
      <div className="w-full h-full relative overflow-hidden" style={{ background: '#0f172a' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(${accentColor}40 1px, transparent 1px), linear-gradient(90deg, ${accentColor}40 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          zIndex: LayoutLayer.BACKGROUND
        }} />

        <div className="absolute left-0 right-0 top-1/3 h-px opacity-40" style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 20%, ${accentColor} 40%, transparent 50%, ${accentColor} 60%, ${accentColor} 80%, transparent 100%)`,
          zIndex: LayoutLayer.DECORATION
        }} />

        <div className="w-full h-full p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
            <div className="mb-8">
              <span className="text-8xl md:text-9xl font-bold" style={{ color: accentColor }}>{pulseValue}</span>
              <span className="text-2xl ml-2" style={{ color: '#64748b' }}>bpm</span>
            </div>

            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#f1f5f9' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-3xl md:text-4xl lg:text-5xl mb-6"
              style={{ fontWeight: 600, lineHeight: '1.2' }}
            />

            <EditableContent slide={slide} theme={theme} contrast={{ text: '#94a3b8' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-base" style={{ lineHeight: '1.7' }} />

            <div className="mt-8 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
              <span className="text-xs uppercase tracking-wider" style={{ color: accentColor }}>Live Data</span>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative" style={{ zIndex: LayoutLayer.MEDIA }}>
            <div className="w-full aspect-video rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}40` }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
            <div className="absolute -inset-2 rounded-xl opacity-20 blur-xl" style={{ background: accentColor }} />
          </div>
        </div>
      </div>
    );
  },
};

// ============ Terminal Archetype ============

export const terminalConfig: ArchetypeConfig = {
  id: 'terminal',
  name: 'Terminal',
  category: 'tech',
  container: { background: '#0d1117' },
  title: { contrast: { text: '#e6edf3' } },
  content: { contrast: { text: '#8b949e' } },
  customRender: ({ slide, theme, rng, onUpdateSlide, readOnly }) => {
    const promptColor = rng?.pick(['#22c55e', '#06b6d4', '#f59e0b', '#a855f7']) ?? '#22c55e';
    const timestamp = rng
      ? `${rng.range(0, 23).toFixed(0).padStart(2, '0')}:${rng.range(0, 59).toFixed(0).padStart(2, '0')}`
      : '12:00';
    const slideNum = rng?.range(1, 99).toFixed(0) ?? '1';

    return (
      <div className="w-full h-full relative overflow-hidden p-4 md:p-8" style={{ background: '#0d1117' }}>
        <div className="w-full h-full rounded-xl overflow-hidden flex flex-col" style={{ background: '#161b22', border: '1px solid #30363d', zIndex: LayoutLayer.CONTENT_BASE }}>
          <div className="h-10 px-4 flex items-center gap-2 border-b" style={{ background: '#0d1117', borderColor: '#30363d' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
            <span className="ml-4 text-xs" style={{ color: '#8b949e' }}>slide.{slideNum}.tsx — Terminal</span>
          </div>

          <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-8 overflow-hidden">
            <div className="flex-1 flex flex-col" style={{ zIndex: LayoutLayer.CONTENT_HERO }}>
              <div className="flex items-center gap-2 mb-6">
                <span style={{ color: promptColor }}>→</span>
                <span className="text-xs uppercase tracking-wider" style={{ color: '#8b949e' }}>{timestamp} • output</span>
              </div>

              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#e6edf3' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-4xl md:text-5xl lg:text-6xl mb-6"
                style={{ fontWeight: 600, lineHeight: '1.15' }}
              />

              <div className="border-l-2 pl-4" style={{ borderColor: promptColor }}>
                <EditableContent slide={slide} theme={theme} contrast={{ text: '#8b949e' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="text-sm md:text-base" style={{ lineHeight: '1.8' }} />
              </div>

              <div className="mt-auto pt-6 flex items-center gap-2">
                <span style={{ color: promptColor }}>$</span>
                <span className="text-sm" style={{ color: '#8b949e' }}>_</span>
                <div className="w-2 h-4 animate-pulse" style={{ background: promptColor }} />
              </div>
            </div>

            <div className="w-full md:w-2/5 aspect-video md:aspect-auto rounded-lg overflow-hidden border" style={{ borderColor: '#30363d', zIndex: LayoutLayer.MEDIA }}>
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Vaporwave Archetype ============

export const vaporwaveConfig: ArchetypeConfig = {
  id: 'vaporwave',
  name: 'Vaporwave',
  category: 'tech',
  container: { background: '#ff9cd6' },
  title: { contrast: { text: '#fff' } },
  content: { contrast: { text: '#fff' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#ff9cd6] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#240046] via-[#7b2cbf] to-[#ff9cd6] h-[60%]" style={{ zIndex: LayoutLayer.BACKGROUND }} />

        <div className="absolute bottom-0 w-full h-[40%] bg-[#240046]" style={{
          zIndex: LayoutLayer.BACKGROUND,
          backgroundImage: `linear-gradient(transparent 95%, cyan 95%), linear-gradient(90deg, transparent 95%, cyan 95%)`,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-100px)'
        }} />

        <div className="absolute top-[20%] w-64 h-64 rounded-full bg-gradient-to-t from-yellow-300 to-pink-500 blur-md" style={{ zIndex: LayoutLayer.BACKGROUND }} />

        <div className="relative z-20 flex items-center justify-center w-full max-w-6xl gap-12">
          <div className="w-1/2 bg-[#c0c0c0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <div className="bg-blue-800 px-2 py-1 flex justify-between items-center text-white mb-1">
              <span className="text-[10px] font-bold">visual_explorer.exe</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
                <div className="w-3 h-3 bg-[#c0c0c0] border border-gray-500" />
              </div>
            </div>
            <div className="w-full aspect-video bg-black relative">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>

          <div className="w-1/2 text-left">
            <div className="text-cyan-300 text-xs font-bold uppercase tracking-[0.5em] mb-4 drop-shadow-md">AESTHETIC // VIBE</div>
            <EditableTitle
              slide={slide} theme={theme} contrast={{ text: '#fff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
              className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[2px_2px_0_#ff00ff]"
              style={{ fontFamily: '"Arial", sans-serif', fontStyle: 'italic' }}
            />
            <div className="bg-black/40 p-6 border border-white/20 backdrop-blur-md">
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#fff' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium text-shadow-sm" />
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-10 text-white/30 text-6xl font-black writing-vertical-rl pointer-events-none select-none">
          データウェーブ
        </div>
      </div>
    );
  },
};

// ============ Y2K Archetype ============

export const y2kConfig: ArchetypeConfig = {
  id: 'y2k',
  name: 'Y2K',
  category: 'tech',
  container: { background: 'white' },
  title: { contrast: { text: '#1e293b' } },
  content: { contrast: { text: '#334155' } },
  customRender: ({ slide, theme, onUpdateSlide, readOnly }) => {
    return (
      <div className="w-full h-full relative overflow-hidden bg-white flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(circle at 50% 50%, #e0e7ff 0%, #fae8ff 50%, #dbeafe 100%)`,
          zIndex: LayoutLayer.BACKGROUND
        }} />
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)`, zIndex: LayoutLayer.BACKGROUND }} />

        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-cyan-300" style={{ zIndex: LayoutLayer.DECORATION }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse bg-pink-300" style={{ zIndex: LayoutLayer.DECORATION, animationDelay: '1s' }} />

        <div className="w-full max-w-5xl relative z-20 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 p-8 backdrop-blur-xl bg-white/40 rounded-[3rem] border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-cyan-700/60">
                <Sparkles className="w-3 h-3" />
                <span>Future_Vision.exe</span>
              </div>
              <EditableTitle
                slide={slide} theme={theme} contrast={{ text: '#1e293b' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly}
                className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-sm"
                style={{ lineHeight: '0.9' }}
              />
              <EditableContent slide={slide} theme={theme} contrast={{ text: '#334155' }} onUpdateSlide={onUpdateSlide} readOnly={readOnly} className="font-medium" />
            </div>
          </div>

          <div className="w-full md:w-1/2 aspect-square relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-[2rem] transform rotate-3 scale-105 opacity-50 blur-lg group-hover:rotate-6 transition-all duration-500" />
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl">
              <ImageContainer slide={slide} theme={theme} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ============ Export All Configs ============

export const techConfigs = {
  aurora: auroraConfig,
  bento: bentoConfig,
  circuit: circuitConfig,
  cyberdeck: cyberDeckConfig,
  glass: glassConfig,
  hologram: hologramConfig,
  liquid: liquidConfig,
  mesh: meshConfig,
  neon: neonConfig,
  pulse: pulseConfig,
  terminal: terminalConfig,
  vaporwave: vaporwaveConfig,
  y2k: y2kConfig,
} as const;

export type TechArchetypeId = keyof typeof techConfigs;
