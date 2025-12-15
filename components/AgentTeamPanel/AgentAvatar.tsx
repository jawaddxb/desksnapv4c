/**
 * AgentAvatar Component
 *
 * Displays a comic book-style avatar for an agent with status indicator.
 * Uses Tailwind CSS for all animations (no Framer Motion).
 */

import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { AgentStatus, AgentConfig } from '@/types/agents';

interface AgentAvatarProps {
  config: AgentConfig;
  status: AgentStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onClick?: () => void;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  config,
  status,
  size = 'md',
  showLabel = false,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const labelSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  // Status-based styling
  const statusStyles = {
    idle: 'grayscale opacity-50',
    ready: 'grayscale-0 opacity-70',
    working: 'grayscale-0 opacity-100 animate-pulse',
    done: 'grayscale-0 opacity-100',
    error: 'grayscale-0 opacity-100',
  };

  // Ring colors by status
  const ringStyles = {
    idle: '',
    ready: 'ring-1 ring-gray-300',
    working: `ring-2 ring-offset-1`,
    done: 'ring-2 ring-green-400 ring-offset-1',
    error: 'ring-2 ring-red-400 ring-offset-1',
  };

  // Fallback to initials if image fails to load
  const [imageError, setImageError] = React.useState(false);
  const initials = config.name.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        relative flex flex-col items-center gap-1
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'}
      `}
    >
      {/* Avatar container */}
      <div
        className={`
          relative rounded-lg overflow-hidden
          ${sizeClasses[size]}
          ${statusStyles[status]}
          ${ringStyles[status]}
          transition-all duration-200
        `}
        style={{
          ringColor: status === 'working' ? config.color : undefined,
        }}
      >
        {/* Avatar image or fallback */}
        {!imageError ? (
          <img
            src={config.avatar}
            alt={config.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: config.color }}
          >
            {initials}
          </div>
        )}

        {/* Status badge overlay */}
        <StatusBadge status={status} color={config.color} />
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`
            ${labelSizes[size]} font-medium
            ${status === 'idle' ? 'text-gray-400' : 'text-gray-700'}
          `}
        >
          {config.name}
        </span>
      )}
    </button>
  );
};

/**
 * Status badge shown in the corner of the avatar
 */
const StatusBadge: React.FC<{ status: AgentStatus; color: string }> = ({ status, color }) => {
  if (status === 'idle' || status === 'ready') return null;

  const badgeStyles = {
    working: 'bg-white border-2',
    done: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={`
        absolute -bottom-0.5 -right-0.5
        w-4 h-4 rounded-full
        flex items-center justify-center
        ${badgeStyles[status as keyof typeof badgeStyles]}
      `}
      style={{
        borderColor: status === 'working' ? color : undefined,
      }}
    >
      {status === 'working' && (
        <Loader2 className="w-2.5 h-2.5 animate-spin" style={{ color }} />
      )}
      {status === 'done' && <Check className="w-2.5 h-2.5 text-white" />}
      {status === 'error' && <X className="w-2.5 h-2.5 text-white" />}
    </div>
  );
};

export default AgentAvatar;
