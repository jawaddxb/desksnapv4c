/**
 * JSON Parsing Helper for AI Responses
 *
 * AI models sometimes wrap JSON in markdown code blocks.
 * This helper safely parses JSON from AI responses.
 */

/**
 * Parse JSON from an AI response, handling common formatting issues.
 * Strips markdown code blocks if present.
 *
 * @param text - Raw text from AI response
 * @returns Parsed JSON object
 * @throws Error if text is empty or JSON is invalid
 */
export function parseAIJsonResponse<T>(text: string | undefined): T {
  if (!text) {
    throw new Error('No response text from AI');
  }

  // Remove markdown code block wrappers if present
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    throw new Error(`Failed to parse AI response as JSON: ${(error as Error).message}`);
  }
}

/**
 * Safely parse JSON with a fallback value.
 * Returns the fallback if parsing fails instead of throwing.
 *
 * @param text - Raw text from AI response
 * @param fallback - Value to return if parsing fails
 * @returns Parsed JSON or fallback
 */
export function parseAIJsonSafe<T>(text: string | undefined, fallback: T): T {
  try {
    return parseAIJsonResponse<T>(text);
  } catch {
    return fallback;
  }
}
