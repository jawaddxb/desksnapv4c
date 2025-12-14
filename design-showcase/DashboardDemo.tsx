import React from 'react';
import { DesignSystem } from './themes';
import {
  Sparkles, FileText, Clock, Plus, ArrowRight, MoreHorizontal,
  Layers, Lightbulb, Edit3, Terminal, Newspaper, Zap
} from 'lucide-react';

interface DashboardDemoProps {
  theme: DesignSystem;
}

// Mock data
const MOCK_ITEMS = [
  { id: '1', title: 'Q4 Strategy Presentation', type: 'deck', slides: 12, updated: '2h ago' },
  { id: '2', title: 'Product Launch Ideas', type: 'ideation', notes: 8, updated: '5h ago' },
  { id: '3', title: 'Marketing Campaign Draft', type: 'draft', slides: 6, updated: '1d ago' },
  { id: '4', title: 'Investor Pitch Deck', type: 'deck', slides: 18, updated: '2d ago' },
];

/**
 * DashboardDemo - Renders differently based on design system
 * Each theme has unique typography, layout, borders, shadows, and button styles
 */
export const DashboardDemo: React.FC<DashboardDemoProps> = ({ theme }) => {
  const hasGradient = !!theme.colors.backgroundGradient;
  const hasBlur = !!theme.effects.blur;
  const hasScanlines = !!theme.effects.scanlines;

  // Base container styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100%',
    padding: theme.layout.containerPadding,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.baseFontSize,
    fontWeight: theme.typography.bodyWeight,
    letterSpacing: theme.typography.letterSpacing,
    lineHeight: theme.typography.lineHeight,
    color: theme.colors.text,
    background: hasGradient ? theme.colors.backgroundGradient : theme.colors.background,
    position: 'relative',
    overflow: 'auto',
  };

  // Card styles based on cardStyle
  const getCardStyle = (isHovered = false): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: theme.layout.cardPadding,
      borderRadius: theme.borders.cardRadius,
      transition: 'all 0.2s ease',
    };

    switch (theme.layout.cardStyle) {
      case 'brutalist':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
        };
      case 'glass':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
          backdropFilter: hasBlur ? `blur(${theme.effects.blur})` : undefined,
          WebkitBackdropFilter: hasBlur ? `blur(${theme.effects.blur})` : undefined,
        };
      case 'neumorphic':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: 'none',
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
        };
      case 'retro':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
          boxShadow: theme.shadows.card,
        };
      case 'flat':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: theme.borders.width !== '0px' ? `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}` : 'none',
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
        };
      case 'bordered':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}`,
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
        };
      case 'elevated':
      default:
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          border: theme.borders.width !== '0px' ? `${theme.borders.width} ${theme.borders.style} ${theme.colors.border}` : 'none',
          boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
        };
    }
  };

  // Button styles based on button style
  const getButtonStyle = (isPrimary = true): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: theme.buttons.padding,
      borderRadius: theme.borders.buttonRadius,
      fontFamily: theme.typography.fontFamily,
      fontWeight: theme.buttons.fontWeight,
      fontSize: theme.typography.baseFontSize,
      textTransform: theme.buttons.textTransform,
      letterSpacing: theme.buttons.textTransform === 'uppercase' ? '0.05em' : theme.typography.letterSpacing,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    };

    switch (theme.buttons.style) {
      case 'brutalist':
        return {
          ...base,
          backgroundColor: isPrimary ? theme.colors.accent : theme.colors.surface,
          color: isPrimary ? theme.colors.accentForeground : theme.colors.text,
          border: `${theme.borders.width} solid ${theme.colors.border}`,
          boxShadow: theme.shadows.button,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: isPrimary ? theme.colors.accent : theme.colors.text,
          border: `${theme.borders.width || '1px'} solid ${isPrimary ? theme.colors.accent : theme.colors.border}`,
          boxShadow: theme.shadows.button,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: isPrimary ? theme.colors.accent : theme.colors.text,
          border: 'none',
        };
      case 'underline':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: isPrimary ? theme.colors.accent : theme.colors.text,
          border: 'none',
          textDecoration: 'underline',
          padding: theme.buttons.padding || '4px 0',
        };
      case 'bracket':
        return {
          ...base,
          backgroundColor: 'transparent',
          color: isPrimary ? theme.colors.accent : theme.colors.text,
          border: `1px dashed ${theme.colors.border}`,
        };
      case 'beveled':
        return {
          ...base,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          border: `${theme.borders.width} solid ${theme.colors.border}`,
          boxShadow: theme.shadows.button,
        };
      case 'filled':
      default:
        return {
          ...base,
          backgroundColor: isPrimary ? theme.colors.accent : theme.colors.surface,
          color: isPrimary ? theme.colors.accentForeground : theme.colors.text,
          border: isPrimary ? 'none' : `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.button,
        };
    }
  };

  // Heading styles
  const headingStyle: React.CSSProperties = {
    fontFamily: theme.typography.headingFont,
    fontWeight: theme.typography.headingWeight,
    fontSize: theme.typography.headingSize,
    letterSpacing: theme.typography.headingLetterSpacing,
    color: theme.colors.text,
    textTransform: theme.typography.textTransform,
    margin: 0,
  };

  const subheadingStyle: React.CSSProperties = {
    ...headingStyle,
    fontSize: `calc(${theme.typography.headingSize} * 0.6)`,
  };

  // Grid layout based on gridStyle
  const getGridStyle = (): React.CSSProperties => {
    switch (theme.layout.gridStyle) {
      case 'bento':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'minmax(120px, auto)',
          gap: theme.layout.gap,
        };
      case 'list':
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: theme.layout.gap,
        };
      case 'single-column':
        return {
          display: 'flex',
          flexDirection: 'column',
          gap: theme.layout.gap,
          maxWidth: '720px',
        };
      case 'masonry':
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: theme.layout.gap,
        };
      case 'traditional':
      default:
        return {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: theme.layout.gap,
        };
    }
  };

  // Render button text based on style
  const renderButtonText = (text: string, icon?: React.ReactNode) => {
    if (theme.buttons.style === 'bracket') {
      return <>[{text}]</>;
    }
    return (
      <>
        {icon}
        {text}
      </>
    );
  };

  // Terminal-specific prefix
  const getPrefix = () => {
    if (theme.id === 'terminal-hacker') {
      return <span style={{ color: theme.colors.accent }}>{'> '}</span>;
    }
    return null;
  };

  return (
    <div style={containerStyle}>
      {/* Scanlines overlay for cyberpunk/terminal */}
      {hasScanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: theme.layout.density === 'spacious' ? '48px' : theme.layout.density === 'compact' ? '16px' : '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={headingStyle}>
            {getPrefix()}
            {theme.id === 'terminal-hacker' ? 'DASHBOARD_v2.4.1' :
             theme.id === 'newsprint' ? 'THE DAILY DECK' :
             theme.id === 'editorial-luxury' ? 'Welcome' :
             'Welcome back'}
          </h1>
          <button style={getButtonStyle(true)}>
            {renderButtonText(
              theme.id === 'terminal-hacker' ? 'new --create' : 'New Presentation',
              theme.buttons.style !== 'bracket' && theme.buttons.style !== 'underline' ? <Plus style={{ width: 16, height: 16 }} /> : null
            )}
          </button>
        </div>
        <p style={{ color: theme.colors.textSecondary, margin: 0 }}>
          {theme.id === 'terminal-hacker' ? '// Select operation or create new instance' :
           theme.id === 'newsprint' ? 'All the presentations fit to print' :
           'Pick up where you left off, or start something new.'}
        </p>
      </div>

      {/* Primary CTAs - Only for non-list layouts */}
      {theme.layout.gridStyle !== 'list' && theme.layout.gridStyle !== 'single-column' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: theme.layout.gap, marginBottom: theme.layout.density === 'spacious' ? '48px' : '24px' }}>
          {/* Start Fresh Card */}
          <div style={getCardStyle()}>
            <div
              style={{
                width: theme.layout.density === 'compact' ? '36px' : '48px',
                height: theme.layout.density === 'compact' ? '36px' : '48px',
                borderRadius: theme.borders.radius,
                backgroundColor: `${theme.colors.accent}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Sparkles style={{ width: 24, height: 24, color: theme.colors.accent }} />
            </div>
            <h3 style={{ ...subheadingStyle, marginBottom: '8px' }}>
              {theme.id === 'terminal-hacker' ? './create_new' : 'Start Fresh'}
            </h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: '16px', fontSize: `calc(${theme.typography.baseFontSize} * 0.9)` }}>
              {theme.id === 'terminal-hacker' ? 'Initialize new presentation instance' : 'Describe your topic and AI will create a beautiful presentation'}
            </p>
            <button style={getButtonStyle(false)}>
              {renderButtonText('Get started', <ArrowRight style={{ width: 16, height: 16 }} />)}
            </button>
          </div>

          {/* Brainstorm Card */}
          <div style={getCardStyle()}>
            <div
              style={{
                width: theme.layout.density === 'compact' ? '36px' : '48px',
                height: theme.layout.density === 'compact' ? '36px' : '48px',
                borderRadius: theme.borders.radius,
                backgroundColor: `${theme.colors.accent}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Lightbulb style={{ width: 24, height: 24, color: theme.colors.accent }} />
            </div>
            <h3 style={{ ...subheadingStyle, marginBottom: '8px' }}>
              {theme.id === 'terminal-hacker' ? './ideate --mode=brainstorm' : 'Brainstorm First'}
            </h3>
            <p style={{ color: theme.colors.textSecondary, marginBottom: '16px', fontSize: `calc(${theme.typography.baseFontSize} * 0.9)` }}>
              {theme.id === 'terminal-hacker' ? 'Execute ideation subroutine' : 'Explore ideas with AI before committing to a structure'}
            </p>
            <button style={getButtonStyle(false)}>
              {renderButtonText('Start ideating', <ArrowRight style={{ width: 16, height: 16 }} />)}
            </button>
          </div>
        </div>
      )}

      {/* Recent Work Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ ...subheadingStyle, fontSize: `calc(${theme.typography.headingSize} * 0.5)` }}>
            {getPrefix()}
            {theme.id === 'terminal-hacker' ? 'RECENT_FILES' :
             theme.id === 'newsprint' ? 'LATEST EDITIONS' :
             'Recent Work'}
          </h2>
          <button style={getButtonStyle(false)}>
            {renderButtonText('View all')}
          </button>
        </div>

        {/* Work Items */}
        <div style={getGridStyle()}>
          {MOCK_ITEMS.map((item, index) => {
            // For bento grid, make first item span 2 columns
            const isBento = theme.layout.gridStyle === 'bento';
            const isFirst = index === 0;

            return (
              <div
                key={item.id}
                style={{
                  ...getCardStyle(),
                  ...(isBento && isFirst ? { gridColumn: 'span 2', gridRow: 'span 2' } : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: theme.layout.density === 'compact' ? '32px' : '40px',
                      height: theme.layout.density === 'compact' ? '32px' : '40px',
                      borderRadius: theme.borders.radius,
                      backgroundColor: `${theme.colors.accent}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.type === 'deck' && <Layers style={{ width: 20, height: 20, color: theme.colors.accent }} />}
                    {item.type === 'ideation' && <Lightbulb style={{ width: 20, height: 20, color: theme.colors.accent }} />}
                    {item.type === 'draft' && <Edit3 style={{ width: 20, height: 20, color: theme.colors.accent }} />}
                  </div>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      color: theme.colors.textMuted,
                      opacity: 0.5,
                    }}
                  >
                    <MoreHorizontal style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                <h4 style={{ fontWeight: theme.typography.bodyWeight + 100, color: theme.colors.text, marginBottom: '8px', fontSize: theme.typography.baseFontSize }}>
                  {getPrefix()}{item.title}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: `calc(${theme.typography.baseFontSize} * 0.85)`, color: theme.colors.textMuted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {item.type === 'ideation' ? (
                      <>
                        <FileText style={{ width: 12, height: 12 }} />
                        {item.notes} notes
                      </>
                    ) : (
                      <>
                        <Layers style={{ width: 12, height: 12 }} />
                        {item.slides} slides
                      </>
                    )}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: 12, height: 12 }} />
                    {item.updated}
                  </span>
                </div>

                {/* Type Badge */}
                <div style={{ marginTop: '12px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: theme.typography.bodyWeight + 100,
                      borderRadius: theme.borders.radius,
                      backgroundColor: `${theme.colors.accent}15`,
                      color: theme.colors.accent,
                      textTransform: theme.typography.textTransform,
                    }}
                  >
                    {item.type === 'deck' ? 'Presentation' : item.type === 'ideation' ? 'Ideation' : 'Draft'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ ...getCardStyle(), marginTop: theme.layout.gap, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {[
            { label: theme.id === 'terminal-hacker' ? 'DECKS' : 'Presentations', value: '12' },
            { label: theme.id === 'terminal-hacker' ? 'IDEAS' : 'Ideations', value: '5' },
            { label: theme.id === 'terminal-hacker' ? 'DRAFTS' : 'Drafts', value: '3' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div style={{ width: '1px', height: '32px', backgroundColor: theme.colors.border }} />
              )}
              <div>
                <p style={{ fontSize: `calc(${theme.typography.headingSize} * 0.7)`, fontWeight: theme.typography.headingWeight, color: theme.colors.text, margin: 0 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: `calc(${theme.typography.baseFontSize} * 0.8)`, color: theme.colors.textMuted, margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap style={{ width: 16, height: 16, color: theme.colors.accent }} />
          <span style={{ fontSize: `calc(${theme.typography.baseFontSize} * 0.9)`, color: theme.colors.textSecondary }}>
            {theme.id === 'terminal-hacker' ? 'PRO_LICENSE_ACTIVE' : 'Pro Plan Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
