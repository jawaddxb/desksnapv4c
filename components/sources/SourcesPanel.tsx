/**
 * SourcesPanel Component
 *
 * Panel for adding and managing video/web sources.
 * Shows URL input, source list with status indicators.
 */

import React, { useState, useCallback } from 'react';
import { Source } from '../../types/ideation';

interface SourcesPanelProps {
  sources: Source[];
  onAddSource: (url: string, type?: 'video' | 'web') => void;
  onRemoveSource: (sourceId: string) => void;
  preset: 'video' | 'web' | 'mixed';
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({
  sources,
  onAddSource,
  onRemoveSource,
  preset,
}) => {
  const [url, setUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddSource(url.trim());
      setUrl('');
    }
  }, [url, onAddSource]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    // Auto-detect if it's a URL and add it directly
    if (pastedText.match(/^https?:\/\//)) {
      e.preventDefault();
      onAddSource(pastedText.trim());
    }
  }, [onAddSource]);

  // Detect source type from URL
  const detectSourceType = (url: string): 'video' | 'web' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'video';
    }
    return 'web';
  };

  // Get placeholder text based on preset
  const getPlaceholder = () => {
    switch (preset) {
      case 'video':
        return 'Paste YouTube URL...';
      case 'web':
        return 'Paste article or web page URL...';
      default:
        return 'Paste YouTube URL or web page...';
    }
  };

  // Get icon for source type
  const SourceIcon = ({ type }: { type: 'video' | 'web' | 'doc' }) => {
    if (type === 'video') {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
      </svg>
    );
  };

  // Status indicator
  const StatusBadge = ({ status }: { status: Source['status'] }) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      ingesting: 'bg-blue-500/20 text-blue-400 animate-pulse',
      ingested: 'bg-green-500/20 text-green-400',
      error: 'bg-red-500/20 text-red-400',
    };

    const labels = {
      pending: 'Pending',
      ingesting: 'Processing...',
      ingested: 'Ready',
      error: 'Error',
    };

    return (
      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="h-[60%] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
          Sources
        </h2>
        <p className="text-xs text-white/40">
          {preset === 'video'
            ? 'Add YouTube videos to extract knowledge from'
            : preset === 'web'
            ? 'Add web pages and articles to analyze'
            : 'Add videos or web pages to build from'}
        </p>
      </div>

      {/* URL Input */}
      <form onSubmit={handleSubmit} className="p-3 border-b border-white/10">
        <div
          className={`relative ${dragOver ? 'ring-2 ring-[#c5a47e]' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const droppedUrl = e.dataTransfer.getData('text');
            if (droppedUrl) onAddSource(droppedUrl);
          }}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handlePaste}
            placeholder={getPlaceholder()}
            className="w-full px-3 py-2 pr-10 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-[#c5a47e] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-[#c5a47e] disabled:opacity-30 disabled:hover:text-white/40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </form>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto">
        {sources.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-white/5 flex items-center justify-center">
              {preset === 'video' ? (
                <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
                </svg>
              )}
            </div>
            <p className="text-white/40 text-sm">
              {preset === 'video'
                ? 'Paste a YouTube URL to get started'
                : 'Paste a URL to analyze'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {sources.map((source) => (
              <div
                key={source.id}
                className="p-3 hover:bg-white/5 group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-white/40 mt-0.5">
                    <SourceIcon type={source.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white truncate">
                        {source.title || extractDomain(source.url)}
                      </span>
                      <StatusBadge status={source.status} />
                    </div>
                    <p className="text-xs text-white/40 truncate">
                      {source.url}
                    </p>
                    {source.metadata?.duration && (
                      <p className="text-xs text-white/30 mt-1">
                        {formatDuration(source.metadata.duration)}
                      </p>
                    )}
                    {source.errorMessage && (
                      <p className="text-xs text-red-400 mt-1">
                        {source.errorMessage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveSource(source.id)}
                    className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>

                {/* Progress bar for ingesting */}
                {source.status === 'ingesting' && (
                  <div className="mt-2 h-1 bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#c5a47e] w-1/3 animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary footer */}
      {sources.length > 0 && (
        <div className="p-3 border-t border-white/10 bg-white/5">
          <div className="flex justify-between text-xs text-white/40">
            <span>
              {sources.filter(s => s.status === 'ingested').length} of {sources.length} processed
            </span>
            <span>
              {sources.filter(s => s.type === 'video').length} videos,{' '}
              {sources.filter(s => s.type === 'web').length} pages
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions

function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export default SourcesPanel;
