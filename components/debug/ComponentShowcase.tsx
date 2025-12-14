/**
 * ComponentShowcase
 *
 * Display all UI components with variations for testing and documentation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  X,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  Star,
  Heart,
  Bookmark,
  Share,
  Download,
  Upload,
  Settings,
  User,
  Search,
  Filter,
  Grid,
  List,
} from 'lucide-react';

// ============ Section Component ============

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#D4E5D4]">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[#8FA58F] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

// ============ Main Component ============

export function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-[#F5FAF7] text-[#1E2E1E]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F5FAF7]/90 backdrop-blur-sm border-b border-[#D4E5D4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/debug"
            className="p-2 hover:bg-[#D4E5D4] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">Component Showcase</h1>
            <p className="text-xs text-[#8FA58F]">UI components reference</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Buttons */}
        <Section title="Buttons">
          <Subsection title="Primary">
            <button className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg font-medium hover:bg-[#5A7A5A] transition-colors">
              Primary Button
            </button>
            <button className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
              Disabled
            </button>
            <button className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg font-medium flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading
            </button>
          </Subsection>

          <Subsection title="Secondary">
            <button className="px-4 py-2 bg-white text-[#1E2E1E] rounded-lg font-medium hover:bg-[#D4E5D4] transition-colors border border-[#D4E5D4]">
              Secondary
            </button>
            <button className="px-4 py-2 bg-transparent text-[#1E2E1E] rounded-lg font-medium border border-[#D4E5D4] hover:bg-[#D4E5D4] transition-colors">
              Outlined
            </button>
            <button className="px-4 py-2 text-[#8FA58F] hover:text-[#1E2E1E] transition-colors">
              Ghost
            </button>
          </Subsection>

          <Subsection title="Danger">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
              Delete
            </button>
            <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors">
              Cancel
            </button>
          </Subsection>

          <Subsection title="Sizes">
            <button className="px-2 py-1 bg-[#6B8E6B] text-white rounded text-xs font-medium">
              Small
            </button>
            <button className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg text-sm font-medium">
              Medium
            </button>
            <button className="px-6 py-3 bg-[#6B8E6B] text-white rounded-lg text-base font-medium">
              Large
            </button>
          </Subsection>

          <Subsection title="Icon Buttons">
            <button className="p-2 bg-white rounded-lg hover:bg-[#D4E5D4] transition-colors border border-[#D4E5D4]">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-lg hover:bg-[#D4E5D4] transition-colors border border-[#D4E5D4]">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-lg hover:bg-[#D4E5D4] transition-colors border border-[#D4E5D4]">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white rounded-full hover:bg-[#D4E5D4] transition-colors border border-[#D4E5D4]">
              <User className="w-5 h-5" />
            </button>
          </Subsection>
        </Section>

        {/* Badges */}
        <Section title="Badges">
          <Subsection title="Status">
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">
              Success
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
              Warning
            </span>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
              Error
            </span>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
              Info
            </span>
          </Subsection>

          <Subsection title="Outlined">
            <span className="px-2 py-0.5 border border-[#D4E5D4] text-[#8FA58F] rounded text-xs font-medium">
              Default
            </span>
            <span className="px-2 py-0.5 border border-[#6B8E6B] text-[#6B8E6B] rounded text-xs font-medium">
              Primary
            </span>
          </Subsection>

          <Subsection title="With Icon">
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium inline-flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Complete
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium inline-flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Pending
            </span>
          </Subsection>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <Subsection title="Text Input">
            <input
              type="text"
              placeholder="Default input"
              className="px-3 py-2 bg-white border border-[#D4E5D4] rounded-lg text-[#1E2E1E] placeholder:text-[#8FA58F] focus:outline-none focus:border-[#6B8E6B]"
            />
            <input
              type="text"
              placeholder="Disabled"
              disabled
              className="px-3 py-2 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg text-[#8FA58F] placeholder:text-[#8FA58F] cursor-not-allowed"
            />
          </Subsection>

          <Subsection title="With Icon">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA58F]" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-2 bg-white border border-[#D4E5D4] rounded-lg text-[#1E2E1E] placeholder:text-[#8FA58F] focus:outline-none focus:border-[#6B8E6B]"
              />
            </div>
          </Subsection>

          <Subsection title="Textarea">
            <textarea
              placeholder="Enter description..."
              rows={3}
              className="px-3 py-2 bg-white border border-[#D4E5D4] rounded-lg text-[#1E2E1E] placeholder:text-[#8FA58F] focus:outline-none focus:border-[#6B8E6B] w-64 resize-none"
            />
          </Subsection>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-[#D4E5D4]">
              <h3 className="font-bold mb-2">Basic Card</h3>
              <p className="text-sm text-[#8FA58F]">Simple card with content</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#D4E5D4] hover:border-[#6B8E6B] transition-colors cursor-pointer">
              <h3 className="font-bold mb-2">Interactive Card</h3>
              <p className="text-sm text-[#8FA58F]">Hover to see border effect</p>
            </div>

            <div className="bg-gradient-to-br from-[#6B8E6B]/10 to-transparent rounded-xl p-6 border border-[#6B8E6B]/30">
              <h3 className="font-bold mb-2 text-[#6B8E6B]">Accent Card</h3>
              <p className="text-sm text-[#8FA58F]">With gradient background</p>
            </div>
          </div>
        </Section>

        {/* Alerts */}
        <Section title="Alerts">
          <div className="space-y-3">
            <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="text-green-700">Success!</strong>
                <p className="text-[#8FA58F] mt-0.5">Your changes have been saved.</p>
              </div>
            </div>

            <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="text-amber-700">Warning</strong>
                <p className="text-[#8FA58F] mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="text-red-700">Error</strong>
                <p className="text-[#8FA58F] mt-0.5">Something went wrong. Please try again.</p>
              </div>
            </div>

            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong className="text-blue-700">Info</strong>
                <p className="text-[#8FA58F] mt-0.5">Here's some helpful information.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Loading States */}
        <Section title="Loading States">
          <Subsection title="Spinners">
            <Loader2 className="w-4 h-4 animate-spin text-[#8FA58F]" />
            <Loader2 className="w-6 h-6 animate-spin text-[#6B8E6B]" />
            <Loader2 className="w-8 h-8 animate-spin text-[#1E2E1E]" />
          </Subsection>

          <Subsection title="Skeleton">
            <div className="w-48 h-4 bg-[#D4E5D4] rounded animate-pulse" />
            <div className="w-32 h-4 bg-[#D4E5D4] rounded animate-pulse" />
            <div className="w-24 h-8 bg-[#D4E5D4] rounded animate-pulse" />
          </Subsection>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <h5 className="text-lg font-bold">Heading 5</h5>
            <h6 className="text-base font-bold">Heading 6</h6>
            <p className="text-base text-[#1E2E1E]">
              Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="text-sm text-[#8FA58F]">
              Small text - Secondary information goes here.
            </p>
            <p className="text-xs text-[#8FA58F]">
              Caption - Timestamp or metadata
            </p>
          </div>
        </Section>

        {/* Colors */}
        <Section title="Color Palette">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Primary', color: '#6B8E6B' },
              { name: 'Background', color: '#F5FAF7' },
              { name: 'Surface', color: '#FFFFFF' },
              { name: 'Border', color: '#D4E5D4' },
              { name: 'Success', color: '#22c55e' },
              { name: 'Warning', color: '#f59e0b' },
              { name: 'Error', color: '#ef4444' },
              { name: 'Info', color: '#3b82f6' },
            ].map(({ name, color }) => (
              <div key={name} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg border border-[#D4E5D4] mb-2"
                  style={{ background: color }}
                />
                <div className="text-xs font-medium">{name}</div>
                <div className="text-[10px] text-[#8FA58F] font-mono">{color}</div>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}

export default ComponentShowcase;
