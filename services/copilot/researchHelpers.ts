/**
 * Research Helpers
 *
 * Utilities for performing research in the copilot agent.
 * Extracted from copilotAgent.ts for better SRP.
 */

import { GoogleGenAI } from '@google/genai';
import { ResearchResult } from '../../types/ideation';
import { getTextModel } from '../../config';

/**
 * Perform web research using Gemini's grounding
 * In a real implementation, this would use web search APIs
 */
export async function performResearch(
  query: string,
  purpose: string
): Promise<ResearchResult[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Use Gemini to simulate research (in production, use actual search API)
    const response = await ai.models.generateContent({
      model: getTextModel(),
      contents: `You are a research assistant. Find relevant information for this query.

Query: "${query}"
Purpose: ${purpose}

Return 2-3 relevant findings in this JSON format:
[
  {
    "title": "Source title",
    "url": "https://example.com/source",
    "snippet": "Key finding or quote (2-3 sentences)",
    "relevance": "Why this matters for the presentation"
  }
]

Be factual and cite real or realistic sources. Return ONLY valid JSON array.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.replace(/```json|```/g, '').trim();
    if (!text) return [];

    const results = JSON.parse(text) as ResearchResult[];
    console.log(`[Research] Found ${results.length} results for: ${query}`);
    return results;
  } catch (error) {
    console.error('[Research] Error:', error);
    return [];
  }
}
