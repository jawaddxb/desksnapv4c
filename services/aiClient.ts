/**
 * AI Client Singleton
 *
 * Provides a single, reusable instance of the GoogleGenAI client.
 * This follows the Singleton pattern to:
 * - Avoid creating multiple expensive client instances
 * - Enable easy mocking for tests
 * - Centralize API key management
 */

import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

/**
 * Get the singleton AI client instance.
 * Creates the client on first call, returns cached instance on subsequent calls.
 */
export const getAIClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('No API key found. Set GEMINI_API_KEY in your .env.local file.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

/**
 * Reset the AI client instance.
 * Useful for testing or when API key changes.
 */
export const resetAIClient = (): void => {
  aiClient = null;
};

/**
 * Check if an API key is configured.
 */
export const hasApiKey = (): boolean => {
  return !!(process.env.API_KEY || process.env.GEMINI_API_KEY);
};
