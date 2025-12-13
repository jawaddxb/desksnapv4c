/**
 * Generated Design Movements Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  bauhausConfig,
  constructivistConfig,
  decoConfig,
  gothicConfig,
  memphisConfig,
  modConfig,
  neueConfig,
  popConfig,
  postModernConfig,
  retroConfig,
  rococoConfig,
  starkConfig,
  swissConfig,
  swissGridConfig,
} from '../configs/designMovementsConfigs';

// Generate components from configs
export const BauhausArchetype = createArchetype(bauhausConfig);
export const ConstructivistArchetype = createArchetype(constructivistConfig);
export const DecoArchetype = createArchetype(decoConfig);
export const GothicArchetype = createArchetype(gothicConfig);
export const MemphisArchetype = createArchetype(memphisConfig);
export const ModArchetype = createArchetype(modConfig);
export const NeueArchetype = createArchetype(neueConfig);
export const PopArchetype = createArchetype(popConfig);
export const PostModernArchetype = createArchetype(postModernConfig);
export const RetroArchetype = createArchetype(retroConfig);
export const RococoArchetype = createArchetype(rococoConfig);
export const StarkArchetype = createArchetype(starkConfig);
export const SwissArchetype = createArchetype(swissConfig);
export const SwissGridArchetype = createArchetype(swissGridConfig);
