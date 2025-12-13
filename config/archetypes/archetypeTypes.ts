/**
 * Archetype Type Definitions
 *
 * Type definitions for the archetype system.
 */

import type { ContrastConfig } from '../../lib/contrast';

/**
 * Definition of a single archetype with its visual properties
 */
export interface ArchetypeDefinition {
  id: string;
  name: string;
  description: string;
  previewColors: [string, string];
  visualStyle: string;
  /** Custom contrast override (most use theme defaults) */
  customContrast?: ContrastConfig;
}

/**
 * Definition of an archetype category (grouping)
 */
export interface ArchetypeCategoryDefinition {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  archetypes: string[]; // References to archetype IDs
}
