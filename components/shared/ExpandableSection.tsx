/**
 * ExpandableSection Component
 *
 * Reusable collapsible section with header and expandable content.
 * Used in sidebars and panels throughout the app.
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

export interface ExpandableSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  icon: Icon,
  children,
  defaultExpanded = true,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`border-t border-[#D4E5D4] bg-[#F5FAF7] ${className}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-[#8FA58F] hover:text-[#1E2E1E] transition-colors duration-150"
      >
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Icon className="w-4 h-4 text-[#6B8E6B]" />
          {title}
        </span>
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
