/**
 * Generated Wabi-Sabi Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  atelierConfig,
  coastalConfig,
  herbariumConfig,
  hyggeConfig,
  kinfolkConfig,
  kintsugiConfig,
  mediterraneanConfig,
  monolithConfig,
  sumieConfig,
  terrazzoConfig,
} from '../configs/wabiSabiConfigs';

// Generate components from configs
export const AtelierArchetype = createArchetype(atelierConfig);
export const CoastalArchetype = createArchetype(coastalConfig);
export const HerbariumArchetype = createArchetype(herbariumConfig);
export const HyggeArchetype = createArchetype(hyggeConfig);
export const KinfolkArchetype = createArchetype(kinfolkConfig);
export const KintsugiArchetype = createArchetype(kintsugiConfig);
export const MediterraneanArchetype = createArchetype(mediterraneanConfig);
export const MonolithArchetype = createArchetype(monolithConfig);
export const SumieArchetype = createArchetype(sumieConfig);
export const TerrazzoArchetype = createArchetype(terrazzoConfig);
