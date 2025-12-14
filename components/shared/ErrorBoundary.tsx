/**
 * ErrorBoundary Component
 *
 * React Error Boundary for catching and handling runtime errors in child components.
 * Provides graceful degradation instead of white-screening the entire app.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI when error occurs */
  fallback?: ReactNode;
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Name for error tracking/logging */
  name?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, name } = this.props;

    // Log error to console with boundary name for debugging
    console.error(`[ErrorBoundary${name ? `: ${name}` : ''}] Caught error:`, error);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({ errorInfo });

    // Call optional error handler
    if (onError) {
      onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, showRetry = true, name } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#EDF5F0] rounded-lg border border-red-500/20">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-[#4A5D4A] text-center max-w-md mb-4">
            {name && <span className="block text-xs text-[#8FA58F] mb-1">[{name}]</span>}
            {error?.message || 'An unexpected error occurred'}
          </p>
          {showRetry && (
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-[#6B8E6B] text-white rounded hover:bg-[#5A7A5A] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components.
 * Wraps children in an ErrorBoundary with optional configuration.
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...options} name={options?.name || displayName}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}

/**
 * Minimal error fallback for inline use (e.g., inside cards, panels).
 */
export function MinimalErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded text-sm">
      <AlertTriangle className="w-4 h-4" />
      <span>Error loading content</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-auto text-red-700 hover:text-red-800 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorBoundary;
