/**
 * OfflineGate Component
 *
 * Blocks app access when offline.
 * Shows a full-screen error with retry button.
 */

import React from 'react';
import { useNetwork } from '@/contexts/NetworkContext';

interface OfflineGateProps {
  children: React.ReactNode;
}

export const OfflineGate: React.FC<OfflineGateProps> = ({ children }) => {
  const { isOnline, checkConnection } = useNetwork();
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await checkConnection();
    setIsRetrying(false);
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-neutral-900 flex items-center justify-center z-50">
        <div className="text-center max-w-md px-6">
          {/* Offline Icon */}
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-1.414-7.072m0 0L9.88 5.636m-2.828 12.728a9 9 0 01-2.829-2.829"
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white mb-3">
            You're Offline
          </h1>
          <p className="text-neutral-400 mb-8">
            DeckSnap requires an internet connection to work. Please check your connection and try again.
          </p>

          {/* Retry Button */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            {isRetrying ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Checking...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </>
            )}
          </button>

          {/* Help text */}
          <p className="text-neutral-500 text-sm mt-6">
            If the problem persists, please check your network settings or contact support.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OfflineGate;
