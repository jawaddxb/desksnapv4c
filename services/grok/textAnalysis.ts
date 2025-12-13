/**
 * Text Analysis Utilities
 *
 * Functions for analyzing text content - sentiment detection, metric extraction,
 * source reliability estimation, and URL parsing.
 */

import type { Finding, FindingType } from '@/types';

/**
 * Extract source name from URL
 */
export const extractSourceFromUrl = (url: string): string => {
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
export const extractTitleFromUrl = (url: string): string => {
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
export const estimateReliability = (url: string): 1 | 2 | 3 | 4 | 5 => {
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
export const detectSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
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
export const extractMetrics = (text: string): Finding['metrics'] | undefined => {
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
export const detectFindingType = (text: string): FindingType => {
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
