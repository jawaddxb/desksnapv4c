/**
 * Grok Service - xAI Agent Tools API Integration for Research Co-Pilot
 *
 * Uses xAI's server-side search tools via the /v1/responses endpoint:
 * - web_search: Real-time web search with citations
 * - x_search: X/Twitter semantic search for trends and social proof
 *
 * These are server-side tools that run on xAI's infrastructure.
 * The model autonomously decides when to use them.
 */

import type {
  ResearchPreferences,
  ComprehensiveResearch,
  ProgressUpdate,
} from '../types';
import { getExternalModel } from '../config';
import { parseGrokResponse } from './grok/grokParser';

// Constants
const XAI_API_BASE = 'https://api.x.ai';
const XAI_RESPONSES_ENDPOINT = '/v1/responses';
const MODEL = getExternalModel('grok');

// System prompt for research
const RESEARCH_SYSTEM_PROMPT = `You are a research analyst specializing in finding accurate, up-to-date information.
Use the available search tools to find real data with citations.
Be thorough but concise. Focus on actionable insights.
Always search the web and X/Twitter when relevant to find current information.`;

/**
 * Build server-side tools array based on preferences (DRY)
 */
const buildServerTools = (preferences: ResearchPreferences): Array<{ type: string }> => {
  const tools: Array<{ type: string }> = [{ type: 'web_search' }];
  if (preferences.includeXSearch) {
    tools.push({ type: 'x_search' });
  }
  return tools;
};

/**
 * Get the xAI API key from environment variables
 */
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_XAI_API_KEY;
  if (!apiKey) {
    throw new Error('XAI_API_KEY not found. Set VITE_XAI_API_KEY in your .env.local file.');
  }
  return apiKey;
};

/**
 * Build the research prompt based on user preferences
 */
const buildResearchPrompt = (query: string, preferences: ResearchPreferences): string => {
  const sections: string[] = [];

  sections.push(`Research the following topic thoroughly: "${query}"`);
  sections.push('\nSearch for and provide findings in these specific categories:');

  if (preferences.includeStats) {
    sections.push('- MARKET DATA: Find specific market statistics, growth rates, market size, and projections');
  }

  if (preferences.includeXSearch) {
    sections.push('- TRENDS: Search X/Twitter for current discussions, sentiment, and trending topics');
  }

  if (preferences.includeCompetitors) {
    sections.push('- COMPETITORS: Identify key players, companies, and competitors in this space');
  }

  if (preferences.includeExperts) {
    sections.push('- EXPERT OPINIONS: Find quotes, case studies, and expert perspectives');
  }

  sections.push('\nFor each finding, provide:');
  sections.push('- A clear, concise summary (2-3 sentences)');
  sections.push('- The category it belongs to (MARKET, TREND, COMPETITOR, or EXPERT)');
  sections.push('- Any relevant metrics or statistics');

  return sections.join('\n');
};

/**
 * Perform research using Grok's Agent Tools API
 * Uses the /v1/responses endpoint with server-side search tools
 */
export async function performGrokResearch(
  query: string,
  preferences: ResearchPreferences,
  onProgress?: (update: ProgressUpdate) => void
): Promise<ComprehensiveResearch> {
  const apiKey = getApiKey();
  const tools = buildServerTools(preferences);

  console.log('[Grok] Starting research:', { query, tools: tools.map(t => t.type) });

  // Initial progress
  onProgress?.({
    tool: 'web_search',
    status: 'searching',
    message: 'Starting research...',
  });

  try {
    // Make the API call using the correct /v1/responses endpoint
    const requestBody = {
      model: MODEL,
      input: [
        { role: 'system', content: RESEARCH_SYSTEM_PROMPT },
        { role: 'user', content: buildResearchPrompt(query, preferences) }
      ],
      tools,
      include: ['inline_citations'],
    };

    console.log('[Grok] API request:', {
      endpoint: `${XAI_API_BASE}${XAI_RESPONSES_ENDPOINT}`,
      model: MODEL,
      toolsCount: tools.length,
    });

    const response = await fetch(`${XAI_API_BASE}${XAI_RESPONSES_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[Grok] API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Grok] API error:', errorData);
      throw new Error(`Grok API error: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData) || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('[Grok] API response received:', {
      hasOutput: !!data.output,
      hasCitations: !!data.citations,
      citationsCount: data.citations?.length,
    });

    // Progress: Processing results
    onProgress?.({
      tool: 'synthesizing',
      status: 'processing',
      message: 'Analyzing findings...',
    });

    // Parse the response into structured findings
    const result = parseGrokResponse(data, query);

    console.log('[Grok] Research complete:', {
      findingsCount: result.findings.length,
      citationsCount: result.citations.length,
    });

    // Progress: Complete
    onProgress?.({
      tool: 'synthesizing',
      status: 'complete',
      message: `Found ${result.findings.length} relevant findings`,
    });

    return result;
  } catch (error) {
    console.error('[Grok] Research failed:', error);

    // Progress: Error
    onProgress?.({
      tool: 'web_search',
      status: 'error',
      message: error instanceof Error ? error.message : 'Research failed',
    });

    throw error;
  }
}

/**
 * Check if Grok API is configured
 */
export const hasGrokApiKey = (): boolean => {
  return !!import.meta.env.VITE_XAI_API_KEY;
};
