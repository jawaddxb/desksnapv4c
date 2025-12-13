/**
 * Generated Future Speculative Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  biotechConfig,
  quantumConfig,
  solarpunkConfig,
  voidConfig,
} from '../configs/futureSpeculativeConfigs';

// Generate components from configs
export const BiotechArchetype = createArchetype(biotechConfig);
export const QuantumArchetype = createArchetype(quantumConfig);
export const SolarpunkArchetype = createArchetype(solarpunkConfig);
export const VoidArchetype = createArchetype(voidConfig);
