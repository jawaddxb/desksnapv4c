/**
 * Generated Tech Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  auroraConfig,
  bentoConfig,
  circuitConfig,
  cyberDeckConfig,
  glassConfig,
  hologramConfig,
  liquidConfig,
  meshConfig,
  neonConfig,
  pulseConfig,
  terminalConfig,
  vaporwaveConfig,
  y2kConfig,
} from '../configs/techConfigs';

// Generate components from configs
export const AuroraArchetype = createArchetype(auroraConfig);
export const BentoArchetype = createArchetype(bentoConfig);
export const CircuitArchetype = createArchetype(circuitConfig);
export const CyberDeckArchetype = createArchetype(cyberDeckConfig);
export const GlassArchetype = createArchetype(glassConfig);
export const HologramArchetype = createArchetype(hologramConfig);
export const LiquidArchetype = createArchetype(liquidConfig);
export const MeshArchetype = createArchetype(meshConfig);
export const NeonArchetype = createArchetype(neonConfig);
export const PulseArchetype = createArchetype(pulseConfig);
export const TerminalArchetype = createArchetype(terminalConfig);
export const VaporwaveArchetype = createArchetype(vaporwaveConfig);
export const Y2KArchetype = createArchetype(y2kConfig);
