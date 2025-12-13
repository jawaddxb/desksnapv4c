/**
 * Agent Types
 *
 * Type definitions for the image prompt agent system.
 * This agent validates and refines image prompts to ensure
 * they are contextually relevant to the presentation topic.
 */

// ============ Core Agent Types ============

export interface AgentTool<TParams = unknown, TResult = unknown> {
  name: string;
  description: string;
  parameters: Record<string, string>;
  execute: (params: TParams) => Promise<TResult>;
}

export interface AgentContext {
  topic: string;
  themeId: string;
  visualStyle: string;
  slides: SlideContext[];
}

export interface SlideContext {
  index: number;
  title: string;
  content: string[];
  initialPrompt: string;
}

// ============ Validation Types ============

export interface PromptValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

export interface ValidatePromptParams {
  prompt: string;
  topic: string;
  slideTitle: string;
  slideContent?: string[];
}

// ============ Rewrite Types ============

export interface RewritePromptParams {
  originalPrompt: string;
  topic: string;
  issues: string[];
  visualStyle: string;
  slideTitle: string;
  slideContent?: string[];
}

export interface RewritePromptResult {
  newPrompt: string;
  reasoning: string;
}

// ============ Keyword Extraction Types ============

export interface ExtractKeywordsParams {
  topic: string;
}

export interface ExtractKeywordsResult {
  keywords: string[];
  visualSubjects: string[];
  avoidTerms: string[];
}

// ============ Agent Log Types ============
// Re-exported from types layer for backward compatibility
export type { AgentLog, AgentAction } from '../../types/agents';

// ============ Agent Result Types ============

export interface AgentResult {
  refinedPrompts: string[];
  logs: AgentLog[];
  totalDurationMs: number;
  slidesRefined: number;
  totalIterations: number;
}

export interface SlideAgentResult {
  slideIndex: number;
  originalPrompt: string;
  finalPrompt: string;
  iterations: number;
  finalScore: number;
  wasRefined: boolean;
  logs: AgentLog[];
}

// ============ Agent Options ============

export interface AgentOptions {
  /** Minimum score to accept a prompt without rewriting (default: 70) */
  acceptanceThreshold?: number;
  /** Maximum iterations per slide (default: 3) */
  maxIterations?: number;
  /** Run validation in parallel for all slides (default: true) */
  parallelValidation?: boolean;
  /** Callback for each log entry */
  onLog?: (log: AgentLog) => void;
  /** Callback for slide completion */
  onSlideComplete?: (result: SlideAgentResult) => void;
}

// ============ Generation Options ============

export interface AgentImageGenerationOptions extends AgentOptions {
  /** Callback when an image is generated */
  onImageGenerated?: (slideIndex: number, imageUrl: string) => void;
  /** Callback for generation errors */
  onImageError?: (slideIndex: number, error: Error) => void;
}

export interface AgentImageGenerationResult {
  images: string[];
  agentLogs: AgentLog[];
  errors: Array<{ slideIndex: number; error: string }>;
  totalDurationMs: number;
}
