/**
 * Grok Service - xAI API Integration for Research Co-Pilot
 *
 * Uses Grok 4.1 Fast Reasoning model with built-in search tools:
 * - web_search: Real-time web search with citations
 * - x_search: X/Twitter semantic search for trends and social proof
 *
 * The xAI API is OpenAI-compatible, so we use the standard OpenAI SDK
 * with xAI's base URL.
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

// Constants
const XAI_API_BASE = 'https://api.x.ai/v1';
const MODEL = 'grok-4-1-fast-reasoning';

// Type icons for findings display
const TYPE_ICONS: Record<FindingType, string> = {
  market: '📊',
  trend: '🔥',
  competitor: '🏢',
  expert: '💬',
  social: '🐦',
};

// Tool definitions for Grok
const WEB_SEARCH_TOOL = {
  type: 'function' as const,
  function: {
    name: 'web_search',
    description: 'Search the web for real-time information, statistics, and news',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query',
        },
      },
      required: ['query'],
    },
  },
};

const X_SEARCH_TOOL = {
  type: 'function' as const,
  function: {
    name: 'x_search',
    description: 'Search X/Twitter for trends, sentiment, and social proof',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query for X/Twitter',
        },
      },
      required: ['query'],
    },
  },
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
  sections.push('\nProvide findings in these specific categories:');

  if (preferences.includeStats) {
    sections.push('- MARKET DATA: Find specific market statistics, growth rates, market size, and projections with sources');
  }

  if (preferences.includeXSearch) {
    sections.push('- TRENDS: Search X/Twitter for current discussions, sentiment, and trending topics related to this');
  }

  if (preferences.includeCompetitors) {
    sections.push('- COMPETITORS: Identify key players, companies, and competitors in this space');
  }

  if (preferences.includeExperts) {
    sections.push('- EXPERT OPINIONS: Find quotes, case studies, and expert perspectives');
  }

  sections.push('\nFor each finding:');
  sections.push('1. Provide a clear, concise summary');
  sections.push('2. Include the source URL and title');
  sections.push('3. Rate the source reliability (1-5 stars)');
  sections.push('4. Note if the sentiment is positive, negative, or neutral');
  sections.push('\nFormat your response as structured data that can be parsed.');

  return sections.join('\n');
};

/**
 * Parse Grok's response into structured findings
 */
const parseGrokResponse = (content: string, query: string): ResearchResult => {
  const findings: Finding[] = [];
  const citations: Citation[] = [];
  const xTrends: XTrend[] = [];

  // Parse the response content
  // Grok returns structured text that we can parse into findings
  const lines = content.split('\n');
  let currentType: FindingType | null = null;
  let currentFinding: Partial<Finding> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect section headers
    if (trimmed.includes('MARKET') || trimmed.includes('Statistics') || trimmed.includes('Market')) {
      currentType = 'market';
    } else if (trimmed.includes('TREND') || trimmed.includes('Twitter') || trimmed.includes('X ')) {
      currentType = 'trend';
    } else if (trimmed.includes('COMPETITOR') || trimmed.includes('Players') || trimmed.includes('Companies')) {
      currentType = 'competitor';
    } else if (trimmed.includes('EXPERT') || trimmed.includes('Opinion') || trimmed.includes('Quote')) {
      currentType = 'expert';
    } else if (trimmed.includes('SOCIAL') || trimmed.includes('Sentiment')) {
      currentType = 'social';
    }

    // Extract URLs and create citations
    const urlMatch = trimmed.match(/https?:\/\/[^\s)]+/);
    if (urlMatch && currentType) {
      const url = urlMatch[0];
      const citationId = `citation-${citations.length + 1}`;

      const citation: Citation = {
        id: citationId,
        url,
        title: extractTitleFromContext(trimmed, url),
        source: extractSourceFromUrl(url),
        accessedAt: Date.now(),
        reliability: estimateReliability(url),
      };
      citations.push(citation);

      // Create finding if we have enough context
      if (trimmed.length > 20) {
        const finding: Finding = {
          id: `finding-${findings.length + 1}`,
          type: currentType,
          summary: cleanSummary(trimmed),
          citation,
          icon: TYPE_ICONS[currentType],
          sentiment: detectSentiment(trimmed),
        };

        // Extract metrics if present
        const metrics = extractMetrics(trimmed);
        if (metrics) {
          finding.metrics = metrics;
        }

        findings.push(finding);
      }
    }
  }

  // If parsing didn't find structured data, create a general finding
  if (findings.length === 0 && content.length > 50) {
    const generalFinding: Finding = {
      id: 'finding-1',
      type: 'market',
      summary: content.slice(0, 300) + (content.length > 300 ? '...' : ''),
      citation: {
        id: 'citation-1',
        url: '',
        title: 'Research Summary',
        source: 'Grok AI',
        accessedAt: Date.now(),
      },
      icon: TYPE_ICONS.market,
    };
    findings.push(generalFinding);
  }

  // Build mind map structure
  const mindMapData = buildMindMap(query, findings);

  return {
    findings,
    citations,
    xTrends,
    synthesis: content,
    mindMapData,
  };
};

/**
 * Extract title from context around URL
 */
const extractTitleFromContext = (text: string, url: string): string => {
  // Remove the URL from text and clean up
  const withoutUrl = text.replace(url, '').trim();
  // Take first meaningful part as title
  const match = withoutUrl.match(/[A-Z][^.!?]*[.!?]?/);
  return match ? match[0].slice(0, 100) : 'Research Finding';
};

/**
 * Extract source name from URL
 */
const extractSourceFromUrl = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    // Remove www. and extract domain name
    const domain = hostname.replace('www.', '').split('.')[0];
    // Capitalize first letter
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Web';
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
    return 3;
  } catch {
    return 2;
  }
};

/**
 * Clean up summary text
 */
const cleanSummary = (text: string): string => {
  return text
    .replace(/https?:\/\/[^\s)]+/g, '')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
};

/**
 * Detect sentiment from text
 */
const detectSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const lower = text.toLowerCase();
  const positiveWords = ['growth', 'increase', 'success', 'leading', 'best', 'innovative', 'breakthrough'];
  const negativeWords = ['decline', 'decrease', 'fail', 'worst', 'struggling', 'crisis', 'problem'];

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
  // Match currency values
  const currencyMatch = text.match(/\$[\d.,]+[BMK]?/i);
  // Match percentages
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
 * Perform research using Grok with streaming progress updates
 */
export async function performGrokResearch(
  query: string,
  preferences: ResearchPreferences,
  onProgress?: (update: ProgressUpdate) => void
): Promise<ResearchResult> {
  const apiKey = getApiKey();

  // Build tools array based on preferences
  const tools = [WEB_SEARCH_TOOL];
  if (preferences.includeXSearch) {
    tools.push(X_SEARCH_TOOL);
  }

  // Initial progress
  onProgress?.({
    tool: 'web_search',
    status: 'searching',
    message: 'Starting research...',
  });

  try {
    // Make the API call to Grok
    const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a research analyst specializing in finding accurate, up-to-date information.
Always cite your sources with URLs. Be thorough but concise. Focus on actionable insights.`,
          },
          {
            role: 'user',
            content: buildResearchPrompt(query, preferences),
          },
        ],
        tools,
        tool_choice: 'auto',
        stream: false, // For simplicity, use non-streaming initially
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Grok API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract the response content
    const content = data.choices?.[0]?.message?.content || '';

    // Progress: Processing results
    onProgress?.({
      tool: 'synthesizing',
      status: 'processing',
      message: 'Analyzing findings...',
    });

    // Parse the response into structured findings
    const result = parseGrokResponse(content, query);

    // Progress: Complete
    onProgress?.({
      tool: 'synthesizing',
      status: 'complete',
      message: `Found ${result.findings.length} relevant findings`,
    });

    return result;
  } catch (error) {
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
 * Perform streaming research with real-time updates
 * This uses SSE streaming to show tool calls as they happen
 */
export async function performGrokResearchStreaming(
  query: string,
  preferences: ResearchPreferences,
  onProgress: (update: ProgressUpdate) => void
): Promise<ResearchResult> {
  const apiKey = getApiKey();

  const tools = [WEB_SEARCH_TOOL];
  if (preferences.includeXSearch) {
    tools.push(X_SEARCH_TOOL);
  }

  onProgress({
    tool: 'web_search',
    status: 'searching',
    message: 'Initiating research...',
  });

  const response = await fetch(`${XAI_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a research analyst. Use the available search tools to find accurate, cited information.`,
        },
        {
          role: 'user',
          content: buildResearchPrompt(query, preferences),
        },
      ],
      tools,
      tool_choice: 'auto',
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let fullContent = '';
  let currentTool: ProgressUpdate['tool'] = 'web_search';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta;

        // Check for tool calls
        if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            const toolName = toolCall.function?.name;
            if (toolName === 'web_search') {
              currentTool = 'web_search';
              onProgress({
                tool: 'web_search',
                status: 'searching',
                message: 'Searching the web...',
              });
            } else if (toolName === 'x_search') {
              currentTool = 'x_search';
              onProgress({
                tool: 'x_search',
                status: 'searching',
                message: 'Searching X/Twitter...',
              });
            }
          }
        }

        // Accumulate content
        if (delta?.content) {
          fullContent += delta.content;
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }

  onProgress({
    tool: 'synthesizing',
    status: 'processing',
    message: 'Synthesizing findings...',
  });

  const result = parseGrokResponse(fullContent, query);

  onProgress({
    tool: 'synthesizing',
    status: 'complete',
    message: `Research complete! Found ${result.findings.length} findings.`,
  });

  return result;
}

/**
 * Check if Grok API is configured
 */
export const hasGrokApiKey = (): boolean => {
  return !!import.meta.env.VITE_XAI_API_KEY;
};
