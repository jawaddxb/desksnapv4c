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

// Icons for each column type
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

// Colors for each column
const COLUMN_COLORS: Record<ColumnName, string> = {
  Hook: 'bg-amber-50 border-amber-200 text-amber-700',
  Problem: 'bg-red-50 border-red-200 text-red-700',
  Solution: 'bg-green-50 border-green-200 text-green-700',
  Proof: 'bg-blue-50 border-blue-200 text-blue-700',
  CTA: 'bg-purple-50 border-purple-200 text-purple-700',
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

  return (
    <div
      className={`
        px-3 py-2 rounded-lg border text-center
        transition-all duration-200
        ${colorClasses}
        ${isActive ? 'ring-2 ring-offset-2 ring-blue-400' : ''}
      `}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <span className="font-semibold text-sm uppercase tracking-wide">
          {name}
        </span>
        {noteCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/60">
            {noteCount}
          </span>
        )}
      </div>
      <p className="text-xs opacity-70">{description}</p>
    </div>
  );
};

export default ColumnHeader;
