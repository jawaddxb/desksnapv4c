/**
 * Firecrawl Service
 *
 * Handles web content extraction using Firecrawl API.
 * Firecrawl is designed for AI applications and handles:
 * - JavaScript-heavy sites
 * - Anti-bot mechanisms
 * - Returns clean markdown output
 */

const FIRECRAWL_API = 'https://api.firecrawl.dev/v1';

export interface FirecrawlResult {
  title: string;
  markdown: string;
  metadata: {
    author?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
  };
}

/**
 * Scrape a URL and return its content as markdown
 */
export async function scrapeUrl(url: string): Promise<FirecrawlResult> {
  const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('Firecrawl API key not configured. Set VITE_FIRECRAWL_API_KEY in .env.local');
  }

  console.log('[FirecrawlService] Scraping URL:', url);

  const response = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
    console.error('[FirecrawlService] Scrape failed:', errorMessage);
    throw new Error(`Firecrawl error: ${errorMessage}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Firecrawl scrape failed');
  }

  console.log('[FirecrawlService] Successfully scraped:', data.data?.metadata?.title);

  return {
    title: data.data?.metadata?.title || data.data?.metadata?.ogTitle || 'Untitled',
    markdown: data.data?.markdown || '',
    metadata: data.data?.metadata || {},
  };
}

/**
 * Parse markdown content into sections based on headings
 */
export function parseMarkdownToSections(markdown: string): Array<{ heading: string; content: string }> {
  const sections: Array<{ heading: string; content: string }> = [];

  // Split by markdown headings (# or ##)
  const parts = markdown.split(/^(#{1,2}\s+.+)$/m);

  let currentHeading = 'Introduction';
  let currentContent: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Check if this is a heading
    const headingMatch = trimmed.match(/^#{1,2}\s+(.+)$/);
    if (headingMatch) {
      // Save previous section if it has content
      if (currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n').trim(),
        });
      }
      currentHeading = headingMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(trimmed);
    }
  }

  // Don't forget the last section
  if (currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n').trim(),
    });
  }

  // If no sections found, treat entire content as one section
  if (sections.length === 0 && markdown.trim()) {
    sections.push({
      heading: 'Content',
      content: markdown.trim(),
    });
  }

  return sections;
}

/**
 * Check if Firecrawl is available (API key configured)
 */
export function isFirecrawlAvailable(): boolean {
  return !!import.meta.env.VITE_FIRECRAWL_API_KEY;
}

/**
 * Comprehensive content extraction result
 */
export interface ComprehensiveContent {
  title: string;
  author?: string;
  publishDate?: string;
  description?: string;
  fullMarkdown: string;           // Complete content (not truncated)
  sections: Array<{ heading: string; content: string }>;
  wordCount: number;
  url: string;
}

/**
 * Extract EVERYTHING from a URL - comprehensive content extraction
 * Uses onlyMainContent: false to get the complete page
 */
export async function extractComprehensiveContent(url: string): Promise<ComprehensiveContent> {
  const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error('Firecrawl API key not configured. Set VITE_FIRECRAWL_API_KEY in .env.local');
  }

  console.log('[FirecrawlService] Extracting comprehensive content from:', url);

  const response = await fetch(`${FIRECRAWL_API}/scrape`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      formats: ['markdown'],
      onlyMainContent: false,  // Get EVERYTHING
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
    console.error('[FirecrawlService] Comprehensive scrape failed:', errorMessage);
    throw new Error(`Firecrawl error: ${errorMessage}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Firecrawl scrape failed');
  }

  const markdown = data.data?.markdown || '';
  const metadata = data.data?.metadata || {};

  console.log('[FirecrawlService] Comprehensive extraction complete:', {
    title: metadata.title,
    wordCount: markdown.split(/\s+/).length,
  });

  return {
    title: metadata.title || metadata.ogTitle || 'Untitled',
    author: metadata.author,
    publishDate: metadata.publishedTime || metadata.modifiedTime,
    description: metadata.description || metadata.ogDescription,
    fullMarkdown: markdown,
    sections: parseMarkdownToSections(markdown),
    wordCount: markdown.split(/\s+/).length,
    url,
  };
}
