/**
 * ColumnHeader Component
 *
 * Header for a swimlane column in the ideation canvas.
 */

import React from 'react';
import { ColumnName } from '../../types/ideation';

interface ColumnHeaderProps {
  name: ColumnName;
  noteCount: number;
  isActive?: boolean;
}

// Icons for each column type (Studio Noir)
const COLUMN_ICONS: Record<ColumnName, React.ReactNode> = {
  Hook: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Problem: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
  Solution: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
    </svg>
  ),
  Proof: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  ),
  CTA: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  ),
};

// Colors for each column (Studio Noir - gradient backgrounds with gold accent)
const COLUMN_COLORS: Record<ColumnName, string> = {
  Hook: 'bg-gradient-to-b from-[#161616] to-[#111111] border-[#c5a47e] text-[#c5a47e]',
  Problem: 'bg-gradient-to-b from-[#141414] to-[#111111] border-white/30 text-white/70',
  Solution: 'bg-gradient-to-b from-[#151513] to-[#111111] border-[#c5a47e]/60 text-[#c5a47e]',
  Proof: 'bg-gradient-to-b from-[#131313] to-[#111111] border-white/20 text-white/60',
  CTA: 'bg-gradient-to-b from-[#161616] to-[#111111] border-[#c5a47e] text-[#c5a47e]',
};

// Descriptions for each column
const COLUMN_DESCRIPTIONS: Record<ColumnName, string> = {
  Hook: 'Grab attention',
  Problem: 'Define the pain',
  Solution: 'Your answer',
  Proof: 'Evidence & trust',
  CTA: 'Next steps',
};

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  name,
  noteCount,
  isActive = false,
}) => {
  const colorClasses = COLUMN_COLORS[name];
  const icon = COLUMN_ICONS[name];
  const description = COLUMN_DESCRIPTIONS[name];

  // Calculate fill percentage (max 5 notes per column as suggested capacity)
  const fillPercentage = Math.min((noteCount / 5) * 100, 100);

  return (
    <div
      className={`
        relative px-3 py-2 border text-center
        transition-all duration-200 ease-out
        ${colorClasses}
        ${isActive ? 'ring-1 ring-[#c5a47e] bg-[#c5a47e]/[0.08]' : ''}
      `}
    >
      {/* Completion indicator dot */}
      {noteCount > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="w-full h-full bg-[#c5a47e]/30 rounded-full" />
          <div className="absolute inset-0.5 bg-[#c5a47e] rounded-full" />
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <span className="font-bold text-xs uppercase tracking-widest">
          {name}
        </span>
        {noteCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 bg-white/10">
            {noteCount}
          </span>
        )}
      </div>
      <p className="text-xs opacity-50">{description}</p>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className="h-full bg-[#c5a47e]/40 transition-all duration-300"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ColumnHeader;
