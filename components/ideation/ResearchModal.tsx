/**
 * ResearchModal Component
 *
 * Full-screen modal for comprehensive research visualization.
 * Features:
 * - Large interactive mind map
 * - Findings list with checkboxes grouped by type
 * - Sources/citations with reliability ratings
 * - Synthesis summary
 * - Selection for creating notes
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { Finding, Citation } from '@/types';
import { ResearchMindMap } from './ResearchMindMap';

// Tab types
type TabId = 'map' | 'findings' | 'sources';

interface ResearchModalProps {
  isOpen: boolean;
  topic: string;
  findings: Finding[];
  citations: Citation[];
  synthesis: string;
  onClose: () => void;
  onCreateNotes: (findings: Finding[]) => void;
  onResearchMore: () => void;
}

// Type icons for findings display
const TYPE_ICONS: Record<string, string> = {
  market: '📊',
  trend: '🔥',
  competitor: '🏢',
  expert: '💬',
  social: '🐦',
};

// Reliability stars component
const ReliabilityStars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? 'text-[#c5a47e]' : 'text-white/20'}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Tab button component
const TabButton: React.FC<{
  id: TabId;
  label: string;
  icon: string;
  activeTab: TabId;
  count?: number;
  onClick: (id: TabId) => void;
}> = ({ id, label, icon, activeTab, count, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
      activeTab === id
        ? 'text-[#c5a47e] border-b-2 border-[#c5a47e]'
        : 'text-white/60 hover:text-white/80'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {count !== undefined && (
      <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/10 rounded">
        {count}
      </span>
    )}
  </button>
);

// Findings list component
const FindingsTab: React.FC<{
  findings: Finding[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}> = ({ findings, selectedIds, onToggle }) => {
  // Group findings by type
  const grouped = useMemo(() => {
    return findings.reduce((acc, finding) => {
      if (!acc[finding.type]) acc[finding.type] = [];
      acc[finding.type].push(finding);
      return acc;
    }, {} as Record<string, Finding[]>);
  }, [findings]);

  if (findings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        No findings available
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      {Object.entries(grouped).map(([type, typeFindings]) => (
        <div key={type}>
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>{TYPE_ICONS[type] || '📄'}</span>
            <span>{type}</span>
            <span className="text-white/30">({typeFindings.length})</span>
          </h3>
          <div className="space-y-2">
            {typeFindings.map((finding) => (
              <label
                key={finding.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedIds.has(finding.id)
                    ? 'bg-[#c5a47e]/20 border border-[#c5a47e]/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(finding.id)}
                  onChange={() => onToggle(finding.id)}
                  className="mt-1 accent-[#c5a47e]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {finding.summary}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                    {finding.metrics && (
                      <span className="text-[#c5a47e] font-medium">
                        {finding.metrics.value}
                      </span>
                    )}
                    {finding.citation.source && (
                      <span>Source: {finding.citation.source}</span>
                    )}
                    {finding.sentiment && (
                      <span
                        className={
                          finding.sentiment === 'positive'
                            ? 'text-green-400'
                            : finding.sentiment === 'negative'
                            ? 'text-red-400'
                            : 'text-white/40'
                        }
                      >
                        {finding.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Sources/Citations tab component
const SourcesTab: React.FC<{ citations: Citation[] }> = ({ citations }) => {
  if (citations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        No sources available
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      {citations.map((citation) => (
        <div
          key={citation.id}
          className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-white/90 font-medium text-sm truncate">
                {citation.title || 'Untitled Source'}
              </h4>
              <p className="text-white/50 text-xs mt-1">
                {citation.source}
              </p>
            </div>
            <ReliabilityStars rating={citation.reliability || 3} />
          </div>
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[#c5a47e] text-xs hover:underline"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
              </svg>
              View Source
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

// Mind map tab component (full-size version)
const MapTab: React.FC<{
  findings: Finding[];
  topic: string;
  onNodeClick: (finding: Finding) => void;
}> = ({ findings, topic, onNodeClick }) => {
  if (findings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40">
        <div className="text-center">
          <div className="text-4xl mb-3">🔬</div>
          <p>Research findings will appear here as a mind map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="h-full" style={{ minHeight: '500px' }}>
        <ResearchMindMap
          findings={findings}
          topic={topic}
          onNodeClick={onNodeClick}
        />
      </div>
    </div>
  );
};

// Main modal component
export const ResearchModal: React.FC<ResearchModalProps> = ({
  isOpen,
  topic,
  findings,
  citations,
  synthesis,
  onClose,
  onCreateNotes,
  onResearchMore,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('map');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(findings.map((f) => f.id))
  );
  const [showFullSynthesis, setShowFullSynthesis] = useState(false);

  const toggleFinding = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(findings.map((f) => f.id)));
  }, [findings]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleCreateNotes = useCallback(() => {
    const selected = findings.filter((f) => selectedIds.has(f.id));
    onCreateNotes(selected);
    onClose();
  }, [findings, selectedIds, onCreateNotes, onClose]);

  const handleNodeClick = useCallback((finding: Finding) => {
    toggleFinding(finding.id);
  }, [toggleFinding]);

  // Truncate synthesis for preview
  const synthesisPreview = useMemo(() => {
    if (!synthesis) return '';
    return synthesis.length > 200 ? synthesis.slice(0, 200) + '...' : synthesis;
  }, [synthesis]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#111111] w-[95vw] h-[90vh] max-w-7xl border border-white/10 rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔬</span>
            <div>
              <h2 className="text-white font-medium">Research: {topic}</h2>
              <p className="text-white/50 text-xs">
                {findings.length} findings • {citations.length} sources
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">
              {selectedIds.size} selected
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-[#c5a47e] hover:underline"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs text-white/50 hover:text-white/70"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              <svg
                className="w-5 h-5 text-white/60"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-white/10">
          <TabButton
            id="map"
            label="Mind Map"
            icon="🗺️"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton
            id="findings"
            label="Findings"
            icon="📋"
            activeTab={activeTab}
            count={findings.length}
            onClick={setActiveTab}
          />
          <TabButton
            id="sources"
            label="Sources"
            icon="🔗"
            activeTab={activeTab}
            count={citations.length}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'map' && (
            <MapTab
              findings={findings}
              topic={topic}
              onNodeClick={handleNodeClick}
            />
          )}
          {activeTab === 'findings' && (
            <FindingsTab
              findings={findings}
              selectedIds={selectedIds}
              onToggle={toggleFinding}
            />
          )}
          {activeTab === 'sources' && <SourcesTab citations={citations} />}
        </div>

        {/* Synthesis Panel */}
        {synthesis && (
          <div className="px-6 py-3 border-t border-white/10 bg-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1">
                  AI Synthesis
                </h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {showFullSynthesis ? synthesis : synthesisPreview}
                </p>
              </div>
              {synthesis.length > 200 && (
                <button
                  onClick={() => setShowFullSynthesis(!showFullSynthesis)}
                  className="text-xs text-[#c5a47e] hover:underline whitespace-nowrap"
                >
                  {showFullSynthesis ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <p className="text-white/50 text-sm">
            {selectedIds.size} of {findings.length} findings selected
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onResearchMore}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Research More
            </button>
            <button
              onClick={handleCreateNotes}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 bg-[#c5a47e] text-black rounded-lg font-medium hover:bg-[#b8956e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.88 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.11-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z" />
              </svg>
              Create {selectedIds.size} Note{selectedIds.size !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchModal;
