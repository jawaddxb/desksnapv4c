/**
 * DeskSquadSection - Landing Page Agent Showcase
 *
 * Displays 5 AI agents as animated playing cards with deck-of-cards metaphor.
 * Simplified: No 3D flips, clean fan-out animation with hover effects.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { FullScreenSection } from './FullScreenSection';
import {
  AgentId,
  AgentConfig,
  AGENT_TEAM,
  AGENT_ROLES,
  AGENT_EXTENDED,
  getAgentConfig,
} from '@/types/agents';
import {
  FANNED_POSITIONS,
  CARD_WIDTH,
  CARD_HEIGHT,
  cardVariants,
  springConfig,
  getIdleAnimation,
} from './deskSquadConstants';

// ============ Card Front ============
interface CardFrontProps {
  agent: AgentConfig;
}

const CardFront: React.FC<CardFrontProps> = ({ agent }) => {
  const [imageError, setImageError] = useState(false);
  const role = AGENT_ROLES[agent.id];

  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 relative">
      {/* Colored top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: agent.color }}
      />

      {/* Content */}
      <div className="p-4 flex flex-col items-center text-center h-full">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-xl overflow-hidden mb-3 shadow-md ring-2 ring-offset-2"
          style={{ ringColor: `${agent.color}30` }}
        >
          {!imageError ? (
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: agent.color }}
            >
              {agent.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name */}
        <h3
          className="text-lg font-bold"
          style={{ color: agent.color }}
        >
          {agent.name}
        </h3>

        {/* Role */}
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
          {role}
        </p>

        {/* Tagline */}
        <p className="text-xs text-gray-400 italic mt-2 px-2 leading-relaxed">
          "{agent.tagline}"
        </p>

        {/* Bottom accent */}
        <div className="mt-auto pt-3">
          <div
            className="w-6 h-0.5 rounded-full mx-auto"
            style={{ backgroundColor: `${agent.color}40` }}
          />
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 30px ${agent.color}30`,
        }}
      />
    </div>
  );
};

// ============ Expanded Card View ============
interface ExpandedCardProps {
  agent: AgentConfig;
  onClose: () => void;
}

const ExpandedCard: React.FC<ExpandedCardProps> = ({ agent, onClose }) => {
  const extended = AGENT_EXTENDED[agent.id];
  const role = AGENT_ROLES[agent.id];
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Expanded card */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden"
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={springConfig}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Header with colored background */}
        <div
          className="relative px-6 pt-6 pb-5"
          style={{ backgroundColor: `${agent.color}10` }}
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-xl overflow-hidden ring-4 ring-white shadow-lg flex-shrink-0">
              {!imageError ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Role */}
            <div className="pt-1">
              <h2
                className="text-2xl font-bold"
                style={{ color: agent.color }}
              >
                {agent.name}
              </h2>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                {role}
              </p>
              <p className="text-sm text-gray-400 italic mt-2">
                "{agent.tagline}"
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Personality */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Personality
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {extended.personality.map((trait, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${agent.color}15`,
                    color: agent.color,
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Capabilities
            </h4>
            <ul className="space-y-1.5">
              {extended.capabilities.map((cap, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: agent.color }}
                  />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          {/* Collaborates with */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Works With
            </h4>
            <div className="space-y-2">
              {extended.collaborates.map((collab, i) => {
                const collaborator = getAgentConfig(collab.agentId);
                if (!collaborator) return null;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div
                      className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: `${collaborator.color}20` }}
                    >
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: collaborator.color }}
                      >
                        {collaborator.name}
                      </span>
                      <p className="text-xs text-gray-400">{collab.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Value prop */}
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${agent.color}08` }}
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              {extended.valueProp}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============ Playing Card Component ============
interface PlayingCardProps {
  agent: AgentConfig;
  index: number;
  isVisible: boolean;
  isIdle: boolean;
  onClick: () => void;
}

const PlayingCard: React.FC<PlayingCardProps> = ({
  agent,
  index,
  isVisible,
  isIdle,
  onClick,
}) => {
  const baseY = FANNED_POSITIONS[index].y;

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        left: '50%',
        top: '50%',
        marginLeft: -CARD_WIDTH / 2,
        marginTop: -CARD_HEIGHT / 2,
      }}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate={isIdle ? getIdleAnimation(index, baseY) : (isVisible ? 'fanned' : 'stacked')}
      whileHover={{
        y: baseY - 25,
        scale: 1.08,
        zIndex: 50,
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      }}
      onClick={onClick}
    >
      <CardFront agent={agent} />

      {/* Animated shadow */}
      <motion.div
        className="absolute -bottom-3 inset-x-3 h-6 bg-black/15 rounded-full blur-lg"
        initial={{ opacity: 0.4, scale: 0.9 }}
        whileHover={{ opacity: 0.6, scale: 1 }}
      />
    </motion.div>
  );
};

// ============ Main Section Component ============
export const DeskSquadSection: React.FC = () => {
  const [expandedId, setExpandedId] = useState<AgentId | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  // Trigger fan-out animation when in view
  useEffect(() => {
    if (isInView && !isVisible) {
      const timer = setTimeout(() => setIsVisible(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, isVisible]);

  // Start idle floating after fan-out completes
  useEffect(() => {
    if (isVisible && !isIdle) {
      const timer = setTimeout(() => setIsIdle(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isIdle]);

  // Reset when scrolling away
  useEffect(() => {
    if (!isInView && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsIdle(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, isVisible]);

  const expandedAgent = expandedId ? getAgentConfig(expandedId) : null;

  return (
    <FullScreenSection id="squad" backgroundColor="#FAFBFA">
      <div ref={sectionRef} className="relative w-full h-full max-w-7xl mx-auto px-8 flex items-center">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Messaging */}
          <motion.div
            className="space-y-6 lg:pr-8"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="inline-block px-4 py-2 bg-[#6B8E6B]/10 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm font-medium text-[#6B8E6B]">Meet Your Team</span>
            </motion.div>

            <h2 className="text-5xl lg:text-6xl font-bold leading-tight text-[#1E2E1E]">
              Stop working
              <br />
              <span className="text-[#6B8E6B]">alone</span>
            </h2>

            <p className="text-xl text-[#4A5D4A] leading-relaxed max-w-lg">
              Your Desk Squad is a team of AI specialists, each bringing unique skills to your presentations.
              Together, they research, design, write, visualize, and refine.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <motion.button
                className="px-6 py-3 bg-[#6B8E6B] text-white rounded-xl text-base font-semibold hover:bg-[#5A7A5A] transition-colors shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Agent quick stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-[#6B8E6B]">5</div>
                <div className="text-sm text-[#8FA58F]">AI Specialists</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#6B8E6B]">24/7</div>
                <div className="text-sm text-[#8FA58F]">Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#6B8E6B]">10x</div>
                <div className="text-sm text-[#8FA58F]">Faster</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Card Deck */}
          <motion.div
            className="relative h-[450px] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Cards container */}
            <div className="relative" style={{ width: 600, height: 350 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {AGENT_TEAM.map((agent, index) => (
                  <PlayingCard
                    key={agent.id}
                    agent={agent}
                    index={index}
                    isVisible={isVisible}
                    isIdle={isIdle}
                    onClick={() => setExpandedId(agent.id)}
                  />
                ))}
              </div>
            </div>

            {/* Click hint */}
            <motion.p
              className="absolute bottom-0 text-sm text-[#8FA58F] text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: isIdle ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              Click a card to learn more
            </motion.p>
          </motion.div>
        </div>

        {/* Expanded card overlay */}
        <AnimatePresence>
          {expandedAgent && (
            <ExpandedCard
              agent={expandedAgent}
              onClose={() => setExpandedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </FullScreenSection>
  );
};

export default DeskSquadSection;
