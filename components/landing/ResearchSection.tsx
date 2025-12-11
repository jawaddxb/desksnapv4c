/**
 * ResearchSection Component
 *
 * Highlights the research integration with Grok.
 * "Research that actually helps."
 * Studio Noir aesthetic.
 */

import React from 'react';
import {
  Search,
  Globe,
  Twitter,
  FileText,
  Quote,
  Zap,
  Network
} from 'lucide-react';

const capabilities = [
  { icon: Globe, label: 'Web search' },
  { icon: Twitter, label: 'X/Twitter semantic search' },
  { icon: Zap, label: 'Live synthesis' },
  { icon: Quote, label: 'Automatic citations' },
  { icon: Network, label: 'Research mind map' },
];

export const ResearchSection: React.FC = () => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block">
              Research Integration
            </span>

            <h2 className="text-4xl md:text-5xl font-light mb-6">
              Research that actually helps.
            </h2>

            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Skip the tab-switching and copy-pasting. DeckSnap's research agents pull real-time
              data from across the web and X, synthesize findings into your ideation space,
              and cite every source.
            </p>

            <p className="text-lg text-white/60 leading-relaxed mb-10">
              Paste your content or start from scratch—we'll help you find what you need
              to make your case.
            </p>

            {/* Capabilities */}
            <div className="flex flex-wrap gap-3">
              {capabilities.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5"
                  >
                    <Icon className="w-4 h-4 text-[#c5a47e]" />
                    <span className="text-sm text-white/60">{cap.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual - Research Mind Map mockup */}
          <div className="relative">
            <div className="aspect-square bg-white/5 border border-white/10 p-8 relative overflow-hidden">
              {/* Central node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-[#c5a47e]/20 border border-[#c5a47e]/40 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#c5a47e]" />
                </div>
              </div>

              {/* Branch nodes */}
              {[
                { angle: 0, label: 'Market Data', color: 'blue' },
                { angle: 72, label: 'Trends', color: 'green' },
                { angle: 144, label: 'Competitors', color: 'pink' },
                { angle: 216, label: 'Expert Quotes', color: 'purple' },
                { angle: 288, label: 'Case Studies', color: 'yellow' },
              ].map((node, i) => {
                const radius = 120;
                const x = Math.cos((node.angle * Math.PI) / 180) * radius;
                const y = Math.sin((node.angle * Math.PI) / 180) * radius;

                return (
                  <React.Fragment key={i}>
                    {/* Connection line */}
                    <div
                      className="absolute top-1/2 left-1/2 h-px bg-white/20"
                      style={{
                        width: `${radius}px`,
                        transform: `translate(-50%, -50%) rotate(${node.angle}deg)`,
                        transformOrigin: 'left center',
                      }}
                    />
                    {/* Node */}
                    <div
                      className="absolute"
                      style={{
                        top: `calc(50% + ${y}px)`,
                        left: `calc(50% + ${x}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className="px-3 py-2 border text-xs whitespace-nowrap"
                        style={{
                          backgroundColor:
                            node.color === 'blue' ? 'rgba(96, 165, 250, 0.1)' :
                            node.color === 'green' ? 'rgba(74, 222, 128, 0.1)' :
                            node.color === 'pink' ? 'rgba(244, 114, 182, 0.1)' :
                            node.color === 'purple' ? 'rgba(167, 139, 250, 0.1)' :
                            'rgba(250, 204, 21, 0.1)',
                          borderColor:
                            node.color === 'blue' ? 'rgba(96, 165, 250, 0.3)' :
                            node.color === 'green' ? 'rgba(74, 222, 128, 0.3)' :
                            node.color === 'pink' ? 'rgba(244, 114, 182, 0.3)' :
                            node.color === 'purple' ? 'rgba(167, 139, 250, 0.3)' :
                            'rgba(250, 204, 21, 0.3)',
                          color:
                            node.color === 'blue' ? 'rgba(96, 165, 250, 0.8)' :
                            node.color === 'green' ? 'rgba(74, 222, 128, 0.8)' :
                            node.color === 'pink' ? 'rgba(244, 114, 182, 0.8)' :
                            node.color === 'purple' ? 'rgba(167, 139, 250, 0.8)' :
                            'rgba(250, 204, 21, 0.8)',
                        }}
                      >
                        {node.label}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}

              {/* Powered by badge */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20">
                <Zap className="w-4 h-4 text-[#c5a47e]" />
                <span className="text-xs text-white/60">Powered by Grok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
