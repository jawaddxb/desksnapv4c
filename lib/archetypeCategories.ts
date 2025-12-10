// Archetype Categories for Organic Mode
// Organizes 70 archetypes into 8 logical groups for better navigation

export interface ArchetypeInfo {
  id: string;
  name: string;
  description: string;
  previewColors: [string, string]; // Gradient colors for preview
}

export interface ArchetypeCategory {
  id: string;
  name: string;
  shortName: string; // For tab labels
  icon: string;
  description: string;
  archetypes: ArchetypeInfo[];
}

export const ARCHETYPE_CATEGORIES: ArchetypeCategory[] = [
  {
    id: 'editorial',
    name: 'Editorial & Print',
    shortName: 'Editorial',
    icon: 'Newspaper',
    description: 'Magazine and publication inspired layouts',
    archetypes: [
      { id: 'Editorial', name: 'Editorial', description: 'Magazine cover aesthetic', previewColors: ['#18181b', '#3f3f46'] },
      { id: 'Typographic', name: 'Typographic', description: 'Type-focused dramatic layouts', previewColors: ['#000000', '#404040'] },
      { id: 'Zine', name: 'Zine', description: 'DIY publication style', previewColors: ['#fef3c7', '#f59e0b'] },
      { id: 'Collage', name: 'Collage', description: 'Mixed media cut-out aesthetic', previewColors: ['#fecaca', '#ef4444'] },
      { id: 'Risograph', name: 'Risograph', description: 'Grainy print texture', previewColors: ['#c4b5fd', '#8b5cf6'] },
      { id: 'Receipt', name: 'Receipt', description: 'Thermal print inspired', previewColors: ['#fafafa', '#d4d4d4'] },
    ]
  },
  {
    id: 'design-movements',
    name: 'Design Movements',
    shortName: 'Design',
    icon: 'Palette',
    description: 'Historical and contemporary design styles',
    archetypes: [
      { id: 'Constructivist', name: 'Constructivist', description: 'Russian avant-garde', previewColors: ['#dc2626', '#000000'] },
      { id: 'Bauhaus', name: 'Bauhaus', description: 'German modernist school', previewColors: ['#fbbf24', '#dc2626'] },
      { id: 'Swiss', name: 'Swiss', description: 'International typographic style', previewColors: ['#ffffff', '#000000'] },
      { id: 'SwissGrid', name: 'Swiss Grid', description: 'Grid-based Swiss design', previewColors: ['#f5f5f5', '#171717'] },
      { id: 'PostModern', name: 'Post Modern', description: 'Deconstructed aesthetics', previewColors: ['#ec4899', '#8b5cf6'] },
      { id: 'Memphis', name: 'Memphis', description: '80s Italian design group', previewColors: ['#22d3ee', '#f472b6'] },
      { id: 'Deco', name: 'Art Deco', description: '1920s geometric elegance', previewColors: ['#d4af37', '#1a1a2e'] },
      { id: 'Retro', name: 'Retro', description: 'Vintage throwback style', previewColors: ['#f97316', '#854d0e'] },
      { id: 'Neue', name: 'Neue', description: 'Contemporary minimal', previewColors: ['#fafafa', '#525252'] },
      { id: 'Pop', name: 'Pop Art', description: 'Warhol-inspired boldness', previewColors: ['#facc15', '#ef4444'] },
      { id: 'Mod', name: 'Mod', description: '60s British design', previewColors: ['#000000', '#ffffff'] },
      { id: 'Gothic', name: 'Gothic', description: 'Dark romantic style', previewColors: ['#1f1f1f', '#7c3aed'] },
      { id: 'Rococo', name: 'Rococo', description: 'Ornate classical', previewColors: ['#fdf4ff', '#d946ef'] },
      { id: 'Stark', name: 'Stark', description: 'High contrast minimal', previewColors: ['#ffffff', '#000000'] },
    ]
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    shortName: 'Tech',
    icon: 'Cpu',
    description: 'Contemporary digital aesthetics',
    archetypes: [
      { id: 'Bento', name: 'Bento', description: 'Apple-style grid boxes', previewColors: ['#f5f5f7', '#1d1d1f'] },
      { id: 'Glass', name: 'Glass', description: 'Glassmorphism effects', previewColors: ['rgba(255,255,255,0.2)', '#6366f1'] },
      { id: 'Liquid', name: 'Liquid', description: 'Fluid organic shapes', previewColors: ['#818cf8', '#c084fc'] },
      { id: 'Terminal', name: 'Terminal', description: 'CLI/hacker aesthetic', previewColors: ['#022c22', '#10b981'] },
      { id: 'Neon', name: 'Neon', description: 'Glowing cyberpunk', previewColors: ['#0f0f23', '#00ff88'] },
      { id: 'Aurora', name: 'Aurora', description: 'Gradient light effects', previewColors: ['#6366f1', '#22d3ee'] },
      { id: 'Mesh', name: 'Mesh', description: 'Gradient mesh backgrounds', previewColors: ['#f472b6', '#818cf8'] },
      { id: 'Pulse', name: 'Pulse', description: 'Animated energy feel', previewColors: ['#7c3aed', '#06b6d4'] },
      { id: 'Circuit', name: 'Circuit', description: 'PCB-inspired patterns', previewColors: ['#064e3b', '#34d399'] },
      { id: 'Hologram', name: 'Hologram', description: 'Iridescent futurism', previewColors: ['#c084fc', '#22d3ee'] },
      { id: 'CyberDeck', name: 'CyberDeck', description: 'Cyberpunk terminal', previewColors: ['#18181b', '#22d3ee'] },
      { id: 'Y2K', name: 'Y2K', description: 'Year 2000 digital nostalgia', previewColors: ['#c0c0c0', '#0000ff'] },
      { id: 'Vaporwave', name: 'Vaporwave', description: 'Retro-futuristic pastels', previewColors: ['#ff6ad5', '#7ee8fa'] },
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate & Pitch',
    shortName: 'Corporate',
    icon: 'Briefcase',
    description: 'Professional presentation styles',
    archetypes: [
      { id: 'Venture', name: 'Venture', description: 'VC pitch deck style', previewColors: ['#ffffff', '#3b82f6'] },
      { id: 'Keynote', name: 'Keynote', description: 'Apple keynote inspired', previewColors: ['#000000', '#ffffff'] },
      { id: 'Gradient', name: 'Gradient', description: 'Modern gradient headers', previewColors: ['#6366f1', '#a855f7'] },
      { id: 'Signal', name: 'Signal', description: 'Data-focused clarity', previewColors: ['#f8fafc', '#0ea5e9'] },
      { id: 'Metric', name: 'Metric', description: 'Numbers-forward layout', previewColors: ['#f1f5f9', '#475569'] },
      { id: 'Narrative', name: 'Narrative', description: 'Story-driven structure', previewColors: ['#fffbeb', '#d97706'] },
      { id: 'Beacon', name: 'Beacon', description: 'Guiding focal points', previewColors: ['#fafafa', '#f59e0b'] },
      { id: 'Slide', name: 'Slide', description: 'Classic clean presentation', previewColors: ['#ffffff', '#64748b'] },
      { id: 'Canvas', name: 'Canvas', description: 'Whitespace-heavy minimal', previewColors: ['#fafafa', '#a1a1aa'] },
      { id: 'Deck', name: 'Deck', description: 'Balanced professional', previewColors: ['#f4f4f5', '#3f3f46'] },
    ]
  },
  {
    id: 'wabi-sabi',
    name: 'Wabi Sabi',
    shortName: 'Wabi Sabi',
    icon: 'Leaf',
    description: 'Japanese aesthetic of imperfection',
    archetypes: [
      { id: 'Kintsugi', name: 'Kintsugi', description: 'Golden repair aesthetic', previewColors: ['#292524', '#d4af37'] },
      { id: 'Hygge', name: 'Hygge', description: 'Danish cozy comfort', previewColors: ['#fef3c7', '#92400e'] },
      { id: 'Terrazzo', name: 'Terrazzo', description: 'Stone chip patterns', previewColors: ['#fdf2f8', '#9ca3af'] },
      { id: 'Kinfolk', name: 'Kinfolk', description: 'Minimal lifestyle magazine', previewColors: ['#fafaf9', '#78716c'] },
      { id: 'Mediterranean', name: 'Mediterranean', description: 'Sun-kissed warmth', previewColors: ['#fef9c3', '#1e40af'] },
      { id: 'Sumi-e', name: 'Sumi-e', description: 'Ink wash painting', previewColors: ['#f5f5f4', '#1c1917'] },
      { id: 'Monolith', name: 'Monolith', description: 'Single dramatic element', previewColors: ['#18181b', '#52525b'] },
      { id: 'Herbarium', name: 'Herbarium', description: 'Botanical specimen style', previewColors: ['#fef9c3', '#365314'] },
      { id: 'Coastal', name: 'Coastal', description: 'Ocean-inspired serenity', previewColors: ['#f0f9ff', '#0369a1'] },
      { id: 'Atelier', name: 'Atelier', description: 'Artist studio aesthetic', previewColors: ['#fffbeb', '#78350f'] },
    ]
  },
  {
    id: 'natural',
    name: 'Natural & Organic',
    shortName: 'Natural',
    icon: 'TreeDeciduous',
    description: 'Earth-inspired textures and tones',
    archetypes: [
      { id: 'Terra', name: 'Terra', description: 'Earthy clay tones', previewColors: ['#fef3c7', '#92400e'] },
      { id: 'Forest', name: 'Forest', description: 'Woodland atmosphere', previewColors: ['#14532d', '#22c55e'] },
      { id: 'Stone', name: 'Stone', description: 'Mineral texture', previewColors: ['#78716c', '#d6d3d1'] },
      { id: 'Bloom', name: 'Bloom', description: 'Floral softness', previewColors: ['#fdf2f8', '#ec4899'] },
      { id: 'Desert', name: 'Desert', description: 'Arid warm tones', previewColors: ['#fef3c7', '#ea580c'] },
      { id: 'Frost', name: 'Frost', description: 'Icy cool palette', previewColors: ['#f0f9ff', '#0ea5e9'] },
      { id: 'Ember', name: 'Ember', description: 'Warm fire glow', previewColors: ['#450a0a', '#f97316'] },
      { id: 'Mist', name: 'Mist', description: 'Foggy atmospheric', previewColors: ['#f1f5f9', '#94a3b8'] },
      { id: 'Grain', name: 'Grain', description: 'Textured natural', previewColors: ['#fefce8', '#a16207'] },
      { id: 'Mineral', name: 'Mineral', description: 'Crystalline structure', previewColors: ['#1e1b4b', '#818cf8'] },
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural & Regional',
    shortName: 'Cultural',
    icon: 'Globe',
    description: 'City and culture-inspired aesthetics',
    archetypes: [
      { id: 'Tokyo', name: 'Tokyo', description: 'Japanese urban density', previewColors: ['#18181b', '#f43f5e'] },
      { id: 'Seoul', name: 'Seoul', description: 'Korean pop minimalism', previewColors: ['#fafafa', '#ec4899'] },
      { id: 'Paris', name: 'Paris', description: 'French elegance', previewColors: ['#faf5ff', '#7c3aed'] },
      { id: 'Milano', name: 'Milano', description: 'Italian fashion forward', previewColors: ['#000000', '#d4af37'] },
      { id: 'Brooklyn', name: 'Brooklyn', description: 'NYC industrial hip', previewColors: ['#292524', '#f97316'] },
      { id: 'Nordic', name: 'Nordic', description: 'Scandinavian simplicity', previewColors: ['#f8fafc', '#64748b'] },
      { id: 'Havana', name: 'Havana', description: 'Cuban vintage vibrancy', previewColors: ['#fef9c3', '#15803d'] },
      { id: 'Marrakech', name: 'Marrakech', description: 'Moroccan patterns', previewColors: ['#fef3c7', '#b91c1c'] },
      { id: 'Kyoto', name: 'Kyoto', description: 'Japanese traditional', previewColors: ['#fef7f0', '#78350f'] },
      { id: 'Vienna', name: 'Vienna', description: 'Austrian classical', previewColors: ['#fffbeb', '#78350f'] },
    ]
  },
  {
    id: 'cinematic',
    name: 'Cinematic & Dramatic',
    shortName: 'Cinematic',
    icon: 'Film',
    description: 'Movie and theatrical aesthetics',
    archetypes: [
      { id: 'Cinematic', name: 'Cinematic', description: 'Widescreen movie feel', previewColors: ['#0c0a09', '#78716c'] },
      { id: 'Noir', name: 'Noir', description: 'Dark detective drama', previewColors: ['#000000', '#525252'] },
      { id: 'Schematic', name: 'Schematic', description: 'Technical blueprint', previewColors: ['#1e3a5f', '#60a5fa'] },
      { id: 'Brutalist', name: 'Brutalist', description: 'Raw concrete aesthetic', previewColors: ['#a8a29e', '#44403c'] },
      { id: 'Clay', name: 'Clay', description: '3D claymorphism', previewColors: ['#fef3c7', '#f59e0b'] },
    ]
  },
];

// Get all archetype IDs as flat array
export const getAllArchetypeIds = (): string[] => {
  return ARCHETYPE_CATEGORIES.flatMap(cat => cat.archetypes.map(a => a.id));
};

// Find an archetype by ID
export const findArchetype = (id: string): ArchetypeInfo | undefined => {
  for (const category of ARCHETYPE_CATEGORIES) {
    const found = category.archetypes.find(a => a.id === id);
    if (found) return found;
  }
  return undefined;
};

// Find category for an archetype
export const findCategoryForArchetype = (archetypeId: string): ArchetypeCategory | undefined => {
  return ARCHETYPE_CATEGORIES.find(cat =>
    cat.archetypes.some(a => a.id === archetypeId)
  );
};

// Search archetypes by query
export const searchArchetypes = (query: string): ArchetypeInfo[] => {
  const lowerQuery = query.toLowerCase();
  return ARCHETYPE_CATEGORIES.flatMap(cat =>
    cat.archetypes.filter(a =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery)
    )
  );
};
