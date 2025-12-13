/**
 * Layout Constants
 *
 * Defines available Wabi-Sabi layout names for archetypes.
 * Extracted from components to eliminate hooks→components dependency.
 *
 * Note: This list should match the ARCHETYPE_RENDERERS keys in WabiSabiStage.tsx
 */

/**
 * All available Wabi-Sabi layout/archetype names.
 * Used for layout cycling, random selection, and validation.
 */
export const WABI_SABI_LAYOUT_NAMES = [
  // Editorial & Typography
  'Editorial',
  'Constructivist',
  'Brutalist',
  'CyberDeck',
  'Zine',
  'Swiss',
  'Receipt',
  'Typographic',
  'Collage',
  'Bauhaus',
  'PostModern',
  'Schematic',
  'Cinematic',
  'Y2K',
  'Risograph',
  'Vaporwave',
  'SwissGrid',
  'Noir',
  // Wabi Sabi
  'Kintsugi',
  'Hygge',
  'Terrazzo',
  'Kinfolk',
  'Mediterranean',
  'Sumi-e',
  'Monolith',
  'Herbarium',
  'Coastal',
  'Atelier',
  // Corporate Pitch Deck
  'Venture',
  'Keynote',
  'Gradient',
  'Signal',
  'Metric',
  'Narrative',
  'Beacon',
  'Slide',
  'Canvas',
  'Deck',
  // Modern Tech
  'Bento',
  'Glass',
  'Liquid',
  'Terminal',
  'Neon',
  'Aurora',
  'Mesh',
  'Pulse',
  'Circuit',
  'Hologram',
  // Design Movements
  'Memphis',
  'Deco',
  'Retro',
  'Neue',
  'Clay',
  'Pop',
  'Mod',
  'Gothic',
  'Rococo',
  'Stark',
  // Natural/Organic
  'Terra',
  'Forest',
  'Stone',
  'Bloom',
  'Desert',
  'Frost',
  'Ember',
  'Mist',
  'Grain',
  'Mineral',
  // Cultural/Regional
  'Tokyo',
  'Seoul',
  'Paris',
  'Milano',
  'Brooklyn',
  'Nordic',
  'Havana',
  'Marrakech',
  'Kyoto',
  'Vienna',
  // Cultural Heritage
  'Mughal',
  'Ankara',
  'Talavera',
  'Persian',
  'Batik',
  'Celtic',
  'Aztec',
  'Aboriginal',
  // Historical Period
  'Victorian',
  'Disco',
  'Grunge',
  'Atomic',
  'Nouveau',
  'Tudor',
  // Artisanal Craft
  'Indigo',
  'Copper',
  'Raku',
  'Weave',
  'Ceramic',
  'Patina',
  // Atmospheric/Mood
  'Dusk',
  'Monsoon',
  'Tundra',
  'Savanna',
  'Volcano',
  'Reef',
  // Typography & Print
  'Blackletter',
  'Newsprint',
  'Letterpress',
  'Stencil',
  'Woodtype',
  // Contemporary Art
  'Installation',
  'Glitch',
  'MixedMedia',
  'Ink',
  'Oxidize',
  // Future/Speculative
  'Quantum',
  'Biotech',
  'Solarpunk',
  'Void',
] as const;

/**
 * Type for valid layout names
 */
export type WabiSabiLayoutName = typeof WABI_SABI_LAYOUT_NAMES[number];

/**
 * Default layout used when none is specified
 */
export const DEFAULT_LAYOUT: WabiSabiLayoutName = 'Editorial';
