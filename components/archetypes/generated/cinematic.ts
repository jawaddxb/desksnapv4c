/**
 * Generated Cinematic Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  cinematicConfig,
  noirConfig,
  schematicConfig,
  brutalistConfig,
  clayConfig,
} from '../configs/cinematicConfigs';

// Generate components from configs
export const CinematicArchetype = createArchetype(cinematicConfig);
export const NoirArchetype = createArchetype(noirConfig);
export const SchematicArchetype = createArchetype(schematicConfig);
export const BrutalistArchetype = createArchetype(brutalistConfig);
export const ClayArchetype = createArchetype(clayConfig);
