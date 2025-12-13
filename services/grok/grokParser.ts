/**
 * Grok Response Parser
 *
 * Parses and transforms Grok API responses into structured findings,
 * citations, and mind map data.
 */

import type {
  ResearchResult,
  Finding,
  Citation,
  MindMapNode,
  FindingType,
} from '../../types';
import {
  extractSourceFromUrl,
  extractTitleFromUrl,
  estimateReliability,
  detectSentiment,
  extractMetrics,
  detectFindingType,
} from './textAnalysis';

// Type icons for findings display
const TYPE_ICONS: Record<FindingType, string> = {
  market: '📊',
  trend: '🔥',
  competitor: '🏢',
  expert: '💬',
  social: '🐦',
};

/**
 * Extract findings from content and citations
 */
export const extractFindingsFromContent = (content: string, citations: Citation[]): Finding[] => {
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
export const buildMindMap = (topic: string, findings: Finding[]): MindMapNode => {
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
export const parseGrokResponse = (data: any, query: string): ResearchResult => {
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
