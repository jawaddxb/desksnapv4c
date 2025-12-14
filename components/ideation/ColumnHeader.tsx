/**
 * ColumnHeader Component
 *
 * Header for a swimlane column in the ideation canvas.
 * Supports both default pitch columns and custom recipe-specific columns.
 */

import React from 'react';

interface ColumnHeaderProps {
  name: string;
  noteCount: number;
  isActive?: boolean;
}

// Default icon for any column
const DefaultIcon = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
  </svg>
);

// Icons for specific column types (pitch columns + common recipe columns)
const COLUMN_ICONS: Record<string, React.ReactNode> = {
  // Pitch columns
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
  // Training columns
  Objective: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
    </svg>
  ),
  Concept: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),
  Example: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9.41 15.95L12 13.36l2.59 2.59 1.41-1.41L12 10.54l-3.59 3.59z"/>
    </svg>
  ),
  Practice: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l4.59-4.58L18 11l-6 6z"/>
    </svg>
  ),
  Review: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  // Explainer columns
  What: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
    </svg>
  ),
  Why: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),
  How: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z"/>
    </svg>
  ),
  Examples: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
    </svg>
  ),
  Summary: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    </svg>
  ),
  // Brief columns
  Context: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93z"/>
    </svg>
  ),
  'Key Points': (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
    </svg>
  ),
  Analysis: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2v-2h2v2zm4 5h-2V7h2v10z"/>
    </svg>
  ),
  Implications: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  Actions: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  ),
};

// Default color scheme - Bento Matcha
const DEFAULT_COLOR = 'bg-white border-[#D4E5D4] text-[#4A5D4A]';

// Colors for specific column types - Bento Matcha palette
const COLUMN_COLORS: Record<string, string> = {
  // Pitch columns (first and last get green accent)
  Hook: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  Problem: 'bg-white border-[#D4E5D4] text-[#4A5D4A]',
  Solution: 'bg-[#F5FAF7] border-[#6B8E6B]/60 text-[#6B8E6B]',
  Proof: 'bg-white border-[#D4E5D4] text-[#8FA58F]',
  CTA: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  // Training columns
  Objective: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  Concept: 'bg-white border-[#D4E5D4] text-[#4A5D4A]',
  Example: 'bg-[#F5FAF7] border-[#6B8E6B]/60 text-[#6B8E6B]',
  Practice: 'bg-white border-[#D4E5D4] text-[#8FA58F]',
  Review: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  // Explainer columns
  What: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  Why: 'bg-white border-[#D4E5D4] text-[#4A5D4A]',
  How: 'bg-[#F5FAF7] border-[#6B8E6B]/60 text-[#6B8E6B]',
  Examples: 'bg-white border-[#D4E5D4] text-[#8FA58F]',
  Summary: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  // Brief columns
  Context: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
  'Key Points': 'bg-white border-[#D4E5D4] text-[#4A5D4A]',
  Analysis: 'bg-[#F5FAF7] border-[#6B8E6B]/60 text-[#6B8E6B]',
  Implications: 'bg-white border-[#D4E5D4] text-[#8FA58F]',
  Actions: 'bg-white border-[#6B8E6B] text-[#6B8E6B]',
};

// Descriptions for specific columns
const COLUMN_DESCRIPTIONS: Record<string, string> = {
  // Pitch
  Hook: 'Grab attention',
  Problem: 'Define the pain',
  Solution: 'Your answer',
  Proof: 'Evidence & trust',
  CTA: 'Next steps',
  // Training
  Objective: 'Learning goals',
  Concept: 'Core knowledge',
  Example: 'Illustrations',
  Practice: 'Application',
  Review: 'Reinforcement',
  // Explainer
  What: 'Definition',
  Why: 'Importance',
  How: 'Process',
  Examples: 'Case studies',
  Summary: 'Key takeaways',
  // Brief
  Context: 'Background',
  'Key Points': 'Main findings',
  Analysis: 'Deep dive',
  Implications: 'So what?',
  Actions: 'Next steps',
};

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  name,
  noteCount,
  isActive = false,
}) => {
  // Use fallbacks for unknown column names
  const colorClasses = COLUMN_COLORS[name] || DEFAULT_COLOR;
  const icon = COLUMN_ICONS[name] || DefaultIcon;
  const description = COLUMN_DESCRIPTIONS[name] || '';

  // Calculate fill percentage (max 5 notes per column as suggested capacity)
  const fillPercentage = Math.min((noteCount / 5) * 100, 100);

  return (
    <div
      className={`
        relative px-3 py-2 border rounded-lg text-center
        transition-all duration-200 ease-out
        ${colorClasses}
        ${isActive ? 'ring-1 ring-[#6B8E6B] bg-[#6B8E6B]/[0.08]' : ''}
      `}
    >
      {/* Completion indicator dot */}
      {noteCount > 0 && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="w-full h-full bg-[#6B8E6B]/30 rounded-full" />
          <div className="absolute inset-0.5 bg-[#6B8E6B] rounded-full" />
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <span className="font-bold text-xs uppercase tracking-widest">
          {name}
        </span>
        {noteCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 bg-[#EDF5F0] rounded">
            {noteCount}
          </span>
        )}
      </div>
      <p className="text-xs opacity-50">{description}</p>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EDF5F0] rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-[#6B8E6B]/40 transition-all duration-300"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ColumnHeader;
