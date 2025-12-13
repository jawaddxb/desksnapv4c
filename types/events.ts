/**
 * Event Types for Hook Communication
 *
 * Defines a unified event pattern to replace multiple callbacks.
 * This reduces prop drilling and makes event handling more consistent.
 */

import { AgentLog } from './agents';

// ============================================
// Image Generation Events
// ============================================

/**
 * Events emitted during image generation.
 * Replaces multiple callbacks with a single onEvent handler.
 */
export type ImageGenerationEvent =
  | { type: 'agent_start'; totalSlides: number; slideInfo?: Array<{ index: number; title: string }> }
  | { type: 'agent_activity'; log: AgentLog }
  | { type: 'agent_logs'; logs: AgentLog[] }
  | { type: 'agent_complete' }
  | { type: 'image_generated'; slideIndex: number; imageUrl: string }
  | { type: 'image_error'; slideIndex: number; error: string }
  | { type: 'batch_start'; slideCount: number }
  | { type: 'batch_progress'; completed: number; total: number }
  | { type: 'batch_complete' };

/**
 * Unified event handler type for image generation.
 */
export type ImageGenerationEventHandler = (event: ImageGenerationEvent) => void;

/**
 * Helper to create a dispatcher that calls multiple callbacks from a single event.
 * Useful for backward compatibility during migration.
 */
export function createImageGenerationEventDispatcher(callbacks: {
  onAgentLogs?: (logs: AgentLog[]) => void;
  onAgentActivity?: (log: AgentLog) => void;
  onAgentStart?: (totalSlides: number, slideInfo?: Array<{ index: number; title: string }>) => void;
  onAgentComplete?: () => void;
  onImageGenerated?: (slideIndex: number, imageUrl: string) => void;
  onImageError?: (slideIndex: number, error: string) => void;
}): ImageGenerationEventHandler {
  return (event: ImageGenerationEvent) => {
    switch (event.type) {
      case 'agent_start':
        callbacks.onAgentStart?.(event.totalSlides, event.slideInfo);
        break;
      case 'agent_activity':
        callbacks.onAgentActivity?.(event.log);
        break;
      case 'agent_logs':
        callbacks.onAgentLogs?.(event.logs);
        break;
      case 'agent_complete':
        callbacks.onAgentComplete?.();
        break;
      case 'image_generated':
        callbacks.onImageGenerated?.(event.slideIndex, event.imageUrl);
        break;
      case 'image_error':
        callbacks.onImageError?.(event.slideIndex, event.error);
        break;
    }
  };
}

// ============================================
// Content Refinement Events
// ============================================

/**
 * Events emitted during content refinement.
 */
export type ContentRefinementEvent =
  | { type: 'refinement_start'; slideIndex: number }
  | { type: 'refinement_progress'; step: string; progress: number }
  | { type: 'refinement_complete'; slideIndex: number }
  | { type: 'refinement_error'; slideIndex: number; error: string };

export type ContentRefinementEventHandler = (event: ContentRefinementEvent) => void;

// ============================================
// Rough Draft Events
// ============================================

/**
 * Events emitted during rough draft generation.
 */
export type RoughDraftEvent =
  | { type: 'phase_change'; phase: string; slideIndex?: number }
  | { type: 'slide_generated'; slideIndex: number; slide: unknown }
  | { type: 'slide_approved'; slideIndex: number }
  | { type: 'slide_rejected'; slideIndex: number }
  | { type: 'generation_complete'; totalSlides: number }
  | { type: 'generation_error'; error: string };

export type RoughDraftEventHandler = (event: RoughDraftEvent) => void;

// ============================================
// Generic Event Utilities
// ============================================

/**
 * Combine multiple event handlers into one.
 */
export function combineEventHandlers<T>(
  ...handlers: Array<((event: T) => void) | undefined>
): (event: T) => void {
  return (event: T) => {
    handlers.forEach(handler => handler?.(event));
  };
}

/**
 * Filter events by type.
 */
export function filterEvents<T extends { type: string }, K extends T['type']>(
  handler: (event: Extract<T, { type: K }>) => void,
  ...types: K[]
): (event: T) => void {
  return (event: T) => {
    if (types.includes(event.type as K)) {
      handler(event as Extract<T, { type: K }>);
    }
  };
}

/**
 * Log events for debugging.
 */
export function createEventLogger<T extends { type: string }>(
  prefix: string = '[Event]'
): (event: T) => void {
  return (event: T) => {
    console.log(`${prefix} ${event.type}`, event);
  };
}
