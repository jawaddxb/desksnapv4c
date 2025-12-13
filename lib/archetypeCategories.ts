/**
 * Archetype Categories
 *
 * DERIVED from config/archetypeRegistry.ts (single source of truth)
 * This file provides backward-compatible exports for existing consumers.
 */

import {
  ARCHETYPE_REGISTRY,
  ARCHETYPE_CATEGORY_DEFINITIONS,
  getAllArchetypeIds as _getAllArchetypeIds,
  findArchetype as _findArchetype,
  findCategoryForArchetype as _findCategoryForArchetype,
  searchArchetypes as _searchArchetypes,
  type ArchetypeDefinition,
  type ArchetypeCategoryDefinition,
} from '../config/archetypeRegistry';

// =============================================================================
// RE-EXPORTED TYPES (backward compatible)
// =============================================================================

export interface ArchetypeInfo {
  id: string;
  name: string;
  description: string;
  previewColors: [string, string];
}

export interface ArchetypeCategory {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  archetypes: ArchetypeInfo[];
}

// =============================================================================
// DERIVED DATA (from registry)
// =============================================================================

/**
 * Convert registry definition to ArchetypeInfo
 */
const toArchetypeInfo = (def: ArchetypeDefinition): ArchetypeInfo => ({
  id: def.id,
  name: def.name,
  description: def.description,
  previewColors: def.previewColors,
});

/**
 * Convert category definition to ArchetypeCategory with populated archetypes
 */
const toArchetypeCategory = (
  catDef: ArchetypeCategoryDefinition
): ArchetypeCategory => ({
  id: catDef.id,
  name: catDef.name,
  shortName: catDef.shortName,
  icon: catDef.icon,
  description: catDef.description,
  archetypes: catDef.archetypes
    .map((id) => ARCHETYPE_REGISTRY[id])
    .filter((a): a is ArchetypeDefinition => !!a)
    .map(toArchetypeInfo),
});

/**
 * Archetype categories with populated archetype info
 * Derived from ARCHETYPE_CATEGORY_DEFINITIONS
 */
export const ARCHETYPE_CATEGORIES: ArchetypeCategory[] =
  ARCHETYPE_CATEGORY_DEFINITIONS.map(toArchetypeCategory);

// =============================================================================
// UTILITY FUNCTIONS (delegated to registry)
// =============================================================================

/**
 * Get all archetype IDs as flat array
 */
export const getAllArchetypeIds = (): string[] => _getAllArchetypeIds();

/**
 * Find an archetype by ID
 */
export const findArchetype = (id: string): ArchetypeInfo | undefined => {
  const def = _findArchetype(id);
  return def ? toArchetypeInfo(def) : undefined;
};

/**
 * Find category for an archetype
 */
export const findCategoryForArchetype = (
  archetypeId: string
): ArchetypeCategory | undefined => {
  const catDef = _findCategoryForArchetype(archetypeId);
  return catDef ? toArchetypeCategory(catDef) : undefined;
};

/**
 * Search archetypes by query
 */
export const searchArchetypes = (query: string): ArchetypeInfo[] => {
  return _searchArchetypes(query).map(toArchetypeInfo);
};
