/**
 * Corporate Archetype Configurations
 *
 * Factory configs for corporate-style archetypes.
 * DRY: Replaces repetitive component code with declarative configs.
 *
 * Migration Status:
 * - FACTORY: Archetypes that can use createArchetype()
 * - CUSTOM: Archetypes that need custom render (use registerCustomArchetype)
 *
 * @see createArchetype.tsx for factory implementation
 */

import React from 'react';
import { ArchetypeConfig, ArchetypeContext } from '../createArchetype';
import { LayoutLayer } from '../../../config';

// ============ Simple Factory Configs ============

/**
 * Beacon Archetype - Statement/Hero slide
 * Simple layout: centered title + subtitle with dynamic color scheme
 */
export const beaconConfig: ArchetypeConfig = {
  id: 'beacon',
  name: 'Beacon',
  category: 'corporate',

  container: {
    background: (ctx: ArchetypeContext) => {
      const schemes = [
        { bg: '#2563eb' },
        { bg: '#000000' },
        { bg: '#ffffff' },
        { bg: '#7c3aed' },
        { bg: '#dc2626' },
      ];
      return ctx.rng.pick(schemes).bg;
    },
    className: 'flex items-center justify-center',
  },

  layout: {
    direction: 'column',
    align: 'center',
    justify: 'center',
    padding: '3rem',
  },

  title: {
    contrast: (ctx: ArchetypeContext) => {
      const schemes = [
        { bg: '#2563eb', text: '#ffffff' },
        { bg: '#000000', text: '#ffffff' },
        { bg: '#ffffff', text: '#000000' },
        { bg: '#7c3aed', text: '#ffffff' },
        { bg: '#dc2626', text: '#ffffff' },
      ];
      return { text: ctx.rng.pick(schemes).text };
    },
    className: 'text-5xl md:text-7xl lg:text-8xl text-center',
    style: { fontWeight: 700, lineHeight: '1.1' },
  },

  content: {
    contrast: (ctx: ArchetypeContext) => {
      const schemes = [
        { bg: '#2563eb', text: '#ffffff' },
        { bg: '#000000', text: '#ffffff' },
        { bg: '#ffffff', text: '#000000' },
        { bg: '#7c3aed', text: '#ffffff' },
        { bg: '#dc2626', text: '#ffffff' },
      ];
      return { text: ctx.rng.pick(schemes).text };
    },
    className: 'text-xl text-center mt-12 opacity-60',
    style: { lineHeight: '1.5' },
    bullet: false,
  },

  // No image for statement slides
  image: undefined,

  decorations: (ctx: ArchetypeContext) => {
    const schemes = [
      { bg: '#2563eb', text: '#ffffff' },
      { bg: '#000000', text: '#ffffff' },
      { bg: '#ffffff', text: '#000000' },
      { bg: '#7c3aed', text: '#ffffff' },
      { bg: '#dc2626', text: '#ffffff' },
    ];
    const scheme = ctx.rng.pick(schemes);
    return (
      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full opacity-40"
        style={{ background: scheme.text, zIndex: LayoutLayer.DECORATION }}
      />
    );
  },
};

/**
 * Keynote Archetype - Apple-style presentation
 * Dark theme with radial gradient, centered content, bottom image
 */
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
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: LayoutLayer.BACKGROUND,
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />
      {/* Bottom accent line */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }}
      />
    </>
  ),
};

/**
 * Slide Archetype - Classic split layout
 * Dynamic accent color, alternating image position
 */
export const slideConfig: ArchetypeConfig = {
  id: 'slide',
  name: 'Slide',
  category: 'corporate',

  container: {
    background: '#ffffff',
  },

  layout: {
    direction: (ctx: ArchetypeContext) => (ctx.rng.next() > 0.5 ? 'row' : 'row-reverse'),
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
    position: 'right', // Will be overridden by layout direction
    className: 'w-1/2',
    containerStyle: {
      aspectRatio: '4/3',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },

  // Dynamic accent badge
  footer: {
    render: (ctx: ArchetypeContext) => {
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

// ============ Complex Configs (Use customRender for full control) ============

/**
 * Deck Archetype - Professional document style
 * More complex: header bar, footer source, specific grid layout
 * Uses customRender since it doesn't fit the standard patterns well
 */
export const deckConfig: ArchetypeConfig = {
  id: 'deck',
  name: 'Deck',
  category: 'corporate',

  container: { background: '#ffffff' },
  title: { contrast: { text: '#1e3a5f' } },
  content: { contrast: { text: '#4b5563' } },

  // This archetype uses customRender because it has a unique layout
  // with header bar, footer source, and specific grid that doesn't
  // fit the standard factory pattern
  customRender: undefined, // Keep original DeckArchetype.tsx for now
};

// ============ Export All Configs ============

export const corporateConfigs = {
  beacon: beaconConfig,
  keynote: keynoteConfig,
  slide: slideConfig,
  deck: deckConfig,
} as const;

export type CorporateArchetypeId = keyof typeof corporateConfigs;
