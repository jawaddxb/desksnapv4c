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
  { id: 'scout', name: 'Scout', tagline: 'Finding the facts', avatar: '/images/Scout---Explorer.svg', color: '#4A90A4' },
  { id: 'sage', name: 'Sage', tagline: 'Structuring your message', avatar: '/images/Sage---architect.svg', color: '#6B8E6B' },
  { id: 'aria', name: 'Aria', tagline: 'Crafting your story', avatar: '/images/Aria.svg', color: '#C9A962' },
  { id: 'nova', name: 'Nova', tagline: 'Making your vision real', avatar: '/images/Nova---Painter.svg', color: '#A78BFA' },
  { id: 'coach', name: 'Coach', tagline: 'Polishing for impact', avatar: '/images/Coach---Coach.svg', color: '#D4854A' },
];

/**
 * Helper to get agent config by ID
 */
export const getAgentConfig = (id: AgentId): AgentConfig | undefined =>
  AGENT_TEAM.find(agent => agent.id === id);

/**
 * Role titles for each agent (for Dashboard display)
 */
export const AGENT_ROLES: Record<AgentId, string> = {
  scout: 'Research Specialist',
  sage: 'Design Architect',
  aria: 'Content Writer',
  nova: 'Visual Designer',
  coach: 'Quality Advisor',
};

/**
 * Example tasks each agent excels at (for Dashboard display)
 */
export const AGENT_EXAMPLES: Record<AgentId, string[]> = {
  scout: ['Find market statistics', 'Search trending topics', 'Gather expert quotes'],
  sage: ['Select perfect theme', 'Choose optimal layouts', 'Match topic to style'],
  aria: ['Write compelling headlines', 'Structure narrative arc', 'Add speaker notes'],
  nova: ['Generate custom images', 'Validate visual prompts', 'Apply theme aesthetics'],
  coach: ['Review content clarity', 'Check audience fit', 'Suggest improvements'],
};

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
