/**
 * Generated Historical Period Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  victorianConfig,
  discoConfig,
  grungeConfig,
  atomicConfig,
  nouveauConfig,
  tudorConfig,
} from '../configs/historicalPeriodConfigs';

// Generate components from configs
export const VictorianArchetype = createArchetype(victorianConfig);
export const DiscoArchetype = createArchetype(discoConfig);
export const GrungeArchetype = createArchetype(grungeConfig);
export const AtomicArchetype = createArchetype(atomicConfig);
export const NouveauArchetype = createArchetype(nouveauConfig);
export const TudorArchetype = createArchetype(tudorConfig);
