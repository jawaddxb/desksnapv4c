import React, { useState } from 'react';
import { DesignSystem, generateCSSVariables } from './themes';
import { Copy, Check, Code, Type, Layout, Square, Sparkles } from 'lucide-react';

interface ThemeSwatchProps {
  theme: DesignSystem;
}

/**
 * ThemeSwatch - Displays comprehensive design system information
 * Shows colors, typography, layout style, borders, shadows, and button styles
 */
export const ThemeSwatch: React.FC<ThemeSwatchProps> = ({ theme }) => {
  const [copied, setCopied] = useState<'css' | 'json' | null>(null);

  const handleCopyCSS = () => {
    const vars = generateCSSVariables(theme);
    const css = Object.entries(vars)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');
    const fullCSS = `:root {\n${css}\n}`;
    navigator.clipboard.writeText(fullCSS);
    setCopied('css');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyJSON = () => {
    const json = JSON.stringify(theme, null, 2);
    navigator.clipboard.writeText(json);
    setCopied('json');
    setTimeout(() => setCopied(null), 2000);
  };

  const colorEntries = [
    { label: 'Background', color: theme.colors.background },
    { label: 'Surface', color: theme.colors.surface },
    { label: 'Accent', color: theme.colors.accent },
    { label: 'Text', color: theme.colors.text },
    { label: 'Secondary', color: theme.colors.textSecondary },
    { label: 'Border', color: theme.colors.border },
  ];

  // Get readable font name
  const getFontName = (fontFamily: string) => {
    const match = fontFamily.match(/"([^"]+)"/);
    return match ? match[1] : fontFamily.split(',')[0];
  };

  // Get button style description
  const getButtonStyleDesc = (style: string) => {
    const styles: Record<string, string> = {
      filled: 'Solid filled',
      outline: 'Bordered outline',
      ghost: 'Transparent ghost',
      brutalist: 'Bold offset shadow',
      underline: 'Text with underline',
      bracket: '[Bracketed text]',
      beveled: '3D beveled',
    };
    return styles[style] || style;
  };

  // Get layout description
  const getLayoutDesc = (layout: DesignSystem['layout']) => {
    const gridStyles: Record<string, string> = {
      traditional: 'Standard grid',
      bento: 'Bento box grid',
      masonry: 'Masonry columns',
      list: 'Vertical list',
      'single-column': 'Single column',
    };
    return gridStyles[layout.gridStyle] || layout.gridStyle;
  };

  // Check for special effects
  const getEffects = () => {
    const effects: string[] = [];
    if (theme.effects.blur) effects.push('Blur');
    if (theme.effects.grain) effects.push('Grain');
    if (theme.effects.scanlines) effects.push('Scanlines');
    if (theme.effects.dotPattern) effects.push('Dots');
    if (theme.effects.linePattern) effects.push('Lines');
    return effects;
  };

  const effects = getEffects();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900">{theme.name}</h3>
          <span className="px-2 py-0.5 bg-gray-100 rounded-full text-[10px] font-medium text-gray-500">
            {theme.category}
          </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {theme.description}
        </p>
      </div>

      {/* Color Palette */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-3.5 h-3.5 rounded bg-gradient-to-br from-violet-400 to-pink-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Colors</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {colorEntries.map((entry, i) => (
            <div key={i} className="text-center">
              <div
                className="w-full aspect-square rounded-lg border border-gray-100 mb-1.5"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[9px] text-gray-500 block truncate">
                {entry.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <Type className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Typography</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Body Font</span>
            <span className="font-medium text-gray-700" style={{ fontFamily: theme.typography.fontFamily }}>
              {getFontName(theme.typography.fontFamily)}
            </span>
          </div>
          {theme.typography.headingFont !== theme.typography.fontFamily && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Heading Font</span>
              <span className="font-medium text-gray-700" style={{ fontFamily: theme.typography.headingFont }}>
                {getFontName(theme.typography.headingFont)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Base Size</span>
            <span className="text-gray-700">{theme.typography.baseFontSize}</span>
          </div>
          {theme.typography.textTransform !== 'none' && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Transform</span>
              <span className="text-gray-700 capitalize">{theme.typography.textTransform}</span>
            </div>
          )}
        </div>
      </div>

      {/* Layout & Borders */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <Layout className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Layout</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Grid Style</span>
            <span className="text-gray-700">{getLayoutDesc(theme.layout)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Density</span>
            <span className="text-gray-700 capitalize">{theme.layout.density}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Card Style</span>
            <span className="text-gray-700 capitalize">{theme.layout.cardStyle}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Border Radius</span>
            <span className="text-gray-700">{theme.borders.cardRadius}</span>
          </div>
        </div>
      </div>

      {/* Button Style */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-1.5 mb-2">
          <Square className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Buttons</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Style</span>
            <span className="text-gray-700">{getButtonStyleDesc(theme.buttons.style)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Radius</span>
            <span className="text-gray-700">{theme.borders.buttonRadius}</span>
          </div>
        </div>
      </div>

      {/* Special Effects */}
      {effects.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Effects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {effects.map((effect, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-medium rounded"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Copy Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyCSS}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copied === 'css' ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              Copy CSS
            </>
          )}
        </button>
        <button
          onClick={handleCopyJSON}
          className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {copied === 'json' ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy JSON
            </>
          )}
        </button>
      </div>
    </div>
  );
};
