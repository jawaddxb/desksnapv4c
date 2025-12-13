/**
 * Copilot Agent Types
 *
 * Type definitions for the copilot agent service.
 */

import { FunctionDeclaration } from '@google/genai';
import { ResearchPreferences, ProgressUpdate } from '@/types';
import { IdeationSession } from '@/types/ideation';

/**
 * Response from the agent loop
 */
export interface AgentResponse {
  text: string;
  toolCalls: ProcessedToolCall[];
  askUserQuestion?: {
    question: string;
    options?: string[];
  };
  completionQuestion?: CompletionQuestion;
}

/**
 * A processed tool call with its result
 */
export interface ProcessedToolCall {
  name: string;
  args: Record<string, unknown>;
  result: unknown;
}

/**
 * Tool executor function type
 */
export type ToolExecutor = (tool: string, args: Record<string, unknown>) => Promise<unknown>;

/**
 * Completion question with primary actions and secondary options
 */
export interface CompletionQuestion {
  question: string;
  primaryActions: string[];
  secondaryOptions: string[];
}

/**
 * Enhanced mode options for Research Co-Pilot
 */
export interface EnhancedModeOptions {
  enabled: boolean;
  preferences: ResearchPreferences;
  onProgress?: (update: ProgressUpdate) => void;
}

/**
 * Options for the agent loop
 */
export interface AgentLoopOptions {
  tools?: FunctionDeclaration[];
  systemPromptBuilder?: (session: IdeationSession) => string;
  enhancedMode?: EnhancedModeOptions;
  maxIterations?: number;
}
