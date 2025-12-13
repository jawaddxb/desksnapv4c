/**
 * StatCard Component
 *
 * Reusable stat card for displaying metric with icon and label.
 * Used in analytics and dashboard views.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
    <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
      <Icon className="w-4 h-4" /> {label}
    </div>
    <div className="text-4xl font-black text-zinc-900">{value}</div>
  </div>
);

export default StatCard;
