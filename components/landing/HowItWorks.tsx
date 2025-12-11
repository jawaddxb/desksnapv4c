/**
 * HowItWorks Component
 *
 * Three-stage workflow visualization: Ideate → Draft → Polish
 * Studio Noir aesthetic - black, white, gold with interactive animations.
 */

import React, { useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  Download,
  MousePointer2
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  popIn,
  viewportOnce,
  springs,
} from './animations';

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

const stickyNoteColors = {
  yellow: { bg: 'rgba(250, 204, 21, 0.2)', border: 'rgba(250, 204, 21, 0.3)' },
  pink: { bg: 'rgba(244, 114, 182, 0.2)', border: 'rgba(244, 114, 182, 0.3)' },
  blue: { bg: 'rgba(96, 165, 250, 0.2)', border: 'rgba(96, 165, 250, 0.3)' },
  green: { bg: 'rgba(74, 222, 128, 0.2)', border: 'rgba(74, 222, 128, 0.3)' },
  purple: { bg: 'rgba(167, 139, 250, 0.2)', border: 'rgba(167, 139, 250, 0.3)' },
};

// Animated sticky note for Ideate visual
const AnimatedStickyNote: React.FC<{
  color: keyof typeof stickyNoteColors;
  delay: number;
  columnIndex: number;
  noteIndex: number;
}> = ({ color, delay, columnIndex, noteIndex }) => {
  return (
    <motion.div
      className="h-10 rounded-sm"
      style={{
        backgroundColor: stickyNoteColors[color].bg,
        borderColor: stickyNoteColors[color].border,
        borderWidth: 1,
      }}
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        ...springs.bouncy,
        delay: delay + columnIndex * 0.1 + noteIndex * 0.15,
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 20px ${stickyNoteColors[color].border}`,
      }}
    />
  );
};

// Ideate visual with animated sticky notes dropping in
const IdeateVisual: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [highlightedColumn, setHighlightedColumn] = useState(-1);
  const columns = ['Hook', 'Problem', 'Solution', 'Proof', 'CTA'];
  const noteConfig = [
    { color: 'yellow' as const, count: 2 },
    { color: 'pink' as const, count: 1 },
    { color: 'blue' as const, count: 3 },
    { color: 'green' as const, count: 2 },
    { color: 'purple' as const, count: 1 },
  ];

  // Highlight columns sequentially
  useEffect(() => {
    if (!isInView) {
      setHighlightedColumn(-1);
      return;
    }

    const sequence = async () => {
      for (let i = 0; i < 5; i++) {
        await new Promise(r => setTimeout(r, 800));
        setHighlightedColumn(i);
      }
      await new Promise(r => setTimeout(r, 1000));
      setHighlightedColumn(-1);
    };

    const timeout = setTimeout(sequence, 1500);
    const interval = setInterval(sequence, 8000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isInView]);

  return (
    <div className="h-full flex flex-col">
      {/* Swimlane headers */}
      <div className="flex gap-2 mb-4">
        {columns.map((col, i) => (
          <motion.div
            key={col}
            className="flex-1 text-center"
            animate={{
              color: highlightedColumn === i ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xs uppercase tracking-wider">{col}</span>
          </motion.div>
        ))}
      </div>
      {/* Sticky notes */}
      <div className="flex gap-2 flex-1">
        {noteConfig.map((col, i) => (
          <motion.div
            key={i}
            className="flex-1 space-y-2 p-1 rounded"
            animate={{
              backgroundColor: highlightedColumn === i ? 'rgba(197, 164, 126, 0.1)' : 'transparent',
            }}
            transition={{ duration: 0.3 }}
          >
            {isInView && Array.from({ length: col.count }).map((_, j) => (
              <AnimatedStickyNote
                key={j}
                color={col.color}
                delay={0.3}
                columnIndex={i}
                noteIndex={j}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Draft visual with card flip and approval animations
const DraftVisual: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [approvedSlides, setApprovedSlides] = useState<number[]>([]);
  const [flippedSlides, setFlippedSlides] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) {
      setApprovedSlides([]);
      setFlippedSlides([]);
      return;
    }

    const sequence = async () => {
      // Flip cards sequentially
      for (let i = 1; i <= 6; i++) {
        await new Promise(r => setTimeout(r, 300));
        setFlippedSlides(prev => [...prev, i]);
      }

      // Add approval checks
      await new Promise(r => setTimeout(r, 500));
      for (let i = 1; i <= 3; i++) {
        await new Promise(r => setTimeout(r, 400));
        setApprovedSlides(prev => [...prev, i]);
      }

      // Reset after delay
      await new Promise(r => setTimeout(r, 4000));
      setApprovedSlides([]);
      setFlippedSlides([]);
    };

    const timeout = setTimeout(sequence, 500);
    const interval = setInterval(sequence, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isInView]);

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 gap-3 flex-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{
              opacity: flippedSlides.includes(i) ? 1 : 0.3,
              rotateY: flippedSlides.includes(i) ? 0 : -90,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="aspect-video bg-white/10 border border-white/20"
              whileHover={{ scale: 1.05, borderColor: 'rgba(197, 164, 126, 0.5)' }}
            >
              <div className="p-2">
                <motion.div
                  className="w-6 h-0.5 bg-[#c5a47e] mb-2"
                  initial={{ width: 0 }}
                  animate={{ width: flippedSlides.includes(i) ? 24 : 0 }}
                  transition={{ delay: 0.2 }}
                />
                <div className="w-full h-1.5 bg-white/20 mb-1" />
                <div className="w-3/4 h-1.5 bg-white/20" />
              </div>
            </motion.div>
            {/* Approval badge */}
            <AnimatePresence>
              {approvedSlides.includes(i) && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 flex items-center justify-center rounded-sm"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={springs.bouncy}
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Polish visual with cursor animation and live editing
const PolishVisual: React.FC<{ isInView: boolean }> = ({ isInView }) => {
  const [selectedSlide, setSelectedSlide] = useState(1);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [textWidth, setTextWidth] = useState(75);

  useEffect(() => {
    if (!isInView) {
      setSelectedSlide(1);
      setIsEditing(false);
      setTextWidth(75);
      return;
    }

    const sequence = async () => {
      // Move cursor to text
      setCursorPos({ x: 60, y: 40 });
      await new Promise(r => setTimeout(r, 600));

      // Start editing
      setIsEditing(true);
      await new Promise(r => setTimeout(r, 200));

      // Animate text change
      for (let i = 75; i <= 100; i += 5) {
        setTextWidth(i);
        await new Promise(r => setTimeout(r, 100));
      }

      await new Promise(r => setTimeout(r, 500));
      setIsEditing(false);

      // Click different slide
      await new Promise(r => setTimeout(r, 800));
      setSelectedSlide(2);

      // Reset
      await new Promise(r => setTimeout(r, 3000));
      setSelectedSlide(1);
      setTextWidth(75);
    };

    const timeout = setTimeout(sequence, 1000);
    const interval = setInterval(sequence, 8000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isInView]);

  return (
    <div className="h-full flex flex-col relative">
      {/* Animated cursor */}
      {isInView && (
        <motion.div
          className="absolute z-10 pointer-events-none"
          animate={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <MousePointer2 className="w-4 h-4 text-white drop-shadow-lg" />
        </motion.div>
      )}

      <div className="flex gap-4 flex-1">
        {/* Sidebar */}
        <div className="w-16 space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="aspect-video border cursor-pointer"
              animate={{
                borderColor: selectedSlide === i ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: selectedSlide === i ? 'rgba(197, 164, 126, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              }}
              whileHover={{ borderColor: 'rgba(197, 164, 126, 0.5)' }}
              onClick={() => setSelectedSlide(i)}
            />
          ))}
        </div>
        {/* Main slide */}
        <motion.div
          className="flex-1 border border-[#c5a47e]/30 bg-gradient-to-br from-[#c5a47e]/10 to-transparent p-4"
          animate={{
            boxShadow: isEditing ? '0 0 30px rgba(197, 164, 126, 0.2)' : 'none',
          }}
        >
          <div className="w-12 h-1 bg-[#c5a47e] mb-4" />
          <motion.div
            className="h-4 bg-white/20 mb-3"
            animate={{ width: `${textWidth}%` }}
            transition={{ duration: 0.1 }}
          />
          <div className="w-1/2 h-4 bg-white/20 mb-6" />
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="aspect-square bg-white/10"
              animate={{
                backgroundColor: selectedSlide === 2 ? 'rgba(197, 164, 126, 0.15)' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <div className="space-y-2">
              <div className="w-full h-2 bg-white/15" />
              <div className="w-3/4 h-2 bg-white/15" />
              <div className="w-full h-2 bg-white/15" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-[#111111]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block"
          >
            How It Works
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-light mb-6"
          >
            Three stages. One seamless flow.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60"
          >
            Great presentations don't arrive fully formed. They emerge through thinking, drafting, and refining. DeckSnap respects that process.
          </motion.p>
        </motion.div>

        {/* Stages */}
        <div className="space-y-16">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isEven = index % 2 === 1;
            const ref = React.useRef(null);
            const isInView = useInView(ref, { once: false, margin: '-100px' });

            return (
              <motion.div
                key={index}
                ref={ref}
                className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Content */}
                <motion.div
                  className={isEven ? 'lg:order-2' : ''}
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                >
                  {/* Stage label */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex items-center gap-4 mb-6"
                  >
                    <span className="text-5xl font-light text-[#c5a47e] opacity-30">
                      {stage.number}
                    </span>
                    <motion.div
                      className="flex items-center gap-2 px-3 py-1 border border-[#c5a47e]/30 bg-[#c5a47e]/10"
                      whileHover={{ scale: 1.05, borderColor: 'rgba(197, 164, 126, 0.5)' }}
                    >
                      <Icon className="w-4 h-4 text-[#c5a47e]" />
                      <span className="text-xs uppercase tracking-[0.15em] text-[#c5a47e]">
                        {stage.stage}
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    variants={fadeInUp}
                    className="text-3xl md:text-4xl font-light mb-6"
                  >
                    {stage.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    variants={fadeInUp}
                    className="text-lg text-white/60 leading-relaxed mb-8"
                  >
                    {stage.description}
                  </motion.p>

                  {/* Feature pills */}
                  <motion.div
                    variants={staggerContainer}
                    className="flex flex-wrap gap-3"
                  >
                    {stage.features.map((feature, i) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <motion.div
                          key={i}
                          variants={popIn}
                          whileHover={{
                            scale: 1.05,
                            borderColor: 'rgba(197, 164, 126, 0.5)',
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-white/5 cursor-pointer"
                        >
                          <FeatureIcon className="w-4 h-4 text-[#c5a47e]" />
                          <span className="text-sm text-white/60">{feature.label}</span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>

                {/* Visual */}
                <div className={`${isEven ? 'lg:order-1' : ''}`}>
                  <motion.div
                    className="aspect-[4/3] bg-white/5 border border-white/10 p-6 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.5 }}
                  >
                    {stage.visual === 'ideate' && <IdeateVisual isInView={isInView} />}
                    {stage.visual === 'draft' && <DraftVisual isInView={isInView} />}
                    {stage.visual === 'polish' && <PolishVisual isInView={isInView} />}

                    {/* Stage badge */}
                    <motion.div
                      className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/20"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ delay: 0.5 }}
                    >
                      <Icon className="w-4 h-4 text-[#c5a47e]" />
                      <span className="text-xs text-white/60">{stage.stage}</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
        >
          <p className="text-2xl text-white/40 font-light">
            Done beats perfect.{' '}
            <motion.span
              className="text-[#c5a47e]"
              initial={{ opacity: 0.6 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              But thinking beats rushing.
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
