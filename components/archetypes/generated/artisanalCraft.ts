/**
 * Generated Artisanal Craft Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  ceramicConfig,
  copperConfig,
  indigoConfig,
  patinaConfig,
  rakuConfig,
  weaveConfig,
} from '../configs/artisanalCraftConfigs';

// Generate components from configs
export const CeramicArchetype = createArchetype(ceramicConfig);
export const CopperArchetype = createArchetype(copperConfig);
export const IndigoArchetype = createArchetype(indigoConfig);
export const PatinaArchetype = createArchetype(patinaConfig);
export const RakuArchetype = createArchetype(rakuConfig);
export const WeaveArchetype = createArchetype(weaveConfig);
