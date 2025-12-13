/**
 * Agent-Related Type Definitions
 *
 * Types for agent logging, activity tracking, and debugging.
 * These types are used across components, contexts, and services.
 */

// ============ Agent Action Types ============

/**
 * Types of actions an agent can perform during prompt refinement
 */
export type AgentAction = 'validate' | 'rewrite' | 'finalize' | 'extract_keywords';

// ============ Agent Log Types ============

/**
 * Log entry for agent activity tracking
 * Used by debug panels, activity contexts, and image generation hooks
 */
export interface AgentLog {
  /** Index of the slide being processed */
  slideIndex: number;
  /** Iteration number for this slide (1-based) */
  iteration: number;
  /** Type of action performed */
  action: AgentAction;
  /** Input provided to the action */
  input: string;
  /** Output/result from the action */
  output: string;
  /** Optional reasoning for the action */
  reasoning?: string;
  /** Unix timestamp when action occurred */
  timestamp: number;
  /** Duration of the action in milliseconds */
  durationMs?: number;
}
