/**
 * Archetype Registry
 *
 * BACKWARD COMPATIBILITY LAYER
 *
 * This file re-exports from the archetypes module for backward compatibility.
 * For new code, import directly from 'config/archetypes' instead.
 *
 * The archetype system is now split into focused files:
 * - archetypes/archetypeTypes.ts - Type definitions
 * - archetypes/archetypeData.ts - ARCHETYPE_REGISTRY data
 * - archetypes/archetypeCategories.ts - Category definitions
 * - archetypes/archetypeUtils.ts - Utility functions
 */

// Re-export everything from the archetypes module
export {
  // Types
  type ArchetypeDefinition,
  type ArchetypeCategoryDefinition,
  // Data
  ARCHETYPE_REGISTRY,
  // Categories
  ARCHETYPE_CATEGORY_DEFINITIONS,
  // Utilities
  getAllArchetypeIds,
  findArchetype,
  findCategoryForArchetype,
  searchArchetypes,
  getArchetypeVisualStyle,
  getArchetypeCustomContrast,
  hasCustomContrast,
  areStylesDifferent,
} from './archetypes';
