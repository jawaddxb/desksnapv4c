/**
 * CollapsibleSourcesList Component
 *
 * A compact, collapsible list of sources with status indicators.
 * Designed to save vertical space while still showing source progress.
 */

import React, { useState } from 'react';
import { Source } from '../../types/ideation';
import { ChevronDown, ChevronUp, Video, Globe, FileText, X, Loader2 } from 'lucide-react';

interface CollapsibleSourcesListProps {
  sources: Source[];
  onRemoveSource: (sourceId: string) => void;
}

export const CollapsibleSourcesList: React.FC<CollapsibleSourcesListProps> = ({
  sources,
  onRemoveSource,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate summary stats
  const totalCount = sources.length;
  const readyCount = sources.filter(s => s.status === 'ingested').length;
  const errorCount = sources.filter(s => s.status === 'error').length;
  const processingCount = sources.filter(s => s.status === 'ingesting').length;
  const videoCount = sources.filter(s => s.type === 'video').length;
  const webCount = sources.filter(s => s.type === 'web').length;

  if (totalCount === 0) {
    return null;
  }

  // Get source icon
  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-3 h-3 text-red-400" />;
      case 'web':
        return <Globe className="w-3 h-3 text-blue-400" />;
      default:
        return <FileText className="w-3 h-3 text-white/40" />;
    }
  };

  // Get status indicator color
  const getStatusColor = (status: Source['status']) => {
    switch (status) {
      case 'ingested':
        return 'bg-green-500';
      case 'ingesting':
        return 'bg-blue-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="border-b border-white/10">
      {/* Summary header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {/* Status dots */}
            {processingCount > 0 && (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            )}
            {errorCount > 0 && (
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            )}
            {readyCount > 0 && processingCount === 0 && errorCount === 0 && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </div>

          <span className="text-sm font-medium text-white">
            {readyCount} of {totalCount} ready
          </span>

          {/* Source type breakdown */}
          <span className="text-xs text-white/40">
            {videoCount > 0 && `${videoCount} video${videoCount > 1 ? 's' : ''}`}
            {videoCount > 0 && webCount > 0 && ', '}
            {webCount > 0 && `${webCount} page${webCount > 1 ? 's' : ''}`}
          </span>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/40" />
        )}
      </button>

      {/* Expanded list */}
      {isExpanded && (
        <div className="max-h-48 overflow-y-auto">
          {sources.map((source) => (
            <div
              key={source.id}
              className="px-4 py-2 flex items-center gap-3 hover:bg-white/5 group"
            >
              {/* Status indicator */}
              <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(source.status)}`} />

              {/* Source icon */}
              {getSourceIcon(source.type)}

              {/* Source info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 truncate">
                  {source.title || extractDomain(source.url)}
                </p>
                {source.status === 'error' && source.errorMessage && (
                  <p className="text-[10px] text-red-400 truncate">
                    {source.errorMessage}
                  </p>
                )}
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSource(source.id);
                }}
                className="p-1 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper to extract domain from URL
function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default CollapsibleSourcesList;
