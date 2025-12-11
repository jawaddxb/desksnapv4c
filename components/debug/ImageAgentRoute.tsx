/**
 * ImageAgentRoute
 *
 * Dedicated debug route for inspecting the Image Prompt Agent's reasoning,
 * validation scores, and prompt refinements.
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Info,
  FileText,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useDebug } from '../../contexts/DebugContext';
import { ImageAgentDebugPanel } from './ImageAgentDebugPanel';

export function ImageAgentRoute() {
  const { isDebugModeAvailable, agentLogs, actions } = useDebug();
  const [selectedPresentationId, setSelectedPresentationId] = useState<string | null>(null);

  // Get list of presentations with logs
  const presentationIds = useMemo(() => {
    return Array.from(agentLogs.keys());
  }, [agentLogs]);

  // Auto-select first presentation if none selected
  React.useEffect(() => {
    if (!selectedPresentationId && presentationIds.length > 0) {
      setSelectedPresentationId(presentationIds[0]);
    }
  }, [selectedPresentationId, presentationIds]);

  // Get logs for selected presentation
  const selectedLogs = selectedPresentationId ? agentLogs.get(selectedPresentationId) || [] : [];

  if (!isDebugModeAvailable) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Debug Mode Not Available</h1>
          <p className="text-white/50 mb-4">
            Set <code className="bg-white/10 px-2 py-0.5 rounded">VITE_DEBUG_MODE=true</code> in your .env.local
          </p>
          <Link
            to="/app"
            className="px-4 py-2 bg-[#c5a47e] text-black rounded-lg font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/debug"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Image Agent Inspector
              </h1>
              <p className="text-xs text-white/50">View agent reasoning, validation scores, and prompt refinements</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {selectedPresentationId && (
              <button
                onClick={() => {
                  actions.clearAgentLogs(selectedPresentationId);
                  setSelectedPresentationId(null);
                }}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-amber-400">How This Works</strong>
            <p className="text-white/70 mt-0.5">
              The Image Agent validates and refines prompts before image generation.
              Each slide goes through a validation loop (max 3 iterations) to ensure
              the prompt relates to the presentation topic. Prompts scoring below 70
              are automatically rewritten.
            </p>
          </div>
        </div>

        {/* No Logs State */}
        {presentationIds.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Agent Logs Available</h2>
            <p className="text-white/50 max-w-md mx-auto mb-6">
              Agent logs will appear here after you generate images for a presentation.
              The agent validates and refines image prompts to ensure they match your topic.
            </p>
            <Link
              to="/app"
              className="px-4 py-2 bg-[#c5a47e] text-black rounded-lg font-medium inline-flex items-center gap-2"
            >
              Create a Presentation
            </Link>
          </div>
        )}

        {/* Presentation Selector */}
        {presentationIds.length > 0 && (
          <div className="mb-6">
            <label className="text-sm text-white/50 mb-2 block">Select Presentation</label>
            <div className="flex gap-2 flex-wrap">
              {presentationIds.map((id) => {
                const logs = agentLogs.get(id) || [];
                const slideCount = new Set(logs.map(l => l.slideIndex)).size;

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedPresentationId(id)}
                    className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      selectedPresentationId === id
                        ? 'bg-[#c5a47e] text-black'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="font-mono">{id.slice(0, 8)}...</span>
                    <span className="text-xs opacity-70">({slideCount} slides)</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {selectedPresentationId && selectedLogs.length > 0 && (
          <ImageAgentDebugPanel
            presentationId={selectedPresentationId}
            agentLogs={selectedLogs}
          />
        )}

        {/* Empty State for Selected Presentation */}
        {selectedPresentationId && selectedLogs.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-xl">
            <RefreshCw className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No logs found for this presentation</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ImageAgentRoute;
