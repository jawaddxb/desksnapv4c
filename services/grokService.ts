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
  ResearchResult,
  Finding,
  Citation,
  XTrend,
  ProgressUpdate,
  MindMapNode,
  FindingType,
} from '../types';
import { getExternalModel } from '../config';

// Constants
const XAI_API_BASE = 'https://api.x.ai';
const XAI_RESPONSES_ENDPOINT = '/v1/responses';
const MODEL = getExternalModel('grok');

// System prompt for research
const RESEARCH_SYSTEM_PROMPT = `You are a research analyst specializing in finding accurate, up-to-date information.
Use the available search tools to find real data with citations.
Be thorough but concise. Focus on actionable insights.
Always search the web and X/Twitter when relevant to find current information.`;

// Type icons for findings display
const TYPE_ICONS: Record<FindingType, string> = {
  market: '📊',
  trend: '🔥',
  competitor: '🏢',
  expert: '💬',
  social: '🐦',
};

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
 * Extract source name from URL
 */
const extractSourceFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const domain = hostname.replace('www.', '').split('.')[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Web';
  }
};

/**
 * Extract title from URL (fallback)
 */
const extractTitleFromUrl = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      return last.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
    }
    return 'Research Finding';
  } catch {
    return 'Research Finding';
  }
};

/**
 * Estimate reliability based on domain
 */
const estimateReliability = (url: string): 1 | 2 | 3 | 4 | 5 => {
  const reliableDomains = ['statista', 'bloomberg', 'reuters', 'forbes', 'wsj', 'nytimes', 'bbc', 'nature', 'science'];
  const goodDomains = ['techcrunch', 'wired', 'theverge', 'arstechnica', 'medium', 'linkedin'];

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (reliableDomains.some(d => hostname.includes(d))) return 5;
    if (goodDomains.some(d => hostname.includes(d))) return 4;
    if (hostname.includes('.gov') || hostname.includes('.edu')) return 5;
    if (hostname.includes('x.com') || hostname.includes('twitter.com')) return 3;
    return 3;
  } catch {
    return 2;
  }
};

/**
 * Detect sentiment from text
 */
const detectSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const lower = text.toLowerCase();
  const positiveWords = ['growth', 'increase', 'success', 'leading', 'best', 'innovative', 'breakthrough', 'rise', 'gain'];
  const negativeWords = ['decline', 'decrease', 'fail', 'worst', 'struggling', 'crisis', 'problem', 'loss', 'drop'];

  const positiveCount = positiveWords.filter(w => lower.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lower.includes(w)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

/**
 * Extract metrics from text (e.g., "$45.2B", "15% growth")
 */
const extractMetrics = (text: string): Finding['metrics'] | undefined => {
  const currencyMatch = text.match(/\$[\d.,]+\s*[BMKbmk]?(illion)?/i);
  const percentMatch = text.match(/[\d.]+%/);

  if (currencyMatch || percentMatch) {
    return {
      value: currencyMatch?.[0] || percentMatch?.[0] || '',
      label: currencyMatch ? 'Market Value' : 'Growth Rate',
      change: percentMatch && currencyMatch ? percentMatch[0] : undefined,
    };
  }

  return undefined;
};

/**
 * Detect finding type from content
 */
const detectFindingType = (text: string): FindingType => {
  const lower = text.toLowerCase();

  if (lower.includes('market') || lower.includes('revenue') || lower.includes('billion') ||
      lower.includes('million') || lower.includes('growth rate') || lower.includes('cagr')) {
    return 'market';
  }
  if (lower.includes('trend') || lower.includes('twitter') || lower.includes('x.com') ||
      lower.includes('viral') || lower.includes('buzz') || lower.includes('discussion')) {
    return 'trend';
  }
  if (lower.includes('competitor') || lower.includes('company') || lower.includes('player') ||
      lower.includes('leader') || lower.includes('vs') || lower.includes('compared to')) {
    return 'competitor';
  }
  if (lower.includes('expert') || lower.includes('quote') || lower.includes('said') ||
      lower.includes('according to') || lower.includes('study') || lower.includes('research')) {
    return 'expert';
  }
  if (lower.includes('social') || lower.includes('sentiment') || lower.includes('opinion')) {
    return 'social';
  }

  return 'market'; // Default
};

/**
 * Extract findings from content and citations
 */
const extractFindingsFromContent = (content: string, citations: Citation[]): Finding[] => {
  const findings: Finding[] = [];

  // Split content into paragraphs/sections
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 50);

  // Create findings from paragraphs with citations
  for (const paragraph of paragraphs) {
    const type = detectFindingType(paragraph);
    const cleanedText = paragraph
      .replace(/\[[\d,\s]+\]/g, '') // Remove citation markers like [1], [2,3]
      .replace(/\*+/g, '')
      .replace(/#+\s*/g, '')
      .trim();

    if (cleanedText.length < 30) continue;

    // Find matching citation for this paragraph
    const citation = citations.find(c =>
      paragraph.toLowerCase().includes(extractSourceFromUrl(c.url).toLowerCase())
    ) || citations[findings.length % citations.length] || {
      id: `citation-${findings.length + 1}`,
      url: '',
      title: 'Research Finding',
      source: 'Grok AI',
      accessedAt: Date.now(),
      reliability: 3 as const,
    };

    const finding: Finding = {
      id: `finding-${findings.length + 1}`,
      type,
      summary: cleanedText.slice(0, 300) + (cleanedText.length > 300 ? '...' : ''),
      citation,
      icon: TYPE_ICONS[type],
      sentiment: detectSentiment(cleanedText),
      metrics: extractMetrics(cleanedText),
    };

    findings.push(finding);
  }

  // If no findings from paragraphs, create from citations
  if (findings.length === 0 && citations.length > 0) {
    citations.forEach((citation, i) => {
      findings.push({
        id: `finding-${i + 1}`,
        type: detectFindingType(citation.title || ''),
        summary: citation.title || `Research finding from ${citation.source}`,
        citation,
        icon: TYPE_ICONS[detectFindingType(citation.title || '')],
        sentiment: 'neutral',
      });
    });
  }

  // Fallback: create at least one finding from content
  if (findings.length === 0 && content.length > 50) {
    findings.push({
      id: 'finding-1',
      type: 'market',
      summary: content.slice(0, 300) + (content.length > 300 ? '...' : ''),
      citation: {
        id: 'citation-1',
        url: '',
        title: 'Research Summary',
        source: 'Grok AI',
        accessedAt: Date.now(),
        reliability: 3,
      },
      icon: TYPE_ICONS.market,
      sentiment: detectSentiment(content),
    });
  }

  return findings;
};

/**
 * Build mind map structure from findings
 */
const buildMindMap = (topic: string, findings: Finding[]): MindMapNode => {
  const root: MindMapNode = {
    id: 'topic',
    label: topic,
    type: 'topic',
    children: [],
  };

  // Group findings by type
  const grouped = findings.reduce((acc, finding) => {
    if (!acc[finding.type]) {
      acc[finding.type] = [];
    }
    acc[finding.type].push(finding);
    return acc;
  }, {} as Record<FindingType, Finding[]>);

  // Create category nodes
  for (const [type, typeFindings] of Object.entries(grouped)) {
    const categoryNode: MindMapNode = {
      id: `cat-${type}`,
      label: `${TYPE_ICONS[type as FindingType]} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: 'category',
      children: typeFindings.map(f => ({
        id: f.id,
        label: f.summary.slice(0, 50) + (f.summary.length > 50 ? '...' : ''),
        type: 'finding' as const,
        finding: f,
      })),
    };
    root.children!.push(categoryNode);
  }

  return root;
};

/**
 * Parse Grok's response into structured findings
 * Handles the new /v1/responses API format
 */
const parseGrokResponse = (data: any, query: string): ResearchResult => {
  console.log('[Grok] Parsing response:', {
    hasOutput: !!data.output,
    outputType: typeof data.output,
    citationsCount: data.citations?.length || 0,
  });

  // Extract content - new API uses 'output' field
  let content = '';
  if (typeof data.output === 'string') {
    content = data.output;
  } else if (Array.isArray(data.output)) {
    // Handle array of content blocks
    content = data.output
      .map((block: any) => typeof block === 'string' ? block : block.content || block.text || '')
      .join('\n\n');
  } else if (data.output?.content) {
    content = data.output.content;
  }

  // Use citations directly from API response
  const citations: Citation[] = (data.citations || []).map((c: any, i: number) => ({
    id: `citation-${i + 1}`,
    url: c.url || c.link || '',
    title: c.title || extractTitleFromUrl(c.url || ''),
    source: c.source || extractSourceFromUrl(c.url || ''),
    accessedAt: Date.now(),
    reliability: estimateReliability(c.url || ''),
  }));

  console.log('[Grok] Extracted:', {
    contentLength: content.length,
    citationsCount: citations.length,
  });

  // Extract findings from content
  const findings = extractFindingsFromContent(content, citations);

  // Build mind map structure
  const mindMapData = buildMindMap(query, findings);

  return {
    findings,
    citations,
    xTrends: [],
    synthesis: content,
    mindMapData,
  };
};

/**
 * Perform research using Grok's Agent Tools API
 * Uses the /v1/responses endpoint with server-side search tools
 */
export async function performGrokResearch(
  query: string,
  preferences: ResearchPreferences,
  onProgress?: (update: ProgressUpdate) => void
): Promise<ResearchResult> {
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
