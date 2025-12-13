/**
 * Generated Typography-Print Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  blackletterConfig,
  letterpressConfig,
  newsprintConfig,
  stencilConfig,
  woodtypeConfig,
} from '../configs/typographyPrintConfigs';

// Generate components from configs
export const BlackletterArchetype = createArchetype(blackletterConfig);
export const LetterpressArchetype = createArchetype(letterpressConfig);
export const NewsprintArchetype = createArchetype(newsprintConfig);
export const StencilArchetype = createArchetype(stencilConfig);
export const WoodtypeArchetype = createArchetype(woodtypeConfig);
