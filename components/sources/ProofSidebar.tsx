/**
 * ProofSidebar Component
 *
 * Displays proof links (citations/sources) for a selected note.
 * Shows timestamps for videos, section anchors for web pages,
 * and excerpts/quotes from the source material.
 */

import React from 'react';
import { IdeaNote, Source, ProofLink } from '../../types/ideation';

interface ProofSidebarProps {
  note: IdeaNote;
  sources: Source[];
  onClose: () => void;
}

export const ProofSidebar: React.FC<ProofSidebarProps> = ({
  note,
  sources,
  onClose,
}) => {
  const proofLinks = note.proofLinks || [];

  // Get source by ID
  const getSource = (sourceId: string): Source | undefined => {
    return sources.find(s => s.id === sourceId);
  };

  // Format timestamp for display
  const formatTimestamp = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate YouTube URL with timestamp
  const getYouTubeTimestampUrl = (url: string, startTime?: number): string => {
    if (!startTime) return url;

    try {
      const videoUrl = new URL(url);
      const videoId = videoUrl.searchParams.get('v') ||
        url.match(/youtu\.be\/([^?]+)/)?.[1];

      if (videoId) {
        return `https://youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}`;
      }
    } catch {
      // Return original URL if parsing fails
    }
    return url;
  };

  // Confidence indicator
  const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
    const percent = Math.round(confidence * 100);
    const color = confidence >= 0.8
      ? 'text-green-400'
      : confidence >= 0.6
      ? 'text-yellow-400'
      : 'text-red-400';

    return (
      <span className={`text-[10px] ${color}`}>
        {percent}% confidence
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Sources
          </h2>
          <p className="text-xs text-white/40 mt-0.5">
            {proofLinks.length} citation{proofLinks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-white/40 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      {/* Note preview */}
      <div className="p-3 border-b border-white/10 bg-white/5">
        <p className="text-sm text-white/80 line-clamp-3">
          {note.content}
        </p>
        {note.knowledgeType && (
          <span className="mt-2 inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider bg-[#c5a47e]/20 text-[#c5a47e]">
            {note.knowledgeType}
          </span>
        )}
      </div>

      {/* Proof links list */}
      <div className="flex-1 overflow-y-auto">
        {proofLinks.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-white/5 flex items-center justify-center">
              <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
            </div>
            <p className="text-white/40 text-sm">
              No sources linked to this note
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {proofLinks.map((link, index) => {
              const source = getSource(link.sourceId);

              return (
                <div key={index} className="p-4">
                  {/* Source info */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-white/40 mt-0.5">
                      {source?.type === 'video' ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {source?.title || source?.metadata?.author || 'Unknown source'}
                      </p>
                      <ConfidenceBadge confidence={link.confidence} />
                    </div>
                  </div>

                  {/* Timestamp for videos */}
                  {source?.type === 'video' && link.startTime !== undefined && (
                    <a
                      href={getYouTubeTimestampUrl(source.url, link.startTime)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-red-500/10 hover:bg-red-500/20 transition-colors mb-3 group"
                    >
                      <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                      <span className="text-sm text-red-400 group-hover:text-red-300">
                        {formatTimestamp(link.startTime)}
                        {link.endTime && ` - ${formatTimestamp(link.endTime)}`}
                      </span>
                      <svg className="w-3 h-3 text-red-400/50 ml-auto" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                    </a>
                  )}

                  {/* Section anchor for web pages */}
                  {source?.type === 'web' && link.sectionAnchor && (
                    <div className="flex items-center gap-2 p-2 bg-blue-500/10 mb-3">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                      </svg>
                      <span className="text-sm text-blue-400">
                        Section: {link.sectionAnchor}
                      </span>
                    </div>
                  )}

                  {/* Excerpt quote */}
                  {link.excerpt && (
                    <blockquote className="pl-3 border-l-2 border-[#c5a47e]/50 text-sm text-white/60 italic">
                      "{link.excerpt}"
                    </blockquote>
                  )}

                  {/* Source URL link */}
                  {source?.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
                    >
                      <span className="truncate">{extractDomain(source.url)}</span>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                      </svg>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer summary */}
      {proofLinks.length > 0 && (
        <div className="p-3 border-t border-white/10 bg-white/5">
          <div className="flex justify-between text-xs text-white/40">
            <span>
              {proofLinks.filter(l => l.startTime !== undefined).length} video clips
            </span>
            <span>
              Avg confidence:{' '}
              {Math.round(
                (proofLinks.reduce((sum, l) => sum + l.confidence, 0) / proofLinks.length) * 100
              )}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
function extractDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default ProofSidebar;
