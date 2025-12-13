/**
 * Archetypes Module
 *
 * Exports all archetype-related types, data, categories, and utilities.
 */

// Types
export type { ArchetypeDefinition, ArchetypeCategoryDefinition } from './archetypeTypes';

// Data
export { ARCHETYPE_REGISTRY } from './archetypeData';

// Categories
export { ARCHETYPE_CATEGORY_DEFINITIONS } from './archetypeCategories';

// Utilities
export {
  getAllArchetypeIds,
  findArchetype,
  findCategoryForArchetype,
  searchArchetypes,
  getArchetypeVisualStyle,
  getArchetypeCustomContrast,
  hasCustomContrast,
  areStylesDifferent,
} from './archetypeUtils';
