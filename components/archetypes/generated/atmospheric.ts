/**
 * Generated Atmospheric Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  duskConfig,
  monsoonConfig,
  reefConfig,
  savannaConfig,
  tundraConfig,
  volcanoConfig,
} from '../configs/atmosphericConfigs';

// Generate components from configs
export const DuskArchetype = createArchetype(duskConfig);
export const MonsoonArchetype = createArchetype(monsoonConfig);
export const ReefArchetype = createArchetype(reefConfig);
export const SavannaArchetype = createArchetype(savannaConfig);
export const TundraArchetype = createArchetype(tundraConfig);
export const VolcanoArchetype = createArchetype(volcanoConfig);
