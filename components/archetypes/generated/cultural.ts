/**
 * Generated Cultural Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  brooklynConfig,
  havanaConfig,
  kyotoConfig,
  marrakechConfig,
  milanoConfig,
  nordicConfig,
  parisConfig,
  seoulConfig,
  tokyoConfig,
  viennaConfig,
} from '../configs/culturalConfigs';

// Generate components from configs
export const BrooklynArchetype = createArchetype(brooklynConfig);
export const HavanaArchetype = createArchetype(havanaConfig);
export const KyotoArchetype = createArchetype(kyotoConfig);
export const MarrakechArchetype = createArchetype(marrakechConfig);
export const MilanoArchetype = createArchetype(milanoConfig);
export const NordicArchetype = createArchetype(nordicConfig);
export const ParisArchetype = createArchetype(parisConfig);
export const SeoulArchetype = createArchetype(seoulConfig);
export const TokyoArchetype = createArchetype(tokyoConfig);
export const ViennaArchetype = createArchetype(viennaConfig);
