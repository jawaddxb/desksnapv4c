/**
 * Generated Natural Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  bloomConfig,
  desertConfig,
  emberConfig,
  forestConfig,
  frostConfig,
  grainConfig,
  mineralConfig,
  mistConfig,
  stoneConfig,
  terraConfig,
} from '../configs/naturalConfigs';

// Generate components from configs
export const BloomArchetype = createArchetype(bloomConfig);
export const DesertArchetype = createArchetype(desertConfig);
export const EmberArchetype = createArchetype(emberConfig);
export const ForestArchetype = createArchetype(forestConfig);
export const FrostArchetype = createArchetype(frostConfig);
export const GrainArchetype = createArchetype(grainConfig);
export const MineralArchetype = createArchetype(mineralConfig);
export const MistArchetype = createArchetype(mistConfig);
export const StoneArchetype = createArchetype(stoneConfig);
export const TerraArchetype = createArchetype(terraConfig);
