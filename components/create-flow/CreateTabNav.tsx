/**
 * CreateTabNav
 *
 * Tab navigation for unified create modal.
 *
 * KISS: Simple tab component < 50 lines
 * SOLID-S: Only handles tab display and click events
 * DRY: Reusable tab interface
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface CreateTab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

interface CreateTabNavProps {
  tabs: CreateTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const CreateTabNav: React.FC<CreateTabNavProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-[#D4E5D4]">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4
              text-sm font-medium transition-all duration-150
              ${isActive
                ? 'text-[#6B8E6B] border-b-2 border-[#6B8E6B] bg-[#EDF5F0]'
                : 'text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#F5FAF7]'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
