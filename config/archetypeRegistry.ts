/**
 * Archetype Registry
 *
 * Single source of truth for all archetype metadata.
 * Consolidates data previously scattered across:
 * - lib/archetypeCategories.ts
 * - lib/archetypeVisualStyles.ts
 * - lib/archetypeContrast.ts
 *
 * Other files should derive their data from this registry.
 */

import type { ContrastConfig } from '../lib/contrast';

// =============================================================================
// TYPES
// =============================================================================

export interface ArchetypeDefinition {
  id: string;
  name: string;
  description: string;
  previewColors: [string, string];
  visualStyle: string;
  /** Custom contrast override (most use theme defaults) */
  customContrast?: ContrastConfig;
}

export interface ArchetypeCategoryDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  archetypes: string[]; // References to archetype IDs
}

// =============================================================================
// ARCHETYPE DEFINITIONS (Single Source of Truth)
// =============================================================================

export const ARCHETYPE_REGISTRY: Record<string, ArchetypeDefinition> = {
  // ===== Editorial & Print =====
  Editorial: {
    id: 'Editorial',
    name: 'Editorial',
    description: 'Magazine cover aesthetic',
    previewColors: ['#18181b', '#3f3f46'],
    visualStyle: 'Editorial photography with dramatic lighting, high contrast black and white or muted tones, magazine cover aesthetic with intentional grain',
  },
  Typographic: {
    id: 'Typographic',
    name: 'Typographic',
    description: 'Type-focused dramatic layouts',
    previewColors: ['#000000', '#404040'],
    visualStyle: 'Minimal photography serving as backdrop to typography, stark contrasts, photojournalistic style, text-friendly compositions',
  },
  Zine: {
    id: 'Zine',
    name: 'Zine',
    description: 'DIY publication style',
    previewColors: ['#fef3c7', '#f59e0b'],
    visualStyle: 'Lo-fi DIY aesthetic, photocopy textures, punk rock energy, grainy snapshots, collage-ready imagery',
  },
  Collage: {
    id: 'Collage',
    name: 'Collage',
    description: 'Mixed media cut-out aesthetic',
    previewColors: ['#fecaca', '#ef4444'],
    visualStyle: 'Cut-out photography style, mixed media aesthetic, layered images, paper texture overlays, scrapbook vibes',
  },
  Risograph: {
    id: 'Risograph',
    name: 'Risograph',
    description: 'Grainy print texture',
    previewColors: ['#c4b5fd', '#8b5cf6'],
    visualStyle: 'Grainy print texture, limited color palette, halftone dots, vintage print aesthetic, deliberately imperfect registration',
  },
  Receipt: {
    id: 'Receipt',
    name: 'Receipt',
    description: 'Thermal print inspired',
    previewColors: ['#fafafa', '#d4d4d4'],
    visualStyle: 'Minimal monochrome imagery, thermal print aesthetic, high contrast black on cream, utilitarian documentation style',
    customContrast: {
      bg: '#ffffff',
      text: '#18181b',
      accent: '#000000',
      secondary: '#18181b',
      border: '#e4e4e7',
      mode: 'paper',
    },
  },

  // ===== Design Movements =====
  Constructivist: {
    id: 'Constructivist',
    name: 'Constructivist',
    description: 'Russian avant-garde',
    previewColors: ['#dc2626', '#000000'],
    visualStyle: 'Bold geometric compositions, red/black/white palette, propaganda poster aesthetic, angular dramatic photography',
  },
  Bauhaus: {
    id: 'Bauhaus',
    name: 'Bauhaus',
    description: 'German modernist school',
    previewColors: ['#fbbf24', '#dc2626'],
    visualStyle: 'Primary colors, geometric shapes, functional modernist photography, clean industrial aesthetic',
  },
  Swiss: {
    id: 'Swiss',
    name: 'Swiss',
    description: 'International typographic style',
    previewColors: ['#ffffff', '#000000'],
    visualStyle: 'Clean objective photography, grid-aligned compositions, typographic harmony, functional clarity',
  },
  SwissGrid: {
    id: 'SwissGrid',
    name: 'Swiss Grid',
    description: 'Grid-based Swiss design',
    previewColors: ['#f5f5f5', '#171717'],
    visualStyle: 'Precise grid-based photography, mathematical compositions, clean modernist aesthetic, systematic visual order',
  },
  PostModern: {
    id: 'PostModern',
    name: 'Post Modern',
    description: 'Deconstructed aesthetics',
    previewColors: ['#ec4899', '#8b5cf6'],
    visualStyle: 'Deconstructed imagery, clashing styles, ironic juxtapositions, deliberately chaotic compositions',
  },
  Memphis: {
    id: 'Memphis',
    name: 'Memphis',
    description: '80s Italian design group',
    previewColors: ['#22d3ee', '#f472b6'],
    visualStyle: '80s bold colors, playful geometric patterns, squiggles and terrazzo, fun pop aesthetic',
  },
  Deco: {
    id: 'Deco',
    name: 'Art Deco',
    description: '1920s geometric elegance',
    previewColors: ['#d4af37', '#1a1a2e'],
    visualStyle: 'Geometric elegance, gold and black, 1920s glamour, symmetrical compositions, luxurious materials',
  },
  Retro: {
    id: 'Retro',
    name: 'Retro',
    description: 'Vintage throwback style',
    previewColors: ['#f97316', '#854d0e'],
    visualStyle: 'Vintage color palettes, 70s warm tones, faded photography, nostalgic warmth, film grain',
  },
  Neue: {
    id: 'Neue',
    name: 'Neue',
    description: 'Contemporary minimal',
    previewColors: ['#fafafa', '#525252'],
    visualStyle: 'Contemporary minimal photography, clean modern aesthetic, subtle sophistication, restrained elegance',
  },
  Pop: {
    id: 'Pop',
    name: 'Pop Art',
    description: 'Warhol-inspired boldness',
    previewColors: ['#facc15', '#ef4444'],
    visualStyle: 'Bold saturated colors, Warhol-inspired imagery, comic book aesthetic, high energy visuals',
  },
  Mod: {
    id: 'Mod',
    name: 'Mod',
    description: '60s British design',
    previewColors: ['#000000', '#ffffff'],
    visualStyle: '60s British design aesthetic, high contrast, geometric patterns, swinging London vibes',
  },
  Gothic: {
    id: 'Gothic',
    name: 'Gothic',
    description: 'Dark romantic style',
    previewColors: ['#1f1f1f', '#7c3aed'],
    visualStyle: 'Dark romantic imagery, dramatic shadows, mysterious atmosphere, ornate details',
  },
  Rococo: {
    id: 'Rococo',
    name: 'Rococo',
    description: 'Ornate classical',
    previewColors: ['#fdf4ff', '#d946ef'],
    visualStyle: 'Ornate classical elegance, soft pastels, floral motifs, theatrical opulence',
  },
  Stark: {
    id: 'Stark',
    name: 'Stark',
    description: 'High contrast minimal',
    previewColors: ['#ffffff', '#000000'],
    visualStyle: 'Extreme minimal high contrast, pure black and white, dramatic negative space',
  },

  // ===== Modern Tech =====
  Bento: {
    id: 'Bento',
    name: 'Bento',
    description: 'Apple-style grid boxes',
    previewColors: ['#f5f5f7', '#1d1d1f'],
    visualStyle: 'Apple-style product photography, clean white backgrounds, precise shadows, premium tech aesthetic',
  },
  Glass: {
    id: 'Glass',
    name: 'Glass',
    description: 'Glassmorphism effects',
    previewColors: ['rgba(255,255,255,0.2)', '#6366f1'],
    visualStyle: 'Glassmorphism with depth, frosted surfaces, light refraction, translucent layers, modern UI aesthetic',
  },
  Liquid: {
    id: 'Liquid',
    name: 'Liquid',
    description: 'Fluid organic shapes',
    previewColors: ['#818cf8', '#c084fc'],
    visualStyle: 'Fluid organic shapes, gradient melts, abstract flowing forms, dynamic movement',
  },
  Terminal: {
    id: 'Terminal',
    name: 'Terminal',
    description: 'CLI/hacker aesthetic',
    previewColors: ['#022c22', '#10b981'],
    visualStyle: 'Matrix green on black, code aesthetic, hacker vibes, digital rain, CLI interface style',
  },
  Neon: {
    id: 'Neon',
    name: 'Neon',
    description: 'Glowing cyberpunk',
    previewColors: ['#0f0f23', '#00ff88'],
    visualStyle: 'Cyberpunk neon glow, dark backgrounds with vibrant light trails, futuristic night scenes',
  },
  Aurora: {
    id: 'Aurora',
    name: 'Aurora',
    description: 'Gradient light effects',
    previewColors: ['#6366f1', '#22d3ee'],
    visualStyle: 'Northern lights color gradients, ethereal light effects, cosmic atmosphere, dreamy glow',
  },
  Mesh: {
    id: 'Mesh',
    name: 'Mesh',
    description: 'Gradient mesh backgrounds',
    previewColors: ['#f472b6', '#818cf8'],
    visualStyle: 'Gradient mesh backgrounds, smooth color transitions, abstract gradients, modern digital art',
  },
  Pulse: {
    id: 'Pulse',
    name: 'Pulse',
    description: 'Animated energy feel',
    previewColors: ['#7c3aed', '#06b6d4'],
    visualStyle: 'Energy wave visualizations, rhythmic light patterns, dynamic motion, vibrant pulse effects',
  },
  Circuit: {
    id: 'Circuit',
    name: 'Circuit',
    description: 'PCB-inspired patterns',
    previewColors: ['#064e3b', '#34d399'],
    visualStyle: 'PCB circuit patterns, tech infrastructure, green and copper tones, electronic precision',
  },
  Hologram: {
    id: 'Hologram',
    name: 'Hologram',
    description: 'Iridescent futurism',
    previewColors: ['#c084fc', '#22d3ee'],
    visualStyle: 'Iridescent rainbow effects, futuristic holograms, prismatic light, sci-fi aesthetic',
  },
  CyberDeck: {
    id: 'CyberDeck',
    name: 'CyberDeck',
    description: 'Cyberpunk terminal',
    previewColors: ['#18181b', '#22d3ee'],
    visualStyle: 'Cyberpunk retro-future, cyan and magenta, tech noir, blade runner aesthetic, digital dystopia',
    customContrast: {
      bg: '#050505',
      text: '#22d3ee',
      accent: '#22d3ee',
      secondary: '#22d3ee',
      border: '#164e63',
      mode: 'terminal',
    },
  },
  Y2K: {
    id: 'Y2K',
    name: 'Y2K',
    description: 'Year 2000 digital nostalgia',
    previewColors: ['#c0c0c0', '#0000ff'],
    visualStyle: 'Year 2000 nostalgia, chrome metallics, early internet aesthetic, bubble fonts, silver and blue',
  },
  Vaporwave: {
    id: 'Vaporwave',
    name: 'Vaporwave',
    description: 'Retro-futuristic pastels',
    previewColors: ['#ff6ad5', '#7ee8fa'],
    visualStyle: 'Retro-futuristic pastels, 80s/90s aesthetic, glitch art, neon pink and cyan, nostalgic digital',
  },

  // ===== Corporate & Pitch =====
  Venture: {
    id: 'Venture',
    name: 'Venture',
    description: 'VC pitch deck style',
    previewColors: ['#ffffff', '#3b82f6'],
    visualStyle: 'Professional business photography, clean corporate aesthetic, confident modern imagery, startup vibes',
  },
  Keynote: {
    id: 'Keynote',
    name: 'Keynote',
    description: 'Apple keynote inspired',
    previewColors: ['#000000', '#ffffff'],
    visualStyle: 'Apple keynote style, dramatic product reveals, black backgrounds, spotlight focus',
  },
  Gradient: {
    id: 'Gradient',
    name: 'Gradient',
    description: 'Modern gradient headers',
    previewColors: ['#6366f1', '#a855f7'],
    visualStyle: 'Modern gradient overlays, colorful professional imagery, contemporary business aesthetic',
  },
  Signal: {
    id: 'Signal',
    name: 'Signal',
    description: 'Data-focused clarity',
    previewColors: ['#f8fafc', '#0ea5e9'],
    visualStyle: 'Data-focused clarity, clean infographic style, blue tones, analytical precision',
  },
  Metric: {
    id: 'Metric',
    name: 'Metric',
    description: 'Numbers-forward layout',
    previewColors: ['#f1f5f9', '#475569'],
    visualStyle: 'Numbers-forward visuals, chart-friendly imagery, professional data aesthetic',
  },
  Narrative: {
    id: 'Narrative',
    name: 'Narrative',
    description: 'Story-driven structure',
    previewColors: ['#fffbeb', '#d97706'],
    visualStyle: 'Storytelling imagery, warm editorial photography, human-centric visuals',
  },
  Beacon: {
    id: 'Beacon',
    name: 'Beacon',
    description: 'Guiding focal points',
    previewColors: ['#fafafa', '#f59e0b'],
    visualStyle: 'Guiding focal points, warm accent lighting, professional warmth, directional imagery',
  },
  Slide: {
    id: 'Slide',
    name: 'Slide',
    description: 'Classic clean presentation',
    previewColors: ['#ffffff', '#64748b'],
    visualStyle: 'Classic clean presentation imagery, professional stock photo aesthetic, versatile business visuals',
  },
  Canvas: {
    id: 'Canvas',
    name: 'Canvas',
    description: 'Whitespace-heavy minimal',
    previewColors: ['#fafafa', '#a1a1aa'],
    visualStyle: 'Whitespace-heavy minimal photography, breathing room, subtle elegant compositions',
  },
  Deck: {
    id: 'Deck',
    name: 'Deck',
    description: 'Balanced professional',
    previewColors: ['#f4f4f5', '#3f3f46'],
    visualStyle: 'Balanced professional imagery, corporate neutral tones, reliable business aesthetic',
  },

  // ===== Wabi Sabi =====
  Kintsugi: {
    id: 'Kintsugi',
    name: 'Kintsugi',
    description: 'Golden repair aesthetic',
    previewColors: ['#292524', '#d4af37'],
    visualStyle: 'Golden repair aesthetic, precious imperfection, dark backgrounds with gold highlights, Japanese philosophy',
  },
  Hygge: {
    id: 'Hygge',
    name: 'Hygge',
    description: 'Danish cozy comfort',
    previewColors: ['#fef3c7', '#92400e'],
    visualStyle: 'Danish cozy warmth, soft natural light, comfort objects, warm neutrals, intimate atmosphere',
  },
  Terrazzo: {
    id: 'Terrazzo',
    name: 'Terrazzo',
    description: 'Stone chip patterns',
    previewColors: ['#fdf2f8', '#9ca3af'],
    visualStyle: 'Stone chip patterns, speckled textures, artisanal material aesthetic, natural fragments',
  },
  Kinfolk: {
    id: 'Kinfolk',
    name: 'Kinfolk',
    description: 'Minimal lifestyle magazine',
    previewColors: ['#fafaf9', '#78716c'],
    visualStyle: 'Minimal lifestyle magazine aesthetic, natural light, quiet moments, refined simplicity',
  },
  Mediterranean: {
    id: 'Mediterranean',
    name: 'Mediterranean',
    description: 'Sun-kissed warmth',
    previewColors: ['#fef9c3', '#1e40af'],
    visualStyle: 'Sun-kissed warmth, terracotta and blue, coastal European vibes, golden hour light',
  },
  'Sumi-e': {
    id: 'Sumi-e',
    name: 'Sumi-e',
    description: 'Ink wash painting',
    previewColors: ['#f5f5f4', '#1c1917'],
    visualStyle: 'Japanese ink wash aesthetic, monochrome gradients, minimalist nature, zen simplicity',
  },
  Monolith: {
    id: 'Monolith',
    name: 'Monolith',
    description: 'Single dramatic element',
    previewColors: ['#18181b', '#52525b'],
    visualStyle: 'Single dramatic element, stark simplicity, bold singular focus, powerful minimalism',
  },
  Herbarium: {
    id: 'Herbarium',
    name: 'Herbarium',
    description: 'Botanical specimen style',
    previewColors: ['#fef9c3', '#365314'],
    visualStyle: 'Botanical specimen style, pressed flower aesthetic, natural history documentation, scientific beauty',
  },
  Coastal: {
    id: 'Coastal',
    name: 'Coastal',
    description: 'Ocean-inspired serenity',
    previewColors: ['#f0f9ff', '#0369a1'],
    visualStyle: 'Ocean-inspired serenity, soft blues and whites, beach textures, peaceful seaside mood',
  },
  Atelier: {
    id: 'Atelier',
    name: 'Atelier',
    description: 'Artist studio aesthetic',
    previewColors: ['#fffbeb', '#78350f'],
    visualStyle: 'Artist studio aesthetic, creative workspace, natural materials, maker culture vibes',
  },

  // ===== Natural & Organic =====
  Terra: {
    id: 'Terra',
    name: 'Terra',
    description: 'Earthy clay tones',
    previewColors: ['#fef3c7', '#92400e'],
    visualStyle: 'Earthy clay tones, warm natural textures, organic materials, grounded earth palette',
  },
  Forest: {
    id: 'Forest',
    name: 'Forest',
    description: 'Woodland atmosphere',
    previewColors: ['#14532d', '#22c55e'],
    visualStyle: 'Woodland atmosphere, deep greens, dappled light, natural growth, forest floor textures',
  },
  Stone: {
    id: 'Stone',
    name: 'Stone',
    description: 'Mineral texture',
    previewColors: ['#78716c', '#d6d3d1'],
    visualStyle: 'Mineral textures, rock formations, geological patterns, natural stone surfaces',
  },
  Bloom: {
    id: 'Bloom',
    name: 'Bloom',
    description: 'Floral softness',
    previewColors: ['#fdf2f8', '#ec4899'],
    visualStyle: 'Floral softness, delicate petals, botanical beauty, soft pink and green palette',
  },
  Desert: {
    id: 'Desert',
    name: 'Desert',
    description: 'Arid warm tones',
    previewColors: ['#fef3c7', '#ea580c'],
    visualStyle: 'Arid warm landscapes, sand dunes, golden hour, burnt orange and terracotta',
  },
  Frost: {
    id: 'Frost',
    name: 'Frost',
    description: 'Icy cool palette',
    previewColors: ['#f0f9ff', '#0ea5e9'],
    visualStyle: 'Icy cool palette, winter crystals, frozen textures, crisp blue and white',
  },
  Ember: {
    id: 'Ember',
    name: 'Ember',
    description: 'Warm fire glow',
    previewColors: ['#450a0a', '#f97316'],
    visualStyle: 'Warm fire glow, campfire atmosphere, glowing coals, deep oranges and reds',
  },
  Mist: {
    id: 'Mist',
    name: 'Mist',
    description: 'Foggy atmospheric',
    previewColors: ['#f1f5f9', '#94a3b8'],
    visualStyle: 'Foggy atmospheric scenes, soft diffused light, mysterious layers, grey gradients',
  },
  Grain: {
    id: 'Grain',
    name: 'Grain',
    description: 'Textured natural',
    previewColors: ['#fefce8', '#a16207'],
    visualStyle: 'Natural textured surfaces, wood grain, organic patterns, warm earth tones',
  },
  Mineral: {
    id: 'Mineral',
    name: 'Mineral',
    description: 'Crystalline structure',
    previewColors: ['#1e1b4b', '#818cf8'],
    visualStyle: 'Crystalline structures, gemstone colors, geological beauty, deep purple and blue',
  },

  // ===== Cultural & Regional =====
  Tokyo: {
    id: 'Tokyo',
    name: 'Tokyo',
    description: 'Japanese urban density',
    previewColors: ['#18181b', '#f43f5e'],
    visualStyle: 'Japanese urban density, neon signage, street photography, organized chaos, modern meets traditional',
  },
  Seoul: {
    id: 'Seoul',
    name: 'Seoul',
    description: 'Korean pop minimalism',
    previewColors: ['#fafafa', '#ec4899'],
    visualStyle: 'Korean pop minimalism, clean K-design aesthetic, soft pastels with bold accents',
  },
  Paris: {
    id: 'Paris',
    name: 'Paris',
    description: 'French elegance',
    previewColors: ['#faf5ff', '#7c3aed'],
    visualStyle: 'French elegance, classical architecture, romantic atmosphere, sophisticated neutrals',
  },
  Milano: {
    id: 'Milano',
    name: 'Milano',
    description: 'Italian fashion forward',
    previewColors: ['#000000', '#d4af37'],
    visualStyle: 'Italian fashion forward, luxury aesthetic, bold design statements, black and gold',
  },
  Brooklyn: {
    id: 'Brooklyn',
    name: 'Brooklyn',
    description: 'NYC industrial hip',
    previewColors: ['#292524', '#f97316'],
    visualStyle: 'NYC industrial hip, exposed brick, artisanal craft, urban grit with warmth',
  },
  Nordic: {
    id: 'Nordic',
    name: 'Nordic',
    description: 'Scandinavian simplicity',
    previewColors: ['#f8fafc', '#64748b'],
    visualStyle: 'Scandinavian simplicity, natural materials, functional beauty, light-filled spaces',
  },
  Havana: {
    id: 'Havana',
    name: 'Havana',
    description: 'Cuban vintage vibrancy',
    previewColors: ['#fef9c3', '#15803d'],
    visualStyle: 'Cuban vintage vibrancy, classic cars, colorful architecture, tropical warmth',
  },
  Marrakech: {
    id: 'Marrakech',
    name: 'Marrakech',
    description: 'Moroccan patterns',
    previewColors: ['#fef3c7', '#b91c1c'],
    visualStyle: 'Moroccan patterns, rich spices colors, intricate tilework, warm marketplace vibes',
  },
  Kyoto: {
    id: 'Kyoto',
    name: 'Kyoto',
    description: 'Japanese traditional',
    previewColors: ['#fef7f0', '#78350f'],
    visualStyle: 'Japanese traditional beauty, temple gardens, zen aesthetic, ancient elegance',
  },
  Vienna: {
    id: 'Vienna',
    name: 'Vienna',
    description: 'Austrian classical',
    previewColors: ['#fffbeb', '#78350f'],
    visualStyle: 'Austrian classical grandeur, ornate architecture, cultural sophistication, warm cream tones',
  },

  // ===== Cinematic & Dramatic =====
  Cinematic: {
    id: 'Cinematic',
    name: 'Cinematic',
    description: 'Widescreen movie feel',
    previewColors: ['#0c0a09', '#78716c'],
    visualStyle: 'Widescreen movie compositions, dramatic lighting, film grain, storytelling frames',
  },
  Noir: {
    id: 'Noir',
    name: 'Noir',
    description: 'Dark detective drama',
    previewColors: ['#000000', '#525252'],
    visualStyle: 'Dark detective drama, high contrast shadows, mysterious atmosphere, black and white',
  },
  Schematic: {
    id: 'Schematic',
    name: 'Schematic',
    description: 'Technical blueprint',
    previewColors: ['#1e3a5f', '#60a5fa'],
    visualStyle: 'Technical blueprint aesthetic, engineering diagrams, precise linework, blue and white',
    // Note: Schematic has conditional contrast logic handled separately
  },
  Brutalist: {
    id: 'Brutalist',
    name: 'Brutalist',
    description: 'Raw concrete aesthetic',
    previewColors: ['#a8a29e', '#44403c'],
    visualStyle: 'Raw concrete aesthetic, architectural mass, stark shadows, industrial honesty',
  },
  Clay: {
    id: 'Clay',
    name: 'Clay',
    description: '3D claymorphism',
    previewColors: ['#fef3c7', '#f59e0b'],
    visualStyle: '3D claymorphism, soft shadows, rounded forms, playful dimensional shapes',
  },

  // ===== Cultural Heritage (from visualStyles, not in categories) =====
  Mughal: {
    id: 'Mughal',
    name: 'Mughal',
    description: 'Indian imperial grandeur',
    previewColors: ['#7c2d12', '#d4af37'],
    visualStyle: 'Indian imperial grandeur, intricate patterns, rich jewel tones, architectural detail',
  },
  Ankara: {
    id: 'Ankara',
    name: 'Ankara',
    description: 'African wax print patterns',
    previewColors: ['#f97316', '#16a34a'],
    visualStyle: 'African wax print patterns, bold geometric designs, vibrant cultural colors',
  },
  Talavera: {
    id: 'Talavera',
    name: 'Talavera',
    description: 'Mexican ceramic tile',
    previewColors: ['#1d4ed8', '#ffffff'],
    visualStyle: 'Mexican ceramic tile patterns, cobalt blue and white, folk art aesthetic',
  },
  Persian: {
    id: 'Persian',
    name: 'Persian',
    description: 'Iranian carpet patterns',
    previewColors: ['#7f1d1d', '#d4af37'],
    visualStyle: 'Iranian carpet patterns, intricate geometric designs, rich warm colors',
  },
  Batik: {
    id: 'Batik',
    name: 'Batik',
    description: 'Indonesian wax-resist',
    previewColors: ['#78350f', '#1e3a8a'],
    visualStyle: 'Indonesian wax-resist patterns, organic flowing designs, earth and indigo tones',
  },
  Celtic: {
    id: 'Celtic',
    name: 'Celtic',
    description: 'Irish/Scottish knotwork',
    previewColors: ['#14532d', '#d4af37'],
    visualStyle: 'Irish/Scottish knotwork, interlaced patterns, green and gold, ancient mysticism',
  },
  Aztec: {
    id: 'Aztec',
    name: 'Aztec',
    description: 'Mesoamerican geometric',
    previewColors: ['#78350f', '#14b8a6'],
    visualStyle: 'Mesoamerican geometric patterns, bold angular designs, earth and turquoise',
  },
  Aboriginal: {
    id: 'Aboriginal',
    name: 'Aboriginal',
    description: 'Australian dot painting',
    previewColors: ['#78350f', '#dc2626'],
    visualStyle: 'Australian dot painting aesthetic, dreamtime patterns, ochre earth tones',
  },

  // ===== Historical Period =====
  Victorian: {
    id: 'Victorian',
    name: 'Victorian',
    description: '19th century elegance',
    previewColors: ['#1c1917', '#7c3aed'],
    visualStyle: '19th century elegance, ornate details, rich dark colors, antique aesthetic',
  },
  Disco: {
    id: 'Disco',
    name: 'Disco',
    description: '70s dance floor glamour',
    previewColors: ['#a855f7', '#fbbf24'],
    visualStyle: '70s dance floor glamour, mirror balls, metallic shimmer, funky colors',
  },
  Grunge: {
    id: 'Grunge',
    name: 'Grunge',
    description: '90s alternative aesthetic',
    previewColors: ['#44403c', '#78716c'],
    visualStyle: '90s alternative aesthetic, distressed textures, raw unpolished look, muted tones',
  },
  Atomic: {
    id: 'Atomic',
    name: 'Atomic',
    description: '50s space age',
    previewColors: ['#14b8a6', '#f97316'],
    visualStyle: '50s space age, optimistic futurism, starbursts and boomerangs, retro sci-fi',
  },
  Nouveau: {
    id: 'Nouveau',
    name: 'Nouveau',
    description: 'Art nouveau organic curves',
    previewColors: ['#166534', '#d4af37'],
    visualStyle: 'Art nouveau organic curves, flowing natural forms, elegant ornamentation',
  },
  Tudor: {
    id: 'Tudor',
    name: 'Tudor',
    description: 'English medieval aesthetic',
    previewColors: ['#78350f', '#1c1917'],
    visualStyle: 'English medieval aesthetic, timber frames, heraldic elements, rich historical tones',
  },

  // ===== Artisanal Craft =====
  Indigo: {
    id: 'Indigo',
    name: 'Indigo',
    description: 'Japanese shibori dye',
    previewColors: ['#1e3a8a', '#dbeafe'],
    visualStyle: 'Japanese shibori dye aesthetic, deep blue variations, handcraft textures',
  },
  Copper: {
    id: 'Copper',
    name: 'Copper',
    description: 'Metalworking aesthetic',
    previewColors: ['#b45309', '#fdba74'],
    visualStyle: 'Metalworking aesthetic, warm copper tones, patina textures, artisan metal',
  },
  Raku: {
    id: 'Raku',
    name: 'Raku',
    description: 'Japanese pottery aesthetic',
    previewColors: ['#292524', '#d6d3d1'],
    visualStyle: 'Japanese pottery aesthetic, crackled glazes, earthy imperfection, fire marks',
  },
  Weave: {
    id: 'Weave',
    name: 'Weave',
    description: 'Textile craft patterns',
    previewColors: ['#fef3c7', '#78350f'],
    visualStyle: 'Textile craft patterns, woven textures, fabric grids, handmade warmth',
  },
  Ceramic: {
    id: 'Ceramic',
    name: 'Ceramic',
    description: 'Pottery studio aesthetic',
    previewColors: ['#fef3c7', '#a3a3a3'],
    visualStyle: 'Pottery studio aesthetic, glazed surfaces, clay textures, artisan craft',
  },
  Patina: {
    id: 'Patina',
    name: 'Patina',
    description: 'Aged metal surfaces',
    previewColors: ['#365314', '#a8a29e'],
    visualStyle: 'Aged metal surfaces, beautiful deterioration, time-worn beauty, oxidized colors',
  },

  // ===== Atmospheric/Mood =====
  Dusk: {
    id: 'Dusk',
    name: 'Dusk',
    description: 'Golden hour to blue hour',
    previewColors: ['#f97316', '#3b82f6'],
    visualStyle: 'Golden hour to blue hour, twilight atmosphere, warm to cool transition',
  },
  Monsoon: {
    id: 'Monsoon',
    name: 'Monsoon',
    description: 'Rainy season drama',
    previewColors: ['#475569', '#22c55e'],
    visualStyle: 'Rainy season drama, wet surfaces, moody overcast, fresh green tones',
  },
  Tundra: {
    id: 'Tundra',
    name: 'Tundra',
    description: 'Arctic landscape',
    previewColors: ['#e0f2fe', '#0369a1'],
    visualStyle: 'Arctic landscape, frozen expanses, cold blue whites, stark beauty',
  },
  Savanna: {
    id: 'Savanna',
    name: 'Savanna',
    description: 'African grassland golden hour',
    previewColors: ['#fbbf24', '#78350f'],
    visualStyle: 'African grassland golden hour, warm yellows, wildlife documentary aesthetic',
  },
  Volcano: {
    id: 'Volcano',
    name: 'Volcano',
    description: 'Molten dramatic energy',
    previewColors: ['#1c1917', '#f97316'],
    visualStyle: 'Molten dramatic energy, black rock and orange glow, powerful nature',
  },
  Reef: {
    id: 'Reef',
    name: 'Reef',
    description: 'Underwater coral aesthetic',
    previewColors: ['#0891b2', '#22d3ee'],
    visualStyle: 'Underwater coral aesthetic, aquatic colors, oceanic biodiversity, blue-green palette',
  },

  // ===== Typography & Print =====
  Blackletter: {
    id: 'Blackletter',
    name: 'Blackletter',
    description: 'Gothic typography aesthetic',
    previewColors: ['#1c1917', '#d4d4d8'],
    visualStyle: 'Gothic typography aesthetic, medieval manuscript style, dramatic letterforms',
  },
  Newsprint: {
    id: 'Newsprint',
    name: 'Newsprint',
    description: 'Newspaper printing aesthetic',
    previewColors: ['#fafafa', '#18181b'],
    visualStyle: 'Newspaper printing aesthetic, halftone dots, black and white journalism',
  },
  Letterpress: {
    id: 'Letterpress',
    name: 'Letterpress',
    description: 'Debossed printing aesthetic',
    previewColors: ['#fef3c7', '#78350f'],
    visualStyle: 'Debossed printing aesthetic, tactile impressions, craft printing heritage',
  },
  Stencil: {
    id: 'Stencil',
    name: 'Stencil',
    description: 'Spray paint street art',
    previewColors: ['#1c1917', '#ef4444'],
    visualStyle: 'Spray paint street art, cut-out letter forms, urban graphic style',
  },
  Woodtype: {
    id: 'Woodtype',
    name: 'Woodtype',
    description: 'Wood block printing',
    previewColors: ['#fef3c7', '#1c1917'],
    visualStyle: 'Wood block printing, vintage poster aesthetic, bold display type textures',
  },

  // ===== Contemporary Art =====
  Installation: {
    id: 'Installation',
    name: 'Installation',
    description: 'Gallery installation aesthetic',
    previewColors: ['#ffffff', '#a3a3a3'],
    visualStyle: 'Gallery installation aesthetic, conceptual space, white cube context',
  },
  Glitch: {
    id: 'Glitch',
    name: 'Glitch',
    description: 'Digital corruption aesthetic',
    previewColors: ['#000000', '#00ff00'],
    visualStyle: 'Digital corruption aesthetic, pixel errors, data moshing, VHS artifacts',
  },
  MixedMedia: {
    id: 'MixedMedia',
    name: 'MixedMedia',
    description: 'Combined materials aesthetic',
    previewColors: ['#fef3c7', '#78716c'],
    visualStyle: 'Combined materials aesthetic, layered techniques, experimental art',
  },
  Ink: {
    id: 'Ink',
    name: 'Ink',
    description: 'Liquid ink flows',
    previewColors: ['#000000', '#a3a3a3'],
    visualStyle: 'Liquid ink flows, organic spread patterns, black and white fluidity',
  },
  Oxidize: {
    id: 'Oxidize',
    name: 'Oxidize',
    description: 'Rust and corrosion aesthetic',
    previewColors: ['#b45309', '#44403c'],
    visualStyle: 'Rust and corrosion aesthetic, metal degradation, industrial decay beauty',
  },

  // ===== Future/Speculative =====
  Quantum: {
    id: 'Quantum',
    name: 'Quantum',
    description: 'Particle physics aesthetic',
    previewColors: ['#1e1b4b', '#818cf8'],
    visualStyle: 'Particle physics aesthetic, wave-particle duality, scientific visualization',
  },
  Biotech: {
    id: 'Biotech',
    name: 'Biotech',
    description: 'Organic technology fusion',
    previewColors: ['#14532d', '#22d3ee'],
    visualStyle: 'Organic technology fusion, bio-digital aesthetic, living machines',
  },
  Solarpunk: {
    id: 'Solarpunk',
    name: 'Solarpunk',
    description: 'Optimistic green future',
    previewColors: ['#22c55e', '#fbbf24'],
    visualStyle: 'Optimistic green future, sustainable technology, nature-tech harmony',
  },
  Void: {
    id: 'Void',
    name: 'Void',
    description: 'Deep space emptiness',
    previewColors: ['#000000', '#1e1b4b'],
    visualStyle: 'Deep space emptiness, cosmic black, minimal stellar points, infinite darkness',
  },
};

// =============================================================================
// CATEGORY DEFINITIONS
// =============================================================================

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

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get all archetype IDs as flat array
 */
export const getAllArchetypeIds = (): string[] => {
  return Object.keys(ARCHETYPE_REGISTRY);
};

/**
 * Find an archetype by ID
 */
export const findArchetype = (id: string): ArchetypeDefinition | undefined => {
  return ARCHETYPE_REGISTRY[id];
};

/**
 * Find category for an archetype
 */
export const findCategoryForArchetype = (
  archetypeId: string
): ArchetypeCategoryDefinition | undefined => {
  return ARCHETYPE_CATEGORY_DEFINITIONS.find((cat) =>
    cat.archetypes.includes(archetypeId)
  );
};

/**
 * Search archetypes by query
 */
export const searchArchetypes = (query: string): ArchetypeDefinition[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(ARCHETYPE_REGISTRY).filter(
    (a) =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get the visual style for an archetype
 */
export const getArchetypeVisualStyle = (archetypeId: string): string => {
  return (
    ARCHETYPE_REGISTRY[archetypeId]?.visualStyle ||
    'Professional photography with clean composition and modern aesthetic'
  );
};

/**
 * Get custom contrast for an archetype (if defined)
 */
export const getArchetypeCustomContrast = (
  archetypeId: string
): ContrastConfig | undefined => {
  return ARCHETYPE_REGISTRY[archetypeId]?.customContrast;
};

/**
 * Check if archetype has custom contrast
 */
export const hasCustomContrast = (archetypeId: string): boolean => {
  return !!ARCHETYPE_REGISTRY[archetypeId]?.customContrast;
};

/**
 * Check if two archetypes have significantly different visual styles
 */
export const areStylesDifferent = (
  archetype1: string,
  archetype2: string
): boolean => {
  return archetype1 !== archetype2;
};
