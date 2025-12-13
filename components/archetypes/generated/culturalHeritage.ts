/**
 * Generated Cultural Heritage Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  aboriginalConfig,
  ankaraConfig,
  aztecConfig,
  batikConfig,
  celticConfig,
  mughalConfig,
  persianConfig,
  talaveraConfig,
} from '../configs/culturalHeritageConfigs';

// Generate components from configs
export const AboriginalArchetype = createArchetype(aboriginalConfig);
export const AnkaraArchetype = createArchetype(ankaraConfig);
export const AztecArchetype = createArchetype(aztecConfig);
export const BatikArchetype = createArchetype(batikConfig);
export const CelticArchetype = createArchetype(celticConfig);
export const MughalArchetype = createArchetype(mughalConfig);
export const PersianArchetype = createArchetype(persianConfig);
export const TalaveraArchetype = createArchetype(talaveraConfig);
