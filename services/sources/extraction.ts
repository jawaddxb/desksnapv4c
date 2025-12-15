/**
 * Sources Agent Extraction
 *
 * Video, web, and document content extraction helpers.
 */

import { getAIClient } from '../aiClient';
import { scrapeUrl, parseMarkdownToSections, isFirecrawlAvailable } from '../firecrawlService';
import { getTextModel } from '@/config';
import { TranscriptSegment } from '@/types/ideation';
import { getDocument } from '../api/documentService';

/**
 * Extract transcript from YouTube video using Gemini's native video understanding.
 * Gemini fetches and processes the video server-side (no CORS issues).
 */
export async function extractYouTubeTranscript(url: string): Promise<TranscriptSegment[]> {
  const ai = getAIClient();

  try {
    console.log(`[extractYouTubeTranscript] Processing video with Gemini: ${url}`);

    const prompt = `Extract a COMPLETE, EXHAUSTIVE transcript from this YouTube video.

CRITICAL REQUIREMENTS:
1. Extract EVERY piece of spoken content - miss nothing
2. Use small segments (5-15 seconds each) for granular timestamps
3. Include ALL content: main points, examples, anecdotes, statistics, quotes, transitions
4. Cover the ENTIRE video from start to finish

Return a JSON array of transcript segments:
[
  {
    "text": "Complete content of this segment",
    "startTime": 0,
    "endTime": 12,
    "confidence": 0.95
  }
]

VERIFY: Before returning, confirm you have captured the ENTIRE video.
Return ONLY valid JSON array.`;

    const response = await ai.models.generateContent({
      model: getTextModel(),
      contents: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                fileUri: url,
                mimeType: 'video/*',
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) return [];

    const segments = JSON.parse(text) as TranscriptSegment[];
    console.log(`[extractYouTubeTranscript] Extracted ${segments.length} segments`);
    return segments;
  } catch (error) {
    console.error('[extractYouTubeTranscript] Error:', error);
    throw new Error(`Failed to extract transcript: ${error}`);
  }
}

/**
 * Extract content from a web page
 * Uses Firecrawl as primary method (handles JS-heavy/protected sites)
 * Falls back to Gemini urlContext for simple pages or if Firecrawl unavailable
 */
export async function extractWebPageContent(url: string): Promise<{
  title: string;
  author?: string;
  sections: Array<{ heading: string; content: string }>;
}> {
  // Try Firecrawl first (handles enterprise sites like McKinsey)
  if (isFirecrawlAvailable()) {
    try {
      console.log('[extractWebPageContent] Trying Firecrawl...');
      const { title, markdown, metadata } = await scrapeUrl(url);

      if (markdown && markdown.trim().length > 100) {
        const sections = parseMarkdownToSections(markdown);
        console.log('[extractWebPageContent] Firecrawl success:', title, `(${sections.length} sections)`);
        return {
          title,
          author: metadata.author,
          sections,
        };
      }
      console.log('[extractWebPageContent] Firecrawl returned insufficient content, trying Gemini...');
    } catch (firecrawlError) {
      console.warn('[extractWebPageContent] Firecrawl failed:', firecrawlError);
      // Continue to Gemini fallback
    }
  }

  // Fallback to Gemini urlContext
  const ai = getAIClient();

  try {
    console.log('[extractWebPageContent] Trying Gemini urlContext...');
    const response = await ai.models.generateContent({
      model: getTextModel(),
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this web page and extract its content structure.

URL: ${url}

Return JSON:
{
  "title": "Page title",
  "author": "Author if available",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content (summarized if very long)"
    }
  ]
}

Extract all meaningful sections. Summarize long content to ~200 words per section.
Return ONLY valid JSON.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        tools: [{ urlContext: {} }],
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) throw new Error('No response from AI');

    // Check if the response looks like an error message rather than JSON
    if (!text.startsWith('{') && !text.startsWith('[')) {
      const lowerText = text.toLowerCase();
      if (lowerText.includes('unable') || lowerText.includes('cannot access') || lowerText.includes('error')) {
        throw new Error('Unable to access this URL. It may require authentication or be private.');
      }
      throw new Error('Could not extract content from this URL.');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('[extractWebPageContent] Error:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('SyntaxError') || errorMsg.includes('JSON')) {
      throw new Error('Unable to access this URL. It may require authentication or be private.');
    }
    throw new Error(`Failed to extract web content: ${errorMsg}`);
  }
}

/**
 * Extract content from an uploaded document
 * Fetches the already-extracted text from the backend.
 */
export async function extractDocumentContent(documentId: string): Promise<{
  title: string;
  content: string;
  fileType: string;
  tokenCount: number;
  sections: Array<{ heading: string; content: string }>;
}> {
  try {
    console.log(`[extractDocumentContent] Fetching document: ${documentId}`);

    const doc = await getDocument(documentId);

    if (!doc.extractedText) {
      throw new Error('Document has no extracted text. It may still be processing.');
    }

    // Parse the text into sections (simple splitting by double newlines or headers)
    const sections = parseTextToSections(doc.extractedText);

    console.log(`[extractDocumentContent] Success: ${doc.fileName} (${sections.length} sections)`);

    return {
      title: doc.title || doc.fileName,
      content: doc.extractedText,
      fileType: doc.fileType,
      tokenCount: doc.tokenCount,
      sections,
    };
  } catch (error) {
    console.error('[extractDocumentContent] Error:', error);
    throw new Error(`Failed to extract document content: ${error}`);
  }
}

/**
 * Parse plain text into sections based on markdown headers or paragraph breaks.
 */
function parseTextToSections(text: string): Array<{ heading: string; content: string }> {
  const sections: Array<{ heading: string; content: string }> = [];

  // Try to split by markdown headers
  const headerPattern = /^#{1,3}\s+(.+)$/gm;
  let lastIndex = 0;
  let currentHeading = 'Introduction';
  let match;

  while ((match = headerPattern.exec(text)) !== null) {
    // Save content before this header
    if (match.index > lastIndex) {
      const content = text.slice(lastIndex, match.index).trim();
      if (content) {
        sections.push({ heading: currentHeading, content });
      }
    }
    currentHeading = match[1];
    lastIndex = match.index + match[0].length;
  }

  // Add remaining content
  const remaining = text.slice(lastIndex).trim();
  if (remaining) {
    sections.push({ heading: currentHeading, content: remaining });
  }

  // If no headers found, split by paragraphs
  if (sections.length === 0) {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    if (paragraphs.length > 0) {
      // Group paragraphs into sections of ~500 words
      let currentContent = '';
      let sectionIndex = 1;

      for (const para of paragraphs) {
        currentContent += para + '\n\n';
        if (currentContent.split(/\s+/).length > 500) {
          sections.push({
            heading: `Section ${sectionIndex}`,
            content: currentContent.trim(),
          });
          currentContent = '';
          sectionIndex++;
        }
      }

      if (currentContent.trim()) {
        sections.push({
          heading: sectionIndex === 1 ? 'Content' : `Section ${sectionIndex}`,
          content: currentContent.trim(),
        });
      }
    }
  }

  return sections.length > 0 ? sections : [{ heading: 'Content', content: text }];
}
