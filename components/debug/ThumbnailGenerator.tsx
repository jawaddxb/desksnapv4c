/**
 * ThumbnailGenerator
 *
 * Debug page for generating theme and archetype thumbnails.
 * Allows batch generation and individual captures.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { THEMES, getThemeIds, THEME_CATEGORIES } from '../../config/themes';
import { WABI_SABI_LAYOUT_NAMES } from '../WabiSabiStage';
import { SAMPLE_SLIDE } from './sampleSlideData';
import { ThumbnailPreviewContainer } from './ThumbnailPreviewContainer';
import {
  downloadBlob,
  canvasToBlob,
  getThemeThumbnailPath,
  getArchetypeThumbnailPath,
  downloadAsZip,
} from '../../services/thumbnailService';
import { Theme, Slide } from '../../types';

// ============ Types ============

type GenerationMode = 'themes' | 'archetypes';
type GenerationStatus = 'idle' | 'generating' | 'complete' | 'error';

interface GenerationProgress {
  total: number;
  completed: number;
  current: string | null;
  errors: string[];
}

// ============ Component ============

export function ThumbnailGenerator() {
  // State
  const [mode, setMode] = useState<GenerationMode>('themes');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState<GenerationProgress>({
    total: 0,
    completed: 0,
    current: null,
    errors: [],
  });
  const [generatedBlobs, setGeneratedBlobs] = useState<Array<{ id: string; blob: Blob }>>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<{ id: string; theme: Theme; archetype?: string } | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  // Data
  const themeIds = getThemeIds();
  const archetypeIds = WABI_SABI_LAYOUT_NAMES;

  // Get current items based on mode
  const currentItems = mode === 'themes' ? themeIds : archetypeIds;

  // ============ Capture Logic ============

  const captureContainer = useCallback(async (): Promise<Blob | null> => {
    if (!containerRef.current) return null;

    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      // Scale to 400x300
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = 400;
      outputCanvas.height = 300;
      const ctx = outputCanvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(canvas, 0, 0, 400, 300);

      return await canvasToBlob(outputCanvas, 0.92);
    } catch (err) {
      console.error('Capture error:', err);
      return null;
    }
  }, []);

  // ============ Generation ============

  const generateAll = useCallback(async () => {
    abortRef.current = false;
    setStatus('generating');
    setGeneratedBlobs([]);

    const items = mode === 'themes' ? themeIds : archetypeIds;
    const results: Array<{ id: string; blob: Blob }> = [];
    const errors: string[] = [];

    setProgress({
      total: items.length,
      completed: 0,
      current: null,
      errors: [],
    });

    for (let i = 0; i < items.length; i++) {
      if (abortRef.current) break;

      const id = items[i];
      const theme = mode === 'themes' ? THEMES[id] : THEMES.neoBrutalist;

      setProgress((prev) => ({
        ...prev,
        completed: i,
        current: id,
      }));

      // Set preview item to trigger render
      setPreviewItem({
        id,
        theme,
        archetype: mode === 'archetypes' ? id : undefined,
      });

      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture
      const blob = await captureContainer();

      if (blob) {
        results.push({ id, blob });
      } else {
        errors.push(id);
      }

      setProgress((prev) => ({
        ...prev,
        errors: [...errors],
      }));
    }

    setGeneratedBlobs(results);
    setProgress((prev) => ({
      ...prev,
      completed: items.length,
      current: null,
    }));
    setStatus(errors.length === 0 ? 'complete' : 'error');
    setPreviewItem(null);
  }, [mode, themeIds, archetypeIds, captureContainer]);

  const cancelGeneration = useCallback(() => {
    abortRef.current = true;
    setStatus('idle');
  }, []);

  // ============ Download ============

  const downloadAll = useCallback(async () => {
    if (generatedBlobs.length === 0) return;

    const folder = mode === 'themes' ? 'themes' : 'archetypes';
    const files = generatedBlobs.map(({ id, blob }) => ({
      name: `${folder}/${id}.png`,
      blob,
    }));

    await downloadAsZip(files, `decksnap-${folder}-thumbnails.zip`);
  }, [generatedBlobs, mode]);

  const downloadSingle = useCallback(
    async (id: string) => {
      const theme = mode === 'themes' ? THEMES[id] : THEMES.neoBrutalist;

      setPreviewItem({
        id,
        theme,
        archetype: mode === 'archetypes' ? id : undefined,
      });

      await new Promise((resolve) => setTimeout(resolve, 200));

      const blob = await captureContainer();

      if (blob) {
        const folder = mode === 'themes' ? 'themes' : 'archetypes';
        downloadBlob(blob, `${folder}-${id}.png`);
      }

      setPreviewItem(null);
    },
    [mode, captureContainer]
  );

  // ============ Render ============

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
              <h1 className="text-lg font-bold">Thumbnail Generator</h1>
              <p className="text-xs text-white/50">
                Generate preview thumbnails for themes and archetypes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview ? 'bg-[#c5a47e] text-black' : 'hover:bg-white/10'
              }`}
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setMode('themes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'themes'
                ? 'bg-[#c5a47e] text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Themes ({themeIds.length})
          </button>
          <button
            onClick={() => setMode('archetypes')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'archetypes'
                ? 'bg-[#c5a47e] text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Archetypes ({archetypeIds.length})
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold">Batch Generation</h2>
              <p className="text-sm text-white/50">
                Generate all {mode === 'themes' ? 'theme' : 'archetype'} thumbnails at once
              </p>
            </div>

            <div className="flex items-center gap-3">
              {status === 'generating' ? (
                <button
                  onClick={cancelGeneration}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={generateAll}
                  disabled={status === 'generating'}
                  className="px-4 py-2 bg-[#c5a47e] text-black rounded-lg font-medium hover:bg-[#d4b38f] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Generate All
                </button>
              )}

              {generatedBlobs.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-colors"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download ZIP ({generatedBlobs.length})
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          {status === 'generating' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                  Generating: {progress.current || '...'}
                </span>
                <span className="text-white/50">
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c5a47e] transition-all duration-300"
                  style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Status */}
          {status === 'complete' && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>Generation complete! {generatedBlobs.length} thumbnails ready.</span>
            </div>
          )}

          {status === 'error' && progress.errors.length > 0 && (
            <div className="flex items-start gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span>Completed with {progress.errors.length} errors:</span>
                <div className="text-sm text-white/50 mt-1">
                  {progress.errors.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {currentItems.map((id) => {
            const theme = mode === 'themes' ? THEMES[id] : THEMES.neoBrutalist;
            const hasGenerated = generatedBlobs.some((b) => b.id === id);
            const thumbnailPath =
              mode === 'themes' ? getThemeThumbnailPath(id) : getArchetypeThumbnailPath(id);

            return (
              <div
                key={id}
                className="group relative bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
              >
                {/* Preview */}
                <div
                  className="aspect-[4/3] relative"
                  style={{ background: theme.colors.background }}
                >
                  {/* Show color preview */}
                  <div className="absolute inset-0 flex flex-col p-2">
                    <div
                      className="text-xs font-bold truncate"
                      style={{
                        color: theme.colors.text,
                        fontFamily: theme.fonts.heading,
                      }}
                    >
                      {mode === 'themes' ? theme.name : id}
                    </div>
                    <div className="mt-auto flex gap-1">
                      {['background', 'surface', 'text', 'accent'].map((key) => (
                        <div
                          key={key}
                          className="w-3 h-3 rounded-sm"
                          style={{ background: theme.colors[key as keyof typeof theme.colors] }}
                          title={key}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Generated indicator */}
                  {hasGenerated && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => downloadSingle(id)}
                      className="px-3 py-1.5 bg-[#c5a47e] text-black rounded text-sm font-medium"
                    >
                      <Download className="w-3 h-3 inline mr-1" />
                      Generate
                    </button>
                  </div>
                </div>

                {/* Label */}
                <div className="p-2">
                  <div className="text-xs font-medium truncate">{id}</div>
                  {mode === 'themes' && (
                    <div className="text-[10px] text-white/40 truncate">{theme.description}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Hidden preview container for capture */}
      {previewItem && (
        <ThumbnailPreviewContainer
          ref={containerRef}
          slide={SAMPLE_SLIDE}
          theme={previewItem.theme}
          mode={previewItem.archetype ? 'archetype' : 'theme'}
          archetypeName={previewItem.archetype}
          visible={showPreview}
        />
      )}
    </div>
  );
}

export default ThumbnailGenerator;
