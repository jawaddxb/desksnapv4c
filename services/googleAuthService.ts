/**
 * Google OAuth Service
 *
 * Handles Google OAuth 2.0 authentication for Google Slides and Drive API access.
 * Uses Google Identity Services (GIS) for modern OAuth flow.
 */

// Type declarations for Google APIs
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
        };
      };
    };
    gapi?: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { apiKey?: string; discoveryDocs?: string[] }) => Promise<void>;
        getToken: () => GoogleToken | null;
        setToken: (token: GoogleToken | null) => void;
        slides: {
          presentations: {
            create: (params: { title: string }) => Promise<{ result: { presentationId: string } }>;
            get: (params: { presentationId: string }) => Promise<{ result: unknown }>;
            batchUpdate: (params: { presentationId: string; requests: unknown[] }) => Promise<{ result: unknown }>;
          };
        };
        drive: {
          files: {
            create: (params: { resource: { name: string; mimeType: string }; media: { mimeType: string; body: Blob }; fields: string }) => Promise<{ result: { id: string } }>;
          };
        };
      };
    };
  }
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: TokenResponse) => void;
  error_callback?: (error: { type: string; message: string }) => void;
}

interface TokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface GoogleToken {
  access_token: string;
  expires_in?: number;
}

// Required scopes for Google Slides and Drive
const SCOPES = [
  'https://www.googleapis.com/auth/presentations',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

// Discovery docs for API initialization
const DISCOVERY_DOCS = [
  'https://slides.googleapis.com/$discovery/rest?version=v1',
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
];

// Token storage key
const TOKEN_KEY = 'decksnap_google_token';

let tokenClient: TokenClient | null = null;
let gapiInitialized = false;
let gsiInitialized = false;

/**
 * Check if Google OAuth is configured (Client ID is set)
 */
export function isGoogleConfigured(): boolean {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return typeof clientId === 'string' && clientId.trim().length > 0;
}

/**
 * Get stored access token from localStorage
 */
function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const { token, expiresAt } = JSON.parse(stored);
      // Check if token is still valid (with 5 min buffer)
      if (expiresAt && Date.now() < expiresAt - 5 * 60 * 1000) {
        return token;
      }
      // Token expired, remove it
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Store access token in localStorage
 */
function storeToken(token: string, expiresIn: number): void {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }));
}

/**
 * Initialize GAPI client library
 */
async function initGapiClient(): Promise<void> {
  if (gapiInitialized) return;

  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('Google API not loaded. Please refresh the page.'));
      return;
    }

    window.gapi.load('client', async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        await window.gapi!.client.init({
          apiKey: apiKey || undefined,
          discoveryDocs: DISCOVERY_DOCS,
        });

        // Restore token if available
        const storedToken = getStoredToken();
        if (storedToken) {
          window.gapi!.client.setToken({ access_token: storedToken });
        }

        gapiInitialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Initialize Google Identity Services token client
 */
function initTokenClient(): void {
  if (gsiInitialized) return;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.warn('Google Client ID not configured. Google Slides export will not work.');
    return;
  }

  if (!window.google?.accounts?.oauth2) {
    console.warn('Google Identity Services not loaded. Please refresh the page.');
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: () => {}, // Will be set during authentication
    error_callback: (error) => {
      console.error('Google auth error:', error);
    },
  });

  gsiInitialized = true;
}

/**
 * Initialize all Google services
 */
export async function initGoogleServices(): Promise<void> {
  initTokenClient();
  await initGapiClient();
}

/**
 * Check if user is authenticated with Google
 */
export function isGoogleAuthenticated(): boolean {
  const storedToken = getStoredToken();
  if (storedToken) return true;

  if (gapiInitialized && window.gapi?.client) {
    const token = window.gapi.client.getToken();
    return token !== null && token.access_token !== undefined;
  }

  return false;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  const storedToken = getStoredToken();
  if (storedToken) return storedToken;

  if (window.gapi?.client) {
    const token = window.gapi.client.getToken();
    return token?.access_token || null;
  }

  return null;
}

/**
 * Authenticate with Google
 */
export function authenticate(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      initTokenClient();
    }

    if (!tokenClient) {
      reject(new Error('Google Slides export requires API credentials. Please add VITE_GOOGLE_CLIENT_ID to your .env.local file.'));
      return;
    }

    // Create a new token client with the callback
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response: TokenResponse) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }

        // Store token
        storeToken(response.access_token, response.expires_in);

        // Set token on gapi client
        if (window.gapi?.client) {
          window.gapi.client.setToken({ access_token: response.access_token });
        }

        resolve(response.access_token);
      },
      error_callback: (error) => {
        reject(new Error(error.message || 'Authentication failed'));
      },
    });

    // Request access token
    tokenClient.requestAccessToken({ prompt: '' });
  });
}

/**
 * Sign out from Google
 */
export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY);
  if (window.gapi?.client) {
    window.gapi.client.setToken(null);
  }
}

/**
 * Ensure user is authenticated, prompting if necessary
 */
export async function ensureAuthenticated(): Promise<string> {
  // Initialize if not already
  if (!gapiInitialized) {
    await initGoogleServices();
  }

  // Check existing token
  const existingToken = getAccessToken();
  if (existingToken) {
    return existingToken;
  }

  // Prompt for authentication
  return authenticate();
}
