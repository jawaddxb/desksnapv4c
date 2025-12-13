/**
 * Generated Contemporary Art Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  glitchConfig,
  inkConfig,
  installationConfig,
  mixedMediaConfig,
  oxidizeConfig,
} from '../configs/contemporaryArtConfigs';

// Generate components from configs
export const GlitchArchetype = createArchetype(glitchConfig);
export const InkArchetype = createArchetype(inkConfig);
export const InstallationArchetype = createArchetype(installationConfig);
export const MixedMediaArchetype = createArchetype(mixedMediaConfig);
export const OxidizeArchetype = createArchetype(oxidizeConfig);
