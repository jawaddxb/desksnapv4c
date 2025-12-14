/**
 * MobileViewRoute Component
 *
 * Standalone route for mobile presentation viewing.
 * Loads presentation by ID from URL and renders MobileViewCoordinator.
 *
 * Route: /mobile/:presentationId
 *
 * This allows:
 * - Shareable URLs for mobile viewing
 * - QR code scanning from desktop to phone
 * - Standalone mobile presentation experience
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Presentation, Theme } from '@/types';
import { getPresentation } from '@/services/api/presentationService';
import { THEMES } from '@/config/themes';
import { MobileViewCoordinator } from './MobileViewCoordinator';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

type LoadingState = 'loading' | 'success' | 'error' | 'not-found';

/**
 * MobileViewRoute
 *
 * Fetches presentation and renders mobile view.
 * Handles loading, error, and not-found states.
 */
export const MobileViewRoute: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();

  const [state, setState] = useState<LoadingState>('loading');
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPresentation = async () => {
      if (!presentationId) {
        setState('not-found');
        return;
      }

      try {
        setState('loading');
        const loadedPresentation = await getPresentation(presentationId);

        if (!loadedPresentation) {
          setState('not-found');
          return;
        }

        // Get theme (default to first theme if not found)
        const loadedTheme = THEMES[loadedPresentation.themeId] || Object.values(THEMES)[0];

        setPresentation(loadedPresentation);
        setTheme(loadedTheme);
        setState('success');
      } catch (err) {
        console.error('Failed to load presentation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load presentation');
        setState('error');
      }
    };

    loadPresentation();
  }, [presentationId]);

  const handleExit = () => {
    // Navigate back or to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-white/60 text-sm">Loading presentation...</p>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-900 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-white text-xl font-bold mb-2">Unable to Load</h1>
        <p className="text-white/60 text-sm mb-6">{error || 'Something went wrong'}</p>
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  // Not found state
  if (state === 'not-found') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-900 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <span className="text-3xl">?</span>
        </div>
        <h1 className="text-white text-xl font-bold mb-2">Presentation Not Found</h1>
        <p className="text-white/60 text-sm mb-6">
          This presentation may have been deleted or the link is invalid.
        </p>
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  // Success state - render mobile view
  // Note: showDeviceFrame=false because this route is accessed via URL (either on actual mobile or direct browser)
  if (presentation && theme) {
    return (
      <MobileViewCoordinator
        presentation={presentation}
        theme={theme}
        onExit={handleExit}
        showDeviceFrame={false}
      />
    );
  }

  // Fallback (shouldn't reach here)
  return null;
};

export default MobileViewRoute;
