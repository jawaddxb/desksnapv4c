/**
 * BehindTheScenes
 *
 * Full-page view showing the complete creative journey from ideation to final deck.
 * Accessible from deck header when a deck is linked to an ideation session.
 */

import React from 'react';
import { Presentation } from '@/types';
import { IdeationSession, COLUMNS, JournalEntry } from '@/types/ideation';
import { THEMES } from '@/config/themes';
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
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-[#D4E5D4] flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#6B8E6B]/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#6B8E6B]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1E2E1E]">Behind the Scenes</h1>
            <p className="text-xs text-[#8FA58F]">{presentation.topic}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {/* Journey overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-light text-[#1E2E1E] mb-6">Creative Journey</h2>

            {/* Timeline */}
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-[#D4E5D4]" />

              {journeySteps.map((step, idx) => (
                <div key={idx} className="relative flex gap-4 mb-6 last:mb-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      step.completed
                        ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]'
                        : 'bg-[#EDF5F0] text-[#8FA58F]'
                    }`}
                  >
                    {step.completed ? step.icon : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 py-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[#1E2E1E]">{step.title}</h3>
                      {step.completed && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-[#8FA58F]">{step.subtitle}</p>
                    <span className="text-[10px] text-[#8FA58F] mt-1 block">
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
                <Lightbulb className="w-5 h-5 text-[#6B8E6B]" />
                <h2 className="text-lg font-bold text-[#1E2E1E]">Source Ideas</h2>
              </div>

              {ideation ? (
                <div className="bg-white border border-[#D4E5D4] rounded-lg overflow-hidden">
                  {/* Ideation topic */}
                  <div className="p-4 border-b border-[#D4E5D4]">
                    <h3 className="font-medium text-[#1E2E1E] mb-2">{ideation.topic}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#8FA58F]">
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FA58F]">
                              {col}
                            </span>
                            <span className="text-[10px] text-[#8FA58F]">
                              ({colNotes.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {colNotes.slice(0, 3).map((note) => (
                              <div
                                key={note.id}
                                className="p-2 bg-[#EDF5F0] rounded-lg text-xs text-[#1E2E1E] line-clamp-2"
                              >
                                {note.content}
                              </div>
                            ))}
                            {colNotes.length > 3 && (
                              <p className="text-[10px] text-[#8FA58F]">
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
                    <div className="p-4 border-t border-[#D4E5D4] bg-[#EDF5F0]">
                      <p className="text-xs text-[#8FA58F] flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {ideation.generatedPresentationIds.length} decks generated from this ideation
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-[#D4E5D4] rounded-lg p-8 text-center">
                  <FileText className="w-10 h-10 text-[#8FA58F] mx-auto mb-3" />
                  <p className="text-[#8FA58F] text-sm">
                    This deck was created directly without an ideation session.
                  </p>
                  <p className="text-[#8FA58F] text-xs mt-2">
                    Use the Ideate mode to brainstorm and structure ideas before creating a deck.
                  </p>
                </div>
              )}
            </section>

            {/* Right: Theme & Style decisions */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-[#6B8E6B]" />
                <h2 className="text-lg font-bold text-[#1E2E1E]">Design Choices</h2>
              </div>

              <div className="space-y-4">
                {/* Theme card */}
                <div className="bg-white border border-[#D4E5D4] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div>
                      <h3 className="font-medium text-[#1E2E1E]">{theme.name}</h3>
                      <p className="text-xs text-[#8FA58F]">{theme.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.background].map(
                      (color, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-lg border border-[#D4E5D4]"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Visual style */}
                <div className="bg-white border border-[#D4E5D4] rounded-lg p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#8FA58F] mb-2">
                    Visual Style
                  </h4>
                  <p className="text-sm text-[#1E2E1E]">
                    {presentation.visualStyle || theme.imageStyle || 'Default theme style'}
                  </p>
                </div>

                {/* Layout distribution */}
                <div className="bg-white border border-[#D4E5D4] rounded-lg p-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#8FA58F] mb-3">
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
                        <span className="text-xs text-[#8FA58F] w-24 capitalize">{layout}</span>
                        <div className="flex-1 h-2 bg-[#EDF5F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6B8E6B] rounded-full"
                            style={{
                              width: `${(count / presentation.slides.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-[#8FA58F] w-8">{count}</span>
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
              <div className="bg-white border border-[#D4E5D4] rounded-lg overflow-hidden">
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
              <Layout className="w-5 h-5 text-[#6B8E6B]" />
              <h2 className="text-lg font-bold text-[#1E2E1E]">Slide Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presentation.slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="bg-white border border-[#D4E5D4] rounded-lg p-4 hover:border-[#6B8E6B] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FA58F]">
                      Slide {idx + 1}
                    </span>
                    <span className="text-[10px] text-[#8FA58F] capitalize px-2 py-0.5 bg-[#EDF5F0] rounded-lg">
                      {slide.layoutType || 'split'}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-[#1E2E1E] line-clamp-1 mb-1">
                    {slide.title}
                  </h4>
                  <p className="text-xs text-[#8FA58F] line-clamp-2">
                    {slide.content?.[0] || slide.speakerNotes || 'No content'}
                  </p>
                  {slide.imagePrompt && (
                    <div className="mt-2 pt-2 border-t border-[#D4E5D4]">
                      <p className="text-[10px] text-[#8FA58F] line-clamp-1 flex items-center gap-1">
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
          <footer className="mt-12 pt-8 border-t border-[#D4E5D4] text-center">
            <p className="text-xs text-[#8FA58F]">
              Created with DeckSnap AI &middot; {new Date(presentation.createdAt).toLocaleDateString()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BehindTheScenes;
