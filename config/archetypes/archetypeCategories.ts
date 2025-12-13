/**
 * Archetype Category Definitions
 *
 * Organizational structure for archetypes.
 */

import type { ArchetypeCategoryDefinition } from './archetypeTypes';

export const ARCHETYPE_CATEGORY_DEFINITIONS: ArchetypeCategoryDefinition[] = [
  {
    id: 'editorial',
    name: 'Editorial & Print',
    shortName: 'Editorial',
    icon: 'Newspaper',
    description: 'Magazine and publication inspired layouts',
    archetypes: ['Editorial', 'Typographic', 'Zine', 'Collage', 'Risograph', 'Receipt'],
  },
  {
    id: 'design-movements',
    name: 'Design Movements',
    shortName: 'Design',
    icon: 'Palette',
    description: 'Historical and contemporary design styles',
    archetypes: [
      'Constructivist', 'Bauhaus', 'Swiss', 'SwissGrid', 'PostModern', 'Memphis',
      'Deco', 'Retro', 'Neue', 'Pop', 'Mod', 'Gothic', 'Rococo', 'Stark',
    ],
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    shortName: 'Tech',
    icon: 'Cpu',
    description: 'Contemporary digital aesthetics',
    archetypes: [
      'Bento', 'Glass', 'Liquid', 'Terminal', 'Neon', 'Aurora', 'Mesh',
      'Pulse', 'Circuit', 'Hologram', 'CyberDeck', 'Y2K', 'Vaporwave',
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate & Pitch',
    shortName: 'Corporate',
    icon: 'Briefcase',
    description: 'Professional presentation styles',
    archetypes: [
      'Venture', 'Keynote', 'Gradient', 'Signal', 'Metric',
      'Narrative', 'Beacon', 'Slide', 'Canvas', 'Deck',
    ],
  },
  {
    id: 'wabi-sabi',
    name: 'Wabi Sabi',
    shortName: 'Wabi Sabi',
    icon: 'Leaf',
    description: 'Japanese aesthetic of imperfection',
    archetypes: [
      'Kintsugi', 'Hygge', 'Terrazzo', 'Kinfolk', 'Mediterranean',
      'Sumi-e', 'Monolith', 'Herbarium', 'Coastal', 'Atelier',
    ],
  },
  {
    id: 'natural',
    name: 'Natural & Organic',
    shortName: 'Natural',
    icon: 'TreeDeciduous',
    description: 'Earth-inspired textures and tones',
    archetypes: [
      'Terra', 'Forest', 'Stone', 'Bloom', 'Desert',
      'Frost', 'Ember', 'Mist', 'Grain', 'Mineral',
    ],
  },
  {
    id: 'cultural',
    name: 'Cultural & Regional',
    shortName: 'Cultural',
    icon: 'Globe',
    description: 'City and culture-inspired aesthetics',
    archetypes: [
      'Tokyo', 'Seoul', 'Paris', 'Milano', 'Brooklyn',
      'Nordic', 'Havana', 'Marrakech', 'Kyoto', 'Vienna',
    ],
  },
  {
    id: 'cinematic',
    name: 'Cinematic & Dramatic',
    shortName: 'Cinematic',
    icon: 'Film',
    description: 'Movie and theatrical aesthetics',
    archetypes: ['Cinematic', 'Noir', 'Schematic', 'Brutalist', 'Clay'],
  },
];
