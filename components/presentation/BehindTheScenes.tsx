/**
 * BehindTheScenes
 *
 * Full-page view showing the complete creative journey from ideation to final deck.
 * Accessible from deck header when a deck is linked to an ideation session.
 */

import React from 'react';
import { Presentation } from '../../types';
import { IdeationSession, COLUMNS, JournalEntry } from '../../types/ideation';
import { THEMES } from '../../config/themes';
import { CreativeJournal } from '../ideation/CreativeJournal';
import {
  X,
  Lightbulb,
  ArrowRight,
  FileText,
  Palette,
  Layout,
  Type,
  Image,
  Clock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface BehindTheScenesProps {
  presentation: Presentation;
  ideation: IdeationSession | null;
  onClose: () => void;
}

export const BehindTheScenes: React.FC<BehindTheScenesProps> = ({
  presentation,
  ideation,
  onClose,
}) => {
  const theme = THEMES[presentation.themeId] || THEMES.executive;

  // Build creative journey timeline
  const journeySteps = [
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Ideation',
      subtitle: ideation ? `${ideation.notes.length} ideas captured` : 'Direct creation',
      completed: true,
      timestamp: ideation?.createdAt || presentation.createdAt,
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: 'Theme Selection',
      subtitle: `${theme.name}`,
      completed: true,
      timestamp: presentation.createdAt,
    },
    {
      icon: <Layout className="w-5 h-5" />,
      title: 'Layout Design',
      subtitle: `${presentation.slides.length} unique slides`,
      completed: true,
      timestamp: presentation.createdAt,
    },
    {
      icon: <Type className="w-5 h-5" />,
      title: 'Content Generation',
      subtitle: 'AI-crafted messaging',
      completed: true,
      timestamp: presentation.createdAt,
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: 'Visual Assets',
      subtitle: `${presentation.slides.filter(s => s.imageUrl).length} images generated`,
      completed: presentation.slides.some(s => s.imageUrl),
      timestamp: presentation.lastModified,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#111111] overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#c5a47e]/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#c5a47e]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Behind the Scenes</h1>
            <p className="text-xs text-white/50">{presentation.topic}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {/* Journey overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-light text-white mb-6">Creative Journey</h2>

            {/* Timeline */}
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/10" />

              {journeySteps.map((step, idx) => (
                <div key={idx} className="relative flex gap-4 mb-6 last:mb-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      step.completed
                        ? 'bg-[#c5a47e]/20 text-[#c5a47e]'
                        : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {step.completed ? step.icon : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{step.title}</h3>
                      {step.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-white/50">{step.subtitle}</p>
                    <span className="text-[10px] text-white/30 mt-1 block">
                      {new Date(step.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Ideation summary */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-[#c5a47e]" />
                <h2 className="text-lg font-bold text-white">Source Ideas</h2>
              </div>

              {ideation ? (
                <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                  {/* Ideation topic */}
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-medium text-white mb-2">{ideation.topic}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{ideation.notes.length} notes</span>
                      <span>{ideation.connections.length} connections</span>
                    </div>
                  </div>

                  {/* Notes by column */}
                  <div className="p-4 space-y-4">
                    {COLUMNS.map((col, colIdx) => {
                      const colNotes = ideation.notes.filter(n => n.column === colIdx);
                      if (colNotes.length === 0) return null;

                      return (
                        <div key={col}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                              {col}
                            </span>
                            <span className="text-[10px] text-white/30">
                              ({colNotes.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {colNotes.slice(0, 3).map((note) => (
                              <div
                                key={note.id}
                                className="p-2 bg-white/5 rounded text-xs text-white/70 line-clamp-2"
                              >
                                {note.content}
                              </div>
                            ))}
                            {colNotes.length > 3 && (
                              <p className="text-[10px] text-white/30">
                                +{colNotes.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Link to ideation */}
                  {ideation.generatedPresentationIds && ideation.generatedPresentationIds.length > 1 && (
                    <div className="p-4 border-t border-white/10 bg-black/30">
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {ideation.generatedPresentationIds.length} decks generated from this ideation
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-black/30 border border-white/10 rounded-lg p-8 text-center">
                  <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                  <p className="text-white/50 text-sm">
                    This deck was created directly without an ideation session.
                  </p>
                  <p className="text-white/30 text-xs mt-2">
                    Use the Ideate mode to brainstorm and structure ideas before creating a deck.
                  </p>
                </div>
              )}
            </section>

            {/* Right: Theme & Style decisions */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[#c5a47e]" />
                <h2 className="text-lg font-bold text-white">Design Choices</h2>
              </div>

              <div className="space-y-4">
                {/* Theme card */}
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div>
                      <h3 className="font-medium text-white">{theme.name}</h3>
                      <p className="text-xs text-white/50">{theme.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.background].map(
                      (color, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded border border-white/20"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Visual style */}
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                    Visual Style
                  </h4>
                  <p className="text-sm text-white/70">
                    {presentation.visualStyle || theme.imageStyle || 'Default theme style'}
                  </p>
                </div>

                {/* Layout distribution */}
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                    Layout Distribution
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(
                      presentation.slides.reduce((acc: Record<string, number>, slide) => {
                        const layout = slide.layoutType || 'split';
                        acc[layout] = (acc[layout] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([layout, count]) => (
                      <div key={layout} className="flex items-center gap-3">
                        <span className="text-xs text-white/50 w-24 capitalize">{layout}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#c5a47e] rounded-full"
                            style={{
                              width: `${(count / presentation.slides.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/40 w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Creative Journal (full width) */}
          {ideation?.creativeJournal && ideation.creativeJournal.entries.length > 0 && (
            <section className="mt-12">
              <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
                <CreativeJournal
                  journal={ideation.creativeJournal}
                  variant="full"
                  isExpanded={true}
                />
              </div>
            </section>
          )}

          {/* Slide breakdown */}
          <section className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <Layout className="w-5 h-5 text-[#c5a47e]" />
              <h2 className="text-lg font-bold text-white">Slide Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentation.slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="bg-black/30 border border-white/10 rounded-lg p-4 hover:border-[#c5a47e]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Slide {idx + 1}
                    </span>
                    <span className="text-[10px] text-white/30 capitalize px-2 py-0.5 bg-white/5 rounded">
                      {slide.layoutType || 'split'}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-white line-clamp-1 mb-1">
                    {slide.title}
                  </h4>
                  <p className="text-xs text-white/50 line-clamp-2">
                    {slide.content?.[0] || slide.speakerNotes || 'No content'}
                  </p>
                  {slide.imagePrompt && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-[10px] text-white/30 line-clamp-1 flex items-center gap-1">
                        <Image className="w-3 h-3" />
                        {slide.imagePrompt}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-xs text-white/30">
              Created with DeckSnap AI &middot; {new Date(presentation.createdAt).toLocaleDateString()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BehindTheScenes;
