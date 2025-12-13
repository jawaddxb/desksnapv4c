/**
 * Archetype Utility Functions
 *
 * Helpers for searching, filtering, and accessing archetypes.
 */

import type { ContrastConfig } from '@/lib/contrast';
import type { ArchetypeDefinition, ArchetypeCategoryDefinition } from './archetypeTypes';
import { ARCHETYPE_REGISTRY } from './archetypeData';
import { ARCHETYPE_CATEGORY_DEFINITIONS } from './archetypeCategories';

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
