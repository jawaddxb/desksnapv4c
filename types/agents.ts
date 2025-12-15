/**
 * Agent-Related Type Definitions
 *
 * Types for agent logging, activity tracking, and debugging.
 * These types are used across components, contexts, and services.
 */

// ============ Agent Team Types ============

/**
 * Identifiers for the 5 specialist agents in the team
 */
export type AgentId = 'scout' | 'sage' | 'aria' | 'nova' | 'coach';

/**
 * Status states for an agent
 */
export type AgentStatus = 'idle' | 'ready' | 'working' | 'done' | 'error';

/**
 * Configuration for each agent (static definition)
 */
export interface AgentConfig {
  id: AgentId;
  name: string;
  tagline: string;
  avatar: string;  // Path to comic book avatar image
  color: string;   // Accent color (hex)
}

/**
 * Runtime state of an agent team member
 */
export interface AgentTeamMember {
  id: AgentId;
  status: AgentStatus;
  message?: string;
  output?: unknown;  // Agent-specific output
  startedAt?: number;
  completedAt?: number;
}

/**
 * Static configuration for all 5 agents
 */
export const AGENT_TEAM: AgentConfig[] = [
  { id: 'scout', name: 'Scout', tagline: 'Finding the facts', avatar: '/agents/scout.png', color: '#4A90A4' },
  { id: 'sage', name: 'Sage', tagline: 'Structuring your message', avatar: '/agents/sage.png', color: '#6B8E6B' },
  { id: 'aria', name: 'Aria', tagline: 'Crafting your story', avatar: '/agents/aria.png', color: '#C9A962' },
  { id: 'nova', name: 'Nova', tagline: 'Making your vision real', avatar: '/agents/nova.png', color: '#A78BFA' },
  { id: 'coach', name: 'Coach', tagline: 'Polishing for impact', avatar: '/agents/coach.png', color: '#D4854A' },
];

/**
 * Helper to get agent config by ID
 */
export const getAgentConfig = (id: AgentId): AgentConfig | undefined =>
  AGENT_TEAM.find(agent => agent.id === id);

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
