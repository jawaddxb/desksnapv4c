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

/**
 * Extended agent content for landing page showcase
 */
export interface AgentExtendedContent {
  personality: string[];
  capabilities: string[];
  collaborates: { agentId: AgentId; description: string }[];
  valueProp: string;
}

export const AGENT_EXTENDED: Record<AgentId, AgentExtendedContent> = {
  scout: {
    personality: ['Endlessly curious', 'Data-driven', 'Thorough researcher', 'Detail-oriented'],
    capabilities: ['Web research & fact-finding', 'Trending topic analysis', 'Expert quote extraction', 'Statistical data gathering'],
    collaborates: [
      { agentId: 'sage', description: 'Passes verified research to structure the narrative' },
      { agentId: 'aria', description: 'Provides compelling quotes and statistics for storytelling' },
    ],
    valueProp: 'Scout eliminates hours of research by finding relevant facts, trends, and expert insights. Just describe your topic and let Scout do the digging.',
  },
  sage: {
    personality: ['Strategic thinker', 'Pattern recognizer', 'Aesthetically minded', 'Structure enthusiast'],
    capabilities: ['Theme selection & matching', 'Layout optimization', 'Visual hierarchy planning', 'Slide flow structuring'],
    collaborates: [
      { agentId: 'scout', description: 'Receives research to inform structural decisions' },
      { agentId: 'nova', description: 'Guides visual design direction and theme application' },
    ],
    valueProp: 'Sage ensures your presentation has the right visual foundation. From choosing the perfect theme to structuring your story arc, Sage builds the blueprint.',
  },
  aria: {
    personality: ['Creative wordsmith', 'Empathetic storyteller', 'Persuasive communicator', 'Narrative-driven'],
    capabilities: ['Headline crafting', 'Narrative arc development', 'Speaker notes generation', 'Tone adaptation'],
    collaborates: [
      { agentId: 'scout', description: 'Transforms research into compelling narratives' },
      { agentId: 'coach', description: 'Refines content based on quality feedback' },
    ],
    valueProp: 'Aria transforms your ideas into a compelling story. From punchy headlines to flowing narratives, Aria makes your message resonate with any audience.',
  },
  nova: {
    personality: ['Visually imaginative', 'Detail-oriented artist', 'Trend-aware', 'Aesthetically bold'],
    capabilities: ['AI image generation', 'Visual prompt optimization', 'Theme aesthetic enforcement', 'Image-text harmony'],
    collaborates: [
      { agentId: 'sage', description: 'Implements design direction and theme choices' },
      { agentId: 'aria', description: 'Creates visuals that complement the narrative' },
    ],
    valueProp: 'Nova brings your slides to life with custom AI-generated imagery. No more hunting for stock photos - Nova creates visuals that perfectly match your message.',
  },
  coach: {
    personality: ['Constructive critic', 'Audience advocate', 'Excellence-driven', 'Supportive mentor'],
    capabilities: ['Content clarity review', 'Audience fit assessment', 'Improvement suggestions', 'Consistency checking'],
    collaborates: [
      { agentId: 'aria', description: 'Provides feedback to strengthen messaging' },
      { agentId: 'sage', description: 'Validates structural choices for impact' },
    ],
    valueProp: 'Coach is your quality assurance partner. Before you present, Coach reviews everything - ensuring clarity, consistency, and maximum impact for your audience.',
  },
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
