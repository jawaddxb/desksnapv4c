/**
 * HowItWorks Component
 *
 * Three-stage workflow visualization: Ideate → Draft → Polish
 * Studio Noir aesthetic - black, white, gold.
 */

import React from 'react';
import {
  Lightbulb,
  FileEdit,
  Sparkles,
  StickyNote,
  Mic,
  Search,
  Eye,
  Check,
  RefreshCw,
  Palette,
  LayoutGrid,
  Download
} from 'lucide-react';

const stages = [
  {
    number: '01',
    icon: Lightbulb,
    stage: 'Ideate',
    title: 'Start with sticky notes, not slides.',
    description: 'Begin where ideas actually begin—messy, nonlinear, full of possibility. Our AI co-pilot helps populate sections based on your input. Add your own notes. Rearrange freely. See your thinking take shape before committing to structure.',
    features: [
      { icon: StickyNote, label: '5-column swimlane canvas' },
      { icon: Mic, label: 'Voice input for quick capture' },
      { icon: Search, label: 'Research co-pilot with citations' },
    ],
    visual: 'ideate',
  },
  {
    number: '02',
    icon: FileEdit,
    stage: 'Rough Draft',
    title: 'Shape the story before the polish.',
    description: 'Move from notes to narrative. Preview AI-generated images and themes. See your storyboard come together. Regenerate anything that doesn\'t feel right. This is where your deck finds its voice.',
    features: [
      { icon: Eye, label: 'Preview slides before committing' },
      { icon: Check, label: 'Per-slide approval workflow' },
      { icon: RefreshCw, label: 'Regenerate until it\'s right' },
    ],
    visual: 'draft',
  },
  {
    number: '03',
    icon: Sparkles,
    stage: 'Final Polish',
    title: 'Every detail, exactly where it belongs.',
    description: 'Your ideas, fully realized. Adjust text, refine layouts, swap elements. Hundreds of organic design patterns—from structured grids to wabi-sabi compositions—adapt to your content. The result: decks that feel crafted, not generated.',
    features: [
      { icon: Palette, label: '60+ design archetypes' },
      { icon: LayoutGrid, label: 'Flexible layout system' },
      { icon: Download, label: 'Export to PPT, PDF, Keynote' },
    ],
    visual: 'polish',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
            How It Works
          </span>
          <h2 className="text-5xl md:text-6xl font-light mb-6">
            Three stages. One seamless flow.
          </h2>
          <p className="text-xl text-white/60">
            Great presentations don't arrive fully formed. They emerge through thinking, drafting, and refining. DeckSnap respects that process.
          </p>
        </div>

        {/* Stages */}
        <div className="space-y-16">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Content */}
                <div className={isEven ? 'lg:order-2' : ''}>
                  {/* Stage label */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-light text-[#c5a47e] opacity-30">
                      {stage.number}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 border border-[#c5a47e]/30 bg-[#c5a47e]/10">
                      <Icon className="w-4 h-4 text-[#c5a47e]" />
                      <span className="text-xs uppercase tracking-[0.15em] text-[#c5a47e]">
                        {stage.stage}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-light mb-6">
                    {stage.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-white/60 leading-relaxed mb-8">
                    {stage.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-3">
                    {stage.features.map((feature, i) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={i}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5"
                        >
                          <FeatureIcon className="w-4 h-4 text-[#c5a47e]" />
                          <span className="text-sm text-white/60">{feature.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Visual */}
                <div className={`${isEven ? 'lg:order-1' : ''}`}>
                  <div className="aspect-[4/3] bg-white/5 border border-white/10 p-6 relative overflow-hidden">
                    {stage.visual === 'ideate' && (
                      <div className="h-full flex flex-col">
                        {/* Swimlane headers */}
                        <div className="flex gap-2 mb-4">
                          {['Hook', 'Problem', 'Solution', 'Proof', 'CTA'].map((col) => (
                            <div key={col} className="flex-1 text-center">
                              <span className="text-xs uppercase tracking-wider text-white/30">{col}</span>
                            </div>
                          ))}
                        </div>
                        {/* Sticky notes */}
                        <div className="flex gap-2 flex-1">
                          {[
                            { color: 'yellow', count: 2 },
                            { color: 'pink', count: 1 },
                            { color: 'blue', count: 3 },
                            { color: 'green', count: 2 },
                            { color: 'purple', count: 1 },
                          ].map((col, i) => (
                            <div key={i} className="flex-1 space-y-2">
                              {Array.from({ length: col.count }).map((_, j) => (
                                <div
                                  key={j}
                                  className={`h-10 rounded-sm bg-${col.color}-400/20 border border-${col.color}-400/30`}
                                  style={{
                                    backgroundColor: `${
                                      col.color === 'yellow' ? 'rgba(250, 204, 21, 0.2)' :
                                      col.color === 'pink' ? 'rgba(244, 114, 182, 0.2)' :
                                      col.color === 'blue' ? 'rgba(96, 165, 250, 0.2)' :
                                      col.color === 'green' ? 'rgba(74, 222, 128, 0.2)' :
                                      'rgba(167, 139, 250, 0.2)'
                                    }`,
                                    borderColor: `${
                                      col.color === 'yellow' ? 'rgba(250, 204, 21, 0.3)' :
                                      col.color === 'pink' ? 'rgba(244, 114, 182, 0.3)' :
                                      col.color === 'blue' ? 'rgba(96, 165, 250, 0.3)' :
                                      col.color === 'green' ? 'rgba(74, 222, 128, 0.3)' :
                                      'rgba(167, 139, 250, 0.3)'
                                    }`,
                                  }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stage.visual === 'draft' && (
                      <div className="h-full flex flex-col">
                        {/* Storyboard grid */}
                        <div className="grid grid-cols-3 gap-3 flex-1">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="relative">
                              <div className="aspect-video bg-white/10 border border-white/20">
                                <div className="p-2">
                                  <div className="w-6 h-0.5 bg-[#c5a47e] mb-2" />
                                  <div className="w-full h-1.5 bg-white/20 mb-1" />
                                  <div className="w-3/4 h-1.5 bg-white/20" />
                                </div>
                              </div>
                              {/* Approval badge */}
                              {i <= 3 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 flex items-center justify-center">
                                  <Check className="w-3 h-3 text-black" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {stage.visual === 'polish' && (
                      <div className="h-full flex flex-col">
                        {/* Editor mockup */}
                        <div className="flex gap-4 flex-1">
                          {/* Sidebar */}
                          <div className="w-16 space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`aspect-video ${i === 1 ? 'border-[#c5a47e] bg-[#c5a47e]/10' : 'border-white/10 bg-white/5'} border`}
                              />
                            ))}
                          </div>
                          {/* Main slide */}
                          <div className="flex-1 border border-[#c5a47e]/30 bg-gradient-to-br from-[#c5a47e]/10 to-transparent p-4">
                            <div className="w-12 h-1 bg-[#c5a47e] mb-4" />
                            <div className="w-3/4 h-4 bg-white/20 mb-3" />
                            <div className="w-1/2 h-4 bg-white/20 mb-6" />
                            <div className="grid grid-cols-2 gap-3">
                              <div className="aspect-square bg-white/10" />
                              <div className="space-y-2">
                                <div className="w-full h-2 bg-white/15" />
                                <div className="w-3/4 h-2 bg-white/15" />
                                <div className="w-full h-2 bg-white/15" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20">
                      <Icon className="w-4 h-4 text-[#c5a47e]" />
                      <span className="text-xs text-white/60">{stage.stage}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <div className="mt-20 pt-12 border-t border-white/10 text-center">
          <p className="text-2xl text-white/40 font-light">
            Done beats perfect.{' '}
            <span className="text-[#c5a47e]">But thinking beats rushing.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
