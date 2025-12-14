/**
 * DiagramBlock Component
 *
 * Renders Mermaid diagrams.
 * This component is lazy-loaded to minimize bundle size.
 */

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { DiagramBlock as DiagramBlockType } from '@/types/contentBlocks';
import { getDiagramStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

// Initialize mermaid with default config
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export const DiagramBlock: React.FC<BlockProps<DiagramBlockType>> = ({
  block,
  theme,
  className = '',
}) => {
  const styles = getDiagramStyles(theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!block.mermaid || !containerRef.current) return;

      try {
        // Update mermaid theme based on current theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: styles.nodeBackground,
            primaryTextColor: styles.nodeText,
            primaryBorderColor: styles.nodeBorder,
            lineColor: styles.edgeColor,
            secondaryColor: styles.surface,
            tertiaryColor: styles.labelBackground,
            fontFamily: styles.fontBody,
          },
        });

        const { svg: renderedSvg } = await mermaid.render(
          idRef.current,
          block.mermaid
        );
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
        setSvg('');
      }
    };

    renderDiagram();
  }, [block.mermaid, styles]);

  return (
    <div className={`${className}`}>
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center min-h-[200px] p-4 rounded-lg"
        style={{
          background: styles.surface,
          border: `1px solid ${styles.border}`,
          borderRadius: styles.radius,
        }}
      >
        {error ? (
          <div
            className="text-center p-4"
            style={{ color: styles.secondary }}
          >
            <p className="font-medium mb-2">Unable to render diagram</p>
            <pre
              className="text-xs bg-black/5 p-2 rounded overflow-auto max-w-full"
              style={{ color: styles.text }}
            >
              {block.mermaid}
            </pre>
          </div>
        ) : svg ? (
          <div
            dangerouslySetInnerHTML={{ __html: svg }}
            className="mermaid-diagram"
            style={{
              maxWidth: '100%',
              overflow: 'auto',
            }}
          />
        ) : (
          <div
            className="animate-pulse"
            style={{ color: styles.secondary }}
          >
            Rendering diagram...
          </div>
        )}
      </div>
      {block.caption && (
        <p
          className="text-center text-sm mt-2"
          style={{
            color: styles.secondary,
            fontFamily: styles.fontBody,
          }}
        >
          {block.caption}
        </p>
      )}
    </div>
  );
};

export default DiagramBlock;
