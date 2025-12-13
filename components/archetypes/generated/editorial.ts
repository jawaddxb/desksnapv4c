/**
 * Generated Editorial Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  collageConfig,
  editorialConfig,
  receiptConfig,
  risographConfig,
  typographicConfig,
  zineConfig,
} from '../configs/editorialConfigs';

// Generate components from configs
export const CollageArchetype = createArchetype(collageConfig);
export const EditorialArchetype = createArchetype(editorialConfig);
export const ReceiptArchetype = createArchetype(receiptConfig);
export const RisographArchetype = createArchetype(risographConfig);
export const TypographicArchetype = createArchetype(typographicConfig);
export const ZineArchetype = createArchetype(zineConfig);
