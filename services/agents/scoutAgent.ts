/**
 * Scout Agent Service
 *
 * Research specialist agent that finds facts, statistics, and trends.
 * Wraps existing research services (Grok/Gemini) - no logic duplication.
 *
 * Single Responsibility: Coordinate research for presentation generation.
 */

import { performGrokResearch, hasGrokApiKey } from '@/services/grokService';
import { performResearch } from '@/services/copilot/researchHelpers';
import { ComprehensiveResearch, Finding, ResearchPreferences } from '@/types';
import { WebSearchResult } from '@/types/ideation';

/**
 * Scout research output - simplified for presentation flow
 */
export interface ScoutOutput {
  findings: Finding[];
  summary: string;
  searchQuery: string;
}

/**
 * Scout options
 */
export interface ScoutOptions {
  /** Include X/Twitter search for trends */
  includeXSearch?: boolean;
  /** Include competitor analysis */
  includeCompetitors?: boolean;
  /** Custom research steps from Train My Squad */
  customSteps?: string[];
  /** Progress callback */
  onProgress?: (message: string) => void;
}

/**
 * Default research preferences
 */
const DEFAULT_PREFERENCES: ResearchPreferences = {
  includeStats: true,
  includeXSearch: true,
  includeCompetitors: true,
  includeExperts: true,
};

/**
 * Extract keywords from topic for better search
 */
function extractSearchQuery(topic: string): string {
  // Remove common filler words for cleaner search
  const fillers = ['presentation', 'about', 'on', 'for', 'the', 'a', 'an', 'my'];
  const words = topic.toLowerCase().split(/\s+/);
  const filtered = words.filter(w => !fillers.includes(w) && w.length > 2);
  return filtered.join(' ') || topic;
}

/**
 * Convert simple web search results to Finding format
 */
function webResultsToFindings(results: WebSearchResult[]): Finding[] {
  return results.map((r, i) => ({
    id: `finding-${i}`,
    type: 'market' as const,
    summary: r.snippet,
    citation: {
      id: `citation-${i}`,
      url: r.url,
      title: r.title,
      source: new URL(r.url).hostname.replace('www.', ''),
      accessedAt: Date.now(),
    },
    icon: '📊',
  }));
}

/**
 * Run Scout research agent
 *
 * Uses Grok (real web search) if available, falls back to Gemini simulation.
 */
export async function runScoutAgent(
  topic: string,
  options: ScoutOptions = {}
): Promise<ScoutOutput> {
  const { onProgress, includeXSearch = true, includeCompetitors = true, customSteps = [] } = options;
  const searchQuery = extractSearchQuery(topic);

  // Build enhanced query with custom steps
  const customContext = customSteps.length > 0
    ? `. Also: ${customSteps.join(', ')}`
    : '';

  onProgress?.('Searching for relevant data...');

  // Try Grok first (real web search), fall back to Gemini
  if (hasGrokApiKey()) {
    try {
      onProgress?.('Searching web and X for insights...');

      const preferences: ResearchPreferences = {
        ...DEFAULT_PREFERENCES,
        includeXSearch,
        includeCompetitors,
      };

      // Enhance search query with custom steps
      const enhancedQuery = searchQuery + customContext;
      const research = await performGrokResearch(enhancedQuery, preferences);

      return {
        findings: research.findings,
        summary: research.synthesis || `Found ${research.findings.length} relevant insights`,
        searchQuery,
      };
    } catch (error) {
      console.warn('[Scout] Grok research failed, falling back to Gemini:', error);
    }
  }

  // Fallback to Gemini-based research
  onProgress?.('Analyzing topic...');

  // Build research prompt with custom steps
  const basePrompt = `Find key statistics, market data, and expert insights for a presentation about: ${topic}`;
  const fullPrompt = customSteps.length > 0
    ? `${basePrompt}. Additionally: ${customSteps.join('; ')}`
    : basePrompt;

  const results = await performResearch(searchQuery, fullPrompt);

  return {
    findings: webResultsToFindings(results),
    summary: results.length > 0
      ? `Found ${results.length} relevant sources`
      : 'No specific research found, proceeding with general knowledge',
    searchQuery,
  };
}

/**
 * Format findings for injection into content generation prompt
 */
export function formatFindingsForPrompt(findings: Finding[]): string {
  if (findings.length === 0) return '';

  const formatted = findings.slice(0, 5).map(f =>
    `- ${f.summary} (Source: ${f.citation.source})`
  ).join('\n');

  return `\n\nResearch Findings to incorporate:\n${formatted}`;
}

export default runScoutAgent;
