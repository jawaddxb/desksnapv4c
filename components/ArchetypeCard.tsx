import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ArchetypeInfo } from '@/lib/archetypeCategories';
import { getArchetypeThumbnailPath } from '@/services/thumbnailService';
import { getDecorationConfig } from '@/config/archetypeDecorations';

interface ArchetypeCardProps {
  archetype: ArchetypeInfo;
  isActive: boolean;
  onClick: () => void;
}

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  isActive,
  onClick
}) => {
  const [color1, color2] = archetype.previewColors;
  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`
        relative group flex flex-col items-center justify-center
        w-full aspect-square rounded-xl transition-all duration-200 overflow-hidden
        ${isActive
          ? 'ring-2 ring-zinc-900 ring-offset-2'
          : 'hover:scale-105 hover:shadow-lg'}
      `}
      title={archetype.description}
    >
      {/* Thumbnail image (shown if available) */}
      {!thumbnailError && (
        <img
          src={getArchetypeThumbnailPath(archetype.id)}
          alt={archetype.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setThumbnailError(true)}
        />
      )}

      {/* Fallback: Mini Slide Thumbnail Preview (shown if no thumbnail) */}
      {thumbnailError && (
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`
          }}
        >
          {/* Mini slide content simulation */}
          <div className="flex-1 p-2 flex flex-col justify-center">
            {/* Title bar placeholder */}
            <div
              className="h-1.5 w-3/4 rounded-full mb-1.5 opacity-80"
              style={{
                backgroundColor: getContrastColor(color1)
              }}
            />
            {/* Content lines placeholder */}
            <div
              className="h-1 w-full rounded-full mb-1 opacity-40"
              style={{
                backgroundColor: getContrastColor(color1)
              }}
            />
            <div
              className="h-1 w-2/3 rounded-full opacity-40"
              style={{
                backgroundColor: getContrastColor(color1)
              }}
            />
          </div>

          {/* Decorative element based on archetype style */}
          <ArchetypeDecoration archetypeId={archetype.id} color1={color1} color2={color2} />
        </div>
      )}

      {/* Label overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-4">
        <span className="text-[9px] font-bold uppercase tracking-wider text-white truncate block text-center drop-shadow-sm">
          {archetype.name}
        </span>
      </div>

      {/* Active checkmark */}
      {isActive && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-3 h-3" strokeWidth={3} />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
    </button>
  );
};

// Helper to get contrasting text color
function getContrastColor(bgColor: string): string {
  // Simple check - if it starts with a dark hex or contains dark keywords
  if (bgColor.includes('rgba')) return '#ffffff';
  if (bgColor.startsWith('#')) {
    const hex = bgColor.slice(1);
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#18181b' : '#ffffff';
    }
  }
  return '#ffffff';
}

/**
 * Renders archetype-specific decorative elements.
 * Uses config lookup instead of switch statement for better maintainability.
 */
const ArchetypeDecoration: React.FC<{ archetypeId: string; color1: string; color2: string }> = ({
  archetypeId,
  color1,
  color2
}) => {
  const config = getDecorationConfig(archetypeId);
  if (!config) return null;

  const contrastColor = getContrastColor(color1);
  const opacity = config.opacity ?? 0.5;

  switch (config.type) {
    case 'circle':
      return (
        <div
          className="absolute bottom-2 right-2 w-4 h-4 rounded-full"
          style={{ backgroundColor: contrastColor, opacity }}
        />
      );

    case 'border':
      return (
        <div
          className="absolute inset-2 border"
          style={{ borderColor: contrastColor, opacity }}
        />
      );

    case 'grid':
      return (
        <div className="absolute bottom-2 right-2 grid grid-cols-2 gap-0.5" style={{ opacity }}>
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: contrastColor }} />
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: contrastColor }} />
          <div className="w-2 h-4 rounded-sm col-span-2" style={{ backgroundColor: contrastColor }} />
        </div>
      );

    case 'terminal':
      return (
        <div
          className="absolute bottom-2 left-2 text-[6px] font-mono"
          style={{ color: contrastColor, opacity }}
        >
          {'> _'}
        </div>
      );

    case 'gradient':
      return (
        <div
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{
            background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`,
            opacity,
          }}
        />
      );

    case 'gold-line':
      return (
        <div className="absolute bottom-3 right-3">
          <div
            className="w-3 h-px rotate-45"
            style={{ backgroundColor: config.color ?? '#d4af37', opacity }}
          />
        </div>
      );

    case 'cinema-bars':
      return (
        <>
          <div className="absolute top-0 left-0 right-0 h-2 bg-black" style={{ opacity }} />
          <div className="absolute bottom-6 left-0 right-0 h-2 bg-black" style={{ opacity }} />
        </>
      );

    case 'dots':
      const colors = config.dotColors ?? ['#facc15', '#f472b6', '#22d3ee'];
      return (
        <div className="absolute top-2 right-2 flex gap-0.5">
          {colors.map((dotColor, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: dotColor }}
            />
          ))}
        </div>
      );

    case 'circuit-svg':
      return (
        <div className="absolute bottom-2 right-2" style={{ opacity }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M0 8h6M10 8h6M8 0v6M8 10v6" stroke={contrastColor} strokeWidth="0.5" />
            <circle cx="8" cy="8" r="2" stroke={contrastColor} strokeWidth="0.5" fill="none" />
          </svg>
        </div>
      );

    case 'schematic-svg':
      return (
        <div className="absolute bottom-2 right-2" style={{ opacity }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" stroke={contrastColor} strokeWidth="0.5" strokeDasharray="2 1" fill="none" />
          </svg>
        </div>
      );

    default:
      return null;
  }
};
