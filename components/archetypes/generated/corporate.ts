/**
 * Generated Corporate Archetypes
 *
 * Components created from configs using the createArchetype factory.
 * This eliminates boilerplate while preserving full archetype functionality.
 */

import { createArchetype } from '../createArchetype';
import {
  beaconConfig,
  keynoteConfig,
  slideConfig,
  ventureConfig,
  gradientConfig,
  signalConfig,
  narrativeConfig,
  canvasConfig,
  deckConfig,
  metricConfig,
} from '../configs/corporateConfigs';

// Generate components from configs
export const BeaconArchetype = createArchetype(beaconConfig);
export const KeynoteArchetype = createArchetype(keynoteConfig);
export const SlideArchetype = createArchetype(slideConfig);
export const VentureArchetype = createArchetype(ventureConfig);
export const GradientArchetype = createArchetype(gradientConfig);
export const SignalArchetype = createArchetype(signalConfig);
export const NarrativeArchetype = createArchetype(narrativeConfig);
export const CanvasArchetype = createArchetype(canvasConfig);
export const DeckArchetype = createArchetype(deckConfig);
export const MetricArchetype = createArchetype(metricConfig);
