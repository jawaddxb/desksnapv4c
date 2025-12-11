/**
 * JSON Parsing Helper for AI Responses
 *
 * AI models sometimes return malformed JSON with unescaped quotes,
 * smart quotes, or trailing commas. This helper safely parses JSON
 * from AI responses with repair attempts.
 */

/**
 * Attempt to repair common JSON issues from AI responses.
 * @param text - Raw JSON text that failed to parse
 * @returns Repaired JSON text
 */
function repairJson(text: string): string {
  let repaired = text;

  // 1. Replace smart quotes with regular quotes
  repaired = repaired.replace(/[\u201C\u201D]/g, '"');
  repaired = repaired.replace(/[\u2018\u2019]/g, "'");

  // 2. Replace curly apostrophes
  repaired = repaired.replace(/\u2019/g, "'");

  // 3. Fix trailing commas before } or ]
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');

  // 4. Fix common escape issues - newlines in strings
  // Match string values and escape unescaped newlines within them
  repaired = repaired.replace(
    /"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    (match) => {
      // Replace unescaped newlines within the string
      return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    }
  );

  // 5. Remove any control characters that shouldn't be in JSON
  repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (char) => {
    // Keep escaped versions, remove raw control chars
    if (char === '\n' || char === '\r' || char === '\t') {
      return ''; // Already handled above
    }
    return '';
  });

  return repaired;
}

/**
 * Parse JSON from an AI response, handling common formatting issues.
 * Strips markdown code blocks if present and attempts repair on failure.
 *
 * @param text - Raw text from AI response
 * @returns Parsed JSON object
 * @throws Error if text is empty or JSON cannot be parsed/repaired
 */
export function parseAIJsonResponse<T>(text: string | undefined): T {
  if (!text) {
    throw new Error('No response text from AI');
  }

  // Remove markdown code block wrappers if present
  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Try 1: Direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch (firstError) {
    // Try 2: Repair and retry
    try {
      const repaired = repairJson(cleaned);
      return JSON.parse(repaired) as T;
    } catch (secondError) {
      // Try 3: More aggressive - extract JSON object/array
      try {
        // Find the first { or [ and last } or ]
        const startObj = cleaned.indexOf('{');
        const startArr = cleaned.indexOf('[');
        const start = startObj === -1 ? startArr : (startArr === -1 ? startObj : Math.min(startObj, startArr));

        if (start !== -1) {
          const isArray = cleaned[start] === '[';
          const endChar = isArray ? ']' : '}';
          const end = cleaned.lastIndexOf(endChar);

          if (end > start) {
            const extracted = cleaned.substring(start, end + 1);
            const repairedExtracted = repairJson(extracted);
            return JSON.parse(repairedExtracted) as T;
          }
        }
      } catch {
        // Fall through to error
      }

      // All attempts failed
      const errorMsg = (firstError as Error).message;
      throw new Error(`Failed to parse AI response as JSON: ${errorMsg}`);
    }
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
