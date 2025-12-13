/**
 * Archetype Decoration Configurations
 *
 * Data-driven decoration configs for archetype cards.
 * Replaces the 90-line switch statement in ArchetypeCard.tsx.
 */

export type DecorationType =
  | 'circle'
  | 'border'
  | 'grid'
  | 'terminal'
  | 'gradient'
  | 'gold-line'
  | 'cinema-bars'
  | 'dots'
  | 'circuit-svg'
  | 'schematic-svg';

export interface DecorationConfig {
  type: DecorationType;
  position?: 'bottom-right' | 'inset' | 'bottom-left' | 'bottom' | 'top-right' | 'top-bottom';
  opacity?: number;
  /** For gold-line type */
  color?: string;
  /** For dots type */
  dotColors?: string[];
}

/**
 * Maps archetype IDs to their decoration configurations.
 * Archetypes not in this map will render no decoration (default case).
 */
export const ARCHETYPE_DECORATIONS: Record<string, DecorationConfig> = {
  // Design movements - circles
  Bauhaus: { type: 'circle', position: 'bottom-right', opacity: 0.6 },
  Constructivist: { type: 'circle', position: 'bottom-right', opacity: 0.6 },

  // Swiss style - borders
  Swiss: { type: 'border', position: 'inset', opacity: 0.2 },
  SwissGrid: { type: 'border', position: 'inset', opacity: 0.2 },
  Neue: { type: 'border', position: 'inset', opacity: 0.2 },

  // Bento - grid
  Bento: { type: 'grid', position: 'bottom-right', opacity: 0.4 },

  // Tech - terminal
  Terminal: { type: 'terminal', position: 'bottom-left', opacity: 0.6 },
  CyberDeck: { type: 'terminal', position: 'bottom-left', opacity: 0.6 },

  // Neon/glow - gradient
  Neon: { type: 'gradient', position: 'bottom', opacity: 0.5 },
  Aurora: { type: 'gradient', position: 'bottom', opacity: 0.5 },
  Hologram: { type: 'gradient', position: 'bottom', opacity: 0.5 },

  // Japanese - gold line
  Kintsugi: { type: 'gold-line', position: 'bottom-right', color: '#d4af37', opacity: 0.8 },

  // Cinematic - bars
  Cinematic: { type: 'cinema-bars', position: 'top-bottom', opacity: 0.8 },
  Noir: { type: 'cinema-bars', position: 'top-bottom', opacity: 0.8 },

  // Memphis/Pop - colored dots
  Memphis: { type: 'dots', position: 'top-right', dotColors: ['#facc15', '#f472b6', '#22d3ee'] },
  Pop: { type: 'dots', position: 'top-right', dotColors: ['#facc15', '#f472b6', '#22d3ee'] },

  // Tech diagrams - SVG
  Circuit: { type: 'circuit-svg', position: 'bottom-right', opacity: 0.4 },
  Schematic: { type: 'schematic-svg', position: 'bottom-right', opacity: 0.4 },
};

/**
 * Get decoration config for an archetype.
 * Returns undefined for archetypes without decorations.
 */
export const getDecorationConfig = (archetypeId: string): DecorationConfig | undefined => {
  return ARCHETYPE_DECORATIONS[archetypeId];
};
