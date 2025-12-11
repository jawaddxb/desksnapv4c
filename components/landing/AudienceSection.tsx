/**
 * AudienceSection Component
 *
 * "Who It's For" section highlighting target audiences.
 * Studio Noir aesthetic with animated card reveals and icon interactions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Rocket,
  Briefcase,
  Mic2,
  Users
} from 'lucide-react';
import {
  fadeInUp,
  staggerContainer,
  viewportOnce,
} from './animations';

const audiences = [
  {
    icon: Rocket,
    title: 'Founders & Investors',
    description: 'Pitch decks need iteration, not just generation. Ideation helps structure the narrative before committing to slides.',
    highlight: 'Iterate on your story',
    iconAnimation: 'liftoff',
  },
  {
    icon: Briefcase,
    title: 'Consultants & Strategists',
    description: 'Research-heavy presentations need evidence. Research Co-Pilot finds and cites sources automatically.',
    highlight: 'Backed by research',
    iconAnimation: 'open',
  },
  {
    icon: Mic2,
    title: 'Thought Leaders & Speakers',
    description: 'Ideas are rough, they need a refinement process. Turn rough ideas into polished keynotes.',
    highlight: 'From idea to keynote',
    iconAnimation: 'pulse',
  },
  {
    icon: Users,
    title: 'Teams & Executives',
    description: 'Brainstorming and deliverables live in different tools. Turn whiteboard sessions into boardroom decks.',
    highlight: 'Brainstorm to boardroom',
    iconAnimation: 'wave',
  },
];

// Animated icon component with different animations per type
const AnimatedIcon: React.FC<{
  icon: typeof Rocket;
  animation: string;
  isHovered: boolean;
}> = ({ icon: Icon, animation, isHovered }) => {
  const getAnimation = () => {
    switch (animation) {
      case 'liftoff':
        return isHovered ? {
          y: [0, -5, 0],
          rotate: [0, -10, 10, 0],
        } : {};
      case 'open':
        return isHovered ? {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
        } : {};
      case 'pulse':
        return isHovered ? {
          scale: [1, 1.15, 1, 1.1, 1],
        } : {};
      case 'wave':
        return isHovered ? {
          rotate: [0, 10, -10, 5, -5, 0],
        } : {};
      default:
        return {};
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <Icon className="w-6 h-6 text-[#c5a47e]" />
    </motion.div>
  );
};

// Audience card with hover animations
const AudienceCard: React.FC<{
  audience: typeof audiences[0];
  index: number;
}> = ({ audience, index }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const Icon = audience.icon;

  return (
    <motion.div
      className="p-10 bg-black cursor-pointer"
      variants={fadeInUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Icon */}
      <motion.div
        className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6"
        animate={{
          borderColor: isHovered ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: isHovered ? '0 0 25px rgba(197, 164, 126, 0.3)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedIcon
          icon={Icon}
          animation={audience.iconAnimation}
          isHovered={isHovered}
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-2xl font-light mb-4"
        animate={{
          color: isHovered ? 'rgba(197, 164, 126, 1)' : 'rgba(255, 255, 255, 1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {audience.title}
      </motion.h3>

      {/* Description */}
      <p className="text-white/60 leading-relaxed mb-6">
        {audience.description}
      </p>

      {/* Highlight pill with shimmer */}
      <motion.div
        className="inline-flex items-center px-3 py-1 border border-[#c5a47e]/30 bg-[#c5a47e]/10 relative overflow-hidden"
        animate={{
          borderColor: isHovered ? 'rgba(197, 164, 126, 0.6)' : 'rgba(197, 164, 126, 0.3)',
        }}
      >
        <span className="text-sm text-[#c5a47e] relative z-10">{audience.highlight}</span>
        {/* Shimmer effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a47e]/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export const AudienceSection: React.FC = () => {
  return (
    <section className="py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-2xl mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.span
            variants={fadeInUp}
            className="text-xs uppercase tracking-[0.2em] text-[#c5a47e] mb-4 block"
          >
            Who It's For
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Built for people who present.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60"
          >
            If you spend real time building decks—and care about the outcome—DeckSnap was built for you.
          </motion.p>
        </motion.div>

        {/* Audience Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-px bg-white/10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {audiences.map((audience, index) => (
            <AudienceCard key={index} audience={audience} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AudienceSection;
